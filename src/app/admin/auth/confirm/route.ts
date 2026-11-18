import { NextResponse, type NextRequest } from "next/server";
import type { EmailOtpType } from "@supabase/supabase-js";
import { hasSupabaseAdmin, supabaseAdmin } from "@/lib/supabase/server";
import { supabaseSession } from "@/lib/supabase/session";

/**
 * Where sign-in lands: Google (?code=), the default email link (?code=, same browser) or a token-hash email link
 * (?token_hash=&type=, any device). Only emails on the admin list get through: anyone else is signed out straight
 * away and the Supabase account their attempt created is deleted.
 */
export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const next = params.get("next") ?? "/admin";
  const target = next.startsWith("/admin") && !next.startsWith("//") ? next : "/admin";
  const code = params.get("code");
  const tokenHash = params.get("token_hash");
  const type = params.get("type") as EmailOtpType | null;

  const url = request.nextUrl.clone();
  url.search = "";
  const toLogin = (error: string, email?: string) => {
    url.pathname = "/admin/login";
    url.searchParams.set("error", error);
    if (email) url.searchParams.set("as", email);
    return NextResponse.redirect(url);
  };

  // Google sends the visitor back with ?error= when they cancel or the provider is misconfigured.
  if (params.get("error")) return toLogin(params.get("error") === "access_denied" ? "cancelled" : "google");

  const db = await supabaseSession();
  let ok = false;
  if (code) ok = !(await db.auth.exchangeCodeForSession(code)).error;
  else if (tokenHash && type) ok = !(await db.auth.verifyOtp({ token_hash: tokenHash, type })).error;
  if (!ok) return toLogin("link");

  const { data: allowed, error: checkError } = await db.rpc("is_admin");
  if (checkError) return toLogin("link"); // couldn't check: try again, never treat as "not an admin"
  if (!allowed) {
    const { data } = await db.auth.getUser();
    const user = data.user;
    await db.auth.signOut();
    // Remove the account this attempt created, after confirming (with the secret key) the email really isn't an admin.
    if (user?.email && hasSupabaseAdmin) {
      const admin = supabaseAdmin();
      const { data: row, error } = await admin.from("admins").select("email").eq("email", user.email.toLowerCase()).maybeSingle();
      if (!error && !row) await admin.auth.admin.deleteUser(user.id);
    }
    return toLogin("denied", user?.email ?? undefined);
  }

  url.pathname = target;
  return NextResponse.redirect(url);
}
