import Link from "next/link";
import { ArrowRight, CalendarDays, MapPin } from "lucide-react";
import { GroundWatermark } from "@/components/layout/ground-watermark";
import type { TournamentSummary } from "@/lib/queries/fixtures";

const fmt = (iso: string) => new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" }).format(new Date(`${iso}T00:00:00Z`));

export function tournamentDates(t: Pick<TournamentSummary, "startDate" | "endDate">) {
  if (!t.startDate) return "Dates to be announced";
  return t.endDate && t.endDate !== t.startDate ? `${fmt(t.startDate)} – ${fmt(t.endDate)}` : fmt(t.startDate);
}

/** Tournament tile for the Fixtures page: stadium band with season and city, then dates and progress. */
export function TournamentCard({ t }: { t: TournamentSummary }) {
  const progress = t.matches ? Math.round((t.played / t.matches) * 100) : 0;
  const state = !t.matches ? "Schedule coming" : t.played === t.matches ? "Completed" : t.played ? "In progress" : "Upcoming";
  return (
    <Link
      href={`/fixtures/${t.slug}`}
      className="group card-premium flex h-full flex-col overflow-hidden rounded-3xl bg-white shadow-[0_12px_30px_rgba(15,46,99,0.07)] ring-1 ring-line transition duration-300 hover:-translate-y-1.5 hover:shadow-[0_28px_60px_rgba(15,46,99,0.14)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-gold"
    >
      <span className="relative isolate block overflow-hidden bg-stadium px-6 pb-6 pt-5 text-white">
        <GroundWatermark className="absolute -right-16 -top-12 -z-10 w-72 text-white/[0.08] transition-transform duration-700 ease-out group-hover:-rotate-3 group-hover:scale-110" />
        <span aria-hidden="true" className="absolute inset-x-0 bottom-0 h-px bg-[linear-gradient(90deg,transparent,rgba(217,174,86,0.9)_20%,rgba(217,174,86,0.9)_80%,transparent)]" />
        <span className="flex items-center justify-between gap-3">
          <span className="rounded-full bg-white/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-gold ring-1 ring-white/15">{state}</span>
          {t.season ? <span className="font-heading text-2xl font-bold text-white/25">{t.season}</span> : null}
        </span>
        <span className="mt-4 block font-heading text-2xl font-bold leading-tight">{t.shortName ?? t.name}</span>
        {t.shortName && t.shortName !== t.name ? <span className="mt-1 block text-sm text-white/65">{t.name}</span> : null}
      </span>
      <span className="flex flex-1 flex-col px-6 py-5">
        <span className="flex flex-wrap gap-x-4 gap-y-1.5 text-sm text-slate-600">
          <span className="inline-flex items-center gap-1.5">
            <CalendarDays className="size-4 text-royal" aria-hidden="true" />
            {tournamentDates(t)}
          </span>
          {t.city ? (
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="size-4 text-royal" aria-hidden="true" />
              {t.city}
            </span>
          ) : null}
        </span>
        {t.matches ? (
          <span className="mt-5 block">
            <span className="flex justify-between text-[11px] font-bold uppercase tracking-[0.14em] text-slate-500">
              <span>
                {t.played} of {t.matches} played
              </span>
              <span className="tabular-nums">{progress}%</span>
            </span>
            <span className="mt-2 block h-1.5 overflow-hidden rounded-full bg-surface ring-1 ring-line">
              <span className="block h-full rounded-full bg-[linear-gradient(90deg,#d9ae56,#c99b43)]" style={{ width: `${progress}%` }} />
            </span>
          </span>
        ) : null}
        <span className="mt-auto flex items-center justify-between pt-5 text-sm font-bold text-royal">
          Schedule & results
          <span className="grid size-9 place-items-center rounded-full bg-surface ring-1 ring-line transition duration-300 group-hover:bg-royal group-hover:text-white group-hover:ring-royal">
            <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5" aria-hidden="true" />
          </span>
        </span>
      </span>
    </Link>
  );
}
