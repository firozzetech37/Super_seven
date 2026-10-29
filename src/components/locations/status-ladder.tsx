import { ChevronRight } from "lucide-react";
import { Reveal } from "@/components/motion/reveal";
import { statusMeta, type Status } from "@/lib/data/locations";
import { cn } from "@/lib/utils";

const steps: Status[] = ["unreached", "talks", "onboarded"];
const tint: Record<Status, string> = {
  onboarded: "from-status-onboarded/25",
  talks: "from-status-talks/30",
  unreached: "from-status-unreached/30",
};

/** The three colours as a path (not reached, in discussion, onboarded) with the current one marked. */
export function StatusLadder({ current, meaning, here }: { current: Status; meaning: Record<Status, string>; here: string }) {
  const at = steps.indexOf(current);
  return (
    <Reveal as="ol" stagger={110} className="grid gap-3 md:grid-cols-3 md:gap-4">
      {steps.map((s, i) => {
        const isHere = s === current;
        return (
          <li
            key={s}
            aria-current={isHere ? "step" : undefined}
            className={cn(
              "relative flex flex-col rounded-3xl bg-white p-6 ring-1 transition duration-300",
              isHere ? "shadow-[0_24px_50px_rgba(15,46,99,0.14)] ring-2 ring-gold" : "ring-line",
              !isHere && i > at && "opacity-75",
            )}
          >
            <span aria-hidden="true" className={cn("pointer-events-none absolute inset-0 rounded-3xl bg-gradient-to-b to-transparent to-60%", isHere ? tint[s] : "from-transparent")} />
            <div className="relative flex items-center justify-between gap-3">
              <span className="flex items-center gap-2.5">
                <span className="grid size-9 place-items-center rounded-full bg-navy font-heading text-sm font-bold text-white">{i + 1}</span>
                <span className={cn("rounded-full px-3 py-1 text-xs font-bold", statusMeta[s].chip)}>{statusMeta[s].label}</span>
              </span>
              {isHere ? (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-gold px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-navy">
                  <span aria-hidden="true" className="relative flex size-1.5">
                    <span className="absolute inset-0 rounded-full bg-navy/60 motion-safe:animate-ping" />
                    <span className="relative size-1.5 rounded-full bg-navy" />
                  </span>
                  {here}
                </span>
              ) : null}
            </div>
            <p className={cn("relative mt-4 text-[15px] leading-relaxed", isHere ? "text-ink" : "text-slate-500")}>{meaning[s]}</p>
            {i < steps.length - 1 ? (
              <ChevronRight aria-hidden="true" className="absolute -right-3.5 top-1/2 z-10 hidden size-7 -translate-y-1/2 rounded-full bg-white p-1 text-gold-deep shadow ring-1 ring-line md:block" />
            ) : null}
          </li>
        );
      })}
    </Reveal>
  );
}
