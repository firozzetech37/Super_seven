import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { RoleCard } from "@/components/careers/role-card";
import { PageHeader } from "@/components/layout/page-header";
import { SectionHeading } from "@/components/layout/section-heading";
import { careerSteps, roles } from "@/lib/data/careers";

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
            className="group inline-flex items-center gap-2 rounded-full bg-gold px-6 py-3 font-bold text-navy shadow-[0_10px_24px_rgba(4,15,42,0.35)] transition hover:bg-gold-deep"
          >
            Write to us
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
          </Link>
        }
      />

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <SectionHeading eyebrow="Open roles" title="Four ways to be part of a match day" description="Roles are assigned per tournament or per season by a district or state association. Terms are agreed when SSCFI calls back." />
        <ul className="mt-10 grid gap-6 md:grid-cols-2">
          {roles.map((r) => (
            <li key={r.slug}>
              <RoleCard role={r} />
            </li>
          ))}
        </ul>
      </section>

      <section className="border-t border-line bg-surface py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <SectionHeading eyebrow="How it works" title="Three steps from enquiry to your first match" />
          <ol className="mt-10 grid gap-4 md:grid-cols-3">
            {careerSteps.map((s) => (
              <li key={s.n} className="relative rounded-3xl bg-white p-7 ring-1 ring-line">
                <span className="grid size-11 place-items-center rounded-full bg-gold font-heading text-xl font-bold text-navy">{s.n}</span>
                <h3 className="mt-5 font-heading text-xl font-bold text-navy">{s.title}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-slate-600">{s.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </>
  );
}
