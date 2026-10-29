-- SSCFI Phase 2 schema: submissions, approvals, player IDs, fixtures, results, map status.
-- Run once in the Supabase SQL Editor (or `supabase db push`). Safe to re-run: everything is "if not exists".

create extension if not exists pgcrypto;

-- ---------------------------------------------------------------------------
-- Enumerated types
-- ---------------------------------------------------------------------------
do $$ begin
  create type public.submission_status as enum ('pending', 'approved', 'rejected');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.district_status as enum ('not_reached', 'in_discussion', 'onboarded');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.player_category as enum ('junior', 'senior', 'women', 'corporate');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.gender as enum ('male', 'female', 'other');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.enquiry_type as enum ('general', 'corporate', 'careers', 'press');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.enquiry_status as enum ('new', 'replied', 'closed');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.subscriber_status as enum ('pending', 'confirmed', 'unsubscribed');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.fixture_stage as enum ('league', 'quarter', 'semi', 'third', 'final', 'friendly');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.fixture_status as enum ('scheduled', 'live', 'completed', 'walkover', 'abandoned');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.match_winner as enum ('a', 'b', 'tie');
exception when duplicate_object then null; end $$;

-- ---------------------------------------------------------------------------
-- Helpers
-- ---------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

-- Admins: anyone whose sign-in email is in this table. Insert your own email after signing in once.
create table if not exists public.admins (
  email text primary key check (email = lower(email)),
  name text,
  created_at timestamptz not null default now()
);

create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.admins
    where email = lower(coalesce(auth.jwt() ->> 'email', ''))
  );
$$;

-- ---------------------------------------------------------------------------
-- Reference: states and districts (the map reads district status from here)
-- ---------------------------------------------------------------------------
create table if not exists public.states (
  code text primary key,
  name text not null unique,
  slug text not null unique
);

