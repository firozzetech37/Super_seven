import { cacheLife, cacheTag } from "next/cache";
import { hooghlyLocalities, westBengalDistricts, type Status } from "@/lib/data/locations";
import { hasSupabase, supabasePublic } from "@/lib/supabase/server";
import { states } from "./load";

export type StatusMap = {
  /** `${stateCode}/${districtSlug}` → status */
  districts: Record<string, Status>;
  /** state slug → status, derived from its districts */
  states: Record<string, Status>;
  /** True while no district has been marked beyond "not reached": the concept's sample colours are shown instead. */
  sample: boolean;
};

const fromDb: Record<string, Status> = { onboarded: "onboarded", in_discussion: "talks", not_reached: "unreached" };
const rank: Record<Status, number> = { onboarded: 2, talks: 1, unreached: 0 };

/** Sample statuses from the concept, used until SSCFI records real district statuses. */
const sampleStates: Record<string, Status> = {
  "west-bengal": "onboarded",
  "uttar-pradesh": "onboarded",
  delhi: "talks",
  maharashtra: "talks",
  gujarat: "talks",
  punjab: "talks",
  "andhra-pradesh": "talks",
  chhattisgarh: "talks",
  uttarakhand: "talks",
  haryana: "talks",
  karnataka: "talks",
};

function sampleMap(): StatusMap {
  const districts: Record<string, Status> = {};
  for (const d of westBengalDistricts) districts[`WB/${slugify(d.name)}`] = d.status;
  districts["UP/amroha"] = "onboarded";
  districts["UP/bulandshahr"] = "talks";
  return { districts, states: { ...sampleStates }, sample: true };
}

export const slugify = (s: string) =>
  s
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

/** District and state statuses, live from the database once any district has a real status. */
export async function getStatusMap(): Promise<StatusMap> {
  "use cache";
  cacheLife("minutes");
  cacheTag("districts");
  if (!hasSupabase) return sampleMap();

  const { data, error } = await supabasePublic()
    .from("districts")
    .select("state_code, slug, status")
    .returns<{ state_code: string; slug: string; status: keyof typeof fromDb }[]>();
  if (error || !data) return sampleMap();

  const live = data.some((d) => d.status !== "not_reached");
  if (!live) return sampleMap();

  const districts: Record<string, Status> = {};
  for (const d of data) districts[`${d.state_code}/${d.slug}`] = fromDb[d.status] ?? "unreached";
  const stateStatus: Record<string, Status> = {};
  for (const s of states) {
    let best: Status = "unreached";
    for (const [key, status] of Object.entries(districts)) {
      if (key.startsWith(`${s.code}/`) && rank[status] > rank[best]) best = status;
    }
    stateStatus[s.slug] = best;
  }
  return { districts, states: stateStatus, sample: false };
}

export function districtStatus(map: StatusMap, stateCode: string, districtSlug: string): Status {
  return map.districts[`${stateCode}/${districtSlug}`] ?? "unreached";
}

export function stateStatus(map: StatusMap, stateSlug: string): Status {
  return map.states[stateSlug] ?? "unreached";
}

export function countByStatus<T>(items: T[], pick: (item: T) => Status) {
  const counts: Record<Status, number> = { onboarded: 0, talks: 0, unreached: 0 };
  for (const item of items) counts[pick(item)] += 1;
  return counts;
}

/** Sample localities keep working through the same helper so pages never special-case them. */
export { hooghlyLocalities };
