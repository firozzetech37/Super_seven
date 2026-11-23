-- Website content: news, people, state units, match officials and documents, managed from the admin area
-- (/admin/news, /admin/people, /admin/state-units, /admin/documents).
-- Run once in the Supabase SQL editor. Safe to re-run: every statement is idempotent, and the seed rows
-- (what the website showed before) are only added when they are missing.

create table if not exists public.news_posts (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  kind text not null default 'news' check (kind in ('news', 'announcement', 'newsletter')),
  title text not null,
  summary text not null default '',
  body text,                        -- the full story on /news/<slug>; blank line between paragraphs
  event_date date,
  link text,                        -- optional "Read more" link for a story without a full text
  cover_src text,                   -- public URL, or a /legacy/... path for images shipped with the site
  cover_alt text,
  cover_path text,                  -- object path in the media bucket for an uploaded cover
  featured boolean not null default false,
  archive boolean not null default false,   -- carried over from the 2014 site
  pending boolean not null default false,   -- story confirmed, details to follow
  published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists news_posts_date_idx on public.news_posts (event_date desc nulls first, created_at desc);

create table if not exists public.people (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  section text not null check (section in ('leadership', 'office_bearer', 'advisory', 'committee', 'core')),
  name text,                        -- may be empty for a leadership seat ("Name to be added")
  role text not null,
  state text,
  photo_src text,
  photo_path text,
  emails text[] not null default '{}',
  phones text[] not null default '{}',
  email_suggested boolean not null default false,
  linkedin text,
  address text,
  from_2014 boolean not null default false, -- as published on the 2014 site, not yet confirmed
  published boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists people_section_order_idx on public.people (section, sort_order);

create table if not exists public.state_units (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  state text not null,
  code text not null,
  officials jsonb not null default '[]'::jsonb check (jsonb_typeof(officials) = 'array'), -- [{ "role": "President", "name": "…" }]
  published boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.match_officials (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  role text not null,
  state text,
  photo_src text,
  photo_path text,
  published boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.documents (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  description text not null default '',
  category text not null check (category in ('rules', 'forms', 'fixtures', 'results', 'officials')),
  year integer check (year between 1990 and 2100),
  edition text,                     -- shown instead of the year when there is none, e.g. "Official text"
  pages integer check (pages > 0),
  file_src text not null,           -- public URL, or a /documents/... path for files shipped with the site
  file_path text,                   -- object path in the documents bucket for an uploaded PDF
  file_size bigint,
  featured boolean not null default false,  -- wide navy card at the top of its category
  read_href text,                   -- "Read online" link on the featured card
  published boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

do $$
declare t text;
begin
  foreach t in array array['news_posts', 'people', 'state_units', 'match_officials', 'documents']
  loop
    execute format('drop trigger if exists %1$s_updated_at on public.%1$I', t);
    execute format('create trigger %1$s_updated_at before update on public.%1$I for each row execute function public.set_updated_at()', t);
  end loop;
end $$;

-- Reorder helper for the lists with a manual order (runs as the caller, so row security applies).
create or replace function public.reorder_content(p_table text, p_ids uuid[])
returns void language plpgsql as $$
begin
  if p_table not in ('people', 'state_units', 'match_officials', 'documents') then
    raise exception 'reorder_content: unknown table %', p_table;
  end if;
  execute format('update public.%I t set sort_order = x.ord from unnest($1) with ordinality as x(id, ord) where t.id = x.id', p_table) using p_ids;
end $$;

-- Row security: the public sees published rows; admins can do everything.
do $$
declare t text;
begin
  foreach t in array array['news_posts', 'people', 'state_units', 'match_officials', 'documents']
  loop
    execute format('alter table public.%I enable row level security', t);
    execute format('drop policy if exists "public read %1$s" on public.%1$I', t);
    execute format('create policy "public read %1$s" on public.%1$I for select to anon, authenticated using (published)', t);
    execute format('drop policy if exists "admin all %1$s" on public.%1$I', t);
    execute format('create policy "admin all %1$s" on public.%1$I for all to authenticated using (public.is_admin()) with check (public.is_admin())', t);
    execute format('grant select on public.%I to anon, authenticated', t);
    execute format('grant insert, update, delete on public.%I to authenticated', t);
  end loop;
end $$;
grant execute on function public.reorder_content(text, uuid[]) to authenticated;

-- Storage: a public bucket for PDFs (50 MB each, the free plan's limit); only admins can add, change or remove files.
-- News covers and portraits go in the existing "media" bucket.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('documents', 'documents', true, 52428800, array['application/pdf'])
on conflict (id) do update set public = true, file_size_limit = excluded.file_size_limit, allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "admins read documents" on storage.objects;
create policy "admins read documents" on storage.objects for select to authenticated using (bucket_id = 'documents' and public.is_admin());
drop policy if exists "admins add documents" on storage.objects;
create policy "admins add documents" on storage.objects for insert to authenticated with check (bucket_id = 'documents' and public.is_admin());
drop policy if exists "admins change documents" on storage.objects;
create policy "admins change documents" on storage.objects for update to authenticated using (bucket_id = 'documents' and public.is_admin());
drop policy if exists "admins remove documents" on storage.objects;
create policy "admins remove documents" on storage.objects for delete to authenticated using (bucket_id = 'documents' and public.is_admin());

-- ---------------------------------------------------------------------------
-- Seed: what the website showed before (files stay where they are in public/)
-- ---------------------------------------------------------------------------

-- News
insert into public.news_posts (slug, kind, title, summary, body, event_date, link, cover_src, cover_alt, featured, archive, pending, published) values ('17th-youth-national', 'news', '17th Youth National Super Seven Cricket Championship (Under-23)', 'The latest national event for under-23 players. The full story, results and photos follow once SSCFI confirms the details.', null, null, null, '/legacy/slide2.jpg', 'Banner of the 17th Youth National Super Seven Cricket Championship (Under-23) Boys', true, false, true, true) on conflict (slug) do nothing;
insert into public.news_posts (slug, kind, title, summary, body, event_date, link, cover_src, cover_alt, featured, archive, pending, published) values ('ncl-s7-amroha-2014-final', 'news', 'NCL Super 7 Amroha 2014: UP Host win the final', 'Uttar Pradesh (Host) beat Mumbai 111 to 52 at Abbasi Cricket Ground to lift the National Cricket League Super 7. Man of the match: Jitendra.', null, '2014-06-25', '/fixtures#results', '/legacy/match/final-match.jpg', 'The final match of NCL Super 7 2014 at Abbasi Cricket Ground, Amroha', false, true, false, true) on conflict (slug) do nothing;
insert into public.news_posts (slug, kind, title, summary, body, event_date, link, cover_src, cover_alt, featured, archive, pending, published) values ('hyderabad-u23-2014', 'announcement', 'Hyderabad National Cricket League Super 7 (Under 23)', 'The under-23 league in Hyderabad, 24 to 28 September 2014, as announced on the 2014 site.', null, '2014-09-24', null, null, null, false, true, false, true) on conflict (slug) do nothing;

-- People: leadership, office bearers (2014 records) and committee members
insert into public.people (slug, section, name, role, state, photo_src, emails, phones, email_suggested, linkedin, address, from_2014, sort_order) values ('president', 'leadership', 'Firozze Kamaal Abbasi', 'President', null, null, array['president@sscfi.org']::text[], '{}'::text[], true, 'https://www.linkedin.com/in/firozze-kamaal-abbasi', null, false, 1) on conflict (slug) do nothing;
insert into public.people (slug, section, name, role, state, photo_src, emails, phones, email_suggested, linkedin, address, from_2014, sort_order) values ('secretary', 'leadership', null, 'Secretary', null, null, array['secretary@sscfi.org']::text[], '{}'::text[], true, null, null, false, 2) on conflict (slug) do nothing;
insert into public.people (slug, section, name, role, state, photo_src, emails, phones, email_suggested, linkedin, address, from_2014, sort_order) values ('coo', 'leadership', 'Soumendu Kundu', 'Chief Operating Officer', null, null, array['coo@sscfi.org']::text[], '{}'::text[], false, null, null, false, 3) on conflict (slug) do nothing;
insert into public.people (slug, section, name, role, state, photo_src, emails, phones, email_suggested, linkedin, address, from_2014, sort_order) values ('mn-abbasi', 'office_bearer', 'Mr. M. N. Abbasi', 'President', null, '/legacy/photos-1.jpg', array['president@sscfi.in']::text[], array['+91-9810033346']::text[], false, null, 'F-30, Green Park Main, New Delhi 110016', true, 1) on conflict (slug) do nothing;
insert into public.people (slug, section, name, role, state, photo_src, emails, phones, email_suggested, linkedin, address, from_2014, sort_order) values ('feroz-abbasi', 'office_bearer', 'Mr. Feroz Abbasi', 'Senior Vice President', null, '/legacy/photos-2.jpg', array['sr.vicepresident@sscfi.in']::text[], array['+91-9810245768']::text[], false, null, 'Abbasi Cricket Ground (ACG), Amroha, Uttar Pradesh 244221', true, 2) on conflict (slug) do nothing;
insert into public.people (slug, section, name, role, state, photo_src, emails, phones, email_suggested, linkedin, address, from_2014, sort_order) values ('shri-kant-sharma', 'office_bearer', 'Mr. Shri Kant Sharma', 'Secretary General', null, '/legacy/photos-3.jpg', array['secretary@sscfi.in', 'isscosk@gmail.com']::text[], array['+91-9319916335', '+91-8791013599']::text[], false, null, 'T-II-9, Staff Colony, Judges Court Compound, Near Natraj Hotel, Bulandshahr, Uttar Pradesh', true, 3) on conflict (slug) do nothing;
insert into public.people (slug, section, name, role, state, photo_src, emails, phones, email_suggested, linkedin, address, from_2014, sort_order) values ('aslam-farooqui', 'office_bearer', 'Mr. Aslam Farooqui', 'Chairman, Organizing Committee', null, '/legacy/photos-4.jpg', '{}'::text[], '{}'::text[], false, null, null, true, 4) on conflict (slug) do nothing;
insert into public.people (slug, section, name, role, state, photo_src, emails, phones, email_suggested, linkedin, address, from_2014, sort_order) values ('umesh-kumar-goel', 'office_bearer', 'Mr. Umesh Kumar Goel', 'Chairman, Technical Committee', null, '/legacy/photos-5.jpg', '{}'::text[], '{}'::text[], false, null, null, true, 5) on conflict (slug) do nothing;
insert into public.people (slug, section, name, role, state, photo_src, emails, phones, email_suggested, linkedin, address, from_2014, sort_order) values ('nepal-singh', 'office_bearer', 'Mr. Nepal Singh', 'Deputy Chairman, Technical Committee', null, '/legacy/photos-6.jpg', '{}'::text[], '{}'::text[], false, null, null, true, 6) on conflict (slug) do nothing;
insert into public.people (slug, section, name, role, state, photo_src, emails, phones, email_suggested, linkedin, address, from_2014, sort_order) values ('satyapal-singh', 'office_bearer', 'Mr. Satyapal Singh', 'Public Relation Officer', null, '/legacy/photos-7.jpg', '{}'::text[], '{}'::text[], false, null, null, true, 7) on conflict (slug) do nothing;
insert into public.people (slug, section, name, role, state, photo_src, emails, phones, email_suggested, linkedin, address, from_2014, sort_order) values ('pawan-kumar', 'office_bearer', 'Mr. Pawan Kumar', 'Scorer', null, '/legacy/photos-8.jpg', '{}'::text[], '{}'::text[], false, null, null, true, 8) on conflict (slug) do nothing;
insert into public.people (slug, section, name, role, state, photo_src, emails, phones, email_suggested, linkedin, address, from_2014, sort_order) values ('rajesh-sharma', 'office_bearer', 'Mr. Rajesh Sharma', 'Senior Umpire', null, '/legacy/photos-9.jpg', '{}'::text[], '{}'::text[], false, null, null, true, 9) on conflict (slug) do nothing;
insert into public.people (slug, section, name, role, state, photo_src, emails, phones, email_suggested, linkedin, address, from_2014, sort_order) values ('committee-firozze-k-abbasi', 'committee', 'Firozze K. Abbasi', 'President', null, null, '{}'::text[], '{}'::text[], false, null, null, false, 1) on conflict (slug) do nothing;
insert into public.people (slug, section, name, role, state, photo_src, emails, phones, email_suggested, linkedin, address, from_2014, sort_order) values ('core-firozze-k-abbasi', 'core', 'Firozze K. Abbasi', 'President', null, null, '{}'::text[], '{}'::text[], false, null, null, false, 1) on conflict (slug) do nothing;

-- State units (2014 State Officials list) and match officials
insert into public.state_units (slug, state, code, officials, sort_order) values ('punjab', 'Punjab', 'PB', '[{"role":"President","name":"Jasvinder Singh Gill"},{"role":"Hony. General Secretary","name":"Prem Singh"}]'::jsonb, 1) on conflict (slug) do nothing;
insert into public.state_units (slug, state, code, officials, sort_order) values ('andhra-pradesh', 'Andhra Pradesh', 'AP', '[{"role":"President","name":"Jagan Mohan Metla"}]'::jsonb, 2) on conflict (slug) do nothing;
insert into public.state_units (slug, state, code, officials, sort_order) values ('chhattisgarh', 'Chhattisgarh', 'CG', '[{"role":"Secretary","name":"Mohan Kumar"}]'::jsonb, 3) on conflict (slug) do nothing;
insert into public.state_units (slug, state, code, officials, sort_order) values ('delhi', 'Delhi', 'DL', '[{"role":"President","name":"Shyam Sunder"},{"role":"General Secretary","name":"Mrs Rekha Sharma"}]'::jsonb, 4) on conflict (slug) do nothing;
insert into public.state_units (slug, state, code, officials, sort_order) values ('mumbai', 'Mumbai', 'MUM', '[{"role":"President","name":"Madan Singh Parmar"},{"role":"Secretary","name":"Ramdas Chitre"}]'::jsonb, 5) on conflict (slug) do nothing;
insert into public.state_units (slug, state, code, officials, sort_order) values ('bengal', 'Bengal', 'WB', '[{"role":"President","name":"Asim Kr. Niyogi"},{"role":"Hony. General Secretary","name":"Kishan C. Dikpati"}]'::jsonb, 6) on conflict (slug) do nothing;
insert into public.state_units (slug, state, code, officials, sort_order) values ('maharashtra', 'Maharashtra', 'MH', '[{"role":"Secretary","name":"Dr Suraj Yeotikar"}]'::jsonb, 7) on conflict (slug) do nothing;
insert into public.state_units (slug, state, code, officials, sort_order) values ('uttarakhand', 'Uttarakhand', 'UK', '[{"role":"Secretary","name":"Dr Nagendra Sharma"}]'::jsonb, 8) on conflict (slug) do nothing;
insert into public.state_units (slug, state, code, officials, sort_order) values ('gujarat', 'Gujarat', 'GJ', '[{"role":"President","name":"Dipak Mayani"}]'::jsonb, 9) on conflict (slug) do nothing;
insert into public.match_officials (slug, name, role, state, photo_src, sort_order) values ('anil-kumar', 'Anil Kumar', 'Umpire', 'Uttarakhand', '/legacy/umppire_1.jpg', 1) on conflict (slug) do nothing;
insert into public.match_officials (slug, name, role, state, photo_src, sort_order) values ('kuldeep-nagar', 'Kuldeep Nagar', 'Umpire', 'Uttar Pradesh', '/legacy/umppire_2.jpg', 2) on conflict (slug) do nothing;

-- Documents
insert into public.documents (slug, title, description, category, year, edition, pages, file_src, featured, read_href, sort_order) values ('rulebook-english', 'Rules of Super Seven Cricket: English Pocket Rulebook', 'The official rulebook from the Technical Committee: the preface, all forty rules and the glossary. Every translation is made from this text.', 'rules', null, 'Official text', 83, '/documents/sscfi-rulebook-english.pdf', true, '/rules/rulebook?lang=english#reader', 1) on conflict (slug) do nothing;
insert into public.documents (slug, title, description, category, year, edition, pages, file_src, featured, read_href, sort_order) values ('rulebook-multilingual', 'Super Seven Cricket Multilingual Rulebook', 'All forty rules and the glossary in sixteen Indian languages, translated from the English Pocket Rulebook. The translations are under Technical Committee review.', 'rules', 2026, null, 173, '/documents/sscfi-multilingual-rulebook.pdf', true, '/rules/rulebook?lang=hindi#reader', 2) on conflict (slug) do nothing;
insert into public.documents (slug, title, description, category, year, edition, pages, file_src, featured, read_href, sort_order) values ('rules-highlights', 'Highlights: Rules of Super Seven Cricket', 'Seven players, seven overs, pitch and ball sizes and the penalty runs, on one page.', 'rules', 2014, null, 1, '/documents/2014/HIGHLIGHTS-RULES-SUPER-SEVEN-CRICKET.pdf', false, null, 3) on conflict (slug) do nothing;
insert into public.documents (slug, title, description, category, year, edition, pages, file_src, featured, read_href, sort_order) values ('registration-form', 'Registration-cum-Entry Form', 'Paper entry form for state teams: 12 players, manager and coach. Replaced by online registration.', 'forms', 2014, null, 2, '/documents/2014/Registration-Form-SSCFI.pdf', false, null, 4) on conflict (slug) do nothing;
insert into public.documents (slug, title, description, category, year, edition, pages, file_src, featured, read_href, sort_order) values ('state-officials', 'SSCFI State Officials', 'Presidents and secretaries of nine state associations, with photos.', 'officials', 2014, null, 5, '/documents/2014/SSCFI-Team.pdf', false, null, 5) on conflict (slug) do nothing;
insert into public.documents (slug, title, description, category, year, edition, pages, file_src, featured, read_href, sort_order) values ('fixture-2014', 'NCL Super 7 2014 Fixture', 'Eight groups of three teams and the knockout tree for Amroha.', 'fixtures', 2014, null, 2, '/documents/2014/FIXTURE.pdf', false, null, 6) on conflict (slug) do nothing;
insert into public.documents (slug, title, description, category, year, edition, pages, file_src, featured, read_href, sort_order) values ('league-results', 'NCL Super 7 League Match Results', 'All 24 league matches played 22 to 24 June 2014.', 'results', 2014, null, 3, '/documents/2014/NCL-S7-League-Matches-Results.pdf', false, null, 7) on conflict (slug) do nothing;
insert into public.documents (slug, title, description, category, year, edition, pages, file_src, featured, read_href, sort_order) values ('quarter-final-results', 'NCL Super 7 Quarter-Final Results', 'Four quarter-finals with top scorers and man of the match.', 'results', 2014, null, 1, '/documents/2014/NCL-S7-Result-Quarter-Final.pdf', false, null, 8) on conflict (slug) do nothing;
insert into public.documents (slug, title, description, category, year, edition, pages, file_src, featured, read_href, sort_order) values ('semi-final-results', 'NCL Super 7 Semi-Final Results', 'Both semi-finals: UP Host beat Saurashtra, Mumbai beat NCR Blue.', 'results', 2014, null, 1, '/documents/2014/NCL-S7-Result-Sami-Final.pdf', false, null, 9) on conflict (slug) do nothing;
insert into public.documents (slug, title, description, category, year, edition, pages, file_src, featured, read_href, sort_order) values ('final-result', 'NCL Super 7 Final Result', 'UP Host beat Mumbai 111 to 52. Man of the match: Jitendra.', 'results', 2014, null, 1, '/documents/2014/NCL-S7-Result-Final.pdf', false, null, 10) on conflict (slug) do nothing;
