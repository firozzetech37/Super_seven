"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Search, SearchX } from "lucide-react";
import { Reveal } from "@/components/motion/reveal";
import { statusMeta, type Status } from "@/lib/data/locations";
import { cn } from "@/lib/utils";

export type Place = { slug: string; name: string; href: string; status: Status; meta?: string };

const order: Status[] = ["onboarded", "talks", "unreached"];
const halo: Record<Status, string> = {
  onboarded: "shadow-[0_0_0_4px_rgba(123,198,126,0.22)]",
  talks: "shadow-[0_0_0_4px_rgba(242,212,92,0.25)]",
  unreached: "shadow-[0_0_0_4px_rgba(244,169,169,0.25)]",
};

/**
 * Searchable, status-filterable grid of places (states, districts or localities). Works as plain links
 * before hydration; the search box appears only when the list is long enough to need it.
 */
export function PlaceDirectory({ items, noun }: { items: Place[]; noun: { one: string; many: string } }) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Status | "all">("all");

  const counts = useMemo(() => {
    const c: Record<Status, number> = { onboarded: 0, talks: 0, unreached: 0 };
    for (const i of items) c[i.status] += 1;
    return c;
  }, [items]);

  const q = query.trim().toLowerCase();
  const visible = items.filter((i) => (filter === "all" || i.status === filter) && (!q || i.name.toLowerCase().includes(q)));
  const searchable = items.length > 8;
  const filters: { key: Status | "all"; label: string; count: number }[] = [
    { key: "all", label: "All", count: items.length },
    ...order.filter((s) => counts[s] > 0).map((s) => ({ key: s, label: statusMeta[s].label, count: counts[s] })),
  ];

  return (
    <div>
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div role="group" aria-label={`Filter ${noun.many} by status`} className="-mx-1 flex flex-wrap gap-2 px-1">
          {filters.map((f) => {
            const on = filter === f.key;
            return (
              <button
                key={f.key}
                type="button"
                aria-pressed={on}
                onClick={() => setFilter(f.key)}
                className={cn(
                  "inline-flex items-center gap-2 rounded-full px-3.5 py-2 text-sm font-bold transition duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-royal focus-visible:ring-offset-2",
                  on ? "bg-navy text-white shadow-[0_10px_24px_rgba(15,46,99,0.25)]" : "bg-white text-slate-600 ring-1 ring-line hover:text-navy hover:ring-royal/40",
                )}
              >
                {f.key !== "all" ? <span aria-hidden="true" className={cn("size-2 rounded-full", statusMeta[f.key].dot)} /> : null}
                {f.label}
                <span className={cn("rounded-full px-1.5 text-xs tabular-nums", on ? "bg-white/15 text-white" : "bg-surface text-slate-500")}>{f.count}</span>
              </button>
            );
          })}
        </div>
        {searchable ? (
          <label className="relative block w-full lg:w-72">
            <span className="sr-only">Search {noun.many}</span>
            <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-slate-400" aria-hidden="true" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={`Search ${items.length} ${noun.many}`}
              className="h-11 w-full rounded-full bg-white pl-11 pr-4 text-[15px] text-ink ring-1 ring-line transition placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-royal"
            />
          </label>
        ) : null}
      </div>

      <p aria-live="polite" className="mt-4 text-xs font-bold uppercase tracking-[0.16em] text-slate-400">
        {visible.length === items.length ? `${items.length} ${items.length === 1 ? noun.one : noun.many}` : `Showing ${visible.length} of ${items.length} ${noun.many}`}
      </p>

      {visible.length ? (
        <Reveal as="ul" stagger={30} className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {visible.map((p) => (
            <li key={p.slug}>
              <Link
                href={p.href}
                className="group card-premium flex h-full items-center gap-3.5 rounded-2xl bg-white px-4 py-3.5 shadow-[0_2px_8px_rgba(15,46,99,0.04)] ring-1 ring-line transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_36px_rgba(15,46,99,0.12)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-royal"
              >
                <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-surface ring-1 ring-line transition-colors duration-300 group-hover:bg-navy group-hover:ring-navy">
                  <span aria-hidden="true" className={cn("size-2.5 rounded-full", statusMeta[p.status].dot, halo[p.status])} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-bold text-navy">{p.name}</span>
                  <span className="block truncate text-xs text-slate-500">
                    {statusMeta[p.status].label}
                    {p.meta ? ` · ${p.meta}` : ""}
                  </span>
                </span>
                <ArrowUpRight className="size-4 shrink-0 text-slate-300 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-royal" aria-hidden="true" />
              </Link>
            </li>
          ))}
        </Reveal>
      ) : (
        <div className="mt-4 flex flex-col items-center rounded-3xl border border-dashed border-line bg-white/60 px-6 py-12 text-center">
          <span className="grid size-12 place-items-center rounded-2xl bg-royal/10 text-royal">
            <SearchX className="size-6" aria-hidden="true" />
          </span>
          <p className="mt-4 font-heading text-xl font-bold text-navy">No {noun.many} match</p>
          <p className="mt-1 text-sm text-slate-500">Try another spelling or show every status.</p>
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setFilter("all");
            }}
            className="mt-5 rounded-full bg-navy px-5 py-2.5 text-sm font-bold text-white transition hover:bg-royal"
          >
            Clear filters
          </button>
        </div>
      )}
    </div>
  );
}
