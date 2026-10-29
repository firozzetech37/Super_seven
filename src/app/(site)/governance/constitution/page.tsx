import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BookOpenText, Clock3, FileText, Gavel, Landmark, ScrollText, Users, Vote } from "lucide-react";
import { GroundWatermark } from "@/components/layout/ground-watermark";
import { PageHeader } from "@/components/layout/page-header";
import { SectionHeading } from "@/components/layout/section-heading";
import { Reveal } from "@/components/motion/reveal";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Constitution",
  description: "The constitution of the Super Seven Cricket Federation of India.",
};

const parts = [
  { title: "Memorandum of association", icon: ScrollText },
  { title: "Rules and regulations", icon: Gavel },
  { title: "Office bearer elections", icon: Vote },
  { title: "AGM minutes", icon: BookOpenText },
];

const related = [
  { label: "Documents", text: "Rule books, forms, fixtures and results.", href: "/governance/documents", icon: FileText },
  { label: "Office Bearers", text: "President, Senior Vice President, Secretary General and the committee chairs.", href: "/about/office-bearers", icon: Users },
  { label: "Our story", text: "How the federation began in 2003 and where it plays today.", href: "/about", icon: Landmark },
];

const record = [
  { label: "Society number", value: "521/2003-04" },
  { label: "Registered under", value: "Societies Registration Act, 1860" },
  { label: "Year", value: String(site.foundedYear) },
  { label: "Registered office", value: site.address },
];

