import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SectionHeading } from "@/components/layout/section-heading";
import { Reveal } from "@/components/motion/reveal";
import { CommitteeRow } from "@/components/people/committee-row";
import { PersonCard } from "@/components/people/person-card";
import { committees, leadership } from "@/lib/data/people";

export function PeopleSection() {
  return (
    <section id="people" className="scroll-mt-28 border-t border-line bg-surface py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="Below the ground"
          title="The people behind the federation"
          description="Leadership first, then the committees. Each card has a photo and direct contact."
          action={
            <Link href="/about/office-bearers" className="inline-flex items-center gap-2 font-bold text-royal underline-offset-4 hover:underline">
              All office bearers
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          }
        />
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {leadership.map((p, i) => (
            <Reveal key={p.id} delay={i * 100}>
              <PersonCard person={p} />
            </Reveal>
          ))}
        </div>
        <div className="mt-6 space-y-4">
          {committees.map((c, i) => (
            <Reveal key={c.id} delay={i * 80}>
              <CommitteeRow committee={c} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
