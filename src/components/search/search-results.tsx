import Link from "next/link";
import { ArrowRight, CornerDownRight, Lightbulb, SearchX, Sparkles } from "lucide-react";
import { popularSearches, search, type SearchEntry } from "@/lib/search-index";
import { GroundWatermark } from "@/components/layout/ground-watermark";
import { Reveal } from "@/components/motion/reveal";
import { iconFor, slug } from "./section-icon";

function groupBySection(entries: SearchEntry[]) {
  const groups = new Map<string, SearchEntry[]>();
  for (const e of entries) {
    const list = groups.get(e.section) ?? [];
    list.push(e);
    groups.set(e.section, list);
  }
  return Array.from(groups.entries());
}

function terms(query: string) {
  return query
    .toLowerCase()
    .split(/[^\p{L}\p{N}]+/u)
    .filter((t) => t.length > 1);
}

/** Wraps the words of the query in <mark> so readers see why a result matched. */
function Highlight({ text, words }: { text: string; words: string[] }) {
  if (!words.length) return <>{text}</>;
  const pattern = new RegExp(`(${words.map((w) => w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})`, "gi");
  return (
    <>
      {text.split(pattern).map((part, i) =>
        i % 2 === 1 ? (
          <mark key={i} className="rounded-[4px] bg-gold/30 px-0.5 text-inherit">
            {part}
          </mark>
        ) : (
          part
        ),
      )}
    </>
  );
}

/** "/rules#english" → "rules › english" */
function prettyPath(href: string) {
  const [path, hash] = href.split("#");
  const parts = path.split("/").filter(Boolean);
  if (hash) parts.push(hash);
  return parts.length ? parts.join(" › ") : "home";
}

export function PopularSearches({ label = "Popular searches", tone = "light" }: { label?: string; tone?: "light" | "plain" }) {
  return (
    <div>
      <p className="flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.24em] text-royal">
        <span aria-hidden="true" className="h-px w-8 bg-gold-deep" />
        {label}
      </p>
      <Reveal stagger={45} as="ul" className="mt-4 flex flex-wrap gap-2">
        {popularSearches.map((s) => {
          const Icon = iconFor(s);
          return (
            <li key={s}>
              <Link
                href={`/search?q=${encodeURIComponent(s)}`}
                className={
                  "group inline-flex items-center gap-2 rounded-full py-1.5 pl-1.5 pr-4 text-sm font-bold text-navy ring-1 ring-line transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_10px_24px_rgba(15,46,99,0.12)] hover:ring-royal/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold " +
                  (tone === "light" ? "bg-surface hover:bg-white" : "bg-white")
                }
              >
                <span className="grid size-7 place-items-center rounded-full bg-royal/10 text-royal transition duration-300 group-hover:-rotate-6 group-hover:bg-royal group-hover:text-white">
                  <Icon className="size-3.5" aria-hidden="true" />
                </span>
                {s}
              </Link>
            </li>
          );
        })}
      </Reveal>
    </div>
  );
}

