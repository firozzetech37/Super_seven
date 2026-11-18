# Admin area (`/admin`)

SSCFI staff run the site from `/admin`: tournaments, fixtures and results, player/team/district registrations, the district map, the Gallery (photo albums, press clippings, featured video), enquiries, newsletter subscribers and the admin list. Every change reaches the public site within seconds (cache tags `fixtures`, `players`, `districts`, `gallery`).

## Sign-in

- **Continue with Google** (shown once Google is enabled in Supabase) or an emailed one-time link (sent only to addresses
  in `public.admins`; anyone else gets the same reply and no email).
- Only emails in `public.admins` get through `/admin/auth/confirm`. Any other account (e.g. someone picking a different
  Google account) is signed out at once and the Supabase user that attempt created is deleted (after re-checking the
  admin list with the secret key, and never when the check itself errors). Removing an admin also deletes their auth
  user, which ends their sessions.
- The link lands on `/admin/auth/confirm`, which accepts both `?code=` (Supabase's default template; open it in the same browser) and `?token_hash=&type=` (works on any device, see below).
- `src/proxy.ts` refreshes the session cookie on `/admin` requests and sends signed-out visitors to the login page. Pages and server actions re-check with `requireAdmin()` (`src/lib/admin/auth.ts`), and row security (`public.is_admin()`) is the final gate: all admin reads and writes use the signed-in user's session, not the secret key.

## Getting in

- Footer of every page: "Staff login" (goes to `/admin`; signed-out visitors land on the sign-in page).
- Admin bar: signed-in admins see a slim bar above the public header (`src/components/layout/admin-bar.tsx`) with
  Dashboard / Fixtures / Media, a shortcut for the current page (Gallery → Add photos, Fixtures → Enter results, …),
  the count of registrations and enquiries waiting, and Sign out. It only calls `/admin/me` when a Supabase session
  cookie exists, so ordinary visitors never trigger a request and the public pages stay static.
- Phone: "Add to Home Screen" on any admin page gives an "SSCFI Admin" icon (`public/admin-app/`). It opens in the
  normal browser (`display: minimal-ui`, no iOS standalone mode) so the emailed sign-in link and the icon share one session.
- After launch: point `admin.sscfi.org` at the site (DNS CNAME + Vercel domain) and redirect it to `/admin`.

## Google sign-in setup

1. Google Cloud Console → new project "SSCFI Admin" → APIs & Services → OAuth consent screen: External, app name
   "SSCFI Admin", support email, scopes email/profile/openid. Leaving it in **Testing** with the admin emails added as
   test users is an extra lock (only those Google accounts can even reach the consent screen; up to 100).
2. Credentials → Create credentials → OAuth client ID → Web application. Authorised JavaScript origins:
   `http://localhost:3000` and the live site; Authorised redirect URI: `https://<project-ref>.supabase.co/auth/v1/callback`.
3. Supabase → Authentication → Sign In / Providers → Google → enable, paste the client ID and secret, save.
4. The login page checks `/auth/v1/settings` and shows the Google button as soon as the provider is on.

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
