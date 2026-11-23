import { Suspense } from "react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight, ExternalLink, Megaphone, Newspaper, PenLine } from "lucide-react";
import { AdminForm } from "@/components/admin/admin-form";
import { ContentSetupNeeded } from "@/components/admin/content-bits";
import { Input, Select } from "@/components/admin/fields";
import { missingTables } from "@/components/admin/media-bits";
import { buttonBase, buttonTones } from "@/components/admin/styles";
import { dateOnly, Empty, PageTitle, Panel, PanelSkeleton, StatusPill } from "@/components/admin/ui";
import { requireAdmin } from "@/lib/admin/auth";
import { createNews } from "@/lib/admin/actions/content";
import { newsKinds } from "@/lib/admin/content-shared";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "News" };

type Row = {
  id: string;
  title: string;
  kind: string;
  summary: string;
  event_date: string | null;
  cover_src: string | null;
  featured: boolean;
  pending: boolean;
  archive: boolean;
  published: boolean;
};

const kindLabel = Object.fromEntries(newsKinds.map((k) => [k.value, k.label]));

async function Body({ searchParams }: { searchParams: PageProps<"/admin/news">["searchParams"] }) {
  const { db } = await requireAdmin();
  const query = await searchParams;
  const { data, error } = await db
    .from("news_posts")
    .select("id, title, kind, summary, event_date, cover_src, featured, pending, archive, published")
    .order("event_date", { ascending: false, nullsFirst: true })
    .order("created_at", { ascending: false })
    .returns<Row[]>();
  if (missingTables(error)) return <ContentSetupNeeded />;
  const stories = data ?? [];

  return (
    <div className="space-y-8">
      {query.deleted ? <p className="rounded-xl bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-700 ring-1 ring-emerald-200">Story deleted.</p> : null}

      <Panel title="Write a new story" description="Start with the headline. On the next screen you add the summary, the full text, a date and a cover photo, then publish." icon={PenLine}>
        <AdminForm action={createNews} submitLabel="Create and continue" pendingLabel="Creating…" tone="gold" className="@container">
          <div className="grid gap-4 @md:grid-cols-[minmax(0,1fr)_14rem]">
            <Input name="title" label="Headline" required placeholder="18th Youth National Championship: fixtures announced" />
            <Select name="kind" label="Type" options={newsKinds} defaultValue="news" />
          </div>
        </AdminForm>
      </Panel>

      <section className="space-y-4">
        <h2 className="font-heading text-xl font-bold text-navy">
          {stories.length} {stories.length === 1 ? "story" : "stories"} <span className="font-sans text-base font-normal text-slate-500">· newest first</span>
        </h2>
        {stories.length ? (
          <ul className="space-y-3">
            {stories.map((s) => (
              <li key={s.id}>
                <Link
                  href={`/admin/news/${s.id}`}
                  className="group flex items-center gap-4 rounded-2xl bg-white p-3 shadow-[0_6px_18px_rgba(15,46,99,0.05)] ring-1 ring-line transition hover:ring-royal/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-royal sm:p-4"
                >
                  <span className="relative grid aspect-[16/10] w-24 shrink-0 place-items-center overflow-hidden rounded-xl bg-stadium sm:w-32">
                    {s.cover_src ? <Image src={s.cover_src} alt="" fill sizes="128px" className="object-cover" /> : <Newspaper className="size-6 text-gold" aria-hidden="true" />}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex flex-wrap items-center gap-1.5">
                      {s.published ? <StatusPill status="approved" label="on the website" /> : <StatusPill status="pending" label="hidden" />}
                      <StatusPill status="scheduled" label={kindLabel[s.kind] ?? s.kind} />
                      {s.featured ? <StatusPill status="new" label="featured" /> : null}
                      {s.pending ? <StatusPill status="closed" label="details to follow" /> : null}
                      {s.archive ? <StatusPill status="closed" label="2014" /> : null}
                    </span>
                    <span className="mt-1.5 block font-bold leading-snug text-navy group-hover:text-royal">{s.title}</span>
                    <span className="mt-0.5 block truncate text-sm text-slate-500">
                      {s.event_date ? dateOnly(s.event_date) : "No date"}
                      {s.summary ? ` · ${s.summary}` : " · no summary yet"}
                    </span>
                  </span>
                  <ChevronRight className="size-5 shrink-0 text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-royal" aria-hidden="true" />
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <Empty icon={Megaphone} title="No stories yet">
            Write the first one above.
          </Empty>
        )}
      </section>
    </div>
  );
}

export default function NewsAdminPage({ searchParams }: PageProps<"/admin/news">) {
  return (
    <div className="space-y-8">
      <PageTitle
        eyebrow="Website"
        title="News & updates"
        description="Stories, announcements and newsletters on the News page. A story with a full text gets its own page."
        actions={
          <Link href="/news" target="_blank" className={cn(buttonBase, buttonTones.quiet)}>
            <ExternalLink className="size-4" aria-hidden="true" />
            News page
          </Link>
        }
      />
      <Suspense fallback={<PanelSkeleton />}>
        <Body searchParams={searchParams} />
      </Suspense>
    </div>
  );
}
