import { getAdmin } from "@/lib/admin/auth";

/** CSV of active newsletter subscribers (admins only). */
export async function GET() {
  const admin = await getAdmin();
  if (!admin) return new Response("Not signed in as an admin.", { status: 401 });
  const { data, error } = await admin.db
    .from("subscribers")
    .select("email, status, created_at")
    .neq("status", "unsubscribed")
    .order("created_at")
    .returns<{ email: string; status: string; created_at: string }[]>();
  if (error) return new Response("Could not read subscribers.", { status: 500 });

  const quote = (v: string) => `"${v.replace(/"/g, '""')}"`;
  const lines = ["email,status,signed_up", ...(data ?? []).map((s) => [s.email, s.status, s.created_at.slice(0, 10)].map(quote).join(","))];
  return new Response(`﻿${lines.join("\r\n")}\r\n`, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="sscfi-subscribers-${new Date().toISOString().slice(0, 10)}.csv"`,
      "Cache-Control": "no-store",
    },
  });
}
