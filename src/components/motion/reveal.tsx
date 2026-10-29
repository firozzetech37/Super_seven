"use client";

import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";
import { cn } from "@/lib/utils";

type Tag = "div" | "section" | "article" | "li" | "ul" | "ol" | "dl" | "p" | "figure";
type From = "up" | "left" | "right" | "scale";

/**
 * Scroll-triggered entrance (CSS in globals: .reveal / .reveal-stagger).
 * Default: the element itself fades and rises the first time it scrolls on screen.
 * `stagger`: the element stays put and its direct children enter one after another
 * (70ms apart by default, or pass a number of milliseconds).
 * `from`: direction for the default mode ("up" | "left" | "right" | "scale").
 */
export function Reveal({
  as = "div",
  delay = 0,
  from,
  stagger,
  className,
  children,
  ...rest
}: {
  as?: Tag;
  delay?: number;
  from?: From;
  stagger?: boolean | number;
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

  const style = {
    "--reveal-delay": `${delay}ms`,
    ...(typeof stagger === "number" ? { "--stagger": `${stagger}ms` } : null),
    ...rest.style,
  } as CSSProperties;

  // Typed as "div" so the dynamic tag accepts the ref; every allowed tag shares the same props here.
  const Tag = as as "div";
  return (
    <Tag
      ref={ref as React.RefObject<HTMLDivElement>}
      id={rest.id}
      className={cn(stagger ? "reveal-stagger" : "reveal", className)}
      data-reveal={from && from !== "up" ? from : undefined}
      style={style}
    >
      {children}
    </Tag>
  );
}
