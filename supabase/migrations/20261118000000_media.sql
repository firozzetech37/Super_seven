-- Media: photo albums, press clippings and the featured video, managed from /admin/media.
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

-- ---------------------------------------------------------------------------
-- Seed: the gallery carried over from the 2014 site (files stay in public/legacy)
-- ---------------------------------------------------------------------------
insert into public.albums (slug, title, label, description, published, sort_order) values ('youth-national-17', '17th Youth National Championship (Under-23 Boys)', 'Youth National', 'Mussoorie. Organised with the Mussoorie Sports Association, Mussoorie Cricket Association and Khelo India.', true, 1) on conflict (slug) do nothing;
insert into public.photos (album_id, src, alt, width, height, sort_order) select id, '/legacy/slide2.jpg', 'Banner of the 17th Youth National Super Seven Cricket Championship (Under-23 Boys)', 500, 292, 1 from public.albums where slug = 'youth-national-17' and not exists (select 1 from public.photos where src = '/legacy/slide2.jpg');
insert into public.photos (album_id, src, alt, width, height, sort_order) select id, '/legacy/slide1.jpg', 'Two teams lined up before a match at the 17th Youth National Championship', 500, 292, 2 from public.albums where slug = 'youth-national-17' and not exists (select 1 from public.photos where src = '/legacy/slide1.jpg');
insert into public.photos (album_id, src, alt, width, height, sort_order) select id, '/legacy/slide3.jpg', 'Players and officials gathered on the ground in Mussoorie', 500, 292, 3 from public.albums where slug = 'youth-national-17' and not exists (select 1 from public.photos where src = '/legacy/slide3.jpg');
insert into public.photos (album_id, src, alt, width, height, sort_order) select id, '/legacy/slide4.jpg', 'Guests and officials seated at the championship ceremony', 500, 292, 4 from public.albums where slug = 'youth-national-17' and not exists (select 1 from public.photos where src = '/legacy/slide4.jpg');
insert into public.photos (album_id, src, alt, width, height, sort_order) select id, '/legacy/slide6.jpg', 'Officials in front of the championship banner', 500, 292, 5 from public.albums where slug = 'youth-national-17' and not exists (select 1 from public.photos where src = '/legacy/slide6.jpg');
insert into public.photos (album_id, src, alt, width, height, sort_order) select id, '/legacy/slide5.jpg', 'An official in a cap at the Mussoorie bazaar during the championship', 500, 292, 6 from public.albums where slug = 'youth-national-17' and not exists (select 1 from public.photos where src = '/legacy/slide5.jpg');
insert into public.albums (slug, title, label, description, published, sort_order) values ('sub-junior-national-14', '14th Sub-Junior National Championship (Under-15 Boys)', '2017', 'Ryan International School, 6–8 January 2017. Organised by the Rajasthan Super Seven Cricket Association.', true, 2) on conflict (slug) do nothing;
insert into public.photos (album_id, src, alt, width, height, sort_order) select id, '/legacy/pictures/picture27.jpg', 'Teams and officials in front of the tournament banner at Ryan International School', 1280, 960, 1 from public.albums where slug = 'sub-junior-national-14' and not exists (select 1 from public.photos where src = '/legacy/pictures/picture27.jpg');
insert into public.photos (album_id, src, alt, width, height, sort_order) select id, '/legacy/pictures/picture35.jpg', 'A team in red with officials under the 14th Sub-Junior National banner', 1280, 960, 2 from public.albums where slug = 'sub-junior-national-14' and not exists (select 1 from public.photos where src = '/legacy/pictures/picture35.jpg');
insert into public.photos (album_id, src, alt, width, height, sort_order) select id, '/legacy/pictures/picture26.jpg', 'Two squads and officials gather on the ground for a group photo', 852, 640, 3 from public.albums where slug = 'sub-junior-national-14' and not exists (select 1 from public.photos where src = '/legacy/pictures/picture26.jpg');
insert into public.photos (album_id, src, alt, width, height, sort_order) select id, '/legacy/pictures/picture30.jpg', 'Officials greet the players before a match', 1280, 720, 4 from public.albums where slug = 'sub-junior-national-14' and not exists (select 1 from public.photos where src = '/legacy/pictures/picture30.jpg');
insert into public.photos (album_id, src, alt, width, height, sort_order) select id, '/legacy/pictures/picture29.jpg', 'A team in blue with its officials on the ground', 852, 640, 5 from public.albums where slug = 'sub-junior-national-14' and not exists (select 1 from public.photos where src = '/legacy/pictures/picture29.jpg');
insert into public.photos (album_id, src, alt, width, height, sort_order) select id, '/legacy/pictures/picture31.jpg', 'Officials shake hands with the young players', 1280, 720, 6 from public.albums where slug = 'sub-junior-national-14' and not exists (select 1 from public.photos where src = '/legacy/pictures/picture31.jpg');
insert into public.photos (album_id, src, alt, width, height, sort_order) select id, '/legacy/pictures/picture28.jpg', 'The group photo, from a little further back', 852, 640, 7 from public.albums where slug = 'sub-junior-national-14' and not exists (select 1 from public.photos where src = '/legacy/pictures/picture28.jpg');
insert into public.photos (album_id, src, alt, width, height, sort_order) select id, '/legacy/pictures/picture32.jpg', 'An official meets a player in front of the school buildings', 1280, 720, 8 from public.albums where slug = 'sub-junior-national-14' and not exists (select 1 from public.photos where src = '/legacy/pictures/picture32.jpg');
insert into public.photos (album_id, src, alt, width, height, sort_order) select id, '/legacy/pictures/picture34.jpg', 'A wider view of the squads and officials', 852, 640, 9 from public.albums where slug = 'sub-junior-national-14' and not exists (select 1 from public.photos where src = '/legacy/pictures/picture34.jpg');
insert into public.photos (album_id, src, alt, width, height, sort_order) select id, '/legacy/pictures/picture33.jpg', 'The group photo, a moment later', 852, 640, 10 from public.albums where slug = 'sub-junior-national-14' and not exists (select 1 from public.photos where src = '/legacy/pictures/picture33.jpg');
insert into public.albums (slug, title, label, description, published, sort_order) values ('ncl-s7-amroha-2014', 'NCL S7 Amroha 2014', '2014', 'National Cricket League Super 7 at Abbasi Cricket Ground, Amroha, 22–25 June 2014.', true, 3) on conflict (slug) do nothing;
insert into public.photos (album_id, src, alt, width, height, sort_order) select id, '/legacy/homepage-2slide.jpg', 'The winning team with the NCL S7 trophy and the winners'' banner', 500, 292, 1 from public.albums where slug = 'ncl-s7-amroha-2014' and not exists (select 1 from public.photos where src = '/legacy/homepage-2slide.jpg');
insert into public.photos (album_id, src, alt, width, height, sort_order) select id, '/legacy/pictures/picture21.jpg', 'A team in red lines up under the lights on the AMROHA lettering, 21 June 2014', 640, 480, 2 from public.albums where slug = 'ncl-s7-amroha-2014' and not exists (select 1 from public.photos where src = '/legacy/pictures/picture21.jpg');
insert into public.photos (album_id, src, alt, width, height, sort_order) select id, '/legacy/pictures/picture22.jpg', 'A team in black lines up along the red carpet on opening night', 1024, 682, 3 from public.albums where slug = 'ncl-s7-amroha-2014' and not exists (select 1 from public.photos where src = '/legacy/pictures/picture22.jpg');
insert into public.photos (album_id, src, alt, width, height, sort_order) select id, '/legacy/pictures/picture12.jpg', 'Players in white hold the national flag at the opening ceremony', 1024, 682, 4 from public.albums where slug = 'ncl-s7-amroha-2014' and not exists (select 1 from public.photos where src = '/legacy/pictures/picture12.jpg');
insert into public.photos (album_id, src, alt, width, height, sort_order) select id, '/legacy/pictures/picture13.jpg', 'Flag bearers line up beside the ABBASI CRICKET lettering on the outfield', 1024, 682, 5 from public.albums where slug = 'ncl-s7-amroha-2014' and not exists (select 1 from public.photos where src = '/legacy/pictures/picture13.jpg');
insert into public.photos (album_id, src, alt, width, height, sort_order) select id, '/legacy/pictures/picture17.jpg', 'A batter takes guard under the lights, with the Abbasi Cricket Academy board behind', 1024, 682, 6 from public.albums where slug = 'ncl-s7-amroha-2014' and not exists (select 1 from public.photos where src = '/legacy/pictures/picture17.jpg');
insert into public.photos (album_id, src, alt, width, height, sort_order) select id, '/legacy/pictures/picture18.jpg', 'A team in grey kit in front of the league banner, 22 June 2014', 640, 480, 7 from public.albums where slug = 'ncl-s7-amroha-2014' and not exists (select 1 from public.photos where src = '/legacy/pictures/picture18.jpg');
insert into public.photos (album_id, src, alt, width, height, sort_order) select id, '/legacy/pictures/picture19.jpg', 'A batter drives through the off side as spectators watch from the tent', 1024, 682, 8 from public.albums where slug = 'ncl-s7-amroha-2014' and not exists (select 1 from public.photos where src = '/legacy/pictures/picture19.jpg');
insert into public.photos (album_id, src, alt, width, height, sort_order) select id, '/legacy/pictures/picture23.jpg', 'A guest bowls the ceremonial first ball as officials look on', 2048, 1365, 9 from public.albums where slug = 'ncl-s7-amroha-2014' and not exists (select 1 from public.photos where src = '/legacy/pictures/picture23.jpg');
insert into public.photos (album_id, src, alt, width, height, sort_order) select id, '/legacy/pictures/picture16.jpg', 'Officials greet a team in orange before their match', 2048, 1365, 10 from public.albums where slug = 'ncl-s7-amroha-2014' and not exists (select 1 from public.photos where src = '/legacy/pictures/picture16.jpg');
insert into public.photos (album_id, src, alt, width, height, sort_order) select id, '/legacy/pictures/picture25.jpg', 'Guests shake hands with the players before a night match', 2048, 1374, 11 from public.albums where slug = 'ncl-s7-amroha-2014' and not exists (select 1 from public.photos where src = '/legacy/pictures/picture25.jpg');
insert into public.photos (album_id, src, alt, width, height, sort_order) select id, '/legacy/pictures/picture14.jpg', 'A memento is presented at the Abbasi Group of Educational & Sports Institutions stand', 2048, 1365, 12 from public.albums where slug = 'ncl-s7-amroha-2014' and not exists (select 1 from public.photos where src = '/legacy/pictures/picture14.jpg');
insert into public.photos (album_id, src, alt, width, height, sort_order) select id, '/legacy/pictures/picture15.jpg', 'Guests exchange greetings at the Abbasi Group stand', 2048, 1365, 13 from public.albums where slug = 'ncl-s7-amroha-2014' and not exists (select 1 from public.photos where src = '/legacy/pictures/picture15.jpg');
insert into public.photos (album_id, src, alt, width, height, sort_order) select id, '/legacy/pictures/picture24.jpg', 'Officials and the chief guest at Abbasi Cricket Ground', 2048, 1365, 14 from public.albums where slug = 'ncl-s7-amroha-2014' and not exists (select 1 from public.photos where src = '/legacy/pictures/picture24.jpg');
insert into public.photos (album_id, src, alt, width, height, sort_order) select id, '/legacy/pictures/picture20.jpg', 'A team in black with its trophy in front of the league banner', 1400, 866, 15 from public.albums where slug = 'ncl-s7-amroha-2014' and not exists (select 1 from public.photos where src = '/legacy/pictures/picture20.jpg');
insert into public.photos (album_id, src, alt, width, height, sort_order) select id, '/legacy/homepage--4slide.jpg', 'Trophy presentation to an official at Abbasi Cricket Ground', 500, 292, 16 from public.albums where slug = 'ncl-s7-amroha-2014' and not exists (select 1 from public.photos where src = '/legacy/homepage--4slide.jpg');
insert into public.photos (album_id, src, alt, width, height, sort_order) select id, '/legacy/homepage-1slide.jpg', 'Federation officials at the tournament office', 500, 292, 17 from public.albums where slug = 'ncl-s7-amroha-2014' and not exists (select 1 from public.photos where src = '/legacy/homepage-1slide.jpg');
insert into public.photos (album_id, src, alt, width, height, sort_order) select id, '/legacy/home-page--3slide.jpg', 'Feroz, Bobby and Satyan, honorary advisors to Super 7', 500, 292, 18 from public.albums where slug = 'ncl-s7-amroha-2014' and not exists (select 1 from public.photos where src = '/legacy/home-page--3slide.jpg');
insert into public.photos (album_id, src, alt, width, height, sort_order) select id, '/legacy/match/final-match.jpg', 'Uttar Pradesh (Host), winners of the final', 200, 150, 19 from public.albums where slug = 'ncl-s7-amroha-2014' and not exists (select 1 from public.photos where src = '/legacy/match/final-match.jpg');
insert into public.photos (album_id, src, alt, width, height, sort_order) select id, '/legacy/match/semi-final-match-1.jpg', 'Players lined up before semi-final 1', 200, 150, 20 from public.albums where slug = 'ncl-s7-amroha-2014' and not exists (select 1 from public.photos where src = '/legacy/match/semi-final-match-1.jpg');
insert into public.photos (album_id, src, alt, width, height, sort_order) select id, '/legacy/match/semi-final-match-2.jpg', 'Mumbai celebrate with the trophy after semi-final 2', 200, 150, 21 from public.albums where slug = 'ncl-s7-amroha-2014' and not exists (select 1 from public.photos where src = '/legacy/match/semi-final-match-2.jpg');
insert into public.albums (slug, title, label, description, published, sort_order) values ('amroha-premier-league-2013', 'Abbasi Amroha Premier League 2013', '2013', 'Prize-giving at Abbasi Cricket Ground, Amroha.', true, 4) on conflict (slug) do nothing;
insert into public.photos (album_id, src, alt, width, height, sort_order) select id, '/legacy/pictures/picture4.png', 'A team in blue holds the trophy in front of the Abbasi Amroha Premier League 2013 banner', 516, 299, 1 from public.albums where slug = 'amroha-premier-league-2013' and not exists (select 1 from public.photos where src = '/legacy/pictures/picture4.png');
insert into public.photos (album_id, src, alt, width, height, sort_order) select id, '/legacy/pictures/picture6.png', 'Trophies laid out for the prize-giving under the league banner', 605, 397, 2 from public.albums where slug = 'amroha-premier-league-2013' and not exists (select 1 from public.photos where src = '/legacy/pictures/picture6.png');
insert into public.photos (album_id, src, alt, width, height, sort_order) select id, '/legacy/pictures/picture5.png', 'A speaker at the prize-giving table, lined with trophies', 606, 364, 3 from public.albums where slug = 'amroha-premier-league-2013' and not exists (select 1 from public.photos where src = '/legacy/pictures/picture5.png');
insert into public.albums (slug, title, label, description, published, sort_order) values ('archive', 'More from the archive', 'Undated', 'Photos from the old site''s gallery that carry no event name. SSCFI will add where and when each was taken.', true, 5) on conflict (slug) do nothing;
insert into public.photos (album_id, src, alt, width, height, sort_order) select id, '/legacy/pictures/picture1.jpg', 'A girls'' team with the trophy and guests under a championship banner', 2048, 1494, 1 from public.albums where slug = 'archive' and not exists (select 1 from public.photos where src = '/legacy/pictures/picture1.jpg');
insert into public.photos (album_id, src, alt, width, height, sort_order) select id, '/legacy/pictures/picture11.png', 'A team in navy celebrates with its trophies', 800, 600, 2 from public.albums where slug = 'archive' and not exists (select 1 from public.photos where src = '/legacy/pictures/picture11.png');
insert into public.photos (album_id, src, alt, width, height, sort_order) select id, '/legacy/pictures/picture.jpg', 'An official presents a trophy', 482, 320, 3 from public.albums where slug = 'archive' and not exists (select 1 from public.photos where src = '/legacy/pictures/picture.jpg');
insert into public.photos (album_id, src, alt, width, height, sort_order) select id, '/legacy/pictures/picture2.jpg', 'A player receives a trophy from an official', 482, 320, 4 from public.albums where slug = 'archive' and not exists (select 1 from public.photos where src = '/legacy/pictures/picture2.jpg');
insert into public.photos (album_id, src, alt, width, height, sort_order) select id, '/legacy/pictures/picture3.png', 'Players in yellow walk off with the umpires', 530, 259, 5 from public.albums where slug = 'archive' and not exists (select 1 from public.photos where src = '/legacy/pictures/picture3.png');
insert into public.photos (album_id, src, alt, width, height, sort_order) select id, '/legacy/pictures/picture10.png', 'Officials and players line up outside the pavilion', 800, 600, 6 from public.albums where slug = 'archive' and not exists (select 1 from public.photos where src = '/legacy/pictures/picture10.png');
insert into public.photos (album_id, src, alt, width, height, sort_order) select id, '/legacy/pictures/picture9.png', 'Players and officials outside the pavilion', 320, 240, 7 from public.albums where slug = 'archive' and not exists (select 1 from public.photos where src = '/legacy/pictures/picture9.png');
insert into public.photos (album_id, src, alt, width, height, sort_order) select id, '/legacy/pictures/picture7.png', 'Two teams line up at the start of a match', 320, 240, 8 from public.albums where slug = 'archive' and not exists (select 1 from public.photos where src = '/legacy/pictures/picture7.png');
insert into public.photos (album_id, src, alt, width, height, sort_order) select id, '/legacy/pictures/picture8.png', 'Guests watch from the shade of the tent', 320, 240, 9 from public.albums where slug = 'archive' and not exists (select 1 from public.photos where src = '/legacy/pictures/picture8.png');

