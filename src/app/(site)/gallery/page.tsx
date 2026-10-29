import type { Metadata } from "next";
import { ArrowRight, BellRing, ExternalLink, Play } from "lucide-react";
import { JumpLinks } from "@/components/fixtures/jump-links";
import { AlbumIndex } from "@/components/gallery/album-index";
import { PhotoGrid } from "@/components/gallery/photo-grid";
import { PressFilter } from "@/components/gallery/press-filter";
import { VideoEmbed } from "@/components/gallery/video-embed";
import { GroundWatermark } from "@/components/layout/ground-watermark";
import { PageHeader } from "@/components/layout/page-header";
import { SectionHeading } from "@/components/layout/section-heading";
import { Reveal } from "@/components/motion/reveal";
import { albums, featuredVideo, pressYears } from "@/lib/data/gallery";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Photo Gallery",
  description: "Pictures and media: matches, events, corporate days, press clippings and videos.",
};

const jump = [
  { label: "Photos", href: "#photos" },
  { label: "Press clippings", href: "#press" },
  { label: "Videos", href: "#videos" },
];

export default function GalleryPage() {
  const youtube = site.social.find((s) => s.id === "youtube");
  const photoCount = albums.reduce((n, a) => n + a.photos.length, 0);

  return (
    <>
      <PageHeader
        eyebrow="Bat → Photo Gallery"
        title="Media & Pictures"
        description="Matches, events, corporate days, press clippings and videos, from 2003 to today."
        crumbs={[{ label: "Photo Gallery" }]}
        aside={<JumpLinks links={jump} />}
      />

      <section id="photos" className="relative isolate scroll-mt-28 overflow-hidden bg-white py-14 lg:py-20">
        <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[520px] bg-[radial-gradient(60%_70%_at_85%_0%,rgba(28,79,160,0.07),transparent_70%)]" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <SectionHeading
            eyebrow="Photos"
            title={
              <>
                Albums, <span className="text-royal">{photoCount} photographs</span>
              </>
            }
            description="Carried over from the old site and grouped by event. Click any photo to open it; use the arrow keys to move through an album."
          />
          <div className="mt-10">
            <AlbumIndex albums={albums} />
          </div>

          <div className="mt-16 space-y-16 lg:mt-20 lg:space-y-20">
            {albums.map((album, i) => (
              <article key={album.id} id={album.id} aria-labelledby={`${album.id}-title`} className="scroll-mt-28">
                <Reveal className="relative flex flex-col gap-4 border-t border-line pt-8 sm:flex-row sm:items-end sm:justify-between">
                  <span aria-hidden="true" className="absolute left-0 top-0 h-[3px] w-16 -translate-y-1/2 rounded-full bg-gold" />
                  <div className="flex items-start gap-4 sm:gap-6">
                    <span aria-hidden="true" className="font-heading text-5xl font-bold leading-none text-navy/10 sm:text-7xl">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div className="min-w-0">
                      <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-royal">{album.year}</p>
                      <h3 id={`${album.id}-title`} className="mt-1.5 font-heading text-2xl font-bold leading-tight text-navy sm:text-3xl">
                        {album.title}
                      </h3>
                      <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-slate-500">{album.description}</p>
                    </div>
                  </div>
                  <span className="w-fit shrink-0 rounded-full bg-surface px-3.5 py-1.5 text-xs font-bold text-navy ring-1 ring-line">
                    <span className="tabular-nums text-royal">{album.photos.length}</span> photos
                  </span>
                </Reveal>
                <div className="mt-6">
                  <PhotoGrid photos={album.photos} albumTitle={album.title} />
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="press" className="relative isolate scroll-mt-28 overflow-hidden bg-stadium py-16 text-white lg:py-24">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:22px_22px] [mask-image:radial-gradient(60%_70%_at_20%_40%,#000,transparent)]" />
          <GroundWatermark className="parallax-slow absolute -right-48 -top-24 w-[860px] text-white/[0.05]" />
          <div className="absolute -bottom-40 left-1/4 size-[460px] rounded-full bg-gold/10 blur-[120px]" />
          <div className="absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(217,174,86,0.8)_20%,rgba(217,174,86,0.8)_80%,transparent)]" />
        </div>
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <SectionHeading
            tone="dark"
            eyebrow="Press clippings"
            title={
              <>
                In the papers <span className="text-gold">since 2003</span>
              </>
            }
            description="Newspaper coverage of Super Seven cricket, by year. Pick a year to see its count."
          />
          <div className="mt-10">
            <PressFilter years={pressYears} />
          </div>
        </div>
      </section>

      <section id="videos" className="scroll-mt-28 bg-white py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <SectionHeading
            eyebrow="Videos"
            title="Watch Super Seven"
            description="Match videos live on the federation's YouTube channel. A featured video is embedded here once SSCFI picks one."
          />
          <div className="mt-10 grid grid-cols-[minmax(0,1fr)] gap-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] lg:items-stretch">
            <Reveal from="scale">
              {featuredVideo ? (
                <VideoEmbed id={featuredVideo.id} title={featuredVideo.title} />
              ) : (
                <div className="card-premium group relative isolate flex min-h-72 items-center justify-center overflow-hidden rounded-[1.75rem] bg-stadium p-8 text-center text-white shadow-[0_30px_70px_rgba(15,46,99,0.28)] sm:aspect-video">
                  <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
                    <GroundWatermark className="absolute left-1/2 top-1/2 w-[130%] -translate-x-1/2 -translate-y-1/2 text-white/[0.06] transition-transform duration-1000 group-hover:scale-105" />
                    <div className="absolute inset-0 overflow-hidden">
                      <div className="absolute inset-y-0 left-0 w-1/3 skew-x-[-18deg] bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.06),transparent)] motion-safe:animate-sweep" />
                    </div>
                    <div className="absolute inset-x-0 bottom-0 h-1/2 bg-[linear-gradient(to_top,rgba(5,16,45,0.6),transparent)]" />
                    <span className="absolute left-5 top-5 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-white/80 ring-1 ring-white/15">
                      <span className="size-1.5 rounded-full bg-gold" />
                      Featured video
                    </span>
                  </div>
                  <div>
                    <span className="relative mx-auto grid size-20 place-items-center">
                      <span aria-hidden="true" className="absolute inset-0 rounded-full bg-gold/30 motion-safe:animate-ping [animation-duration:2.4s]" />
                      <span className="relative grid size-20 place-items-center rounded-full bg-gold text-navy shadow-[0_14px_34px_rgba(4,15,42,0.5)] transition duration-300 group-hover:scale-105">
                        <Play className="ml-1 size-8 fill-current" aria-hidden="true" />
                      </span>
                    </span>
                    <p className="mt-6 font-heading text-2xl font-bold sm:text-3xl">Featured video coming soon</p>
                    <p className="mt-2 text-white/70">Until then, every video is on the channel.</p>
                  </div>
                </div>
              )}
            </Reveal>
            <Reveal from="right" delay={120}>
              <a
                href={youtube?.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group card-premium relative isolate flex h-full flex-col overflow-hidden rounded-[1.75rem] bg-surface p-7 ring-1 ring-line transition duration-300 hover:-translate-y-1.5 hover:bg-white hover:shadow-[0_28px_60px_rgba(15,46,99,0.14)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-gold sm:p-8"
              >
                <span aria-hidden="true" className="pointer-events-none absolute -right-20 -top-20 -z-10 size-56 rounded-full bg-youtube/10 opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100" />
                <span className="grid size-14 place-items-center rounded-2xl bg-youtube text-white shadow-[0_12px_26px_rgba(230,32,23,0.3)] transition duration-300 group-hover:-rotate-6 group-hover:scale-105">
                  <Play className="ml-0.5 size-6 fill-current" aria-hidden="true" />
                </span>
                <span className="mt-6 block font-heading text-2xl font-bold text-navy sm:text-[1.75rem]">{site.shortName} on YouTube</span>
                <span className="mt-2 block text-[16px] leading-relaxed text-slate-500">
                  Match highlights, ceremonies and corporate days on the federation&apos;s channel.
                </span>
                <span className="mt-5 flex items-start gap-3 rounded-2xl bg-white p-4 text-sm text-slate-600 ring-1 ring-line transition-colors group-hover:bg-surface">
                  <BellRing className="mt-0.5 size-4 shrink-0 text-gold-deep" aria-hidden="true" />
                  Subscribe to be told when a new video goes up.
                </span>
                <span aria-hidden="true" className="block min-h-6 flex-1" />
                <span className="flex items-center justify-between border-t border-line pt-5">
                  <span className="inline-flex items-center gap-1.5 font-bold text-royal">
                    Open the channel
                    <ExternalLink className="size-3.5 text-slate-400" aria-hidden="true" />
                    <span className="sr-only">(opens in a new tab)</span>
                  </span>
                  <span className="grid size-10 place-items-center rounded-full bg-white text-royal ring-1 ring-line transition duration-300 group-hover:bg-royal group-hover:text-white group-hover:ring-royal">
                    <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5" aria-hidden="true" />
                  </span>
                </span>
              </a>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
