// Build the map data: download India district boundaries, dissolve them into states, simplify, and write
// src/data/geo/india-states.json plus one districts file per state.
//
// Usage: node scripts/geo/build-geo.mjs [download-dir]
// Source: github.com/udit-001/india-maps-data (commit 2884453). Boundaries show India's official outline.
// Confirm the licence and compare against Survey of India maps before launch (see docs/GEO.md).
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { mkdirSync, readFileSync, writeFileSync, existsSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";

const COMMIT = "2884453";
const BASE = `https://raw.githubusercontent.com/udit-001/india-maps-data/${COMMIT}`;
const OUT = resolve("src/data/geo");
const dl = resolve(process.argv[2] ?? join(tmpdir(), "sscfi-geo-download"));
mkdirSync(dl, { recursive: true });
mkdirSync(join(OUT, "districts"), { recursive: true });

const slugify = (s) =>
  s
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

// Must match src/lib/forms.ts stateCodes and the states table.
const stateCodes = {
  "Andaman and Nicobar Islands": "AN", "Andhra Pradesh": "AP", "Arunachal Pradesh": "AR", Assam: "AS", Bihar: "BR",
  Chandigarh: "CH", Chhattisgarh: "CG", "Dadra and Nagar Haveli and Daman and Diu": "DD", Delhi: "DL", Goa: "GA",
  Gujarat: "GJ", Haryana: "HR", "Himachal Pradesh": "HP", "Jammu and Kashmir": "JK", Jharkhand: "JH", Karnataka: "KA",
  Kerala: "KL", Ladakh: "LA", Lakshadweep: "LD", "Madhya Pradesh": "MP", Maharashtra: "MH", Manipur: "MN",
  Meghalaya: "ML", Mizoram: "MZ", Nagaland: "NL", Odisha: "OD", Puducherry: "PY", Punjab: "PB", Rajasthan: "RJ",
  Sikkim: "SK", "Tamil Nadu": "TN", Telangana: "TS", Tripura: "TR", "Uttar Pradesh": "UP", Uttarakhand: "UK", "West Bengal": "WB",
};

async function download(name) {
  const file = join(dl, name.replace(/\//g, "__"));
  if (!existsSync(file)) {
    const res = await fetch(`${BASE}/${name}`);
    if (!res.ok) throw new Error(`${name}: HTTP ${res.status}`);
    writeFileSync(file, Buffer.from(await res.arrayBuffer()));
  }
  return file;
}

function mapshaper(args) {
  execFileSync(resolve("node_modules/.bin/mapshaper"), args, { stdio: ["ignore", "inherit", "inherit"] });
}

const india = await download("geojson/india.geojson");
const raw = JSON.parse(readFileSync(india, "utf8"));
const names = [...new Set(raw.features.map((f) => f.properties.st_nm))].sort();
const unknown = names.filter((n) => !stateCodes[n]);
if (unknown.length) throw new Error(`State names without a code: ${unknown.join(", ")}`);
if (names.length !== 36) throw new Error(`Expected 36 states, found ${names.length}`);

// 1. States: dissolve the 760 districts by state, simplify, keep name/code/slug.
const statesOut = join(OUT, "india-states.json");
mapshaper([
  "-i", india,
  "-dissolve", "st_nm", "copy-fields=st_code",
  "-simplify", "6%", "keep-shapes",
  "-clean",
  "-each", `name=st_nm; code=${JSON.stringify(JSON.stringify(stateCodes))}; code=JSON.parse(code)[st_nm]; slug=name.toLowerCase().replace(/&/g,'and').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,''); delete st_nm; delete st_code`,
  "-o", statesOut, "format=geojson", "precision=0.001", "id-field=slug",
]);

// 2. Districts per state, from the per-state files (post-2017 districts).
const summary = [];
for (const name of names) {
  const slug = slugify(name);
  const srcName = slug === "dadra-and-nagar-haveli-and-daman-and-diu" ? "dnh-and-dd" : slug;
  const file = await download(`geojson/states/${srcName}.geojson`);
  const out = join(OUT, "districts", `${slug}.json`);
  mapshaper([
    "-i", file,
    "-simplify", "10%", "keep-shapes",
    "-clean",
    "-each", `name=district; slug=name.toLowerCase().replace(/&/g,'and').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,''); state=${JSON.stringify(slug)}; delete district; delete dt_code; delete st_code; delete st_nm; delete year`,
    "-o", out, "format=geojson", "precision=0.0005", "id-field=slug",
  ]);
  const json = JSON.parse(readFileSync(out, "utf8"));
  summary.push({ state: name, slug, districts: json.features.length, kb: Math.round(readFileSync(out).length / 1024) });
}

const statesJson = JSON.parse(readFileSync(statesOut, "utf8"));
const manifest = {
  source: `https://github.com/udit-001/india-maps-data/tree/${COMMIT}`,
  builtAt: new Date().toISOString(),
  statesSha256: createHash("sha256").update(readFileSync(statesOut)).digest("hex").slice(0, 16),
  states: summary.map((s) => ({ ...s, code: stateCodes[s.state] })),
};
writeFileSync(join(OUT, "manifest.json"), JSON.stringify(manifest, null, 2));
console.log(`states: ${statesJson.features.length} (${Math.round(readFileSync(statesOut).length / 1024)} KB)`);
for (const s of summary) console.log(`  ${s.state.padEnd(42)} ${String(s.districts).padStart(3)} districts  ${String(s.kb).padStart(4)} KB`);
console.log(`total districts: ${summary.reduce((n, s) => n + s.districts, 0)}`);
