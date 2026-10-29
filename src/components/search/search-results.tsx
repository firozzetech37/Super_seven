import Link from "next/link";
import { ArrowRight, SearchX } from "lucide-react";
import { popularSearches, search, type SearchEntry } from "@/lib/search-index";

function groupBySection(entries: SearchEntry[]) {
  const groups = new Map<string, SearchEntry[]>();
  for (const e of entries) {
    const list = groups.get(e.section) ?? [];
    list.push(e);
    groups.set(e.section, list);
  }
  return Array.from(groups.entries());
}

export function PopularSearches({ label = "Popular searches" }: { label?: string }) {
  return (
    <div>
      <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-royal">{label}</p>
      <ul className="mt-3 flex flex-wrap gap-2">
        {popularSearches.map((s) => (
          <li key={s}>
            <Link
              href={`/search?q=${encodeURIComponent(s)}`}
              className="inline-block rounded-full bg-white px-4 py-2 text-sm font-bold text-navy ring-1 ring-line transition hover:ring-royal"
            >
              {s}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function SearchResults({ query }: { query: string }) {
  if (!query.trim()) {
    return (
      <div className="space-y-8">
        <p className="text-lg text-slate-500">Type a team, tournament, rule or name. Results open the right page and section.</p>
        <PopularSearches />
      </div>
    );
  }

  const results = search(query);
  if (!results.length) {
    return (
      <div className="rounded-3xl bg-white p-8 ring-1 ring-line sm:p-10">
        <div className="flex items-start gap-4">
          <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-surface text-royal">
            <SearchX className="size-6" aria-hidden="true" />
          </span>
          <div>
            <h2 className="font-heading text-2xl font-bold text-navy">
              No results for “{query}”
            </h2>
            <p className="mt-2 text-slate-500">
              Check the spelling, try a shorter word, or write to us through the{" "}
              <Link href="/contact#enquiry" className="font-bold text-royal underline-offset-4 hover:underline">
                enquiry form
              </Link>
              .
            </p>
          </div>
        </div>
        <div className="mt-8">
          <PopularSearches label="Try one of these" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <p className="text-slate-500" aria-live="polite">
        <span className="font-bold text-navy">{results.length}</span> result{results.length === 1 ? "" : "s"} for{" "}
        <span className="font-bold text-navy">“{query}”</span>
      </p>
      {groupBySection(results).map(([section, entries]) => (
        <section key={section} aria-labelledby={`section-${section}`}>
          <h2 id={`section-${section}`} className="flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.24em] text-royal">
            <span aria-hidden="true" className="h-px w-8 bg-gold-deep" />
            {section}
          </h2>
          <ul className="mt-4 grid gap-4 md:grid-cols-2">
            {entries.map((e) => (
              <li key={e.id}>
                <Link
                  href={e.href}
                  className="group flex h-full flex-col rounded-2xl bg-white p-5 ring-1 ring-line transition hover:-translate-y-0.5 hover:shadow-[0_12px_30px_rgba(15,46,99,0.1)] hover:ring-royal/40"
                >
                  <span className="font-heading text-xl font-bold text-navy transition-colors group-hover:text-royal">{e.title}</span>
                  {e.description ? <span className="mt-1.5 text-[15px] leading-relaxed text-slate-500">{e.description}</span> : null}
                  <span className="mt-auto flex items-center gap-1.5 pt-4 text-sm font-bold text-royal">
                    <span className="truncate text-slate-400 font-normal">{e.href}</span>
                    <ArrowRight className="ml-auto size-4 shrink-0 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
