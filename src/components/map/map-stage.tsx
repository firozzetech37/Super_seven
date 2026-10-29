import { MousePointerClick } from "lucide-react";
import { statusMeta, type Status } from "@/lib/data/locations";
import type { MapData } from "@/lib/geo/types";
import { cn } from "@/lib/utils";
import { Choropleth, type MapShape } from "./choropleth";

const order: Status[] = ["onboarded", "talks", "unreached"];
/** Pins beyond this many stay still: a handful of pulses reads as "live", hundreds would be noise. */
const MAX_PULSES = 12;

/**
 * The glass stage every map level sits on (matching the home page map panel): faint stadium rings,
 * the faded India map behind (the concept's "never lost" rule; a small inset on phones), the main
 * map in front with pulsing gold pins on onboarded areas, a legend and a sample/live badge.
 */
export function MapStage({
  map,
  shapes,
  title,
  highlight,
  labels,
  backdrop,
  sample,
  hint,
  pins = false,
  marker,
  className,
}: {
  map: MapData;
  shapes: MapShape[];
  title: string;
  highlight?: string;
  labels?: "none" | "all";
  backdrop?: { map: MapData; shapes: MapShape[]; highlight?: string };
  sample: boolean;
  /** Short instruction shown top right, e.g. "Hover or tap a district". */
  hint?: string;
  /** Pulsing gold pins on onboarded shapes. */
  pins?: boolean;
  /** Slug of the shape to mark as "you are here" with a larger pin. */
  marker?: string;
  className?: string;
}) {
  const pinned = pins ? shapes.filter((s) => s.status === "onboarded" && s.slug !== marker) : [];
  const here = marker ? shapes.find((s) => s.slug === marker) : undefined;
  const at = (s: MapShape) => ({ left: `${(s.cx / map.width) * 100}%`, top: `${(s.cy / map.height) * 100}%` });
  /** With names printed at the centroids, pins sit just above them so the label stays readable. */
  const lift = labels === "all" ? "md:-translate-y-[calc(50%+12px)]" : "";

  return (
    <div
      className={cn(
        "card-premium relative isolate overflow-hidden rounded-[2rem] bg-white/[0.04] p-4 shadow-[0_40px_90px_rgba(4,15,42,0.55)] ring-1 ring-white/10 backdrop-blur sm:p-6 lg:p-7",
        className,
      )}
    >
      <span aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(60%_55%_at_45%_45%,rgba(44,103,196,0.55),transparent_72%)]" />

      <div className="relative z-10 flex items-center justify-between gap-3">
        <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-white ring-1 ring-white/20">
          <span aria-hidden="true" className={cn("size-1.5 rounded-full", sample ? "bg-gold" : "bg-status-onboarded")} />
          {sample ? "Sample data" : "Live status"}
        </span>
        {hint ? (
          <span className="hidden items-center gap-1.5 text-xs text-white/60 sm:inline-flex">
            <MousePointerClick className="size-3.5 text-gold" aria-hidden="true" />
            {hint}
          </span>
        ) : null}
      </div>

      {backdrop ? (
        <div aria-hidden="true" className="pointer-events-none absolute inset-y-16 right-5 -z-10 hidden w-[40%] opacity-70 lg:block">
          <Choropleth
            map={backdrop.map}
            shapes={backdrop.shapes}
            title=""
            muted
            interactive={false}
            highlight={backdrop.highlight}
            className="h-full [&>svg]:ml-auto [&>svg]:h-full [&>svg]:w-auto"
          />
        </div>
      ) : null}

      <div className={cn("relative mx-auto mt-3 max-w-[600px]", backdrop && "lg:mx-0 lg:max-w-[58%]")}>
        <span aria-hidden="true" className="pointer-events-none absolute left-1/2 top-1/2 -z-10 aspect-square w-[78%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/[0.07]" />
        <span aria-hidden="true" className="pointer-events-none absolute left-1/2 top-1/2 -z-10 aspect-square w-[104%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-white/[0.06]" />
        <Choropleth
          map={map}
          shapes={shapes}
          title={title}
          highlight={highlight}
          labels={labels}
          highlightColor="#d9ae56"
          dimOpacity={0.82}
          className="motion-safe:animate-in motion-safe:fade-in motion-safe:zoom-in-95 motion-safe:duration-700"
        />
        {pinned.map((p, i) => (
          <span key={p.slug} aria-hidden="true" className={cn("pointer-events-none absolute -translate-x-1/2 -translate-y-1/2", lift)} style={at(p)}>
            {i < MAX_PULSES ? (
              <span className="absolute inset-0 rounded-full bg-gold/80 motion-safe:animate-ping" style={{ animationDelay: `${i * 600}ms`, animationDuration: "2.4s" }} />
            ) : null}
            <span className="relative block size-2.5 rounded-full bg-gold shadow-[0_0_12px_rgba(217,174,86,0.9)] ring-2 ring-white sm:size-3" />
          </span>
        ))}
        {here ? (
          <span aria-hidden="true" className={cn("pointer-events-none absolute -translate-x-1/2 -translate-y-1/2", lift)} style={at(here)}>
            <span className="absolute -inset-2 rounded-full bg-gold/50 motion-safe:animate-ping [animation-duration:2s]" />
            <span className="relative grid size-5 place-items-center rounded-full bg-navy shadow-[0_0_0_3px_#d9ae56,0_0_24px_rgba(217,174,86,0.9)]">
              <span className="size-2 rounded-full bg-gold" />
            </span>
          </span>
        ) : null}
      </div>

      <div className="relative mt-5 flex items-end justify-between gap-4">
        <ul className="flex flex-wrap gap-x-4 gap-y-2" aria-label="Legend">
          {order.map((s) => (
            <li key={s} className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.12em] text-white/75">
              <span aria-hidden="true" className={cn("size-2.5 rounded-full ring-2 ring-white/20", statusMeta[s].dot)} />
              {statusMeta[s].label}
            </li>
          ))}
          {pins ? (
            <li className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.12em] text-white/75">
              <span aria-hidden="true" className="size-2.5 rounded-full bg-gold ring-2 ring-white" />
              Pin: onboarded
            </li>
          ) : null}
        </ul>
        {backdrop ? (
          <div aria-hidden="true" className="w-16 shrink-0 text-center lg:hidden">
            <Choropleth map={backdrop.map} shapes={backdrop.shapes} title="" muted interactive={false} highlight={backdrop.highlight} />
            <p className="mt-1 text-[9px] font-bold uppercase tracking-[0.16em] text-white/45">In India</p>
          </div>
        ) : null}
      </div>
    </div>
  );
}
