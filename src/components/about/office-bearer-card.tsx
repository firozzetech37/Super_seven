import Image from "next/image";
import { Mail, MapPin, Phone } from "lucide-react";
import { GroundWatermark } from "@/components/layout/ground-watermark";
import { cn } from "@/lib/utils";
import type { OfficeBearer } from "@/lib/data/people";

const row = "group/row -mx-2 flex items-center gap-3 rounded-xl px-2 py-1.5 transition-colors";
const tile = "grid size-9 shrink-0 place-items-center rounded-xl transition-colors duration-300";

/** Gold conic ring around a 2014 archive photo; the ring turns while the card is hovered. */
function Portrait({ person, size }: { person: OfficeBearer; size: "lg" | "sm" }) {
  const px = size === "lg" ? 112 : 80;
  return (
    <div className={cn("relative shrink-0", size === "lg" ? "size-28" : "size-20")}>
      <span
        aria-hidden="true"
        className="absolute -inset-[6px] rounded-full bg-[conic-gradient(from_0deg,#d9ae56,#f6dfa2,#c99b43,#1c4fa0,#d9ae56)] shadow-[0_10px_24px_rgba(15,46,99,0.25)] motion-safe:group-hover:animate-[spin_4s_linear_infinite]"
      />
      <span className="absolute inset-0 overflow-hidden rounded-full bg-avatar ring-4 ring-white">
        <Image
          src={person.photo}
          alt={`${person.name}, ${person.designation}`}
          width={px}
          height={px}
          className="size-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-110"
        />
      </span>
    </div>
  );
}

/**
 * Office bearer from the 2014 records. `featured` (officers with published contacts): navy banner,
 * large portrait and contact rows. `compact` (committee chairs and match officials): portrait beside
 * the name, so a long list stays scannable.
 */
export function OfficeBearerCard({ person, index, variant = "featured" }: { person: OfficeBearer; index: number; variant?: "featured" | "compact" }) {
  const number = String(index + 1).padStart(2, "0");

  if (variant === "compact") {
    return (
      <article className="group card-premium relative flex h-full items-center gap-5 overflow-hidden rounded-3xl bg-white p-5 shadow-[0_12px_30px_rgba(15,46,99,0.07)] ring-1 ring-line transition duration-300 hover:-translate-y-1.5 hover:shadow-[0_28px_60px_rgba(15,46,99,0.14)] sm:p-6">
        <span aria-hidden="true" className="absolute inset-x-6 top-0 h-[3px] origin-left scale-x-0 rounded-b-full bg-gradient-to-r from-gold to-gold-deep transition-transform duration-500 group-hover:scale-x-100" />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-6 right-2 font-heading text-[5.5rem] font-bold leading-none text-navy/[0.05] transition duration-500 group-hover:-translate-y-1 group-hover:text-gold/20"
        >
          {number}
        </span>
        <Portrait person={person} size="sm" />
        <div className="relative min-w-0">
          <p className="text-[11px] font-bold uppercase leading-snug tracking-[0.18em] text-royal">{person.designation}</p>
          <h3 className="mt-1.5 font-heading text-xl font-bold leading-tight text-navy">{person.name}</h3>
          <p className="mt-2 text-xs font-bold uppercase tracking-[0.14em] text-slate-400">Contact to be added</p>
        </div>
      </article>
    );
  }

  return (
    <article className="group card-premium relative flex h-full flex-col overflow-hidden rounded-3xl bg-white shadow-[0_12px_30px_rgba(15,46,99,0.07)] ring-1 ring-line transition duration-300 hover:-translate-y-1.5 hover:shadow-[0_28px_60px_rgba(15,46,99,0.16)]">
      <div className="relative h-28 overflow-hidden bg-stadium">
        <GroundWatermark className="absolute -right-12 -top-10 w-72 text-white/[0.1] transition-transform duration-700 ease-out group-hover:-rotate-3 group-hover:scale-110" />
        <span
          aria-hidden="true"
          className="absolute inset-y-0 left-0 w-1/2 -translate-x-[140%] skew-x-[-20deg] bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-1000 ease-out group-hover:translate-x-[300%]"
        />
        <span aria-hidden="true" className="absolute inset-x-0 bottom-0 h-px bg-[linear-gradient(90deg,transparent,rgba(217,174,86,0.9)_20%,rgba(217,174,86,0.9)_80%,transparent)]" />
        <span aria-hidden="true" className="absolute right-5 top-3 font-heading text-5xl font-bold leading-none text-white/[0.12]">
          {number}
        </span>
      </div>

      <div className="relative flex flex-1 flex-col px-6 pb-6">
        <div className="-mt-14">
          <Portrait person={person} size="lg" />
        </div>
        <p className="mt-5 inline-flex w-fit items-center gap-2 rounded-full bg-royal/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-royal">
          <span aria-hidden="true" className="size-1.5 rounded-full bg-gold" />
          {person.designation}
        </p>
        <h3 className="mt-2 font-heading text-2xl font-bold leading-tight text-navy">{person.name}</h3>

        <ul className="mt-5 space-y-1 border-t border-line pt-4 text-[15px] text-slate-600">
          {person.phones?.map((p) => (
            <li key={p}>
              <a href={`tel:${p.replace(/[^+\d]/g, "")}`} className={cn(row, "hover:bg-surface")}>
                <span className={cn(tile, "bg-ball/10 text-ball group-hover/row:bg-ball group-hover/row:text-white")}>
                  <Phone className="size-4" aria-hidden="true" />
                </span>
                {p}
              </a>
            </li>
          ))}
          {person.emails?.map((e) => {
            const legacy = e.endsWith("@sscfi.in");
            return (
              <li key={e}>
                {legacy ? (
                  <span className={row} title="This address no longer resolves">
                    <span className={cn(tile, "bg-slate-100 text-slate-400")}>
                      <Mail className="size-4" aria-hidden="true" />
                    </span>
                    <span className="min-w-0 truncate text-slate-400">{e}</span>
                    <span className="ml-auto shrink-0 rounded-full bg-surface px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400 ring-1 ring-line">
                      Inactive
                    </span>
                  </span>
                ) : (
                  <a href={`mailto:${e}`} className={cn(row, "hover:bg-surface")}>
                    <span className={cn(tile, "bg-royal/10 text-royal group-hover/row:bg-royal group-hover/row:text-white")}>
                      <Mail className="size-4" aria-hidden="true" />
                    </span>
                    <span className="min-w-0 truncate">{e}</span>
                  </a>
                )}
              </li>
            );
          })}
          {person.address ? (
            <li className={cn(row, "items-start")}>
              <span className={cn(tile, "bg-gold/20 text-gold-deep")}>
                <MapPin className="size-4" aria-hidden="true" />
              </span>
              <span className="pt-1.5 leading-snug">{person.address}</span>
            </li>
          ) : null}
        </ul>
      </div>
    </article>
  );
}