insert into public.press_clippings (year, src, width, height, headline, source, sort_order) select 2003, '/legacy/press/2003/1.jpg', 993, 1075, 'National Super Seven championship to start on 15 May', 'Dainik Jagran', 1 where not exists (select 1 from public.press_clippings where src = '/legacy/press/2003/1.jpg');
insert into public.press_clippings (year, src, width, height, headline, source, sort_order) select 2003, '/legacy/press/2003/2.jpg', 2400, 1341, 'Delhi eves, MP boys lift Super Seven Cricket trophy', null, 2 where not exists (select 1 from public.press_clippings where src = '/legacy/press/2003/2.jpg');
insert into public.press_clippings (year, src, width, height, headline, source, sort_order) select 2003, '/legacy/press/2003/3.jpg', 1994, 2400, 'Madhya Pradesh and Haryana win the Super Seven trophy', '22 May', 3 where not exists (select 1 from public.press_clippings where src = '/legacy/press/2003/3.jpg');
insert into public.press_clippings (year, src, width, height, headline, source, sort_order) select 2003, '/legacy/press/2003/4.jpg', 1981, 2400, 'Super Seven cricket gives more entertainment in less time', null, 4 where not exists (select 1 from public.press_clippings where src = '/legacy/press/2003/4.jpg');
insert into public.press_clippings (year, src, width, height, headline, source, sort_order) select 2003, '/legacy/press/2003/5.jpg', 1800, 2400, 'Haryana win the women''s title, Madhya Pradesh the men''s', 'Amar Ujala', 5 where not exists (select 1 from public.press_clippings where src = '/legacy/press/2003/5.jpg');
insert into public.press_clippings (year, src, width, height, headline, source, sort_order) select 2003, '/legacy/press/2003/6.jpg', 2186, 2400, 'MP and Haryana win the Super Seven trophy', 'Dainik Jagran', 6 where not exists (select 1 from public.press_clippings where src = '/legacy/press/2003/6.jpg');
insert into public.press_clippings (year, src, width, height, headline, source, sort_order) select 2004, '/legacy/press/2004/1.jpg', 2018, 2400, '“If we want medals, players need facilities”: District Magistrate', 'Dainik Jagran', 7 where not exists (select 1 from public.press_clippings where src = '/legacy/press/2004/1.jpg');
insert into public.press_clippings (year, src, width, height, headline, source, sort_order) select 2004, '/legacy/press/2004/2.jpg', 1606, 2400, 'Madhya Pradesh and Delhi win the Super Seven event', null, 8 where not exists (select 1 from public.press_clippings where src = '/legacy/press/2004/2.jpg');
insert into public.press_clippings (year, src, width, height, headline, source, sort_order) select 2004, '/legacy/press/2004/3.jpg', 1905, 2400, 'Organisers should lift the players'' morale too', 'Amar Ujala', 9 where not exists (select 1 from public.press_clippings where src = '/legacy/press/2004/3.jpg');
insert into public.press_clippings (year, src, width, height, headline, source, sort_order) select 2005, '/legacy/press/2005/1.jpg', 1669, 2400, 'Saharanpur, Agra and Gautam Buddh Nagar into the next round', 'Amar Ujala', 10 where not exists (select 1 from public.press_clippings where src = '/legacy/press/2005/1.jpg');
insert into public.press_clippings (year, src, width, height, headline, source, sort_order) select 2005, '/legacy/press/2005/2.jpg', 1736, 2400, 'Prize-giving of the state Super Seven championship', 'Amar Ujala · 16 May', 11 where not exists (select 1 from public.press_clippings where src = '/legacy/press/2005/2.jpg');
insert into public.press_clippings (year, src, width, height, headline, source, sort_order) select 2005, '/legacy/press/2005/3.jpg', 2400, 1512, 'Shah''s heroics go in vain: Laxmikant, Roopesh shine in Saurashtra''s 8-run win', null, 12 where not exists (select 1 from public.press_clippings where src = '/legacy/press/2005/3.jpg');
insert into public.press_clippings (year, src, width, height, headline, source, sort_order) select 2006, '/legacy/press/2006/1.jpg', 1878, 2400, 'Gautam Buddh Nagar men and Aligarh women win', 'Amar Ujala', 13 where not exists (select 1 from public.press_clippings where src = '/legacy/press/2006/1.jpg');
insert into public.press_clippings (year, src, width, height, headline, source, sort_order) select 2006, '/legacy/press/2006/2.jpg', 1913, 2400, '4th Senior National championship opens amid cultural programmes', 'Amar Ujala', 14 where not exists (select 1 from public.press_clippings where src = '/legacy/press/2006/2.jpg');
insert into public.press_clippings (year, src, width, height, headline, source, sort_order) select 2006, '/legacy/press/2006/3.jpg', 1820, 1377, 'Haryana and Uttar Pradesh to meet in the 4th Senior National final', 'Amar Ujala · 31 Dec', 15 where not exists (select 1 from public.press_clippings where src = '/legacy/press/2006/3.jpg');
insert into public.press_clippings (year, src, width, height, headline, source, sort_order) select 2008, '/legacy/press/2008/1.jpg', 2400, 2023, 'Youth National Super Seven championship begins', 'Amar Ujala', 16 where not exists (select 1 from public.press_clippings where src = '/legacy/press/2008/1.jpg');
insert into public.press_clippings (year, src, width, height, headline, source, sort_order) select 2008, '/legacy/press/2008/2.jpg', 1568, 2400, 'Gautam Buddh Nagar win the championship', 'Dainik Jagran', 17 where not exists (select 1 from public.press_clippings where src = '/legacy/press/2008/2.jpg');
insert into public.press_clippings (year, src, width, height, headline, source, sort_order) select 2008, '/legacy/press/2008/3.jpg', 2400, 1436, 'Jharkhand, Haryana and UP dominate as the 6th Youth National opens', null, 18 where not exists (select 1 from public.press_clippings where src = '/legacy/press/2008/3.jpg');
insert into public.press_clippings (year, src, width, height, headline, source, sort_order) select 2009, '/legacy/press/2009/1.jpg', 1163, 936, '32 teams to play in the 7th Senior National championship at Lehragaga', null, 19 where not exists (select 1 from public.press_clippings where src = '/legacy/press/2009/1.jpg');
insert into public.press_clippings (year, src, width, height, headline, source, sort_order) select 2009, '/legacy/press/2009/2.jpg', 2026, 1637, '7th National Super Seven Cricket Championship begins', null, 20 where not exists (select 1 from public.press_clippings where src = '/legacy/press/2009/2.jpg');
insert into public.press_clippings (year, src, width, height, headline, source, sort_order) select 2014, '/legacy/press/2014/1-21june.jpg', 2400, 1298, 'National Cricket League starts today, with 28 teams from across India', 'Amar Ujala · 21 June', 21 where not exists (select 1 from public.press_clippings where src = '/legacy/press/2014/1-21june.jpg');
insert into public.press_clippings (year, src, width, height, headline, source, sort_order) select 2014, '/legacy/press/2014/2-21june.jpg', 1463, 1846, 'NCL Super Seven 2014 starts today', 'Hindustan · 21 June', 22 where not exists (select 1 from public.press_clippings where src = '/legacy/press/2014/2-21june.jpg');
insert into public.press_clippings (year, src, width, height, headline, source, sort_order) select 2014, '/legacy/press/2014/3-22june.jpg', 1531, 2369, 'A grand start to the National Cricket League', 'Amar Ujala · 22 June', 23 where not exists (select 1 from public.press_clippings where src = '/legacy/press/2014/3-22june.jpg');
insert into public.press_clippings (year, src, width, height, headline, source, sort_order) select 2014, '/legacy/press/2014/4-23june.jpg', 2400, 1615, 'Puducherry, Haryana and Rajasthan win', 'Hindustan · 23 June', 24 where not exists (select 1 from public.press_clippings where src = '/legacy/press/2014/4-23june.jpg');
insert into public.press_clippings (year, src, width, height, headline, source, sort_order) select 2014, '/legacy/press/2014/5-23june.jpg', 2400, 1006, 'Sport strengthens goodwill', 'Amar Ujala · 23 June', 25 where not exists (select 1 from public.press_clippings where src = '/legacy/press/2014/5-23june.jpg');
insert into public.press_clippings (year, src, width, height, headline, source, sort_order) select 2014, '/legacy/press/2014/6-23june.jpg', 1440, 2363, 'Sport matters for harmony: Super 7 opens at Abbasi College', '23 June', 26 where not exists (select 1 from public.press_clippings where src = '/legacy/press/2014/6-23june.jpg');
insert into public.press_clippings (year, src, width, height, headline, source, sort_order) select 2014, '/legacy/press/2014/7-23june.jpg', 1422, 2400, 'Cricket teams from many states meet at Abbasi', 'Daily Sahafat · 23 June', 27 where not exists (select 1 from public.press_clippings where src = '/legacy/press/2014/7-23june.jpg');
insert into public.press_clippings (year, src, width, height, headline, source, sort_order) select 2014, '/legacy/press/2014/8-24June.jpg', 2400, 1235, 'UP Host and Mumbai head for a title clash', 'Shah Times · 24 June', 28 where not exists (select 1 from public.press_clippings where src = '/legacy/press/2014/8-24June.jpg');
insert into public.press_clippings (year, src, width, height, headline, source, sort_order) select 2014, '/legacy/press/2014/9-24June.jpg', 1337, 2400, 'Semi-finals today', 'Amar Ujala · 24 June', 29 where not exists (select 1 from public.press_clippings where src = '/legacy/press/2014/9-24June.jpg');
insert into public.press_clippings (year, src, width, height, headline, source, sort_order) select 2014, '/legacy/press/2014/10-24June.jpg', 2400, 1413, 'UP beat Punjab by 100 runs; Mumbai and NCR win too', 'Amar Ujala · 24 June', 30 where not exists (select 1 from public.press_clippings where src = '/legacy/press/2014/10-24June.jpg');
insert into public.press_clippings (year, src, width, height, headline, source, sort_order) select 2014, '/legacy/press/2014/11-24June.jpg', 2400, 1781, 'MP Parvez Hashmi meets the players at Abbasi Academy', 'Daily Sahafat · 24 June', 31 where not exists (select 1 from public.press_clippings where src = '/legacy/press/2014/11-24June.jpg');
insert into public.press_clippings (year, src, width, height, headline, source, sort_order) select 2014, '/legacy/press/2014/12-25June.jpg', 2400, 1382, '“India has no shortage of cricket talent”: Parvez', 'Shah Times · 25 June', 32 where not exists (select 1 from public.press_clippings where src = '/legacy/press/2014/12-25June.jpg');
insert into public.press_clippings (year, src, width, height, headline, source, sort_order) select 2014, '/legacy/press/2014/13-25June.jpg', 1978, 2288, 'Four teams win their quarter-finals', 'Hindustan · 25 June', 33 where not exists (select 1 from public.press_clippings where src = '/legacy/press/2014/13-25June.jpg');
insert into public.press_clippings (year, src, width, height, headline, source, sort_order) select 2014, '/legacy/press/2014/14-26June.jpg', 2400, 1813, 'UP Host beat Mumbai in the final; Jitendra man of the match and series', '26 June', 34 where not exists (select 1 from public.press_clippings where src = '/legacy/press/2014/14-26June.jpg');
insert into public.press_clippings (year, src, width, height, headline, source, sort_order) select 2014, '/legacy/press/2014/15-26June.jpg', 2400, 1987, 'UP Host and Mumbai reach the NCL final', 'Awam-e-Hind · 26 June', 35 where not exists (select 1 from public.press_clippings where src = '/legacy/press/2014/15-26June.jpg');
insert into public.press_clippings (year, src, width, height, headline, source, sort_order) select 2014, '/legacy/press/2014/16-26June.jpg', 1197, 1180, 'Mohammad Nafees Abbasi releases a book on Amroha cricket', 'Super News Leader · 26 June', 36 where not exists (select 1 from public.press_clippings where src = '/legacy/press/2014/16-26June.jpg');
insert into public.press_clippings (year, src, width, height, headline, source, sort_order) select 2014, '/legacy/press/2014/17-27June.jpg', 1477, 2400, 'UP Host beat Mumbai by 59 runs to take the trophy', 'Amar Ujala · 27 June', 37 where not exists (select 1 from public.press_clippings where src = '/legacy/press/2014/17-27June.jpg');
insert into public.press_clippings (year, src, width, height, headline, source, sort_order) select 2014, '/legacy/press/2014/18-27June.jpg', 1165, 1235, 'Book on Amroha''s cricket stars released', 'Awam-e-Hind · 27 June', 38 where not exists (select 1 from public.press_clippings where src = '/legacy/press/2014/18-27June.jpg');
insert into public.press_clippings (year, src, width, height, headline, source, sort_order) select 2014, '/legacy/press/2014/19-27June.jpg', 2400, 1725, 'UP crowned National League champions', 'Hindustan · 27 June', 39 where not exists (select 1 from public.press_clippings where src = '/legacy/press/2014/19-27June.jpg');
insert into public.press_clippings (year, src, width, height, headline, source, sort_order) select 2014, '/legacy/press/2014/20-27June.jpg', 2359, 1470, 'UP Host are National Cricket League champions', 'Dainik Jagran · 27 June', 40 where not exists (select 1 from public.press_clippings where src = '/legacy/press/2014/20-27June.jpg');
insert into public.press_clippings (year, src, width, height, headline, source, sort_order) select 2014, '/legacy/press/2014/21-27June.jpg', 1813, 2400, 'UP Host beat Mumbai to become champions; Jitendra man of the match', 'Shah Times · 27 June', 41 where not exists (select 1 from public.press_clippings where src = '/legacy/press/2014/21-27June.jpg');
insert into public.press_clippings (year, src, width, height, headline, source, sort_order) select 2016, '/legacy/press/2016/27-08-16-1.jpg', 800, 1774, 'Abbasi Cricket Academy win the title', 'Dainik Jagran · 27 Aug', 42 where not exists (select 1 from public.press_clippings where src = '/legacy/press/2016/27-08-16-1.jpg');
