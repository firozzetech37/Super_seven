import { Suspense } from "react";
import type { Metadata } from "next";
import { ShieldCheck, UserPlus } from "lucide-react";
import { AdminForm } from "@/components/admin/admin-form";
import { Input } from "@/components/admin/fields";
import { dateTime, PageTitle, Panel, PanelSkeleton } from "@/components/admin/ui";
import { requireAdmin } from "@/lib/admin/auth";
import { addAdmin, removeAdmin } from "@/lib/admin/actions/inbox";

export const metadata: Metadata = { title: "Admins" };

async function Body() {
  const { db, email: me } = await requireAdmin();
  const { data: admins } = await db.from("admins").select("email, name, created_at").order("created_at").returns<{ email: string; name: string | null; created_at: string }[]>();
  return (
    <Panel title="Who can sign in" description="Only these emails can get in, with Google or an emailed link. Nobody shares a password." icon={ShieldCheck}>
      <ul className="divide-y divide-line">
        {(admins ?? []).map((a) => (
          <li key={a.email} className="flex flex-wrap items-center justify-between gap-3 py-3">
            <div className="min-w-0">
              <p className="font-bold text-navy">
                {a.name ?? a.email}
                {a.email === me ? <span className="ml-2 rounded-full bg-gold/20 px-2 py-0.5 text-[11px] font-bold text-[#7a5a16]">you</span> : null}
              </p>
              <p className="text-sm text-slate-500">
                {a.name ? `${a.email} · ` : ""}added {dateTime(a.created_at)}
              </p>
            </div>
            {a.email !== me ? <AdminForm action={removeAdmin.bind(null, a.email)} submitLabel="Remove" pendingLabel="Removing…" tone="danger" small /> : null}
          </li>
        ))}
      </ul>
    </Panel>
  );
}

export default function AdminsPage() {
  return (
    <div className="space-y-8">
      <PageTitle eyebrow="Settings" title="Admins" description="Everyone on this list can do everything in the admin area: fixtures, results, approvals, the map and the inbox." />
      <Suspense fallback={<PanelSkeleton rows={2} />}>
        <Body />
      </Suspense>
      <Panel title="Add an admin" icon={UserPlus}>
        <AdminForm action={addAdmin} submitLabel="Add admin" tone="gold" resetOnSuccess>
          <div className="grid gap-4 sm:grid-cols-2">
            <Input name="email" label="Email" type="email" required placeholder="name@example.com" />
            <Input name="name" label="Name" optional placeholder="Secretary, SSCFI" />
          </div>
        </AdminForm>
        <p className="mt-5 rounded-xl bg-surface px-4 py-3 text-sm leading-relaxed text-slate-600 ring-1 ring-line">
          <strong className="text-navy">How they sign in:</strong> with <strong className="text-navy">Continue with Google</strong> using a Google account
          on this exact email, or with an emailed link. Any other Google account is turned away and its account deleted. Removing someone here
          signs them out everywhere.
        </p>
      </Panel>
    </div>
  );
}
