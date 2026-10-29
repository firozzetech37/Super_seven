import Link from "next/link";
import { ArrowRight, CalendarDays, MapPin, Users } from "lucide-react";
import type { UpcomingFixture } from "@/lib/data/fixtures";
import { formatMatchDate } from "@/lib/queries/fixtures";

export function MatchCard({ fixture }: { fixture: UpcomingFixture }) {
  return (
    <article className="group card-premium flex flex-col rounded-2xl bg-white p-6 ring-1 ring-line transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_18px_40px_rgba(15,46,99,0.12)]">
      <div className="flex items-center justify-between gap-3">
        <span className="rounded-full bg-gold/15 px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.16em] text-gold-deep">Upcoming</span>
        {fixture.sample ? (
          <span className="rounded-full bg-surface px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-500 ring-1 ring-line">
            Sample
          </span>
        ) : null}
      </div>
      <h3 className="mt-4 font-heading text-2xl font-bold leading-tight text-navy">{fixture.title}</h3>
      <ul className="mt-3 space-y-1.5 text-[15px] text-slate-600">
        {fixture.teams ? (
          <li className="flex items-center gap-2 font-bold text-navy">
            <Users className="size-4 shrink-0 text-gold-deep" aria-hidden="true" />
            {fixture.teams}
          </li>
        ) : null}
        <li className="flex items-center gap-2">
          <MapPin className="size-4 shrink-0 text-gold-deep" aria-hidden="true" />
          {fixture.venue ?? fixture.city ?? "Venue to be announced"}
        </li>
        <li className="flex items-center gap-2">
          <CalendarDays className="size-4 shrink-0 text-gold-deep" aria-hidden="true" />
          {formatMatchDate(fixture.date, fixture.time)}
        </li>
      </ul>
      <Link
        href="/register/team"
        className="mt-6 inline-flex items-center gap-1.5 self-start text-sm font-bold text-royal transition-colors hover:text-navy"
      >
        Enter a team
        <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
      </Link>
    </article>
  );
}
