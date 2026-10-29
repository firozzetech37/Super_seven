import Image from "next/image";
import { ArrowDown } from "lucide-react";
import { Reveal } from "@/components/motion/reveal";
import type { Album } from "@/lib/data/gallery";

/** Album covers above the photo grids: a fanned stack of three photos that spreads on hover, linking down to the album. */
export function AlbumIndex({ albums }: { albums: Album[] }) {
  return (
    <Reveal stagger={90} as="ul" className="grid gap-4 md:grid-cols-2">
      {albums.map((album, i) => (
        <li key={album.id}>
          <a
            href={`#${album.id}`}
            className="group card-premium relative isolate flex h-full items-center gap-5 overflow-hidden rounded-3xl bg-white p-4 shadow-[0_12px_30px_rgba(15,46,99,0.07)] ring-1 ring-line transition duration-300 hover:-translate-y-1.5 hover:shadow-[0_28px_60px_rgba(15,46,99,0.14)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-gold sm:gap-6 sm:p-5"
          >
            <span aria-hidden="true" className="pointer-events-none absolute -right-3 -top-8 -z-10 font-heading text-[7rem] font-bold leading-none text-navy/[0.04] transition-colors duration-500 group-hover:text-gold/15">
              {String(i + 1).padStart(2, "0")}
            </span>
            <span aria-hidden="true" className="relative h-24 w-32 shrink-0 sm:h-28 sm:w-40">
              {album.photos.slice(0, 3).map((p, j) => (
                <span
                  key={p.src}
                  className={[
                    "absolute inset-0 overflow-hidden rounded-xl bg-navy shadow-[0_8px_18px_rgba(15,46,99,0.25)] ring-2 ring-white transition duration-500 ease-out",
                    j === 0 && "z-30 group-hover:-translate-y-1",
                    j === 1 && "z-20 rotate-[-6deg] -translate-x-2 group-hover:-translate-x-5 group-hover:rotate-[-10deg]",
                    j === 2 && "z-10 rotate-[6deg] translate-x-2 group-hover:translate-x-5 group-hover:rotate-[10deg]",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                >
                  <Image src={p.src} alt="" fill sizes="160px" className="object-cover" />
                </span>
              ))}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-[11px] font-bold uppercase tracking-[0.2em] text-royal">
                Album {String(i + 1).padStart(2, "0")} · {album.photos.length} photos
              </span>
              <span className="mt-1.5 block font-heading text-lg font-bold leading-snug text-navy transition-colors group-hover:text-royal sm:text-xl">
                {album.title}
              </span>
              <span className="mt-2 inline-flex items-center gap-2 text-sm font-bold text-royal">
                View album
                <span className="grid size-7 place-items-center rounded-full bg-surface ring-1 ring-line transition duration-300 group-hover:bg-royal group-hover:text-white group-hover:ring-royal">
                  <ArrowDown className="size-3.5 transition-transform duration-300 group-hover:translate-y-0.5" aria-hidden="true" />
                </span>
              </span>
            </span>
          </a>
        </li>
      ))}
    </Reveal>
  );
}
