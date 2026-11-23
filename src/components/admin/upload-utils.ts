import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/* Browser helpers for admin uploads: files go straight to Supabase Storage through one-time signed links. */

const accepted = ["image/jpeg", "image/png", "image/webp"];

let client: SupabaseClient | undefined;

/** A storage bucket client for uploadToSignedUrl (the signed token authorises the upload, so no session is needed). */
export function bucket(name: "media" | "documents") {
  client ??= createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return client.storage.from(name);
}

export type Prepared = { blob: Blob; width: number; height: number; type: string };

/** Fits the photo inside `max` px (EXIF rotation applied), re-encoded as WebP (JPEG where WebP can't be written). */
export async function shrink(file: File, max: number): Promise<Prepared> {
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
