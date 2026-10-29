import Link from "next/link";
import { ArrowRight, Briefcase, CalendarCheck, Check } from "lucide-react";
import { GroundWatermark } from "@/components/layout/ground-watermark";
import { Reveal } from "@/components/motion/reveal";

const included = [
  "Seven-a-side matches of seven overs, so a whole office plays inside an afternoon",
  "Umpires and scorers from SSCFI, with the official rule book",
  "Any city: we work with the nearest district association for a ground",
  "Trophies, photographs and a results sheet for your intranet",
];

const steps = [
  { title: "Tell us the date, city and headcount.", text: "Use the enquiry form with the subject set to corporate." },
  { title: "We confirm a ground and officials", text: "Within a week, through the nearest district association." },
];

/** Corporate Fun Fridays and corporate days, with a button that preselects the enquiry type. */
export function CorporateCard() {
  return (
    <Reveal
      from="scale"
      className="group/corp grid overflow-hidden rounded-[2rem] bg-white shadow-[0_24px_56px_rgba(15,46,99,0.12)] ring-1 ring-line lg:grid-cols-[minmax(0,1fr)_420px]"
    >
      <div className="relative p-6 sm:p-10">
        <span aria-hidden="true" className="pointer-events-none absolute -left-24 -top-24 size-64 rounded-full bg-royal/[0.06] blur-3xl" />
        <p className="relative flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.24em] text-royal">
          <span aria-hidden="true" className="h-px w-8 bg-gold-deep" />
          Corporate bookings
        </p>
        <h2 className="relative mt-3 font-heading text-3xl font-bold leading-tight text-ink sm:text-4xl">
          Corporate Fun Fridays and <span className="text-royal">corporate days</span>
        </h2>
        <p className="relative mt-4 max-w-xl text-[17px] leading-relaxed text-slate-600">
          Super Seven was made for a two-hour window. Bring your team to the ground on a Friday afternoon, or book a
          full day of matches between departments.
        </p>
        <Reveal as="ul" stagger={90} className="relative mt-7 grid gap-3 sm:grid-cols-2">
          {included.map((item) => (
            <li
              key={item}
              className="group flex items-start gap-3 rounded-2xl bg-surface p-4 text-[15px] leading-snug text-slate-600 ring-1 ring-line transition duration-300 hover:-translate-y-0.5 hover:bg-white hover:shadow-[0_14px_30px_rgba(15,46,99,0.08)]"
            >
              <span className="grid size-7 shrink-0 place-items-center rounded-full bg-status-onboarded/40 text-ground transition duration-300 group-hover:bg-ground group-hover:text-white">
                <Check className="size-4" aria-hidden="true" />
              </span>
              {item}
            </li>
          ))}
        </Reveal>
      </div>

      <div className="relative isolate flex flex-col gap-6 overflow-hidden bg-stadium p-6 text-white sm:p-10">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
          <GroundWatermark className="parallax-slow absolute -right-40 -top-10 w-[560px] text-white/[0.07]" />
          <div className="absolute -bottom-24 -right-10 size-64 rounded-full bg-gold/20 blur-3xl" />
        </div>
        <span className="grid size-14 place-items-center rounded-2xl bg-white/10 text-gold ring-1 ring-white/20 transition duration-300 group-hover/corp:-rotate-6 group-hover/corp:bg-gold group-hover/corp:text-navy">
          <Briefcase className="size-6" aria-hidden="true" />
        </span>
        <ol className="space-y-4">
          {steps.map((s, i) => (
            <li key={s.title} className="relative flex gap-4">
              {i < steps.length - 1 ? (
                <span aria-hidden="true" className="absolute left-[15px] top-9 h-[calc(100%-1.5rem)] w-px bg-gold/40" />
              ) : null}
              <span className="grid size-8 shrink-0 place-items-center rounded-full bg-gold font-heading text-sm font-bold text-navy shadow-[0_0_0_5px_rgba(217,174,86,0.15)]">
                {i + 1}
              </span>
              <div className="pt-0.5">
                <p className="font-bold">{s.title}</p>
                <p className="mt-0.5 text-sm text-white/70">{s.text}</p>
              </div>
            </li>
          ))}
        </ol>
        <p className="flex items-center gap-3 rounded-2xl bg-white/[0.06] px-4 py-3 text-sm text-white/80 ring-1 ring-white/10">
          <CalendarCheck className="size-4 shrink-0 text-gold" aria-hidden="true" />
          Fridays fill first. Book three weeks ahead where possible.
        </p>
        <Link
          href="/contact?type=corporate#enquiry"
          className="group mt-auto inline-flex items-center justify-center gap-2 rounded-full bg-gold px-6 py-3.5 font-bold text-navy shadow-[0_12px_28px_rgba(4,15,42,0.45)] transition hover:bg-gold-deep motion-safe:animate-glow"
        >
          Book a corporate day
          <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
        </Link>
      </div>
    </Reveal>
  );
}
