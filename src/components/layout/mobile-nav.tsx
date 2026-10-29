"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight, ChevronDown, Menu, Search, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { isNavActive } from "@/lib/nav";
import { navigation, registerCta, site } from "@/lib/site";
import { SocialLinks } from "./social-links";

/** Re-mounts the panel on every route change so the menu closes without an effect. */
export function MobileNav({ className }: { className?: string }) {
  const pathname = usePathname();
  return <MobileNavPanel key={pathname} className={className} pathname={pathname} />;
}

function MobileNavPanel({ className, pathname }: { className?: string; pathname: string }) {
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(
    () => navigation.find((n) => n.children && isNavActive(n, pathname))?.label ?? null,
  );

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <div className={className}>
      <button
        type="button"
        aria-expanded={open}
        aria-controls="mobile-menu"
        aria-label={open ? "Close menu" : "Open menu"}
        onClick={() => setOpen((v) => !v)}
        className="grid size-11 place-items-center rounded-full bg-white/10 text-white ring-1 ring-white/30 transition hover:bg-white/15"
      >
        {open ? <X className="size-6" /> : <Menu className="size-6" />}
      </button>

      <div
        id="mobile-menu"
        hidden={!open}
        className={cn(
          "fixed inset-x-0 top-20 bottom-0 z-50 overflow-y-auto bg-navy-deep text-white",
          open ? "animate-in fade-in-0 slide-in-from-top-2 duration-200" : "",
        )}
      >
        <div className="space-y-5 px-4 py-5 sm:px-6">
          <form action="/search" role="search" className="relative">
            <label htmlFor="mobile-search" className="sr-only">
              Search
            </label>
            <input
              id="mobile-search"
              name="q"
              type="search"
              placeholder="Search teams, fixtures, rules…"
              className="h-12 w-full rounded-full bg-white pl-5 pr-12 text-navy outline-none ring-2 ring-transparent placeholder:text-slate-400 focus:ring-gold"
            />
            <button type="submit" aria-label="Search" className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
              <Search className="size-5" />
            </button>
          </form>

          <Link
            href={registerCta.href}
            className="flex items-center justify-center gap-2 rounded-full bg-gold px-5 py-3 text-center font-bold text-navy shadow-md transition hover:bg-gold-deep"
          >
            Register with {site.shortName}
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>

          <ul className="divide-y divide-white/10 overflow-hidden rounded-2xl bg-white/5 ring-1 ring-white/10">
            {navigation.map((item) => {
              const active = isNavActive(item, pathname);
              const isExpanded = expanded === item.label;
              const listId = `mobile-${item.label.toLowerCase().replace(/\W+/g, "-")}`;
              return (
                <li key={item.href}>
                  <div className="flex items-center">
                    <Link
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "flex flex-1 items-center gap-3 px-4 py-3.5 text-[15px] font-bold uppercase tracking-[0.08em]",
                        active ? "text-gold" : "text-white",
                      )}
                    >
                      <span aria-hidden="true" className={cn("size-1.5 rounded-full", active ? "bg-gold" : "bg-white/30")} />
                      {item.label}
                    </Link>
                    {item.children ? (
                      <button
                        type="button"
                        aria-expanded={isExpanded}
                        aria-controls={listId}
                        aria-label={`${item.label} submenu`}
                        onClick={() => setExpanded(isExpanded ? null : item.label)}
                        className="grid size-12 shrink-0 place-items-center text-white/70 transition hover:text-white"
                      >
                        <ChevronDown className={cn("size-5 transition-transform duration-200", isExpanded && "rotate-180")} />
                      </button>
                    ) : null}
                  </div>
                  {item.children ? (
                    <ul id={listId} hidden={!isExpanded} className="space-y-0.5 bg-navy/70 px-3 pb-3 pt-1">
                      {item.children.map((c) => (
                        <li key={c.href}>
                          <Link href={c.href} className="flex items-start gap-3 rounded-lg px-3 py-2 transition hover:bg-white/5">
                            <span aria-hidden="true" className="mt-2 size-1.5 shrink-0 rounded-full bg-gold" />
                            <span>
                              <span className="block font-bold">{c.label}</span>
                              {c.description ? <span className="block text-xs text-white/60">{c.description}</span> : null}
                            </span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </li>
              );
            })}
          </ul>

          <div className="flex items-center justify-between gap-4 pb-6 pt-1">
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/60">Follow {site.shortName}</p>
            <SocialLinks />
          </div>
        </div>
      </div>
    </div>
  );
}
