import type { Metadata } from "next";
import Link from "next/link";
import { Fragment } from "react";
import { ArrowRight, ArrowUpRight, CalendarDays, ChevronRight, FileText, MapPin, Trophy } from "lucide-react";
import { JumpLinks } from "@/components/fixtures/jump-links";
import { MatchCard } from "@/components/fixtures/match-card";
import { ResultCard } from "@/components/fixtures/result-card";
import { PageHeader } from "@/components/layout/page-header";
import { SectionHeading } from "@/components/layout/section-heading";
import { StandingsEmpty, StandingsTable } from "@/components/fixtures/standings-table";
import { GroundWatermark } from "@/components/layout/ground-watermark";
import { CountUp } from "@/components/motion/count-up";
import { leagueSummary2014, results2014, tournament2014 } from "@/lib/data/fixtures";
import { getLeagueStandings, getUpcomingFixtures } from "@/lib/queries/fixtures";
import { Reveal } from "@/components/motion/reveal";

export const metadata: Metadata = {
  title: "Fixtures & Results",
  description: "Upcoming Super Seven fixtures, results from every stage, league tables and the NCL S7 Amroha 2014 archive.",
};

const jump = [
  { label: "Upcoming", href: "#upcoming" },
  { label: "Results", href: "#results" },
  { label: "League tables", href: "#tables" },
  { label: "2014 archive", href: "#archive" },
];

const archiveFacts = [
  { label: "Teams", value: tournament2014.teams },
  { label: "Groups", value: tournament2014.groups },
  { label: "Matches", value: tournament2014.matches },
];

const pointsKey = [
  { points: 2, label: "Win" },
  { points: 1, label: "Tie" },
  { points: 2, label: "Walkover" },
];

const columnKey = [
  ["P", "Played"],
  ["W", "Won"],
  ["L", "Lost"],
  ["T", "Tied"],
  ["RF", "Runs for"],
  ["RA", "Runs against"],
] as const;

/** Small divider heading for each stage of the results archive. */
function StageHeading({ title, note }: { title: string; note?: string }) {
  return (
    <Reveal className="mb-6 mt-14 flex items-center gap-4">
      <h3 className="font-heading text-2xl font-bold text-navy">{title}</h3>
      <span aria-hidden="true" className="h-px flex-1 bg-[linear-gradient(90deg,#c99b43,rgba(226,229,239,1)_40%)]" />
      {note ? <span className="shrink-0 text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500">{note}</span> : null}
    </Reveal>
  );
}

