import { Info } from "lucide-react";
import { Reveal } from "@/components/motion/reveal";
import { cn } from "@/lib/utils";

/** Gold-tinted note for content that is historical, sample or awaiting confirmation. */
export function NoticeCard({ title, children, className }: { title: string; children: React.ReactNode; className?: string }) {
  return (
    <Reveal
      from="left"
      className={cn(
        "relative isolate flex gap-4 overflow-hidden rounded-3xl bg-[linear-gradient(120deg,rgba(217,174,86,0.16),rgba(217,174,86,0.06)_55%,rgba(255,255,255,0.9))] p-5 ring-1 ring-gold/40 sm:gap-5 sm:p-6",
        className,
      )}
    >
      <span aria-hidden="true" className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-gold to-gold-deep" />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 left-0 -z-10 w-1/3 skew-x-[-20deg] bg-gradient-to-r from-transparent via-white/70 to-transparent motion-safe:animate-sweep"
      />
      <span className="relative grid size-11 shrink-0 place-items-center rounded-2xl bg-gold text-navy shadow-[0_8px_18px_rgba(201,155,67,0.35)]">
        <span aria-hidden="true" className="absolute inset-0 rounded-2xl bg-gold/60 motion-safe:animate-ping [animation-duration:2.6s] [animation-iteration-count:3]" />
        <Info className="relative size-5" aria-hidden="true" />
      </span>
      <div className="min-w-0">
        <p className="font-heading text-lg font-bold leading-snug text-navy">{title}</p>
        <div className="mt-1 text-[15px] leading-relaxed text-slate-600">{children}</div>
      </div>
    </Reveal>
  );
}
