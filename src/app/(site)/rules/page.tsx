import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Download, ExternalLink, FileText } from "lucide-react";
import { JumpLinks } from "@/components/fixtures/jump-links";
import { PageHeader } from "@/components/layout/page-header";
import { SectionHeading } from "@/components/layout/section-heading";
import { Reveal } from "@/components/motion/reveal";
import { RuleBook } from "@/components/rules/rule-book";
import { rulebookLanguages, rulebookPdf, scriptClass } from "@/lib/data/rulebook";
import { glossary, quickFacts, ruleSections, rulesPdf } from "@/lib/data/rules";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Rules",
  description: "The Super Seven rule book: seven players, seven overs, six balls an over, a match inside two hours. With a glossary.",
};

const jump = [
  { label: "Rule book", href: "#english" },
  { label: "16 languages", href: "#languages" },
  { label: "Glossary", href: "#glossary" },
];

export default function RulesPage() {
  return (
    <>
      <PageHeader
        eyebrow="Door 3 of 7"
        title="Rules of Super Seven cricket"
        description="Seven players a side, seven overs an innings, a result inside two hours. The official highlights, section by section."
        crumbs={[{ label: "Rules" }]}
        aside={<JumpLinks links={jump} />}
      />

      <section className="bg-white py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <dl className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {quickFacts.map((f) => (
              <div key={f.label} className="rounded-2xl bg-[linear-gradient(150deg,#1c4fa0,#0f2e63)] p-5 text-white ring-1 ring-white/10">
                <dd className="font-heading text-4xl font-bold text-gold">{f.value}</dd>
                <dt className="mt-1 text-[11px] font-bold uppercase tracking-[0.18em] text-white/70">{f.label}</dt>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section id="english" className="scroll-mt-28 bg-white pb-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <SectionHeading
            eyebrow="Rule book"
            title="How the game is played"
            description="Transcribed from the SSCFI highlights sheet. The full forty-rule book, in sixteen languages, is below."
            action={
              <a
                href={rulesPdf}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-surface px-5 py-2.5 font-bold text-navy ring-1 ring-line transition hover:ring-royal"
              >
                <FileText className="size-4 text-gold-deep" aria-hidden="true" />
                Original PDF
                <ExternalLink className="size-3.5 text-slate-400" aria-hidden="true" />
              </a>
            }
          />
          <div className="mt-8 max-w-4xl">
            <RuleBook sections={ruleSections} />
          </div>
        </div>
      </section>

      <section id="languages" className="relative isolate scroll-mt-28 overflow-hidden border-t border-line bg-navy-hero py-14 text-white lg:py-16">
        <span id="bengali" className="absolute -top-28" aria-hidden="true" />
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-[radial-gradient(55%_70%_at_25%_40%,rgba(44,103,196,0.5),transparent_70%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(120%_90%_at_50%_120%,rgba(5,16,45,0.8),transparent_60%)]" />
        </div>
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-[1fr_360px]">
          <Reveal>
            <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-gold">Multilingual rulebook</p>
            <h2 className="mt-2 font-heading text-3xl font-bold sm:text-4xl">The full rulebook in 16 Indian languages</h2>
            <p className="mt-3 max-w-2xl text-white/80">
              Forty rules, from Teams to Protest, translated from the English Pocket Rulebook into Sanskrit, Hindi, Bengali, Marathi, Gujarati,
              Kannada, Tamil, Telugu, Malayalam, Odia, Urdu, Punjabi, Nepali, Mizo, Khasi and Manipuri. Read any rule online, in any language,
              or download the book.
            </p>
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
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/rules/rulebook" className="group inline-flex items-center gap-2 rounded-full bg-gold px-6 py-3 font-bold text-navy transition hover:bg-gold-deep">
                Open the rulebook
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
              </Link>
              <a href={rulebookPdf} download className="inline-flex items-center gap-2 rounded-full px-6 py-3 font-bold text-white ring-2 ring-white/50 transition hover:bg-white/10">
                <Download className="size-4" aria-hidden="true" />
                Download PDF
              </a>
            </div>
          </Reveal>
          <Reveal delay={150} className="hidden lg:block">
            <div aria-hidden="true" className="relative mx-auto h-[320px] w-[340px]">
              {["bengali", "hindi", "tamil"].map((slug, i) => {
                const l = rulebookLanguages.find((x) => x.slug === slug)!;
                return (
                  <Image
                    key={slug}
                    src={l.thumb}
                    alt=""
                    width={720}
                    height={932}
                    sizes="200px"
                    className={cn(
                      "absolute left-1/2 top-1/2 w-[190px] -translate-x-1/2 -translate-y-1/2 rounded-lg shadow-[0_24px_60px_rgba(4,15,42,0.5)] ring-1 ring-white/20",
                      i === 0 && "-translate-x-[82%] -rotate-[12deg] motion-safe:animate-float-slow",
                      i === 1 && "z-10 motion-safe:animate-float",
                      i === 2 && "-translate-x-[18%] rotate-[12deg] motion-safe:animate-float-slow",
                    )}
                  />
                );
              })}
            </div>
          </Reveal>
        </div>
      </section>

      <section id="glossary" className="scroll-mt-28 bg-white py-14 lg:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <SectionHeading eyebrow="Glossary" title="Terms used on this site" />
          <dl className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {glossary.map((g) => (
              <div key={g.term} className="rounded-2xl bg-surface p-5 ring-1 ring-line">
                <dt className="font-heading text-lg font-bold text-navy">{g.term}</dt>
                <dd className="mt-1.5 text-[15px] leading-relaxed text-slate-600">{g.definition}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>
    </>
  );
}
