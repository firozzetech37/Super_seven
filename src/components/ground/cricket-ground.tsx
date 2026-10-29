import Link from "next/link";
import { ArrowRight, Camera, ChevronDown, MousePointerClick, Newspaper } from "lucide-react";
import { contentAreas, doors } from "@/lib/site";
import { Ball } from "./ball";
import { Bat } from "./bat";
import { CentreLogo } from "./centre-logo";
import { Fielder } from "./fielder";
import { GroundField } from "./ground-field";
import { MobileLineup } from "./mobile-lineup";

const heroCard =
  "group flex items-center justify-center gap-3 rounded-2xl bg-white px-5 py-3.5 text-base font-bold text-navy lg:text-lg shadow-[0_12px_30px_rgba(4,15,42,0.45)] ring-1 ring-white/70 transition duration-200 hover:-translate-y-0.5 hover:bg-gold hover:shadow-[0_16px_34px_rgba(4,15,42,0.5)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-gold";
const heroIcon =
  "hidden size-9 shrink-0 place-items-center rounded-full bg-navy/6 lg:grid text-royal transition-colors group-hover:bg-navy/10 group-hover:text-navy";
const enter = "motion-safe:animate-in motion-safe:fade-in motion-safe:fill-mode-both motion-safe:animation-duration-700";

/**
 * Homepage hero: the cricket ground is the menu.
 * On tablet and desktop it fills the viewport below the header (5rem, plus the 2.75rem menu bar from lg) and ticker (2.5rem),
 * so the first screen is the hero alone; the ground scales with the viewport height up to 1300px wide.
 */
export function CricketGround() {
  return (
    <section
      className="relative isolate flex flex-col overflow-hidden bg-navy-hero text-white md:min-h-[calc(100svh-7.5rem)] lg:min-h-[calc(100svh-10.25rem)]"
      aria-label="Main menu: the cricket ground"
    >
      <h1 className="sr-only">Super Seven Cricket Federation of India: seven players, seven overs</h1>
      {/* Backdrop: a floodlit glow behind the ground, a soft vignette at the foot and a faint sky line at the top */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(55%_75%_at_50%_42%,rgba(44,103,196,0.55),transparent_70%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(120%_90%_at_50%_120%,rgba(5,16,45,0.8),transparent_60%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.06),transparent_30%)]" />
      </div>

      <div className="mx-auto hidden w-full max-w-[1920px] flex-1 grid-cols-[150px_minmax(0,1fr)_210px] items-stretch gap-5 px-4 py-6 md:grid lg:grid-cols-[200px_minmax(0,1fr)_280px] lg:gap-8 lg:px-6 lg:py-8 xl:grid-cols-[220px_minmax(0,1fr)_300px] xl:px-8 2xl:grid-cols-[240px_minmax(0,1fr)_320px] 2xl:gap-10 2xl:px-10">
        <div className="flex flex-col items-center justify-between gap-4">
          <div className="flex flex-1 flex-col items-center justify-center gap-6">
            <div className={`motion-safe:slide-in-from-left-6 ${enter}`}>
              <div className="motion-safe:animate-float">
                <Bat className="h-[clamp(14rem,34vh,22rem)] w-auto -rotate-6" />
              </div>
            </div>
            <Link href={contentAreas.gallery.href} className={heroCard}>
              <span className={heroIcon}>
                <Camera className="size-5" />
              </span>
              {contentAreas.gallery.label}
            </Link>
          </div>
          <p className="flex w-full items-start gap-2 text-sm italic text-white/75">
            <MousePointerClick className="mt-0.5 size-4 shrink-0 text-gold" aria-hidden="true" />
            Click the centre logo anytime to return Home
          </p>
        </div>

        <div className="@container relative mx-auto w-full max-w-[min(1300px,calc((100svh-10.5rem)*1.8636))] lg:max-w-[min(1300px,calc((100svh-14.25rem)*1.8636))] self-center">
          <nav aria-label="Seven players, seven doors" className="relative aspect-[820/440] w-full">
            <GroundField />
            {/* Floodlight sweep across the grass */}
            <span aria-hidden="true" className="pointer-events-none absolute inset-[2%] overflow-hidden rounded-[50%]">
              <span className="absolute inset-y-0 left-0 w-1/3 bg-[linear-gradient(100deg,transparent,rgba(255,255,255,0.16),transparent)] mix-blend-screen motion-safe:animate-sweep" />
            </span>
            {doors.map((d) => (
              <Fielder key={d.number} door={d} />
            ))}
            {/* Soft gold pulse behind the centre logo */}
            <span
              aria-hidden="true"
              className="pointer-events-none absolute left-1/2 top-1/2 size-[16.2cqw] -translate-x-1/2 -translate-y-1/2 rounded-full motion-safe:animate-glow"
            />
            <CentreLogo />
          </nav>
        </div>

        <div className="flex flex-col items-center justify-between gap-4">
          <Link
            href="/register/district"
            className="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-gold px-4 py-3 text-center text-sm font-bold text-navy lg:px-5 lg:text-[15px] shadow-[0_10px_24px_rgba(4,15,42,0.45)] ring-1 ring-white/40 transition duration-200 hover:-translate-y-0.5 hover:bg-gold-deep focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white"
          >
            Register your District Association
            <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-0.5" aria-hidden="true" />
          </Link>
          <div className="flex flex-1 flex-col items-center justify-center gap-6">
            <div className={`motion-safe:slide-in-from-right-6 ${enter}`}>
              <div className="motion-safe:animate-float-slow">
                <Ball className="size-[clamp(7rem,17vh,11rem)]" />
              </div>
            </div>
            <Link href={contentAreas.news.href} className={heroCard}>
              <span className={heroIcon}>
                <Newspaper className="size-5" />
              </span>
              {contentAreas.news.label}
            </Link>
          </div>
        </div>
      </div>

      <a
        href="#people"
        className="absolute bottom-3 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-0.5 text-[11px] font-bold uppercase tracking-[0.2em] text-white/60 transition-colors hover:text-white md:flex"
      >
        Scroll
        <ChevronDown className="size-4 motion-safe:animate-bounce" aria-hidden="true" />
      </a>

      <MobileLineup />
    </section>
  );
}