create table if not exists public.districts (
  id uuid primary key default gen_random_uuid(),
  state_code text not null references public.states (code),
  name text not null,
  slug text not null,
  status public.district_status not null default 'not_reached',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (state_code, slug)
);
drop trigger if exists districts_updated_at on public.districts;
create trigger districts_updated_at before update on public.districts
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- Registrations (district associations, teams, players) and enquiries
-- ---------------------------------------------------------------------------
create table if not exists public.associations (
  id uuid primary key default gen_random_uuid(),
  reference text not null unique,
  association_name text not null,
  registration_number text not null,
  state_code text not null references public.states (code),
  district_name text not null,
  district_id uuid references public.districts (id),
  contact_person text not null,
  designation text not null,
  phone text not null,
  email text not null,
  address text not null,
  teams_count integer not null default 0 check (teams_count >= 0),
  players_count integer not null default 0 check (players_count >= 0),
  certificate_path text,
  certificate_name text,
  certificate_size integer,
  certificate_type text,
  status public.submission_status not null default 'pending',
  review_note text,
  reviewed_by text,
  reviewed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
drop trigger if exists associations_updated_at on public.associations;
create trigger associations_updated_at before update on public.associations
  for each row execute function public.set_updated_at();

create table if not exists public.teams (
  id uuid primary key default gen_random_uuid(),
  reference text not null unique,
  team_name text not null,
  city text not null,
  state_code text not null references public.states (code),
  district_id uuid references public.districts (id),
  association_id uuid references public.associations (id),
  captain_name text not null,
  captain_mobile text not null,
  vice_captain_name text not null,
  squad text[] not null check (cardinality(squad) = 12),
  coach_name text not null,
  coach_contact text not null,
  previous_tournaments text,
  status public.submission_status not null default 'pending',
  review_note text,
  reviewed_by text,
  reviewed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
drop trigger if exists teams_updated_at on public.teams;
create trigger teams_updated_at before update on public.teams
  for each row execute function public.set_updated_at();

create table if not exists public.players (
  id uuid primary key default gen_random_uuid(),
  reference text not null unique,
  player_id text unique,                 -- issued on approval, e.g. 00001-WB
  serial integer,
  full_name text not null,
  guardian_name text not null,
  email text not null,
  mobile text not null,
  dob date not null,
  gender public.gender not null,
  address text not null,
  pincode text not null check (pincode ~ '^\d{6}$'),
  city text not null,
  state_code text not null references public.states (code),
  category public.player_category not null,
  batting_style text not null check (batting_style in ('right', 'left')),
  bowling_style text not null check (bowling_style in (
    'right-arm fast', 'right-arm medium', 'right-arm spin',
    'left-arm fast', 'left-arm medium', 'left-arm spin', 'none')),
  club text,
  guardian_consent boolean not null default false,
  team_id uuid references public.teams (id),
  status public.submission_status not null default 'pending',
  review_note text,
  reviewed_by text,
  reviewed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists players_state_status_idx on public.players (state_code, status);
drop trigger if exists players_updated_at on public.players;
create trigger players_updated_at before update on public.players
  for each row execute function public.set_updated_at();

-- One counter per state so IDs run 00001-WB, 00002-WB, ...
create table if not exists public.player_counters (
  state_code text primary key references public.states (code),
  last_serial integer not null default 0
);

-- Approve a player and issue the next ID for their state, atomically.
create or replace function public.issue_player_id(p_player uuid, p_reviewer text default null)
returns text language plpgsql security definer set search_path = public as $$
declare
  v_state text;
  v_existing text;
  v_serial integer;
  v_id text;
begin
  select state_code, player_id into v_state, v_existing
  from public.players where id = p_player for update;
  if v_state is null then
    raise exception 'player % not found', p_player;
  end if;
  if v_existing is not null then
    return v_existing;
  end if;

  insert into public.player_counters (state_code, last_serial) values (v_state, 1)
  on conflict (state_code) do update set last_serial = public.player_counters.last_serial + 1
  returning last_serial into v_serial;

  v_id := lpad(v_serial::text, 5, '0') || '-' || v_state;

  update public.players
  set player_id = v_id, serial = v_serial, status = 'approved',
      reviewed_by = coalesce(p_reviewer, reviewed_by), reviewed_at = now()
  where id = p_player;

  return v_id;
end $$;

create table if not exists public.enquiries (
  id uuid primary key default gen_random_uuid(),
  reference text not null unique,
  name text not null,
  mobile text not null,
  email text not null,
  type public.enquiry_type not null default 'general',
  role text,
  message text not null,
  status public.enquiry_status not null default 'new',
  note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
drop trigger if exists enquiries_updated_at on public.enquiries;
create trigger enquiries_updated_at before update on public.enquiries
  for each row execute function public.set_updated_at();

create table if not exists public.subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null unique check (email = lower(email)),
  status public.subscriber_status not null default 'pending',
  token uuid not null default gen_random_uuid(),
  confirmed_at timestamptz,
  unsubscribed_at timestamptz,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Tournaments, fixtures and results (ticker, fixtures page, league tables)
-- ---------------------------------------------------------------------------
create table if not exists public.tournaments (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  short_name text,
  city text,
  state_code text references public.states (code),
  venue text,
  season text,
  start_date date,
  end_date date,
  format text,
  notes text,
  is_sample boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.fixtures (
  id uuid primary key default gen_random_uuid(),
  tournament_id uuid not null references public.tournaments (id) on delete cascade,
  stage public.fixture_stage not null default 'league',
  group_name text,
  match_no integer,
  label text,
  team_a text not null,
  team_b text not null,
  match_date date,
  match_time time,
  venue text,
  status public.fixture_status not null default 'scheduled',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists fixtures_date_idx on public.fixtures (match_date);
create index if not exists fixtures_tournament_idx on public.fixtures (tournament_id, stage);
drop trigger if exists fixtures_updated_at on public.fixtures;
create trigger fixtures_updated_at before update on public.fixtures
  for each row execute function public.set_updated_at();

create table if not exists public.results (
  fixture_id uuid primary key references public.fixtures (id) on delete cascade,
  score_a integer check (score_a >= 0),
  wickets_a integer check (wickets_a between 0 and 7),
  overs_a numeric(3,1),
  score_b integer check (score_b >= 0),
  wickets_b integer check (wickets_b between 0 and 7),
  overs_b numeric(3,1),
  winner public.match_winner,
  margin text,
  man_of_match text,
  notes text,
  updated_at timestamptz not null default now()
);
drop trigger if exists results_updated_at on public.results;
create trigger results_updated_at before update on public.results
  for each row execute function public.set_updated_at();

-- Next five fixtures for the ticker.
create or replace view public.upcoming_fixtures with (security_invoker = true) as
  select f.id, f.label, f.team_a, f.team_b, f.match_date, f.match_time, f.venue, f.stage,
         t.slug as tournament_slug, t.name as tournament_name, t.city, t.is_sample
  from public.fixtures f
  join public.tournaments t on t.id = f.tournament_id
  where f.status in ('scheduled', 'live') and (f.match_date is null or f.match_date >= current_date)
  order by f.match_date nulls last, f.match_time nulls last
  limit 5;

-- League standings computed from results: win 2 points, tie 1, walkover counts as a win.
create or replace view public.league_standings with (security_invoker = true) as
  with games as (
    select f.tournament_id, f.group_name, f.team_a as team,
           r.winner = 'a' as won, r.winner = 'b' as lost, r.winner = 'tie' as tied,
           coalesce(r.score_a, 0) as runs_for, coalesce(r.score_b, 0) as runs_against
    from public.fixtures f join public.results r on r.fixture_id = f.id
    where f.stage = 'league' and f.status in ('completed', 'walkover')
    union all
    select f.tournament_id, f.group_name, f.team_b,
           r.winner = 'b', r.winner = 'a', r.winner = 'tie',
           coalesce(r.score_b, 0), coalesce(r.score_a, 0)
    from public.fixtures f join public.results r on r.fixture_id = f.id
    where f.stage = 'league' and f.status in ('completed', 'walkover')
  )
  select tournament_id, group_name, team,
         count(*)::int as played,
         count(*) filter (where won)::int as won,
         count(*) filter (where lost)::int as lost,
         count(*) filter (where tied)::int as tied,
         (count(*) filter (where won) * 2 + count(*) filter (where tied))::int as points,
         sum(runs_for)::int as runs_for,
         sum(runs_against)::int as runs_against
  from games
  group by tournament_id, group_name, team;

-- ---------------------------------------------------------------------------
-- Public, column-limited views (the only way the public reads people data)
-- ---------------------------------------------------------------------------
-- Owner's privileges on purpose: it exposes four safe columns of approved players and nothing else.
create or replace view public.player_directory as
  select player_id, full_name as name, state_code, category
  from public.players
  where status = 'approved' and player_id is not null;

create or replace view public.public_teams as
  select t.id, t.team_name, t.city, t.state_code, d.name as district
  from public.teams t left join public.districts d on d.id = t.district_id
  where t.status = 'approved';

-- ---------------------------------------------------------------------------
-- Row-level security
-- ---------------------------------------------------------------------------
alter table public.admins enable row level security;
alter table public.states enable row level security;
alter table public.districts enable row level security;
alter table public.associations enable row level security;
alter table public.teams enable row level security;
alter table public.players enable row level security;
alter table public.player_counters enable row level security;
alter table public.enquiries enable row level security;
alter table public.subscribers enable row level security;
alter table public.tournaments enable row level security;
alter table public.fixtures enable row level security;
alter table public.results enable row level security;

-- Public reference data
drop policy if exists "public read states" on public.states;
create policy "public read states" on public.states for select to anon, authenticated using (true);
drop policy if exists "public read districts" on public.districts;
create policy "public read districts" on public.districts for select to anon, authenticated using (true);
drop policy if exists "public read tournaments" on public.tournaments;
create policy "public read tournaments" on public.tournaments for select to anon, authenticated using (true);
drop policy if exists "public read fixtures" on public.fixtures;
create policy "public read fixtures" on public.fixtures for select to anon, authenticated using (true);
drop policy if exists "public read results" on public.results;
create policy "public read results" on public.results for select to anon, authenticated using (true);

-- Admins (signed-in users listed in admins) can do everything; the site server uses the secret key.
do $$
declare t text;
begin
  foreach t in array array['admins','states','districts','associations','teams','players','player_counters',
                           'enquiries','subscribers','tournaments','fixtures','results']
  loop
    execute format('drop policy if exists "admin all %1$s" on public.%1$I', t);
    execute format('create policy "admin all %1$s" on public.%1$I for all to authenticated using (public.is_admin()) with check (public.is_admin())', t);
  end loop;
end $$;

-- Explicit grants (Supabase applies equivalent defaults; stated here so the migration stands on its own).
grant usage on schema public to anon, authenticated;
grant select on public.states, public.districts, public.tournaments, public.fixtures, public.results to anon, authenticated;
grant select, insert, update, delete on public.admins, public.states, public.districts, public.associations, public.teams,
  public.players, public.player_counters, public.enquiries, public.subscribers, public.tournaments, public.fixtures, public.results
  to authenticated;
grant execute on function public.is_admin() to anon, authenticated;
grant execute on function public.issue_player_id(uuid, text) to authenticated;

-- Lock the base tables that hold personal data; only the views below are readable.
revoke all on public.players, public.teams, public.associations, public.enquiries, public.subscribers, public.player_counters from anon;
grant select on public.player_directory, public.public_teams, public.upcoming_fixtures, public.league_standings to anon, authenticated;

-- ---------------------------------------------------------------------------
-- Storage: private bucket for district association certificates
-- ---------------------------------------------------------------------------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('certificates', 'certificates', false, 5242880, array['application/pdf', 'image/jpeg', 'image/png'])
on conflict (id) do nothing;

drop policy if exists "admins read certificates" on storage.objects;
create policy "admins read certificates" on storage.objects
  for select to authenticated using (bucket_id = 'certificates' and public.is_admin());

-- ---------------------------------------------------------------------------
-- Seed: states and union territories
-- ---------------------------------------------------------------------------
insert into public.states (code, name, slug) values
  ('AN', 'Andaman and Nicobar Islands', 'andaman-and-nicobar-islands'),
  ('AP', 'Andhra Pradesh', 'andhra-pradesh'),
  ('AR', 'Arunachal Pradesh', 'arunachal-pradesh'),
  ('AS', 'Assam', 'assam'),
  ('BR', 'Bihar', 'bihar'),
  ('CH', 'Chandigarh', 'chandigarh'),
  ('CG', 'Chhattisgarh', 'chhattisgarh'),
  ('DD', 'Dadra and Nagar Haveli and Daman and Diu', 'dadra-and-nagar-haveli-and-daman-and-diu'),
  ('DL', 'Delhi', 'delhi'),
  ('GA', 'Goa', 'goa'),
  ('GJ', 'Gujarat', 'gujarat'),
  ('HR', 'Haryana', 'haryana'),
  ('HP', 'Himachal Pradesh', 'himachal-pradesh'),
  ('JK', 'Jammu and Kashmir', 'jammu-and-kashmir'),
  ('JH', 'Jharkhand', 'jharkhand'),
  ('KA', 'Karnataka', 'karnataka'),
  ('KL', 'Kerala', 'kerala'),
  ('LA', 'Ladakh', 'ladakh'),
  ('LD', 'Lakshadweep', 'lakshadweep'),
  ('MP', 'Madhya Pradesh', 'madhya-pradesh'),
  ('MH', 'Maharashtra', 'maharashtra'),
  ('MN', 'Manipur', 'manipur'),
  ('ML', 'Meghalaya', 'meghalaya'),
  ('MZ', 'Mizoram', 'mizoram'),
  ('NL', 'Nagaland', 'nagaland'),
  ('OD', 'Odisha', 'odisha'),
  ('PY', 'Puducherry', 'puducherry'),
  ('PB', 'Punjab', 'punjab'),
  ('RJ', 'Rajasthan', 'rajasthan'),
  ('SK', 'Sikkim', 'sikkim'),
  ('TN', 'Tamil Nadu', 'tamil-nadu'),
  ('TS', 'Telangana', 'telangana'),
  ('TR', 'Tripura', 'tripura'),
  ('UP', 'Uttar Pradesh', 'uttar-pradesh'),
  ('UK', 'Uttarakhand', 'uttarakhand'),
  ('WB', 'West Bengal', 'west-bengal')
on conflict (code) do nothing;

-- Seed: West Bengal's 23 districts. Status starts at not_reached; the admin screen updates it.
insert into public.districts (state_code, name, slug) values
  ('WB', 'Alipurduar', 'alipurduar'),
  ('WB', 'Bankura', 'bankura'),
  ('WB', 'Birbhum', 'birbhum'),
  ('WB', 'Cooch Behar', 'cooch-behar'),
  ('WB', 'Dakshin Dinajpur', 'dakshin-dinajpur'),
  ('WB', 'Darjeeling', 'darjeeling'),
  ('WB', 'Hooghly', 'hooghly'),
  ('WB', 'Howrah', 'howrah'),
  ('WB', 'Jalpaiguri', 'jalpaiguri'),
  ('WB', 'Jhargram', 'jhargram'),
  ('WB', 'Kalimpong', 'kalimpong'),
  ('WB', 'Kolkata', 'kolkata'),
  ('WB', 'Malda', 'malda'),
  ('WB', 'Murshidabad', 'murshidabad'),
  ('WB', 'Nadia', 'nadia'),
  ('WB', 'North 24 Parganas', 'north-24-parganas'),
  ('WB', 'Paschim Bardhaman', 'paschim-bardhaman'),
  ('WB', 'Paschim Medinipur', 'paschim-medinipur'),
  ('WB', 'Purba Bardhaman', 'purba-bardhaman'),
  ('WB', 'Purba Medinipur', 'purba-medinipur'),
  ('WB', 'Purulia', 'purulia'),
  ('WB', 'South 24 Parganas', 'south-24-parganas'),
  ('WB', 'Uttar Dinajpur', 'uttar-dinajpur')
on conflict (state_code, slug) do nothing;

-- Seed: the 2014 archive tournament with its knockout results (from the official result sheets).
insert into public.tournaments (slug, name, short_name, city, state_code, venue, season, start_date, end_date, format, notes)
values ('ncl-s7-amroha-2014', 'National Cricket League Super 7', 'NCL S7 Amroha 2014', 'Amroha', 'UP',
        'Abbasi Cricket Ground (ACG), Amroha, Uttar Pradesh', '2014', '2014-06-22', '2014-06-25',
        'Eight groups of three by draw; one team per group to the quarter-finals, then semi-finals, third place and the final.',
        '24 teams, 32 matches. A friendly between Secretary XI and President XI opened the tournament on the night of 21 June.')
on conflict (slug) do nothing;

with t as (select id from public.tournaments where slug = 'ncl-s7-amroha-2014'),
seed (stage, match_no, label, team_a, team_b, match_date, match_time, status, score_a, wickets_a, score_b, wickets_b, winner, margin, mom) as (
  values
    ('final'::public.fixture_stage,   32, 'Final',           'Uttar Pradesh (Host)', 'Mumbai',      date '2014-06-25', time '21:00', 'completed'::public.fixture_status, 111, null, 52, null, 'a'::public.match_winner, 'by 59 runs', 'Jitendra'),
    ('semi',    29, 'Semi-final 1',    'Uttar Pradesh (Host)', 'Saurashtra',  date '2014-06-25', time '18:00', 'completed', 123, null, 88, null, 'a', 'by 35 runs', null),
    ('semi',    30, 'Semi-final 2',    'Mumbai',               'NCR (Blue)',  date '2014-06-25', time '19:00', 'completed',  72, null, 71, null, 'a', 'by 1 run', null),
    ('quarter', 25, 'Quarter-final 1', 'Saurashtra',           'Uttar Pradesh', date '2014-06-24', null, 'completed', 88, null, 86, null, 'a', 'by 2 runs', null),
    ('quarter', 26, 'Quarter-final 2', 'Mumbai',               'Uttarakhand', date '2014-06-24', null, 'completed', 74, 3, 70, null, 'a', 'by 7 wickets', null),
    ('quarter', 27, 'Quarter-final 3', 'Uttar Pradesh (Host)', 'NCR (Red)',   date '2014-06-24', null, 'completed', 116, null, 84, 5, 'a', 'by 32 runs', null),
    ('quarter', 28, 'Quarter-final 4', 'NCR (Blue)',           'Delhi',       date '2014-06-24', null, 'completed', 107, null, 99, null, 'a', 'by 8 runs', null),
    ('league',  null, 'League',        'Gujarat',              'Karnataka',   null, null, 'completed', 88, null, 88, null, 'tie', 'Match tied', null)
),
ins as (
  insert into public.fixtures (tournament_id, stage, match_no, label, team_a, team_b, match_date, match_time, status)
  select t.id, s.stage, s.match_no, s.label, s.team_a, s.team_b, s.match_date, s.match_time, s.status
  from seed s cross join t
  where not exists (
    select 1 from public.fixtures f where f.tournament_id = t.id and f.team_a = s.team_a and f.team_b = s.team_b and f.stage = s.stage
  )
  returning id, team_a, team_b, stage
)
insert into public.results (fixture_id, score_a, wickets_a, score_b, wickets_b, winner, margin, man_of_match)
select i.id, s.score_a, s.wickets_a, s.score_b, s.wickets_b, s.winner, s.margin, s.mom
from ins i join seed s on s.team_a = i.team_a and s.team_b = i.team_b and s.stage = i.stage
on conflict (fixture_id) do nothing;
