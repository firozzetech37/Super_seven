import type { Metadata } from "next";
import { Suspense } from "react";
import { PageHeader } from "@/components/layout/page-header";
import { SearchBox } from "@/components/search/search-box";
import { SearchResults } from "@/components/search/search-results";

export const metadata: Metadata = {
  title: "Search",
  description: "Search teams, players, fixtures, rules, news and pages.",
};

export default function SearchPage(props: PageProps<"/search">) {
  return (
    <>
      <PageHeader eyebrow="Find anything" title="Search" description="Teams, fixtures, rules, people and every page on the site." crumbs={[{ label: "Search" }]} />
      <section className="relative isolate bg-surface pb-16 lg:pb-24">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute inset-x-0 top-0 h-[420px] bg-[radial-gradient(rgba(15,46,99,0.07)_1px,transparent_1px)] [background-size:22px_22px] [mask-image:linear-gradient(to_bottom,#000,transparent)]" />
          <div className="absolute -right-32 top-40 size-[420px] rounded-full bg-royal/10 blur-[110px]" />
          <div className="absolute -left-32 top-[520px] size-[360px] rounded-full bg-gold/10 blur-[110px]" />
        </div>
        <div className="relative z-10 mx-auto -mt-9 max-w-5xl px-4 sm:-mt-10 sm:px-6">
          <Suspense fallback={<SearchSkeleton />}>
            <Results searchParams={props.searchParams} />
          </Suspense>
        </div>
      </section>
    </>
  );
}

/** searchParams is runtime data under Cache Components, so it resolves inside the Suspense boundary. */
async function Results({ searchParams }: Pick<PageProps<"/search">, "searchParams">) {
  const { q } = await searchParams;
  const query = (Array.isArray(q) ? q[0] : q ?? "").slice(0, 100);
  return (
    <div className="space-y-10">
      <SearchBox query={query} />
      <SearchResults query={query} />
    </div>
  );
}

function SearchSkeleton() {
  return (
    <div aria-hidden="true" className="space-y-10">
      <div className="h-16 rounded-full bg-white shadow-[0_24px_60px_rgba(15,46,99,0.16)] ring-1 ring-line sm:h-[4.5rem]" />
      <div className="grid gap-4 md:grid-cols-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-32 animate-shimmer rounded-2xl bg-[linear-gradient(90deg,#fff_25%,#eef2fa_50%,#fff_75%)] [background-size:200%_100%] ring-1 ring-line" />
        ))}
      </div>
    </div>
  );
}
