# Admin area (`/admin`)

SSCFI staff run the site from `/admin`: tournaments, fixtures and results, player/team/district registrations, the district map, the Gallery (photo albums, press clippings, featured video), enquiries, newsletter subscribers and the admin list. Every change reaches the public site within seconds (cache tags `fixtures`, `players`, `districts`, `gallery`).

## Sign-in

- Passwordless: `/admin/login` emails a one-time link, only to addresses in `public.admins`. Anyone else gets the same reply and no email.
- The link lands on `/admin/auth/confirm`, which accepts both `?code=` (Supabase's default template; open it in the same browser) and `?token_hash=&type=` (works on any device, see below).
- `src/proxy.ts` refreshes the session cookie on `/admin` requests and sends signed-out visitors to the login page. Pages and server actions re-check with `requireAdmin()` (`src/lib/admin/auth.ts`), and row security (`public.is_admin()`) is the final gate: all admin reads and writes use the signed-in user's session, not the secret key.

## One-time setup in Supabase

1. **First admin** (SQL editor): `insert into public.admins (email, name) values ('you@example.com', 'Your name');` After that, admins add each other under Settings → Admins.
2. **Authentication → URL Configuration → Redirect URLs**: add `http://localhost:3000/**` and the live address, e.g. `https://sscfi.org/**` (plus the Vercel preview domain if used). Links to other addresses are refused.
3. **Email delivery**: Supabase's built-in sender only delivers to members of the Supabase organisation, a few emails an hour. Before adding admins outside that team, set Authentication → Emails → SMTP (e.g. Resend's SMTP with a verified sscfi.org domain).
4. Optional, for links that work on any device: in the Magic Link email template use
   `{{ .SiteURL }}/admin/auth/confirm?token_hash={{ .TokenHash }}&type=email&next=/admin`.

## Fixtures

- Tournament → matches (stage, group, teams, date/time, venue) → results (runs/wickets/overs; the winner can be worked out from the runs). League tables are computed by the `league_standings` view.
- Spreadsheet import: CSV with headers `match_no, stage, group, team_a, team_b, date, time, venue, label` (template at `/templates/fixtures-template.csv`). Dates like `05/12/2026` or `2026-12-05`, times like `18:00` or `6 PM`. If any line is wrong, nothing is imported and the line is named.
- Public pages: ticker and `/fixtures` (next five matches, latest results, tournaments), `/fixtures/[slug]` per tournament. The 2014 NCL S7 archive stays hand-curated on `/fixtures`.

## Media (Gallery)

- Needs `supabase/migrations/20261118000000_media.sql` run once in the SQL editor (tables `albums`, `photos`, `press_clippings`, `site_settings`, the public `media` storage bucket and its admin-only write policies). It also seeds the gallery that shipped with the site (5 albums, 49 photos, 42 clippings; files stay in `public/legacy`). Regenerate it with `node scripts/media/build-media-sql.mjs` if `src/lib/data/gallery.ts` changes before it is applied. Until it runs, the site shows `gallery.ts` and the admin shows setup steps.
- Uploads go from the browser straight to storage through one-time signed links (`prepareUploads`), so there is no server size limit. Photos are shrunk in the browser first (2000px for albums, 2400px for scans, WebP or JPEG), with phone rotation applied.
- New albums start hidden; Publish shows them. The first photo is the cover; captions are also the alt text.
- Free Supabase plan: 1 GB of storage, roughly 3,000–5,000 shrunk photos.

## Registrations

- Approving a player calls `issue_player_id()`, which issues the next ID for their state (`00001-WB`) atomically.
- Approving a district association can mark its district onboarded on the map; the admin picks the map district (pre-matched from what the applicant typed).
- Rejections need a reason, kept on the record. Rejected or approved teams/associations can be moved back to pending; approved players keep their ID.
