import Link from "next/link";
import { ArrowRight, Construction } from "lucide-react";

/** Honest "being built" card for sections whose data needs the Phase 2 database or content from SSCFI. */
export function SectionPlaceholder({
  items = [],
  links = [],
  note = "This section is being built. The structure is final; the content arrives in the next phase.",
  phase = "Coming in Phase 2",
}: {
  items?: string[];
  links?: { label: string; href: string }[];
  note?: string;
  phase?: string;
}) {
  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <div className="relative overflow-hidden rounded-3xl bg-surface p-8 ring-1 ring-line sm:p-10">
        <div aria-hidden="true" className="pointer-events-none absolute -right-16 -top-16 size-56 rounded-full bg-royal/5 blur-2xl" />
        <div className="flex items-start gap-4">
          <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-royal/10 text-royal">
            <Construction className="size-6" aria-hidden="true" />
          </span>
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-royal">{phase}</p>
            <p className="mt-2 max-w-2xl text-[17px] leading-relaxed text-slate-600">{note}</p>
          </div>
        </div>
        {items.length ? (
          <ul className="mt-6 flex flex-wrap gap-2">
            {items.map((i) => (
              <li key={i} className="rounded-full bg-white px-4 py-1.5 text-sm font-bold text-navy ring-1 ring-line">
                {i}
              </li>
            ))}
          </ul>
        ) : null}
        {links.length ? (
          <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {links.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="group flex items-center justify-between rounded-2xl bg-white px-5 py-4 font-bold text-royal ring-1 ring-line transition hover:-translate-y-0.5 hover:shadow-[0_12px_30px_rgba(15,46,99,0.12)] hover:ring-royal/40"
                >
                  {l.label}
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                </Link>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </section>
  );
}
