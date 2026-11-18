import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CalendarPlus, CalendarRange, Clock3, MapPin, Trophy } from "lucide-react";
import { TournamentForm } from "@/components/admin/fixture-forms";
import { dateOnly, Empty, PageTitle, Panel, PanelSkeleton } from "@/components/admin/ui";
import { requireAdmin } from "@/lib/admin/auth";

export const metadata: Metadata = { title: "Tournaments & fixtures" };

type Row = {
  id: string;
  slug: string;
  name: string;
  short_name: string | null;
  city: string | null;
  start_date: string | null;
  end_date: string | null;
  fixtures: { status: string; match_date: string | null }[];
};

async function Body({ searchParams }: { searchParams: PageProps<"/admin/fixtures">["searchParams"] }) {
  const { db } = await requireAdmin();
  const params = await searchParams;
  const today = new Date().toISOString().slice(0, 10);
  const [{ data: tournaments }, { data: overdue }] = await Promise.all([
    db
      .from("tournaments")
      .select("id, slug, name, short_name, city, start_date, end_date, fixtures(status, match_date)")
      .order("start_date", { ascending: false, nullsFirst: true })
      .returns<Row[]>(),
    db
      .from("fixtures")
      .select("id, team_a, team_b, match_date, tournament_id, tournaments(name, short_name)")
      .in("status", ["scheduled", "live"])
      .lt("match_date", today)
      .order("match_date")
      .limit(12)
      .returns<{ id: string; team_a: string; team_b: string; match_date: string; tournament_id: string; tournaments: { name: string; short_name: string | null } | null }[]>(),
  ]);

  return (
    <div className="space-y-8">
      {params.deleted ? <p className="rounded-xl bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-700 ring-1 ring-emerald-200">Tournament deleted.</p> : null}

      {overdue?.length ? (
        <Panel title="Waiting for a result" description="These matches have been played (their date has passed) but have no result yet." icon={Clock3} className="ring-gold/50">
          <ul className="divide-y divide-line">
            {overdue.map((f) => (
              <li key={f.id}>
                <Link href={`/admin/fixtures/${f.tournament_id}#m-${f.id}`} className="group flex flex-wrap items-center justify-between gap-2 py-3 text-sm">
                  <span className="font-bold text-navy group-hover:text-royal">
                    {f.team_a} v {f.team_b}
                  </span>
                  <span className="flex items-center gap-3 text-slate-500">
                    {f.tournaments?.short_name ?? f.tournaments?.name} · {dateOnly(f.match_date)}
                    <span className="inline-flex items-center gap-1 font-bold text-royal">
                      Enter result <ArrowRight className="size-3.5" aria-hidden="true" />
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </Panel>
      ) : null}

      <section>
        <h2 className="mb-4 font-heading text-xl font-bold text-navy">All tournaments</h2>
        {tournaments?.length ? (
          <ul className="grid gap-4 md:grid-cols-2">
            {tournaments.map((t) => {
              const total = t.fixtures.length;
              const played = t.fixtures.filter((f) => ["completed", "walkover", "abandoned"].includes(f.status)).length;
              const upcoming = t.fixtures.filter((f) => ["scheduled", "live"].includes(f.status) && (!f.match_date || f.match_date >= today)).length;
              return (
                <li key={t.id}>
                  <Link
                    href={`/admin/fixtures/${t.id}`}
                    className="group flex h-full flex-col rounded-2xl bg-white p-5 shadow-[0_8px_24px_rgba(15,46,99,0.05)] ring-1 ring-line transition hover:-translate-y-0.5 hover:shadow-[0_18px_40px_rgba(15,46,99,0.1)] hover:ring-royal/30"
                  >
                    <span className="flex items-start justify-between gap-3">
                      <span className="min-w-0">
                        <span className="block font-heading text-lg font-bold leading-snug text-navy group-hover:text-royal">{t.short_name ?? t.name}</span>
                        {t.short_name ? <span className="block text-sm text-slate-500">{t.name}</span> : null}
                      </span>
                      <Trophy className="size-5 shrink-0 text-gold-deep" aria-hidden="true" />
                    </span>
                    <span className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-[13px] text-slate-500">
                      <span className="inline-flex items-center gap-1.5">
                        <CalendarRange className="size-3.5" aria-hidden="true" />
                        {t.start_date ? `${dateOnly(t.start_date)}${t.end_date && t.end_date !== t.start_date ? ` – ${dateOnly(t.end_date)}` : ""}` : "Dates to be set"}
                      </span>
                      {t.city ? (
                        <span className="inline-flex items-center gap-1.5">
                          <MapPin className="size-3.5" aria-hidden="true" />
                          {t.city}
                        </span>
                      ) : null}
                    </span>
                    <span className="mt-4 grid grid-cols-3 gap-2 border-t border-line pt-4 text-center">
                      {[
                        { label: "Matches", value: total },
                        { label: "Played", value: played },
                        { label: "Upcoming", value: upcoming },
                      ].map((s) => (
                        <span key={s.label} className="rounded-xl bg-surface py-2">
                          <span className="block font-heading text-xl font-bold tabular-nums text-navy">{s.value}</span>
                          <span className="block text-[10px] font-bold uppercase tracking-[0.12em] text-slate-500">{s.label}</span>
                        </span>
                      ))}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        ) : (
          <Empty icon={Trophy} title="No tournaments yet">
            Create the first one below, then add its matches one by one or import the whole schedule from a spreadsheet.
          </Empty>
        )}
      </section>
    </div>
  );
}

export default function FixturesAdminPage({ searchParams }: PageProps<"/admin/fixtures">) {
  return (
    <div className="space-y-8">
      <PageTitle
        eyebrow="Matches"
        title="Tournaments & fixtures"
        description="Everything here appears on the public site within seconds: the ticker on every page, the Fixtures page, each tournament's page and the league tables."
      />
      <Suspense fallback={<PanelSkeleton />}>
        <Body searchParams={searchParams} />
      </Suspense>
      <Panel id="new" title="New tournament" description="Start with the name and dates; you can fill in the rest later." icon={CalendarPlus}>
        <TournamentForm />
      </Panel>
    </div>
  );
}
