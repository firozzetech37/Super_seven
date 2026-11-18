import { cacheLife, cacheTag } from "next/cache";
import { albums as staticAlbums, clippings as staticClippings, featuredVideo as staticVideo, type Album, type Clipping } from "@/lib/data/gallery";
import { hasSupabase, supabasePublic } from "@/lib/supabase/server";

/*
 * Gallery content managed in /admin/media. Until the media migration is applied (or without Supabase),
 * the gallery that shipped with the site in src/lib/data/gallery.ts is shown instead.
 */

type AlbumRow = {
  slug: string;
  title: string;
  label: string | null;
  description: string | null;
  photos: { src: string; alt: string; width: number; height: number; sort_order: number }[];
};

export async function getAlbums(): Promise<Album[]> {
  "use cache";
  cacheLife("minutes");
  cacheTag("gallery");
  if (!hasSupabase) return staticAlbums;
  const { data, error } = await supabasePublic()
    .from("albums")
    .select("slug, title, label, description, photos(src, alt, width, height, sort_order)")
    .order("sort_order", { ascending: true })
    .order("event_date", { ascending: false, nullsFirst: false })
    .order("created_at", { ascending: false })
    .returns<AlbumRow[]>();
  if (error) return staticAlbums;
  return (data ?? [])
    .filter((a) => a.photos.length)
    .map((a) => ({
      id: a.slug,
      title: a.title,
      description: a.description ?? "",
      year: a.label ?? "",
      photos: [...a.photos].sort((x, y) => x.sort_order - y.sort_order).map(({ src, alt, width, height }) => ({ src, alt, width, height })),
    }));
}

export async function getClippings(): Promise<Clipping[]> {
  "use cache";
  cacheLife("minutes");
  cacheTag("gallery");
  if (!hasSupabase) return staticClippings;
  const { data, error } = await supabasePublic()
    .from("press_clippings")
    .select("year, src, width, height, headline, source")
    .order("year", { ascending: true })
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true })
    .returns<{ year: number; src: string; width: number; height: number; headline: string | null; source: string | null }[]>();
  if (error) return staticClippings;
  return (data ?? []).map((c) => ({
    src: c.src,
    width: c.width,
    height: c.height,
    year: String(c.year),
    source: c.source ?? undefined,
    caption: c.headline ?? undefined,
    alt: `Newspaper clipping${c.source ? ` from ${c.source}` : ""}, ${c.year}${c.headline ? `: ${c.headline}` : ""}`,
  }));
}

/** YouTube video id from a watch, share, shorts or embed link (or a bare id). */
export function youtubeId(input: string): string | null {
  const v = input.trim();
  if (/^[\w-]{11}$/.test(v)) return v;
  try {
    const url = new URL(v);
    if (url.hostname === "youtu.be") return url.pathname.slice(1, 12) || null;
    if (/(^|\.)youtube(-nocookie)?\.com$/.test(url.hostname)) {
      const id = url.searchParams.get("v") ?? url.pathname.match(/\/(?:embed|shorts|live)\/([\w-]{11})/)?.[1];
      return id && /^[\w-]{11}$/.test(id) ? id : null;
    }
  } catch {
    // not a URL
  }
  return null;
}

export async function getFeaturedVideo(): Promise<{ id: string; title: string } | null> {
  "use cache";
  cacheLife("minutes");
  cacheTag("gallery");
  if (!hasSupabase) return staticVideo;
  const { data, error } = await supabasePublic().from("site_settings").select("key, value").in("key", ["featured_video", "featured_video_title"]);
  if (error || !data) return staticVideo;
  const id = youtubeId(data.find((r) => r.key === "featured_video")?.value ?? "");
  if (!id) return null;
  return { id, title: data.find((r) => r.key === "featured_video_title")?.value || "Super Seven cricket" };
}
