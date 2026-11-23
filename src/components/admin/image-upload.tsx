"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { ImageIcon, LoaderCircle, Trash2, Upload, UserRound } from "lucide-react";
import { toast } from "sonner";
import { AdminForm } from "@/components/admin/admin-form";
import { buttonBase, buttonTones } from "@/components/admin/styles";
import { bucket, shrink } from "@/components/admin/upload-utils";
import { prepareImageUpload, removeImage, saveImage, type ImageKind } from "@/lib/admin/actions/content";
import { cn } from "@/lib/utils";

/**
 * One photo for a news story (wide cover) or a person (round portrait): shrunk in the browser, uploaded
 * straight to storage, then recorded on the item. Replacing a photo deletes the old upload.
 */
export function ImageUpload({ kind, id, src, shape = "round" }: { kind: ImageKind; id: string; src?: string | null; shape?: "round" | "wide" }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);

  async function upload(file: File) {
    if (!file.type.startsWith("image/")) {
      toast.error("Choose a photo (JPG, PNG or WebP).");
      return;
    }
    setBusy(true);
    try {
      const prep = await shrink(file, kind === "news" ? 2000 : 900);
      const link = await prepareImageUpload(kind, id, prep.type);
      if (!link.ok || !link.path || !link.token) {
        toast.error(link.message || "Couldn't start the upload.");
        return;
      }
      const { error } = await bucket("media").uploadToSignedUrl(link.path, link.token, prep.blob, { contentType: prep.type, cacheControl: "31536000" });
      if (error) {
        toast.error("Upload failed. Check your connection and try again.");
        return;
      }
      const result = await saveImage(kind, id, link.path);
      if (result.ok) toast.success(result.message);
      else toast.error(result.message);
    } catch {
      toast.error("Can't read this image (try saving it as JPG).");
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  const Placeholder = shape === "round" ? UserRound : ImageIcon;

  return (
    <div className={cn("flex gap-4", shape === "wide" ? "flex-col sm:flex-row sm:items-center" : "items-center")}>
      <div
        className={cn(
          "relative shrink-0 overflow-hidden bg-surface ring-1 ring-line",
          shape === "round" ? "size-20 rounded-full" : "aspect-[16/9] w-full max-w-72 rounded-xl sm:w-60",
        )}
      >
        {src ? (
          <Image src={src} alt="" fill sizes={shape === "round" ? "80px" : "288px"} className="object-cover object-top" />
        ) : (
          <span className="grid size-full place-items-center text-slate-300">
            <Placeholder className={shape === "round" ? "size-8" : "size-10"} aria-hidden="true" />
          </span>
        )}
        {busy ? (
          <span className="absolute inset-0 grid place-items-center bg-white/70">
            <LoaderCircle className="size-6 animate-spin text-navy" aria-label="Uploading" />
          </span>
        ) : null}
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <label className={cn(buttonBase, buttonTones.quiet, "h-9 cursor-pointer px-3 text-[13px] focus-within:ring-4 focus-within:ring-royal/30", busy && "pointer-events-none opacity-70")}>
          <Upload className="size-4" aria-hidden="true" />
          {busy ? "Uploading…" : src ? "Change photo" : "Add photo"}
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/*"
            className="sr-only"
            disabled={busy}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) void upload(file);
            }}
          />
        </label>
        {src && !busy ? (
          <AdminForm
            action={removeImage.bind(null, kind, id)}
            submitLabel={
              <>
                <Trash2 className="size-4" aria-hidden="true" />
                Remove
              </>
            }
            pendingLabel="…"
            tone="quiet"
            small
            inline={false}
          />
        ) : null}
      </div>
    </div>
  );
}
