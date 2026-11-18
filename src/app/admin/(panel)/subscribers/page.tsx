import { Suspense } from "react";
import type { Metadata } from "next";
import { Download, Mail } from "lucide-react";
import { AdminForm } from "@/components/admin/admin-form";
import { buttonBase, buttonTones } from "@/components/admin/styles";
import { dateTime, Empty, PageTitle, Panel, PanelSkeleton, StatusPill } from "@/components/admin/ui";
import { requireAdmin } from "@/lib/admin/auth";
import { removeSubscriber } from "@/lib/admin/actions/inbox";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Newsletter" };

type Subscriber = { id: string; email: string; status: string; created_at: string; confirmed_at: string | null };

async function Body() {
  const { db } = await requireAdmin();
  const { data: rows } = await db.from("subscribers").select("id, email, status, created_at, confirmed_at").order("created_at", { ascending: false }).returns<Subscriber[]>();
  const list = rows ?? [];
  const active = list.filter((s) => s.status !== "unsubscribed").length;

  return (
    <Panel
      title={`${active} ${active === 1 ? "subscriber" : "subscribers"}`}
      description={`${list.length - active} unsubscribed. The CSV has every active address, ready for a mailing tool.`}
      icon={Mail}
      actions={
        <a href="/admin/subscribers/export" className={cn(buttonBase, buttonTones.gold)}>
          <Download className="size-4" aria-hidden="true" />
          Download CSV
        </a>
      }
    >
      {list.length ? (
        <div className="-mx-5 overflow-x-auto sm:-mx-6">
          <table className="w-full min-w-[34rem] text-left text-sm">
            <thead>
              <tr className="border-y border-line bg-surface text-[11px] font-bold uppercase tracking-[0.1em] text-slate-500">
                <th className="px-5 py-2.5 sm:px-6">Email</th>
                <th className="px-3 py-2.5">Status</th>
                <th className="px-3 py-2.5">Signed up</th>
                <th className="px-5 py-2.5 text-right sm:px-6">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {list.map((s) => (
                <tr key={s.id}>
                  <td className="px-5 py-3 font-semibold text-navy sm:px-6">{s.email}</td>
                  <td className="px-3 py-3">
                    <StatusPill status={s.status} />
                  </td>
                  <td className="px-3 py-3 text-slate-500">{dateTime(s.created_at)}</td>
                  <td className="px-5 py-3 text-right sm:px-6">
                    {s.status !== "unsubscribed" ? (
                      <AdminForm action={removeSubscriber.bind(null, s.id)} submitLabel="Unsubscribe" pendingLabel="…" tone="quiet" small footerClassName="justify-end" />
                    ) : null}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <Empty icon={Mail} title="No subscribers yet">
          People who sign up in the newsletter band at the bottom of every page appear here.
        </Empty>
      )}
    </Panel>
  );
}

export default function SubscribersAdminPage() {
  return (
    <div className="space-y-8">
      <PageTitle eyebrow="Inbox" title="Newsletter" description="Everyone who signed up for news by email. Unsubscribe anyone who asks to be removed." />
      <Suspense fallback={<PanelSkeleton />}>
        <Body />
      </Suspense>
    </div>
  );
}
