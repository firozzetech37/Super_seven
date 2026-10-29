"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export type StoryPhoto = { src: string; alt: string };

const interval = 5500;

/**
 * Cinematic photo stage: photos crossfade with a slow zoom, a gold bar shows time to the next one,
 * arrows and thumbnails jump directly. Auto-advance pauses on hover, on keyboard focus, while the
 * stage is off screen, and never runs for people who prefer reduced motion.
 */
export function StoryStage({ photos, badge }: { photos: StoryPhoto[]; badge?: string }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [visible, setVisible] = useState(false);
  const [reduced, setReduced] = useState(true);
  const ref = useRef<HTMLDivElement>(null);
  const count = photos.length;
  const go = (n: number) => setIndex((n + count) % count);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    const el = ref.current;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0.35 });
    if (el) io.observe(el);
    return () => {
      mq.removeEventListener("change", sync);
      io.disconnect();
    };
  }, []);

  const playing = !paused && visible && !reduced && count > 1;

  useEffect(() => {
    if (!playing) return;
    const t = window.setTimeout(() => setIndex((i) => (i + 1) % count), interval);
    return () => window.clearTimeout(t);
  }, [playing, index, count]);

  const current = photos[index];

  return (
    <div
      ref={ref}
      className="flex flex-col gap-3"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div
        role="region"
        aria-roledescription="carousel"
        aria-label="Photos from the championship"
        className="group/stage relative aspect-[16/10] overflow-hidden rounded-2xl bg-navy-deep ring-1 ring-white/10"
      >
        {photos.map((p, i) => (
          <Image
            key={p.src}
            src={p.src}
            alt={i === index ? p.alt : ""}
            aria-hidden={i !== index}
            fill
            priority={i === 0}
            sizes="(min-width: 1024px) 640px, 92vw"
            className={cn(
              "object-cover transition-opacity duration-1000 ease-out",
              i === index ? "opacity-100 motion-safe:animate-[kenburns_7s_ease-out_forwards]" : "opacity-0",
            )}
          />
        ))}
        <span aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_top,rgba(5,16,45,0.88),rgba(5,16,45,0.15)_45%,transparent_70%)]" />

        {badge ? (
          <span className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full bg-gold px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-navy shadow-[0_6px_16px_rgba(4,15,42,0.4)]">
            <span aria-hidden="true" className="relative flex size-1.5">
              <span className="absolute inset-0 rounded-full bg-navy motion-safe:animate-ping" />
              <span className="relative size-1.5 rounded-full bg-navy" />
            </span>
            {badge}
          </span>
        ) : null}
        <span className="absolute right-4 top-4 rounded-full bg-navy-deep/70 px-2.5 py-1 font-mono text-[11px] font-bold text-white/85 ring-1 ring-white/15 backdrop-blur">
          {String(index + 1).padStart(2, "0")} / {String(count).padStart(2, "0")}
        </span>

        <div className="absolute inset-x-0 bottom-0 flex items-end justify-end gap-4 p-3 sm:justify-between sm:p-5">
          <p key={index} aria-live="polite" className="hidden max-w-md text-sm font-medium leading-snug text-white sm:block motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-2 motion-safe:duration-700">
            {current.alt}
          </p>
          <div className="flex shrink-0 gap-2">
            {[
              { label: "Previous photo", icon: ChevronLeft, to: index - 1 },
              { label: "Next photo", icon: ChevronRight, to: index + 1 },
            ].map(({ label, icon: Icon, to }) => (
              <button
                key={label}
                type="button"
                aria-label={label}
                onClick={() => go(to)}
                className="grid size-10 place-items-center rounded-full bg-white/10 text-white ring-1 ring-white/25 backdrop-blur transition hover:bg-gold hover:text-navy hover:ring-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
              >
                <Icon className="size-5" aria-hidden="true" />
              </button>
            ))}
          </div>
        </div>

        <span aria-hidden="true" className="absolute inset-x-0 bottom-0 h-1 bg-white/10">
          <span
            key={`${index}-${playing}`}
            className={cn("block h-full origin-left bg-gold", playing ? "animate-[story-progress_linear_forwards]" : "scale-x-0")}
            style={playing ? { animationDuration: `${interval}ms` } : undefined}
          />
        </span>
      </div>

      <ul className="grid grid-cols-6 gap-2">
        {photos.map((p, i) => (
          <li key={p.src}>
            <button
              type="button"
              aria-label={`Show photo ${i + 1}: ${p.alt}`}
              aria-current={i === index}
              onClick={() => go(i)}
              className={cn(
                "relative block aspect-[4/3] w-full overflow-hidden rounded-lg ring-2 transition duration-300 focus-visible:outline-none focus-visible:ring-gold",
                i === index ? "ring-gold" : "opacity-55 ring-transparent hover:-translate-y-0.5 hover:opacity-100",
              )}
            >
              <Image src={p.src} alt="" fill sizes="110px" className="object-cover" />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
