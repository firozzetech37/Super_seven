"use client";

import { useRef, useState } from "react";
import { AlertCircle, FileUp, LoaderCircle, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { FieldErrors } from "@/components/admin/admin-form";
import { Checkbox, Input, Select, Textarea } from "@/components/admin/fields";
import { buttonBase, buttonTones } from "@/components/admin/styles";
import { bucket } from "@/components/admin/upload-utils";
import { createDocument, prepareDocumentUpload, replaceDocumentFile } from "@/lib/admin/actions/documents";
import { documentCategoryOptions, MAX_PDF_BYTES } from "@/lib/admin/content-shared";
import { cn } from "@/lib/utils";

const isPdf = (file: File) => file.type === "application/pdf" || /\.pdf$/i.test(file.name);
const megabytes = (bytes: number) => `${(bytes / 1024 / 1024).toFixed(bytes < 10 * 1024 * 1024 ? 1 : 0)} MB`;

/**
 * Page count from the PDF's page tree (the root "/Type /Pages" node carries the total in "/Count").
 * Returns null when it isn't readable (e.g. a compressed page tree); the admin then types it in.
 */
async function countPages(file: File): Promise<number | null> {
  try {
    const text = new TextDecoder("latin1").decode(await file.arrayBuffer());
    let max = 0;
    for (const m of text.matchAll(/\/Type\s*\/Pages\b[^>]*?\/Count\s+(\d+)|\/Count\s+(\d+)[^>]*?\/Type\s*\/Pages\b/g)) max = Math.max(max, Number(m[1] ?? m[2]));
    return max > 0 && max < 5000 ? max : null;
  } catch {
    return null;
  }
}

/** Uploads the PDF straight to storage with a one-time link. */
async function sendPdf(file: File): Promise<{ ok: true; path: string } | { ok: false; message: string }> {
  const link = await prepareDocumentUpload(file.size);
  if (!link.ok || !link.path || !link.token) return { ok: false, message: link.message || "Couldn't start the upload." };
  const { error } = await bucket("documents").uploadToSignedUrl(link.path, link.token, file, { contentType: "application/pdf", cacheControl: "3600" });
  if (error) return { ok: false, message: "Upload failed. Check your connection and try again." };
  return { ok: true, path: link.path };
}

function checkFile(file: File | null | undefined): string | null {
  if (!file || !file.size) return "Choose the PDF file.";
  if (!isPdf(file)) return "Only PDF files can be uploaded here.";
  if (file.size > MAX_PDF_BYTES) return `That PDF is ${megabytes(file.size)}; the limit is 50 MB. Compress it (e.g. ilovepdf.com → Compress PDF) and try again.`;
  return null;
}

/** New document: details, then the PDF. It appears on the Documents page straight away unless "Show" is unticked. */
export function DocumentUploader() {
  const formRef = useRef<HTMLFormElement>(null);
  const pagesRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [file, setFile] = useState<File | null>(null);

  async function pick(next: File | null) {
    setFile(next);
    setErrors((e) => ({ ...e, file: "" }));
    if (next && isPdf(next) && pagesRef.current && !pagesRef.current.value) {
      const pages = await countPages(next);
      if (pages && pagesRef.current && !pagesRef.current.value) pagesRef.current.value = String(pages);
    }
  }

  async function submit(form: HTMLFormElement) {
    const data = new FormData(form);
    const meta: Record<string, string> = {};
    for (const key of ["title", "category", "year", "edition", "pages", "description"]) meta[key] = String(data.get(key) ?? "");
    const problems: Record<string, string> = {};
    if (meta.title.trim().length < 3) problems.title = "Give the document a title";
    if (!meta.category) problems.category = "Choose a category";
    const fileProblem = checkFile(file);
    if (fileProblem) problems.file = fileProblem;
    setErrors(problems);
    if (Object.keys(problems).length) {
      toast.error(problems.file && Object.keys(problems).length === 1 ? problems.file : "Please check the highlighted fields.");
      return;
    }

    setBusy(true);
    try {
      const sent = await sendPdf(file!);
      if (!sent.ok) {
        toast.error(sent.message);
        return;
      }
      const result = await createDocument(meta, { path: sent.path, size: file!.size }, data.get("show") === "on");
      setErrors(result.errors ?? {});
      if (!result.ok) {
        toast.error(result.message);
        return;
      }
      toast.success(result.message);
      form.reset();
      setFile(null);
    } finally {
      setBusy(false);
    }
  }

  return (
    <FieldErrors value={errors}>
      <form
        ref={formRef}
        onSubmit={(e) => {
          e.preventDefault();
          if (!busy) void submit(e.currentTarget);
        }}
        className="@container space-y-4"
      >
        <label
          className={cn(
            "flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed px-6 py-7 text-center transition focus-within:ring-4 focus-within:ring-royal/30",
            errors.file ? "border-ball/60 bg-ball/[0.03]" : file ? "border-royal/40 bg-royal/[0.04]" : "border-line bg-surface/60 hover:border-royal/40 hover:bg-royal/[0.03]",
            busy && "pointer-events-none opacity-70",
          )}
        >
          <span className="grid size-12 place-items-center rounded-2xl bg-white text-royal shadow-sm ring-1 ring-line">
            {busy ? <LoaderCircle className="size-6 animate-spin" aria-hidden="true" /> : <FileUp className="size-6" aria-hidden="true" />}
          </span>
          <span className="font-heading text-lg font-bold text-navy">{file ? file.name : "Choose the PDF"}</span>
          <span className="text-sm text-slate-500">{file ? `${megabytes(file.size)} · click to choose a different file` : "PDF only · up to 50 MB"}</span>
          <input type="file" accept="application/pdf,.pdf" className="sr-only" disabled={busy} onChange={(e) => void pick(e.target.files?.[0] ?? null)} />
        </label>
        {errors.file ? (
          <p role="alert" className="flex items-start gap-1.5 text-[13px] font-bold text-ball">
            <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
            {errors.file}
          </p>
        ) : null}

        <div className="grid gap-4 @md:grid-cols-2 @3xl:grid-cols-4">
          <Input name="title" label="Title" required placeholder="Constitution of SSCFI" className="@md:col-span-2" />
          <Select name="category" label="Category" options={documentCategoryOptions} placeholder="Choose…" required />
          <Input name="year" label="Year" optional inputMode="numeric" maxLength={4} placeholder={String(new Date().getFullYear())} />
          <Input name="edition" label="Edition" optional placeholder="e.g. Official text" hint="Shown when there's no year" />
          <Input ref={pagesRef} name="pages" label="Pages" optional inputMode="numeric" hint="Filled in from the PDF when possible" />
          <Textarea name="description" label="Short description" optional rows={2} placeholder="What's in it, in one or two sentences" className="@md:col-span-2" />
        </div>
        <Checkbox name="show" label="Show on the Documents page straight away" defaultChecked />
        <button type="submit" disabled={busy} className={cn(buttonBase, buttonTones.gold)}>
          {busy ? <LoaderCircle className="size-4 animate-spin" aria-hidden="true" /> : <FileUp className="size-4" aria-hidden="true" />}
          {busy ? "Uploading… (large files take a minute)" : "Upload document"}
        </button>
      </form>
    </FieldErrors>
  );
}

/** Swaps the PDF behind an existing document (a corrected or newer edition). */
export function ReplacePdf({ id }: { id: string }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);

  async function replace(file: File) {
    const problem = checkFile(file);
    if (problem) {
      toast.error(problem);
      return;
    }
    setBusy(true);
    try {
      const sent = await sendPdf(file);
      if (!sent.ok) {
        toast.error(sent.message);
        return;
      }
      const result = await replaceDocumentFile(id, { path: sent.path, size: file.size });
      if (result.ok) toast.success(result.message);
      else toast.error(result.message);
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <label className={cn(buttonBase, buttonTones.quiet, "h-9 cursor-pointer px-3 text-[13px] focus-within:ring-4 focus-within:ring-royal/30", busy && "pointer-events-none opacity-70")}>
      {busy ? <LoaderCircle className="size-4 animate-spin" aria-hidden="true" /> : <RefreshCw className="size-4" aria-hidden="true" />}
      {busy ? "Uploading…" : "Replace PDF"}
      <input
        ref={inputRef}
        type="file"
        accept="application/pdf,.pdf"
        className="sr-only"
        disabled={busy}
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) void replace(file);
        }}
      />
    </label>
  );
}
