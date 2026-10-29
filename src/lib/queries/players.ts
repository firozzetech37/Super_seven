import { cacheLife, cacheTag } from "next/cache";
import { hasSupabase, supabasePublic } from "@/lib/supabase/server";

export type DirectoryPlayer = { player_id: string; name: string; state_code: string; category: string };

export type DirectoryFilter = { q?: string; state?: string; category?: string };

/** Public directory: only approved players, only name, ID, state and category (enforced by the database view). */
export async function searchPlayers(filter: DirectoryFilter): Promise<{ players: DirectoryPlayer[]; configured: boolean }> {
  "use cache";
  cacheLife("minutes");
  cacheTag("players");
  if (!hasSupabase) return { players: [], configured: false };

  let query = supabasePublic().from("player_directory").select("*").order("player_id").limit(200);
  const q = (filter.q ?? "").trim().replace(/[,()"'%\\]/g, "").slice(0, 60);
  if (q) query = query.or(`name.ilike.%${q}%,player_id.ilike.%${q}%`);
  if (filter.state) query = query.eq("state_code", filter.state);
  if (filter.category) query = query.eq("category", filter.category);

  const { data, error } = await query.returns<DirectoryPlayer[]>();
  if (error) {
    console.error("[sscfi] player directory", error.message);
    return { players: [], configured: true };
  }
  return { players: data ?? [], configured: true };
}
