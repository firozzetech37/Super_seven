"use client";

import { useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";

/** Thin gold progress bar across the top of the viewport while a client-side navigation is in flight. */
export function NavProgress() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const bar = useRef<HTMLDivElement>(null);
  const finishRef = useRef<() => void>(() => {});

  useEffect(() => {
    const el = bar.current;
    if (!el) return;
    let active = false;
    let trickle: number | undefined;
    let safety: number | undefined;
    let fade: number | undefined;
    let reset: number | undefined;

    const finish = () => {
      if (!active) return;
      active = false;
      window.clearInterval(trickle);
      window.clearTimeout(safety);
      el.style.width = "100%";
      fade = window.setTimeout(() => {
        el.style.opacity = "0";
        reset = window.setTimeout(() => {
          el.style.transition = "none";
          el.style.width = "0%";
        }, 350);
      }, 180);
    };

    const start = () => {
      if (active) return;
      active = true;
      window.clearTimeout(fade);
      window.clearTimeout(reset);
      el.style.transition = "none";
      el.style.width = "0%";
      el.style.opacity = "1";
      requestAnimationFrame(() => {
        el.style.transition = "width 0.45s cubic-bezier(0.2, 0.7, 0.2, 1), opacity 0.3s ease";
        el.style.width = "28%";
      });
      let width = 28;
      trickle = window.setInterval(() => {
        width = Math.min(width + 3 + Math.random() * 7, 88);
        el.style.width = `${width}%`;
      }, 350);
      safety = window.setTimeout(finish, 10000);
    };

    finishRef.current = finish;

    // Capture phase: runs before Next's Link handler calls preventDefault.
    const onClick = (e: MouseEvent) => {
      if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const link = (e.target as Element | null)?.closest("a");
      if (!link || link.getAttribute("target") === "_blank" || link.hasAttribute("download")) return;
      const href = link.getAttribute("href");
      if (!href || href.startsWith("#")) return;
      const url = new URL(href, window.location.href);
      if (url.origin !== window.location.origin) return;
      if (url.pathname === window.location.pathname && url.search === window.location.search) return;
      start();
    };
    const onPop = () => start();
    document.addEventListener("click", onClick, true);
    window.addEventListener("popstate", onPop);
    return () => {
      document.removeEventListener("click", onClick, true);
      window.removeEventListener("popstate", onPop);
      window.clearInterval(trickle);
      window.clearTimeout(safety);
      window.clearTimeout(fade);
      window.clearTimeout(reset);
    };
  }, []);

  // Every route change completes the bar.
  const routeKey = `${pathname}?${searchParams.toString()}`;
  useEffect(() => {
    finishRef.current();
  }, [routeKey]);

  return (
    <div aria-hidden="true" data-nav-progress className="pointer-events-none fixed inset-x-0 top-0 z-[90] h-[3px]">
      <div
        ref={bar}
        className="h-full w-0 rounded-r-full bg-[linear-gradient(90deg,#c99b43,#d9ae56_60%,#fff1c2)] opacity-0 shadow-[0_0_14px_rgba(217,174,86,0.85)]"
      />
    </div>
  );
}
