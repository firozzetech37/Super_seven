-- Phase 3: localities (towns and grounds inside a district) for the map's fourth tap.
-- Run in the Supabase SQL Editor after 20261029000000_init.sql. Safe to re-run.

create table if not exists public.localities (
  id uuid primary key default gen_random_uuid(),
  state_code text not null references public.states (code),
  district_id uuid references public.districts (id),
  district_slug text not null,
  name text not null,
  slug text not null,
  status public.district_status not null default 'not_reached',
  association_id uuid references public.associations (id),
  association_name text,
  teams_count integer check (teams_count >= 0),
  players_count integer check (players_count >= 0),
  ground_name text,
  ground_address text,
  lat double precision check (lat between -90 and 90),
  lng double precision check (lng between -180 and 180),
  contact_name text,
  contact_phone text,
  contact_email text,
  next_fixture text,
  is_sample boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (state_code, district_slug, slug)
);
drop trigger if exists localities_updated_at on public.localities;
create trigger localities_updated_at before update on public.localities
  for each row execute function public.set_updated_at();

alter table public.localities enable row level security;
drop policy if exists "public read localities" on public.localities;
create policy "public read localities" on public.localities for select to anon, authenticated using (true);
drop policy if exists "admin all localities" on public.localities;
create policy "admin all localities" on public.localities for all to authenticated using (public.is_admin()) with check (public.is_admin());
grant select on public.localities to anon, authenticated;
grant select, insert, update, delete on public.localities to authenticated;

-- Seed: the Hooghly sample from the concept, flagged is_sample so the site labels it.
insert into public.localities (state_code, district_id, district_slug, name, slug, status, association_name, teams_count, players_count, ground_name, ground_address, lat, lng, contact_name, contact_email, next_fixture, is_sample)
select 'WB', d.id, 'hooghly', v.name, v.slug, v.status::public.district_status, v.assoc, v.teams, v.players, v.ground, v.address, v.lat, v.lng, v.contact, v.email, v.fixture, true
from (values
  ('Chandannagar', 'chandannagar', 'onboarded', null, null, null, null, null, null, null, null, null, null),
  ('Chinsurah', 'chinsurah', 'onboarded', null, null, null, null, null, null, null, null, null, null),
  ('Serampore', 'serampore', 'in_discussion', null, null, null, null, null, null, null, null, null, null),
  ('Uttarpara', 'uttarpara', 'not_reached', null, null, null, null, null, null, null, null, null, null),
  ('Dankuni', 'dankuni', 'onboarded', 'Hooghly District Super Seven Association', 6, 84, 'Dankuni ground (to confirm)', 'Dankuni, Hooghly, West Bengal', 22.6806, 88.2906, 'Name to be added', 'coo@sscfi.org', 'District Cup, date to be announced'),
  ('Singur', 'singur', 'not_reached', null, null, null, null, null, null, null, null, null, null),
  ('Tarakeswar', 'tarakeswar', 'not_reached', null, null, null, null, null, null, null, null, null, null),
  ('Arambagh', 'arambagh', 'in_discussion', null, null, null, null, null, null, null, null, null, null)
) as v(name, slug, status, assoc, teams, players, ground, address, lat, lng, contact, email, fixture)
cross join (select id from public.districts where state_code = 'WB' and slug = 'hooghly') d
on conflict (state_code, district_slug, slug) do nothing;
