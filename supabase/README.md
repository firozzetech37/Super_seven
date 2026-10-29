# Database (Supabase)

`migrations/` holds the SQL that creates the schema. Apply each file once per project, in order:

1. `20261029000000_init.sql` — tables, security, player IDs, fixtures, seeds.
2. `20261030000000_localities.sql` — localities for the map's fourth tap (Phase 3). Until it runs, the site shows the Hooghly sample localities.

## Apply

**Option A, SQL Editor (no install):** open the project on supabase.com → SQL Editor → New query → paste the whole
file `migrations/20261029000000_init.sql` → Run. It is idempotent, so running it twice is harmless.

**Option B, CLI:**

```bash
npx supabase login
npx supabase link --project-ref <project-ref>
npx supabase db push
```

## Verify

```bash
node --env-file=.env.local scripts/db-check.mjs
```

## Make yourself an admin

Sign in once (Authentication → Users shows the account), then in the SQL Editor:

```sql
insert into public.admins (email, name) values ('you@example.com', 'Your name');
```

## What is in the schema

| Table / view | Purpose |
|---|---|
| `states`, `districts` | Reference data; `districts.status` colours the map |
| `associations`, `teams`, `players` | The three registration forms, each with `status` pending/approved/rejected |
| `player_counters` + `issue_player_id()` | Per-state counters that issue IDs like `00001-WB` on approval |
| `enquiries` | Contact form |
| `subscribers` | Newsletter with confirm/unsubscribe tokens |
| `tournaments`, `fixtures`, `results` | Fixtures page, ticker (`upcoming_fixtures` view) and `league_standings` view |
| `player_directory`, `public_teams` | The only public views of people data: name, ID, state, category |
| `admins` + `is_admin()` | Allow-list that unlocks every table for signed-in admins |
| storage bucket `certificates` | Private; district association certificates |

The website server writes with the secret key, so no insert policies exist for anonymous users.
