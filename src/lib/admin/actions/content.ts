"use server";

import { randomUUID } from "node:crypto";
import { refresh, updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { requireAdmin } from "@/lib/admin/auth";
import { OFFICIAL_ROWS } from "@/lib/admin/content-shared";
import { dbMessage, done, failed, fields, slugify, zodErrors, type ActionResult } from "@/lib/admin/result";

/*
 * Website content: News, People, State units and Match officials (Documents are in ./documents.ts).
 * Every change refreshes the public pages through their cache tag.
 */

type Db = Awaited<ReturnType<typeof requireAdmin>>["db"];
type ContentTag = "news" | "people" | "state-units";

function published(tag: ContentTag) {
  updateTag(tag);
  refresh();
}

const optionalLink = z
  .string()
  .trim()
  .max(500)
  .refine((v) => /^https?:\/\/\S+$/i.test(v) || /^\/\S*$/.test(v), "Start with https:// (another website) or / (a page on this site)")
  .optional();

/** Inserts with a slug made from `base`, adding a short suffix if that slug is taken. */
async function insertWithSlug(db: Db, table: string, base: string, row: Record<string, unknown>) {
  const slug = slugify(base) || table;
  let insert = await db.from(table).insert({ ...row, slug }).select("id").single<{ id: string }>();
  if (insert.error?.code === "23505") insert = await db.from(table).insert({ ...row, slug: `${slug}-${randomUUID().slice(0, 4)}` }).select("id").single<{ id: string }>();
  return insert;
}

/** Next position at the end of a list (optionally within one section). */
async function nextOrder(db: Db, table: string, filter?: [string, string]) {
  let query = db.from(table).select("sort_order").order("sort_order", { ascending: false }).limit(1);
  if (filter) query = query.eq(filter[0], filter[1]);
  const { data } = await query.maybeSingle<{ sort_order: number }>();
  return (data?.sort_order ?? 0) + 1;
}

/** Moves a row one place up or down within its list, by rewriting the order of the whole list. */
async function move(db: Db, table: "people" | "state_units" | "match_officials" | "documents", id: string, direction: "up" | "down", filter?: [string, string]) {
  let query = db.from(table).select("id").order("sort_order").order("created_at");
  if (filter) query = query.eq(filter[0], filter[1]);
  const { data } = await query;
  const ids = (data ?? []).map((r) => r.id as string);
  const i = ids.indexOf(id);
  const j = direction === "up" ? i - 1 : i + 1;
  if (i < 0 || j < 0 || j >= ids.length) return done("Already at the end.");
  [ids[i], ids[j]] = [ids[j], ids[i]];
  const { error } = await db.rpc("reorder_content", { p_table: table, p_ids: ids });
  return error ? failed(dbMessage(error)) : done("Order updated.");
}

const confirmed = (formData: FormData) => formData.get("confirm") === "on";

/* ---------- News ---------- */

const kinds = ["news", "announcement", "newsletter"] as const;

const newsCreateSchema = z.object({
  title: z.string({ message: "Write a headline" }).trim().min(3, "Write a headline").max(160),
  kind: z.enum(kinds, { message: "Choose a type" }),
});

export async function createNews(_prev: ActionResult, formData: FormData): Promise<ActionResult> {
  const { db } = await requireAdmin();
  const parsed = newsCreateSchema.safeParse(fields(formData));
  if (!parsed.success) return failed("Please check the highlighted fields.", zodErrors(parsed.error));
  const insert = await insertWithSlug(db, "news_posts", parsed.data.title, { title: parsed.data.title, kind: parsed.data.kind, published: false });
  if (insert.error || !insert.data) return failed(dbMessage(insert.error));
  redirect(`/admin/news/${insert.data.id}?created=1`);
}

const newsSchema = z.object({
  title: z.string({ message: "Write a headline" }).trim().min(3, "Write a headline").max(160),
  kind: z.enum(kinds, { message: "Choose a type" }),
  event_date: z.iso.date("Use the date picker").optional(),
  summary: z.string({ message: "Write one or two sentences for the news card" }).trim().min(10, "Write one or two sentences for the news card").max(400, "Keep it under 400 characters"),
  body: z.string().trim().max(20000).optional(),
  link: optionalLink,
  cover_alt: z.string().trim().max(200).optional(),
});

export async function saveNews(id: string, _prev: ActionResult, formData: FormData): Promise<ActionResult> {
  const { db } = await requireAdmin();
  const parsed = newsSchema.safeParse(fields(formData));
  if (!parsed.success) return failed("Please check the highlighted fields.", zodErrors(parsed.error));
  const n = parsed.data;
  const { error } = await db
    .from("news_posts")
    .update({
      title: n.title,
      kind: n.kind,
      event_date: n.event_date ?? null,
      summary: n.summary,
      body: n.body ?? null,
      link: n.link ?? null,
      cover_alt: n.cover_alt ?? null,
      featured: formData.get("featured") === "on",
      archive: formData.get("archive") === "on",
      pending: formData.get("pending") === "on",
    })
    .eq("id", id);
  if (error) return failed(dbMessage(error));
  published("news");
  return done("Story saved.");
}

export async function setNewsPublished(id: string, value: boolean): Promise<ActionResult> {
  const { db } = await requireAdmin();
  if (value) {
    const { data } = await db.from("news_posts").select("summary").eq("id", id).maybeSingle<{ summary: string }>();
    if (!data?.summary?.trim()) return failed("Write the summary and press Save story before publishing.");
  }
  const { error } = await db.from("news_posts").update({ published: value }).eq("id", id);
  if (error) return failed(dbMessage(error));
  published("news");
  return done(value ? "Published: the story is now on the News page." : "Hidden from the website. Only admins can see it.");
}

export async function deleteNews(id: string, _prev: ActionResult, formData: FormData): Promise<ActionResult> {
  const { db } = await requireAdmin();
  if (!confirmed(formData)) return failed("Tick the box to confirm.", { confirm: "Tick to confirm" });
  const { data } = await db.from("news_posts").select("cover_path").eq("id", id).maybeSingle<{ cover_path: string | null }>();
  const { error } = await db.from("news_posts").delete().eq("id", id);
  if (error) return failed(dbMessage(error));
  if (data?.cover_path) await db.storage.from("media").remove([data.cover_path]);
  updateTag("news");
  redirect("/admin/news?deleted=1");
}

/* ---------- People ---------- */

const sections = ["leadership", "office_bearer", "advisory", "committee", "core"] as const;

const splitList = (v?: string) =>
  (v ?? "")
    .split(/[,;\n]/)
    .map((s) => s.trim())
    .filter(Boolean);

const personSchema = z
  .object({
    section: z.enum(sections, { message: "Choose where they appear" }),
    name: z.string().trim().max(120).optional(),
    role: z.string({ message: "Write their role, e.g. Secretary" }).trim().min(2, "Write their role, e.g. Secretary").max(120),
    state: z.string().trim().max(80).optional(),
    emails: z
      .string()
      .trim()
      .max(400)
      .refine((v) => splitList(v).every((e) => z.email().safeParse(e).success), "One or more email addresses look wrong (separate several with commas)")
      .optional(),
    phones: z
      .string()
      .trim()
      .max(200)
      .refine((v) => splitList(v).every((p) => /^\+?[\d\s()-]{6,20}$/.test(p)), "Use digits, spaces and + only (separate several with commas)")
      .optional(),
    linkedin: z
      .string()
      .trim()
      .max(300)
      .refine((v) => /^https:\/\/(www\.)?linkedin\.com\/\S+$/i.test(v), "Paste the full LinkedIn link, e.g. https://www.linkedin.com/in/…")
      .optional(),
    address: z.string().trim().max(300).optional(),
  })
  .refine((p) => p.section === "leadership" || p.name, { message: "Write their name", path: ["name"] });

function personRow(p: z.infer<typeof personSchema>, formData: FormData) {
  // Committee forms don't show the contact fields; leave any stored contacts alone in that case.
  const contacts = formData.has("emails")
    ? {
        emails: splitList(p.emails).map((e) => e.toLowerCase()),
        phones: splitList(p.phones),
        linkedin: p.linkedin ?? null,
        address: p.address ?? null,
        email_suggested: formData.get("email_suggested") === "on",
      }
    : {};
  return {
    section: p.section,
    name: p.name ?? null,
    role: p.role,
    state: p.state ?? null,
    ...contacts,
    from_2014: formData.get("from_2014") === "on",
    published: formData.get("published") === "on",
  };
}

export async function addPerson(_prev: ActionResult, formData: FormData): Promise<ActionResult> {
  const { db } = await requireAdmin();
  const parsed = personSchema.safeParse(fields(formData));
  if (!parsed.success) return failed("Please check the highlighted fields.", zodErrors(parsed.error));
  const p = parsed.data;
  const row = { ...personRow(p, formData), published: true, sort_order: await nextOrder(db, "people", ["section", p.section]) };
  const insert = await insertWithSlug(db, "people", `${p.section} ${p.name ?? p.role}`, row);
  if (insert.error) return failed(dbMessage(insert.error));
  published("people");
  return done(`${p.name ?? p.role} added. Add a photo from their card below.`);
}

export async function savePerson(id: string, _prev: ActionResult, formData: FormData): Promise<ActionResult> {
  const { db } = await requireAdmin();
  const parsed = personSchema.safeParse(fields(formData));
  if (!parsed.success) return failed("Please check the highlighted fields.", zodErrors(parsed.error));
  const { error } = await db.from("people").update(personRow(parsed.data, formData)).eq("id", id);
  if (error) return failed(dbMessage(error));
  published("people");
  return done("Saved.");
}

export async function movePerson(id: string, direction: "up" | "down"): Promise<ActionResult> {
  const { db } = await requireAdmin();
  const { data } = await db.from("people").select("section").eq("id", id).maybeSingle<{ section: string }>();
  if (!data) return failed("That person is no longer on the list.");
  const result = await move(db, "people", id, direction, ["section", data.section]);
  if (result.ok) published("people");
  return result;
}

export async function deletePerson(id: string, _prev: ActionResult, formData: FormData): Promise<ActionResult> {
  const { db } = await requireAdmin();
  if (!confirmed(formData)) return failed("Tick the box to confirm.", { confirm: "Tick to confirm" });
  const { data } = await db.from("people").select("photo_path").eq("id", id).maybeSingle<{ photo_path: string | null }>();
  const { error } = await db.from("people").delete().eq("id", id);
  if (error) return failed(dbMessage(error));
  if (data?.photo_path) await db.storage.from("media").remove([data.photo_path]);
  published("people");
  return done("Removed from the website.");
}

/* ---------- State units ---------- */

const unitSchema = z.object({
  state: z.string({ message: "Write the state" }).trim().min(2, "Write the state").max(80),
  code: z
    .string({ message: "A short code, e.g. WB" })
    .trim()
    .regex(/^[A-Za-z]{1,5}$/, "1 to 5 letters, e.g. WB"),
});

function unitOfficials(formData: FormData) {
  const list: { role: string; name: string }[] = [];
  for (let i = 0; i < OFFICIAL_ROWS; i++) {
    const name = String(formData.get(`name_${i}`) ?? "").trim().slice(0, 120);
    const role = String(formData.get(`role_${i}`) ?? "").trim().slice(0, 80);
    if (name) list.push({ role: role || "Official", name });
  }
  return list;
}

export async function addStateUnit(_prev: ActionResult, formData: FormData): Promise<ActionResult> {
  const { db } = await requireAdmin();
  const parsed = unitSchema.safeParse(fields(formData));
  if (!parsed.success) return failed("Please check the highlighted fields.", zodErrors(parsed.error));
  const u = parsed.data;
  const insert = await insertWithSlug(db, "state_units", u.state, {
    state: u.state,
    code: u.code.toUpperCase(),
    officials: unitOfficials(formData),
    sort_order: await nextOrder(db, "state_units"),
  });
  if (insert.error) return failed(dbMessage(insert.error));
  published("state-units");
  return done(`${u.state} added to the Teams page.`);
}

export async function saveStateUnit(id: string, _prev: ActionResult, formData: FormData): Promise<ActionResult> {
  const { db } = await requireAdmin();
  const parsed = unitSchema.safeParse(fields(formData));
  if (!parsed.success) return failed("Please check the highlighted fields.", zodErrors(parsed.error));
  const { error } = await db
    .from("state_units")
    .update({ state: parsed.data.state, code: parsed.data.code.toUpperCase(), officials: unitOfficials(formData), published: formData.get("published") === "on" })
    .eq("id", id);
  if (error) return failed(dbMessage(error));
  published("state-units");
  return done("Saved.");
}

export async function moveStateUnit(id: string, direction: "up" | "down"): Promise<ActionResult> {
  const { db } = await requireAdmin();
  const result = await move(db, "state_units", id, direction);
  if (result.ok) published("state-units");
  return result;
}

export async function deleteStateUnit(id: string, _prev: ActionResult, formData: FormData): Promise<ActionResult> {
  const { db } = await requireAdmin();
  if (!confirmed(formData)) return failed("Tick the box to confirm.", { confirm: "Tick to confirm" });
  const { error } = await db.from("state_units").delete().eq("id", id);
  if (error) return failed(dbMessage(error));
  published("state-units");
  return done("State unit removed.");
}

/* ---------- Match officials ---------- */

const officialSchema = z.object({
  name: z.string({ message: "Write their name" }).trim().min(2, "Write their name").max(120),
  role: z.string({ message: "e.g. Umpire, Scorer, Coach" }).trim().min(2, "e.g. Umpire, Scorer, Coach").max(80),
  state: z.string().trim().max(80).optional(),
});

export async function addOfficial(_prev: ActionResult, formData: FormData): Promise<ActionResult> {
  const { db } = await requireAdmin();
  const parsed = officialSchema.safeParse(fields(formData));
  if (!parsed.success) return failed("Please check the highlighted fields.", zodErrors(parsed.error));
  const o = parsed.data;
  const insert = await insertWithSlug(db, "match_officials", o.name, { name: o.name, role: o.role, state: o.state ?? null, sort_order: await nextOrder(db, "match_officials") });
  if (insert.error) return failed(dbMessage(insert.error));
  published("state-units");
  return done(`${o.name} added. Add a photo from their card below.`);
}

export async function saveOfficial(id: string, _prev: ActionResult, formData: FormData): Promise<ActionResult> {
  const { db } = await requireAdmin();
  const parsed = officialSchema.safeParse(fields(formData));
  if (!parsed.success) return failed("Please check the highlighted fields.", zodErrors(parsed.error));
  const o = parsed.data;
  const { error } = await db
    .from("match_officials")
    .update({ name: o.name, role: o.role, state: o.state ?? null, published: formData.get("published") === "on" })
    .eq("id", id);
  if (error) return failed(dbMessage(error));
  published("state-units");
  return done("Saved.");
}

export async function moveOfficial(id: string, direction: "up" | "down"): Promise<ActionResult> {
  const { db } = await requireAdmin();
  const result = await move(db, "match_officials", id, direction);
  if (result.ok) published("state-units");
  return result;
}

export async function deleteOfficial(id: string, _prev: ActionResult, formData: FormData): Promise<ActionResult> {
  const { db } = await requireAdmin();
  if (!confirmed(formData)) return failed("Tick the box to confirm.", { confirm: "Tick to confirm" });
  const { data } = await db.from("match_officials").select("photo_path").eq("id", id).maybeSingle<{ photo_path: string | null }>();
  const { error } = await db.from("match_officials").delete().eq("id", id);
  if (error) return failed(dbMessage(error));
  if (data?.photo_path) await db.storage.from("media").remove([data.photo_path]);
  published("state-units");
  return done("Official removed.");
}

/* ---------- Photos: news covers and portraits (browser → media bucket via a one-time signed link) ---------- */

export type ImageKind = "news" | "person" | "official";

const imageTargets: Record<ImageKind, { table: string; src: string; path: string; folder: string; tag: ContentTag }> = {
  news: { table: "news_posts", src: "cover_src", path: "cover_path", folder: "news", tag: "news" },
  person: { table: "people", src: "photo_src", path: "photo_path", folder: "people", tag: "people" },
  official: { table: "match_officials", src: "photo_src", path: "photo_path", folder: "officials", tag: "state-units" },
};
const imageTypes: Record<string, string> = { "image/webp": "webp", "image/jpeg": "jpg", "image/png": "png" };
const uuid = /^[0-9a-f-]{36}$/i;

export async function prepareImageUpload(kind: ImageKind, id: string, type: string): Promise<{ ok: boolean; message: string; path?: string; token?: string }> {
  const { db } = await requireAdmin();
  const target = imageTargets[kind];
  if (!target || !uuid.test(id)) return { ok: false, message: "Unknown item." };
  if (!imageTypes[type]) return { ok: false, message: "Only JPG, PNG or WebP images can be uploaded." };
  const { data, error } = await db.from(target.table).select("id").eq("id", id).maybeSingle();
  if (error) return { ok: false, message: dbMessage(error) };
  if (!data) return { ok: false, message: "That item no longer exists." };
  const signed = await db.storage.from("media").createSignedUploadUrl(`${target.folder}/${id}/${randomUUID()}.${imageTypes[type]}`);
  if (signed.error || !signed.data) return { ok: false, message: "Couldn't start the upload. Please try again." };
  return { ok: true, message: "", path: signed.data.path, token: signed.data.token };
}

/** Records an uploaded image on its item, replacing (and deleting) the previous upload. */
export async function saveImage(kind: ImageKind, id: string, path: string): Promise<ActionResult> {
  const { db } = await requireAdmin();
  const target = imageTargets[kind];
  if (!target || !uuid.test(id) || !new RegExp(`^${target.folder}/${id}/[0-9a-f-]{36}\\.(webp|jpg|png)$`).test(path)) return failed("That upload doesn't belong to this item.");
  const { data: before } = await db.from(target.table).select(target.path).eq("id", id).maybeSingle<Record<string, string | null>>();
  const src = db.storage.from("media").getPublicUrl(path).data.publicUrl;
  const { error } = await db
    .from(target.table)
    .update({ [target.src]: src, [target.path]: path })
    .eq("id", id);
  if (error) {
    await db.storage.from("media").remove([path]);
    return failed(dbMessage(error));
  }
  const old = before?.[target.path];
  if (old && old !== path) await db.storage.from("media").remove([old]);
  published(target.tag);
  return done(kind === "news" ? "Cover photo saved." : "Photo saved.");
}

export async function removeImage(kind: ImageKind, id: string): Promise<ActionResult> {
  const { db } = await requireAdmin();
  const target = imageTargets[kind];
  if (!target || !uuid.test(id)) return failed("Unknown item.");
  const { data: before } = await db.from(target.table).select(target.path).eq("id", id).maybeSingle<Record<string, string | null>>();
  const { error } = await db
    .from(target.table)
    .update({ [target.src]: null, [target.path]: null })
    .eq("id", id);
  if (error) return failed(dbMessage(error));
  const old = before?.[target.path];
  if (old) await db.storage.from("media").remove([old]);
  published(target.tag);
  return done("Photo removed.");
}
