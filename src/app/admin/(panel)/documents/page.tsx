import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { ExternalLink, FileText, FileUp } from "lucide-react";
import { AdminForm } from "@/components/admin/admin-form";
import { ContentSetupNeeded, DeleteConfirm, MoveButtons } from "@/components/admin/content-bits";
import { DocumentUploader, ReplacePdf } from "@/components/admin/document-uploader";
import { Checkbox, Input, Select, Textarea } from "@/components/admin/fields";
import { missingTables } from "@/components/admin/media-bits";
import { buttonBase, buttonTones } from "@/components/admin/styles";
import { Disclosure, Empty, PageTitle, Panel, PanelSkeleton, StatusPill } from "@/components/admin/ui";
import { requireAdmin } from "@/lib/admin/auth";
import { deleteDocument, moveDocument, saveDocument } from "@/lib/admin/actions/documents";
import { documentCategoryOptions } from "@/lib/admin/content-shared";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Documents" };

type Doc = {
  id: string;
  title: string;
  description: string;
  category: string;
  year: number | null;
  edition: string | null;
  pages: number | null;
  file_src: string;
  file_path: string | null;
  file_size: number | null;
  featured: boolean;
  read_href: string | null;
  published: boolean;
};

const size = (bytes: number | null) => (bytes ? `${(bytes / 1024 / 1024).toFixed(1)} MB` : null);

function DocRow({ d, index, count }: { d: Doc; index: number; count: number }) {
  return (
    <li className="flex items-start gap-2">
      <Disclosure
        className="min-w-0 flex-1"
        summary={
          <span className="flex min-w-0 items-center gap-3">
            <span className="grid h-10 w-8 shrink-0 place-items-end rounded-md bg-white pb-1 ring-1 ring-line">
              <span className="mx-auto rounded-sm bg-ball px-1 text-[8px] font-black leading-3 tracking-wider text-white">PDF</span>
            </span>
            <span className="min-w-0">
              <span className="block truncate">{d.title}</span>
              <span className="flex flex-wrap items-center gap-1.5 text-xs font-normal text-slate-500">
                {[d.year ?? d.edition, d.pages ? `${d.pages} ${d.pages === 1 ? "page" : "pages"}` : null, size(d.file_size), d.file_path ? null : "file shipped with the website"]
                  .filter(Boolean)
                  .join(" · ")}
              </span>
            </span>
            <span className="ml-auto flex shrink-0 gap-1">
              {d.featured ? <StatusPill status="new" label="featured" /> : null}
              {d.published ? null : <StatusPill status="pending" label="hidden" />}
            </span>
          </span>
        }
      >
        <div className="mb-5 flex flex-wrap items-center gap-2">
          <a href={d.file_src} target="_blank" rel="noopener noreferrer" className={cn(buttonBase, buttonTones.quiet, "h-9 px-3 text-[13px]")}>
            <ExternalLink className="size-4" aria-hidden="true" />
            Open PDF
          </a>
          <ReplacePdf id={d.id} />
        </div>
        <AdminForm action={saveDocument.bind(null, d.id)} submitLabel="Save" className="@container">
          <div className="grid gap-4 @md:grid-cols-2 @3xl:grid-cols-4">
            <Input name="title" label="Title" required defaultValue={d.title} className="@md:col-span-2" />
            <Select name="category" label="Category" options={documentCategoryOptions} defaultValue={d.category} />
            <Input name="year" label="Year" optional inputMode="numeric" maxLength={4} defaultValue={d.year ?? ""} />
            <Input name="edition" label="Edition" optional defaultValue={d.edition ?? ""} hint="Shown when there's no year" />
            <Input name="pages" label="Pages" optional inputMode="numeric" defaultValue={d.pages ?? ""} />
            <Input name="read_href" label="“Read online” link" optional defaultValue={d.read_href ?? ""} placeholder="/rules/rulebook" hint="Featured cards only" className="@md:col-span-2" />
            <Textarea name="description" label="Short description" optional rows={2} defaultValue={d.description} className="@md:col-span-2 @3xl:col-span-4" />
          </div>
          <div className="mt-4 grid gap-3 @md:grid-cols-2">
            <Checkbox name="published" label="Show on the website" defaultChecked={d.published} />
            <Checkbox name="featured" label="Featured" hint="A wide navy card at the top of its category" defaultChecked={d.featured} />
          </div>
        </AdminForm>
        <div className="mt-5 border-t border-line pt-5">
          <DeleteConfirm
            action={deleteDocument.bind(null, d.id)}
            label="Yes, remove this document from the website"
            hint={d.file_path ? "The uploaded PDF is deleted too. This can't be undone." : "The card disappears from the Documents page. This can't be undone."}
          />
        </div>
      </Disclosure>
      <span className="pt-1.5">
        <MoveButtons up={moveDocument.bind(null, d.id, "up")} down={moveDocument.bind(null, d.id, "down")} first={index === 0} last={index === count - 1} />
      </span>
    </li>
  );
}

async function Body() {
  const { db } = await requireAdmin();
  const { data, error } = await db
    .from("documents")
    .select("id, title, description, category, year, edition, pages, file_src, file_path, file_size, featured, read_href, published")
    .order("sort_order")
    .order("created_at")
    .returns<Doc[]>();
  if (missingTables(error)) return <ContentSetupNeeded />;
  const docs = data ?? [];

  return (
    <div className="space-y-8">
      <Panel title="Upload a document" description="Choose the PDF, give it a title and a category, then press Upload document." icon={FileUp}>
        <DocumentUploader />
      </Panel>

      <section className="space-y-6">
        <h2 className="font-heading text-xl font-bold text-navy">
          {docs.length} {docs.length === 1 ? "document" : "documents"} <span className="font-sans text-base font-normal text-slate-500">· in the order shown on the website</span>
        </h2>
        {docs.length ? (
          documentCategoryOptions.map((c) => {
            const inCategory = docs.filter((d) => d.category === c.value);
            if (!inCategory.length) return null;
            return (
              <Panel key={c.value} title={c.label} icon={FileText}>
                <ul className="space-y-2">
                  {inCategory.map((d, i) => (
                    <DocRow key={d.id} d={d} index={i} count={inCategory.length} />
                  ))}
                </ul>
              </Panel>
            );
          })
        ) : (
          <Empty icon={FileText} title="No documents yet">
            Upload the first PDF above.
          </Empty>
        )}
      </section>
    </div>
  );
}

export default function DocumentsAdminPage() {
  return (
    <div className="space-y-8">
      <PageTitle
        eyebrow="Website"
        title="Documents"
        description="Rulebooks, forms, results and official lists on the Documents page, as PDFs."
        actions={
          <Link href="/governance/documents" target="_blank" className={cn(buttonBase, buttonTones.quiet)}>
            <ExternalLink className="size-4" aria-hidden="true" />
            Documents page
          </Link>
        }
      />
      <Suspense fallback={<PanelSkeleton />}>
        <Body />
      </Suspense>
    </div>
  );
}
