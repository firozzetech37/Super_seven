import type { Metadata } from "next";
import { BookOpen, CalendarDays, ClipboardList, Trophy, Users, type LucideIcon } from "lucide-react";
import { DocumentCard, FeaturedDocument } from "@/components/about/document-card";
import { NoticeCard } from "@/components/about/notice-card";
import { PageHeader } from "@/components/layout/page-header";
import { SectionHeading } from "@/components/layout/section-heading";
import { CountUp } from "@/components/motion/count-up";
import { Reveal } from "@/components/motion/reveal";
import { documentCategories, documents, type DocCategory } from "@/lib/data/documents";

export const metadata: Metadata = {
  title: "Documents",
  description: "Rule books, forms, results and official documents.",
};

const order: DocCategory[] = ["rules", "forms", "officials", "fixtures", "results"];
const icons: Record<DocCategory, LucideIcon> = { rules: BookOpen, forms: ClipboardList, officials: Users, fixtures: CalendarDays, results: Trophy };
const groups = order.map((c) => ({ id: c, docs: documents.filter((d) => d.category === c) })).filter((g) => g.docs.length);

/** Documents hosted on this site get the wide navy card; the multilingual rulebook also reads online. */
const readOnline: Record<string, string> = { "rulebook-multilingual": "/rules/rulebook" };

export default function DocumentsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Governance"
        title="Documents"
        description="Rule books, forms, fixtures, results and official lists, as PDFs."
        crumbs={[{ label: "Governance" }, { label: "Documents" }]}
        aside={
          <div className="flex items-center gap-4 rounded-3xl bg-white/10 p-4 pr-6 ring-1 ring-white/15 backdrop-blur">
            <span className="grid size-16 place-items-center rounded-2xl bg-gold font-heading text-3xl font-bold text-navy shadow-[0_10px_24px_rgba(4,15,42,0.35)]">
              <CountUp value={documents.length} />
            </span>
            <span>
              <span className="block text-[11px] font-bold uppercase tracking-[0.18em] text-gold">Documents</span>
              <span className="mt-0.5 block font-heading text-lg font-bold leading-tight">In {groups.length} categories</span>
            </span>
          </div>
        }
      />

      {/* Category jump bar */}
      <nav aria-label="Document categories" className="border-b border-line bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 sm:px-6">
          <span className="hidden shrink-0 text-[11px] font-bold uppercase tracking-[0.24em] text-slate-400 lg:inline">Jump to</span>
          <ul className="no-scrollbar -mx-4 flex flex-1 gap-2 overflow-x-auto px-4 py-3 sm:mx-0 sm:px-0">
            {groups.map(({ id, docs }) => {
              const Icon = icons[id];
              return (
                <li key={id} className="shrink-0">
                  <a
                    href={`#docs-${id}`}
                    className="group inline-flex items-center gap-2 rounded-full py-1.5 pl-2 pr-4 text-sm font-bold text-slate-600 ring-1 ring-line transition duration-300 hover:-translate-y-0.5 hover:bg-navy hover:text-white hover:ring-navy focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-gold/60"
                  >
                    <span className="grid size-7 place-items-center rounded-full bg-royal/10 text-royal transition-colors group-hover:bg-gold group-hover:text-navy">
                      <Icon className="size-3.5" aria-hidden="true" />
                    </span>
                    {documentCategories[id]}
                    <span className="rounded-full bg-surface px-1.5 text-xs text-slate-500 transition-colors group-hover:bg-white/15 group-hover:text-white">{docs.length}</span>
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      </nav>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:py-16">
        <NoticeCard title="2014 documents open from the old site">
          The multilingual rulebook is hosted here and also published as a page in sixteen languages. The 2014 PDFs still open from the old
          sscfi.org in a new tab until they are migrated.
        </NoticeCard>

        <div className="mt-14">
          <SectionHeading eyebrow="Document library" title="All documents" description="Grouped by type: rules, forms, officials, then the 2014 fixture and results." />
        </div>

        <div className="mt-6 space-y-14">
          {groups.map(({ id, docs }) => {
            const Icon = icons[id];
            const featured = docs.filter((d) => d.href);
            const rest = docs.filter((d) => !d.href);
            return (
              <section key={id} id={`docs-${id}`} aria-labelledby={`docs-${id}-title`} className="scroll-mt-28 pt-8">
                <Reveal className="flex items-center gap-4">
                  <span className="grid size-11 place-items-center rounded-2xl bg-navy text-gold shadow-[0_10px_22px_rgba(15,46,99,0.25)]">
                    <Icon className="size-5" aria-hidden="true" />
                  </span>
                  <h3 id={`docs-${id}-title`} className="font-heading text-2xl font-bold text-navy">
                    {documentCategories[id]}
                  </h3>
                  <span className="rounded-full bg-surface px-2.5 py-0.5 text-xs font-bold text-slate-500 ring-1 ring-line">
                    {docs.length} {docs.length === 1 ? "file" : "files"}
                  </span>
                  <span aria-hidden="true" className="h-px flex-1 bg-[linear-gradient(90deg,#e2e5ef,transparent)]" />
                </Reveal>
                <Reveal stagger={90} as="ul" className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {featured.map((d) => (
                    <li key={d.id} className="sm:col-span-2">
                      <FeaturedDocument doc={d} readHref={readOnline[d.id]} />
                    </li>
                  ))}
                  {rest.map((d) => (
                    <li key={d.id}>
                      <DocumentCard doc={d} />
                    </li>
                  ))}
                </Reveal>
              </section>
            );
          })}
        </div>
      </section>
    </>
  );
}
