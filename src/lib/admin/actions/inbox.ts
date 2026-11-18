"use server";

import { refresh, updateTag } from "next/cache";
import { z } from "zod";
import { requireAdmin } from "@/lib/admin/auth";
import { dbMessage, done, failed, type ActionResult } from "@/lib/admin/result";
import { getDistrictList, stateByCode } from "@/lib/geo/load";
import { hasSupabaseAdmin, supabaseAdmin } from "@/lib/supabase/server";

/* District map status, enquiries, newsletter subscribers and the admin list. */

const districtStatuses = ["not_reached", "in_discussion", "onboarded"] as const;

/** Saves every district whose status changed in the state form (fields `status:<slug>`, originals in `was:<slug>`). */
export async function saveDistrictStatuses(stateCode: string, _prev: ActionResult, formData: FormData): Promise<ActionResult> {
  const { db } = await requireAdmin();
  const state = stateByCode.get(stateCode);
  if (!state) return failed("Unknown state.");
  const list = await getDistrictList(state.slug);
  const names = new Map(list.map((d) => [d.slug, d.name]));

  const changed: { state_code: string; name: string; slug: string; status: string }[] = [];
  for (const [key, value] of formData.entries()) {
    if (!key.startsWith("status:") || typeof value !== "string") continue;
    const slug = key.slice(7);
    if (!names.has(slug) || !districtStatuses.includes(value as (typeof districtStatuses)[number])) continue;
    if (formData.get(`was:${slug}`) === value) continue;
    changed.push({ state_code: stateCode, name: names.get(slug)!, slug, status: value });
  }
  if (!changed.length) return done("Nothing changed.");

  const { error } = await db.from("districts").upsert(changed, { onConflict: "state_code,slug" });
  if (error) return failed(dbMessage(error));
  updateTag("districts");
  refresh();
  return done(`Saved ${changed.length} ${changed.length === 1 ? "district" : "districts"}. The public map is updated.`);
}

export async function saveEnquiry(id: string, _prev: ActionResult, formData: FormData): Promise<ActionResult> {
  const { db } = await requireAdmin();
  const status = String(formData.get("status") ?? "");
  if (!["new", "replied", "closed"].includes(status)) return failed("Choose a status.", { status: "Choose a status" });
  const note = String(formData.get("note") ?? "").trim().slice(0, 1000) || null;
  const { error } = await db.from("enquiries").update({ status, note }).eq("id", id);
  if (error) return failed(dbMessage(error));
  refresh();
  return done("Saved.");
}

export async function removeSubscriber(id: string): Promise<ActionResult> {
  const { db } = await requireAdmin();
  const { error } = await db.from("subscribers").update({ status: "unsubscribed", unsubscribed_at: new Date().toISOString() }).eq("id", id);
  if (error) return failed(dbMessage(error));
  refresh();
  return done("Unsubscribed.");
}

export async function addAdmin(_prev: ActionResult, formData: FormData): Promise<ActionResult> {
  const { db } = await requireAdmin();
  const parsed = z
    .object({ email: z.email("Enter a valid email address"), name: z.string().trim().max(80).optional() })
    .safeParse({ email: String(formData.get("email") ?? "").trim().toLowerCase(), name: String(formData.get("name") ?? "").trim() || undefined });
  if (!parsed.success) return failed("Enter a valid email address.", { email: "Enter a valid email address" });
  const { error } = await db.from("admins").insert({ email: parsed.data.email, name: parsed.data.name ?? null });
  if (error) return failed(error.code === "23505" ? "That email is already an admin." : dbMessage(error));
  refresh();
  return done(`${parsed.data.email} can now sign in at /admin.`);
}

export async function removeAdmin(email: string): Promise<ActionResult> {
  const admin = await requireAdmin();
  if (email === admin.email) return failed("You can't remove yourself. Ask another admin to do it.");
  const { count } = await admin.db.from("admins").select("email", { count: "exact", head: true });
  if ((count ?? 0) <= 1) return failed("There must always be at least one admin.");
  const { error } = await admin.db.from("admins").delete().eq("email", email);
  if (error) return failed(dbMessage(error));
  // Also delete their sign-in account, which ends any session they have open (Google or email link).
  if (hasSupabaseAdmin) {
    const { data } = await supabaseAdmin().auth.admin.listUsers({ perPage: 1000 });
    const user = data?.users.find((u) => u.email?.toLowerCase() === email);
    if (user) await supabaseAdmin().auth.admin.deleteUser(user.id);
  }
  refresh();
  return done("Removed, and signed out everywhere.");
}
