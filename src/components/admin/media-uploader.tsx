"use client";

import { useId, useRef, useState } from "react";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { AlertCircle, CheckCircle2, ImagePlus, LoaderCircle, UploadCloud } from "lucide-react";
import { toast } from "sonner";
import { buttonBase, buttonTones } from "@/components/admin/styles";
import { prepareUploads, savePhotos, savePressUploads } from "@/lib/admin/actions/media";
import { cn } from "@/lib/utils";

const accepted = ["image/jpeg", "image/png", "image/webp"];
const MAX_FILES = 40;

let client: SupabaseClient | undefined;
function storage() {
  client ??= createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return client.storage.from("media");
}

type Item = { key: string; file: File; preview: string; state: "waiting" | "working" | "done" | "error"; error?: string };
type Prepared = { blob: Blob; width: number; height: number; type: string };

/** Fits the photo inside `max` px (EXIF rotation applied), re-encoded as WebP (JPEG where WebP can't be written). */
async function shrink(file: File, max: number): Promise<Prepared> {
  const bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });
  const scale = Math.min(1, max / Math.max(bitmap.width, bitmap.height));
  const width = Math.round(bitmap.width * scale);
  const height = Math.round(bitmap.height * scale);
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("This browser can't process images.");
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();
  const encode = (type: string, quality: number) => new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, type, quality));
  let blob = await encode("image/webp", 0.82);
  if (!blob || blob.type !== "image/webp") blob = await encode("image/jpeg", 0.85);
  // Release the pixel buffer now rather than waiting for garbage collection (matters on phones).
  canvas.width = 0;
  canvas.height = 0;
  if (!blob) throw new Error("Couldn't process this image.");
  // A small original that needed no resizing is kept as it is when re-encoding wouldn't make it smaller.
  if (scale === 1 && file.size <= blob.size && accepted.includes(file.type)) return { blob: file, width, height, type: file.type };
  return { blob, width, height, type: blob.type };
}

/** Runs `task` over the list with at most `limit` at a time. */
async function pool<T>(list: T[], limit: number, task: (item: T, index: number) => Promise<void>) {
  let next = 0;
  await Promise.all(
    Array.from({ length: Math.min(limit, list.length) }, async () => {
      while (next < list.length) {
        const i = next++;
        await task(list[i], i);
      }
    }),
  );
}

