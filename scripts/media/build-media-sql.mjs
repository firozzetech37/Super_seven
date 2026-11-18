// Writes supabase/migrations/20261118000000_media.sql: the media tables, storage bucket and policies,
// seeded with the gallery that was hard-coded in src/lib/data/gallery.ts (albums, photos, press clippings).
// Usage: node scripts/media/build-media-sql.mjs   (re-run if gallery.ts changes before the migration is applied)
import fs from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "../..");
const { albums, clippings } = await import(path.join(root, "src/lib/data/gallery.ts"));

const q = (v) => (v === undefined || v === null ? "null" : `'${String(v).replace(/'/g, "''")}'`);

const schema = `-- Media: photo albums, press clippings and the featured video, managed from /admin/media.
-- Run once in the Supabase SQL editor. Safe to re-run: every statement is idempotent.

create table if not exists public.albums (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  label text,                      -- eyebrow on the gallery, e.g. "2014" or "Youth National"
  description text,
  event_date date,
  published boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
drop trigger if exists albums_updated_at on public.albums;
create trigger albums_updated_at before update on public.albums
  for each row execute function public.set_updated_at();

create table if not exists public.photos (
  id uuid primary key default gen_random_uuid(),
  album_id uuid not null references public.albums (id) on delete cascade,
  src text not null,               -- public URL, or a /legacy/... path for photos shipped with the site
  storage_path text,               -- object path in the media bucket for uploaded photos
  alt text not null,
  width integer not null check (width > 0),
  height integer not null check (height > 0),
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);
create index if not exists photos_album_order_idx on public.photos (album_id, sort_order);

create table if not exists public.press_clippings (
  id uuid primary key default gen_random_uuid(),
  year integer not null check (year between 1990 and 2100),
  src text not null,
  storage_path text,
  width integer not null check (width > 0),
  height integer not null check (height > 0),
  headline text,
  source text,                     -- paper and date, e.g. "Amar Ujala · 21 June"
  published boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);
create index if not exists press_year_order_idx on public.press_clippings (year, sort_order);

create table if not exists public.site_settings (
  key text primary key,
  value text,
  updated_at timestamptz not null default now()
);

-- Reorder helpers (run as the caller, so row security applies).
create or replace function public.reorder_albums(p_ids uuid[])
returns void language sql as $$
  update public.albums a set sort_order = x.ord from unnest(p_ids) with ordinality as x(id, ord) where a.id = x.id;
$$;
create or replace function public.reorder_photos(p_ids uuid[])
returns void language sql as $$
  update public.photos p set sort_order = x.ord from unnest(p_ids) with ordinality as x(id, ord) where p.id = x.id;
$$;

-- Row security: the public sees published albums (and their photos), published clippings and settings;
-- admins can do everything.
alter table public.albums enable row level security;
alter table public.photos enable row level security;
alter table public.press_clippings enable row level security;
alter table public.site_settings enable row level security;

drop policy if exists "public read albums" on public.albums;
create policy "public read albums" on public.albums for select to anon, authenticated using (published);
drop policy if exists "public read photos" on public.photos;
create policy "public read photos" on public.photos for select to anon, authenticated
  using (exists (select 1 from public.albums a where a.id = album_id and a.published));
drop policy if exists "public read press" on public.press_clippings;
create policy "public read press" on public.press_clippings for select to anon, authenticated using (published);
drop policy if exists "public read settings" on public.site_settings;
create policy "public read settings" on public.site_settings for select to anon, authenticated using (true);

do $$
declare t text;
begin
  foreach t in array array['albums','photos','press_clippings','site_settings']
  loop
    execute format('drop policy if exists "admin all %1$s" on public.%1$I', t);
    execute format('create policy "admin all %1$s" on public.%1$I for all to authenticated using (public.is_admin()) with check (public.is_admin())', t);
  end loop;
end $$;

grant select on public.albums, public.photos, public.press_clippings, public.site_settings to anon, authenticated;
grant insert, update, delete on public.albums, public.photos, public.press_clippings, public.site_settings to authenticated;
grant execute on function public.reorder_albums(uuid[]) to authenticated;
grant execute on function public.reorder_photos(uuid[]) to authenticated;

-- Storage: a public bucket for website images; only admins can add, change or remove files.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('media', 'media', true, 10485760, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do update set public = true, file_size_limit = excluded.file_size_limit, allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "admins read media" on storage.objects;
create policy "admins read media" on storage.objects for select to authenticated using (bucket_id = 'media' and public.is_admin());
drop policy if exists "admins add media" on storage.objects;
create policy "admins add media" on storage.objects for insert to authenticated with check (bucket_id = 'media' and public.is_admin());
drop policy if exists "admins change media" on storage.objects;
create policy "admins change media" on storage.objects for update to authenticated using (bucket_id = 'media' and public.is_admin());
drop policy if exists "admins remove media" on storage.objects;
create policy "admins remove media" on storage.objects for delete to authenticated using (bucket_id = 'media' and public.is_admin());
`;

const lines = ["", "-- ---------------------------------------------------------------------------", "-- Seed: the gallery carried over from the 2014 site (files stay in public/legacy)", "-- ---------------------------------------------------------------------------"];

albums.forEach((a, i) => {
  lines.push(
    `insert into public.albums (slug, title, label, description, published, sort_order) values (${q(a.id)}, ${q(a.title)}, ${q(a.year)}, ${q(a.description)}, true, ${i + 1}) on conflict (slug) do nothing;`,
  );
  a.photos.forEach((p, j) => {
    lines.push(
      `insert into public.photos (album_id, src, alt, width, height, sort_order) select id, ${q(p.src)}, ${q(p.alt)}, ${p.width}, ${p.height}, ${j + 1} from public.albums where slug = ${q(a.id)} and not exists (select 1 from public.photos where src = ${q(p.src)});`,
    );
  });
});

lines.push("");
clippings.forEach((c, i) => {
  lines.push(
    `insert into public.press_clippings (year, src, width, height, headline, source, sort_order) select ${Number(c.year)}, ${q(c.src)}, ${c.width}, ${c.height}, ${q(c.caption)}, ${q(c.source)}, ${i + 1} where not exists (select 1 from public.press_clippings where src = ${q(c.src)});`,
  );
});

const out = path.join(root, "supabase/migrations/20261118000000_media.sql");
fs.writeFileSync(out, `${schema}${lines.join("\n")}\n`);
console.log(`wrote ${path.relative(root, out)}: ${albums.length} albums, ${albums.reduce((n, a) => n + a.photos.length, 0)} photos, ${clippings.length} clippings`);
