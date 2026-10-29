"use client";

import { useState, type KeyboardEvent, type MouseEvent } from "react";
import { useRouter } from "next/navigation";
import { statusMeta, type Status } from "@/lib/data/locations";
import type { MapData, Shape } from "@/lib/geo/types";
import { cn } from "@/lib/utils";

export type MapShape = Shape & { status: Status; href?: string; /** Optional extra tooltip line (e.g. "26 districts"). */ note?: string };

const fill: Record<Status, string> = { onboarded: "#7bc67e", talks: "#f2d45c", unreached: "#f4a9a9" };

/**
 * Interactive SVG map. Each shape is a real link (works without JavaScript), coloured by status,
 * with a tooltip on hover or keyboard focus. `muted` draws it as a faded backdrop.
 */
export function Choropleth({
  map,
  shapes,
  title,
  highlight,
  muted = false,
  interactive = true,
  labels = "none",
  highlightColor = "#0f2e63",
  dimOpacity = 0.62,
  className,
}: {
  map: MapData;
  shapes: MapShape[];
  title: string;
  /** Slug to emphasise: the current state on the backdrop, or the current district on a state map. */
  highlight?: string;
  muted?: boolean;
  interactive?: boolean;
  labels?: "none" | "all";
  /** Outline colour of the highlighted shape on a full-colour map (opt-in; navy by default). */
  highlightColor?: string;
  /** Opacity of the other shapes while one is highlighted (opt-in; 0.62 by default). */
  dimOpacity?: number;
  className?: string;
}) {
  const router = useRouter();
  const [active, setActive] = useState<MapShape | null>(null);

  const onClick = (e: MouseEvent, href?: string) => {
    if (!href || e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
    e.preventDefault();
    router.push(href);
  };
  const onKey = (e: KeyboardEvent, href?: string) => {
    if (href && (e.key === "Enter" || e.key === " ")) {
      e.preventDefault();
      router.push(href);
    }
  };

  const hovered = interactive ? active : null;

  return (
    <div className={cn("relative", className)}>
      <svg
        viewBox={`0 0 ${map.width} ${map.height}`}
        role={interactive ? "group" : "img"}
        aria-label={title}
        className="h-auto w-full overflow-visible"
      >
        <title>{title}</title>
        {map.outline ? (
          <path d={map.outline} fill="none" stroke={muted ? "rgba(255,255,255,0.3)" : "#ffffff"} strokeWidth={muted ? 1 : 2.5} strokeLinejoin="round" />
        ) : null}
        {shapes.map((s) => {
          const isHighlight = highlight === s.slug;
          const dimmed = Boolean(highlight) && !isHighlight && !muted;
          const style = muted
            ? { fill: isHighlight ? "rgba(217,174,86,0.65)" : "rgba(255,255,255,0.08)", stroke: isHighlight ? "#d9ae56" : "rgba(255,255,255,0.28)", strokeWidth: isHighlight ? 1.4 : 0.6 }
            : { fill: fill[s.status], stroke: "#ffffff", strokeWidth: isHighlight ? 2.4 : 0.9, opacity: dimmed ? dimOpacity : 1 };
          const content = (
            <path
              d={s.d}
              style={style}
              strokeLinejoin="round"
              className={cn(
                "transition-[opacity,filter] duration-200",
                interactive && s.href && "cursor-pointer group-hover:brightness-110 group-focus-visible:brightness-110",
              )}
            />
          );
          if (!interactive || !s.href) {
            return <g key={s.slug}>{content}</g>;
          }
          return (
            <a
              key={s.slug}
              href={s.href}
              aria-label={`${s.name}: ${statusMeta[s.status].label}`}
              className="group outline-none"
              onClick={(e) => onClick(e, s.href)}
              onKeyDown={(e) => onKey(e, s.href)}
              onMouseEnter={() => setActive(s)}
              onMouseLeave={() => setActive((a) => (a?.slug === s.slug ? null : a))}
              onFocus={() => setActive(s)}
              onBlur={() => setActive((a) => (a?.slug === s.slug ? null : a))}
            >
              {content}
            </a>
          );
        })}
        {/* Hovered shape drawn again on top so its outline is never hidden by a neighbour */}
        {hovered ? <path d={hovered.d} fill="none" stroke="#ffffff" strokeWidth={2.6} strokeLinejoin="round" className="pointer-events-none" /> : null}
        {highlight && !muted
          ? shapes
              .filter((s) => s.slug === highlight)
              .map((s) => <path key={`hl-${s.slug}`} d={s.d} fill="none" stroke={highlightColor} strokeWidth={2.4} strokeLinejoin="round" className="pointer-events-none" />)
          : null}
        {labels === "all"
          ? shapes.map((s) => (
              <text
                key={`label-${s.slug}`}
                x={s.cx}
                y={s.cy}
                textAnchor="middle"
                dominantBaseline="middle"
                className="pointer-events-none hidden fill-navy font-bold md:block"
                style={{ fontSize: 14, paintOrder: "stroke", stroke: "rgba(255,255,255,0.9)", strokeWidth: 4, strokeLinejoin: "round" }}
              >
                {s.name}
              </text>
            ))
          : null}
      </svg>

      {hovered ? (
        <div
          role="tooltip"
          className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-[calc(100%+10px)] whitespace-nowrap rounded-xl bg-navy-deep/95 px-3 py-2 text-left text-white shadow-[0_12px_30px_rgba(4,15,42,0.5)] ring-1 ring-white/15 backdrop-blur"
          style={{ left: `${(hovered.cx / map.width) * 100}%`, top: `${(hovered.cy / map.height) * 100}%` }}
        >
          <p className="text-sm font-bold leading-tight">{hovered.name}</p>
          <p className="mt-1 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-white/75">
            <span aria-hidden="true" className={cn("size-2 rounded-full", statusMeta[hovered.status].dot)} />
            {statusMeta[hovered.status].label}
          </p>
          {hovered.note ? <p className="mt-1 text-xs text-white/60">{hovered.note}</p> : null}
        </div>
      ) : null}
    </div>
  );
}
