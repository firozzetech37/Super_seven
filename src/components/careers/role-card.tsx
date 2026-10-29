import Link from "next/link";
import { ArrowRight, Check, ClipboardList, Clock, Gavel, GraduationCap, Megaphone } from "lucide-react";
import type { Role } from "@/lib/data/careers";

const icons = { umpire: Gavel, scorer: ClipboardList, coach: GraduationCap, coordinator: Megaphone } as const;

export function RoleCard({ role }: { role: Role }) {
  const Icon = icons[role.slug as keyof typeof icons] ?? Gavel;
  return (
    <article className="flex h-full flex-col overflow-hidden rounded-3xl bg-white shadow-[0_12px_30px_rgba(15,46,99,0.06)] ring-1 ring-line">
      <div aria-hidden="true" className="h-1 bg-gradient-to-r from-gold to-gold-deep" />
      <div className="flex flex-1 flex-col p-7">
        <div className="flex items-center gap-4">
          <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-royal/10 text-royal">
            <Icon className="size-6" aria-hidden="true" />
          </span>
          <h2 className="font-heading text-2xl font-bold text-navy">{role.title}</h2>
        </div>
        <p className="mt-4 text-[16px] leading-relaxed text-slate-600">{role.summary}</p>
        <p className="mt-5 text-[11px] font-bold uppercase tracking-[0.2em] text-royal">What SSCFI looks for</p>
        <ul className="mt-2 space-y-1.5 text-[15px] text-slate-600">
          {role.lookingFor.map((l) => (
            <li key={l} className="flex gap-2.5">
              <Check className="mt-1 size-4 shrink-0 text-ground" aria-hidden="true" />
              {l}
            </li>
          ))}
        </ul>
        <p className="mt-5 flex items-center gap-2 text-sm text-slate-500">
          <Clock className="size-4 text-gold-deep" aria-hidden="true" />
          {role.commitment}
        </p>
        <Link
          href={`/contact?type=careers&role=${role.slug}`}
          className="group mt-6 inline-flex w-fit items-center gap-2 rounded-full bg-navy px-5 py-2.5 font-bold text-white transition hover:bg-royal"
        >
          Apply as {role.noun}
          <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
        </Link>
      </div>
    </article>
  );
}
