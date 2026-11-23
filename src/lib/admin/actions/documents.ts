"use server";

import { randomUUID } from "node:crypto";
import { refresh, updateTag } from "next/cache";
import { z } from "zod";
import { requireAdmin } from "@/lib/admin/auth";
import { MAX_PDF_BYTES } from "@/lib/admin/content-shared";
import { dbMessage, done, failed, fields, slugify, zodErrors, type ActionResult } from "@/lib/admin/result";

/* Documents page (/governance/documents): PDFs go from the browser straight to the public "documents" bucket. */

const BUCKET = "documents";
const pdfPath = /^files\/[0-9a-f-]{36}\.pdf$/;

function published() {
  updateTag("documents");
  refresh();
}

const docSchema = z.object({
  title: z.string({ message: "Give the document a title" }).trim().min(3, "Give the document a title").max(160),
  description: z.string().trim().max(600).optional(),
  category: z.enum(["rules", "forms", "fixtures", "results", "officials"], { message: "Choose a category" }),
  year: z.coerce.number({ message: "A year like 2026" }).int("A year like 2026").min(1990, "A year like 2026").max(2100, "A year like 2026").optional(),
  edition: z.string().trim().max(60).optional(),
  pages: z.coerce.number({ message: "A number of pages" }).int("A number of pages").min(1, "A number of pages").max(5000).optional(),
  read_href: z
    .string()
    .trim()
    .max(500)
    .refine((v) => /^https?:\/\/\S+$/i.test(v) || /^\/\S*$/.test(v), "Start with https:// or /")
    .optional(),
});

const docRow = (d: z.infer<typeof docSchema>) => ({
  title: d.title,
  description: d.description ?? "",
  category: d.category,
  year: d.year ?? null,
  edition: d.edition ?? null,
  pages: d.pages ?? null,
  read_href: d.read_href ?? null,
});

/** A one-time link to upload one PDF straight to storage (the website's server never handles the file). */
export async function prepareDocumentUpload(size: number): Promise<{ ok: boolean; message: string; path?: string; token?: string }> {
  const { db } = await requireAdmin();
  if (!(size > 0)) return { ok: false, message: "Choose a PDF first." };
  if (size > MAX_PDF_BYTES) return { ok: false, message: "That PDF is over 50 MB. Compress it (e.g. ilovepdf.com → Compress PDF) and try again." };
  const { data, error } = await db.storage.from(BUCKET).createSignedUploadUrl(`files/${randomUUID()}.pdf`);
  if (error || !data)
    return { ok: false, message: /bucket/i.test(error?.message ?? "") ? dbMessage({ message: "", code: "PGRST205" }) : "Couldn't start the upload. Please try again." };
  return { ok: true, message: "", path: data.path, token: data.token };
}

/** Saves a new document after its PDF has been uploaded. `meta` holds the form's values as text. */
export async function createDocument(meta: Record<string, string>, upload: { path: string; size: number }, show: boolean): Promise<ActionResult> {
  const { db } = await requireAdmin();
  if (!pdfPath.test(upload.path)) return failed("That upload isn't a document file.");
  const clean: Record<string, string | undefined> = {};
  for (const [k, v] of Object.entries(meta)) clean[k] = typeof v === "string" && v.trim() ? v.trim() : undefined;
  const parsed = docSchema.safeParse(clean);
  if (!parsed.success) {
    await db.storage.from(BUCKET).remove([upload.path]);
    return failed("Please check the highlighted fields.", zodErrors(parsed.error));
  }
  const d = parsed.data;
  const { data: last } = await db.from("documents").select("sort_order").eq("category", d.category).order("sort_order", { ascending: false }).limit(1).maybeSingle();
  const row = {
    ...docRow(d),
    file_src: db.storage.from(BUCKET).getPublicUrl(upload.path).data.publicUrl,
    file_path: upload.path,
    file_size: Math.round(upload.size),
    published: show,
    sort_order: (last?.sort_order ?? 0) + 1,
  };
  const slug = slugify(`${d.title} ${d.year ?? ""}`) || "document";
  let insert = await db.from("documents").insert({ ...row, slug });
  if (insert.error?.code === "23505") insert = await db.from("documents").insert({ ...row, slug: `${slug}-${randomUUID().slice(0, 4)}` });
  if (insert.error) {
    await db.storage.from(BUCKET).remove([upload.path]);
    return failed(dbMessage(insert.error));
  }
  published();
  return done(show ? `"${d.title}" is now on the Documents page.` : `"${d.title}" saved (hidden from the website).`);
}

