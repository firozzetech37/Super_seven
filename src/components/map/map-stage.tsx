import { statusMeta, type Status } from "@/lib/data/locations";
import type { MapData } from "@/lib/geo/types";
import { cn } from "@/lib/utils";
import { Choropleth, type MapShape } from "./choropleth";

/**
 * The navy stage every map level sits on: optional faded India behind (the concept's "never lost" rule),
 * the main map in front, legend and a sample/live badge.
 */
export function MapStage({
  map,
  shapes,
  title,
  highlight,
  labels,
  backdrop,
  sample,
  className,
}: {
  map: MapData;
  shapes: MapShape[];
  title: string;
  highlight?: string;
  labels?: "none" | "all";
  backdrop?: { map: MapData; shapes: MapShape[]; highlight?: string };
  sample: boolean;
  className?: string;
}) {
  return (
    <div className={cn("relative isolate overflow-hidden rounded-3xl bg-navy/60 p-4 ring-1 ring-white/10 sm:p-6 lg:p-8", className)}>
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(60%_60%_at_50%_45%,rgba(44,103,196,0.35),transparent_70%)]" />
      {backdrop ? (
        <div aria-hidden="true" className="pointer-events-none absolute inset-y-6 right-4 -z-10 hidden w-[42%] opacity-70 lg:block">
          <Choropleth map={backdrop.map} shapes={backdrop.shapes} title="" muted interactive={false} highlight={backdrop.highlight} className="h-full [&>svg]:h-full [&>svg]:w-auto [&>svg]:ml-auto" />
        </div>
      ) : null}
      <div className={cn("relative mx-auto max-w-[640px]", backdrop && "lg:mx-0 lg:max-w-[58%]")}>
        <Choropleth map={map} shapes={shapes} title={title} highlight={highlight} labels={labels} />
      </div>
      <div className="relative mt-5 flex flex-wrap items-center justify-between gap-3">
        <ul className="flex flex-wrap gap-2">
          {(Object.keys(statusMeta) as Status[]).map((s) => (
            <li key={s} className={cn("rounded-full px-3 py-1 text-xs font-bold", statusMeta[s].chip)}>
              {statusMeta[s].label}
            </li>
          ))}
        </ul>
        <span
          className={cn(
            "rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wider ring-1",
            sample ? "bg-navy text-white ring-white/25" : "bg-status-onboarded/20 text-status-onboarded ring-status-onboarded/40",
          )}
        >
          {sample ? "Sample data" : "Live status"}
        </span>
      </div>
    </div>
  );
}
