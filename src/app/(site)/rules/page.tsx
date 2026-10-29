import type { Metadata } from "next";
import { ExternalLink, FileText } from "lucide-react";
import { JumpLinks } from "@/components/fixtures/jump-links";
import { PageHeader } from "@/components/layout/page-header";
import { SectionHeading } from "@/components/layout/section-heading";
import { RuleBook } from "@/components/rules/rule-book";
import { glossary, quickFacts, ruleSections, rulesPdf } from "@/lib/data/rules";

export const metadata: Metadata = {
  title: "Rules",
  description: "The Super Seven rule book: seven players, seven overs, six balls an over, a match inside two hours. With a glossary.",
};

const jump = [
  { label: "Rule book", href: "#english" },
  { label: "বাংলা", href: "#bengali" },
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
            description="Transcribed from the SSCFI highlights sheet. The full rule book in English and Bengali follows the same seven sections."
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

      <section id="bengali" className="scroll-mt-28 border-t border-line bg-surface py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid gap-6 rounded-3xl bg-white p-8 ring-1 ring-line md:grid-cols-[1fr_auto] md:items-center">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-royal">Bengali rule book</p>
              <h2 className="font-bengali mt-2 text-2xl font-bold text-navy">নিয়মাবলী: বাংলা সংস্করণ</h2>
              <p className="mt-2 max-w-2xl text-slate-600">
                The official Bengali translation is pending from SSCFI and will be published here, section for section,
                once approved. Switch the rule book above to বাংলা to see the same notice in place.
              </p>
            </div>
            <a
              href="mailto:coo@sscfi.org?subject=Bengali%20rule%20book"
              className="inline-flex items-center justify-center rounded-full bg-navy px-6 py-3 font-bold text-white transition hover:bg-royal"
            >
              Ask about the translation
            </a>
          </div>
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
