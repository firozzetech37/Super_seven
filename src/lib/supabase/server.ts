import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Server-side Supabase clients. Never import this file from a client component.
 * - supabasePublic(): publishable key, sees only what row security allows (public views and reference data).
 * - supabaseAdmin(): secret key, bypasses row security; used by server actions to store submissions.
 */
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
const secretKey = process.env.SUPABASE_SECRET_KEY;

export const hasSupabase = Boolean(url && publishableKey);
export const hasSupabaseAdmin = Boolean(url && secretKey);

const options = { auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false } };

let publicClient: SupabaseClient | undefined;
let adminClient: SupabaseClient | undefined;

export function supabasePublic(): SupabaseClient {
  if (!url || !publishableKey) throw new Error("Supabase is not configured (NEXT_PUBLIC_SUPABASE_URL / PUBLISHABLE_KEY)");
  return (publicClient ??= createClient(url, publishableKey, options));
}

export function supabaseAdmin(): SupabaseClient {
  if (!url || !secretKey) throw new Error("Supabase admin is not configured (SUPABASE_SECRET_KEY)");
  return (adminClient ??= createClient(url, secretKey, options));
}
