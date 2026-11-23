import { cacheLife, cacheTag } from "next/cache";
import { documents as staticDocuments, type DocCategory, type LegacyDocument } from "@/lib/data/documents";
import { newsItems, type NewsItem, type NewsType } from "@/lib/data/news";
import { committees as staticCommittees, leadership as staticLeadership, officeBearers2014, type Committee, type OfficeBearer, type Person } from "@/lib/data/people";
import { officials as staticOfficials, stateUnits as staticStateUnits, type Official, type StateUnit } from "@/lib/data/teams";
import { hasSupabase, supabasePublic } from "@/lib/supabase/server";
import { initialsOf } from "@/lib/utils";

/*
 * Website content managed in the admin area: News (/admin/news), People (/admin/people), State units &
 * officials (/admin/state-units) and Documents (/admin/documents). Until the content migration is applied
 * (or without Supabase), the content that shipped with the site in src/lib/data is shown instead.
 * Admin actions refresh these with updateTag("news" | "people" | "state-units" | "documents").
 */

/* ---------- News ---------- */

export type NewsPost = NewsItem & { /** External or on-site link shown as a button on the story page. */ link?: string };

type NewsRow = {
  slug: string;
  kind: NewsType;
  title: string;
  summary: string;
  body: string | null;
  event_date: string | null;
  link: string | null;
  cover_src: string | null;
  cover_alt: string | null;
  featured: boolean;
  archive: boolean;
  pending: boolean;
};

const toNews = (r: NewsRow): NewsPost => ({
  id: r.slug,
  type: r.kind,
  title: r.title,
  summary: r.summary,
  body: r.body ?? undefined,
  date: r.event_date ?? undefined,
  // A story with a full text opens its own page; otherwise the card follows the optional link.
  href: r.body ? `/news/${r.slug}` : (r.link ?? undefined),
  link: r.link ?? undefined,
  cover: r.cover_src ?? undefined,
  coverAlt: r.cover_alt ?? undefined,
  featured: r.featured,
  archive: r.archive,
  pending: r.pending,
});

const staticNews = (): NewsPost[] => newsItems.map((n) => ({ ...n, link: n.href }));

/** Published stories, newest first (undated "details to follow" stories lead). */
export async function getNews(): Promise<NewsPost[]> {
  "use cache";
  cacheLife("minutes");
  cacheTag("news");
  if (!hasSupabase) return staticNews();
  const { data, error } = await supabasePublic()
    .from("news_posts")
    .select("slug, kind, title, summary, body, event_date, link, cover_src, cover_alt, featured, archive, pending")
    .order("event_date", { ascending: false, nullsFirst: true })
    .order("created_at", { ascending: false })
    .returns<NewsRow[]>();
  if (error) return staticNews();
  return (data ?? []).map(toNews);
}

export async function getNewsPost(slug: string): Promise<NewsPost | null> {
  "use cache";
  cacheLife("minutes");
  cacheTag("news");
  return (await getNews()).find((n) => n.id === slug) ?? null;
}

/* ---------- People ---------- */

type PersonRow = {
  slug: string;
  section: "leadership" | "office_bearer" | "advisory" | "committee" | "core";
  name: string | null;
  role: string;
  state: string | null;
  photo_src: string | null;
  emails: string[];
  phones: string[];
  email_suggested: boolean;
  linkedin: string | null;
  address: string | null;
  from_2014: boolean;
};

/** Published people in their admin order, or null when the table isn't there yet. */
async function peopleRows(): Promise<PersonRow[] | null> {
  "use cache";
  cacheLife("minutes");
  cacheTag("people");
  if (!hasSupabase) return null;
  const { data, error } = await supabasePublic()
    .from("people")
    .select("slug, section, name, role, state, photo_src, emails, phones, email_suggested, linkedin, address, from_2014")
    .order("sort_order")
    .order("created_at")
    .returns<PersonRow[]>();
  return error ? null : (data ?? []);
}

