"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";
import { cn } from "@/lib/utils";

/** Floating gold pill that appears after scrolling a screen's height. */
export function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 640);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <button
      type="button"
      aria-label="Back to top"
      tabIndex={visible ? 0 : -1}
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className={cn(
        "fixed right-5 z-30 grid size-12 place-items-center rounded-full bg-gold text-navy shadow-[0_12px_30px_rgba(4,15,42,0.4)] ring-2 ring-white/80 transition duration-300 hover:-translate-y-1 hover:bg-gold-deep focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-royal/50 print:hidden",
        "bottom-[5.5rem] lg:bottom-6",
        visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0",
      )}
    >
      <ArrowUp className="size-5" aria-hidden="true" />
    </button>
  );
}