/** Swaps the PDF of an existing document (e.g. a new edition) and deletes the old uploaded file. */
export async function replaceDocumentFile(id: string, upload: { path: string; size: number }): Promise<ActionResult> {
  const { db } = await requireAdmin();
  if (!pdfPath.test(upload.path)) return failed("That upload isn't a document file.");
  const { data: before } = await db.from("documents").select("file_path").eq("id", id).maybeSingle<{ file_path: string | null }>();
  if (!before) {
    await db.storage.from(BUCKET).remove([upload.path]);
    return failed("That document no longer exists.");
  }
  const { error } = await db
    .from("documents")
    .update({ file_src: db.storage.from(BUCKET).getPublicUrl(upload.path).data.publicUrl, file_path: upload.path, file_size: Math.round(upload.size) })
    .eq("id", id);
  if (error) {
    await db.storage.from(BUCKET).remove([upload.path]);
    return failed(dbMessage(error));
  }
  if (before.file_path) await db.storage.from(BUCKET).remove([before.file_path]);
  published();
  return done("New PDF saved. The Documents page now opens this file.");
}

export async function saveDocument(id: string, _prev: ActionResult, formData: FormData): Promise<ActionResult> {
  const { db } = await requireAdmin();
  const parsed = docSchema.safeParse(fields(formData));
  if (!parsed.success) return failed("Please check the highlighted fields.", zodErrors(parsed.error));
  const { error } = await db
    .from("documents")
    .update({ ...docRow(parsed.data), featured: formData.get("featured") === "on", published: formData.get("published") === "on" })
    .eq("id", id);
  if (error) return failed(dbMessage(error));
  published();
  return done("Saved.");
}

export async function moveDocument(id: string, direction: "up" | "down"): Promise<ActionResult> {
  const { db } = await requireAdmin();
  const { data: doc } = await db.from("documents").select("category").eq("id", id).maybeSingle<{ category: string }>();
  if (!doc) return failed("That document no longer exists.");
  const { data } = await db.from("documents").select("id").eq("category", doc.category).order("sort_order").order("created_at");
  const ids = (data ?? []).map((r) => r.id as string);
  const i = ids.indexOf(id);
  const j = direction === "up" ? i - 1 : i + 1;
  if (i < 0 || j < 0 || j >= ids.length) return done("Already at the end.");
  [ids[i], ids[j]] = [ids[j], ids[i]];
  const { error } = await db.rpc("reorder_content", { p_table: "documents", p_ids: ids });
  if (error) return failed(dbMessage(error));
  published();
  return done("Order updated.");
}

export async function deleteDocument(id: string, _prev: ActionResult, formData: FormData): Promise<ActionResult> {
  const { db } = await requireAdmin();
  if (formData.get("confirm") !== "on") return failed("Tick the box to confirm.", { confirm: "Tick to confirm" });
  const { data } = await db.from("documents").select("file_path").eq("id", id).maybeSingle<{ file_path: string | null }>();
  const { error } = await db.from("documents").delete().eq("id", id);
  if (error) return failed(dbMessage(error));
  if (data?.file_path) await db.storage.from(BUCKET).remove([data.file_path]);
  published();
  return done("Document removed from the website.");
}
