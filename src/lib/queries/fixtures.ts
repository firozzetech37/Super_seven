import { cacheLife, cacheTag } from "next/cache";
import { upcomingFixtures as staticUpcoming, type UpcomingFixture } from "@/lib/data/fixtures";
import { hasSupabase, supabasePublic } from "@/lib/supabase/server";

type FixtureRow = {
  id: string;
  label: string | null;
  team_a: string;
  team_b: string;
  match_date: string | null;
  match_time: string | null;
  venue: string | null;
  tournaments: { slug: string; name: string; short_name: string | null; city: string | null; is_sample: boolean } | null;
};

/** Next five scheduled fixtures from the database; the concept's sample list while the table is empty. */
export async function getUpcomingFixtures(): Promise<UpcomingFixture[]> {
  "use cache";
  cacheLife("minutes");
  cacheTag("fixtures");
  if (!hasSupabase) return staticUpcoming;

  const today = new Date().toISOString().slice(0, 10);
  const { data, error } = await supabasePublic()
    .from("fixtures")
    .select("id, label, team_a, team_b, match_date, match_time, venue, tournaments(slug, name, short_name, city, is_sample)")
    .in("status", ["scheduled", "live"])
    .or(`match_date.is.null,match_date.gte.${today}`)
    .order("match_date", { ascending: true, nullsFirst: false })
    .order("match_time", { ascending: true, nullsFirst: false })
    .limit(5)
    .returns<FixtureRow[]>();

  if (error) {
    console.error("[sscfi] upcoming fixtures", error.message);
    return staticUpcoming;
  }
  if (!data?.length) return staticUpcoming;

  return data.map((f) => ({
    id: f.id,
    title: f.tournaments?.short_name ?? f.tournaments?.name ?? f.label ?? `${f.team_a} v ${f.team_b}`,
    city: f.tournaments?.city ?? undefined,
    href: "/fixtures#upcoming",
    sample: f.tournaments?.is_sample ?? false,
    teams: `${f.team_a} v ${f.team_b}`,
    date: f.match_date ?? undefined,
    time: f.match_time?.slice(0, 5) ?? undefined,
    venue: f.venue ?? undefined,
  }));
}

export type StandingRow = {
  team: string;
  played: number;
  won: number;
  lost: number;
  tied: number;
  points: number;
  runs_for: number;
  runs_against: number;
};

export type StandingsGroup = { tournament: string; group: string; rows: StandingRow[] };

/** League tables computed by the database from stored results, grouped by tournament and group. */
export async function getLeagueStandings(): Promise<StandingsGroup[]> {
  "use cache";
  cacheLife("minutes");
  cacheTag("fixtures");
  if (!hasSupabase) return [];

  const db = supabasePublic();
  const [standings, tournaments] = await Promise.all([
    db.from("league_standings").select("*").returns<(StandingRow & { tournament_id: string; group_name: string | null })[]>(),
    db.from("tournaments").select("id, name, short_name").returns<{ id: string; name: string; short_name: string | null }[]>(),
  ]);
  if (standings.error || tournaments.error || !standings.data?.length) return [];

  const names = new Map(tournaments.data?.map((t) => [t.id, t.short_name ?? t.name]));
  const groups = new Map<string, StandingsGroup>();
  for (const row of standings.data) {
    const key = `${row.tournament_id}|${row.group_name ?? ""}`;
    const group = groups.get(key) ?? {
      tournament: names.get(row.tournament_id) ?? "Tournament",
      group: row.group_name ? `Group ${row.group_name}` : "League",
      rows: [],
    };
    group.rows.push(row);
    groups.set(key, group);
  }
  for (const g of groups.values()) {
    g.rows.sort((a, b) => b.points - a.points || b.runs_for - b.runs_against - (a.runs_for - a.runs_against) || a.team.localeCompare(b.team));
  }
  return [...groups.values()];
}

/** "Sat 14 Nov 2026" for an ISO date, in Indian English. */
export function formatMatchDate(iso?: string, time?: string) {
  if (!iso) return "Dates to be announced";
  const text = new Intl.DateTimeFormat("en-IN", { weekday: "short", day: "numeric", month: "short", year: "numeric", timeZone: "UTC" }).format(
    new Date(`${iso}T00:00:00Z`),
  );
  return time ? `${text}, ${time}` : text;
}
