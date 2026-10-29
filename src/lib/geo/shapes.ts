import type { MapShape } from "@/components/map/choropleth";
import type { MapData } from "./types";
import { districtStatus, stateStatus, type StatusMap } from "./status";

/** India's states as drawable shapes with status and links. */
export function stateShapes(map: MapData, statuses: StatusMap, link = true): MapShape[] {
  return map.shapes.map((s) => ({ ...s, status: stateStatus(statuses, s.slug), href: link ? `/locations/${s.slug}` : undefined }));
}

/** A state's districts as drawable shapes with status and links. */
export function districtShapes(map: MapData, statuses: StatusMap, stateCode: string, stateSlug: string, link = true): MapShape[] {
  return map.shapes.map((s) => ({
    ...s,
    status: districtStatus(statuses, stateCode, s.slug),
    href: link ? `/locations/${stateSlug}/${s.slug}` : undefined,
  }));
}
