import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CalendarPlus, Download, ExternalLink, FileSpreadsheet, ListOrdered, Settings2, TriangleAlert } from "lucide-react";
import { buttonBase, buttonTones } from "@/components/admin/styles";
import {
  ClearResultForm,
  DeleteFixtureForm,
  DeleteTournamentForm,
  FixtureForm,
  ImportForm,
  ResultForm,
  TournamentForm,
  type FixtureRow,
  type TournamentRow,
} from "@/components/admin/fixture-forms";
import { dateOnly, Disclosure, Empty, PageTitle, Panel, PanelSkeleton, StatusPill } from "@/components/admin/ui";
import { requireAdmin } from "@/lib/admin/auth";
import { stageLabel, stageOrder } from "@/lib/admin/fixtures-input";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Tournament" };

function scoreLine(f: FixtureRow) {
  const r = f.results;
  if (!r) return null;
  const side = (s: number | null, w: number | null) => (s === null ? "–" : w !== null && w < 7 ? `${s}/${w}` : `${s}`);
  const who = r.winner === "a" ? f.team_a : r.winner === "b" ? f.team_b : r.winner === "tie" ? "Tie" : null;
  return `${side(r.score_a, r.wickets_a)} v ${side(r.score_b, r.wickets_b)}${who ? ` · ${who === "Tie" ? "tied" : `${who} won`}` : ""}`;
}

