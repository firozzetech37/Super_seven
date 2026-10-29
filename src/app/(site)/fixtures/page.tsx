import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CalendarDays, ExternalLink, FileText, Table2, Trophy } from "lucide-react";
import { JumpLinks } from "@/components/fixtures/jump-links";
import { MatchCard } from "@/components/fixtures/match-card";
import { ResultCard } from "@/components/fixtures/result-card";
import { PageHeader } from "@/components/layout/page-header";
import { SectionHeading } from "@/components/layout/section-heading";
import { StandingsTable } from "@/components/fixtures/standings-table";
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
  { label: "Teams", value: String(tournament2014.teams) },
  { label: "Groups", value: String(tournament2014.groups) },
  { label: "Matches", value: String(tournament2014.matches) },
  { label: "Dates", value: tournament2014.dates },
];

export default async function FixturesPage() {
  const [upcomingFixtures, standings] = await Promise.all([getUpcomingFixtures(), getLeagueStandings()]);
  const final = results2014.find((r) => r.stage === "final");
  const knockouts = results2014.filter((r) => r.stage === "semi" || r.stage === "quarter");
  const league = results2014.filter((r) => r.stage === "league");

  return (
    <>
      <PageHeader
        eyebrow="Door 2 of 7"
        title="Fixtures & Results"
        description="Fixtures and results by tournament and city, with scores and league tables."
        crumbs={[{ label: "Fixtures & Results" }]}
        aside={<JumpLinks links={jump} />}
      />

      <section id="upcoming" className="scroll-mt-28 bg-white py-14 lg:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <SectionHeading
            eyebrow="Upcoming"
            title="Next matches"
            description="The same fixtures as the ticker at the top of every page, straight from the fixtures database. Dates and venues appear as SSCFI confirms each event."
            action={
              <Link href="/register/team" className="inline-flex items-center gap-2 font-bold text-royal underline-offset-4 hover:underline">
                Enter a team
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            }
          />
          <Reveal stagger className="mt-10 grid gap-5 md:grid-cols-3">
            {upcomingFixtures.map((f) => (
              <MatchCard key={f.id} fixture={f} />
            ))}
          </Reveal>
        </div>
      </section>

      <section id="results" className="scroll-mt-28 border-t border-line bg-surface py-14 lg:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <SectionHeading
            eyebrow="Results"
            title={tournament2014.shortName}
            description={`${tournament2014.venue}. Knockout scores from the official result sheets.`}
          />
          {final ? (
            <div className="mt-10">
              <ResultCard result={final} featured />
            </div>
          ) : null}
          <div className="mt-5 grid gap-5 md:grid-cols-2">
            {knockouts.map((r) => (
              <ResultCard key={r.id} result={r} />
            ))}
          </div>

          <div className="mt-10 grid gap-5 lg:grid-cols-[1fr_1.2fr]">
            {league.map((r) => (
              <ResultCard key={r.id} result={r} />
            ))}
            <div className="rounded-2xl bg-white p-6 ring-1 ring-line">
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-royal">League stage · {leagueSummary2014.dates}</p>
              <dl className="mt-4 grid grid-cols-3 gap-3">
                {[
                  { label: "Matches", value: leagueSummary2014.matches },
                  { label: "Walkovers", value: leagueSummary2014.walkovers },
                  { label: "Ties", value: 1 },
                ].map((s) => (
                  <div key={s.label} className="rounded-xl bg-surface p-4">
                    <dt className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500">{s.label}</dt>
                    <dd className="mt-1 font-heading text-3xl font-bold text-navy">{s.value}</dd>
                  </div>
                ))}
              </dl>
              <p className="mt-4 text-sm text-slate-500">
                All 24 league scorecards are in the official PDF in the archive below; they move into the database in Phase 2.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="tables" className="scroll-mt-28 bg-white py-14 lg:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <SectionHeading
            eyebrow="League tables"
            title="Standings by group"
            description="Computed by the database from stored results: two points for a win, one for a tie, a walkover counts as a win."
          />
          {standings.length ? (
            <Reveal stagger className="mt-10 grid gap-5 lg:grid-cols-2">
              {standings.map((g) => (
                <StandingsTable key={`${g.tournament}-${g.group}`} group={g} />
              ))}
            </Reveal>
          ) : (
            <div className="mt-10 rounded-3xl bg-surface p-8 ring-1 ring-line">
              <span className="grid size-12 place-items-center rounded-2xl bg-royal/10 text-royal">
                <Table2 className="size-6" aria-hidden="true" />
              </span>
              <h3 className="mt-5 font-heading text-2xl font-bold text-navy">No league results stored yet</h3>
              <p className="mt-2 text-slate-600">Tables appear here automatically as results are entered. Nothing is typed by hand, so nothing can go stale.</p>
            </div>
          )}
        </div>
      </section>

      <section id="archive" className="scroll-mt-28 border-t border-line bg-surface py-14 lg:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <SectionHeading eyebrow="Archive" title={tournament2014.name} description={tournament2014.format} />
          <div className="mt-10 grid gap-5 lg:grid-cols-[1.2fr_1fr]">
            <div className="relative overflow-hidden rounded-3xl bg-[linear-gradient(150deg,#1c4fa0,#0f2e63_60%,#0b2550)] p-8 text-white shadow-[0_24px_50px_rgba(15,46,99,0.3)]">
              <span aria-hidden="true" className="pointer-events-none absolute -right-16 -top-16 size-56 rounded-full bg-white/10 blur-3xl" />
              <div className="flex items-center gap-3">
                <span className="grid size-12 place-items-center rounded-2xl bg-white/10 text-gold ring-1 ring-white/20">
                  <Trophy className="size-6" aria-hidden="true" />
                </span>
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-gold">Amroha, Uttar Pradesh</p>
                  <h3 className="font-heading text-2xl font-bold">{tournament2014.shortName}</h3>
                </div>
              </div>
              <dl className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {archiveFacts.map((f) => (
                  <div key={f.label} className="rounded-xl bg-white/10 p-3 ring-1 ring-white/15">
                    <dt className="text-[11px] font-bold uppercase tracking-[0.16em] text-white/60">{f.label}</dt>
                    <dd className="mt-1 font-heading text-xl font-bold text-white">{f.value}</dd>
                  </div>
                ))}
              </dl>
              <ul className="mt-6 space-y-2 text-[15px] text-white/85">
                <li className="flex gap-3">
                  <CalendarDays className="mt-0.5 size-4 shrink-0 text-gold" aria-hidden="true" />
                  {tournament2014.sessions}
                </li>
                <li className="flex gap-3">
                  <Trophy className="mt-0.5 size-4 shrink-0 text-gold" aria-hidden="true" />
                  Winner: Uttar Pradesh (Host), beating Mumbai 111–52 in the final. {tournament2014.friendly}
                </li>
              </ul>
            </div>
            <div className="rounded-3xl bg-white p-6 ring-1 ring-line sm:p-8">
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-royal">Official documents</p>
              <ul className="mt-4 divide-y divide-line">
                {tournament2014.documents.map((d) => (
                  <li key={d.href}>
                    <a
                      href={d.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center gap-3 py-3 font-bold text-navy transition-colors hover:text-royal"
                    >
                      <FileText className="size-5 shrink-0 text-gold-deep" aria-hidden="true" />
                      <span className="flex-1">{d.label}</span>
                      <ExternalLink className="size-4 text-slate-300 transition group-hover:text-royal" aria-hidden="true" />
                    </a>
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-xs text-slate-500">PDFs open on the current sscfi.org site in a new tab until they are moved into Governance › Documents.</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
