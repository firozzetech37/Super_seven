import type { z } from "zod";

/** What every admin server action returns to its form. */
export type ActionResult = { ok: boolean; message: string; errors?: Record<string, string>; at?: number };

export const idle: ActionResult = { ok: false, message: "" };

export const done = (message: string): ActionResult => ({ ok: true, message, at: Date.now() });
export const failed = (message: string, errors?: Record<string, string>): ActionResult => ({ ok: false, message, errors, at: Date.now() });

export function zodErrors(error: z.ZodError): Record<string, string> {
  const out: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = String(issue.path[0] ?? "form");
    out[key] ??= issue.message;
  }
  return out;
}

/** FormData as a plain object of trimmed strings; empty strings become undefined so optional fields stay optional. */
export function fields(formData: FormData): Record<string, string | undefined> {
  const out: Record<string, string | undefined> = {};
  for (const [key, value] of formData.entries()) {
    if (typeof value !== "string" || key.startsWith("$ACTION")) continue;
    const v = value.trim();
    out[key] = v === "" ? undefined : v;
  }
  return out;
}

/** Postgres error text an admin can act on, without leaking internals. */
export function dbMessage(error: { message: string; code?: string } | null | undefined, fallback = "Could not save. Please try again.") {
  if (!error) return fallback;
  if (error.code === "23505") return "That already exists (a duplicate slug, email or match number).";
  if (error.code === "23503") return "That record is still linked to something else.";
  if (error.code === "23514") return "One of the values is out of range (wickets 0–7, scores 0 or more).";
  if (error.code === "42501") return "Your account is not allowed to do that.";
  if (error.code === "PGRST205" || error.code === "42P01")
    return "The media tables aren't set up yet. Run supabase/migrations/20261118000000_media.sql in the Supabase SQL editor first.";
  return fallback;
}

export const slugify = (s: string) =>
  s
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);
