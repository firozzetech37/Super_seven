import Image from "next/image";
import { ArrowUpRight, Mail, Phone, UserRound } from "lucide-react";
import { GroundWatermark } from "@/components/layout/ground-watermark";
import { cn } from "@/lib/utils";
import type { Person } from "@/lib/data/people";

/** First and last initials, e.g. "Firozze Kamaal Abbasi" → "FA". */
function initialsOf(name: string) {
  const words = name.trim().split(/\s+/);
  return (words[0][0] + (words.length > 1 ? words[words.length - 1][0] : "")).toUpperCase();
}

const row = "group/row -mx-2 flex items-center gap-3 rounded-xl px-2 py-1.5 transition-colors";
const tile = "grid size-9 shrink-0 place-items-center rounded-xl transition-colors duration-300";

/**
 * Leadership profile: navy banner with the role, an avatar that overlaps it inside a gold ring
 * (the ring turns on hover), then direct contact rows.
 */
export function PersonCard({ person }: { person: Person }) {
  return (
    <article className="group card-premium relative flex h-full flex-col overflow-hidden rounded-3xl bg-white shadow-[0_12px_30px_rgba(15,46,99,0.07)] ring-1 ring-line transition duration-300 hover:-translate-y-1.5 hover:shadow-[0_28px_60px_rgba(15,46,99,0.16)]">
      <div className="relative h-28 overflow-hidden bg-stadium">
        <GroundWatermark className="absolute -right-12 -top-10 w-72 text-white/[0.1] transition-transform duration-700 ease-out group-hover:-rotate-3 group-hover:scale-110" />
        <span
          aria-hidden="true"
          className="absolute inset-y-0 left-0 w-1/2 -translate-x-[140%] skew-x-[-20deg] bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-1000 ease-out group-hover:translate-x-[300%]"
        />
        <span aria-hidden="true" className="absolute inset-x-0 bottom-0 h-px bg-[linear-gradient(90deg,transparent,rgba(217,174,86,0.9)_20%,rgba(217,174,86,0.9)_80%,transparent)]" />
        <p className="absolute right-5 top-5 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-gold ring-1 ring-white/15 backdrop-blur">
          <span aria-hidden="true" className="size-1.5 rounded-full bg-gold" />
          {person.role}
        </p>
      </div>

      <div className="relative flex flex-1 flex-col px-6 pb-6">
        <div className="relative -mt-12 size-24">
          <span
            aria-hidden="true"
            className="absolute -inset-[7px] rounded-full bg-[conic-gradient(from_0deg,#d9ae56,#f6dfa2,#c99b43,#1c4fa0,#d9ae56)] shadow-[0_10px_24px_rgba(15,46,99,0.25)] motion-safe:group-hover:animate-[spin_4s_linear_infinite]"
          />
          <span className="absolute inset-0 grid place-items-center overflow-hidden rounded-full bg-[linear-gradient(150deg,#1c4fa0,#0f2e63)] ring-4 ring-white">
            {person.photo ? (
              <Image src={person.photo} alt={person.name ?? ""} width={96} height={96} className="size-full object-cover" />
            ) : person.name ? (
              <span aria-hidden="true" className="font-heading text-3xl font-bold tracking-wide text-gold">
                {initialsOf(person.name)}
              </span>
            ) : (
              <UserRound className="size-10 text-white/50" aria-hidden="true" />
            )}
          </span>
        </div>

        <h3 className={cn("mt-4 font-heading text-2xl font-bold leading-tight", person.name ? "text-navy" : "text-slate-400")}>
          {person.name ?? "Name to be added"}
        </h3>
        <p className="mt-1 text-[11px] font-bold uppercase tracking-[0.2em] text-royal">{person.role}</p>

        <ul className="mt-5 space-y-1 border-t border-line pt-4 text-[15px] text-slate-600">
          {person.email ? (
            <li>
              <a href={`mailto:${person.email}`} className={cn(row, "hover:bg-surface")}>
                <span className={cn(tile, "bg-royal/10 text-royal group-hover/row:bg-royal group-hover/row:text-white")}>
                  <Mail className="size-4" aria-hidden="true" />
                </span>
                <span className="truncate">{person.email}</span>
                {person.emailSuggested ? (
                  <span className="ml-auto shrink-0 rounded-full bg-surface px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400 ring-1 ring-line">
                    Suggested
                  </span>
                ) : null}
              </a>
            </li>
          ) : null}
          <li>
            {person.phone ? (
              <a href={`tel:${person.phone}`} className={cn(row, "hover:bg-surface")}>
                <span className={cn(tile, "bg-ball/10 text-ball group-hover/row:bg-ball group-hover/row:text-white")}>
                  <Phone className="size-4" aria-hidden="true" />
                </span>
                {person.phone}
              </a>
            ) : (
              <span className={row}>
                <span className={cn(tile, "bg-ball/10 text-ball/70")}>
                  <Phone className="size-4" aria-hidden="true" />
                </span>
                <span className="text-slate-400">Phone to be added</span>
              </span>
            )}
          </li>
          {person.linkedin ? (
            <li>
              <a href={person.linkedin} target="_blank" rel="noopener noreferrer" className={cn(row, "hover:bg-surface")}>
                <span className={cn(tile, "bg-linkedin/10 text-xs font-bold text-linkedin group-hover/row:bg-linkedin group-hover/row:text-white")}>in</span>
                LinkedIn profile
                <ArrowUpRight className="ml-auto size-4 text-slate-300 transition group-hover/row:-translate-y-0.5 group-hover/row:translate-x-0.5 group-hover/row:text-linkedin" aria-hidden="true" />
              </a>
            </li>
          ) : null}
        </ul>
      </div>
    </article>
  );
}
