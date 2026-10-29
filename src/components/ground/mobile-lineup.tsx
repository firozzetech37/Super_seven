"use client";

import Link from "next/link";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { contentAreas, doors } from "@/lib/site";
import { Ball } from "./ball";
import { Bat } from "./bat";

/** On a phone the ground becomes a swipeable lineup of seven player cards; bat and ball sit above as two big buttons. */
export function MobileLineup() {
  return (
    <div className="space-y-5 px-4 py-6 md:hidden">
      <div className="grid grid-cols-2 gap-3">
        <Link
          href={contentAreas.gallery.href}
          className="flex items-center gap-3 rounded-xl bg-white px-4 py-3 font-bold text-navy shadow-md"
        >
          <Bat className="h-12 w-auto shrink-0" />
          {contentAreas.gallery.label}
        </Link>
        <Link
          href={contentAreas.news.href}
          className="flex items-center gap-3 rounded-xl bg-white px-4 py-3 font-bold text-navy shadow-md"
        >
          <Ball className="size-11 shrink-0" />
          {contentAreas.news.label}
        </Link>
      </div>

      <Link
        href="/register/district"
        className="block rounded-full bg-gold px-5 py-3 text-center font-bold text-navy shadow-md"
      >
        Register your District Association →
      </Link>

      <Carousel opts={{ align: "start", loop: true }} className="pt-1">
        <CarouselContent className="-ml-3">
          {doors.map((d) => (
            <CarouselItem key={d.number} className="basis-[74%] pl-3 sm:basis-1/2">
              <Link
                href={d.href}
                className="flex h-full flex-col items-center rounded-2xl bg-ground px-5 pb-5 pt-6 text-center text-white ring-2 ring-white/70"
              >
                <span aria-hidden="true" className="size-9 rounded-full bg-skin ring-2 ring-white/70" />
                <span
                  aria-hidden="true"
                  className="-mt-1.5 grid size-12 place-items-center rounded-xl bg-royal text-2xl font-bold ring-2 ring-white"
                >
                  {d.number}
                </span>
                <span className="mt-3 rounded-full bg-white px-4 py-1.5 font-bold text-navy">
                  <span className="sr-only">{d.number}. </span>
                  {d.label}
                </span>
                <span className="mt-3 text-sm leading-snug text-white/90">{d.items.join(" • ")}</span>
              </Link>
            </CarouselItem>
          ))}
        </CarouselContent>
        <div className="mt-4 flex items-center justify-center gap-3">
          <CarouselPrevious className="static translate-x-0 translate-y-0" />
          <span className="text-sm italic text-white/75">Swipe through the seven players</span>
          <CarouselNext className="static translate-x-0 translate-y-0" />
        </div>
      </Carousel>
    </div>
  );
}
