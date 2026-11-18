import { Suspense } from "react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Eye, EyeOff, ImagePlus, Images, Settings2, Star, Trash2, TriangleAlert } from "lucide-react";
import { AdminForm } from "@/components/admin/admin-form";
import { Input } from "@/components/admin/fields";
import { AlbumForm, DeleteAlbumForm, MediaSetupNeeded, missingTables, type AlbumRow } from "@/components/admin/media-bits";
import { MediaUploader } from "@/components/admin/media-uploader";
import { buttonBase, buttonTones } from "@/components/admin/styles";
import { Empty, PageTitle, Panel, PanelSkeleton, StatusPill } from "@/components/admin/ui";
import { requireAdmin } from "@/lib/admin/auth";
import { deletePhoto, movePhoto, setAlbumPublished, updatePhoto } from "@/lib/admin/actions/media";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Album" };

type PhotoRow = { id: string; src: string; alt: string; width: number; height: number; storage_path: string | null };

function PhotoCard({ p, index, count }: { p: PhotoRow; index: number; count: number }) {
  return (
    <li className="flex flex-col overflow-hidden rounded-2xl bg-white shadow-[0_8px_22px_rgba(15,46,99,0.06)] ring-1 ring-line">
      <div className="relative aspect-[4/3] bg-surface">
        <Image src={p.src} alt={p.alt} fill sizes="(min-width: 1280px) 260px, (min-width: 640px) 45vw, 92vw" className="object-cover" />
        <span className="absolute left-2 top-2 rounded-full bg-navy-deep/70 px-2 py-0.5 font-mono text-[11px] font-bold text-white backdrop-blur">{String(index + 1).padStart(2, "0")}</span>
        {index === 0 ? (
          <span className="absolute right-2 top-2 inline-flex items-center gap-1 rounded-full bg-gold px-2 py-0.5 text-[11px] font-bold text-navy shadow">
            <Star className="size-3 fill-current" aria-hidden="true" />
            Cover
          </span>
        ) : null}
      </div>
      <div className="flex flex-1 flex-col gap-3 p-3">
        <AdminForm action={updatePhoto.bind(null, p.id)} submitLabel="Save caption" small tone="quiet" inline={false} footerClassName="mt-2">
          <Input name="alt" label="Caption" defaultValue={p.alt} maxLength={200} />
        </AdminForm>
        <div className="mt-auto flex flex-wrap items-center gap-1.5 border-t border-line pt-3">
          {index > 0 ? (
            <AdminForm action={movePhoto.bind(null, p.id, "first")} submitLabel={<><Star className="size-3.5" aria-hidden="true" />Cover</>} pendingLabel="…" tone="quiet" small inline={false} />
          ) : null}
          <AdminForm
            action={movePhoto.bind(null, p.id, "up")}
            submitLabel={<ArrowLeft className="size-4" aria-label="Move earlier" />}
            pendingLabel="…"
            tone="quiet"
            small
            inline={false}
            footerClassName={index === 0 ? "hidden" : ""}
          />
          <AdminForm
            action={movePhoto.bind(null, p.id, "down")}
            submitLabel={<ArrowRight className="size-4" aria-label="Move later" />}
            pendingLabel="…"
            tone="quiet"
            small
            inline={false}
            footerClassName={index === count - 1 ? "hidden" : ""}
          />
          <span className="ml-auto">
            <AdminForm action={deletePhoto.bind(null, p.id)} submitLabel={<Trash2 className="size-4" aria-label="Delete photo" />} pendingLabel="…" tone="danger" small inline={false} />
          </span>
        </div>
      </div>
    </li>
  );
}

async function Body({ params, searchParams }: { params: PageProps<"/admin/media/[id]">["params"]; searchParams: PageProps<"/admin/media/[id]">["searchParams"] }) {
  const { db } = await requireAdmin();
  const { id } = await params;
  const query = await searchParams;
  if (!/^[0-9a-f-]{36}$/i.test(id)) notFound();

  const [{ data: album, error }, { data: photos }] = await Promise.all([
    db.from("albums").select("id, slug, title, label, description, event_date, published, sort_order").eq("id", id).maybeSingle<AlbumRow>(),
    db.from("photos").select("id, src, alt, width, height, storage_path").eq("album_id", id).order("sort_order").order("created_at").returns<PhotoRow[]>(),
  ]);
  if (missingTables(error)) return <MediaSetupNeeded />;
  if (!album) notFound();
  const list = photos ?? [];

  return (
    <div className="space-y-8">
      <PageTitle
        back={{ href: "/admin/media", label: "All albums" }}
        eyebrow={album.label ? `Album · ${album.label}` : "Album"}
        title={album.title}
        description={
          <span className="flex flex-wrap items-center gap-2">
            {album.published ? <StatusPill status="approved" label="on the website" /> : <StatusPill status="pending" label="hidden" />}
            <span>
              {list.length} {list.length === 1 ? "photo" : "photos"}
            </span>
          </span>
        }
        actions={
          <>
            {album.published ? (
              <Link href={`/gallery#${album.slug}`} target="_blank" className={cn(buttonBase, buttonTones.quiet)}>
                <Eye className="size-4" aria-hidden="true" />
                View on the website
              </Link>
            ) : null}
            <AdminForm
              action={setAlbumPublished.bind(null, album.id, !album.published)}
              submitLabel={
                album.published ? (
                  <>
                    <EyeOff className="size-4" aria-hidden="true" />
                    Hide from website
                  </>
                ) : (
                  <>
                    <Eye className="size-4" aria-hidden="true" />
                    Publish album
                  </>
                )
              }
              pendingLabel="Saving…"
              tone={album.published ? "quiet" : "gold"}
              inline={false}
            />
          </>
        }
      />

      {query.created ? (
        <p className="rounded-xl bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-700 ring-1 ring-emerald-200">
          Album created. Upload its photos below, add captions, then press Publish album.
        </p>
      ) : null}

      <Panel title="Upload photos" description="Choose several at once. The first photo is the album's cover; you can change that below." icon={ImagePlus}>
        <MediaUploader mode="album" albumId={album.id} />
      </Panel>

      <Panel
        title="Photos"
        description={list.length ? "Write a caption for each photo: it's shown under the photo and read out by screen readers. Use the arrows to change the order." : undefined}
        icon={Images}
      >
        {list.length ? (
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {list.map((p, i) => (
              <PhotoCard key={p.id} p={p} index={i} count={list.length} />
            ))}
          </ul>
        ) : (
          <Empty icon={Images} title="No photos yet">
            Upload some above.
          </Empty>
        )}
        {list.some((p) => !p.storage_path) ? (
          <p className="mt-4 text-xs text-slate-500">Photos carried over from the 2014 site are part of the website&apos;s files; deleting one here removes it from the Gallery.</p>
        ) : null}
      </Panel>

      <Panel title="Album details" icon={Settings2}>
        <AlbumForm album={album} />
      </Panel>

      <Panel title="Delete album" icon={TriangleAlert} className="ring-ball/25">
        <DeleteAlbumForm id={album.id} photos={list.length} />
      </Panel>
    </div>
  );
}

export default function AlbumAdminPage({ params, searchParams }: PageProps<"/admin/media/[id]">) {
  return (
    <Suspense fallback={<PanelSkeleton rows={6} />}>
      <Body params={params} searchParams={searchParams} />
    </Suspense>
  );
}
