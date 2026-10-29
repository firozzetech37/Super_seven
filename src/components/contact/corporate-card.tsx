import Link from "next/link";
import { ArrowRight, Briefcase, CalendarCheck, Check } from "lucide-react";

const included = [
  "Seven-a-side matches of seven overs, so a whole office plays inside an afternoon",
  "Umpires and scorers from SSCFI, with the official rule book",
  "Any city: we work with the nearest district association for a ground",
  "Trophies, photographs and a results sheet for your intranet",
];

/** Corporate Fun Fridays and corporate days, with a button that preselects the enquiry type. */
export function CorporateCard() {
  return (
    <div className="grid overflow-hidden rounded-3xl bg-white shadow-[0_18px_40px_rgba(15,46,99,0.1)] ring-1 ring-line lg:grid-cols-[1fr_380px]">
      <div className="p-8 sm:p-10">
        <p className="flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.24em] text-royal">
          <span aria-hidden="true" className="h-px w-8 bg-gold-deep" />
          Corporate bookings
        </p>
        <h2 className="mt-3 font-heading text-3xl font-bold leading-tight text-ink">Corporate Fun Fridays and corporate days</h2>
        <p className="mt-3 max-w-xl text-[17px] leading-relaxed text-slate-600">
          Super Seven was made for a two-hour window. Bring your team to the ground on a Friday afternoon, or book a
          full day of matches between departments.
        </p>
        <ul className="mt-6 grid gap-3 sm:grid-cols-2">
          {included.map((item) => (
            <li key={item} className="flex items-start gap-3 text-[15px] text-slate-600">
              <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-status-onboarded/40 text-ground">
                <Check className="size-3.5" aria-hidden="true" />
              </span>
              {item}
            </li>
          ))}
        </ul>
      </div>
      <div className="flex flex-col justify-between gap-6 bg-[linear-gradient(160deg,#1c4fa0,#0f2e63)] p-8 text-white sm:p-10">
        <div className="flex items-start gap-4">
          <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-white/10 text-gold ring-1 ring-white/20">
            <Briefcase className="size-6" aria-hidden="true" />
          </span>
          <div>
            <p className="font-bold">Tell us the date, city and headcount.</p>
            <p className="mt-1 text-sm text-white/75">We confirm a ground and officials within a week.</p>
          </div>
        </div>
        <div className="flex items-center gap-3 text-sm text-white/75">
          <CalendarCheck className="size-4 text-gold" aria-hidden="true" />
          Fridays fill first. Book three weeks ahead where possible.
        </div>
        <Link
          href="/contact?type=corporate#enquiry"
          className="group inline-flex items-center justify-center gap-2 rounded-full bg-gold px-6 py-3 font-bold text-navy shadow-[0_10px_24px_rgba(4,15,42,0.35)] transition hover:bg-gold-deep"
        >
          Book a corporate day
          <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
        </Link>
      </div>
    </div>
  );
}
