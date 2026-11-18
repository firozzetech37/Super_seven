"use server";

import { refresh, updateTag } from "next/cache";
import { requireAdmin } from "@/lib/admin/auth";
import { dbMessage, done, failed, type ActionResult } from "@/lib/admin/result";
import { getDistrictList, stateByCode } from "@/lib/geo/load";

export type Kind = "players" | "teams" | "associations";
const kinds: Kind[] = ["players", "teams", "associations"];

/** Approve a player: the database issues the next Player ID for their state (00001-WB, 00002-WB, …) in one step. */
export async function approvePlayer(id: string): Promise<ActionResult> {
  const { db, email } = await requireAdmin();
  const { data, error } = await db.rpc("issue_player_id", { p_player: id, p_reviewer: email });
  if (error) return failed(dbMessage(error, "Could not approve. Please try again."));
  updateTag("players");
  refresh();
  return done(`Approved. Player ID ${data as string} is now in the public directory.`);
}

export async function approveTeam(id: string): Promise<ActionResult> {
  const { db, email } = await requireAdmin();
  const { error } = await db.from("teams").update({ status: "approved", reviewed_by: email, reviewed_at: new Date().toISOString() }).eq("id", id);
  if (error) return failed(dbMessage(error));
  refresh();
  return done("Team approved. Its name now appears in the fixture team list.");
}

/** Approve a district association; optionally mark its district "onboarded" (green) on the public map. */
export async function approveAssociation(id: string, _prev: ActionResult, formData: FormData): Promise<ActionResult> {
  const { db, email } = await requireAdmin();
  const { data: row, error: readError } = await db
    .from("associations")
    .select("state_code, district_name, district_id")
    .eq("id", id)
    .single<{ state_code: string; district_name: string; district_id: string | null }>();
  if (readError || !row) return failed(dbMessage(readError));

  let districtId = row.district_id;
  if (formData.get("onboard") === "on") {
    const state = stateByCode.get(row.state_code);
    const slug = String(formData.get("district_slug") ?? "");
    const match = state ? (await getDistrictList(state.slug)).find((d) => d.slug === slug) : undefined;
    if (!match) return failed("Choose the district on the map that this association covers.", { district_slug: "Choose a district" });
    const { data: district, error } = await db
      .from("districts")
      .upsert({ state_code: row.state_code, name: match.name, slug: match.slug, status: "onboarded" }, { onConflict: "state_code,slug" })
      .select("id")
      .single<{ id: string }>();
    if (error) return failed(dbMessage(error, "Approved nothing: the district could not be updated."));
    districtId = district.id;
    updateTag("districts");
  }

  const { error } = await db
    .from("associations")
    .update({ status: "approved", district_id: districtId, reviewed_by: email, reviewed_at: new Date().toISOString() })
    .eq("id", id);
  if (error) return failed(dbMessage(error));
  refresh();
  return done(formData.get("onboard") === "on" ? "Approved, and the district is now green on the map." : "Approved.");
}

export async function rejectRegistration(kind: Kind, id: string, _prev: ActionResult, formData: FormData): Promise<ActionResult> {
  if (!kinds.includes(kind)) return failed("Unknown registration type.");
  const { db, email } = await requireAdmin();
  const note = String(formData.get("note") ?? "").trim().slice(0, 500);
  if (note.length < 3) return failed("Add a short reason; it stays on the record.", { note: "Add a short reason" });
  const { error } = await db
    .from(kind)
    .update({ status: "rejected", review_note: note, reviewed_by: email, reviewed_at: new Date().toISOString() })
    .eq("id", id);
  if (error) return failed(dbMessage(error));
  refresh();
  return done("Marked as rejected.");
}

/** Move a rejected (or approved team/association) back to the pending queue. Approved players keep their ID. */
export async function reopenRegistration(kind: Kind, id: string): Promise<ActionResult> {
  if (!kinds.includes(kind)) return failed("Unknown registration type.");
  const { db } = await requireAdmin();
  let query = db.from(kind).update({ status: "pending" }).eq("id", id);
  if (kind === "players") query = query.is("player_id", null);
  const { error } = await query;
  if (error) return failed(dbMessage(error));
  refresh();
  return done("Moved back to pending.");
}
