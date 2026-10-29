"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { isNavActive } from "@/lib/nav";
import { navigation, registerCta, site, type NavItem } from "@/lib/site";

/** Re-mounts on every route change so any open dropdown closes without an effect. */
export function DesktopNav() {
  const pathname = usePathname();
  return <MenuBar key={pathname} pathname={pathname} />;
}

function MenuBar({ pathname }: { pathname: string }) {
  const [open, setOpen] = useState<string | null>(null);
  const [stuck, setStuck] = useState(false);
  const closeTimer = useRef<number | null>(null);
  const barRef = useRef<HTMLDivElement>(null);

  // The compact brand appears once the big header has scrolled out of view.
  useEffect(() => {
    const brand = document.getElementById("site-brand");
    if (!brand) return;
    const io = new IntersectionObserver(([entry]) => setStuck(!entry.isIntersecting), { threshold: 0 });
    io.observe(brand);
    return () => io.disconnect();
  }, []);

  // Click or tap outside closes an open menu.
  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: PointerEvent) => {
      if (!barRef.current?.contains(e.target as Node)) setOpen(null);
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open]);

  const show = (label: string) => {
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
    setOpen(label);
  };
  const hide = () => {
    closeTimer.current = window.setTimeout(() => setOpen(null), 120);
  };

  return (
    <div
      ref={barRef}
      onKeyDown={(e) => {
        if (e.key === "Escape") {
          setOpen(null);
          (e.target as HTMLElement).blur?.();
        }
      }}
      className={cn(
        "relative z-40 hidden bg-navy-deep text-white transition-shadow duration-300 lg:sticky lg:top-0 lg:block",
        stuck ? "shadow-[0_12px_30px_rgba(4,15,42,0.45)]" : "shadow-none",
      )}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-[linear-gradient(90deg,transparent,rgba(217,174,86,0.85)_18%,rgba(217,174,86,0.85)_82%,transparent)]"
      />
      <div className="mx-auto flex h-11 max-w-7xl items-center px-4 sm:px-6">
        <Link
          href="/"
          aria-label={`${site.shortName} home`}
          tabIndex={stuck ? 0 : -1}
          aria-hidden={!stuck}
          className={cn(
            "flex items-center gap-2 overflow-hidden transition-all duration-300",
            stuck ? "mr-5 max-w-[12rem] opacity-100" : "pointer-events-none max-w-0 opacity-0",
          )}
        >
          <span className="grid size-7 shrink-0 place-items-center overflow-hidden rounded-full bg-white ring-2 ring-gold">
            <Image src="/brand/logo.png" alt="" width={28} height={28} className="size-full object-cover" />
          </span>
          <span className="whitespace-nowrap text-sm font-bold tracking-[0.2em]">{site.shortName}</span>
        </Link>

        <nav aria-label="Main">
          <ul className="flex items-center gap-0.5">
            {navigation.map((item, i) => (
              <MenuEntry
                key={item.href}
                item={item}
                active={isNavActive(item, pathname)}
                open={open === item.label}
                alignEnd={i >= navigation.length - 2}
                onEnter={() => show(item.label)}
                onLeave={hide}
                onToggle={() => setOpen(open === item.label ? null : item.label)}
              />
            ))}
          </ul>
        </nav>

        <Link
          href={registerCta.href}
          className="group ml-auto inline-flex h-8 shrink-0 items-center gap-1.5 rounded-full bg-gold px-4 text-[13px] font-bold uppercase tracking-[0.08em] text-navy shadow-[0_4px_14px_rgba(4,15,42,0.35)] ring-1 ring-white/40 transition hover:-translate-y-px hover:bg-gold-deep focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/60"
        >
          {registerCta.label}
          <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
        </Link>
      </div>
    </div>
  );
}

function MenuEntry({
  item,
  active,
  open,
  alignEnd,
  onEnter,
  onLeave,
  onToggle,
}: {
  item: NavItem;
  active: boolean;
  open: boolean;
  alignEnd: boolean;
  onEnter: () => void;
  onLeave: () => void;
  onToggle: () => void;
}) {
  const children = item.children ?? [];
  const hasChildren = children.length > 0;
  const panelId = `menu-${item.label.toLowerCase().replace(/\W+/g, "-")}`;

  return (
    <li
      className="group/item relative"
      onMouseEnter={hasChildren ? onEnter : undefined}
      onMouseLeave={hasChildren ? onLeave : undefined}
    >
      <div
        className={cn(
          "flex h-8 items-center rounded-md transition-colors",
          open || active ? "bg-white/10" : "hover:bg-white/8",
        )}
      >
        <Link
          href={item.href}
          aria-current={active ? "page" : undefined}
          className={cn(
            "relative flex h-full items-center pl-3 text-[13px] font-bold uppercase tracking-[0.08em] transition-colors outline-none focus-visible:text-gold",
            hasChildren ? "pr-1" : "pr-3",
            active ? "text-white" : "text-white/80 hover:text-white",
          )}
        >
          {item.label}
          <span
            aria-hidden="true"
            className={cn(
              "absolute inset-x-3 -bottom-[7px] h-0.5 rounded-full bg-gold transition-opacity duration-200",
              active ? "opacity-100" : "opacity-0",
            )}
          />
        </Link>
        {hasChildren ? (
          <button
            type="button"
            aria-expanded={open}
            aria-controls={panelId}
            aria-label={`${item.label} menu`}
            onClick={onToggle}
            className="grid h-full w-6 place-items-center pr-1 text-white/65 outline-none transition-colors hover:text-white focus-visible:text-gold"
          >
            <ChevronDown className={cn("size-3.5 transition-transform duration-200", open && "rotate-180")} aria-hidden="true" />
          </button>
        ) : null}
      </div>

      {hasChildren ? (
        <div
          id={panelId}
          className={cn(
            "absolute top-full z-50 pt-2 transition-[opacity,translate,visibility] duration-150",
            alignEnd ? "right-0" : "left-0",
            open
              ? "visible translate-y-0 opacity-100"
              : "invisible -translate-y-1 opacity-0 group-focus-within/item:visible group-focus-within/item:translate-y-0 group-focus-within/item:opacity-100",
          )}
        >
          <div className="w-72 overflow-hidden rounded-2xl bg-white text-navy shadow-[0_24px_60px_rgba(4,15,42,0.38)] ring-1 ring-navy/10">
            <div aria-hidden="true" className="h-1 bg-gradient-to-r from-gold to-gold-deep" />
            <p className="px-5 pt-3 text-[11px] font-bold uppercase tracking-[0.22em] text-royal">{item.label}</p>
            <ul className="p-2">
              {children.map((c) => (
                <li key={c.href}>
                  <Link
                    href={c.href}
                    className="group/link flex items-start gap-3 rounded-xl px-3 py-2 outline-none transition-colors hover:bg-surface focus-visible:bg-surface"
                  >
                    <span aria-hidden="true" className="mt-[7px] size-1.5 shrink-0 rounded-full bg-gold" />
                    <span className="min-w-0">
                      <span className="block text-[15px] font-bold leading-snug text-navy transition-colors group-hover/link:text-royal">
                        {c.label}
                      </span>
                      {c.description ? <span className="mt-0.5 block text-xs leading-snug text-slate-500">{c.description}</span> : null}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
            <Link
              href={item.href}
              className="flex items-center justify-between border-t border-line bg-surface px-5 py-2.5 text-sm font-bold text-royal outline-none transition-colors hover:text-navy focus-visible:text-navy"
            >
              Open {item.label}
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      ) : null}
    </li>
  );
}
