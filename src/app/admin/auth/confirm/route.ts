import { NextResponse, type NextRequest } from "next/server";
import type { EmailOtpType } from "@supabase/supabase-js";
import { supabaseSession } from "@/lib/supabase/session";

/**
 * Where the emailed sign-in link lands. Supports both link styles Supabase can send:
 * `?code=` (the default template; must be opened in the browser that asked for it) and
 * `?token_hash=&type=` (a custom template; works on any device).
 */
export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const next = params.get("next") ?? "/admin";
  const target = next.startsWith("/admin") && !next.startsWith("//") ? next : "/admin";
  const code = params.get("code");
  const tokenHash = params.get("token_hash");
  const type = params.get("type") as EmailOtpType | null;

  const db = await supabaseSession();
  let ok = false;
  if (code) ok = !(await db.auth.exchangeCodeForSession(code)).error;
  else if (tokenHash && type) ok = !(await db.auth.verifyOtp({ token_hash: tokenHash, type })).error;

  const url = request.nextUrl.clone();
  url.search = "";
  url.pathname = ok ? target : "/admin/login";
  if (!ok) url.searchParams.set("error", "link");
  return NextResponse.redirect(url);
}