export default async function FixturesPage() {
  const [upcomingFixtures, standings] = await Promise.all([getUpcomingFixtures(), getLeagueStandings()]);
  const final = results2014.find((r) => r.stage === "final");
  const semis = results2014.filter((r) => r.stage === "semi");
  const quarters = results2014.filter((r) => r.stage === "quarter");
  const league = results2014.filter((r) => r.stage === "league");
  const winners = (rs: typeof results2014) => rs.flatMap((r) => (r.winner ? [r.winner] : []));
  const knockoutPath = [
    { label: "Quarter-final winners", teams: winners(quarters) },
    { label: "Finalists", teams: winners(semis) },
    { label: "Champion", teams: final ? winners([final]) : [] },
  ].filter((s) => s.teams.length);
  const plural = (n: number) => `${n} match${n === 1 ? "" : "es"}`;

  return (
    <>
      <PageHeader
        eyebrow="Door 2 of 7"
        title="Fixtures & Results"
        description="Fixtures and results by tournament and city, with scores and league tables."
        crumbs={[{ label: "Fixtures & Results" }]}
        aside={<JumpLinks links={jump} />}
      />

      <section id="upcoming" className="relative isolate scroll-mt-28 overflow-hidden bg-white py-16 lg:py-20">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute -right-40 -top-40 size-[520px] rounded-full bg-royal/[0.06] blur-3xl" />
          <GroundWatermark className="parallax-slow absolute -left-64 bottom-0 w-[760px] text-navy/[0.035]" />
        </div>
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <SectionHeading
            eyebrow="Upcoming"
            title={
              <>
                Next <span className="text-royal">matches</span>
              </>
            }
            description="The same fixtures as the ticker at the top of every page, straight from the fixtures database. Dates and venues appear as SSCFI confirms each event."
            action={
              <Link
                href="/register/team"
                className="group inline-flex items-center gap-2 rounded-full bg-gold px-6 py-3 font-bold text-navy shadow-[0_12px_28px_rgba(15,46,99,0.18)] transition hover:bg-gold-deep"
              >
                Enter a team
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
              </Link>
            }
          />
          <Reveal stagger={110} className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {upcomingFixtures.map((f, i) => (
              <MatchCard key={f.id} fixture={f} index={i} />
            ))}
          </Reveal>
        </div>
      </section>

      <section id="results" className="scroll-mt-28 border-t border-line bg-surface py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <SectionHeading
            eyebrow="Results"
            title={tournament2014.shortName}
            description={`${tournament2014.venue}. Knockout scores from the official result sheets.`}
          />
          {final ? (
            <Reveal from="scale" className="mt-10">
              <ResultCard result={final} variant="final" />
            </Reveal>
          ) : null}

          {semis.length ? (
            <>
              <StageHeading title="Semi-finals" note={plural(semis.length)} />
              <Reveal stagger={120} className="grid gap-6 md:grid-cols-2">
                {semis.map((r) => (
                  <ResultCard key={r.id} result={r} variant="photo" />
                ))}
              </Reveal>
            </>
          ) : null}

          {quarters.length ? (
            <>
              <StageHeading title="Quarter-finals" note={plural(quarters.length)} />
              <Reveal stagger={90} className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
                {quarters.map((r) => (
                  <ResultCard key={r.id} result={r} />
                ))}
              </Reveal>
            </>
          ) : null}

          <StageHeading title="League stage" note={leagueSummary2014.dates} />
          <Reveal stagger={120} className="grid gap-5 lg:grid-cols-[1fr_1.3fr]">
            {league.map((r) => (
              <ResultCard key={r.id} result={r} />
            ))}
            <div className="relative overflow-hidden rounded-3xl bg-white p-6 shadow-[0_12px_30px_rgba(15,46,99,0.07)] ring-1 ring-line sm:p-7">
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-royal">League stage · {leagueSummary2014.dates}</p>
              <dl className="relative mt-5 grid grid-cols-3 gap-3">
                {[
                  { label: "Matches", value: leagueSummary2014.matches },
                  { label: "Walkovers", value: leagueSummary2014.walkovers },
                  { label: "Ties", value: 1 },
                ].map((s) => (
                  <div key={s.label} className="flex flex-col-reverse rounded-2xl bg-stadium p-4 text-center ring-1 ring-navy/10">
                    <dt className="mt-1 text-[10px] font-bold uppercase tracking-[0.16em] text-white/65 sm:text-[11px]">{s.label}</dt>
                    <dd className="font-heading text-3xl font-bold tabular-nums text-gold sm:text-4xl">
                      <CountUp value={s.value} />
                    </dd>
                  </div>
                ))}
              </dl>
              <p className="relative mt-5 text-sm leading-relaxed text-slate-500">
                All 24 league scorecards are in the official PDF in the archive below; they move into the database in Phase 2.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      <section id="tables" className="relative isolate scroll-mt-28 overflow-hidden bg-stadium py-16 text-white lg:py-24">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:22px_22px] [mask-image:radial-gradient(60%_70%_at_75%_40%,#000,transparent)]" />
          <div className="absolute -left-40 top-1/3 size-[560px] rounded-full bg-royal/40 blur-[120px]" />
          <GroundWatermark className="parallax-slow absolute -right-60 -top-16 w-[900px] text-white/[0.05]" />
          <div className="absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(217,174,86,0.7)_20%,rgba(217,174,86,0.7)_80%,transparent)]" />
        </div>
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <SectionHeading
            tone="dark"
            eyebrow="League tables"
            title={
              <>
                Standings <span className="text-gold">by group</span>
              </>
            }
            description="Computed by the database from stored results: two points for a win, one for a tie, a walkover counts as a win."
          />
          <div className="mt-10 grid items-start gap-6 lg:grid-cols-[1.6fr_1fr]">
            {standings.length ? (
              <Reveal stagger className="grid gap-6">
                {standings.map((g) => (
                  <StandingsTable key={`${g.tournament}-${g.group}`} group={g} />
                ))}
              </Reveal>
            ) : (
              <Reveal from="scale">
                <StandingsEmpty />
              </Reveal>
            )}
            <Reveal from="right" delay={120} className="rounded-3xl bg-white/[0.05] p-6 ring-1 ring-white/10 backdrop-blur sm:p-7">
              <p className="flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.24em] text-gold">
                <span aria-hidden="true" className="h-px w-8 bg-gold" />
                How points work
              </p>
              <ul className="mt-5 grid grid-cols-3 gap-3 text-center">
                {pointsKey.map((k) => (
                  <li key={k.label} className="rounded-2xl bg-white/[0.06] px-2 py-4 ring-1 ring-white/10">
                    <span className="block font-heading text-3xl font-bold tabular-nums text-gold">{k.points}</span>
                    <span className="mt-1 block text-[10px] font-bold uppercase leading-tight tracking-[0.14em] text-white/65 sm:text-[11px]">{k.label}</span>
                  </li>
                ))}
              </ul>
              <dl className="mt-6 grid grid-cols-2 gap-x-4 gap-y-2.5 border-t border-white/10 pt-5 text-sm">
                {columnKey.map(([abbr, label]) => (
                  <div key={abbr} className="flex items-center gap-3">
                    <dt className="grid h-7 min-w-9 place-items-center rounded-lg bg-white/10 px-1.5 text-[11px] font-bold tracking-[0.08em] text-gold ring-1 ring-white/15">{abbr}</dt>
                    <dd className="text-white/75">{label}</dd>
                  </div>
                ))}
              </dl>
              <p className="mt-5 text-xs leading-relaxed text-white/55">Ties on points are split by run difference, then by name.</p>
            </Reveal>
          </div>
        </div>
      </section>

      <section id="archive" className="relative isolate scroll-mt-28 overflow-hidden bg-white py-16 lg:py-20">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute -right-40 top-10 size-[520px] rounded-full bg-gold/[0.08] blur-3xl" />
        </div>
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <SectionHeading eyebrow="Archive" title={tournament2014.name} description={tournament2014.format} />
          <div className="mt-10 grid gap-6 lg:grid-cols-[1.2fr_1fr]">
            <Reveal from="left" className="group relative isolate flex flex-col overflow-hidden rounded-[2rem] bg-stadium p-6 text-white shadow-[0_32px_70px_rgba(15,46,99,0.3)] ring-1 ring-navy/10 sm:p-8">
              <GroundWatermark className="absolute -bottom-24 -right-28 -z-10 w-[560px] text-white/[0.06] transition-transform duration-700 ease-out group-hover:-rotate-3 group-hover:scale-105" />
              <span
                aria-hidden="true"
                className="pointer-events-none absolute -right-4 -top-10 select-none font-heading text-[9rem] font-bold leading-none text-white/[0.04]"
              >
                2014
              </span>
              <div className="relative flex items-center gap-4">
                <span className="grid size-14 shrink-0 place-items-center rounded-2xl bg-gold text-navy shadow-[0_0_0_6px_rgba(217,174,86,0.15)]">
                  <Trophy className="size-7" aria-hidden="true" />
                </span>
                <div>
                  <p className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.2em] text-gold">
                    <MapPin className="size-3.5" aria-hidden="true" />
                    Amroha, Uttar Pradesh
                  </p>
                  <h3 className="mt-1 font-heading text-2xl font-bold sm:text-3xl">{tournament2014.shortName}</h3>
                </div>
              </div>
              <dl className="relative mt-7 grid grid-cols-3 gap-3">
                {archiveFacts.map((f) => (
                  <div key={f.label} className="flex flex-col-reverse rounded-2xl bg-white/[0.06] p-4 text-center ring-1 ring-white/10">
                    <dt className="mt-1 text-[10px] font-bold uppercase tracking-[0.16em] text-white/60 sm:text-[11px]">{f.label}</dt>
                    <dd className="font-heading text-3xl font-bold tabular-nums text-gold sm:text-4xl">
                      <CountUp value={f.value} />
                    </dd>
                  </div>
                ))}
              </dl>
              <div className="relative my-6">
                <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/55">Road to the trophy</p>
                <ol className="mt-3 grid gap-3 sm:grid-cols-[1.4fr_auto_1fr_auto_1fr] sm:items-center">
                  {knockoutPath.map((step, i) => (
                    <Fragment key={step.label}>
                      {i > 0 ? (
                        <li aria-hidden="true" className="hidden text-gold/70 sm:block">
                          <ChevronRight className="size-5" />
                        </li>
                      ) : null}
                      <li className="rounded-2xl bg-white/[0.06] p-3 ring-1 ring-white/10">
                        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-gold">{step.label}</p>
                        <ul className="mt-2 flex flex-wrap gap-1.5">
                          {step.teams.map((t) => (
                            <li
                              key={t}
                              className={
                                step.label === "Champion"
                                  ? "inline-flex items-center gap-1 rounded-full bg-gold px-2.5 py-1 text-xs font-bold text-navy"
                                  : "rounded-full bg-white/10 px-2.5 py-1 text-xs font-bold text-white/85 ring-1 ring-white/10"
                              }
                            >
                              {step.label === "Champion" ? <Trophy className="size-3" aria-hidden="true" /> : null}
                              {t}
                            </li>
                          ))}
                        </ul>
                      </li>
                    </Fragment>
                  ))}
                </ol>
              </div>
              <ul className="relative mt-auto space-y-3 border-t border-white/10 pt-6 text-[15px] text-white/85">
                <li className="flex gap-3">
                  <CalendarDays className="mt-0.5 size-4 shrink-0 text-gold" aria-hidden="true" />
                  <span>
                    <strong className="text-white">{tournament2014.dates}.</strong> {tournament2014.sessions}
                  </span>
                </li>
                <li className="flex gap-3">
                  <Trophy className="mt-0.5 size-4 shrink-0 text-gold" aria-hidden="true" />
                  <span>
                    Winner: <strong className="text-white">Uttar Pradesh (Host)</strong>, beating Mumbai 111–52 in the final. {tournament2014.friendly}
                  </span>
                </li>
              </ul>
            </Reveal>

            <Reveal from="right" delay={120} className="rounded-[2rem] bg-surface p-6 ring-1 ring-line sm:p-8">
              <p className="flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.24em] text-royal">
                <span aria-hidden="true" className="h-px w-8 bg-gold-deep" />
                Official documents
              </p>
              <ul className="mt-5 space-y-2.5">
                {tournament2014.documents.map((d, i) => (
                  <li key={d.href}>
                    <a
                      href={d.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center gap-4 rounded-2xl bg-white p-3 shadow-[0_6px_16px_rgba(15,46,99,0.04)] ring-1 ring-line transition duration-300 hover:translate-x-1 hover:shadow-[0_14px_30px_rgba(15,46,99,0.1)] hover:ring-royal/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
                    >
                      <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-royal/10 text-royal transition duration-300 group-hover:-rotate-6 group-hover:bg-royal group-hover:text-white">
                        <FileText className="size-5" aria-hidden="true" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Document {String(i + 1).padStart(2, "0")}</span>
                        <span className="block font-bold text-navy">{d.label}</span>
                      </span>
                      <ArrowUpRight
                        className="size-4 shrink-0 text-slate-300 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-royal"
                        aria-hidden="true"
                      />
                      <span className="sr-only">(opens in a new tab)</span>
                    </a>
                  </li>
                ))}
              </ul>
              <p className="mt-5 text-xs leading-relaxed text-slate-500">
                PDFs open on the current sscfi.org site in a new tab until they are moved into Governance › Documents.
              </p>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
