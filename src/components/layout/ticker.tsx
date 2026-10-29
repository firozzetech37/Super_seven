import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getUpcomingFixtures } from "@/lib/queries/fixtures";
import { Marquee } from "./marquee";

/** Upcoming-match strip right under the header (borrowed from BCCI). */
export async function Ticker() {
  const upcomingFixtures = await getUpcomingFixtures();
  return (
    <div className="border-b border-white/10 bg-navy text-white">
      <div className="mx-auto flex h-10 max-w-7xl items-center gap-3 px-4 text-sm sm:gap-4 sm:px-6">
        <span className="flex shrink-0 items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-gold">
          <span className="relative flex size-2">
            <span className="absolute inline-flex size-full rounded-full bg-gold/70 motion-safe:animate-ping" />
            <span className="relative inline-flex size-2 rounded-full bg-gold" />
          </span>
          Next matches
        </span>
        <span aria-hidden="true" className="h-5 w-px shrink-0 bg-white/15" />
        <Marquee>
          {upcomingFixtures.map((f) => (
            <span key={f.id} className="whitespace-nowrap">
              <Link
                href={f.href}
                className="inline-flex items-center gap-2 text-[15px] font-bold text-white/90 transition-colors hover:text-gold"
              >
                {f.title}
                {f.city ? <span className="font-normal text-white/65">· {f.city}</span> : null}
                {f.sample ? (
                  <span className="rounded-full bg-white/10 px-2 py-px text-[10px] font-bold uppercase tracking-wider text-white/60">
                    sample
                  </span>
                ) : null}
              </Link>
            </span>
          ))}
        </Marquee>
        <Link
          href="/fixtures"
          className="ml-auto hidden shrink-0 items-center gap-1 text-xs font-bold uppercase tracking-[0.12em] text-white/70 transition-colors hover:text-white md:inline-flex"
        >
          All fixtures
          <ArrowRight className="size-3.5" aria-hidden="true" />
        </Link>
      </div>
    </div>
  );
}
