import { cacheLife } from "next/cache";
import { geoMercator } from "d3-geo";
import type { Feature, FeatureCollection, MultiPolygon, Polygon, Position } from "geojson";
import manifest from "@/data/geo/manifest.json";
import indiaStates from "@/data/geo/india-states.json";
import type { MapData, Shape, StateInfo } from "./types";

type Props = { name: string; slug: string; code?: string; state?: string };
type Geom = Polygon | MultiPolygon;
type FC = FeatureCollection<Geom, Props>;

const PAD = 12;

export const states: StateInfo[] = manifest.states.map((s) => ({ name: s.state, slug: s.slug, code: s.code, districts: s.districts }));
export const stateBySlug = new Map(states.map((s) => [s.slug, s]));
export const stateByCode = new Map(states.map((s) => [s.code, s]));

async function districtsOf(stateSlug: string): Promise<FC> {
  const mod = await import(`@/data/geo/districts/${stateSlug}.json`);
  return mod.default as FC;
}

const polygonsOf = (g: Geom): Position[][][] => (g.type === "Polygon" ? [g.coordinates] : g.coordinates);

/**
 * Mercator projection fitted to the features' bounding box. Done by hand (not geoPath) so polygon
 * winding never matters and the output paths stay compact: plain M/L segments, one decimal place.
 */
function fitProjection(fc: FC, width: number, height: number) {
  let minLng = Infinity, minLat = Infinity, maxLng = -Infinity, maxLat = -Infinity;
  for (const f of fc.features) {
    for (const poly of polygonsOf(f.geometry)) {
      for (const [lng, lat] of poly[0]) {
        if (lng < minLng) minLng = lng;
        if (lng > maxLng) maxLng = lng;
        if (lat < minLat) minLat = lat;
        if (lat > maxLat) maxLat = lat;
      }
    }
  }
  const proj = geoMercator().scale(1).translate([0, 0]);
  const [x0, y0] = proj([minLng, maxLat]) as [number, number];
  const [x1, y1] = proj([maxLng, minLat]) as [number, number];
  const s = Math.min((width - 2 * PAD) / (x1 - x0), (height - 2 * PAD) / (y1 - y0));
  proj.scale(s).translate([(width - s * (x0 + x1)) / 2, (height - s * (y0 + y1)) / 2]);
  return proj;
}

const r1 = (n: number) => Math.round(n * 10) / 10;

function shapeOf(f: Feature<Geom, Props>, proj: ReturnType<typeof geoMercator>): Shape {
  let d = "";
  let best: { area: number; cx: number; cy: number } = { area: -1, cx: 0, cy: 0 };
  for (const poly of polygonsOf(f.geometry)) {
    poly.forEach((ring, ringIndex) => {
      const pts: [number, number][] = [];
      for (const pos of ring) {
        const p = proj([pos[0], pos[1]]);
        if (!p) continue;
        const x = r1(p[0]), y = r1(p[1]);
        const last = pts[pts.length - 1];
        if (!last || last[0] !== x || last[1] !== y) pts.push([x, y]);
      }
      if (pts.length < 3) return;
      d += pts.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x} ${y}`).join("") + "Z";
      if (ringIndex === 0) {
        // Shoelace area and centroid of the outer ring; the largest ring positions the label.
        let a = 0, cx = 0, cy = 0;
        for (let i = 0; i < pts.length; i++) {
          const [x0, y0] = pts[i], [x1, y1] = pts[(i + 1) % pts.length];
          const cross = x0 * y1 - x1 * y0;
          a += cross; cx += (x0 + x1) * cross; cy += (y0 + y1) * cross;
        }
        const area = Math.abs(a) / 2;
        if (area > best.area && a !== 0) best = { area, cx: cx / (3 * a), cy: cy / (3 * a) };
      }
    });
  }
  return { slug: f.properties.slug, name: f.properties.name, code: f.properties.code, d, cx: r1(best.cx), cy: r1(best.cy) };
}

/** India with its 36 states and union territories. */
export async function getIndiaMap(width = 760, height = 800): Promise<MapData> {
  "use cache";
  cacheLife("max");
  const fc = indiaStates as FC;
  const proj = fitProjection(fc, width, height);
  return { width, height, shapes: fc.features.map((f) => shapeOf(f, proj)) };
}

/** One state with its districts, plus the state outline. Returns null for an unknown slug. */
export async function getStateMap(stateSlug: string, width = 760, height = 720): Promise<MapData | null> {
  "use cache";
  cacheLife("max");
  if (!stateBySlug.has(stateSlug)) return null;
  const fc = await districtsOf(stateSlug);
  const proj = fitProjection(fc, width, height);
  const state = (indiaStates as FC).features.find((f) => f.properties.slug === stateSlug);
  return { width, height, shapes: fc.features.map((f) => shapeOf(f, proj)), outline: state ? shapeOf(state, proj).d : undefined };
}

/** District names and slugs for a state (for lists and static params). */
export async function getDistrictList(stateSlug: string): Promise<{ slug: string; name: string }[]> {
  "use cache";
  cacheLife("max");
  if (!stateBySlug.has(stateSlug)) return [];
  const fc = await districtsOf(stateSlug);
  return fc.features.map((f) => ({ slug: f.properties.slug, name: f.properties.name })).sort((a, b) => a.name.localeCompare(b.name));
}
