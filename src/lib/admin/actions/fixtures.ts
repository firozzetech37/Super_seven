"use server";

import { refresh, updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin/auth";
import {
  csvToRows,
  fixtureSchema,
  normaliseDate,
  normaliseStage,
  normaliseTime,
  resultSchema,
  tournamentSchema,
} from "@/lib/admin/fixtures-input";
import { dbMessage, done, failed, fields, slugify, zodErrors, type ActionResult } from "@/lib/admin/result";

/** Public pages (ticker, fixtures, tournament pages, league tables) read fixtures under this tag. */
function published() {
  updateTag("fixtures");
  refresh();
}

/* ---------- Tournaments ---------- */

export async function saveTournament(id: string | null, _prev: ActionResult, formData: FormData): Promise<ActionResult> {
  const { db } = await requireAdmin();
  const parsed = tournamentSchema.safeParse(fields(formData));
  if (!parsed.success) return failed("Please check the highlighted fields.", zodErrors(parsed.error));
  const t = parsed.data;
  const row = {
    name: t.name,
    short_name: t.short_name ?? null,
    slug: t.slug ?? slugify(t.short_name ?? `${t.name} ${t.season ?? t.start_date?.slice(0, 4) ?? ""}`),
    city: t.city ?? null,
    state_code: t.state_code ?? null,
    venue: t.venue ?? null,
    season: t.season ?? t.start_date?.slice(0, 4) ?? null,
    start_date: t.start_date ?? null,
    end_date: t.end_date ?? null,
    format: t.format ?? null,
    notes: t.notes ?? null,
  };

  if (id) {
    const { error } = await db.from("tournaments").update(row).eq("id", id);
    if (error) return failed(dbMessage(error), error.code === "23505" ? { slug: "Another tournament already uses this web address" } : undefined);
    published();
    return done("Tournament saved. The public page is updated.");
  }

  const { data, error } = await db.from("tournaments").insert(row).select("id").single();
  if (error || !data) return failed(dbMessage(error), error?.code === "23505" ? { slug: "Another tournament already uses this web address" } : undefined);
  updateTag("fixtures");
  redirect(`/admin/fixtures/${data.id}?created=1`);
}

export async function deleteTournament(id: string, _prev: ActionResult, formData: FormData): Promise<ActionResult> {
  const { db } = await requireAdmin();
  if (formData.get("confirm") !== "on") return failed("Tick the box to confirm. This deletes every match and result in it.", { confirm: "Tick to confirm" });
  const { error } = await db.from("tournaments").delete().eq("id", id);
  if (error) return failed(dbMessage(error));
  updateTag("fixtures");
  redirect("/admin/fixtures?deleted=1");
}

/* ---------- Fixtures ---------- */

export async function saveFixture(tournamentId: string, fixtureId: string | null, _prev: ActionResult, formData: FormData): Promise<ActionResult> {
  const { db } = await requireAdmin();
  const parsed = fixtureSchema.safeParse(fields(formData));
  if (!parsed.success) return failed("Please check the highlighted fields.", zodErrors(parsed.error));
  const f = parsed.data;
  const row = {
    tournament_id: tournamentId,
    stage: f.stage,
    group_name: f.group_name?.toUpperCase() ?? null,
    match_no: f.match_no ?? null,
    label: f.label ?? null,
    team_a: f.team_a,
    team_b: f.team_b,
    match_date: f.match_date ?? null,
    match_time: f.match_time ?? null,
    venue: f.venue ?? null,
    status: f.status,
  };
  const { error } = fixtureId ? await db.from("fixtures").update(row).eq("id", fixtureId) : await db.from("fixtures").insert(row);
  if (error) return failed(dbMessage(error));
  published();
  return done(fixtureId ? "Match updated." : `Added ${f.team_a} v ${f.team_b}.`);
}

export async function deleteFixture(fixtureId: string): Promise<ActionResult> {
  const { db } = await requireAdmin();
  const { error } = await db.from("fixtures").delete().eq("id", fixtureId);
  if (error) return failed(dbMessage(error));
  published();
  return done("Match deleted.");
}

/* ---------- Results ---------- */

export async function saveResult(fixtureId: string, _prev: ActionResult, formData: FormData): Promise<ActionResult> {
  const { db } = await requireAdmin();
  const parsed = resultSchema.safeParse(fields(formData));
  if (!parsed.success) return failed("Please check the highlighted fields.", zodErrors(parsed.error));
  const r = parsed.data;

  let winner: "a" | "b" | "tie" | null = null;
  if (r.winner === "a" || r.winner === "b" || r.winner === "tie") winner = r.winner;
  if (r.winner === "auto" && r.status === "completed") {
    if (r.score_a === undefined || r.score_b === undefined) {
      return failed("Enter both scores, or pick the winner yourself.", { winner: "Pick the winner, or enter both scores" });
    }
    winner = r.score_a > r.score_b ? "a" : r.score_b > r.score_a ? "b" : "tie";
  }
  if (r.status === "walkover" && (winner === null || winner === "tie")) {
    return failed("A walkover needs a winner.", { winner: "Choose who was given the walkover" });
  }

  const { error: resultError } = await db.from("results").upsert(
    {
      fixture_id: fixtureId,
      score_a: r.score_a ?? null,
      wickets_a: r.wickets_a ?? null,
      overs_a: r.overs_a ? Number(r.overs_a) : null,
      score_b: r.score_b ?? null,
      wickets_b: r.wickets_b ?? null,
      overs_b: r.overs_b ? Number(r.overs_b) : null,
      winner,
      margin: r.margin ?? null,
      man_of_match: r.man_of_match ?? null,
      notes: r.notes ?? null,
    },
    { onConflict: "fixture_id" },
  );
  if (resultError) return failed(dbMessage(resultError));

  const { error } = await db.from("fixtures").update({ status: r.status }).eq("id", fixtureId);
  if (error) return failed(dbMessage(error));
  published();
  return done(r.status === "live" ? "Live score saved." : "Result saved. League tables are recalculated.");
}

export async function clearResult(fixtureId: string): Promise<ActionResult> {
  const { db } = await requireAdmin();
  const { error } = await db.from("results").delete().eq("fixture_id", fixtureId);
  if (error) return failed(dbMessage(error));
  await db.from("fixtures").update({ status: "scheduled" }).eq("id", fixtureId);
  published();
  return done("Result removed; the match is back to scheduled.");
}

/* ---------- CSV import ---------- */

export async function importFixtures(tournamentId: string, _prev: ActionResult, formData: FormData): Promise<ActionResult> {
  const { db } = await requireAdmin();
  const file = formData.get("file");
  let text = String(formData.get("pasted") ?? "");
  if (file instanceof File && file.size > 0) {
    if (file.size > 512 * 1024) return failed("That file is over 512 KB. Save it as CSV (not Excel) and try again.");
    if (/\.xlsx?$/i.test(file.name)) return failed("That's an Excel file. In Excel choose File → Save As → CSV, then upload the .csv file.");
    text = await file.text();
  }
  if (!text.trim()) return failed("Choose a CSV file, or paste the rows into the box.", { file: "Choose a file or paste rows" });

  const { rows, error } = csvToRows(text);
  if (error) return failed(error);
  if (rows.length > 300) return failed("That's more than 300 matches. Split the file and import it in parts.");

  const problems: string[] = [];
  const valid: Record<string, unknown>[] = [];
  for (const { line, values } of rows) {
    const stage = normaliseStage(values.stage);
    const date = normaliseDate(values.match_date);
    const time = normaliseTime(values.match_time);
    if (stage === null) problems.push(`Line ${line}: stage "${values.stage}" isn't one of league, quarter-final, semi-final, third place, final, friendly.`);
    if (date === null) problems.push(`Line ${line}: date "${values.match_date}" isn't a date (use 2026-12-05 or 05/12/2026).`);
    if (time === null) problems.push(`Line ${line}: time "${values.match_time}" isn't a time (use 18:00 or 6:00 PM).`);
    const parsed = fixtureSchema.safeParse({ ...values, stage: stage ?? "league", match_date: date ?? undefined, match_time: time ?? undefined, status: "scheduled" });
    if (!parsed.success) {
      problems.push(`Line ${line}: ${parsed.error.issues.map((i) => i.message.toLowerCase()).join(", ")}.`);
      continue;
    }
    if (stage === null || date === null || time === null) continue;
    const f = parsed.data;
    valid.push({
      tournament_id: tournamentId,
      stage: f.stage,
      group_name: f.group_name?.toUpperCase() ?? null,
      match_no: f.match_no ?? null,
      label: f.label ?? null,
      team_a: f.team_a,
      team_b: f.team_b,
      match_date: f.match_date ?? null,
      match_time: f.match_time ?? null,
      venue: f.venue ?? null,
      status: "scheduled",
    });
  }

  if (problems.length) {
    const shown = problems.slice(0, 6).join(" ");
    return failed(`Nothing was imported. Fix ${problems.length === 1 ? "this line" : `these ${problems.length} problems`} and upload again. ${shown}${problems.length > 6 ? " …" : ""}`);
  }
  const { error: insertError } = await db.from("fixtures").insert(valid);
  if (insertError) return failed(`Nothing was imported. ${dbMessage(insertError)}`);
  published();
  return done(`Imported ${valid.length} ${valid.length === 1 ? "match" : "matches"}.`);
}
