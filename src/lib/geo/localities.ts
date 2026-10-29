import { cacheLife, cacheTag } from "next/cache";
import { hooghlyLocalities, type Status } from "@/lib/data/locations";
import { hasSupabase, supabasePublic } from "@/lib/supabase/server";
import { slugify } from "./status";

export type Locality = {
  slug: string;
  name: string;
  status: Status;
  stateCode: string;
  districtSlug: string;
  association?: string | null;
  teamsCount?: number | null;
  playersCount?: number | null;
  groundName?: string | null;
  groundAddress?: string | null;
  lat?: number | null;
  lng?: number | null;
  contactName?: string | null;
  contactPhone?: string | null;
  contactEmail?: string | null;
  nextFixture?: string | null;
  sample: boolean;
};

const fromDb: Record<string, Status> = { onboarded: "onboarded", in_discussion: "talks", not_reached: "unreached" };

/** Sample localities for Hooghly (West Bengal) until the localities table has real rows. */
const sample: Locality[] = hooghlyLocalities.map((l) => ({
  slug: slugify(l.name),
  name: l.name,
  status: l.status,
  stateCode: "WB",
  districtSlug: "hooghly",
  sample: true,
  ...(l.name === "Dankuni"
    ? {
        association: "Hooghly District Super Seven Association",
        teamsCount: 6,
        playersCount: 84,
        groundName: "Dankuni ground (to confirm)",
        groundAddress: "Dankuni, Hooghly, West Bengal",
        lat: 22.6806,
        lng: 88.2906,
        contactName: "Name to be added",
        contactPhone: null,
        contactEmail: "coo@sscfi.org",
        nextFixture: "District Cup, date to be announced",
      }
    : {}),
}));

type Row = {
  slug: string;
  name: string;
  status: keyof typeof fromDb;
  state_code: string;
  district_slug: string;
  association_name: string | null;
  teams_count: number | null;
  players_count: number | null;
  ground_name: string | null;
  ground_address: string | null;
  lat: number | null;
  lng: number | null;
  contact_name: string | null;
  contact_phone: string | null;
  contact_email: string | null;
  next_fixture: string | null;
  is_sample: boolean;
};

const fromRow = (r: Row): Locality => ({
  slug: r.slug,
  name: r.name,
  status: fromDb[r.status] ?? "unreached",
  stateCode: r.state_code,
  districtSlug: r.district_slug,
  association: r.association_name,
  teamsCount: r.teams_count,
  playersCount: r.players_count,
  groundName: r.ground_name,
  groundAddress: r.ground_address,
  lat: r.lat,
  lng: r.lng,
  contactName: r.contact_name,
  contactPhone: r.contact_phone,
  contactEmail: r.contact_email,
  nextFixture: r.next_fixture,
  sample: r.is_sample,
});

/** Localities of a district: from the localities table when it exists, else the Hooghly sample. */
export async function getLocalities(stateCode: string, districtSlug: string): Promise<Locality[]> {
  "use cache";
  cacheLife("minutes");
  cacheTag("localities");
  if (hasSupabase) {
    const { data, error } = await supabasePublic()
      .from("localities")
      .select("*")
      .eq("state_code", stateCode)
      .eq("district_slug", districtSlug)
      .order("name")
      .returns<Row[]>();
    if (!error && data?.length) return data.map(fromRow);
    if (!error) return [];
  }
  return sample.filter((l) => l.stateCode === stateCode && l.districtSlug === districtSlug);
}

export async function getLocality(stateCode: string, districtSlug: string, slug: string): Promise<Locality | null> {
  const list = await getLocalities(stateCode, districtSlug);
  return list.find((l) => l.slug === slug) ?? null;
}

/** Known locality routes for prerendering (sample ones always; database ones when configured). */
export async function listLocalityParams(): Promise<{ stateCode: string; districtSlug: string; slug: string }[]> {
  const base = sample.map((l) => ({ stateCode: l.stateCode, districtSlug: l.districtSlug, slug: l.slug }));
  if (!hasSupabase) return base;
  const { data, error } = await supabasePublic().from("localities").select("state_code, district_slug, slug").returns<Pick<Row, "state_code" | "district_slug" | "slug">[]>();
  if (error || !data?.length) return base;
  return data.map((r) => ({ stateCode: r.state_code, districtSlug: r.district_slug, slug: r.slug }));
}
