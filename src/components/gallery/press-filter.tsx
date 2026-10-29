"use client";

import { useState } from "react";
import { Newspaper, ScanLine } from "lucide-react";
import { Reveal } from "@/components/motion/reveal";
import { cn } from "@/lib/utils";

/**
 * Press clippings by year, drawn as a bar chart of the per-year counts. Each bar is a filter button;
 * the panel shows the count for the chosen year. The scans themselves are still being migrated from the old site.
 */
export function PressFilter({ years }: { years: { year: string; count: number }[] }) {
  const [year, setYear] = useState<string>("all");
  const total = years.reduce((n, y) => n + y.count, 0);
  const max = Math.max(...years.map((y) => y.count), 1);
  const selected = years.find((y) => y.year === year);
  const count = selected ? selected.count : total;
  const first = years[0]?.year;
  const last = years[years.length - 1]?.year;

  return (
    <div className="grid gap-5 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)] lg:items-stretch">
      <div role="group" aria-label="Filter press clippings by year" className="rounded-[1.75rem] bg-white/[0.05] p-5 ring-1 ring-white/10 backdrop-blur sm:p-7">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/60">Clippings per year</p>
          <button
            type="button"
            aria-pressed={year === "all"}
            onClick={() => setYear("all")}
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
                  onClick={() => setYear(active ? "all" : y.year)}
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
            {count}
          </span>
          <span className="pb-2 font-heading text-xl font-bold leading-tight text-navy/80">
            clipping{count === 1 ? "" : "s"}
            <span className="block text-base font-normal text-slate-500">{year === "all" ? `from ${first} to ${last}` : `from ${year}`}</span>
          </span>
        </p>
        <p className="mt-6 flex gap-3 border-t border-line pt-5 text-[15px] leading-relaxed text-slate-600">
          <ScanLine className="mt-1 size-4 shrink-0 text-gold-deep" aria-hidden="true" />
          <span>
            The newspaper cuttings on the old site (42 dated, plus two untitled), mostly from the Hindi press, are being scanned at full size and
            migrated with dates and captions. They will appear here year by year as that finishes.
          </span>
        </p>
      </div>
    </div>
  );
}
