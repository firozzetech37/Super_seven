import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CalendarDays, Clock3, ListOrdered, MapPin, Trophy } from "lucide-react";
import { ResultCard } from "@/components/fixtures/result-card";
import { StandingsTable } from "@/components/fixtures/standings-table";
import { tournamentDates } from "@/components/fixtures/tournament-card";
import { PageHeader } from "@/components/layout/page-header";
import { SectionHeading } from "@/components/layout/section-heading";
import { Reveal } from "@/components/motion/reveal";
import { tournament2014, type Stage } from "@/lib/data/fixtures";
import { getLeagueStandings, getTournament, getTournaments, type TournamentFixture } from "@/lib/queries/fixtures";
import { cn } from "@/lib/utils";

export async function generateStaticParams() {
  const tournaments = await getTournaments();
  return tournaments.length ? tournaments.map((t) => ({ slug: t.slug })) : [{ slug: tournament2014.id }];
}

export async function generateMetadata({ params }: PageProps<"/fixtures/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const data = await getTournament(slug);
  if (!data) return { title: "Tournament" };
  const t = data.tournament;
  return {
    title: t.shortName ?? t.name,
    description: `${t.name}: full schedule, results and league table${t.city ? ` · ${t.city}` : ""}. ${tournamentDates(t)}.`,
  };
}

const stageTitles: Record<Stage, string> = {
  league: "League stage",
  quarter: "Quarter-finals",
  semi: "Semi-finals",
  third: "Third place",
  final: "Final",
  friendly: "Friendlies",
};
const stageOrder: Stage[] = ["league", "quarter", "semi", "third", "final", "friendly"];

const day = (iso: string) => new Intl.DateTimeFormat("en-IN", { day: "2-digit", timeZone: "UTC" }).format(new Date(`${iso}T00:00:00Z`));
const month = (iso: string) => new Intl.DateTimeFormat("en-IN", { month: "short", timeZone: "UTC" }).format(new Date(`${iso}T00:00:00Z`));
const weekday = (iso: string) => new Intl.DateTimeFormat("en-IN", { weekday: "long", timeZone: "UTC" }).format(new Date(`${iso}T00:00:00Z`));

/** A match that has no result yet: date tile, the two teams, time and venue. */
function FixtureTile({ f }: { f: TournamentFixture }) {
  const live = f.status === "live";
  const off = f.status === "abandoned";
  return (
    <article className={cn("flex items-center gap-4 rounded-2xl bg-white p-4 shadow-[0_8px_22px_rgba(15,46,99,0.06)] ring-1 sm:p-5", live ? "ring-2 ring-ball/60" : "ring-line")}>
      <div className="grid w-14 shrink-0 place-items-center rounded-xl bg-stadium px-2 py-2.5 text-center text-white">
        {f.date ? (
          <>
            <span className="font-heading text-xl font-bold leading-none tabular-nums">{day(f.date)}</span>
            <span className="mt-1 text-[10px] font-bold uppercase tracking-[0.16em] text-gold">{month(f.date)}</span>
          </>
        ) : (
          <span className="text-[10px] font-bold uppercase leading-tight tracking-[0.1em] text-white/70">Date TBA</span>
        )}
      </div>
      <div className="min-w-0 flex-1">
        <p className="flex flex-wrap items-center gap-2 text-[11px] font-bold uppercase tracking-[0.14em] text-royal">
          {f.label ?? (f.matchNo ? `Match ${f.matchNo}` : stageTitles[f.stage])}
          {live ? (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-ball px-2 py-0.5 text-white">
              <span className="size-1.5 animate-pulse rounded-full bg-white" aria-hidden="true" />
              Live
            </span>
          ) : null}
          {off ? <span className="rounded-full bg-slate-100 px-2 py-0.5 text-slate-500">Abandoned</span> : null}
        </p>
        <p className="mt-1 font-heading text-lg font-bold leading-snug text-navy">
          {f.teamA} <span className="font-sans text-sm font-normal text-slate-400">v</span> {f.teamB}
        </p>
        <p className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-500">
          {f.date ? (
            <span className="inline-flex items-center gap-1.5">
              <Clock3 className="size-3.5" aria-hidden="true" />
              {weekday(f.date)}
              {f.time ? `, ${f.time}` : ""}
            </span>
          ) : null}
          {f.venue ? (
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="size-3.5" aria-hidden="true" />
              {f.venue}
            </span>
          ) : null}
        </p>
      </div>
    </article>
  );
}

