"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

/** Element id of the cricket-ground hero on the home page. */
export const homeHeroId = "home-hero";

/**
 * True when the Register call-to-action should show: always on inner pages, and on the home page
 * only once the hero has scrolled up behind the sticky menu bar (the hero is the menu there).
 */
export function usePastHero() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [past, setPast] = useState(false);

  useEffect(() => {
    if (!isHome) return;
    const hero = document.getElementById(homeHeroId);
    if (!hero) return;
    const io = new IntersectionObserver(
      ([entry]) => setPast(!entry.isIntersecting && entry.boundingClientRect.top < 0),
      { rootMargin: "-80px 0px 0px 0px", threshold: 0 },
    );
    io.observe(hero);
    return () => {
      io.disconnect();
      setPast(false);
    };
  }, [isHome]);

  return !isHome || past;
}
