import { BadgeCheck, MapPinned, PhoneCall, Send, type LucideIcon } from "lucide-react";
import { Reveal } from "@/components/motion/reveal";
import { registrationSteps } from "@/lib/forms";
import { cn } from "@/lib/utils";

const icons: LucideIcon[] = [Send, PhoneCall, BadgeCheck, MapPinned];

/**
 * The four-step process from the concept: Submit → Review → ID issued → Map updates.
 * Full: four cards joined by a gold rail, each with an icon tile, a numbered badge and a faint
 * outsized numeral. Compact: a vertical timeline for narrow columns.
 */
export function RegistrationSteps({ compact = false }: { compact?: boolean }) {
  if (compact) {
    return (
      <Reveal as="ol" stagger={90} className="space-y-1">
        {registrationSteps.map((s, i) => (
          <li key={s.n} className="relative flex gap-4 pb-4 last:pb-0">
            {i < registrationSteps.length - 1 ? (
              <span
                aria-hidden="true"
                className="absolute left-[17px] top-10 h-[calc(100%-2.75rem)] w-px bg-[linear-gradient(to_bottom,rgba(217,174,86,0.9),rgba(217,174,86,0.2))]"
              />
            ) : null}
            <span className="grid size-9 shrink-0 place-items-center rounded-full bg-navy font-heading text-sm font-bold text-white ring-4 ring-gold/40">
              {s.n}
            </span>
            <div className="pt-1">
              <p className="font-bold text-navy">{s.title}</p>
              <p className="mt-0.5 text-sm leading-snug text-slate-500">{s.text}</p>
            </div>
          </li>
        ))}
      </Reveal>
    );
  }

  return (
    <div className="relative">
      <span
        aria-hidden="true"
        className="absolute left-[12%] right-[12%] top-[3.25rem] hidden h-px bg-[linear-gradient(90deg,transparent,rgba(201,155,67,0.9)_12%,rgba(201,155,67,0.9)_88%,transparent)] lg:block"
      />
      <Reveal as="ol" stagger={120} className="relative grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
        {registrationSteps.map((s, i) => {
          const Icon = icons[i] ?? Send;
          return (
            <li
              key={s.n}
              className={cn(
                "group card-premium relative overflow-hidden rounded-3xl bg-white p-6 shadow-[0_12px_30px_rgba(15,46,99,0.07)] ring-1 ring-line transition duration-300 hover:-translate-y-1.5 hover:shadow-[0_28px_60px_rgba(15,46,99,0.14)]",
              )}
            >
              <span
                aria-hidden="true"
                className="pointer-events-none absolute -bottom-6 -right-1 select-none font-heading text-[7rem] font-bold leading-none text-navy/[0.04] transition-colors duration-500 group-hover:text-gold/20"
              >
                {String(s.n).padStart(2, "0")}
              </span>
              <div className="relative flex items-center justify-between">
                <span className="grid size-14 place-items-center rounded-2xl bg-royal/10 text-royal transition duration-300 group-hover:-rotate-6 group-hover:bg-royal group-hover:text-white">
                  <Icon className="size-6" aria-hidden="true" />
                </span>
                <span className="grid size-9 place-items-center rounded-full bg-navy font-heading text-sm font-bold text-white ring-4 ring-gold/50">
                  {s.n}
                </span>
              </div>
              <p className="relative mt-5 font-heading text-xl font-bold text-navy">{s.title}</p>
              <p className="relative mt-1.5 text-[15px] leading-relaxed text-slate-500">{s.text}</p>
            </li>
          );
        })}
      </Reveal>
    </div>
  );
}