export function SearchResults({ query }: { query: string }) {
  if (!query.trim()) {
    return (
      <Reveal className="relative overflow-hidden rounded-[1.75rem] bg-white p-6 shadow-[0_12px_30px_rgba(15,46,99,0.07)] ring-1 ring-line sm:p-10">
        <GroundWatermark className="pointer-events-none absolute -right-40 -top-24 w-[560px] text-navy/[0.035]" />
        <div className="relative flex items-start gap-4">
          <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-gold/15 text-gold-deep motion-safe:animate-float">
            <Sparkles className="size-6" aria-hidden="true" />
          </span>
          <div>
            <h2 className="font-heading text-2xl font-bold text-navy sm:text-[1.75rem]">What are you looking for?</h2>
            <p className="mt-1.5 text-[16px] leading-relaxed text-slate-500">
              Type a team, tournament, rule or name. Results open the right page and section.
            </p>
          </div>
        </div>
        <div className="relative mt-8 border-t border-line pt-7">
          <PopularSearches />
        </div>
      </Reveal>
    );
  }

  const results = search(query);
  if (!results.length) {
    return (
      <Reveal from="scale" className="relative overflow-hidden rounded-[1.75rem] bg-white p-6 shadow-[0_12px_30px_rgba(15,46,99,0.07)] ring-1 ring-line sm:p-10">
        <GroundWatermark className="pointer-events-none absolute -right-40 -top-24 w-[560px] text-navy/[0.035]" />
        <div className="relative flex flex-col items-start gap-4 sm:flex-row">
          <span className="grid size-14 shrink-0 place-items-center rounded-2xl bg-ball/10 text-ball">
            <SearchX className="size-7" aria-hidden="true" />
          </span>
          <div>
            <h2 className="font-heading text-2xl font-bold text-navy sm:text-[1.75rem]">No results for “{query}”</h2>
            <p className="mt-2 text-[16px] leading-relaxed text-slate-500">
              Check the spelling, try a shorter word, or write to us through the{" "}
              <Link href="/contact#enquiry" className="font-bold text-royal underline decoration-gold/60 decoration-2 underline-offset-4 hover:decoration-royal">
                enquiry form
              </Link>
              .
            </p>
          </div>
        </div>
        <div className="relative mt-8 border-t border-line pt-7">
          <PopularSearches label="Try one of these" />
        </div>
      </Reveal>
    );
  }

  const words = terms(query);
  const groups = groupBySection(results);

  return (
    <div className="space-y-12">
      <Reveal className="flex flex-col gap-4 border-b border-line pb-5 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-slate-500" aria-live="polite">
          <span className="font-heading text-3xl font-bold text-navy">{results.length}</span>{" "}
          result{results.length === 1 ? "" : "s"} for <span className="font-bold text-navy">“{query}”</span>
        </p>
        {groups.length > 1 ? (
          <nav aria-label="Jump to a section">
            <ul className="flex flex-wrap gap-2">
              {groups.map(([section, entries]) => (
                <li key={section}>
                  <a
                    href={`#results-${slug(section)}`}
                    className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-xs font-bold text-navy ring-1 ring-line transition hover:bg-navy hover:text-white hover:ring-navy"
                  >
                    {section}
                    <span className="tabular-nums text-slate-400">{entries.length}</span>
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        ) : null}
      </Reveal>

      {groups.map(([section, entries]) => {
        const Icon = iconFor(section);
        const id = `results-${slug(section)}`;
        return (
          <section key={section} id={id} aria-labelledby={`${id}-title`} className="scroll-mt-28">
            <Reveal className="flex items-center gap-3">
              <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-navy text-gold shadow-[0_8px_18px_rgba(15,46,99,0.2)]">
                <Icon className="size-5" aria-hidden="true" />
              </span>
              <h2 id={`${id}-title`} className="font-heading text-xl font-bold text-navy sm:text-2xl">
                {section}
              </h2>
              <span className="rounded-full bg-white px-2.5 py-0.5 text-xs font-bold tabular-nums text-slate-500 ring-1 ring-line">{entries.length}</span>
              <span aria-hidden="true" className="h-px flex-1 bg-[linear-gradient(90deg,var(--color-line),transparent)]" />
            </Reveal>
            <Reveal stagger={70} as="ul" className="mt-5 grid gap-4 md:grid-cols-2">
              {entries.map((e) => (
                <li key={e.id}>
                  <Link
                    href={e.href}
                    className="group card-premium relative flex h-full flex-col overflow-hidden rounded-2xl bg-white p-5 shadow-[0_10px_24px_rgba(15,46,99,0.05)] ring-1 ring-line transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_50px_rgba(15,46,99,0.13)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-gold sm:p-6"
                  >
                    <span aria-hidden="true" className="absolute inset-y-5 left-0 w-[3px] origin-top scale-y-0 rounded-r-full bg-gold transition-transform duration-500 group-hover:scale-y-100" />
                    <span className="font-heading text-xl font-bold leading-snug text-navy transition-colors group-hover:text-royal">
                      <Highlight text={e.title} words={words} />
                    </span>
                    {e.description ? (
                      <span className="mt-2 line-clamp-3 text-[15px] leading-relaxed text-slate-500">
                        <Highlight text={e.description} words={words} />
                      </span>
                    ) : null}
                    <span className="mt-auto flex items-center gap-3 pt-5">
                      <span className="flex min-w-0 items-center gap-1.5 rounded-full bg-surface px-2.5 py-1 font-mono text-[11px] text-slate-500 ring-1 ring-line">
                        <CornerDownRight className="size-3 shrink-0 text-gold-deep" aria-hidden="true" />
                        <span className="truncate">{prettyPath(e.href)}</span>
                      </span>
                      <span className="ml-auto grid size-9 shrink-0 place-items-center rounded-full bg-surface text-royal ring-1 ring-line transition duration-300 group-hover:bg-royal group-hover:text-white group-hover:ring-royal">
                        <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5" aria-hidden="true" />
                      </span>
                    </span>
                  </Link>
                </li>
              ))}
            </Reveal>
          </section>
        );
      })}

      <Reveal className="flex items-start gap-3 rounded-2xl bg-navy/[0.04] p-5 text-[15px] text-slate-600 ring-1 ring-navy/10">
        <Lightbulb className="mt-0.5 size-5 shrink-0 text-gold-deep" aria-hidden="true" />
        <p>
          Not what you needed? Try a shorter word, or write to us through the{" "}
          <Link href="/contact#enquiry" className="font-bold text-royal underline decoration-gold/60 decoration-2 underline-offset-4 hover:decoration-royal">
            enquiry form
          </Link>
          .
        </p>
      </Reveal>
    </div>
  );
}
