import Image from "next/image";
import { Mail, MapPin, Phone } from "lucide-react";
import type { OfficeBearer } from "@/lib/data/people";

export function OfficeBearerCard({ person }: { person: OfficeBearer }) {
  return (
    <article className="relative overflow-hidden rounded-3xl bg-white pt-14 shadow-[0_12px_30px_rgba(15,46,99,0.06)] ring-1 ring-line transition hover:shadow-[0_18px_40px_rgba(15,46,99,0.12)]">
      <div aria-hidden="true" className="absolute inset-x-0 top-0 h-20 bg-[linear-gradient(135deg,#1c4fa0,#0f2e63)]" />
      <div className="relative px-6 pb-6">
        <div className="size-28 overflow-hidden rounded-full bg-avatar shadow-[0_8px_20px_rgba(15,46,99,0.2)] ring-4 ring-white">
          <Image src={person.photo} alt={person.name} width={112} height={112} className="size-full object-cover object-top" />
        </div>
        <p className="mt-4 text-[11px] font-bold uppercase tracking-[0.2em] text-royal">{person.designation}</p>
        <h3 className="mt-1 font-heading text-xl font-bold leading-tight text-navy">{person.name}</h3>

        {person.phones || person.emails || person.address ? (
          <ul className="mt-4 space-y-2 text-[15px] text-slate-600">
            {person.phones?.map((p) => (
              <li key={p} className="flex items-center gap-3">
                <span className="grid size-8 shrink-0 place-items-center rounded-full bg-ball/10 text-ball">
                  <Phone className="size-4" aria-hidden="true" />
                </span>
                <a href={`tel:${p.replace(/[^+\d]/g, "")}`} className="underline-offset-4 hover:underline">
                  {p}
                </a>
              </li>
            ))}
            {person.emails?.map((e) => {
              const legacy = e.endsWith("@sscfi.in");
              return (
                <li key={e} className="flex items-center gap-3">
                  <span className="grid size-8 shrink-0 place-items-center rounded-full bg-royal/10 text-royal">
                    <Mail className="size-4" aria-hidden="true" />
                  </span>
                  {legacy ? (
                    <span className="truncate text-slate-400" title="This address no longer resolves">
                      {e}
                    </span>
                  ) : (
                    <a href={`mailto:${e}`} className="truncate underline-offset-4 hover:underline">
                      {e}
                    </a>
                  )}
                </li>
              );
            })}
            {person.address ? (
              <li className="flex items-start gap-3">
                <span className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-full bg-gold/20 text-gold-deep">
                  <MapPin className="size-4" aria-hidden="true" />
                </span>
                <span className="leading-snug">{person.address}</span>
              </li>
            ) : null}
          </ul>
        ) : (
          <p className="mt-4 text-sm text-slate-400">Contact details to be added.</p>
        )}
      </div>
    </article>
  );
}
