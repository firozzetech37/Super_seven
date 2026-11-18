"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, ExternalLink, X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Photo } from "@/lib/data/gallery";

/**
 * Native <dialog> lightbox shared by the photo albums and the press clippings: arrow keys, Escape, backdrop click
 * and a thumbnail strip. `tall` gives portrait scans more height; `fullSize` adds a link to the original file so
 * newspaper text can be read at full resolution (and pinch-zoomed on phones).
 */
export function PhotoViewer({
  photos,
  index,
  onIndexChange,
  title,
  tall = false,
  fullSize = false,
}: {
  photos: Photo[];
  index: number | null;
  onIndexChange: (index: number | null) => void;
  title: string;
  tall?: boolean;
  fullSize?: boolean;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const d = dialogRef.current;
    if (!d) return;
    if (index !== null && !d.open) d.showModal();
    if (index === null && d.open) d.close();
  }, [index]);

  const step = (delta: number) => {
    if (index === null) return;
    onIndexChange((index + delta + photos.length) % photos.length);
  };
  const current = index === null ? null : photos[index];

  return (
    <dialog
      ref={dialogRef}
      onClose={() => onIndexChange(null)}
      onClick={(e) => {
        if (e.target === e.currentTarget) onIndexChange(null);
      }}
      onKeyDown={(e) => {
        if (e.key === "ArrowRight") step(1);
        if (e.key === "ArrowLeft") step(-1);
      }}
      aria-label={`${title} viewer`}
      className="m-auto w-[min(94vw,980px)] max-w-none overflow-visible bg-transparent p-0 text-white backdrop:bg-navy-deep/90 backdrop:backdrop-blur-md open:animate-in open:fade-in-0 open:zoom-in-95"
    >
      {current && index !== null ? (
        <div className="relative overflow-hidden rounded-3xl bg-navy-deep/80 p-2 shadow-[0_40px_90px_rgba(0,0,0,0.5)] ring-1 ring-white/10 sm:p-3">
          <div className="flex items-center justify-between gap-3 px-2 pb-2 pt-1 sm:px-3">
            <p className="min-w-0 truncate text-[11px] font-bold uppercase tracking-[0.2em] text-gold">{title}</p>
            <div className="flex shrink-0 items-center gap-2">
              {fullSize ? (
                <a
                  href={current.src}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-[11px] font-bold text-white ring-1 ring-white/20 transition hover:bg-gold hover:text-navy focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
                >
                  <span className="hidden sm:inline">Full size</span>
                  <ExternalLink className="size-3.5" aria-hidden="true" />
                  <span className="sr-only sm:hidden">Open full size</span>
                  <span className="sr-only">(opens in a new tab)</span>
                </a>
              ) : null}
              <span className="rounded-full bg-white/10 px-2.5 py-1 font-mono text-[11px] font-bold text-white/85 ring-1 ring-white/15">
                {String(index + 1).padStart(2, "0")} / {String(photos.length).padStart(2, "0")}
              </span>
              <button
                type="button"
                onClick={() => onIndexChange(null)}
                aria-label="Close"
                className="grid size-9 place-items-center rounded-full bg-white text-navy shadow-lg transition hover:rotate-90 hover:bg-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
              >
                <X className="size-5" aria-hidden="true" />
              </button>
            </div>
          </div>

          <div className={cn("relative overflow-hidden rounded-2xl", tall ? "bg-[#f4f1ea]" : "bg-black/30")}>
            <Image
              key={current.src}
              src={current.src}
              alt={current.alt}
              width={current.width}
              height={current.height}
              sizes="(min-width: 1024px) 960px, 94vw"
              className={cn(
                "mx-auto h-auto w-full object-contain motion-safe:animate-in motion-safe:fade-in-0 motion-safe:zoom-in-95 motion-safe:duration-500",
                tall ? "max-h-[70vh]" : "max-h-[64vh]",
              )}
            />
            {photos.length > 1 ? (
              <>
                <button
                  type="button"
                  onClick={() => step(-1)}
                  aria-label="Previous"
                  className="absolute left-2 top-1/2 grid size-11 -translate-y-1/2 place-items-center rounded-full bg-navy-deep/70 text-white ring-1 ring-white/30 backdrop-blur transition hover:bg-gold hover:text-navy focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
                >
                  <ChevronLeft className="size-6" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={() => step(1)}
                  aria-label="Next"
                  className="absolute right-2 top-1/2 grid size-11 -translate-y-1/2 place-items-center rounded-full bg-navy-deep/70 text-white ring-1 ring-white/30 backdrop-blur transition hover:bg-gold hover:text-navy focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
                >
                  <ChevronRight className="size-6" aria-hidden="true" />
                </button>
              </>
            ) : null}
          </div>

          <p key={index} aria-live="polite" className="px-2 pt-3 text-sm leading-snug text-white/85 sm:px-3 motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-1 motion-safe:duration-500">
            {current.caption ?? current.alt}
          </p>

          {photos.length > 1 ? (
            <ul className="mt-3 flex gap-2 overflow-x-auto px-2 pb-2 sm:px-3">
              {photos.map((p, i) => (
                <li key={p.src} className="shrink-0">
                  <button
                    type="button"
                    onClick={() => onIndexChange(i)}
                    aria-label={`Show ${i + 1} of ${photos.length}`}
                    aria-current={i === index}
                    className={cn(
                      "relative block overflow-hidden rounded-lg ring-2 transition duration-300 focus-visible:outline-none focus-visible:ring-gold",
                      tall ? "h-16 w-12 sm:h-[72px] sm:w-14" : "h-12 w-[72px] sm:h-14 sm:w-[88px]",
                      i === index ? "ring-gold" : "opacity-50 ring-transparent hover:opacity-100",
                    )}
                  >
                    <Image src={p.src} alt="" fill sizes="88px" className={cn("object-cover", tall && "object-top")} />
                  </button>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      ) : null}
    </dialog>
  );
}
