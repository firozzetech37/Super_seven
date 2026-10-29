import Link from "next/link";
import { aboutLinks } from "@/lib/site";
import { cn } from "@/lib/utils";

/** "In this section" pills under the page banner, so the About pages read as one set. Scrolls sideways on phones. */
export function PeopleNav({ current }: { current: string }) {
  return (
    <nav aria-label="About SSCFI" className="border-b border-line bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 sm:px-6">
        <span className="hidden shrink-0 text-[11px] font-bold uppercase tracking-[0.24em] text-slate-400 lg:inline">In this section</span>
        <ul className="no-scrollbar -mx-4 flex flex-1 gap-2 overflow-x-auto px-4 py-3 sm:mx-0 sm:px-0">
          {aboutLinks.map((l) => {
            const active = l.href === current;
            return (
              <li key={l.href} className="shrink-0">
                <Link
                  href={l.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold transition duration-300 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-gold/60",
                    active
                      ? "bg-navy text-white shadow-[0_8px_18px_rgba(15,46,99,0.25)]"
                      : "text-slate-600 ring-1 ring-line hover:-translate-y-0.5 hover:bg-surface hover:text-navy hover:ring-royal/30",
                  )}
                >
                  {active ? <span aria-hidden="true" className="size-1.5 rounded-full bg-gold" /> : null}
                  {l.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
