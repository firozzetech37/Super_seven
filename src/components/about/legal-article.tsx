import { FileSignature } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { site } from "@/lib/site";

export type LegalSection = { id: string; heading: string; paragraphs?: string[]; bullets?: string[] };

/** Prose layout for Privacy, Terms and Disclaimer with a sticky contents list on desktop. */
export function LegalArticle({
  title,
  description,
  updated,
  sections,
}: {
  title: string;
  description: string;
  updated: string;
  sections: LegalSection[];
}) {
  return (
    <>
      <PageHeader
        eyebrow="Legal"
        title={title}
        description={description}
        crumbs={[{ label: title }]}
        aside={
          <div className="rounded-2xl bg-white/10 p-5 ring-1 ring-white/15 backdrop-blur">
            <p className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-gold">
              <FileSignature className="size-4" aria-hidden="true" />
              Draft for SSCFI review
            </p>
            <p className="mt-2 text-sm text-white/80">Last updated {updated}</p>
            <p className="text-sm text-white/60">Questions: {site.email}</p>
          </div>
        }
      />
      <div className="mx-auto grid max-w-7xl gap-12 px-4 py-14 sm:px-6 lg:grid-cols-[240px_1fr]">
        <nav aria-label="Contents" className="lg:sticky lg:top-24 lg:self-start">
          <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-royal">Contents</p>
          <ol className="mt-3 space-y-1.5 text-[15px]">
            {sections.map((s, i) => (
              <li key={s.id}>
                <a href={`#${s.id}`} className="flex gap-2 text-slate-600 transition-colors hover:text-navy">
                  <span className="w-5 shrink-0 font-bold text-gold-deep">{i + 1}.</span>
                  {s.heading}
                </a>
              </li>
            ))}
          </ol>
        </nav>
        <article className="max-w-3xl">
          {sections.map((s, i) => (
            <section key={s.id} id={s.id} className="scroll-mt-28 border-b border-line py-8 first:pt-0 last:border-b-0">
              <h2 className="font-heading text-2xl font-bold text-navy">
                <span className="mr-2 text-gold-deep">{i + 1}.</span>
                {s.heading}
              </h2>
              {s.paragraphs?.map((p) => (
                <p key={p} className="mt-4 text-[17px] leading-relaxed text-slate-600">
                  {p}
                </p>
              ))}
              {s.bullets?.length ? (
                <ul className="mt-4 space-y-2 text-[17px] leading-relaxed text-slate-600">
                  {s.bullets.map((b) => (
                    <li key={b} className="flex gap-3">
                      <span aria-hidden="true" className="mt-[11px] size-1.5 shrink-0 rounded-full bg-gold" />
                      {b}
                    </li>
                  ))}
                </ul>
              ) : null}
            </section>
          ))}
        </article>
      </div>
    </>
  );
}
