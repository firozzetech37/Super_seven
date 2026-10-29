import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Committee } from "@/lib/data/people";

export function CommitteeRow({ committee }: { committee: Committee }) {
  return (
    <Link
      href={committee.href}
      className="group card-premium grid gap-5 rounded-2xl bg-white p-6 shadow-[0_12px_30px_rgba(15,46,99,0.05)] ring-1 ring-line transition hover:-translate-y-0.5 hover:shadow-[0_18px_40px_rgba(15,46,99,0.12)] md:grid-cols-[260px_1fr_auto] md:items-center"
    >
      <div>
        <h3 className="font-heading text-xl font-bold text-navy transition-colors group-hover:text-royal">{committee.title}</h3>
        <p className="mt-1 text-[15px] text-slate-500">{committee.description}</p>
      </div>
      <ul className="flex flex-wrap items-start gap-4">
        {committee.members.map((m) => (
          <li key={m.name} className="flex w-16 flex-col items-center text-center">
            <span className="grid size-14 place-items-center rounded-full bg-royal text-sm font-bold text-white ring-4 ring-gold/80">
              {m.initials}
            </span>
            <span className="mt-1.5 text-[11px] leading-tight text-slate-500">
              {m.name}, {m.role}
            </span>
          </li>
        ))}
        {Array.from({ length: committee.placeholders }).map((_, i) => (
          <li key={i} aria-hidden="true" className="w-16">
            <span className="mx-auto block size-14 rounded-full bg-avatar ring-1 ring-line" />
          </li>
        ))}
      </ul>
      <span className="hidden size-10 place-items-center rounded-full bg-surface text-royal ring-1 ring-line transition group-hover:bg-royal group-hover:text-white md:grid">
        <ArrowRight className="size-4" aria-hidden="true" />
      </span>
    </Link>
  );
}
