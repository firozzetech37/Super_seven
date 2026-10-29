import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { GroundWatermark } from "@/components/layout/ground-watermark";
import { SectionHeading } from "@/components/layout/section-heading";
import { Reveal } from "@/components/motion/reveal";
import { CommitteeCard } from "@/components/people/committee-card";
import { PersonCard } from "@/components/people/person-card";
import { committees, leadership } from "@/lib/data/people";

export function PeopleSection() {
  return (
    <section id="people" className="relative isolate scroll-mt-28 overflow-hidden border-t border-line bg-surface py-16 lg:py-24">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(45%_55%_at_90%_0%,rgba(217,174,86,0.16),transparent_70%),radial-gradient(40%_50%_at_0%_100%,rgba(28,79,160,0.1),transparent_70%)]" />
        <GroundWatermark className="parallax-slow absolute -right-48 top-6 w-[820px] text-navy/[0.05]" />
      </div>
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="Below the ground"
          title="The people behind the federation"
          description="Leadership first, then the committees. Each card has direct contact."
          action={
            <Link
              href="/about/office-bearers"
              className="group inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 font-bold text-royal shadow-[0_8px_20px_rgba(15,46,99,0.08)] ring-1 ring-line transition hover:ring-royal"
            >
              All office bearers
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
            </Link>
          }
        />

        <Reveal stagger={110} className="mt-10 grid gap-6 md:grid-cols-3">
          {leadership.map((p) => (
            <PersonCard key={p.id} person={p} />
          ))}
        </Reveal>

        <Reveal className="mt-16 flex items-center gap-4">
          <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-royal">Committees</p>
          <span aria-hidden="true" className="eyebrow-dash h-px flex-1 bg-[linear-gradient(90deg,var(--color-gold-deep),transparent)]" />
        </Reveal>

        <Reveal stagger={110} className="mt-6 grid gap-6 md:grid-cols-3">
          {committees.map((c) => (
            <CommitteeCard key={c.id} committee={c} />
          ))}
        </Reveal>
      </div>
    </section>
  );
}
