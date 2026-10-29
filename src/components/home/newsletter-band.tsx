import { Mail } from "lucide-react";
import { NewsletterForm } from "@/components/forms/newsletter-form";
import { GroundWatermark } from "@/components/layout/ground-watermark";
import { Reveal } from "@/components/motion/reveal";

/** Replaces the old site's "News Letters" popup with a proper sign-up band above the footer. */
export function NewsletterBand() {
  return (
    <section className="relative isolate overflow-hidden bg-[linear-gradient(135deg,#1c4fa0,#0f2e63_60%,#0b2550)] py-14 text-white">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(50%_80%_at_80%_50%,rgba(217,174,86,0.18),transparent_70%)]" />
      <GroundWatermark className="pointer-events-none absolute -left-40 -bottom-40 w-[560px] text-white/[0.06]" />
      <Reveal className="mx-auto grid max-w-7xl items-center gap-8 px-4 sm:px-6 lg:grid-cols-[1fr_480px]">
        <div className="flex items-start gap-5">
          <span className="hidden size-14 shrink-0 place-items-center rounded-2xl bg-white/10 text-gold ring-1 ring-white/20 sm:grid">
            <Mail className="size-7" aria-hidden="true" />
          </span>
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-gold">Newsletter</p>
            <h2 className="mt-2 font-heading text-3xl font-bold leading-tight lg:text-4xl">
              Fixtures, results and announcements in your inbox
            </h2>
            <p className="mt-2 text-white/75">One email when something happens. Nothing when it doesn&apos;t.</p>
          </div>
        </div>
        <NewsletterForm tone="dark" />
      </Reveal>
    </section>
  );
}
