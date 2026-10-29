// Verify the Supabase schema through the REST API. Usage: node --env-file=.env.local scripts/db-check.mjs
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SECRET_KEY;
if (!url || !key) {
  console.error("Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SECRET_KEY (run with --env-file=.env.local)");
  process.exit(1);
}
const tables = ["states", "districts", "associations", "teams", "players", "player_counters", "enquiries", "subscribers", "tournaments", "fixtures", "results", "admins", "player_directory", "public_teams", "upcoming_fixtures", "league_standings", "localities"];
let failed = 0;
for (const t of tables) {
  const res = await fetch(`${url}/rest/v1/${t}?select=*&limit=0`, {
    headers: { apikey: key, Authorization: `Bearer ${key}`, Prefer: "count=exact" },
  });
  const count = res.headers.get("content-range")?.split("/")[1] ?? "?";
  if (!res.ok) failed++;
  console.log(`${res.ok ? "ok " : "ERR"} ${t.padEnd(18)} ${res.ok ? `${count} rows` : `${res.status} ${(await res.text()).slice(0, 120)}`}`);
}
const bucket = await fetch(`${url}/storage/v1/bucket/certificates`, { headers: { apikey: key, Authorization: `Bearer ${key}` } });
console.log(`${bucket.ok ? "ok " : "ERR"} storage bucket certificates ${bucket.ok ? "" : bucket.status}`);
if (!bucket.ok) failed++;
process.exit(failed ? 1 : 0);
