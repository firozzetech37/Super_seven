import { ArrowRight, Search } from "lucide-react";

/** Plain GET form so the search works without JavaScript. */
export function SearchBox({ query }: { query: string }) {
  return (
    <form action="/search" role="search" className="group/search relative">
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -inset-1.5 rounded-full bg-[linear-gradient(120deg,rgba(217,174,86,0.55),rgba(28,79,160,0.45),rgba(217,174,86,0.55))] opacity-0 blur-md transition-opacity duration-500 group-focus-within/search:opacity-100"
      />
      <label htmlFor="search-page-input" className="sr-only">
        Search the site
      </label>
      <span
        aria-hidden="true"
        className="pointer-events-none absolute left-2.5 top-1/2 z-10 grid size-11 -translate-y-1/2 place-items-center rounded-full bg-royal/10 text-royal transition duration-300 group-focus-within/search:bg-royal group-focus-within/search:text-white sm:left-3 sm:size-12"
      >
        <Search className="size-5" />
      </span>
      <input
        id="search-page-input"
        name="q"
        type="search"
        defaultValue={query}
        placeholder="Search teams, fixtures, rules, people…"
        autoFocus={!query}
        className="relative h-16 w-full rounded-full bg-white pl-16 pr-16 text-base text-navy shadow-[0_24px_60px_rgba(15,46,99,0.16)] ring-1 ring-line outline-none transition placeholder:text-slate-400 focus:ring-2 focus:ring-royal sm:h-[4.5rem] sm:pl-[4.75rem] sm:pr-40 sm:text-lg [&::-webkit-search-cancel-button]:hidden"
      />
      <button
        type="submit"
        aria-label="Search"
        className="group/btn absolute right-2.5 top-1/2 z-10 inline-flex size-11 -translate-y-1/2 items-center justify-center gap-2 rounded-full bg-gold font-bold text-navy shadow-[0_10px_22px_rgba(15,46,99,0.22)] transition hover:bg-gold-deep focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-royal sm:right-3 sm:h-12 sm:w-auto sm:px-6"
      >
        <span className="hidden sm:inline">Search</span>
        <ArrowRight className="size-4 transition-transform group-hover/btn:translate-x-0.5" aria-hidden="true" />
      </button>
    </form>
  );
}