export default function Page() {
  return (
    <>
      <PageHeader
        eyebrow="Governance"
        title="Constitution"
        description={`The constitution of ${site.name}, a society registered in ${site.foundedYear} under the Societies Registration Act, 1860.`}
        crumbs={[{ label: "Governance" }, { label: "Constitution" }]}
        aside={
          <div className="flex items-center gap-4 rounded-3xl bg-white/10 p-4 pr-6 ring-1 ring-white/15 backdrop-blur">
            <span className="relative grid size-16 shrink-0 place-items-center rounded-full bg-gold text-navy shadow-[0_0_0_5px_rgba(217,174,86,0.2)]">
              <span aria-hidden="true" className="absolute inset-1 rounded-full border border-dashed border-navy/40 motion-safe:animate-[spin_18s_linear_infinite]" />
              <Landmark className="size-6" aria-hidden="true" />
            </span>
            <span>
              <span className="block text-[11px] font-bold uppercase tracking-[0.18em] text-gold">Registered society</span>
              <span className="mt-0.5 block font-heading text-xl font-bold leading-tight">No. 521/2003-04</span>
            </span>
          </div>
        }
      />

      {/* Status + registration record */}
      <section className="relative isolate overflow-hidden">
        <GroundWatermark className="parallax-slow pointer-events-none absolute -left-64 top-10 -z-10 w-[760px] text-navy/[0.035]" />
        <div className="mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[1fr_440px] lg:items-center lg:gap-16 lg:py-20">
          <div>
            <SectionHeading eyebrow="Document requested from SSCFI" title="The constitution is on its way" />
            <Reveal delay={120} className="mt-6 space-y-5">
              <p className="text-[17px] leading-relaxed text-slate-600">
                The constitution and bylaws have been requested from the federation. They will be published here as a readable page and a PDF,
                alongside annual general meeting minutes.
              </p>
              <p className="inline-flex items-center gap-2.5 rounded-full bg-status-talks/25 py-1.5 pl-2 pr-4 text-sm font-bold text-navy ring-1 ring-status-talks">
                <span className="relative grid size-6 place-items-center rounded-full bg-status-talks">
                  <span aria-hidden="true" className="absolute inset-0 rounded-full bg-status-talks motion-safe:animate-ping [animation-duration:2.4s]" />
                  <Clock3 className="relative size-3.5" aria-hidden="true" />
                </span>
                Requested, not yet received
              </p>
            </Reveal>
          </div>

          <Reveal from="right">
            <div className="group relative overflow-hidden rounded-[1.75rem] bg-white shadow-[0_24px_54px_rgba(15,46,99,0.12)] ring-1 ring-line">
              <div className="relative isolate overflow-hidden bg-stadium px-6 py-5 text-white">
                <GroundWatermark className="absolute -right-16 -top-12 -z-10 w-72 text-white/[0.1] transition-transform duration-700 group-hover:-rotate-3 group-hover:scale-110" />
                <span aria-hidden="true" className="absolute inset-x-0 bottom-0 h-px bg-[linear-gradient(90deg,transparent,rgba(217,174,86,0.9)_20%,rgba(217,174,86,0.9)_80%,transparent)]" />
                <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-gold">On record</p>
                <h2 className="mt-1 font-heading text-xl font-bold">Registration</h2>
              </div>
              <dl className="divide-y divide-line px-6 py-2">
                {record.map((r) => (
                  <div key={r.label} className="grid gap-1 py-4 sm:grid-cols-[150px_1fr] sm:gap-4">
                    <dt className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500 sm:pt-0.5">{r.label}</dt>
                    <dd className="text-[15px] font-bold leading-snug text-navy">{r.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </Reveal>
        </div>
      </section>

      {/* What will be published */}
      <section className="relative isolate overflow-hidden bg-stadium py-16 text-white sm:py-20">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:22px_22px] [mask-image:radial-gradient(70%_70%_at_30%_50%,#000,transparent)]" />
          <GroundWatermark className="parallax-slow absolute -right-48 -top-16 w-[820px] text-white/[0.05]" />
          <div className="absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(217,174,86,0.7)_20%,rgba(217,174,86,0.7)_80%,transparent)]" />
        </div>
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <SectionHeading
            tone="dark"
            eyebrow="Coming to this page"
            title={
              <>
                Four parts, each as a <span className="text-gold">page and a PDF</span>
              </>
            }
          />
          <Reveal as="ol" stagger={120} className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {parts.map(({ title, icon: Icon }, i) => (
              <li
                key={title}
                className="group relative flex h-full flex-col overflow-hidden rounded-3xl bg-white/[0.06] p-6 ring-1 ring-white/10 backdrop-blur transition duration-300 hover:-translate-y-1.5 hover:bg-white/[0.1] hover:shadow-[0_24px_50px_rgba(4,15,42,0.45)] hover:ring-gold/50"
              >
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute -right-2 -top-5 font-heading text-[6rem] font-bold leading-none text-white/[0.05] transition duration-500 group-hover:-translate-y-1 group-hover:text-gold/15"
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span aria-hidden="true" className="absolute inset-x-6 top-0 h-[3px] origin-left scale-x-0 rounded-b-full bg-gradient-to-r from-gold to-gold-deep transition-transform duration-500 group-hover:scale-x-100" />
                <span className="relative grid size-12 place-items-center rounded-2xl bg-white/10 text-gold transition duration-300 group-hover:-rotate-6 group-hover:bg-gold group-hover:text-navy">
                  <Icon className="size-6" aria-hidden="true" />
                </span>
                <h3 className="relative mt-5 font-heading text-xl font-bold leading-snug">{title}</h3>
                <p className="relative mt-auto flex flex-wrap items-center gap-2 pt-6 text-[10px] font-bold uppercase tracking-[0.16em]">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-status-talks/15 px-2.5 py-1 text-status-talks ring-1 ring-status-talks/30">
                    <span aria-hidden="true" className="size-1.5 rounded-full bg-status-talks" />
                    Requested
                  </span>
                  <span className="rounded-full bg-white/10 px-2.5 py-1 text-white/70 ring-1 ring-white/15">Page + PDF</span>
                </p>
              </li>
            ))}
          </Reveal>
        </div>
      </section>

      {/* Related */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:py-20">
        <SectionHeading eyebrow="Meanwhile" title="Related pages" />
        <Reveal as="ul" stagger={100} className="mt-10 grid gap-5 md:grid-cols-3">
          {related.map(({ label, text, href, icon: Icon }) => (
            <li key={href}>
              <Link
                href={href}
                className="group card-premium relative flex h-full flex-col overflow-hidden rounded-3xl bg-white p-6 shadow-[0_12px_30px_rgba(15,46,99,0.07)] ring-1 ring-line transition duration-300 hover:-translate-y-1.5 hover:shadow-[0_28px_60px_rgba(15,46,99,0.14)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-gold"
              >
                <span aria-hidden="true" className="absolute inset-x-6 top-0 h-[3px] origin-left scale-x-0 rounded-b-full bg-gradient-to-r from-gold to-gold-deep transition-transform duration-500 group-hover:scale-x-100" />
                <span className="grid size-12 place-items-center rounded-2xl bg-royal/10 text-royal transition duration-300 group-hover:-rotate-6 group-hover:bg-royal group-hover:text-white group-hover:shadow-[0_10px_22px_rgba(28,79,160,0.35)]">
                  <Icon className="size-6" aria-hidden="true" />
                </span>
                <span className="mt-5 block font-heading text-[1.35rem] font-bold leading-tight text-navy transition-colors group-hover:text-royal">{label}</span>
                <span className="mt-2 block text-[15px] leading-relaxed text-slate-500">{text}</span>
                <span className="mt-auto flex items-center justify-between pt-6 text-sm font-bold text-royal">
                  Open
                  <span className="grid size-9 place-items-center rounded-full bg-surface text-royal ring-1 ring-line transition duration-300 group-hover:bg-royal group-hover:text-white group-hover:ring-royal">
                    <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5" aria-hidden="true" />
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </Reveal>
      </section>
    </>
  );
}
