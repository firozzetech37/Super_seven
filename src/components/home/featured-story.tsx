import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Camera } from "lucide-react";
import { Reveal } from "@/components/motion/reveal";

const mosaic = [
  { src: "/legacy/slide1.jpg", alt: "Under-23 squad lined up at the 17th Youth National Super Seven Championship, Mussoorie" },
  { src: "/legacy/slide2.jpg", alt: "Banner of the 17th Youth National Super Seven Cricket Championship (Under-23)" },
  { src: "/legacy/slide3.jpg", alt: "Teams and officials gathered on the ground at the Youth National Championship" },
  { src: "/legacy/slide4.jpg", alt: "Officials seated at the Youth National Championship" },
];

/** One big featured story under the ground (replaces the old photo slideshow). */
export function FeaturedStory() {
  return (
    <section className="bg-white pb-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <Reveal className="grid overflow-hidden rounded-3xl bg-navy text-white shadow-[0_30px_60px_rgba(15,46,99,0.25)] md:grid-cols-[1.1fr_1fr]">
          <div className="relative p-3 md:p-4">
            <div className="grid h-full grid-cols-2 gap-2 md:gap-3">
              {mosaic.map((m, i) => (
                <div key={m.src} className={i === 0 ? "relative col-span-2 aspect-[2.2/1] overflow-hidden rounded-2xl" : "relative aspect-[1.4/1] overflow-hidden rounded-2xl"}>
                  <Image
                    src={m.src}
                    alt={m.alt}
                    fill
                    sizes="(min-width: 768px) 40vw, 90vw"
                    className="object-cover transition-transform duration-700 hover:scale-105"
                  />
                </div>
              ))}
            </div>
            <span className="absolute left-6 top-6 rounded-full bg-gold px-3 py-1 text-[11px] font-bold uppercase tracking-[0.2em] text-navy shadow">
              Featured story
            </span>
            <span className="absolute bottom-6 right-6 flex items-center gap-1.5 rounded-full bg-navy-deep/80 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-white/80 backdrop-blur">
              <Camera className="size-3.5" aria-hidden="true" />
              17th Youth National, Mussoorie
            </span>
          </div>
          <div className="flex flex-col justify-center p-8 lg:p-12">
            <p className="flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.24em] text-gold">
              <span aria-hidden="true" className="h-px w-8 bg-gold" />
              Youth National Championship
            </p>
            <h2 className="mt-4 font-heading text-3xl font-bold leading-tight lg:text-[2.6rem]">
              17th Youth National Championship
            </h2>
            <p className="mt-4 text-[17px] leading-relaxed text-white/80">
              The under-23 boys&apos; championship in Mussoorie is the latest national event. The full story, results and
              photos follow once SSCFI confirms the details; pictures from earlier tournaments, including the 2014
              National Cricket League Super 7 in Amroha, live in the photo gallery.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/news"
                className="group inline-flex items-center gap-2 rounded-full bg-gold px-6 py-3 font-bold text-navy shadow-[0_10px_24px_rgba(4,15,42,0.35)] transition hover:bg-gold-deep"
              >
                Read the story
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
              </Link>
              <Link
                href="/gallery"
                className="inline-flex items-center gap-2 rounded-full px-6 py-3 font-bold text-white ring-2 ring-white/60 transition hover:bg-white/10 hover:ring-white"
              >
                Photo gallery
              </Link>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
