import Link from "next/link";
import { Check } from "lucide-react";
import { Reveal } from "@/components/motion/reveal";
import { cn } from "@/lib/utils";

const levels = ["India", "State", "District", "Locality"] as const;
const next = ["", "Pick a state", "Pick a district", "Pick a locality"];

/**
 * The "four taps" of the concept as a progress trail: levels already passed are links back up,
 * the current level glows gold and the levels still ahead are dashed placeholders.
 * `trail` holds one entry per level reached so far, the last one being the current page.
 */
export function DrillTrail({ trail, className }: { trail: { label: string; href?: string }[]; className?: string }) {
  const current = trail.length - 1;
  return (
    <nav aria-label="Map levels" className={className}>
      <Reveal as="ol" stagger={90} className="flex items-center">
        {levels.map((level, i) => {
          const step = trail[i];
          const state = i < current ? "done" : i === current ? "current" : "ahead";
          const pill = (
            <>
              <span
                className={cn(
                  "relative grid size-8 shrink-0 place-items-center rounded-full font-heading text-sm font-bold transition-colors duration-300",
                  state === "ahead" ? "bg-white/[0.06] text-white/45 ring-1 ring-white/15" : "bg-gold text-navy",
                  state === "current" && "shadow-[0_0_0_5px_rgba(217,174,86,0.18),0_0_22px_rgba(217,174,86,0.55)]",
                  state === "done" && "group-hover:bg-white",
                )}
              >
                {state === "current" ? (
                  <span aria-hidden="true" className="absolute inset-0 rounded-full bg-gold/60 motion-safe:animate-ping [animation-duration:2.4s]" />
                ) : null}
                {state === "done" ? <Check className="relative size-4" aria-hidden="true" /> : <span className="relative">{i + 1}</span>}
              </span>
              <span className={cn("min-w-0 pr-1 leading-tight", state === "current" ? "block" : "hidden md:block")}>
                <span className={cn("block text-[10px] font-bold uppercase tracking-[0.2em]", state === "ahead" ? "text-white/35" : "text-gold")}>
                  {i + 1} · {level}
                </span>
                <span className={cn("block truncate text-sm font-bold", state === "ahead" ? "text-white/45" : "text-white")}>
                  {step?.label ?? next[i]}
                </span>
              </span>
            </>
          );
          return (
            <li
              key={level}
              aria-current={state === "current" ? "step" : undefined}
              className={cn("flex items-center", i < levels.length - 1 && "flex-1", state === "current" ? "min-w-0" : "shrink-0")}
            >
              {state === "done" && step?.href ? (
                <Link
                  href={step.href}
                  className="group flex min-w-0 items-center gap-2.5 rounded-full p-1 transition duration-300 hover:bg-white/[0.08] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold md:pr-4"
                >
                  {pill}
                  <span className="sr-only md:hidden">
                    {level}: {step.label}
                  </span>
                </Link>
              ) : (
                <span
                  className={cn(
                    "flex min-w-0 items-center gap-2.5 rounded-full p-1",
                    state === "current" && "bg-white/[0.08] pr-4 ring-1 ring-gold/40",
                    state === "ahead" && "md:pr-3",
                  )}
                >
                  {pill}
                </span>
              )}
              {i < levels.length - 1 ? (
                <span
                  aria-hidden="true"
                  className={cn(
                    "mx-2 h-px min-w-4 flex-1 sm:mx-3",
                    i < current ? "bg-[linear-gradient(90deg,rgba(217,174,86,0.9),rgba(217,174,86,0.35))]" : "border-t border-dashed border-white/20",
                  )}
                />
              ) : null}
            </li>
          );
        })}
      </Reveal>
    </nav>
  );
}
