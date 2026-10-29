import { statusMeta, type Status } from "@/lib/data/locations";
import { cn } from "@/lib/utils";

export function StatusDot({ status, className }: { status: Status; className?: string }) {
  return <span aria-hidden="true" className={cn("inline-block size-2.5 shrink-0 rounded-full ring-2 ring-white/60", statusMeta[status].dot, className)} />;
}

/** Status pill. `live` adds a soft pulse to the dot (onboarded areas). */
export function StatusChip({ status, live = false, className }: { status: Status; live?: boolean; className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider", statusMeta[status].chip, className)}>
      {live ? (
        <span aria-hidden="true" className="relative flex size-1.5">
          <span className="absolute inset-0 rounded-full bg-navy/50 motion-safe:animate-ping" />
          <span className="relative size-1.5 rounded-full bg-navy/80" />
        </span>
      ) : null}
      {statusMeta[status].label}
    </span>
  );
}
