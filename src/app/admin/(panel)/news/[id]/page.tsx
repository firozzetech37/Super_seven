import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Eye, EyeOff, ImageIcon, PenLine, TriangleAlert } from "lucide-react";
import { AdminForm } from "@/components/admin/admin-form";
import { ContentSetupNeeded, DeleteConfirm } from "@/components/admin/content-bits";
import { Checkbox, Input, Select, Textarea } from "@/components/admin/fields";
import { ImageUpload } from "@/components/admin/image-upload";
import { missingTables } from "@/components/admin/media-bits";
import { buttonBase, buttonTones } from "@/components/admin/styles";
import { PageTitle, Panel, PanelSkeleton, StatusPill } from "@/components/admin/ui";
import { requireAdmin } from "@/lib/admin/auth";
import { deleteNews, saveNews, setNewsPublished } from "@/lib/admin/actions/content";
import { newsKinds } from "@/lib/admin/content-shared";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Story" };

type Story = {
  id: string;
  slug: string;
  kind: string;
  title: string;
  summary: string;
  body: string | null;
  event_date: string | null;
  link: string | null;
  cover_src: string | null;
  cover_alt: string | null;
  featured: boolean;
  archive: boolean;
  pending: boolean;
  published: boolean;
};

async function Body({ params, searchParams }: { params: PageProps<"/admin/news/[id]">["params"]; searchParams: PageProps<"/admin/news/[id]">["searchParams"] }) {
  const { db } = await requireAdmin();
  const { id } = await params;
  const query = await searchParams;
  if (!/^[0-9a-f-]{36}$/i.test(id)) notFound();
  const { data: s, error } = await db
    .from("news_posts")
    .select("id, slug, kind, title, summary, body, event_date, link, cover_src, cover_alt, featured, archive, pending, published")
    .eq("id", id)
    .maybeSingle<Story>();
  if (missingTables(error)) return <ContentSetupNeeded />;
  if (!s) notFound();

  return (
    <div className="space-y-8">
      <PageTitle
        back={{ href: "/admin/news", label: "All stories" }}
        eyebrow={newsKinds.find((k) => k.value === s.kind)?.label ?? "Story"}
        title={s.title}
        description={
          <span className="flex flex-wrap items-center gap-2">
            {s.published ? <StatusPill status="approved" label="on the website" /> : <StatusPill status="pending" label="hidden" />}
            {s.featured ? <StatusPill status="new" label="featured" /> : null}
          </span>
        }
        actions={
          <>
            {s.published ? (
              <Link href={s.body ? `/news/${s.slug}` : "/news"} target="_blank" className={cn(buttonBase, buttonTones.quiet)}>
                <Eye className="size-4" aria-hidden="true" />
                View on the website
              </Link>
            ) : null}
            <AdminForm
              action={setNewsPublished.bind(null, s.id, !s.published)}
              submitLabel={
                s.published ? (
                  <>
                    <EyeOff className="size-4" aria-hidden="true" />
                    Hide from website
                  </>
                ) : (
                  <>
                    <Eye className="size-4" aria-hidden="true" />
                    Publish story
                  </>
                )
              }
              pendingLabel="Saving…"
              tone={s.published ? "quiet" : "gold"}
              inline={false}
            />
          </>
        }
      />

      {query.created ? (
        <p className="rounded-xl bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-700 ring-1 ring-emerald-200">
          Story created. Write the summary (and the full text if there is one), press Save story, add a cover photo, then press Publish story.
        </p>
      ) : null}

      <Panel title="Story" icon={PenLine}>
        <AdminForm action={saveNews.bind(null, s.id)} submitLabel="Save story" className="@container">
          <div className="grid gap-4 @md:grid-cols-2 @3xl:grid-cols-4">
            <Input name="title" label="Headline" required defaultValue={s.title} className="@md:col-span-2" />
            <Select name="kind" label="Type" options={newsKinds} defaultValue={s.kind} />
            <Input name="event_date" label="Date" type="date" optional defaultValue={s.event_date ?? ""} hint="Leave empty if not confirmed yet" />
            <Textarea
              name="summary"
              label="Summary"
              required
              rows={3}
              maxLength={400}
              defaultValue={s.summary}
              placeholder="One or two sentences: shown on the News page card."
              className="@md:col-span-2 @3xl:col-span-4"
            />
            <Textarea
              name="body"
              label="Full story"
              optional
              rows={12}
              defaultValue={s.body ?? ""}
              placeholder="The whole story. Leave a blank line between paragraphs."
              hint="When there's a full story, the card opens its own page. Leave empty if the summary says it all."
              className="@md:col-span-2 @3xl:col-span-4"
            />
            <Input
              name="link"
              label="Link"
              optional
              defaultValue={s.link ?? ""}
              placeholder="https://… or /fixtures"
              hint="A “Read more” button, e.g. to results or a newspaper article"
              className="@md:col-span-2"
            />
            <Input name="cover_alt" label="Cover photo description" optional defaultValue={s.cover_alt ?? ""} placeholder="What the cover photo shows" className="@md:col-span-2" />
          </div>
          <div className="mt-5 grid gap-3 @md:grid-cols-3">
            <Checkbox name="featured" label="Featured" hint="Shown large at the top of the News page" defaultChecked={s.featured} />
            <Checkbox name="pending" label="Details to follow" hint="Adds a “Details to be added” tag" defaultChecked={s.pending} />
            <Checkbox name="archive" label="From the 2014 site" hint="Adds an “Archive” tag" defaultChecked={s.archive} />
          </div>
        </AdminForm>
      </Panel>

      <Panel title="Cover photo" description="Optional. A wide photo works best; it's resized automatically." icon={ImageIcon}>
        <ImageUpload kind="news" id={s.id} src={s.cover_src} shape="wide" />
      </Panel>

      <Panel title="Delete story" icon={TriangleAlert} className="ring-ball/25">
        <DeleteConfirm action={deleteNews.bind(null, s.id)} label="Yes, delete this story" hint="It disappears from the News page. An uploaded cover photo is deleted too. This can't be undone." />
      </Panel>
    </div>
  );
}

export default function NewsStoryAdminPage({ params, searchParams }: PageProps<"/admin/news/[id]">) {
  return (
    <Suspense fallback={<PanelSkeleton rows={6} />}>
      <Body params={params} searchParams={searchParams} />
    </Suspense>
  );
}
