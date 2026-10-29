import Image from "next/image";
import { Mail, Phone } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Person } from "@/lib/data/people";

export function PersonCard({ person }: { person: Person }) {
  const linkedinHandle = person.linkedin?.replace(/^https?:\/\/(www\.)?linkedin\.com\//, "");

  return (
    <article className="group card-premium overflow-hidden rounded-3xl bg-white p-6 shadow-[0_12px_30px_rgba(15,46,99,0.06)] ring-1 ring-line transition hover:-translate-y-0.5 hover:shadow-[0_18px_40px_rgba(15,46,99,0.12)]">
      <div aria-hidden="true" className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-gold to-gold-deep" />
      {person.linkedin ? (
        <a
          href={person.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${person.name ?? person.role} on LinkedIn`}
          className="absolute right-5 top-5 grid size-9 place-items-center rounded-full bg-linkedin text-xs font-bold text-white ring-2 ring-white shadow transition hover:scale-105"
        >
          in
        </a>
      ) : null}

      <div className="flex items-center gap-5">
        <div className="grid size-24 shrink-0 place-items-center overflow-hidden rounded-full bg-avatar text-sm italic text-slate-500 ring-4 ring-gold/80 shadow-[0_8px_20px_rgba(15,46,99,0.15)]">
          {person.photo ? (
            <Image src={person.photo} alt={person.name ?? ""} width={96} height={96} className="size-full object-cover" />
          ) : (
            "Photo"
          )}
        </div>
        <div className="min-w-0">
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-royal">{person.role}</p>
          <h3 className={cn("mt-1.5 font-heading text-2xl font-bold leading-tight text-navy", !person.name && "text-slate-400")}>
            {person.name ?? "Name to be added"}
          </h3>
        </div>
      </div>

      <ul className="mt-6 space-y-2.5 text-[15px] text-slate-600">
        {person.email ? (
          <li className="flex items-center gap-3">
            <span className="grid size-8 shrink-0 place-items-center rounded-full bg-royal/10 text-royal">
              <Mail className="size-4" aria-hidden="true" />
            </span>
            <a href={`mailto:${person.email}`} className="truncate underline-offset-4 hover:underline">
              {person.email}
            </a>
            {person.emailSuggested ? <span className="shrink-0 text-xs text-slate-400">(suggested)</span> : null}
          </li>
        ) : null}
        <li className="flex items-center gap-3">
          <span className="grid size-8 shrink-0 place-items-center rounded-full bg-ball/10 text-ball">
            <Phone className="size-4" aria-hidden="true" />
          </span>
          {person.phone ? (
            <a href={`tel:${person.phone}`} className="underline-offset-4 hover:underline">
              {person.phone}
            </a>
          ) : (
            <span className="text-slate-400">+91 — to be added</span>
          )}
        </li>
        {person.linkedin ? (
          <li className="pl-11">
            <a href={person.linkedin} target="_blank" rel="noopener noreferrer" className="text-royal underline underline-offset-4">
              {linkedinHandle}
            </a>
          </li>
        ) : null}
      </ul>
    </article>
  );
}
