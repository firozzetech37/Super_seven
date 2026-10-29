import type { Metadata } from "next";
import { ArrowRight, ExternalLink, Play } from "lucide-react";
import { JumpLinks } from "@/components/fixtures/jump-links";
import { PhotoGrid } from "@/components/gallery/photo-grid";
import { PressFilter } from "@/components/gallery/press-filter";
import { VideoEmbed } from "@/components/gallery/video-embed";
import { PageHeader } from "@/components/layout/page-header";
import { SectionHeading } from "@/components/layout/section-heading";
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

      <section id="photos" className="scroll-mt-28 bg-white py-14 lg:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <SectionHeading
            eyebrow="Photos"
            title="Albums"
            description={`${photoCount} photographs carried over from the old site, grouped by event. Click any photo to open it; use the arrow keys to move through an album.`}
          />
          <div className="mt-10 space-y-14">
            {albums.map((album) => (
              <div key={album.id} id={album.id} className="scroll-mt-28">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <h3 className="font-heading text-2xl font-bold text-navy">{album.title}</h3>
                    <p className="mt-1 text-[15px] text-slate-500">{album.description}</p>
                  </div>
                  <span className="shrink-0 rounded-full bg-surface px-3 py-1 text-xs font-bold text-slate-500 ring-1 ring-line">
                    {album.photos.length} photos
                  </span>
                </div>
                <div className="mt-5">
                  <PhotoGrid photos={album.photos} albumTitle={album.title} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="press" className="scroll-mt-28 border-t border-line bg-surface py-14 lg:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <SectionHeading eyebrow="Press clippings" title="In the papers since 2003" description="Newspaper coverage of Super Seven cricket, by year." />
          <div className="mt-8">
            <PressFilter years={pressYears} />
          </div>
        </div>
      </section>

      <section id="videos" className="scroll-mt-28 bg-white py-14 lg:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <SectionHeading
            eyebrow="Videos"
            title="Watch Super Seven"
            description="Match videos live on the federation's YouTube channel. A featured video is embedded here once SSCFI picks one."
          />
          <div className="mt-10 grid grid-cols-[minmax(0,1fr)] gap-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] lg:items-start">
            {featuredVideo ? (
              <VideoEmbed id={featuredVideo.id} title={featuredVideo.title} />
            ) : (
              <div className="flex min-h-64 items-center justify-center rounded-3xl sm:aspect-video bg-[linear-gradient(150deg,#1c4fa0,#0f2e63_60%,#0b2550)] p-8 text-center text-white ring-1 ring-white/10">
                <div>
                  <span className="mx-auto grid size-14 place-items-center rounded-full bg-white/10 text-gold ring-1 ring-white/20">
                    <Play className="size-7" aria-hidden="true" />
                  </span>
                  <p className="mt-4 font-heading text-2xl font-bold">Featured video coming soon</p>
                  <p className="mt-1 text-white/70">Until then, every video is on the channel.</p>
                </div>
              </div>
            )}
            <a
              href={youtube?.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex h-full flex-col justify-between rounded-3xl bg-surface p-8 ring-1 ring-line transition hover:-translate-y-0.5 hover:bg-white hover:shadow-[0_18px_40px_rgba(15,46,99,0.12)]"
            >
              <span className="grid size-12 place-items-center rounded-2xl bg-youtube text-white">
                <Play className="size-6" aria-hidden="true" />
              </span>
              <span className="mt-6 block font-heading text-2xl font-bold text-navy">{site.shortName} on YouTube</span>
              <span className="mt-2 block text-slate-500">
                Match highlights, ceremonies and corporate days on the federation&apos;s channel. Subscribe to be told when a
                new video goes up.
              </span>
              <span className="mt-6 inline-flex items-center gap-2 font-bold text-royal">
                Open the channel
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                <ExternalLink className="size-3.5 text-slate-400" aria-hidden="true" />
              </span>
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
