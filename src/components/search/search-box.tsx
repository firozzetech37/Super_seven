import { Search } from "lucide-react";

/** Plain GET form so the search works without JavaScript. */
export function SearchBox({ query }: { query: string }) {
  return (
    <form action="/search" role="search" className="relative">
      <label htmlFor="search-page-input" className="sr-only">
        Search the site
      </label>
      <Search className="pointer-events-none absolute left-6 top-1/2 size-5 -translate-y-1/2 text-slate-400" aria-hidden="true" />
      <input
        id="search-page-input"
        name="q"
        type="search"
        defaultValue={query}
        placeholder="Search teams, fixtures, rules, people…"
        autoFocus={!query}
        className="h-16 w-full rounded-full bg-white pl-14 pr-36 text-lg text-navy shadow-[0_18px_40px_rgba(15,46,99,0.12)] ring-1 ring-line outline-none transition placeholder:text-slate-400 focus:ring-2 focus:ring-royal"
      />
      <button
        type="submit"
        className="absolute right-2 top-1/2 h-12 -translate-y-1/2 rounded-full bg-navy px-6 font-bold text-white transition hover:bg-royal"
      >
        Search
      </button>
    </form>
  );
}
