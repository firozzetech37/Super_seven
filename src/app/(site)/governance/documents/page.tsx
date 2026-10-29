import type { Metadata } from "next";
import { ExternalLink, FileText } from "lucide-react";
import { NoticeCard } from "@/components/about/notice-card";
import { PageHeader } from "@/components/layout/page-header";
import { SectionHeading } from "@/components/layout/section-heading";
import { documentCategories, documents, legacyDocumentBase, type DocCategory } from "@/lib/data/documents";
import { Reveal } from "@/components/motion/reveal";

export const metadata: Metadata = {
  title: "Documents",
  description: "Rule books, forms, results and official documents.",
};

const order: DocCategory[] = ["rules", "forms", "officials", "fixtures", "results"];
const sorted = [...documents].sort((a, b) => order.indexOf(a.category) - order.indexOf(b.category));

export default function DocumentsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Governance"
        title="Documents"
        description="Rule books, forms, fixtures, results and official lists, as PDFs."
        crumbs={[{ label: "Governance" }, { label: "Documents" }]}
        aside={
          <div className="rounded-2xl bg-white/10 px-5 py-4 ring-1 ring-white/15 backdrop-blur">
            <p className="font-heading text-3xl font-bold">{documents.length}</p>
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-gold">Documents</p>
          </div>
        }
      />

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <NoticeCard title="2014 documents open from the old site">
          The multilingual rulebook is hosted here and also published as a page in sixteen languages. The 2014 PDFs still open from
          the old sscfi.org in a new tab until they are migrated.
        </NoticeCard>

        <div className="mt-14">
          <SectionHeading
            eyebrow="Document library"
            title="All documents"
            description="Grouped by type: rules, forms, officials, then the 2014 fixture and results."
            action={
              <ul className="flex flex-wrap gap-2">
                {order.map((c) => (
                  <li key={c} className="rounded-full bg-surface px-3 py-1 text-xs font-bold text-navy ring-1 ring-line">
                    {documentCategories[c]} · {documents.filter((d) => d.category === c).length}
                  </li>
                ))}
              </ul>
            }
          />
        </div>
        <Reveal stagger as="ul" className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {sorted.map((d) => (
            <li key={d.id}>
              <a
                href={d.href ?? `${legacyDocumentBase}${d.file}`}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex h-full flex-col rounded-2xl bg-white p-6 ring-1 ring-line transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_18px_40px_rgba(15,46,99,0.12)] hover:ring-royal/40"
              >
                <div className="flex items-start justify-between gap-3">
                  <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-ball/10 text-ball">
                    <FileText className="size-5" aria-hidden="true" />
                  </span>
                  <span className="rounded-full bg-royal/10 px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.14em] text-royal">
                    {documentCategories[d.category]}
                  </span>
                </div>
                <h3 className="mt-4 font-heading text-lg font-bold leading-snug text-navy transition-colors group-hover:text-royal">{d.title}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-slate-500">{d.description}</p>
                <p className="mt-auto flex flex-wrap items-center gap-2 pt-5 text-[11px] font-bold uppercase tracking-[0.14em] text-slate-500">
                  <span className="rounded-full bg-surface px-2.5 py-1 ring-1 ring-line">PDF</span>
                  <span className="rounded-full bg-surface px-2.5 py-1 ring-1 ring-line">{d.year}</span>
                  <span className="rounded-full bg-surface px-2.5 py-1 ring-1 ring-line">
                    {d.pages} {d.pages === 1 ? "page" : "pages"}
                  </span>
                  <ExternalLink className="ml-auto size-4 text-slate-300 transition group-hover:text-royal" aria-hidden="true" />
                </p>
                <span className="sr-only">(opens in a new tab)</span>
              </a>
            </li>
          ))}
        </Reveal>
      </section>
    </>
  );
}
