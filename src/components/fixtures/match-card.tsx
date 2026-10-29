import Link from "next/link";
import { ArrowRight, CalendarDays, MapPin, Users } from "lucide-react";
import { GroundWatermark } from "@/components/layout/ground-watermark";
import type { UpcomingFixture } from "@/lib/data/fixtures";
import { formatMatchDate } from "@/lib/queries/fixtures";

/** Day and month for the date tile, or null while the date is to be announced. */
function dateTile(iso?: string) {
  if (!iso) return null;
  const date = new Date(`${iso}T00:00:00Z`);
  const part = (o: Intl.DateTimeFormatOptions) => new Intl.DateTimeFormat("en-IN", { ...o, timeZone: "UTC" }).format(date);
  return { day: part({ day: "2-digit" }), month: part({ month: "short" }) };
}

const tile = "grid size-9 shrink-0 place-items-center rounded-xl bg-royal/10 text-royal transition-colors duration-300";

/**
 * Upcoming fixture as a match ticket: navy stadium band with the city, title and a date tile,
 * then the details, with a faint fixture number behind them.
 */
export function MatchCard({ fixture, index = 0 }: { fixture: UpcomingFixture; index?: number }) {
  const when = dateTile(fixture.date);
  return (
    <article className="group card-premium flex h-full flex-col overflow-hidden rounded-3xl bg-white shadow-[0_12px_30px_rgba(15,46,99,0.07)] ring-1 ring-line transition duration-300 hover:-translate-y-1.5 hover:shadow-[0_28px_60px_rgba(15,46,99,0.14)]">
      <div className="relative isolate overflow-hidden bg-stadium px-6 pb-6 pt-5 text-white">
        <GroundWatermark className="absolute -right-16 -top-12 -z-10 w-72 text-white/[0.08] transition-transform duration-700 ease-out group-hover:-rotate-3 group-hover:scale-110" />
        <span
          aria-hidden="true"
          className="absolute inset-y-0 left-0 -z-10 w-1/2 -translate-x-[140%] skew-x-[-20deg] bg-gradient-to-r from-transparent via-white/15 to-transparent transition-transform duration-1000 ease-out group-hover:translate-x-[300%]"
        />
        <span aria-hidden="true" className="absolute inset-x-0 bottom-0 h-px bg-[linear-gradient(90deg,transparent,rgba(217,174,86,0.9)_20%,rgba(217,174,86,0.9)_80%,transparent)]" />

        <div className="flex items-center justify-between gap-3">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-gold ring-1 ring-white/15 backdrop-blur">
            <span aria-hidden="true" className="relative flex size-1.5">
              <span className="absolute inset-0 rounded-full bg-gold motion-safe:animate-ping" />
              <span className="relative size-1.5 rounded-full bg-gold" />
            </span>
            Upcoming
          </span>
          {fixture.sample ? (
            <span className="rounded-full bg-white/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-white/75 ring-1 ring-white/20">
              Sample
            </span>
          ) : null}
        </div>

        <div className="mt-5 flex items-end justify-between gap-4">
          <div className="min-w-0">
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/60">{fixture.city ?? "City to be announced"}</p>
            <h3 className="mt-1.5 font-heading text-2xl font-bold leading-tight text-white">{fixture.title}</h3>
          </div>
          <div
            aria-hidden="true"
            className="grid w-16 shrink-0 place-items-center rounded-2xl bg-white/10 px-2 py-2.5 text-center ring-1 ring-white/20 backdrop-blur transition-colors duration-300 group-hover:bg-gold group-hover:text-navy group-hover:ring-gold"
          >
            {when ? (
              <>
                <span className="font-heading text-2xl font-bold leading-none tabular-nums">{when.day}</span>
                <span className="mt-1 text-[10px] font-bold uppercase tracking-[0.18em]">{when.month}</span>
              </>
            ) : (
              <>
                <span className="font-heading text-lg font-bold leading-none">TBA</span>
                <span className="mt-1 text-[9px] font-bold uppercase tracking-[0.16em] opacity-75">Date</span>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="relative flex flex-1 flex-col px-6 pb-6 pt-5">
        <span
          aria-hidden="true"
          className="pointer-events-none absolute right-5 top-2 select-none font-heading text-[5.5rem] font-bold leading-none text-navy/[0.05] transition-colors duration-300 group-hover:text-gold/20"
        >
          {String(index + 1).padStart(2, "0")}
        </span>
        <ul className="relative mb-6 space-y-2.5 text-[15px] text-slate-600">
          {fixture.teams ? (
            <li className="flex items-center gap-3 font-bold text-navy">
              <span className={`${tile} group-hover:bg-royal group-hover:text-white`}>
                <Users className="size-4" aria-hidden="true" />
              </span>
              {fixture.teams}
            </li>
          ) : null}
          <li className="flex items-center gap-3">
            <span className={tile}>
              <MapPin className="size-4" aria-hidden="true" />
            </span>
            {fixture.venue ?? fixture.city ?? "Venue to be announced"}
          </li>
          <li className="flex items-center gap-3">
            <span className={tile}>
              <CalendarDays className="size-4" aria-hidden="true" />
            </span>
            {formatMatchDate(fixture.date, fixture.time)}
          </li>
        </ul>

        <Link
          href="/register/team"
          className="group/cta relative mt-auto flex items-center justify-between rounded-b-xl border-t border-dashed border-line pt-5 text-sm font-bold text-royal transition-colors hover:text-navy focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-4"
        >
          <span>
            Enter a team<span className="sr-only"> for {fixture.title}</span>
          </span>
          <span aria-hidden="true" className="grid size-10 place-items-center rounded-full bg-surface text-royal ring-1 ring-line transition duration-300 group-hover:bg-royal group-hover:text-white group-hover:ring-royal">
            <ArrowRight className="size-4 transition-transform duration-300 group-hover/cta:translate-x-0.5" />
          </span>
        </Link>
      </div>
    </article>
  );
}
