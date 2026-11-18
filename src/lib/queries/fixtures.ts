import { cacheLife, cacheTag } from "next/cache";
import { tournament2014, type MatchResult, type Stage, type UpcomingFixture } from "@/lib/data/fixtures";
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

/** Next five scheduled fixtures from the database (empty when none are scheduled; the UI says "to be announced"). */
export async function getUpcomingFixtures(): Promise<UpcomingFixture[]> {
  "use cache";
  cacheLife("minutes");
  cacheTag("fixtures");
  if (!hasSupabase) return [];

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
    return [];
  }
  if (!data?.length) return [];

  return data.map((f) => ({
    id: f.id,
    title: f.tournaments?.short_name ?? f.tournaments?.name ?? f.label ?? `${f.team_a} v ${f.team_b}`,
    city: f.tournaments?.city ?? undefined,
    href: f.tournaments ? `/fixtures/${f.tournaments.slug}` : "/fixtures#upcoming",
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

/* ---------- Tournaments and results managed in the admin area ---------- */

type ResultRow = {
  score_a: number | null;
  wickets_a: number | null;
  overs_a: number | null;
  score_b: number | null;
  wickets_b: number | null;
  overs_b: number | null;
  winner: "a" | "b" | "tie" | null;
  margin: string | null;
  man_of_match: string | null;
  notes: string | null;
};

export type TournamentFixture = {
  id: string;
  stage: Stage;
  group: string | null;
  matchNo: number | null;
  label: string | null;
  teamA: string;
  teamB: string;
  date?: string;
  time?: string;
  venue: string | null;
  status: "scheduled" | "live" | "completed" | "walkover" | "abandoned";
  result: MatchResult | null;
};

export type TournamentSummary = {
  id: string;
  slug: string;
  name: string;
  shortName: string | null;
  city: string | null;
  venue: string | null;
  season: string | null;
  startDate: string | null;
  endDate: string | null;
  format: string | null;
  notes: string | null;
  matches: number;
  played: number;
};

const stageNames: Record<Stage, string> = {
  league: "League",
  quarter: "Quarter-final",
  semi: "Semi-final",
  third: "Third place",
  final: "Final",
  friendly: "Friendly",
};

/** "74/3" style score: wickets only when the side wasn't all out (7 in Super Seven). */
function scoreText(runs: number | null, wickets: number | null) {
  if (runs === null) return undefined;
  return wickets !== null && wickets < 7 ? `${runs}/${wickets}` : `${runs}`;
}

/** A database result in the shape the public ResultCard already renders. */
function toMatchResult(f: { id: string; stage: Stage; label: string | null; match_no: number | null; group_name: string | null; team_a: string; team_b: string; match_date: string | null; status: string }, r: ResultRow | null): MatchResult | null {
  if (!r) return null;
  const winner = r.winner === "a" ? f.team_a : r.winner === "b" ? f.team_b : undefined;
  const when = f.match_date ? new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short", timeZone: "UTC" }).format(new Date(`${f.match_date}T00:00:00Z`)) : null;
  const title = f.label ?? `${stageNames[f.stage]}${f.group_name ? ` · Group ${f.group_name}` : ""}${f.match_no ? ` · Match ${f.match_no}` : ""}`;
  return {
    id: f.id,
    stage: f.stage,
    label: when ? `${title} · ${when}` : title,
    teamA: f.team_a,
    teamB: f.team_b,
    scoreA: scoreText(r.score_a, r.wickets_a),
    scoreB: scoreText(r.score_b, r.wickets_b),
    winner,
    margin: f.status === "walkover" ? "walkover" : r.winner === "tie" ? "Match tied" : (r.margin ?? undefined),
    manOfMatch: r.man_of_match ?? undefined,
  };
}

const fixtureColumns =
  "id, stage, group_name, match_no, label, team_a, team_b, match_date, match_time, venue, status, results(score_a, wickets_a, overs_a, score_b, wickets_b, overs_b, winner, margin, man_of_match, notes)";

type FixtureWithResult = {
  id: string;
  stage: Stage;
  group_name: string | null;
  match_no: number | null;
  label: string | null;
  team_a: string;
  team_b: string;
  match_date: string | null;
  match_time: string | null;
  venue: string | null;
  status: TournamentFixture["status"];
  results: ResultRow | null;
};

/** Latest results from tournaments run through the admin area (the 2014 archive has its own section). */
export async function getRecentResults(limit = 6): Promise<(MatchResult & { tournament: string; href: string })[]> {
  "use cache";
  cacheLife("minutes");
  cacheTag("fixtures");
  if (!hasSupabase) return [];
  const { data, error } = await supabasePublic()
    .from("fixtures")
    .select(`${fixtureColumns}, tournaments!inner(slug, name, short_name)`)
    .in("status", ["completed", "walkover"])
    .neq("tournaments.slug", tournament2014.id)
    .order("match_date", { ascending: false, nullsFirst: false })
    .order("match_time", { ascending: false, nullsFirst: false })
    .limit(limit)
    .returns<(FixtureWithResult & { tournaments: { slug: string; name: string; short_name: string | null } })[]>();
  if (error || !data) return [];
  return data.flatMap((f) => {
    const r = toMatchResult(f, f.results);
    return r ? [{ ...r, tournament: f.tournaments.short_name ?? f.tournaments.name, href: `/fixtures/${f.tournaments.slug}` }] : [];
  });
}

/** Every tournament with match counts, newest first. */
export async function getTournaments(): Promise<TournamentSummary[]> {
  "use cache";
  cacheLife("minutes");
  cacheTag("fixtures");
  if (!hasSupabase) return [];
  const { data, error } = await supabasePublic()
    .from("tournaments")
    .select("id, slug, name, short_name, city, venue, season, start_date, end_date, format, notes, fixtures(status)")
    .order("start_date", { ascending: false, nullsFirst: true })
    .returns<{ id: string; slug: string; name: string; short_name: string | null; city: string | null; venue: string | null; season: string | null; start_date: string | null; end_date: string | null; format: string | null; notes: string | null; fixtures: { status: string }[] }[]>();
  if (error || !data) return [];
  return data.map((t) => ({
    id: t.id,
    slug: t.slug,
    name: t.name,
    shortName: t.short_name,
    city: t.city,
    venue: t.venue,
    season: t.season,
    startDate: t.start_date,
    endDate: t.end_date,
    format: t.format,
    notes: t.notes,
    matches: t.fixtures.length,
    played: t.fixtures.filter((f) => f.status === "completed" || f.status === "walkover").length,
  }));
}

/** One tournament with its full schedule and results, or null when the slug is unknown. */
export async function getTournament(slug: string): Promise<{ tournament: TournamentSummary; fixtures: TournamentFixture[] } | null> {
  "use cache";
  cacheLife("minutes");
  cacheTag("fixtures");
  if (!hasSupabase) return null;
  const tournament = (await getTournaments()).find((t) => t.slug === slug);
  if (!tournament) return null;
  const { data } = await supabasePublic()
    .from("fixtures")
    .select(fixtureColumns)
    .eq("tournament_id", tournament.id)
    .order("match_date", { ascending: true, nullsFirst: false })
    .order("match_time", { ascending: true, nullsFirst: false })
    .order("match_no", { ascending: true, nullsFirst: false })
    .returns<FixtureWithResult[]>();
  return {
    tournament,
    fixtures: (data ?? []).map((f) => ({
      id: f.id,
      stage: f.stage,
      group: f.group_name,
      matchNo: f.match_no,
      label: f.label,
      teamA: f.team_a,
      teamB: f.team_b,
      date: f.match_date ?? undefined,
      time: f.match_time?.slice(0, 5) ?? undefined,
      venue: f.venue,
      status: f.status,
      result: toMatchResult(f, f.results),
    })),
  };
}
