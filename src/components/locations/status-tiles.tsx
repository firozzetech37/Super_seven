import { CountUp } from "@/components/motion/count-up";
import { statusMeta, type Status } from "@/lib/data/locations";
import { cn } from "@/lib/utils";

const order: Status[] = ["onboarded", "talks", "unreached"];
const bar: Record<Status, string> = {
  onboarded: "bg-status-onboarded",
  talks: "bg-status-talks",
  unreached: "bg-status-unreached/70",
};

/** Glass count tiles (counting up on first view) plus a stacked share bar, for the dark map band. */
export function StatusTiles({ counts, caption, className }: { counts: Record<Status, number>; caption?: string; className?: string }) {
  const total = order.reduce((n, s) => n + counts[s], 0);
  return (
    <div className={className}>
      <dl className="grid grid-cols-3 gap-2 sm:gap-2.5">
        {order.map((s) => (
          <div key={s} className="relative flex flex-col-reverse justify-end overflow-hidden rounded-2xl bg-white/[0.06] px-2 py-3 text-center ring-1 ring-white/10 sm:px-3">
            <span aria-hidden="true" className={cn("absolute inset-x-5 top-0 h-0.5 rounded-full", statusMeta[s].dot)} />
            <dt className="mt-1.5 flex flex-col items-center gap-1.5 text-[10px] font-bold uppercase leading-tight tracking-[0.12em] text-white/70 sm:text-[11px]">
              <span aria-hidden="true" className={cn("size-2 shrink-0 rounded-full", statusMeta[s].dot)} />
              {statusMeta[s].label}
            </dt>
            <dd className="font-heading text-2xl font-bold text-white sm:text-3xl">
              <CountUp value={counts[s]} />
            </dd>
          </div>
        ))}
      </dl>
      {total > 0 ? (
        <div aria-hidden="true" className="mt-3 flex h-1.5 gap-0.5 overflow-hidden rounded-full bg-white/10">
          {order.map((s) =>
            counts[s] ? (
              <span
                key={s}
                className={cn("h-full origin-left rounded-full motion-safe:animate-in motion-safe:zoom-in-0 motion-safe:duration-1000", bar[s])}
                style={{ width: `${(counts[s] / total) * 100}%` }}
              />
            ) : null,
          )}
        </div>
      ) : null}
      {caption ? <p className="mt-2.5 text-center text-[11px] font-bold uppercase tracking-[0.16em] text-white/45">{caption}</p> : null}
    </div>
  );
}
