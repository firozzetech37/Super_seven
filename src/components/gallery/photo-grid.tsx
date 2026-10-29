"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, X, ZoomIn } from "lucide-react";
import type { Photo } from "@/lib/data/gallery";

/** Masonry grid of photos with a native <dialog> lightbox (arrow keys, Escape, backdrop click). */
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

  return (
    <>
      <ul className="columns-2 gap-3 sm:columns-3 lg:columns-4 [&>li]:mb-3 [&>li]:break-inside-avoid">
        {photos.map((p, i) => (
          <li key={p.src}>
            <button
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`Open photo: ${p.alt}`}
              className="group duotone relative block w-full overflow-hidden rounded-2xl bg-navy ring-1 ring-line outline-none focus-visible:ring-4 focus-visible:ring-gold"
            >
              <Image src={p.src} alt={p.alt} width={p.width} height={p.height} sizes="(min-width: 1024px) 300px, 45vw" className="h-auto w-full object-cover transition-transform duration-500 group-hover:scale-105" />
              <span className="pointer-events-none absolute inset-0 flex items-end bg-gradient-to-t from-navy-deep/80 via-transparent to-transparent p-3 text-left text-xs leading-snug text-white opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
                <ZoomIn className="mr-1.5 size-3.5 shrink-0 text-gold" aria-hidden="true" />
                {p.alt}
              </span>
            </button>
          </li>
        ))}
      </ul>

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
        className="m-auto w-[min(96vw,1000px)] overflow-visible rounded-3xl bg-transparent p-0 text-white backdrop:bg-navy-deep/90 backdrop:backdrop-blur-sm open:animate-in open:fade-in-0 open:zoom-in-95"
      >
        {current ? (
          <div className="relative">
            <Image
              src={current.src}
              alt={current.alt}
              width={current.width}
              height={current.height}
              sizes="96vw"
              className="h-auto max-h-[80vh] w-full rounded-2xl object-contain"
            />
            <p className="mt-3 flex items-center justify-between gap-4 px-1 text-sm text-white/85">
              <span>{current.alt}</span>
              <span className="shrink-0 tabular-nums text-white/60">
                {(index ?? 0) + 1} / {photos.length}
              </span>
            </p>
            <button
              type="button"
              onClick={() => setIndex(null)}
              aria-label="Close"
              className="absolute top-3 right-3 grid size-10 place-items-center rounded-full bg-white text-navy shadow-lg transition hover:bg-gold"
            >
              <X className="size-5" />
            </button>
            {photos.length > 1 ? (
              <>
                <button
                  type="button"
                  onClick={() => step(-1)}
                  aria-label="Previous photo"
                  className="absolute left-2 top-1/2 grid size-11 -translate-y-1/2 place-items-center rounded-full bg-navy-deep/70 text-white ring-1 ring-white/30 backdrop-blur transition hover:bg-gold hover:text-navy"
                >
                  <ChevronLeft className="size-6" />
                </button>
                <button
                  type="button"
                  onClick={() => step(1)}
                  aria-label="Next photo"
                  className="absolute right-2 top-1/2 grid size-11 -translate-y-1/2 place-items-center rounded-full bg-navy-deep/70 text-white ring-1 ring-white/30 backdrop-blur transition hover:bg-gold hover:text-navy"
                >
                  <ChevronRight className="size-6" />
                </button>
              </>
            ) : null}
          </div>
        ) : null}
      </dialog>
    </>
  );
}
