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
      <PageHeader title="Search" description="Teams, fixtures, rules, people and every page on the site." crumbs={[{ label: "Search" }]} />
      <section className="bg-surface py-12 lg:py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
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
      <div className="h-16 animate-pulse rounded-full bg-white ring-1 ring-line" />
      <div className="grid gap-4 md:grid-cols-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-28 animate-pulse rounded-2xl bg-white ring-1 ring-line" />
        ))}
      </div>
    </div>
  );
}
