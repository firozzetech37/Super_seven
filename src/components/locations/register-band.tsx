import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { GroundWatermark } from "@/components/layout/ground-watermark";
import { Reveal } from "@/components/motion/reveal";

type Action = { href: string; label: string };

/** Closing call to action on the map pages: a navy stadium card with a gold and a ghost pill. */
export function RegisterBand({ eyebrow, title, text, primary, secondary }: { eyebrow: string; title: string; text: string; primary: Action; secondary?: Action }) {
  return (
    <Reveal from="scale" className="relative isolate overflow-hidden rounded-[2rem] bg-stadium px-6 py-10 text-white shadow-[0_30px_70px_rgba(15,46,99,0.28)] sm:px-10 lg:px-14 lg:py-12">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:20px_20px] [mask-image:linear-gradient(90deg,transparent,#000_70%)]" />
        <GroundWatermark className="absolute -right-40 -top-24 w-[640px] text-white/[0.06]" />
        <div className="absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(217,174,86,0.8)_20%,rgba(217,174,86,0.8)_80%,transparent)]" />
      </div>
      <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-2xl">
          <p className="flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.24em] text-gold">
            <span aria-hidden="true" className="h-px w-8 bg-gold" />
            {eyebrow}
          </p>
          <h2 className="mt-3 font-heading text-3xl font-bold leading-tight sm:text-4xl">{title}</h2>
          <p className="mt-3 text-lg leading-relaxed text-white/75">{text}</p>
        </div>
        <div className="flex shrink-0 flex-col gap-3 sm:flex-row lg:flex-col xl:flex-row">
          <Link
            href={primary.href}
            className="group inline-flex items-center justify-center gap-2 rounded-full bg-gold px-6 py-3 font-bold text-navy shadow-[0_12px_28px_rgba(4,15,42,0.45)] transition hover:bg-gold-deep"
          >
            {primary.label}
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
          </Link>
          {secondary ? (
            <Link
              href={secondary.href}
              className="inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 font-bold text-white ring-1 ring-white/30 transition hover:bg-white/10 hover:ring-white/60"
            >
              {secondary.label}
            </Link>
          ) : null}
        </div>
      </div>
    </Reveal>
  );
}
