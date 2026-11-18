import { z } from "zod";

/* Field rules shared by the tournament, fixture and result forms and the CSV import. */

export const stageOptions = [
  { value: "league", label: "League / group" },
  { value: "quarter", label: "Quarter-final" },
  { value: "semi", label: "Semi-final" },
  { value: "third", label: "Third place" },
  { value: "final", label: "Final" },
  { value: "friendly", label: "Friendly" },
] as const;

export const statusOptions = [
  { value: "scheduled", label: "Scheduled" },
  { value: "live", label: "Live now" },
  { value: "completed", label: "Completed" },
  { value: "walkover", label: "Walkover" },
  { value: "abandoned", label: "Abandoned" },
] as const;

export const stageLabel = Object.fromEntries(stageOptions.map((s) => [s.value, s.label])) as Record<string, string>;
export const stageOrder = ["league", "quarter", "semi", "third", "final", "friendly"];

const stageAliases: Record<string, string> = {
  league: "league", group: "league", "league / group": "league", "group stage": "league", pool: "league",
  quarter: "quarter", "quarter-final": "quarter", "quarter final": "quarter", quarterfinal: "quarter", qf: "quarter",
  semi: "semi", "semi-final": "semi", "semi final": "semi", semifinal: "semi", sf: "semi",
  third: "third", "third place": "third", "3rd place": "third", "3rd": "third", "third-place": "third", playoff: "third",
  final: "final", f: "final",
  friendly: "friendly", exhibition: "friendly",
};

export function normaliseStage(value?: string): string | null {
  if (!value) return "league";
  return stageAliases[value.trim().toLowerCase()] ?? null;
}

/** ISO date from YYYY-MM-DD, DD/MM/YYYY, DD-MM-YYYY or DD.MM.YY (Indian order; MM/DD only when the day can't be a month). */
export function normaliseDate(value?: string): string | null | undefined {
  if (!value) return undefined;
  const v = value.trim();
  let y: number, m: number, d: number;
  let match = v.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
  if (match) {
    [y, m, d] = [Number(match[1]), Number(match[2]), Number(match[3])];
  } else if ((match = v.match(/^(\d{1,2})[/.-](\d{1,2})[/.-](\d{2}|\d{4})$/))) {
    let a = Number(match[1]);
    let b = Number(match[2]);
    if (b > 12 && a <= 12) [a, b] = [b, a];
    [d, m, y] = [a, b, Number(match[3])];
    if (y < 100) y += 2000;
  } else {
    return null;
  }
  const date = new Date(Date.UTC(y, m - 1, d));
  if (date.getUTCFullYear() !== y || date.getUTCMonth() !== m - 1 || date.getUTCDate() !== d) return null;
  return date.toISOString().slice(0, 10);
}

/** HH:MM from 18:00, 18.00, 6:00 PM, 6 pm or 0600. */
export function normaliseTime(value?: string): string | null | undefined {
  if (!value) return undefined;
  const v = value.trim().toLowerCase().replace(/\s+/g, " ");
  const match = v.match(/^(\d{1,2})(?:[:.](\d{2}))?(?::\d{2})? ?(am|pm|a\.m\.|p\.m\.)?$/) ?? v.match(/^(\d{2})(\d{2})$/);
  if (!match) return null;
  let h = Number(match[1]);
  const min = Number(match[2] ?? 0);
  const ampm = match[3]?.replace(/\./g, "");
  if (ampm === "pm" && h < 12) h += 12;
  if (ampm === "am" && h === 12) h = 0;
  if (h > 23 || min > 59) return null;
  return `${String(h).padStart(2, "0")}:${String(min).padStart(2, "0")}`;
}

const optionalText = (max: number) => z.string().trim().max(max).optional();

export const tournamentSchema = z
  .object({
    name: z.string({ message: "Enter the tournament name" }).trim().min(3, "Enter the tournament name").max(140),
    short_name: optionalText(60),
    slug: z
      .string()
      .trim()
      .max(80)
      .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers and dashes")
      .optional(),
    city: optionalText(80),
    state_code: z.string().trim().length(2).optional(),
    venue: optionalText(160),
    season: optionalText(20),
    start_date: z.iso.date("Use the date picker").optional(),
    end_date: z.iso.date("Use the date picker").optional(),
    format: optionalText(600),
    notes: optionalText(1200),
  })
  .refine((t) => !t.start_date || !t.end_date || t.end_date >= t.start_date, { message: "Ends before it starts", path: ["end_date"] });

