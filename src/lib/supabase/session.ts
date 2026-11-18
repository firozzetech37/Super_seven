import { connection } from "next/server";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";

/**
 * Supabase client bound to the signed-in admin's session cookie (server components, actions, route handlers).
 * Every query runs as that user, so row security (public.is_admin()) decides what it can read and write.
 * Create one per request; never share it. Token refreshes are written by src/proxy.ts, because server
 * components cannot set cookies (the try/catch below swallows that case).
 */
export async function supabaseSession(): Promise<SupabaseClient> {
  // Admin data is per request: never part of a prerender (cookies alone still allow a runtime prefetch).
  await connection();
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) throw new Error("Supabase is not configured (NEXT_PUBLIC_SUPABASE_URL / PUBLISHABLE_KEY)");
  const store = await cookies();
  return createServerClient(url, key, {
    cookies: {
      getAll: () => store.getAll(),
      setAll: (list) => {
        try {
          for (const { name, value, options } of list) store.set(name, value, options);
        } catch {
          // Called from a server component: the proxy refreshes the session instead.
        }
      },
    },
  });
}