function MatchRow({ f, tournament }: { f: FixtureRow; tournament: TournamentRow }) {
  const score = scoreLine(f);
  const today = new Date().toISOString().slice(0, 10);
  const overdue = ["scheduled", "live"].includes(f.status) && f.match_date !== null && f.match_date < today;
  return (
    <li id={`m-${f.id}`} className="scroll-mt-28">
      <Disclosure
        tone={overdue ? "accent" : "plain"}
        summary={
          <span className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
            {f.match_no ? <span className="font-mono text-xs font-bold text-slate-400">#{f.match_no}</span> : null}
            {f.group_name ? <span className="rounded-md bg-surface px-1.5 py-0.5 text-[11px] font-bold text-slate-500 ring-1 ring-line">Group {f.group_name}</span> : null}
            <span className="text-[15px]">
              {f.team_a} <span className="font-normal text-slate-400">v</span> {f.team_b}
            </span>
            <StatusPill status={f.status} />
            {score ? <span className="text-[13px] font-semibold text-emerald-700">{score}</span> : null}
            <span className="text-[13px] font-normal text-slate-500">
              {dateOnly(f.match_date)}
              {f.match_time ? `, ${f.match_time.slice(0, 5)}` : ""}
            </span>
            {overdue ? <span className="text-[12px] font-bold text-gold-deep">needs a result</span> : null}
          </span>
        }
      >
        <div className="grid gap-6 xl:grid-cols-2">
          <div>
            <h4 className="mb-3 text-[12px] font-bold uppercase tracking-[0.12em] text-royal">Result</h4>
            <ResultForm fixture={f} />
            {f.results ? (
              <div className="mt-3">
                <ClearResultForm id={f.id} />
              </div>
            ) : null}
          </div>
          <div className="xl:border-l xl:border-line xl:pl-6">
            <h4 className="mb-3 text-[12px] font-bold uppercase tracking-[0.12em] text-royal">Match details</h4>
            <FixtureForm tournamentId={tournament.id} fixture={f} />
            <div className="mt-4 border-t border-line pt-4">
              <DeleteFixtureForm id={f.id} />
            </div>
          </div>
        </div>
      </Disclosure>
    </li>
  );
}

async function Body({ params, searchParams }: { params: PageProps<"/admin/fixtures/[id]">["params"]; searchParams: PageProps<"/admin/fixtures/[id]">["searchParams"] }) {
  const { db } = await requireAdmin();
  const { id } = await params;
  const query = await searchParams;
  if (!/^[0-9a-f-]{36}$/i.test(id)) notFound();

  const [{ data: tournament }, { data: fixtures }, { data: teams }] = await Promise.all([
    db.from("tournaments").select("*").eq("id", id).maybeSingle<TournamentRow>(),
    db
      .from("fixtures")
      .select("id, stage, group_name, match_no, label, team_a, team_b, match_date, match_time, venue, status, results(score_a, wickets_a, overs_a, score_b, wickets_b, overs_b, winner, margin, man_of_match, notes)")
      .eq("tournament_id", id)
      .order("match_date", { ascending: true, nullsFirst: false })
      .order("match_time", { ascending: true, nullsFirst: false })
      .order("match_no", { ascending: true, nullsFirst: false })
      .returns<FixtureRow[]>(),
    db.from("teams").select("team_name").eq("status", "approved").order("team_name").returns<{ team_name: string }[]>(),
  ]);
  if (!tournament) notFound();

  const list = fixtures ?? [];
  const byStage = stageOrder.map((stage) => ({ stage, matches: list.filter((f) => f.stage === stage) })).filter((g) => g.matches.length);
  const names = Array.from(new Set([...(teams ?? []).map((t) => t.team_name), ...list.flatMap((f) => [f.team_a, f.team_b])])).sort();
  const played = list.filter((f) => ["completed", "walkover", "abandoned"].includes(f.status)).length;

  return (
    <div className="space-y-8">
      <PageTitle
        back={{ href: "/admin/fixtures", label: "All tournaments" }}
        eyebrow={tournament.season ? `Tournament · ${tournament.season}` : "Tournament"}
        title={tournament.short_name ?? tournament.name}
        description={[tournament.city, tournament.venue, tournament.start_date ? `${dateOnly(tournament.start_date)}${tournament.end_date && tournament.end_date !== tournament.start_date ? ` – ${dateOnly(tournament.end_date)}` : ""}` : null]
          .filter(Boolean)
          .join(" · ")}
        actions={
          <Link href={`/fixtures/${tournament.slug}`} target="_blank" className={cn(buttonBase, buttonTones.quiet)}>
            <ExternalLink className="size-4" aria-hidden="true" />
            Public page
          </Link>
        }
      />

      {query.created ? (
        <p className="rounded-xl bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-700 ring-1 ring-emerald-200">
          Tournament created. Now add its matches below, one at a time or from a spreadsheet.
        </p>
      ) : null}

      <datalist id="team-names">
        {names.map((n) => (
          <option key={n} value={n} />
        ))}
      </datalist>

      <Panel
        title="Matches"
        description={list.length ? `${list.length} matches · ${played} played. Click a match to enter its result or change its details.` : undefined}
        icon={ListOrdered}
      >
        {byStage.length ? (
          <div className="space-y-6">
            {byStage.map((g) => (
              <div key={g.stage}>
                <h3 className="mb-2 flex items-center gap-2 text-[12px] font-bold uppercase tracking-[0.14em] text-slate-500">
                  {stageLabel[g.stage]}
                  <span className="rounded-full bg-surface px-2 text-[11px] tabular-nums ring-1 ring-line">{g.matches.length}</span>
                </h3>
                <ul className="space-y-2">
                  {g.matches.map((f) => (
                    <MatchRow key={f.id} f={f} tournament={tournament} />
                  ))}
                </ul>
              </div>
            ))}
          </div>
        ) : (
          <Empty icon={ListOrdered} title="No matches yet">
            Add the first one below, or import the full schedule from a spreadsheet.
          </Empty>
        )}
      </Panel>

      <div className="grid gap-8 2xl:grid-cols-2">
        <Panel id="add" title="Add a match" description="Team names suggest themselves from approved teams and this tournament." icon={CalendarPlus}>
          <FixtureForm tournamentId={tournament.id} venue={tournament.venue} />
        </Panel>

        <Panel
          id="import"
          title="Import from a spreadsheet"
          description="Add a whole schedule at once. If any line has a problem, nothing is imported and you're told which line to fix."
          icon={FileSpreadsheet}
          actions={
            <a href="/templates/fixtures-template.csv" download className={cn(buttonBase, buttonTones.quiet, "h-9 px-3 text-[13px]")}>
              <Download className="size-4" aria-hidden="true" />
              Template
            </a>
          }
        >
          <ImportForm tournamentId={tournament.id} />
        </Panel>
      </div>

      <Panel title="Tournament details" description="Name, dates, venue and the text on the public page." icon={Settings2}>
        <TournamentForm tournament={tournament} />
      </Panel>

      <Panel title="Delete tournament" icon={TriangleAlert} className="ring-ball/25">
        <DeleteTournamentForm id={tournament.id} />
      </Panel>
    </div>
  );
}

export default function TournamentAdminPage({ params, searchParams }: PageProps<"/admin/fixtures/[id]">) {
  return (
    <Suspense fallback={<PanelSkeleton rows={6} />}>
      <Body params={params} searchParams={searchParams} />
    </Suspense>
  );
}