export const fixtureSchema = z
  .object({
    stage: z.enum(["league", "quarter", "semi", "third", "final", "friendly"], { message: "Choose a stage" }),
    group_name: z.string().trim().max(20).optional(),
    match_no: z.coerce.number({ message: "A whole number" }).int("A whole number").min(1).max(9999).optional(),
    label: optionalText(80),
    team_a: z.string({ message: "Enter team A" }).trim().min(2, "Enter team A").max(80),
    team_b: z.string({ message: "Enter team B" }).trim().min(2, "Enter team B").max(80),
    match_date: z.iso.date("Use the date picker").optional(),
    match_time: z
      .string()
      .regex(/^\d{2}:\d{2}$/, "Use HH:MM")
      .optional(),
    venue: optionalText(160),
    status: z.enum(["scheduled", "live", "completed", "walkover", "abandoned"]).default("scheduled"),
  })
  .refine((f) => f.team_a.toLowerCase() !== f.team_b.toLowerCase(), { message: "A team can't play itself", path: ["team_b"] });

const score = z.coerce.number({ message: "Runs as a number" }).int().min(0, "0 or more").max(999).optional();
const wickets = z.coerce.number({ message: "0 to 7" }).int().min(0, "0 to 7").max(7, "0 to 7").optional();
const overs = z
  .string()
  .trim()
  .regex(/^\d(\.[0-5])?$/, "Like 7 or 6.4")
  .refine((o) => Number(o) <= 7, "At most 7 overs")
  .optional();

export const resultSchema = z.object({
  status: z.enum(["live", "completed", "walkover", "abandoned"], { message: "Choose how the match ended" }),
  score_a: score,
  wickets_a: wickets,
  overs_a: overs,
  score_b: score,
  wickets_b: wickets,
  overs_b: overs,
  winner: z.enum(["auto", "a", "b", "tie", "none"]).default("auto"),
  margin: optionalText(60),
  man_of_match: optionalText(80),
  notes: optionalText(300),
});

/* ---------- CSV import ---------- */

/** Minimal RFC 4180 parser: quotes, escaped quotes, CRLF, a BOM, and comma or semicolon separators. */
export function parseCsv(text: string): string[][] {
  const clean = text.replace(/^﻿/, "");
  const firstLine = clean.split(/\r?\n/, 1)[0] ?? "";
  const sep = (firstLine.match(/;/g)?.length ?? 0) > (firstLine.match(/,/g)?.length ?? 0) ? ";" : firstLine.includes("\t") && !firstLine.includes(",") ? "\t" : ",";
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = "";
  let quoted = false;
  for (let i = 0; i < clean.length; i++) {
    const c = clean[i];
    if (quoted) {
      if (c === '"' && clean[i + 1] === '"') {
        cell += '"';
        i++;
      } else if (c === '"') quoted = false;
      else cell += c;
    } else if (c === '"') quoted = true;
    else if (c === sep) {
      row.push(cell);
      cell = "";
    } else if (c === "\n" || c === "\r") {
      if (c === "\r" && clean[i + 1] === "\n") i++;
      row.push(cell);
      rows.push(row);
      row = [];
      cell = "";
    } else cell += c;
  }
  if (cell !== "" || row.length) {
    row.push(cell);
    rows.push(row);
  }
  return rows.filter((r) => r.some((c) => c.trim() !== ""));
}

const headerAliases: Record<string, string> = {
  matchno: "match_no", match: "match_no", no: "match_no", number: "match_no", "#": "match_no", matchnumber: "match_no",
  stage: "stage", round: "stage",
  group: "group_name", groupname: "group_name", pool: "group_name",
  teama: "team_a", team1: "team_a", home: "team_a", hometeam: "team_a",
  teamb: "team_b", team2: "team_b", away: "team_b", awayteam: "team_b",
  date: "match_date", matchdate: "match_date", day: "match_date",
  time: "match_time", matchtime: "match_time", start: "match_time", starttime: "match_time",
  venue: "venue", ground: "venue",
  label: "label", title: "label", name: "label",
};

export type ImportRow = { line: number; values: Record<string, string | undefined> };

/** Maps spreadsheet columns to fixture fields by header name; returns the rows or a message about the header. */
export function csvToRows(text: string): { rows: ImportRow[]; error?: string } {
  const table = parseCsv(text);
  if (table.length < 2) return { rows: [], error: "The file needs a header row and at least one match." };
  const header = table[0].map((h) => headerAliases[h.trim().toLowerCase().replace(/[\s_.-]+/g, "")] ?? null);
  if (!header.includes("team_a") || !header.includes("team_b")) {
    return { rows: [], error: "Couldn't find the team_a and team_b columns. Start from the template so the headers match." };
  }
  const rows = table.slice(1).map((cells, i) => {
    const values: Record<string, string | undefined> = {};
    header.forEach((key, col) => {
      if (!key) return;
      const v = cells[col]?.trim();
      values[key] = v ? v : undefined;
    });
    return { line: i + 2, values };
  });
  return { rows };
}
