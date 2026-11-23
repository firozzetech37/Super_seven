// Writes supabase/migrations/20261119000000_content.sql: the tables behind the admin's News, People,
// State units & officials and Documents sections, seeded with what was hard-coded in src/lib/data
// (news.ts, people.ts, teams.ts, documents.ts), plus a public "documents" storage bucket for PDFs.
// Usage: node scripts/content/build-content-sql.mjs   (re-run if those files change before the migration is applied)
import fs from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "../..");
const data = (file) => import(path.join(root, "src/lib/data", file));
const { newsItems } = await data("news.ts");
const { leadership, committees, officeBearers2014 } = await data("people.ts");
const { stateUnits, officials } = await data("teams.ts");
const { documents, legacyDocumentBase } = await data("documents.ts");

const q = (v) => (v === undefined || v === null || v === "" ? "null" : `'${String(v).replace(/'/g, "''")}'`);
const arr = (list) => (list?.length ? `array[${list.map(q).join(", ")}]::text[]` : "'{}'::text[]");
const bool = (v) => (v ? "true" : "false");
const slugify = (s) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

const schema = `-- Website content: news, people, state units, match officials and documents, managed from the admin area
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
`;

const lines = ["", "-- ---------------------------------------------------------------------------", "-- Seed: what the website showed before (files stay where they are in public/)", "-- ---------------------------------------------------------------------------", ""];

lines.push("-- News");
for (const n of newsItems) {
  lines.push(
    `insert into public.news_posts (slug, kind, title, summary, body, event_date, link, cover_src, cover_alt, featured, archive, pending, published) values (${q(n.id)}, ${q(n.type)}, ${q(n.title)}, ${q(n.summary)}, ${q(n.body)}, ${q(n.date)}, ${q(n.href)}, ${q(n.cover)}, ${q(n.coverAlt)}, ${bool(n.featured)}, ${bool(n.archive)}, ${bool(n.pending)}, true) on conflict (slug) do nothing;`,
  );
}

const person = (p) =>
  `insert into public.people (slug, section, name, role, state, photo_src, emails, phones, email_suggested, linkedin, address, from_2014, sort_order) values (${q(p.slug)}, ${q(p.section)}, ${q(p.name)}, ${q(p.role)}, ${q(p.state)}, ${q(p.photo)}, ${arr(p.emails)}, ${arr(p.phones)}, ${bool(p.emailSuggested)}, ${q(p.linkedin)}, ${q(p.address)}, ${bool(p.from2014)}, ${p.order}) on conflict (slug) do nothing;`;

lines.push("", "-- People: leadership, office bearers (2014 records) and committee members");
leadership.forEach((p, i) =>
  lines.push(person({ slug: p.id, section: "leadership", name: p.name, role: p.role, photo: p.photo, emails: p.email ? [p.email] : [], phones: p.phone ? [p.phone] : [], emailSuggested: p.emailSuggested, linkedin: p.linkedin, order: i + 1 })),
);
officeBearers2014.forEach((p, i) =>
  lines.push(person({ slug: p.id, section: "office_bearer", name: p.name, role: p.designation, photo: p.photo, emails: p.emails, phones: p.phones, address: p.address, from2014: true, order: i + 1 })),
);
for (const c of committees) {
  c.members.forEach((m, i) => lines.push(person({ slug: `${c.id}-${slugify(m.name)}`, section: c.id, name: m.name, role: m.role, state: m.state, order: i + 1 })));
}

lines.push("", "-- State units (2014 State Officials list) and match officials");
stateUnits.forEach((u, i) =>
  lines.push(
    `insert into public.state_units (slug, state, code, officials, sort_order) values (${q(u.id)}, ${q(u.state)}, ${q(u.code)}, ${q(JSON.stringify(u.officials))}::jsonb, ${i + 1}) on conflict (slug) do nothing;`,
  ),
);
officials.forEach((o, i) =>
  lines.push(
    `insert into public.match_officials (slug, name, role, state, photo_src, sort_order) values (${q(o.id)}, ${q(o.name)}, ${q(o.role)}, ${q(o.state)}, ${q(o.photo)}, ${i + 1}) on conflict (slug) do nothing;`,
  ),
);

lines.push("", "-- Documents");
documents.forEach((d, i) =>
  lines.push(
    `insert into public.documents (slug, title, description, category, year, edition, pages, file_src, featured, read_href, sort_order) values (${q(d.id)}, ${q(d.title)}, ${q(d.description)}, ${q(d.category)}, ${d.year ?? "null"}, ${q(d.edition)}, ${d.pages ?? "null"}, ${q(d.href ?? `${legacyDocumentBase}${d.file}`)}, ${bool(d.featured)}, ${q(d.readHref)}, ${i + 1}) on conflict (slug) do nothing;`,
  ),
);

const out = path.join(root, "supabase/migrations/20261119000000_content.sql");
fs.writeFileSync(out, `${schema}${lines.join("\n")}\n`);
const members = committees.reduce((n, c) => n + c.members.length, 0);
console.log(
  `wrote ${path.relative(root, out)}: ${newsItems.length} news, ${leadership.length + officeBearers2014.length + members} people, ${stateUnits.length} state units, ${officials.length} officials, ${documents.length} documents`,
);
