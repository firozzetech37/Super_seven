import { statusMeta, type Status } from "@/lib/data/locations";
import { cn } from "@/lib/utils";

export function StatusDot({ status, className }: { status: Status; className?: string }) {
  return <span aria-hidden="true" className={cn("inline-block size-2.5 shrink-0 rounded-full ring-2 ring-white/60", statusMeta[status].dot, className)} />;
}

export function StatusChip({ status }: { status: Status }) {
  return <span className={cn("rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider", statusMeta[status].chip)}>{statusMeta[status].label}</span>;
}
