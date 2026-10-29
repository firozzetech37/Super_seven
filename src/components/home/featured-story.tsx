import Link from "next/link";
import { ArrowRight, Images, MapPin, Trophy, Users } from "lucide-react";
import { GroundWatermark } from "@/components/layout/ground-watermark";
import { Reveal } from "@/components/motion/reveal";
import { StoryStage, type StoryPhoto } from "./story-stage";

const photos: StoryPhoto[] = [
  { src: "/legacy/slide1.jpg", alt: "Under-23 squad lined up at the 17th Youth National Super Seven Championship, Mussoorie" },
  { src: "/legacy/slide3.jpg", alt: "Teams and officials gathered on the ground at the Youth National Championship" },
  { src: "/legacy/slide2.jpg", alt: "Banner of the 17th Youth National Super Seven Cricket Championship (Under-23)" },
  { src: "/legacy/slide4.jpg", alt: "Officials seated at the Youth National Championship" },
  { src: "/legacy/slide6.jpg", alt: "Officials in front of the championship banner" },
  { src: "/legacy/slide5.jpg", alt: "An official in a cap at the Mussoorie bazaar during the championship" },
];

const facts = [
  { icon: MapPin, label: "Mussoorie, Uttarakhand" },
  { icon: Users, label: "Under-23 boys" },
  { icon: Trophy, label: "17th edition" },
];

/** One big featured story under the ground: a cinematic photo stage beside the story. */
export function FeaturedStory() {
  return (
    <section className="bg-white pb-16 lg:pb-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <Reveal from="scale">
          <article className="card-premium relative isolate grid overflow-hidden rounded-[2rem] bg-stadium text-white shadow-[0_40px_80px_rgba(15,46,99,0.3)] lg:grid-cols-[1.15fr_1fr]">
            <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
              <GroundWatermark className="parallax-slow absolute -right-40 -top-24 w-[760px] text-white/[0.05]" />
              <div className="absolute -bottom-32 left-1/3 size-[420px] rounded-full bg-gold/10 blur-[110px]" />
              <div className="absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(217,174,86,0.8)_25%,rgba(217,174,86,0.8)_75%,transparent)]" />
            </div>

            <div className="self-center p-3 sm:p-4 lg:p-5">
              <StoryStage photos={photos} badge="Featured story" />
            </div>

            <Reveal stagger={90} className="flex flex-col justify-center px-6 pb-8 pt-4 sm:px-8 lg:p-12">
              <p className="flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.24em] text-gold">
                <span aria-hidden="true" className="h-px w-8 bg-gold" />
                Youth National Championship
              </p>
              <h2 className="mt-4 font-heading text-3xl font-bold leading-[1.1] sm:text-4xl lg:text-[2.75rem]">
                <span className="text-gold">17th</span> Youth National Championship
              </h2>
              <ul className="mt-5 flex flex-wrap gap-2">
                {facts.map(({ icon: Icon, label }) => (
                  <li key={label} className="inline-flex items-center gap-1.5 rounded-full bg-white/[0.08] px-3 py-1.5 text-xs font-bold text-white/85 ring-1 ring-white/15">
                    <Icon className="size-3.5 text-gold" aria-hidden="true" />
                    {label}
                  </li>
                ))}
              </ul>
              <p className="mt-5 text-[17px] leading-relaxed text-white/75">
                The under-23 boys&apos; championship in Mussoorie is the latest national event. The full story, results and
                photos follow once SSCFI confirms the details; pictures from earlier tournaments, including the 2014
                National Cricket League Super 7 in Amroha, live in the photo gallery.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <Link
                  href="/news"
                  className="group inline-flex items-center justify-center gap-2 rounded-full bg-gold px-6 py-3 font-bold text-navy shadow-[0_12px_28px_rgba(4,15,42,0.45)] transition hover:bg-gold-deep"
                >
                  Read the story
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                </Link>
                <Link
                  href="/gallery"
                  className="group inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 font-bold text-white ring-1 ring-white/35 transition hover:bg-white/10 hover:ring-white/70"
                >
                  <Images className="size-4 text-gold transition-transform group-hover:-rotate-6" aria-hidden="true" />
                  Photo gallery
                </Link>
              </div>
            </Reveal>
          </article>
        </Reveal>
      </div>
    </section>
  );
}
