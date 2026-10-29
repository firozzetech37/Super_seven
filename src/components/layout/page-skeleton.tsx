import { cn } from "@/lib/utils";

/** Branded loading state in the page's own shape: navy banner plus a card grid, with a shimmer. */
export function PageSkeleton({ cards = 3 }: { cards?: number }) {
  return (
    <div aria-busy="true" aria-live="polite">
      <span className="sr-only">Loading</span>
      <section className="bg-stadium text-white">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:py-16">
          <div className="h-8 w-40 rounded-full shimmer-dark" />
          <div className="mt-6 h-3 w-28 rounded-full shimmer-dark" />
          <div className="mt-4 h-12 w-[min(32rem,80%)] rounded-2xl shimmer-dark" />
          <div className="mt-4 h-5 w-[min(40rem,90%)] rounded-full shimmer-dark" />
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <div className="h-3 w-24 rounded-full shimmer-light" />
        <div className="mt-4 h-10 w-80 max-w-full rounded-2xl shimmer-light" />
        <div className={cn("mt-10 grid gap-5", cards >= 3 ? "md:grid-cols-3" : "md:grid-cols-2")}>
          {Array.from({ length: cards }).map((_, i) => (
            <div key={i} className="rounded-2xl p-6 ring-1 ring-line">
              <div className="size-12 rounded-xl shimmer-light" />
              <div className="mt-5 h-6 w-2/3 rounded-full shimmer-light" />
              <div className="mt-3 h-4 w-full rounded-full shimmer-light" />
              <div className="mt-2 h-4 w-5/6 rounded-full shimmer-light" />
            </div>
          ))}
        </div>
        <div className="mt-6 h-40 rounded-3xl shimmer-light" />
      </section>
    </div>
  );
}

/** Table-shaped skeleton for directory and standings lists. */
export function RowsSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div aria-busy="true" className="overflow-hidden rounded-3xl bg-white ring-1 ring-line">
      <div className="h-12 bg-navy/90" />
      <ul className="divide-y divide-line">
        {Array.from({ length: rows }).map((_, i) => (
          <li key={i} className="grid grid-cols-[1fr_2fr_1fr_1fr] items-center gap-4 px-5 py-3.5">
            <span className="h-4 rounded-full shimmer-light" />
            <span className="h-4 rounded-full shimmer-light" />
            <span className="h-4 w-3/4 rounded-full shimmer-light" />
            <span className="h-5 w-16 rounded-full shimmer-light" />
          </li>
        ))}
      </ul>
    </div>
  );
}
