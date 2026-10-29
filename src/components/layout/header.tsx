import Image from "next/image";
import Link from "next/link";
import { Search } from "lucide-react";
import { site } from "@/lib/site";
import { DesktopNav } from "./desktop-nav";
import { MobileNav } from "./mobile-nav";
import { SocialLinks } from "./social-links";

/**
 * Two-row header. The brand row scrolls away on desktop while the menu bar (DesktopNav) sticks;
 * below lg the brand row itself sticks and carries the hamburger menu.
 */
export function Header() {
  return (
    <>
      <header
        id="site-brand"
        className="sticky top-0 z-40 bg-[linear-gradient(180deg,#17407f_0%,#0f2e63_100%)] text-white shadow-[0_10px_30px_rgba(4,15,42,0.35)] lg:static lg:shadow-none"
      >
        {/* Gold hairline (desktop gets it under the menu bar instead) */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-[linear-gradient(90deg,transparent,rgba(217,174,86,0.85)_18%,rgba(217,174,86,0.85)_82%,transparent)] lg:hidden"
        />

        <div className="mx-auto flex h-20 max-w-7xl items-center gap-4 px-4 sm:px-6">
          <Link href="/" className="group flex min-w-0 shrink items-center gap-3 sm:gap-4" aria-label={`${site.shortName} home`}>
            <span className="shrink-0 rounded-full bg-gradient-to-br from-gold to-gold-deep p-[3px] shadow-[0_6px_16px_rgba(4,15,42,0.45)] transition-transform duration-300 group-hover:scale-105">
              <span className="grid size-[52px] place-items-center overflow-hidden rounded-full bg-white md:size-[58px]">
                <Image src="/brand/logo.png" alt="" width={64} height={64} priority className="size-full rounded-full object-cover" />
              </span>
            </span>
            <span className="min-w-0">
              <span className="line-clamp-2 text-[15px] font-bold uppercase leading-tight tracking-[0.12em] sm:text-lg lg:text-[1.35rem]">
                {site.name}
              </span>
              <span className="mt-1 hidden items-center gap-2 whitespace-nowrap text-[11px] font-bold uppercase leading-none tracking-[0.26em] text-gold xl:flex">
                Seven players
                <span aria-hidden="true" className="size-1 rounded-full bg-gold/70" />
                Seven overs
                <span aria-hidden="true" className="size-1 rounded-full bg-gold/70" />
                Est. {site.foundedYear}
              </span>
            </span>
          </Link>

          <div className="ml-auto hidden items-center gap-3 lg:flex">
            <form action="/search" role="search" className="group/search relative">
              <label htmlFor="site-search" className="sr-only">
                Search
              </label>
              <button
                type="submit"
                aria-label="Search"
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/60 transition-colors group-focus-within/search:text-navy"
              >
                <Search className="size-4" />
              </button>
              <input
                id="site-search"
                name="q"
                type="search"
                placeholder="Search…"
                className="h-10 w-52 rounded-full bg-white/10 pl-10 pr-4 text-sm text-white ring-1 ring-white/20 outline-none transition-all duration-300 placeholder:text-white/55 hover:bg-white/15 focus:w-64 focus:bg-white focus:text-navy focus:ring-2 focus:ring-gold focus:placeholder:text-slate-400"
              />
            </form>
            <span aria-hidden="true" className="h-8 w-px bg-white/15" />
            <SocialLinks className="rounded-full bg-white/10 p-1 ring-1 ring-white/15" />
          </div>

          <MobileNav className="ml-auto lg:hidden" />
        </div>
      </header>

      <DesktopNav />
    </>
  );
}
