import { getAdmin } from "@/lib/admin/auth";

/**
 * Who is signed in, for the admin bar on the public site. 200 with the admin's email and the number of items
 * waiting for them, or 401. Never cached; it only answers for the browser's own session cookie.
 */
export async function GET() {
  const headers = { "Cache-Control": "private, no-store" };
  const admin = await getAdmin();
  if (!admin) return Response.json({ admin: false }, { status: 401, headers });

  const head = { count: "exact" as const, head: true };
  const [players, teams, associations, enquiries] = await Promise.all([
    admin.db.from("players").select("id", head).eq("status", "pending"),
    admin.db.from("teams").select("id", head).eq("status", "pending"),
    admin.db.from("associations").select("id", head).eq("status", "pending"),
    admin.db.from("enquiries").select("id", head).eq("status", "new"),
  ]);
  const waiting = (players.count ?? 0) + (teams.count ?? 0) + (associations.count ?? 0) + (enquiries.count ?? 0);
  return Response.json({ admin: true, email: admin.email, waiting }, { headers });
}
