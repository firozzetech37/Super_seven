"use client";

import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";
import { cn } from "@/lib/utils";

type Tag = "div" | "section" | "article" | "li" | "ul" | "p" | "figure";

/** Fades and rises its children into view the first time they scroll on screen (CSS in globals: .reveal). */
export function Reveal({
  as = "div",
  delay = 0,
  className,
  children,
  ...rest
}: {
  as?: Tag;
  delay?: number;
  className?: string;
  children: ReactNode;
  id?: string;
  style?: CSSProperties;
}) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!("IntersectionObserver" in window)) {
      el.dataset.inview = "";
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            el.dataset.inview = "";
            io.disconnect();
          }
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Typed as "div" so the dynamic tag accepts the ref; every allowed tag shares the same props here.
  const Tag = as as "div";
  return (
    <Tag ref={ref as React.RefObject<HTMLDivElement>} id={rest.id} className={cn("reveal", className)} style={{ "--reveal-delay": `${delay}ms`, ...rest.style } as CSSProperties}>
      {children}
    </Tag>
  );
}
