import { ArrowRight, Mail } from "lucide-react";
import { GroundWatermark } from "@/components/layout/ground-watermark";
import { Reveal } from "@/components/motion/reveal";
import { site } from "@/lib/site";

/**
 * Light "send us your details" card that closes the people pages: one mailto to the COO.
 * Light on purpose, so it does not stack against the navy footer call to action below it.
 */
export function UpdateCta({ eyebrow, title, text, subject }: { eyebrow: string; title: string; text: string; subject: string }) {
  return (
    <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:pb-20">
      <Reveal
        from="scale"
        className="group relative isolate overflow-hidden rounded-[2rem] bg-[linear-gradient(135deg,#ffffff,#f6f7fb_60%,#fbf6ea)] p-7 shadow-[0_24px_60px_rgba(15,46,99,0.1)] ring-1 ring-line sm:p-10 lg:p-12"
      >
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-[radial-gradient(rgba(15,46,99,0.08)_1px,transparent_1px)] [background-size:22px_22px] [mask-image:radial-gradient(55%_80%_at_85%_50%,#000,transparent)]" />
          <GroundWatermark className="absolute -bottom-28 -right-32 w-[640px] text-navy/[0.06] transition-transform duration-1000 ease-out group-hover:-rotate-3 group-hover:scale-105" />
          <div className="absolute -right-20 -top-24 size-72 rounded-full bg-gold/20 blur-3xl" />
        </div>
        <span aria-hidden="true" className="absolute inset-y-8 left-0 w-1 rounded-r-full bg-gradient-to-b from-gold to-gold-deep" />
        <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex max-w-2xl items-start gap-5">
            <span className="relative hidden size-14 shrink-0 place-items-center rounded-2xl bg-navy text-gold shadow-[0_14px_28px_rgba(15,46,99,0.3)] sm:grid motion-safe:animate-float">
              <Mail className="size-6" aria-hidden="true" />
            </span>
            <div>
              <p className="flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.24em] text-royal">
                <span aria-hidden="true" className="h-px w-8 bg-gold-deep" />
                {eyebrow}
              </p>
              <h2 className="mt-3 font-heading text-[1.75rem] font-bold leading-tight text-ink sm:text-4xl">{title}</h2>
              <p className="mt-3 text-lg leading-relaxed text-slate-500">{text}</p>
            </div>
          </div>
          <div className="flex shrink-0 flex-col gap-3 sm:flex-row sm:items-center">
            <a
              href={`mailto:${site.email}?subject=${encodeURIComponent(subject)}`}
              className="group/btn inline-flex items-center justify-center gap-2 rounded-full bg-gold px-6 py-3.5 font-bold text-navy shadow-[0_14px_30px_rgba(201,155,67,0.35)] transition hover:bg-gold-deep focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-gold/50"
            >
              <Mail className="size-4" aria-hidden="true" />
              Email the COO
              <ArrowRight className="size-4 transition-transform group-hover/btn:translate-x-1" aria-hidden="true" />
            </a>
            <span className="inline-flex items-center justify-center rounded-full bg-white px-5 py-3 text-sm font-bold text-navy ring-1 ring-line">{site.email}</span>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
