"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";
import { done, failed, type ActionResult } from "@/lib/admin/result";
import { hasSupabaseAdmin, supabaseAdmin } from "@/lib/supabase/server";
import { supabaseSession } from "@/lib/supabase/session";

const SENT = "If that email is on the admin list, a sign-in link is on its way. Open it in this browser.";

async function origin() {
  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host") ?? "localhost:3000";
  const proto = h.get("x-forwarded-proto") ?? (host.startsWith("localhost") || host.startsWith("127.") ? "http" : "https");
  return `${proto}://${host}`;
}

/**
 * Emails a one-time sign-in link, but only to addresses in public.admins (checked with the secret key, so no
 * Supabase account is created for anyone else). The reply is the same either way, so the form can't be used
 * to find out who the admins are.
 */
export async function sendLoginLink(_prev: ActionResult, formData: FormData): Promise<ActionResult> {
  const parsed = z.email().safeParse(String(formData.get("email") ?? "").trim().toLowerCase());
  if (!parsed.success) return failed("Enter a valid email address.", { email: "Enter a valid email address." });
  const email = parsed.data;
  const next = String(formData.get("next") ?? "/admin");
  const safeNext = next.startsWith("/admin") && !next.startsWith("//") ? next : "/admin";

  if (!hasSupabaseAdmin) return failed("Supabase is not configured on this server.");
  const { data: row, error: lookupError } = await supabaseAdmin().from("admins").select("email").eq("email", email).maybeSingle();
  if (lookupError) return failed("Could not reach the database. Please try again in a moment.");
  if (!row) return done(SENT);

  const db = await supabaseSession();
  const { error } = await db.auth.signInWithOtp({
    email,
    options: { emailRedirectTo: `${await origin()}/admin/auth/confirm?next=${encodeURIComponent(safeNext)}`, shouldCreateUser: true },
  });
  if (error) {
    const limited = error.status === 429 || /rate|limit/i.test(error.message);
    return failed(
      limited
        ? "Too many sign-in emails in the last hour. Wait a few minutes, then try again."
        : "The sign-in email could not be sent. Please try again in a few minutes.",
    );
  }
  return done(SENT);
}

export async function signOut() {
  const db = await supabaseSession();
  await db.auth.signOut();
  redirect("/admin/login?signed-out=1");
}
