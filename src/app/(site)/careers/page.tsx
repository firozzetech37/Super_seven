import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BookOpen } from "lucide-react";
import { RoleCard } from "@/components/careers/role-card";
import { GroundWatermark } from "@/components/layout/ground-watermark";
import { PageHeader } from "@/components/layout/page-header";
import { SectionHeading } from "@/components/layout/section-heading";
import { careerSteps, roles } from "@/lib/data/careers";
import { Reveal } from "@/components/motion/reveal";

export const metadata: Metadata = {
  title: "Careers",
  description: "Umpires, scorers, coaches and coordinators.",
};

export default function CareersPage() {
  return (
    <>
      <PageHeader
        eyebrow="Join the federation"
        title="Careers"
        description="Umpires, scorers, coaches and coordinators keep seven-a-side cricket running from district grounds to the national league."
        crumbs={[{ label: "Careers" }]}
        aside={
          <Link
            href="/contact?type=careers"
            className="group inline-flex items-center gap-2 rounded-full bg-gold px-6 py-3 font-bold text-navy shadow-[0_10px_24px_rgba(4,15,42,0.35)] transition hover:bg-gold-deep motion-safe:animate-glow"
          >
            Write to us
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
          </Link>
        }
      />

      <section className="relative isolate overflow-hidden bg-white py-14 lg:py-20">
        <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[520px] bg-[radial-gradient(55%_70%_at_90%_0%,rgba(28,79,160,0.07),transparent_70%)]" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <SectionHeading
            eyebrow="Open roles"
            title={
              <>
                <span className="text-royal">Four ways</span> to be part of a match day
              </>
            }
            description="Roles are assigned per tournament or per season by a district or state association. Terms are agreed when SSCFI calls back."
          />
          <Reveal stagger={90} as="ul" className="mt-10 grid gap-6 md:grid-cols-2">
            {roles.map((r, i) => (
              <li key={r.slug}>
                <RoleCard role={r} index={i} />
              </li>
            ))}
          </Reveal>
        </div>
      </section>

      <section className="bg-white pb-16 lg:pb-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <Reveal from="scale">
            <div className="card-premium relative isolate overflow-hidden rounded-[2rem] bg-stadium px-6 py-12 text-white shadow-[0_40px_80px_rgba(15,46,99,0.28)] sm:px-10 lg:px-14 lg:py-16">
              <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
                <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:22px_22px] [mask-image:radial-gradient(60%_80%_at_20%_30%,#000,transparent)]" />
                <GroundWatermark className="parallax-slow absolute -right-40 -top-24 w-[820px] text-white/[0.05]" />
                <div className="absolute -bottom-32 left-1/3 size-[420px] rounded-full bg-gold/10 blur-[110px]" />
                <div className="absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(217,174,86,0.8)_25%,rgba(217,174,86,0.8)_75%,transparent)]" />
              </div>

              <SectionHeading tone="dark" eyebrow="How it works" title="Three steps from enquiry to your first match" />

              <div className="relative mt-12">
                <span aria-hidden="true" className="absolute left-[1.75rem] top-7 hidden h-px w-[calc(100%-3.5rem)] border-t-2 border-dashed border-gold/40 md:block" />
                <span aria-hidden="true" className="absolute bottom-7 left-7 top-7 w-px border-l-2 border-dashed border-gold/40 md:hidden" />
                <Reveal stagger={160} as="ol" className="relative grid gap-8 md:grid-cols-3 md:gap-6">
                  {careerSteps.map((s, i) => (
                    <li key={s.n} className="group relative flex gap-5 md:flex-col md:gap-0">
                      <span className="relative grid size-14 shrink-0 place-items-center">
                        {i === 0 ? <span aria-hidden="true" className="absolute inset-0 rounded-full bg-gold/40 motion-safe:animate-ping [animation-duration:2.6s]" /> : null}
                        <span className="relative grid size-14 place-items-center rounded-full bg-gold font-heading text-2xl font-bold text-navy shadow-[0_0_0_6px_rgba(15,46,99,0.9),0_14px_30px_rgba(4,15,42,0.5)] transition duration-300 group-hover:scale-110">
                          {s.n}
                        </span>
                      </span>
                      <div className="flex-1 rounded-3xl bg-white/[0.06] p-6 ring-1 ring-white/10 backdrop-blur transition duration-300 group-hover:-translate-y-1 group-hover:bg-white/[0.1] group-hover:ring-gold/40 md:mt-6">
                        <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-gold">Step {String(s.n).padStart(2, "0")}</p>
                        <h3 className="mt-2 font-heading text-xl font-bold sm:text-2xl">{s.title}</h3>
                        <p className="mt-2 text-[15px] leading-relaxed text-white/75">{s.text}</p>
                      </div>
                    </li>
                  ))}
                </Reveal>
              </div>

              <div className="mt-12 flex flex-col gap-3 border-t border-white/10 pt-8 sm:flex-row sm:items-center">
                <Link
                  href="/contact?type=careers"
                  className="group inline-flex items-center justify-center gap-2 rounded-full bg-gold px-6 py-3 font-bold text-navy shadow-[0_12px_28px_rgba(4,15,42,0.45)] transition hover:bg-gold-deep"
                >
                  Start with step one
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                </Link>
                <Link
                  href="/rules"
                  className="group inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 font-bold text-white ring-1 ring-white/35 transition hover:bg-white/10 hover:ring-white/70"
                >
                  <BookOpen className="size-4 text-gold transition-transform group-hover:-rotate-6" aria-hidden="true" />
                  Read the rule book
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
