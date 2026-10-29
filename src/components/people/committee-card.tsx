import Link from "next/link";
import { ArrowRight, Lightbulb, ShieldCheck, UserRound, UsersRound, type LucideIcon } from "lucide-react";
import { Reveal } from "@/components/motion/reveal";
import type { Committee } from "@/lib/data/people";

const icons: Record<string, LucideIcon> = { advisory: Lightbulb, committee: UsersRound, core: ShieldCheck };
const maxSlots = 6;

/**
 * Committee summary: icon, title, an overlapping avatar stack (confirmed members first, then
 * empty seats) that fans out on hover, and the confirmed names.
 */
export function CommitteeCard({ committee }: { committee: Committee }) {
  const Icon = icons[committee.id] ?? UsersRound;
  const seats = committee.members.length + committee.placeholders;
  const shownEmpty = Math.max(0, Math.min(committee.placeholders, maxSlots - committee.members.length));
  const more = seats - committee.members.length - shownEmpty;
  const confirmed = committee.members.length;

  return (
    <Link
      href={committee.href}
      className="group card-premium relative flex h-full flex-col overflow-hidden rounded-3xl bg-white p-6 shadow-[0_12px_30px_rgba(15,46,99,0.06)] ring-1 ring-line transition duration-300 hover:-translate-y-1.5 hover:shadow-[0_28px_60px_rgba(15,46,99,0.14)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-gold"
    >
      <span aria-hidden="true" className="pointer-events-none absolute -right-20 -top-20 size-56 rounded-full bg-gold/15 opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100" />

      <div className="flex items-start justify-between gap-4">
        <span className="grid size-12 place-items-center rounded-2xl bg-royal/10 text-royal transition duration-300 group-hover:-rotate-6 group-hover:bg-royal group-hover:text-white">
          <Icon className="size-6" aria-hidden="true" />
        </span>
        <span className="rounded-full bg-surface px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500 ring-1 ring-line">
          {confirmed ? `${confirmed} confirmed` : "List coming"}
        </span>
      </div>

      <h3 className="mt-5 font-heading text-xl font-bold text-navy transition-colors group-hover:text-royal">{committee.title}</h3>
      <p className="mt-1 text-[15px] leading-relaxed text-slate-500 md:min-h-[3.25rem]">{committee.description}</p>

      <Reveal
        as="ul"
        stagger={60}
        from="scale"
        className="mt-6 flex items-center -space-x-3 group-hover:-space-x-1 [&>li]:transition-[margin] [&>li]:duration-500 [&>li]:ease-out"
      >
        {committee.members.map((m, i) => (
          <li key={m.name} title={`${m.name}, ${m.role}`} className="relative" style={{ zIndex: 20 - i }}>
            <span className="grid size-12 place-items-center rounded-full bg-[linear-gradient(150deg,#1c4fa0,#0f2e63)] text-sm font-bold text-gold shadow-[0_6px_14px_rgba(15,46,99,0.25)] ring-[3px] ring-white">
              {m.initials}
            </span>
          </li>
        ))}
        {Array.from({ length: shownEmpty }).map((_, i) => (
          <li key={i} aria-hidden="true" className="relative" style={{ zIndex: 20 - confirmed - i }}>
            <span className="grid size-12 place-items-center rounded-full bg-avatar ring-[3px] ring-white">
              <UserRound className="size-5 text-royal/35" />
            </span>
          </li>
        ))}
        {more > 0 ? (
          <li aria-hidden="true">
            <span className="grid size-12 place-items-center rounded-full bg-surface text-xs font-bold text-slate-500 ring-[3px] ring-white">+{more}</span>
          </li>
        ) : null}
      </Reveal>

      <p className="mt-3 text-sm text-slate-600">
        {confirmed ? committee.members.map((m) => `${m.name}, ${m.role}`).join(" · ") : "Members to be announced by SSCFI."}
      </p>

      <div className="mt-auto flex items-center justify-between border-t border-line pt-5">
        <span className="text-sm font-bold text-royal">View {committee.title.toLowerCase()}</span>
        <span className="grid size-10 place-items-center rounded-full bg-surface text-royal ring-1 ring-line transition duration-300 group-hover:bg-royal group-hover:text-white group-hover:ring-royal">
          <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5" aria-hidden="true" />
        </span>
      </div>
    </Link>
  );
}