function MatchList({ matches }: { matches: TournamentFixture[] }) {
  return (
    <Reveal stagger={70} className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {matches.map((f) => (f.result ? <ResultCard key={f.id} result={f.result} /> : <FixtureTile key={f.id} f={f} />))}
    </Reveal>
  );
}

async function Body({ params }: { params: PageProps<"/fixtures/[slug]">["params"] }) {
  const { slug } = await params;
  const data = await getTournament(slug);
  if (!data) notFound();
  const { tournament: t, fixtures } = data;
  const standings = (await getLeagueStandings()).filter((g) => g.tournament === (t.shortName ?? t.name));
  const stages = stageOrder.map((stage) => ({ stage, matches: fixtures.filter((f) => f.stage === stage) })).filter((s) => s.matches.length);

  const facts = [
    { icon: CalendarDays, label: "Dates", value: tournamentDates(t) },
    { icon: MapPin, label: "Venue", value: t.venue ?? t.city ?? "To be announced" },
    { icon: ListOrdered, label: "Matches", value: fixtures.length ? `${t.played} of ${fixtures.length} played` : "Schedule coming" },
  ];

  return (
    <>
      <PageHeader
        eyebrow={t.season ? `Tournament · ${t.season}` : "Tournament"}
        title={t.shortName ?? t.name}
        description={t.shortName && t.shortName !== t.name ? t.name : (t.format ?? undefined)}
        crumbs={[{ label: "Fixtures & Results", href: "/fixtures" }, { label: t.shortName ?? t.name }]}
      />

      <section className="border-b border-line bg-white">
        <div className="mx-auto grid max-w-7xl gap-4 px-4 py-6 sm:grid-cols-3 sm:px-6">
          {facts.map((f) => (
            <div key={f.label} className="flex items-center gap-3">
              <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-royal/10 text-royal">
                <f.icon className="size-5" aria-hidden="true" />
              </span>
              <span className="min-w-0">
                <span className="block text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500">{f.label}</span>
                <span className="block font-bold text-navy">{f.value}</span>
              </span>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-surface py-14 lg:py-20">
        <div className="mx-auto max-w-7xl space-y-14 px-4 sm:px-6">
          {t.format || t.notes ? (
            <Reveal className="max-w-3xl space-y-3 text-[17px] leading-relaxed text-slate-600">
              {t.format && t.shortName && t.shortName !== t.name ? <p>{t.format}</p> : null}
              {t.notes ? <p>{t.notes}</p> : null}
            </Reveal>
          ) : null}

          {stages.length ? (
            stages.map(({ stage, matches }) => {
              const groups = stage === "league" ? Array.from(new Set(matches.map((m) => m.group ?? ""))).sort() : [""];
              return (
                <div key={stage}>
                  <SectionHeading eyebrow={`${matches.length} ${matches.length === 1 ? "match" : "matches"}`} title={stageTitles[stage]} />
                  <div className="mt-8 space-y-10">
                    {groups.map((g) => (
                      <div key={g || "all"}>
                        {g ? <h3 className="mb-4 font-heading text-xl font-bold text-navy">Group {g}</h3> : null}
                        <MatchList matches={matches.filter((m) => stage !== "league" || (m.group ?? "") === g)} />
                      </div>
                    ))}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="grid place-items-center rounded-3xl bg-white px-6 py-14 text-center ring-1 ring-line">
              <Trophy className="size-10 text-gold-deep" aria-hidden="true" />
              <p className="mt-4 font-heading text-2xl font-bold text-navy">Schedule coming soon</p>
              <p className="mt-2 max-w-md text-slate-500">Matches appear here as soon as SSCFI publishes the draw.</p>
            </div>
          )}

          {standings.length ? (
            <div>
              <SectionHeading eyebrow="League table" title="Standings" description="Two points for a win or a walkover, one for a tie. Level teams are split by run difference." />
              <Reveal stagger className="mt-8 grid gap-6 lg:grid-cols-2">
                {standings.map((g) => (
                  <StandingsTable key={g.group} group={g} />
                ))}
              </Reveal>
            </div>
          ) : null}

          <Link href="/fixtures" className="inline-flex items-center gap-2 font-bold text-royal hover:text-navy">
            <ArrowLeft className="size-4" aria-hidden="true" />
            All fixtures and results
          </Link>
        </div>
      </section>
    </>
  );
}

export default function TournamentPage({ params }: PageProps<"/fixtures/[slug]">) {
  return (
    <Suspense fallback={<div className="min-h-[60vh] animate-pulse bg-surface" />}>
      <Body params={params} />
    </Suspense>
  );
}