/** President, Secretary and COO cards (About, Contact and the home page). */
export async function getLeadership(): Promise<Person[]> {
  "use cache";
  cacheLife("minutes");
  cacheTag("people");
  const rows = await peopleRows();
  if (!rows) return staticLeadership;
  return rows
    .filter((r) => r.section === "leadership")
    .map((r) => ({
      id: r.slug,
      name: r.name ?? undefined,
      role: r.role,
      group: "leadership",
      email: r.emails[0],
      emailSuggested: r.email_suggested,
      phone: r.phones[0],
      linkedin: r.linkedin ?? undefined,
      photo: r.photo_src ?? undefined,
      state: r.state ?? undefined,
    }));
}

export async function getOfficeBearers(): Promise<OfficeBearer[]> {
  "use cache";
  cacheLife("minutes");
  cacheTag("people");
  const rows = await peopleRows();
  if (!rows) return officeBearers2014.map((p) => ({ ...p, archive: true }));
  return rows
    .filter((r) => r.section === "office_bearer")
    .map((r) => ({
      id: r.slug,
      name: r.name ?? "Name to be added",
      designation: r.role,
      photo: r.photo_src ?? undefined,
      phones: r.phones,
      emails: r.emails,
      address: r.address ?? undefined,
      archive: r.from_2014,
    }));
}

/** The three committees: titles and pages are fixed, members come from the admin. Empty seats show until each list fills up. */
export async function getCommittees(): Promise<Committee[]> {
  "use cache";
  cacheLife("minutes");
  cacheTag("people");
  const rows = await peopleRows();
  if (!rows) return staticCommittees;
  return staticCommittees.map((c) => {
    const members = rows
      .filter((r) => r.section === c.id && r.name)
      .map((r) => ({ initials: initialsOf(r.name!), name: r.name!, role: r.role, state: r.state ?? undefined, photo: r.photo_src ?? undefined }));
    const seats = c.members.length + c.placeholders;
    return { ...c, members, placeholders: Math.max(0, seats - members.length) };
  });
}

/* ---------- State units and match officials ---------- */

export async function getStateUnits(): Promise<StateUnit[]> {
  "use cache";
  cacheLife("minutes");
  cacheTag("state-units");
  if (!hasSupabase) return staticStateUnits;
  const { data, error } = await supabasePublic()
    .from("state_units")
    .select("slug, state, code, officials")
    .order("sort_order")
    .order("created_at")
    .returns<{ slug: string; state: string; code: string; officials: { role?: string; name?: string }[] }[]>();
  if (error) return staticStateUnits;
  return (data ?? []).map((u) => ({
    id: u.slug,
    state: u.state,
    code: u.code,
    officials: (Array.isArray(u.officials) ? u.officials : []).filter((o) => o.name).map((o) => ({ role: o.role ?? "", name: o.name! })),
  }));
}

export async function getOfficials(): Promise<Official[]> {
  "use cache";
  cacheLife("minutes");
  cacheTag("state-units");
  if (!hasSupabase) return staticOfficials;
  const { data, error } = await supabasePublic()
    .from("match_officials")
    .select("slug, name, role, state, photo_src")
    .order("sort_order")
    .order("created_at")
    .returns<{ slug: string; name: string; role: string; state: string | null; photo_src: string | null }[]>();
  if (error) return staticOfficials;
  return (data ?? []).map((o) => ({ id: o.slug, name: o.name, role: o.role, state: o.state ?? undefined, photo: o.photo_src ?? undefined }));
}

/* ---------- Documents ---------- */

export async function getDocuments(): Promise<LegacyDocument[]> {
  "use cache";
  cacheLife("minutes");
  cacheTag("documents");
  if (!hasSupabase) return staticDocuments;
  const { data, error } = await supabasePublic()
    .from("documents")
    .select("slug, title, description, category, year, edition, pages, file_src, featured, read_href")
    .order("sort_order")
    .order("created_at")
    .returns<
      {
        slug: string;
        title: string;
        description: string;
        category: DocCategory;
        year: number | null;
        edition: string | null;
        pages: number | null;
        file_src: string;
        featured: boolean;
        read_href: string | null;
      }[]
    >();
  if (error) return staticDocuments;
  return (data ?? []).map((d) => ({
    id: d.slug,
    title: d.title,
    description: d.description,
    category: d.category,
    year: d.year ?? undefined,
    edition: d.edition ?? undefined,
    pages: d.pages ?? undefined,
    file: d.file_src,
    href: d.file_src,
    featured: d.featured,
    readHref: d.read_href ?? undefined,
  }));
}
