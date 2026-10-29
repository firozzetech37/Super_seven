import Link from "next/link";
import { ArrowRight, Check, ClipboardList, Clock, Gavel, GraduationCap, Megaphone } from "lucide-react";
import type { Role } from "@/lib/data/careers";

const icons = { umpire: Gavel, scorer: ClipboardList, coach: GraduationCap, coordinator: Megaphone } as const;

/** One open role: icon tile, summary, what SSCFI looks for, commitment and an apply link. Lifts and draws a gold line on hover. */
export function RoleCard({ role, index }: { role: Role; index?: number }) {
  const Icon = icons[role.slug as keyof typeof icons] ?? Gavel;
  return (
    <article className="group card-premium relative isolate flex h-full flex-col overflow-hidden rounded-3xl bg-white shadow-[0_12px_30px_rgba(15,46,99,0.07)] ring-1 ring-line transition duration-300 hover:-translate-y-1.5 hover:shadow-[0_28px_60px_rgba(15,46,99,0.14)]">
      <span aria-hidden="true" className="absolute inset-x-0 top-0 h-1 bg-line" />
      <span aria-hidden="true" className="absolute inset-x-0 top-0 h-1 origin-left scale-x-[0.18] bg-gradient-to-r from-gold to-gold-deep transition-transform duration-700 ease-out group-hover:scale-x-100" />
      <span aria-hidden="true" className="pointer-events-none absolute -right-24 -top-24 -z-10 size-64 rounded-full bg-gold/15 opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100" />
      {index !== undefined ? (
        <span aria-hidden="true" className="pointer-events-none absolute right-5 top-3 -z-10 font-heading text-[5.5rem] font-bold leading-none text-navy/[0.05] transition-colors duration-500 group-hover:text-gold/25">
          {String(index + 1).padStart(2, "0")}
        </span>
      ) : null}

      <div className="flex flex-1 flex-col p-6 sm:p-8">
        <div className="flex items-center gap-4">
          <span className="grid size-14 shrink-0 place-items-center rounded-2xl bg-royal/10 text-royal transition duration-300 group-hover:-rotate-6 group-hover:bg-royal group-hover:text-white group-hover:shadow-[0_12px_24px_rgba(28,79,160,0.35)]">
            <Icon className="size-7" aria-hidden="true" />
          </span>
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-royal">Open role</p>
            <h2 className="mt-1 font-heading text-2xl font-bold text-navy sm:text-[1.75rem]">{role.title}</h2>
          </div>
        </div>
        <p className="mt-5 text-[16px] leading-relaxed text-slate-600">{role.summary}</p>

        <div className="mt-6 rounded-2xl bg-surface p-5 ring-1 ring-line transition-colors duration-300 group-hover:bg-white">
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-royal">What SSCFI looks for</p>
          <ul className="mt-3 space-y-2.5 text-[15px] leading-snug text-slate-600">
            {role.lookingFor.map((l) => (
              <li key={l} className="flex gap-3">
                <span className="mt-px grid size-5 shrink-0 place-items-center rounded-full bg-ground/15 text-ground-deep">
                  <Check className="size-3" strokeWidth={3} aria-hidden="true" />
                </span>
                {l}
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-auto flex flex-col gap-4 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="flex items-start gap-2 text-sm text-slate-500">
            <Clock className="mt-0.5 size-4 shrink-0 text-gold-deep" aria-hidden="true" />
            {role.commitment}
          </p>
          <Link
            href={`/contact?type=careers&role=${role.slug}`}
            className="group/apply inline-flex w-fit shrink-0 items-center gap-2 rounded-full bg-navy py-2 pl-5 pr-2 font-bold text-white shadow-[0_10px_22px_rgba(15,46,99,0.25)] transition hover:bg-royal focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-gold"
          >
            Apply as {role.noun}
            <span className="grid size-8 place-items-center rounded-full bg-gold text-navy">
              <ArrowRight className="size-4 transition-transform group-hover/apply:translate-x-0.5" aria-hidden="true" />
            </span>
          </Link>
        </div>
      </div>
    </article>
  );
}
