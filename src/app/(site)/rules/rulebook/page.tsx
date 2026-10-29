import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { BookOpen, ClipboardCheck, Download, Languages, MessageSquareWarning } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { RowsSkeleton } from "@/components/layout/page-skeleton";
import { SectionHeading } from "@/components/layout/section-heading";
import { CountUp } from "@/components/motion/count-up";
import { Reveal } from "@/components/motion/reveal";
import { PageFan } from "@/components/rules/page-fan";
import { RulebookExplorer } from "@/components/rules/rulebook-explorer";
import { rulebookLanguages, rulebookPages, rulebookPdf, rulebookReviewRecordPage, scriptClass } from "@/lib/data/rulebook";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Rulebook in 16 languages",
  description:
    "The Super Seven cricket rulebook in Sanskrit, Hindi, Bengali, Marathi, Gujarati, Kannada, Tamil, Telugu, Malayalam, Odia, Urdu, Punjabi, Nepali, Mizo, Khasi and Manipuri. Forty rules, read online or download.",
};

const stats = [
  { value: rulebookLanguages.length, label: "Languages" },
  { value: 40, label: "Rules in each" },
  { value: rulebookPages, label: "Pages" },
  { value: 2003, label: "Federation founded", plain: true },
];

const notes = [
  {
    icon: BookOpen,
    title: "Translated from one source",
    text: "Every language is a translation of the English Pocket Rulebook of Super Seven Cricket, so Rule 21 means the same thing in Tamil as it does in Punjabi. Until a translation is approved, any discrepancy is checked against the English text.",
  },
  {
    icon: ClipboardCheck,
    title: "Under Technical Committee review",
    text: `This edition is submitted for clause-by-clause verification. The review record on page ${rulebookReviewRecordPage} names the native-language and technical reviewer for each language, with the decision and date.`,
  },
  {
    icon: MessageSquareWarning,
    title: "Spotted a mistake?",
    text: "Tell the Technical Committee which language, rule and page. Corrections go into the next edition and the review record.",
    href: "/contact",
    cta: "Write to SSCFI",
  },
];

export default function RulebookPage() {
  return (
    <>
      <PageHeader
        eyebrow="Door 3 · Rules"
        title="The rulebook in 16 Indian languages"
        description="Forty rules of Super Seven cricket, from Teams to Protest, in the language you play in. Read any rule online or download the whole book."
        crumbs={[{ label: "Rules", href: "/rules" }, { label: "Multilingual rulebook" }]}
        aside={
          <div className="flex flex-wrap items-center gap-3">
            <a
              href={rulebookPdf}
              download
              className="group inline-flex items-center gap-2 rounded-full bg-gold px-5 py-3 font-bold text-navy transition hover:bg-gold-deep"
            >
              <Download className="size-4" aria-hidden="true" />
              Download PDF
              <span className="text-navy/60">5 MB</span>
            </a>
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2.5 text-xs font-bold uppercase tracking-[0.14em] text-white ring-1 ring-white/20">
              <span aria-hidden="true" className="size-2 rounded-full bg-status-talks" />
              Under review
            </span>
          </div>
        }
      />

      <section className="relative isolate overflow-hidden bg-navy-hero py-12 text-white lg:py-16">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-[radial-gradient(55%_70%_at_25%_40%,rgba(44,103,196,0.5),transparent_70%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(120%_90%_at_50%_120%,rgba(5,16,45,0.8),transparent_60%)]" />
        </div>
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-[1fr_420px]">
          <Reveal>
            <p className="flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.24em] text-gold">
              <Languages className="size-4" aria-hidden="true" />
              Multilingual edition
            </p>
            <h2 className="mt-3 font-heading text-3xl font-bold sm:text-4xl">One game, read in sixteen scripts</h2>
            <p className="mt-3 max-w-xl text-white/80">
              Sanskrit to Manipuri, Devanagari to Nastaliq. The same forty rules and glossary in every section, with a rule index at the top of each
              so an umpire, scorer or captain can find a clause in seconds.
            </p>
            <Reveal stagger as="dl" className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {stats.map((s) => (
                <div key={s.label} className="rounded-2xl bg-white/10 px-4 py-4 ring-1 ring-white/15 backdrop-blur">
                  <dd className="font-heading text-3xl font-bold text-gold">{s.plain ? s.value : <CountUp value={s.value} />}</dd>
                  <dt className="mt-1 text-[11px] font-bold uppercase tracking-[0.16em] text-white/70">{s.label}</dt>
                </div>
              ))}
            </Reveal>
            <ul className="mt-6 flex flex-wrap gap-2">
              {rulebookLanguages.map((l) => (
                <li key={l.slug}>
                  <Link
                    href={`/rules/rulebook?lang=${l.slug}#reader`}
                    lang={l.code}
                    dir={l.dir}
                    className={cn("inline-block rounded-full bg-white/10 px-3 py-1.5 text-sm font-bold ring-1 ring-white/15 transition hover:bg-gold hover:text-navy", scriptClass[l.script])}
                  >
                    {l.native}
                  </Link>
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={150} from="right" className="hidden lg:block">
            <PageFan />
          </Reveal>
        </div>
      </section>

      <section className="bg-surface py-14 lg:py-16">
        <Suspense
          fallback={
            <div className="mx-auto max-w-7xl px-4 sm:px-6">
              <RowsSkeleton />
            </div>
          }
        >
          <RulebookExplorer languages={rulebookLanguages} />
        </Suspense>
      </section>

      <section className="border-t border-line bg-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <SectionHeading eyebrow="About this edition" title="How to read it, and how to trust it" />
          <ul className="mt-10 grid gap-5 md:grid-cols-3">
            {notes.map(({ icon: Icon, title, text, href, cta }, i) => (
              <Reveal as="li" key={title} delay={i * 90} className="flex flex-col rounded-2xl bg-surface p-6 ring-1 ring-line">
                <span className="grid size-11 place-items-center rounded-xl bg-royal/10 text-royal">
                  <Icon className="size-5" aria-hidden="true" />
                </span>
                <h3 className="mt-4 font-heading text-xl font-bold text-navy">{title}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-slate-500">{text}</p>
                {href ? (
                  <Link href={href} className="mt-auto inline-flex pt-5 text-sm font-bold text-royal underline-offset-4 hover:underline">
                    {cta}
                  </Link>
                ) : null}
              </Reveal>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
