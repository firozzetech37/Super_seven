import type { Status } from "@/lib/data/locations";

export type { Status };

/** One projected shape, ready to draw: an SVG path plus its centroid in viewBox units. */
export type Shape = {
  slug: string;
  name: string;
  code?: string;
  d: string;
  cx: number;
  cy: number;
};

export type MapData = {
  width: number;
  height: number;
  shapes: Shape[];
  /** Outline of the parent area (the state) drawn around its districts. */
  outline?: string;
};

export type StateInfo = { name: string; slug: string; code: string; districts: number };
