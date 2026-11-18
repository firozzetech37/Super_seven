import { cache } from "react";
import { redirect } from "next/navigation";
import type { SupabaseClient } from "@supabase/supabase-js";
import { supabaseSession } from "@/lib/supabase/session";

export type Admin = { email: string; db: SupabaseClient };

/**
 * The signed-in admin, or null. "Admin" means a Supabase user whose email is in public.admins
 * (checked by the database's own is_admin(), the same rule row security uses). Cached per request.
 */
export const getAdmin = cache(async (): Promise<Admin | null> => {
  const db = await supabaseSession();
  const { data } = await db.auth.getUser();
  const email = data.user?.email?.toLowerCase();
  if (!email) return null;
  const { data: allowed } = await db.rpc("is_admin");
  return allowed ? { email, db } : null;
});

/** Use at the top of every admin page and server action: signed-out or non-admin visitors go to the login page. */
export async function requireAdmin(): Promise<Admin> {
  const admin = await getAdmin();
  if (admin) return admin;
  const db = await supabaseSession();
  const { data } = await db.auth.getUser();
  redirect(data.user ? "/admin/login?error=denied" : "/admin/login");
}
