import { Suspense } from "react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ExternalLink, Newspaper, Trash2, Upload } from "lucide-react";
import { AdminForm } from "@/components/admin/admin-form";
import { Checkbox, Input } from "@/components/admin/fields";
import { MediaSetupNeeded, missingTables } from "@/components/admin/media-bits";
import { MediaUploader } from "@/components/admin/media-uploader";
import { buttonBase, buttonTones } from "@/components/admin/styles";
import { Disclosure, Empty, PageTitle, Panel, PanelSkeleton, StatusPill } from "@/components/admin/ui";
import { requireAdmin } from "@/lib/admin/auth";
import { deleteClipping, updateClipping } from "@/lib/admin/actions/media";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Press clippings" };

type Clip = { id: string; year: number; src: string; width: number; height: number; headline: string | null; source: string | null; published: boolean };

async function Body() {
  const { db } = await requireAdmin();
  const { data, error } = await db
    .from("press_clippings")
    .select("id, year, src, width, height, headline, source, published")
    .order("year", { ascending: false })
    .order("sort_order")
    .order("created_at")
    .returns<Clip[]>();
  if (missingTables(error)) return <MediaSetupNeeded />;
  const clips = data ?? [];
  const years = Array.from(new Set(clips.map((c) => c.year)));

  return (
    <div className="space-y-8">
      <Panel
        title="Add clippings"
        description="Fill in the year (and, if you know them, the paper, date and the headline in English), then choose the scan. Several scans from the same day can go together."
        icon={Upload}
      >
        <MediaUploader mode="press" defaultYear={new Date().getFullYear()} />
      </Panel>

      <section className="space-y-4">
        <h2 className="font-heading text-xl font-bold text-navy">
          {clips.length} clippings <span className="font-sans text-base font-normal text-slate-500">· newest year first</span>
        </h2>
        {clips.length ? (
          years.map((year) => {
            const inYear = clips.filter((c) => c.year === year);
            return (
              <Disclosure
                key={year}
                open={year === years[0]}
                summary={
                  <span className="flex items-center gap-3">
                    <span className="font-heading text-lg">{year}</span>
                    <span className="rounded-full bg-surface px-2 text-[12px] tabular-nums text-slate-500 ring-1 ring-line">{inYear.length}</span>
                  </span>
                }
              >
                <ul className="grid gap-4 md:grid-cols-2">
                  {inYear.map((c) => (
                    <li key={c.id} className="flex gap-4 rounded-2xl bg-surface/60 p-3 ring-1 ring-line">
                      <a href={c.src} target="_blank" rel="noopener noreferrer" className="relative h-36 w-28 shrink-0 overflow-hidden rounded-lg bg-white ring-1 ring-line" title="Open full size">
                        <Image src={c.src} alt="" fill sizes="112px" className="object-cover object-top" />
                      </a>
                      <div className="min-w-0 flex-1">
                        <div className="mb-2 flex items-center justify-between gap-2">
                          {c.published ? <StatusPill status="approved" label="shown" /> : <StatusPill status="pending" label="hidden" />}
                          <AdminForm action={deleteClipping.bind(null, c.id)} submitLabel={<Trash2 className="size-4" aria-label="Delete clipping" />} pendingLabel="…" tone="danger" small inline={false} />
                        </div>
                        <AdminForm action={updateClipping.bind(null, c.id)} submitLabel="Save" small tone="quiet" footerClassName="mt-3">
                          <div className="grid gap-2.5 sm:grid-cols-[5.5rem_minmax(0,1fr)]">
                            <Input name="year" label="Year" inputMode="numeric" defaultValue={c.year} />
                            <Input name="source" label="Paper & date" optional defaultValue={c.source ?? ""} />
                            <Input name="headline" label="Headline (English)" optional defaultValue={c.headline ?? ""} className="sm:col-span-2" />
                          </div>
                          <Checkbox name="published" label="Show on the website" defaultChecked={c.published} className="mt-2.5" />
                        </AdminForm>
                      </div>
                    </li>
                  ))}
                </ul>
              </Disclosure>
            );
          })
        ) : (
          <Empty icon={Newspaper} title="No clippings yet">
            Upload a newspaper scan above.
          </Empty>
        )}
      </section>
    </div>
  );
}

export default function PressAdminPage() {
  return (
    <div className="space-y-8">
      <PageTitle
        eyebrow="Media"
        title="Press clippings"
        description="Newspaper coverage for the press wall on the Gallery page. Visitors filter by year and open each scan at full size."
        actions={
          <Link href="/gallery#press" target="_blank" className={cn(buttonBase, buttonTones.quiet)}>
            <ExternalLink className="size-4" aria-hidden="true" />
            Press wall
          </Link>
        }
      />
      <Suspense fallback={<PanelSkeleton />}>
        <Body />
      </Suspense>
    </div>
  );
}
