"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronDown, Expand, Newspaper, ZoomIn } from "lucide-react";
import { PhotoViewer } from "@/components/gallery/photo-viewer";
import { Reveal } from "@/components/motion/reveal";
import { cn } from "@/lib/utils";
import type { Clipping } from "@/lib/data/gallery";

/** Clippings shown before "Show all" when every year is selected. */
const PREVIEW = 12;
/** A slight, varied tilt so the wall reads as cuttings pinned to a board; hover straightens them. */
const tilt = ["-rotate-1", "rotate-[0.7deg]", "rotate-[-0.4deg]", "rotate-1", "rotate-[-0.8deg]", "rotate-[0.4deg]"];

/**
 * Press clippings from the old site. The bar chart of clippings per year is the filter; below it the cuttings
 * are pinned to a masonry wall, and each opens in the shared viewer with a link to the full-size scan.
 */
export function PressArchive({ clippings }: { clippings: Clipping[] }) {
  const [year, setYear] = useState<string>("all");
  const [expanded, setExpanded] = useState(false);
  const [index, setIndex] = useState<number | null>(null);

  const years = Array.from(new Set(clippings.map((c) => c.year))).map((y) => ({ year: y, count: clippings.filter((c) => c.year === y).length }));
  const total = clippings.length;
  const max = Math.max(...years.map((y) => y.count), 1);
  const first = years[0]?.year;
  const last = years[years.length - 1]?.year;

  const filtered = year === "all" ? clippings : clippings.filter((c) => c.year === year);
  const shown = year === "all" && !expanded ? filtered.slice(0, PREVIEW) : filtered;
  const hidden = filtered.length - shown.length;

  const choose = (y: string) => {
    setYear(y);
    setExpanded(false);
  };

  return (
    <>
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)] lg:items-stretch">
        <div role="group" aria-label="Filter press clippings by year" className="rounded-[1.75rem] bg-white/[0.05] p-5 ring-1 ring-white/10 backdrop-blur sm:p-7">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/60">Clippings per year</p>
            <button
              type="button"
              aria-pressed={year === "all"}
              onClick={() => choose("all")}
              className={cn(
                "inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-bold ring-1 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold",
                year === "all" ? "bg-gold text-navy ring-gold" : "text-white ring-white/30 hover:bg-white/10 hover:ring-white/60",
              )}
            >
              All years
              <span className={cn("rounded-full px-1.5 text-[11px] tabular-nums", year === "all" ? "bg-navy/15" : "bg-white/10")}>{total}</span>
            </button>
          </div>

          <Reveal
            as="ul"
            stagger={55}
            style={{ gridTemplateColumns: `repeat(${years.length}, minmax(0, 1fr))` }}
            className="mt-6 grid h-56 items-end gap-1.5 border-b border-white/15 sm:h-64 sm:gap-3"
          >
            {years.map((y) => {
              const active = year === y.year;
              const dim = year !== "all" && !active;
              return (
                <li key={y.year} className="flex h-full flex-col justify-end">
                  <button
                    type="button"
                    aria-pressed={active}
                    aria-label={`${y.year}: ${y.count} clipping${y.count === 1 ? "" : "s"}`}
                    onClick={() => choose(active ? "all" : y.year)}
                    className="group flex h-full flex-col items-center justify-end gap-2 rounded-t-xl outline-none focus-visible:ring-2 focus-visible:ring-gold"
                  >
                    <span
                      aria-hidden="true"
                      className={cn("font-heading text-sm font-bold tabular-nums transition-colors sm:text-base", active ? "text-gold" : "text-white/70 group-hover:text-white")}
                    >
                      {y.count}
                    </span>
                    <span
                      aria-hidden="true"
                      style={{ height: `${Math.max(6, (y.count / max) * 100)}%` }}
                      className={cn(
                        "relative w-full max-w-12 overflow-hidden rounded-t-lg transition duration-300 group-hover:-translate-y-0.5",
                        active
                          ? "bg-[linear-gradient(180deg,#e7c47a,#d9ae56_40%,#c99b43)] shadow-[0_0_28px_rgba(217,174,86,0.45)]"
                          : "bg-[linear-gradient(180deg,rgba(255,255,255,0.42),rgba(255,255,255,0.12))] group-hover:bg-[linear-gradient(180deg,rgba(255,255,255,0.65),rgba(255,255,255,0.2))]",
                        dim && "opacity-45",
                      )}
                    >
                      <span className="absolute inset-x-0 top-0 h-px bg-white/70" />
                    </span>
                  </button>
                </li>
              );
            })}
          </Reveal>
          <ul aria-hidden="true" style={{ gridTemplateColumns: `repeat(${years.length}, minmax(0, 1fr))` }} className="mt-2 grid gap-1.5 text-center font-mono text-[10px] font-bold text-white/55 sm:gap-3 sm:text-xs">
            {years.map((y) => (
              <li key={y.year} className={cn(year === y.year && "text-gold")}>
                <span className="sm:hidden">’{y.year.slice(2)}</span>
                <span className="hidden sm:inline">{y.year}</span>
              </li>
            ))}
          </ul>
        </div>

        <div aria-live="polite" className="relative flex flex-col justify-between overflow-hidden rounded-[1.75rem] bg-white p-6 text-navy shadow-[0_30px_70px_rgba(4,15,42,0.45)] sm:p-8">
          <Newspaper aria-hidden="true" className="pointer-events-none absolute -bottom-8 -right-6 size-44 -rotate-12 text-navy/[0.04]" />
          <div className="flex items-center gap-3">
            <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-royal/10 text-royal">
              <Newspaper className="size-6" aria-hidden="true" />
            </span>
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-royal">{year === "all" ? `${first} to ${last}` : `Press, ${year}`}</p>
          </div>
          <p className="mt-6 flex items-end gap-3">
            <span key={year} className="font-heading text-7xl font-bold leading-none text-navy motion-safe:animate-in motion-safe:fade-in motion-safe:zoom-in-90 motion-safe:duration-500 sm:text-8xl">
              {filtered.length}
            </span>
            <span className="pb-2 font-heading text-xl font-bold leading-tight text-navy/80">
              clipping{filtered.length === 1 ? "" : "s"}
              <span className="block text-base font-normal text-slate-500">{year === "all" ? `from ${first} to ${last}` : `from ${year}`}</span>
            </span>
          </p>
          <p className="mt-6 flex gap-3 border-t border-line pt-5 text-[15px] leading-relaxed text-slate-600">
            <ZoomIn className="mt-1 size-4 shrink-0 text-gold-deep" aria-hidden="true" />
            <span>
              Newspaper coverage in Hindi, Urdu, English and Punjabi, with each headline in English. Tap a cutting to read it; <strong className="font-semibold text-navy">Full size</strong> opens
              the original scan for zooming in.
            </span>
          </p>
        </div>
      </div>

      <Reveal key={year} as="ul" stagger={45} className="mt-12 columns-2 gap-3 sm:columns-3 sm:gap-5 lg:mt-14 lg:columns-4">
        {shown.map((c, i) => {
          const long = c.height / c.width > 1.45;
          return (
            <li key={c.src} className="mb-5 break-inside-avoid pt-2.5 sm:mb-7">
              <button
                type="button"
                onClick={() => setIndex(i)}
                aria-label={`Read clipping: ${c.caption ?? c.alt}`}
                className={cn(
                  "group relative block w-full rounded-md bg-[#f6f2e8] p-1.5 text-left text-navy shadow-[0_14px_30px_rgba(0,0,0,0.35)] outline-none transition duration-500 ease-out hover:z-10 hover:-translate-y-1.5 hover:rotate-0 hover:shadow-[0_30px_60px_rgba(0,0,0,0.5)] focus-visible:rotate-0 focus-visible:ring-4 focus-visible:ring-gold sm:p-2",
                  tilt[i % tilt.length],
                )}
              >
                <span
                  aria-hidden="true"
                  className="absolute -top-2.5 left-1/2 z-10 h-5 w-14 -translate-x-1/2 rotate-[-4deg] rounded-[2px] bg-gold/75 shadow-[0_2px_4px_rgba(0,0,0,0.2)] sm:w-16"
                />
                <span className="relative block overflow-hidden rounded-[3px] bg-white ring-1 ring-black/5">
                  <Image
                    src={c.src}
                    alt={c.alt}
                    width={c.width}
                    height={c.height}
                    sizes="(min-width: 1024px) 290px, (min-width: 640px) 31vw, 46vw"
                    className={cn("h-auto w-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-[1.03]", long && "max-h-[24rem]")}
                  />
                  {long ? (
                    <span aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-[linear-gradient(to_top,#f6f2e8,transparent)]" />
                  ) : null}
                  <span
                    aria-hidden="true"
                    className="absolute right-2 top-2 grid size-9 scale-75 place-items-center rounded-full bg-navy text-gold opacity-0 shadow-[0_8px_18px_rgba(4,15,42,0.4)] transition duration-300 group-hover:scale-100 group-hover:opacity-100 group-focus-visible:scale-100 group-focus-visible:opacity-100"
                  >
                    <Expand className="size-4" />
                  </span>
                </span>
                <span className="block px-1 pb-1 pt-2.5 sm:px-1.5">
                  <span className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[10px] font-bold uppercase leading-snug tracking-[0.12em] text-slate-500">
                    <span className="rounded-full bg-navy px-2 py-0.5 tabular-nums tracking-normal text-gold">{c.year}</span>
                    {c.source ? <span>{c.source}</span> : null}
                  </span>
                  {c.caption ? <span className="mt-1.5 line-clamp-3 block font-heading text-[13px] font-bold leading-snug text-navy sm:text-sm">{c.caption}</span> : null}
                </span>
              </button>
            </li>
          );
        })}
      </Reveal>

      {hidden > 0 ? (
        <div className="mt-4 flex justify-center">
          <button
            type="button"
            onClick={() => setExpanded(true)}
            className="group inline-flex items-center gap-3 rounded-full bg-gold px-6 py-3 text-sm font-bold text-navy shadow-[0_14px_30px_rgba(217,174,86,0.3)] transition hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/60"
          >
            Show all {filtered.length} clippings
            <span className="grid size-7 place-items-center rounded-full bg-navy/10 transition-transform duration-300 group-hover:translate-y-0.5">
              <ChevronDown className="size-4" aria-hidden="true" />
            </span>
          </button>
        </div>
      ) : null}

      <PhotoViewer photos={filtered} index={index} onIndexChange={setIndex} title={year === "all" ? "Press clippings" : `Press clippings, ${year}`} tall fullSize />
    </>
  );
}
