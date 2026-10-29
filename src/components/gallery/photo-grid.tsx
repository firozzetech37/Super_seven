"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Expand, Images, X } from "lucide-react";
import { Reveal } from "@/components/motion/reveal";
import { GroundWatermark } from "@/components/layout/ground-watermark";
import { cn } from "@/lib/utils";
import type { Photo } from "@/lib/data/gallery";

/**
 * Leftover cells after the 2x2 lead photo, per breakpoint (2 / 3 / 4 columns), are filled by one
 * "open the viewer" tile so every album closes as a clean rectangle. Literal classes so Tailwind sees them.
 */
const fillerSpan = {
  base: ["hidden", "col-span-1"],
  sm: ["sm:hidden", "sm:block sm:col-span-1", "sm:block sm:col-span-2"],
  lg: ["lg:hidden", "lg:block lg:col-span-1", "lg:block lg:col-span-2", "lg:block lg:col-span-3"],
} as const;

/** Empty cells left in the last row; the lead photo covers 2 cells on phones (full width) and 4 from sm up (2x2). */
function leftover(n: number, cols: number) {
  const cells = n + (cols === 2 ? 1 : 3);
  return (cols - (cells % cols)) % cols;
}

/** Bento grid of an album (lead photo large) with a native <dialog> lightbox: arrow keys, Escape, backdrop click, thumbnails. */
export function PhotoGrid({ photos, albumTitle }: { photos: Photo[]; albumTitle: string }) {
  const [index, setIndex] = useState<number | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const d = dialogRef.current;
    if (!d) return;
    if (index !== null && !d.open) d.showModal();
    if (index === null && d.open) d.close();
  }, [index]);

  const step = (delta: number) => setIndex((i) => (i === null ? i : (i + delta + photos.length) % photos.length));
  const current = index === null ? null : photos[index];
  const filler = cn(fillerSpan.base[leftover(photos.length, 2)], fillerSpan.sm[leftover(photos.length, 3)], fillerSpan.lg[leftover(photos.length, 4)]);

  return (
    <>
      <Reveal stagger={60} as="ul" className="grid grid-flow-dense grid-cols-2 gap-2.5 sm:grid-cols-3 sm:gap-3 lg:grid-cols-4">
        {photos.map((p, i) => {
          const lead = i === 0;
          return (
            <li key={p.src} className={cn(lead ? "col-span-2 aspect-[16/10] sm:row-span-2 sm:aspect-auto" : "aspect-[16/10]")}>
              <button
                type="button"
                onClick={() => setIndex(i)}
                aria-label={`Open photo ${i + 1} of ${photos.length}: ${p.alt}`}
                className="group duotone relative block size-full overflow-hidden rounded-2xl bg-navy shadow-[0_10px_24px_rgba(15,46,99,0.10)] ring-1 ring-line outline-none transition duration-500 hover:shadow-[0_24px_50px_rgba(15,46,99,0.22)] focus-visible:ring-4 focus-visible:ring-gold"
              >
                <Image
                  src={p.src}
                  alt={p.alt}
                  fill
                  sizes={lead ? "(min-width: 1024px) 620px, (min-width: 640px) 62vw, 92vw" : "(min-width: 1024px) 310px, (min-width: 640px) 31vw, 46vw"}
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
                />
                <span aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_top,rgba(5,16,45,0.85),rgba(5,16,45,0.1)_50%,transparent)] opacity-0 transition-opacity duration-500 group-hover:opacity-100 group-focus-visible:opacity-100" />
                <span aria-hidden="true" className="absolute inset-x-0 top-0 h-[3px] origin-left scale-x-0 bg-gold transition-transform duration-500 group-hover:scale-x-100 group-focus-visible:scale-x-100" />
                <span aria-hidden="true" className="absolute left-3 top-3 rounded-full bg-navy-deep/60 px-2 py-0.5 font-mono text-[10px] font-bold text-white/85 ring-1 ring-white/15 backdrop-blur">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span aria-hidden="true" className="absolute right-3 top-3 grid size-9 scale-75 place-items-center rounded-full bg-gold text-navy opacity-0 shadow-[0_8px_18px_rgba(4,15,42,0.4)] transition duration-300 group-hover:scale-100 group-hover:opacity-100 group-focus-visible:scale-100 group-focus-visible:opacity-100">
                  <Expand className="size-4" />
                </span>
                <span
                  aria-hidden="true"
                  className={cn(
                    "pointer-events-none absolute inset-x-0 bottom-0 translate-y-2 p-3 text-left leading-snug text-white opacity-0 transition duration-500 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100",
                    lead ? "text-sm sm:p-5 sm:text-base" : "text-xs",
                  )}
                >
                  <span className="line-clamp-2">{p.alt}</span>
                </span>
              </button>
            </li>
          );
        })}
        <li className={filler}>
          <button
            type="button"
            onClick={() => setIndex(0)}
            className="group @container relative isolate flex size-full min-h-28 flex-col justify-between overflow-hidden rounded-2xl bg-stadium p-4 text-left text-white ring-1 ring-navy/10 outline-none transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_50px_rgba(15,46,99,0.25)] focus-visible:ring-4 focus-visible:ring-gold"
          >
            <GroundWatermark className="pointer-events-none absolute -right-16 -top-10 -z-10 w-72 text-white/[0.07] transition-transform duration-700 group-hover:scale-110" />
            <span className="flex items-start justify-between gap-3">
              <span className="grid size-10 place-items-center rounded-xl bg-white/10 text-gold ring-1 ring-white/20 transition duration-300 group-hover:-rotate-6 group-hover:bg-gold group-hover:text-navy">
                <Images className="size-5" aria-hidden="true" />
              </span>
              <span aria-hidden="true" className="hidden @[20rem]:flex">
                {photos.slice(0, 5).map((p) => (
                  <span key={p.src} className="relative -ml-3 size-11 overflow-hidden rounded-full ring-2 ring-navy transition-[margin] duration-500 first:ml-0 group-hover:-ml-1 group-hover:first:ml-0">
                    <Image src={p.src} alt="" fill sizes="44px" className="object-cover" />
                  </span>
                ))}
              </span>
            </span>
            <span className="flex items-end justify-between gap-3">
              <span>
                <span className="block font-heading text-lg font-bold leading-tight @[20rem]:text-2xl">Open the viewer</span>
                <span className="mt-0.5 block text-xs text-white/65 @[20rem]:text-sm">
                  All {photos.length} photos · arrow keys to move
                </span>
              </span>
              <span aria-hidden="true" className="hidden size-10 shrink-0 place-items-center rounded-full bg-gold text-navy transition-transform duration-300 group-hover:translate-x-1 @[20rem]:grid">
                <ChevronRight className="size-5" />
              </span>
            </span>
          </button>
        </li>
      </Reveal>

      <dialog
        ref={dialogRef}
        onClose={() => setIndex(null)}
        onClick={(e) => {
          if (e.target === e.currentTarget) setIndex(null);
        }}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") step(1);
          if (e.key === "ArrowLeft") step(-1);
        }}
        aria-label={`${albumTitle} photo viewer`}
        className="m-auto w-[min(94vw,980px)] max-w-none overflow-visible bg-transparent p-0 text-white backdrop:bg-navy-deep/90 backdrop:backdrop-blur-md open:animate-in open:fade-in-0 open:zoom-in-95"
      >
        {current && index !== null ? (
          <div className="relative overflow-hidden rounded-3xl bg-navy-deep/80 p-2 shadow-[0_40px_90px_rgba(0,0,0,0.5)] ring-1 ring-white/10 sm:p-3">
            <div className="flex items-center justify-between gap-3 px-2 pb-2 pt-1 sm:px-3">
              <p className="min-w-0 truncate text-[11px] font-bold uppercase tracking-[0.2em] text-gold">{albumTitle}</p>
              <div className="flex shrink-0 items-center gap-2">
                <span className="rounded-full bg-white/10 px-2.5 py-1 font-mono text-[11px] font-bold text-white/85 ring-1 ring-white/15">
                  {String(index + 1).padStart(2, "0")} / {String(photos.length).padStart(2, "0")}
                </span>
                <button
                  type="button"
                  onClick={() => setIndex(null)}
                  aria-label="Close"
                  className="grid size-9 place-items-center rounded-full bg-white text-navy shadow-lg transition hover:rotate-90 hover:bg-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
                >
                  <X className="size-5" aria-hidden="true" />
                </button>
              </div>
            </div>

            <div className="relative overflow-hidden rounded-2xl bg-black/30">
              <Image
                key={current.src}
                src={current.src}
                alt={current.alt}
                width={current.width}
                height={current.height}
                sizes="(min-width: 1024px) 960px, 94vw"
                className="mx-auto h-auto max-h-[64vh] w-full object-contain motion-safe:animate-in motion-safe:fade-in-0 motion-safe:zoom-in-95 motion-safe:duration-500"
              />
              {photos.length > 1 ? (
                <>
                  <button
                    type="button"
                    onClick={() => step(-1)}
                    aria-label="Previous photo"
                    className="absolute left-2 top-1/2 grid size-11 -translate-y-1/2 place-items-center rounded-full bg-navy-deep/70 text-white ring-1 ring-white/30 backdrop-blur transition hover:bg-gold hover:text-navy focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
                  >
                    <ChevronLeft className="size-6" aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    onClick={() => step(1)}
                    aria-label="Next photo"
                    className="absolute right-2 top-1/2 grid size-11 -translate-y-1/2 place-items-center rounded-full bg-navy-deep/70 text-white ring-1 ring-white/30 backdrop-blur transition hover:bg-gold hover:text-navy focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
                  >
                    <ChevronRight className="size-6" aria-hidden="true" />
                  </button>
                </>
              ) : null}
            </div>

            <p key={index} aria-live="polite" className="px-2 pt-3 text-sm leading-snug text-white/85 sm:px-3 motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-1 motion-safe:duration-500">
              {current.alt}
            </p>

            {photos.length > 1 ? (
              <ul className="mt-3 flex gap-2 overflow-x-auto px-2 pb-2 sm:px-3">
                {photos.map((p, i) => (
                  <li key={p.src} className="shrink-0">
                    <button
                      type="button"
                      onClick={() => setIndex(i)}
                      aria-label={`Show photo ${i + 1}`}
                      aria-current={i === index}
                      className={cn(
                        "relative block h-12 w-[72px] overflow-hidden rounded-lg ring-2 transition duration-300 focus-visible:outline-none focus-visible:ring-gold sm:h-14 sm:w-[88px]",
                        i === index ? "ring-gold" : "opacity-50 ring-transparent hover:opacity-100",
                      )}
                    >
                      <Image src={p.src} alt="" fill sizes="88px" className="object-cover" />
                    </button>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        ) : null}
      </dialog>
    </>
  );
}
