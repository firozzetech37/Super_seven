"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Scrolls its content sideways only when it overflows; pauses on hover. Content is duplicated for a seamless loop. */
export function Marquee({ children, className, speed = 40 }: { children: ReactNode; className?: string; speed?: number }) {
  const container = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const [overflow, setOverflow] = useState<number | null>(null);

  useEffect(() => {
    const c = container.current;
    const t = track.current;
    if (!c || !t) return;
    const measure = () => {
      const first = t.firstElementChild as HTMLElement | null;
      const width = first?.scrollWidth ?? 0;
      setOverflow(width > c.clientWidth + 1 ? width : null);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(c);
    return () => ro.disconnect();
  }, []);

  return (
    <div ref={container} className={cn("min-w-0 flex-1 overflow-hidden", className, overflow && "[mask-image:linear-gradient(to_right,transparent,black_12px,black_calc(100%-28px),transparent)]")}>
      <div
        ref={track}
        style={overflow ? ({ "--marquee-duration": `${Math.max(12, overflow / speed)}s` } as React.CSSProperties) : undefined}
        className={cn("flex w-max items-center", overflow && "motion-safe:animate-marquee hover:[animation-play-state:paused]")}
      >
        <div className="flex shrink-0 items-center gap-5 pl-3 pr-7">{children}</div>
        {overflow ? (
          <div aria-hidden="true" className="flex shrink-0 items-center gap-5 pl-3 pr-7">
            {children}
          </div>
        ) : null}
      </div>
    </div>
  );
}