export function MediaUploader(props: { mode: "album"; albumId: string } | { mode: "press"; defaultYear?: number }) {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [items, setItems] = useState<Item[]>([]);
  const [busy, setBusy] = useState(false);
  const [drag, setDrag] = useState(false);
  const [year, setYear] = useState(String(props.mode === "press" ? (props.defaultYear ?? new Date().getFullYear()) : ""));
  const [source, setSource] = useState("");
  const [headline, setHeadline] = useState("");

  const patch = (key: string, change: Partial<Item>) => setItems((list) => list.map((it) => (it.key === key ? { ...it, ...change } : it)));

  function choose(files: FileList | File[]) {
    const list = Array.from(files);
    const images = list.filter((f) => f.type.startsWith("image/"));
    if (images.length < list.length) toast.error("Some files weren't images and were skipped.");
    const room = MAX_FILES - items.filter((i) => i.state !== "done").length;
    if (images.length > room) toast.error(`Upload at most ${MAX_FILES} photos at a time; the first ${room} were added.`);
    const next = images.slice(0, Math.max(room, 0)).map((file) => ({ key: `${file.name}-${file.size}-${Math.random()}`, file, preview: URL.createObjectURL(file), state: "waiting" as const }));
    setItems((current) => [...current.filter((i) => i.state !== "done"), ...next]);
    if (props.mode === "album" && next.length) void upload(next);
  }

  async function upload(batch: Item[]) {
    if (!batch.length || busy) return;
    const pressYear = Number(year);
    if (props.mode === "press" && !(pressYear >= 1990 && pressYear <= 2100)) {
      toast.error("Enter the year of the clipping first.");
      return;
    }
    setBusy(true);
    try {
      // 1. Shrink in the browser, one photo at a time: a decoded 12-megapixel photo takes ~48 MB of memory.
      const prepared: (Prepared | null)[] = [];
      await pool(batch, 1, async (item, i) => {
        patch(item.key, { state: "working" });
        try {
          prepared[i] = await shrink(item.file, props.mode === "press" ? 2400 : 2000);
        } catch {
          prepared[i] = null;
          patch(item.key, { state: "error", error: "Can't read this image (try saving it as JPG)" });
        }
      });
      const ready = batch.map((item, i) => ({ item, prep: prepared[i] })).filter((x): x is { item: Item; prep: Prepared } => x.prep !== null);
      if (!ready.length) return;

      // 2. One-time upload links from the server (checks the admin), then upload straight to storage.
      const target = props.mode === "album" ? { kind: "album" as const, albumId: props.albumId } : { kind: "press" as const, year: pressYear };
      const links = await prepareUploads(target, ready.map((r) => ({ type: r.prep.type })));
      if (!links.ok || !links.targets) {
        ready.forEach((r) => patch(r.item.key, { state: "error", error: links.message }));
        toast.error(links.message);
        return;
      }
      const saved: { path: string; width: number; height: number; name: string }[] = [];
      const savedKeys: string[] = [];
      await pool(ready, 3, async ({ item, prep }, i) => {
        const { path, token } = links.targets![i];
        const { error } = await storage().uploadToSignedUrl(path, token, prep.blob, { contentType: prep.type, cacheControl: "31536000" });
        if (error) patch(item.key, { state: "error", error: "Upload failed" });
        else {
          saved.push({ path, width: prep.width, height: prep.height, name: item.file.name });
          savedKeys.push(item.key);
        }
      });
      if (!saved.length) {
        toast.error("Nothing could be uploaded. Check your connection and try again.");
        return;
      }

      // 3. Record them (this also refreshes the page and the public gallery).
      const result =
        props.mode === "album" ? await savePhotos(props.albumId, saved) : await savePressUploads(pressYear, saved, { source, headline });
      if (!result.ok) {
        toast.error(result.message);
        savedKeys.forEach((key) => patch(key, { state: "error", error: result.message }));
        return;
      }
      savedKeys.forEach((key) => patch(key, { state: "done" }));
      toast.success(result.message);
      if (props.mode === "press") {
        setHeadline("");
        setItems((list) => list.filter((i) => i.state !== "done"));
      }
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  const waiting = items.filter((i) => i.state === "waiting");
  const field = "h-10 w-full rounded-xl bg-white px-3 text-sm text-navy outline-none ring-1 ring-line focus:ring-2 focus:ring-royal";

  return (
    <div className="space-y-4">
      {props.mode === "press" ? (
        <div className="grid gap-3 sm:grid-cols-[8rem_minmax(0,1fr)] lg:grid-cols-[8rem_minmax(0,1fr)_minmax(0,1.4fr)]">
          <label className="block">
            <span className="mb-1.5 block text-[12px] font-bold uppercase tracking-[0.08em] text-slate-500">Year</span>
            <input value={year} onChange={(e) => setYear(e.target.value)} inputMode="numeric" maxLength={4} className={field} />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-[12px] font-bold uppercase tracking-[0.08em] text-slate-500">Newspaper &amp; date</span>
            <input value={source} onChange={(e) => setSource(e.target.value)} placeholder="Amar Ujala · 21 June" className={field} />
          </label>
          <label className="block sm:col-span-2 lg:col-span-1">
            <span className="mb-1.5 block text-[12px] font-bold uppercase tracking-[0.08em] text-slate-500">Headline (in English)</span>
            <input value={headline} onChange={(e) => setHeadline(e.target.value)} placeholder="UP Host win the National Cricket League" className={field} />
          </label>
        </div>
      ) : null}

      <label
        htmlFor={inputId}
        onDragOver={(e) => {
          e.preventDefault();
          setDrag(true);
        }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDrag(false);
          if (!busy) choose(e.dataTransfer.files);
        }}
        className={cn(
          "flex cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed px-6 py-10 text-center transition",
          drag ? "border-royal bg-royal/[0.06]" : "border-line bg-surface/60 hover:border-royal/40 hover:bg-royal/[0.03]",
          busy && "pointer-events-none opacity-70",
        )}
      >
        <span className="grid size-14 place-items-center rounded-2xl bg-white text-royal shadow-sm ring-1 ring-line">
          {busy ? <LoaderCircle className="size-7 animate-spin" aria-hidden="true" /> : <UploadCloud className="size-7" aria-hidden="true" />}
        </span>
        <span>
          <span className="block font-heading text-lg font-bold text-navy">
            {busy ? "Uploading…" : props.mode === "album" ? "Drag photos here, or click to choose" : "Drag the scan here, or click to choose"}
          </span>
          <span className="mt-1 block text-sm text-slate-500">
            JPG, PNG or WebP · up to {MAX_FILES} at a time · big photos are shrunk automatically{props.mode === "album" ? " · uploading starts straight away" : ""}
          </span>
        </span>
        <input
          ref={inputRef}
          id={inputId}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/*"
          multiple
          className="sr-only"
          disabled={busy}
          onChange={(e) => e.target.files && choose(e.target.files)}
        />
      </label>

      {items.length ? (
        <ul className="grid grid-cols-3 gap-2 sm:grid-cols-5 lg:grid-cols-8">
          {items.map((it) => (
            <li key={it.key} className="relative aspect-square overflow-hidden rounded-xl bg-surface ring-1 ring-line" title={it.error ?? it.file.name}>
              {/* eslint-disable-next-line @next/next/no-img-element -- local preview of a file that isn't uploaded yet */}
              <img src={it.preview} alt="" className={cn("size-full object-cover", it.state !== "done" && "opacity-60")} />
              <span className="absolute inset-0 grid place-items-center">
                {it.state === "working" ? <LoaderCircle className="size-6 animate-spin text-navy" aria-label="Uploading" /> : null}
                {it.state === "done" ? <CheckCircle2 className="size-7 rounded-full bg-white text-emerald-600" aria-label="Uploaded" /> : null}
                {it.state === "error" ? <AlertCircle className="size-7 rounded-full bg-white text-ball" aria-label={it.error ?? "Failed"} /> : null}
              </span>
            </li>
          ))}
        </ul>
      ) : null}

      {props.mode === "press" ? (
        <button type="button" disabled={busy || !waiting.length} onClick={() => upload(waiting)} className={cn(buttonBase, buttonTones.gold, "disabled:cursor-not-allowed")}>
          <ImagePlus className="size-4" aria-hidden="true" />
          {waiting.length ? `Add ${waiting.length} ${waiting.length === 1 ? "clipping" : "clippings"}` : "Choose a scan first"}
        </button>
      ) : null}
      {items.some((i) => i.state === "error") ? (
        <p className="text-sm font-semibold text-ball">Some files didn&apos;t upload: hover a red mark to see why, then try those again.</p>
      ) : null}
    </div>
  );
}
