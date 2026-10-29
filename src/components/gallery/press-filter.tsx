"use client";

import { useState } from "react";
import { Newspaper } from "lucide-react";
import { cn } from "@/lib/utils";

/** Year chips that filter the press-clipping count. The scans themselves are still being migrated from the old site. */
export function PressFilter({ years }: { years: { year: string; count: number }[] }) {
  const [year, setYear] = useState<string>("all");
  const total = years.reduce((n, y) => n + y.count, 0);
  const selected = years.find((y) => y.year === year);
  const count = selected ? selected.count : total;

  return (
    <div>
      <div role="group" aria-label="Filter by year" className="flex flex-wrap gap-2">
        {[{ year: "all", count: total }, ...years].map((y) => {
          const active = year === y.year;
          return (
            <button
              key={y.year}
              type="button"
              aria-pressed={active}
              onClick={() => setYear(y.year)}
              className={cn(
                "inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold ring-1 transition",
                active ? "bg-navy text-white ring-navy" : "bg-white text-navy ring-line hover:ring-royal/50",
              )}
            >
              {y.year === "all" ? "All years" : y.year}
              <span className={cn("rounded-full px-1.5 text-[11px] tabular-nums", active ? "bg-gold text-navy" : "bg-surface text-slate-500")}>{y.count}</span>
            </button>
          );
        })}
      </div>

      <div aria-live="polite" className="mt-6 rounded-2xl bg-white p-8 ring-1 ring-line">
        <div className="flex items-start gap-4">
          <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-royal/10 text-royal">
            <Newspaper className="size-6" aria-hidden="true" />
          </span>
          <div>
            <p className="font-heading text-xl font-bold text-navy">
              {count} clipping{count === 1 ? "" : "s"} {year === "all" ? "from 2003 to 2016" : `from ${year}`}
            </p>
            <p className="mt-2 max-w-2xl text-[16px] leading-relaxed text-slate-600">
              The newspaper cuttings on the old site (42 dated, plus two untitled), mostly from the Hindi press, are being scanned at full size and
              migrated with dates and captions. They will appear here year by year as that finishes.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
