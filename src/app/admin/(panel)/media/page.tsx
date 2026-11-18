import { Suspense } from "react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowDown, ArrowUp, ExternalLink, FolderPlus, Images, PlaySquare } from "lucide-react";
import { AdminForm } from "@/components/admin/admin-form";
import { Input } from "@/components/admin/fields";
import { AlbumForm, MediaSetupNeeded, missingTables, type AlbumRow } from "@/components/admin/media-bits";
import { buttonBase, buttonTones } from "@/components/admin/styles";
import { Empty, PageTitle, Panel, PanelSkeleton, StatusPill } from "@/components/admin/ui";
import { requireAdmin } from "@/lib/admin/auth";
import { moveAlbum, saveFeaturedVideo } from "@/lib/admin/actions/media";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Photo albums" };

type Row = AlbumRow & { photos: { src: string; sort_order: number }[] };

async function Body({ searchParams }: { searchParams: PageProps<"/admin/media">["searchParams"] }) {
  const { db } = await requireAdmin();
  const params = await searchParams;
  const [{ data: albums, error }, { data: settings }] = await Promise.all([
    db
      .from("albums")
      .select("id, slug, title, label, description, event_date, published, sort_order, photos(src, sort_order)")
      .order("sort_order")
      .order("event_date", { ascending: false, nullsFirst: false })
      .order("created_at", { ascending: false })
      .returns<Row[]>(),
    db.from("site_settings").select("key, value").in("key", ["featured_video", "featured_video_title"]),
  ]);
  if (missingTables(error)) return <MediaSetupNeeded />;

  const video = settings?.find((s) => s.key === "featured_video")?.value as string | undefined;
  const videoTitle = settings?.find((s) => s.key === "featured_video_title")?.value as string | undefined;
  const list = albums ?? [];

  return (
    <div className="space-y-8">
      {params.deleted ? <p className="rounded-xl bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-700 ring-1 ring-emerald-200">Album deleted.</p> : null}

      <section>
        <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
          <h2 className="font-heading text-xl font-bold text-navy">
            Albums <span className="font-sans text-base font-normal text-slate-500">· shown on the Gallery in this order</span>
          </h2>
          <Link href="/gallery" target="_blank" className={cn(buttonBase, buttonTones.quiet, "h-9 px-3 text-[13px]")}>
            <ExternalLink className="size-4" aria-hidden="true" />
            Open the Gallery
          </Link>
        </div>
        {list.length ? (
          <ul className="space-y-3">
            {list.map((a, i) => {
              const photos = [...a.photos].sort((x, y) => x.sort_order - y.sort_order);
              const cover = photos[0];
              return (
                <li key={a.id} className="flex flex-wrap items-center gap-4 rounded-2xl bg-white p-3 pr-4 shadow-[0_8px_24px_rgba(15,46,99,0.05)] ring-1 ring-line sm:flex-nowrap">
                  <Link href={`/admin/media/${a.id}`} className="group flex min-w-0 flex-1 items-center gap-4">
                    <span className="relative h-16 w-24 shrink-0 overflow-hidden rounded-xl bg-surface ring-1 ring-line">
                      {cover ? <Image src={cover.src} alt="" fill sizes="96px" className="object-cover" /> : <Images className="absolute inset-0 m-auto size-6 text-slate-300" aria-hidden="true" />}
                    </span>
                    <span className="min-w-0">
                      <span className="flex flex-wrap items-center gap-2">
                        <span className="font-heading text-lg font-bold leading-snug text-navy group-hover:text-royal">{a.title}</span>
                        {a.published ? null : <StatusPill status="pending" label="hidden" />}
                      </span>
                      <span className="block text-sm text-slate-500">
                        {a.label ? `${a.label} · ` : ""}
                        {photos.length} {photos.length === 1 ? "photo" : "photos"}
                      </span>
                    </span>
                  </Link>
                  <div className="flex items-center gap-1.5">
                    <AdminForm action={moveAlbum.bind(null, a.id, "up")} submitLabel={<ArrowUp className="size-4" aria-label="Move up" />} pendingLabel="…" tone="quiet" small inline={false} footerClassName={i === 0 ? "invisible" : ""} />
                    <AdminForm
                      action={moveAlbum.bind(null, a.id, "down")}
                      submitLabel={<ArrowDown className="size-4" aria-label="Move down" />}
                      pendingLabel="…"
                      tone="quiet"
                      small
                      inline={false}
                      footerClassName={i === list.length - 1 ? "invisible" : ""}
                    />
                    <Link href={`/admin/media/${a.id}`} className={cn(buttonBase, buttonTones.primary, "h-9 px-3 text-[13px]")}>
                      Manage
                    </Link>
                  </div>
                </li>
              );
            })}
          </ul>
        ) : (
          <Empty icon={Images} title="No albums yet">
            Create one below, then upload its photos.
          </Empty>
        )}
      </section>

      <Panel id="new" title="New album" description="It stays hidden from the website until you add photos and press Publish." icon={FolderPlus}>
        <AlbumForm />
      </Panel>

      <Panel
        title="Featured video"
        description="Shown large in the Videos section of the Gallery. Paste any YouTube link; leave it empty to remove the video."
        icon={PlaySquare}
        actions={
          video ? (
            <a href={`https://www.youtube.com/watch?v=${video}`} target="_blank" rel="noopener noreferrer" className={cn(buttonBase, buttonTones.quiet, "h-9 px-3 text-[13px]")}>
              <ExternalLink className="size-4" aria-hidden="true" />
              Current video
            </a>
          ) : null
        }
      >
        <AdminForm action={saveFeaturedVideo} submitLabel="Save video" className="@container">
          <div className="grid gap-4 @md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
            <Input name="url" label="YouTube link" optional defaultValue={video ? `https://youtu.be/${video}` : ""} placeholder="https://youtu.be/…" />
            <Input name="title" label="Title" optional defaultValue={videoTitle ?? ""} placeholder="Final highlights, Youth National 2026" />
          </div>
        </AdminForm>
      </Panel>
    </div>
  );
}

export default function MediaAdminPage({ searchParams }: PageProps<"/admin/media">) {
  return (
    <div className="space-y-8">
      <PageTitle
        eyebrow="Media"
        title="Photo albums"
        description="Create an album for each event, upload its photos and publish it. Everything appears on the website's Gallery page within seconds."
        actions={
          <Link href="/admin/media/press" className={cn(buttonBase, buttonTones.quiet)}>
            Press clippings →
          </Link>
        }
      />
      <Suspense fallback={<PanelSkeleton />}>
        <Body searchParams={searchParams} />
      </Suspense>
    </div>
  );
}
