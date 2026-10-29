import { GroundWatermark } from "@/components/layout/ground-watermark";
import { cn } from "@/lib/utils";

/** Dark stadium band every map level sits in: dot grid, floodlight glow and a drifting ground watermark. */
export function MapBand({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <section className={cn("relative isolate overflow-hidden bg-stadium py-10 text-white sm:py-14 lg:py-16", className)}>
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.09)_1px,transparent_1px)] [background-size:22px_22px] [mask-image:radial-gradient(70%_70%_at_30%_50%,#000,transparent)]" />
        <div className="absolute -left-40 top-1/2 size-[640px] -translate-y-1/2 rounded-full bg-royal/40 blur-[120px]" />
        <GroundWatermark className="parallax-slow absolute -bottom-40 -right-56 w-[900px] text-white/[0.05]" />
        <div className="absolute inset-x-0 bottom-0 h-24 bg-[linear-gradient(to_top,rgba(5,16,45,0.45),transparent)]" />
      </div>
      <div className="mx-auto max-w-7xl px-4 sm:px-6">{children}</div>
    </section>
  );
}

/** Glass panel for the dark band, matching the home page map panel. */
export function GlassPanel({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-[2rem] bg-white/[0.05] p-5 shadow-[0_30px_70px_rgba(4,15,42,0.45)] ring-1 ring-white/10 backdrop-blur sm:p-7",
        className,
      )}
    >
      <span aria-hidden="true" className="pointer-events-none absolute inset-x-8 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(217,174,86,0.7),transparent)]" />
      {children}
    </div>
  );
}
