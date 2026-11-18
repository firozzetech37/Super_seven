"use server";

import { randomUUID } from "node:crypto";
import { refresh, updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { requireAdmin } from "@/lib/admin/auth";
import { dbMessage, done, failed, fields, slugify, zodErrors, type ActionResult } from "@/lib/admin/result";
import { youtubeId } from "@/lib/queries/gallery";

const BUCKET = "media";
const MAX_BATCH = 40;
const types: Record<string, string> = { "image/webp": "webp", "image/jpeg": "jpg", "image/png": "png" };

/** The public gallery (albums, press wall, featured video) is cached under this tag. */
function published() {
  updateTag("gallery");
  refresh();
}

/* ---------- Albums ---------- */

const albumSchema = z.object({
  title: z.string({ message: "Give the album a title" }).trim().min(3, "Give the album a title").max(140),
  label: z.string().trim().max(40).optional(),
  description: z.string().trim().max(600).optional(),
  event_date: z.iso.date("Use the date picker").optional(),
});

export async function saveAlbum(id: string | null, _prev: ActionResult, formData: FormData): Promise<ActionResult> {
  const { db } = await requireAdmin();
  const parsed = albumSchema.safeParse(fields(formData));
  if (!parsed.success) return failed("Please check the highlighted fields.", zodErrors(parsed.error));
  const a = parsed.data;
  const row = {
    title: a.title,
    label: a.label ?? a.event_date?.slice(0, 4) ?? null,
    description: a.description ?? null,
    event_date: a.event_date ?? null,
  };

  if (id) {
    const { error } = await db.from("albums").update(row).eq("id", id);
    if (error) return failed(dbMessage(error));
    published();
    return done("Album saved.");
  }

  const base = slugify(`${a.title} ${row.label ?? ""}`) || "album";
  let insert = await db.from("albums").insert({ ...row, slug: base, published: false }).select("id").single<{ id: string }>();
  if (insert.error?.code === "23505") {
    insert = await db.from("albums").insert({ ...row, slug: `${base}-${randomUUID().slice(0, 4)}`, published: false }).select("id").single<{ id: string }>();
  }
  if (insert.error || !insert.data) return failed(dbMessage(insert.error));
  redirect(`/admin/media/${insert.data.id}?created=1`);
}

export async function setAlbumPublished(id: string, value: boolean): Promise<ActionResult> {
  const { db } = await requireAdmin();
  if (value) {
    const { count } = await db.from("photos").select("id", { count: "exact", head: true }).eq("album_id", id);
    if (!count) return failed("Add at least one photo before publishing.");
  }
  const { error } = await db.from("albums").update({ published: value }).eq("id", id);
  if (error) return failed(dbMessage(error));
  published();
  return done(value ? "Published: the album is now on the Gallery page." : "Hidden from the website. Only admins can see it.");
}

export async function deleteAlbum(id: string, _prev: ActionResult, formData: FormData): Promise<ActionResult> {
  const { db } = await requireAdmin();
  if (formData.get("confirm") !== "on") return failed("Tick the box to confirm.", { confirm: "Tick to confirm" });
  const { data: photos } = await db.from("photos").select("storage_path").eq("album_id", id).not("storage_path", "is", null);
  const paths = (photos ?? []).map((p) => p.storage_path as string);
  if (paths.length) await db.storage.from(BUCKET).remove(paths);
  const { error } = await db.from("albums").delete().eq("id", id);
  if (error) return failed(dbMessage(error));
  updateTag("gallery");
  redirect("/admin/media?deleted=1");
}

export async function moveAlbum(id: string, direction: "up" | "down"): Promise<ActionResult> {
  const { db } = await requireAdmin();
  const { data } = await db
    .from("albums")
    .select("id")
    .order("sort_order")
    .order("event_date", { ascending: false, nullsFirst: false })
    .order("created_at", { ascending: false });
  const ids = (data ?? []).map((r) => r.id as string);
  const i = ids.indexOf(id);
  const j = direction === "up" ? i - 1 : i + 1;
  if (i < 0 || j < 0 || j >= ids.length) return done("Already at the end.");
  [ids[i], ids[j]] = [ids[j], ids[i]];
  const { error } = await db.rpc("reorder_albums", { p_ids: ids });
  if (error) return failed(dbMessage(error));
  published();
  return done("Order updated.");
}

/* ---------- Uploads (browser → storage via one-time signed links) ---------- */

export type UploadTarget = { path: string; token: string };
export type UploadKind = { kind: "album"; albumId: string } | { kind: "press"; year: number };

/** Signed upload links for a batch of files, so large photos go straight to storage (no server size limit). */
export async function prepareUploads(target: UploadKind, files: { type: string }[]): Promise<{ ok: boolean; message: string; targets?: UploadTarget[] }> {
  const { db } = await requireAdmin();
  if (!files.length) return { ok: false, message: "Choose at least one photo." };
  if (files.length > MAX_BATCH) return { ok: false, message: `Upload at most ${MAX_BATCH} photos at a time.` };
  if (files.some((f) => !types[f.type])) return { ok: false, message: "Only JPG, PNG or WebP images can be uploaded." };

  let folder: string;
  if (target.kind === "album") {
    const { data: album, error } = await db.from("albums").select("id").eq("id", target.albumId).maybeSingle();
    if (error) return { ok: false, message: dbMessage(error) };
    if (!album) return { ok: false, message: "That album no longer exists." };
    folder = `albums/${target.albumId}`;
  } else {
    if (!Number.isInteger(target.year) || target.year < 1990 || target.year > 2100) return { ok: false, message: "Choose the year of the clipping." };
    folder = `press/${target.year}`;
  }

  const targets: UploadTarget[] = [];
  for (const f of files) {
    const path = `${folder}/${randomUUID()}.${types[f.type]}`;
    const { data, error } = await db.storage.from(BUCKET).createSignedUploadUrl(path);
    if (error || !data) return { ok: false, message: /bucket/i.test(error?.message ?? "") ? dbMessage({ message: "", code: "PGRST205" }) : "Couldn't start the upload. Please try again." };
    targets.push({ path: data.path, token: data.token });
  }
  return { ok: true, message: "", targets };
}

const uploaded = z.array(
  z.object({
    path: z.string().regex(/^(albums\/[0-9a-f-]{36}|press\/\d{4})\/[0-9a-f-]{36}\.(webp|jpg|png)$/),
    width: z.number().int().positive().max(10000),
    height: z.number().int().positive().max(10000),
    name: z.string().max(200).optional(),
  }),
);

/** Turns a file name like "trophy_ceremony-2.jpg" into a starting caption: "Trophy ceremony 2". */
function captionFromName(name: string | undefined, fallback: string) {
  const base = (name ?? "").replace(/\.[a-z0-9]+$/i, "").replace(/[_-]+/g, " ").trim();
  if (!base || /^(img|dsc|image|photo|whatsapp image|screenshot)\b/i.test(base) || /^\d[\d\s]*$/.test(base)) return fallback;
  return base[0].toUpperCase() + base.slice(1);
}

export async function savePhotos(albumId: string, items: z.infer<typeof uploaded>): Promise<ActionResult> {
  const { db } = await requireAdmin();
  const parsed = uploaded.safeParse(items);
  if (!parsed.success || parsed.data.some((p) => !p.path.startsWith(`albums/${albumId}/`))) return failed("Those uploads don't belong to this album.");
  const { data: album } = await db.from("albums").select("title").eq("id", albumId).single<{ title: string }>();
  const { data: last } = await db.from("photos").select("sort_order").eq("album_id", albumId).order("sort_order", { ascending: false }).limit(1).maybeSingle();
  const start = (last?.sort_order ?? 0) + 1;
  const rows = parsed.data.map((p, i) => ({
    album_id: albumId,
    src: db.storage.from(BUCKET).getPublicUrl(p.path).data.publicUrl,
    storage_path: p.path,
    alt: captionFromName(p.name, `Photo from ${album?.title ?? "the album"}`),
    width: p.width,
    height: p.height,
    sort_order: start + i,
  }));
  const { error } = await db.from("photos").insert(rows);
  if (error) {
    await db.storage.from(BUCKET).remove(parsed.data.map((p) => p.path));
    return failed(dbMessage(error));
  }
  published();
  return done(`Added ${rows.length} ${rows.length === 1 ? "photo" : "photos"}. Add a caption to each so visitors know what they show.`);
}

export async function savePressUploads(year: number, items: z.infer<typeof uploaded>, meta: { source?: string; headline?: string }): Promise<ActionResult> {
  const { db } = await requireAdmin();
  const parsed = uploaded.safeParse(items);
  if (!parsed.success || parsed.data.some((p) => !p.path.startsWith(`press/${year}/`))) return failed("Those uploads don't match the chosen year.");
  const source = meta.source?.trim().slice(0, 80) || null;
  const headline = meta.headline?.trim().slice(0, 200) || null;
  const { data: last } = await db.from("press_clippings").select("sort_order").eq("year", year).order("sort_order", { ascending: false }).limit(1).maybeSingle();
  const start = (last?.sort_order ?? 0) + 1;
  const rows = parsed.data.map((p, i) => ({
    year,
    src: db.storage.from(BUCKET).getPublicUrl(p.path).data.publicUrl,
    storage_path: p.path,
    width: p.width,
    height: p.height,
    source,
    headline,
    sort_order: start + i,
  }));
  const { error } = await db.from("press_clippings").insert(rows);
  if (error) {
    await db.storage.from(BUCKET).remove(parsed.data.map((p) => p.path));
    return failed(dbMessage(error));
  }
  published();
  return done(`Added ${rows.length} ${rows.length === 1 ? "clipping" : "clippings"} to ${year}.`);
}

/* ---------- Photos ---------- */

export async function updatePhoto(id: string, _prev: ActionResult, formData: FormData): Promise<ActionResult> {
  const { db } = await requireAdmin();
  const alt = String(formData.get("alt") ?? "").trim();
  if (alt.length < 3) return failed("Write a short caption (what's in the photo).", { alt: "Write a short caption" });
  const { error } = await db.from("photos").update({ alt: alt.slice(0, 200) }).eq("id", id);
  if (error) return failed(dbMessage(error));
  published();
  return done("Caption saved.");
}

/** Move a photo one place earlier/later, or to the front (the first photo is the album's cover). */
export async function movePhoto(id: string, direction: "up" | "down" | "first"): Promise<ActionResult> {
  const { db } = await requireAdmin();
  const { data: photo } = await db.from("photos").select("album_id").eq("id", id).single<{ album_id: string }>();
  if (!photo) return failed("That photo no longer exists.");
  const { data } = await db.from("photos").select("id").eq("album_id", photo.album_id).order("sort_order").order("created_at");
  const ids = (data ?? []).map((r) => r.id as string);
  const i = ids.indexOf(id);
  if (direction === "first") {
    ids.splice(i, 1);
    ids.unshift(id);
  } else {
    const j = direction === "up" ? i - 1 : i + 1;
    if (j < 0 || j >= ids.length) return done("Already at the end.");
    [ids[i], ids[j]] = [ids[j], ids[i]];
  }
  const { error } = await db.rpc("reorder_photos", { p_ids: ids });
  if (error) return failed(dbMessage(error));
  published();
  return done(direction === "first" ? "Now the album cover." : "Order updated.");
}

export async function deletePhoto(id: string): Promise<ActionResult> {
  const { db } = await requireAdmin();
  const { data: photo } = await db.from("photos").select("storage_path").eq("id", id).maybeSingle<{ storage_path: string | null }>();
  const { error } = await db.from("photos").delete().eq("id", id);
  if (error) return failed(dbMessage(error));
  if (photo?.storage_path) await db.storage.from(BUCKET).remove([photo.storage_path]);
  published();
  return done("Photo deleted.");
}

/* ---------- Press clippings ---------- */

const clippingSchema = z.object({
  year: z.coerce.number({ message: "A year like 2026" }).int().min(1990, "A year like 2026").max(2100, "A year like 2026"),
  headline: z.string().trim().max(200).optional(),
  source: z.string().trim().max(80).optional(),
});

export async function updateClipping(id: string, _prev: ActionResult, formData: FormData): Promise<ActionResult> {
  const { db } = await requireAdmin();
  const parsed = clippingSchema.safeParse(fields(formData));
  if (!parsed.success) return failed("Please check the highlighted fields.", zodErrors(parsed.error));
  const c = parsed.data;
  const { error } = await db
    .from("press_clippings")
    .update({ year: c.year, headline: c.headline ?? null, source: c.source ?? null, published: formData.get("published") === "on" })
    .eq("id", id);
  if (error) return failed(dbMessage(error));
  published();
  return done("Clipping saved.");
}

export async function deleteClipping(id: string): Promise<ActionResult> {
  const { db } = await requireAdmin();
  const { data: clip } = await db.from("press_clippings").select("storage_path").eq("id", id).maybeSingle<{ storage_path: string | null }>();
  const { error } = await db.from("press_clippings").delete().eq("id", id);
  if (error) return failed(dbMessage(error));
  if (clip?.storage_path) await db.storage.from(BUCKET).remove([clip.storage_path]);
  published();
  return done("Clipping deleted.");
}

/* ---------- Featured video ---------- */

export async function saveFeaturedVideo(_prev: ActionResult, formData: FormData): Promise<ActionResult> {
  const { db } = await requireAdmin();
  const url = String(formData.get("url") ?? "").trim();
  const title = String(formData.get("title") ?? "").trim().slice(0, 120);
  if (url && !youtubeId(url)) return failed("That doesn't look like a YouTube link.", { url: "Paste a YouTube link, e.g. https://youtu.be/…" });
  const now = new Date().toISOString();
  const { error } = await db.from("site_settings").upsert(
    [
      { key: "featured_video", value: url ? youtubeId(url) : null, updated_at: now },
      { key: "featured_video_title", value: title || null, updated_at: now },
    ],
    { onConflict: "key" },
  );
  if (error) return failed(dbMessage(error));
  published();
  return done(url ? "Featured video saved. It's now on the Gallery page." : "Featured video removed.");
}
