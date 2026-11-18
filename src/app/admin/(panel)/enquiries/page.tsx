import { Suspense } from "react";
import type { Metadata } from "next";
import { Inbox, Mail, Phone } from "lucide-react";
import { AdminForm } from "@/components/admin/admin-form";
import { Input, Select } from "@/components/admin/fields";
import { dateTime, Empty, FilterTabs, PageTitle, PanelSkeleton, StatusPill } from "@/components/admin/ui";
import { requireAdmin } from "@/lib/admin/auth";
import { saveEnquiry } from "@/lib/admin/actions/inbox";

export const metadata: Metadata = { title: "Enquiries" };

type Enquiry = {
  id: string;
  reference: string;
  name: string;
  mobile: string;
  email: string;
  type: string;
  role: string | null;
  message: string;
  status: string;
  note: string | null;
  created_at: string;
};

const tabs = ["new", "replied", "closed", "all"] as const;

async function Body({ searchParams }: { searchParams: PageProps<"/admin/enquiries">["searchParams"] }) {
  const { db } = await requireAdmin();
  const params = await searchParams;
  const status = tabs.includes(params.status as (typeof tabs)[number]) ? (params.status as (typeof tabs)[number]) : "new";

  let query = db.from("enquiries").select("*").order("created_at", { ascending: false }).limit(200);
  if (status !== "all") query = query.eq("status", status);
  const head = { count: "exact" as const, head: true };
  const [{ data: rows }, ...counts] = await Promise.all([
    query.returns<Enquiry[]>(),
    ...tabs.slice(0, 3).map((s) => db.from("enquiries").select("id", head).eq("status", s)),
  ]);

  return (
    <div className="space-y-6">
      <FilterTabs
        current={status}
        tabs={tabs.map((t, i) => ({ value: t, href: `/admin/enquiries?status=${t}`, label: t[0].toUpperCase() + t.slice(1), count: i < 3 ? counts[i].count ?? 0 : undefined }))}
      />
      {rows?.length ? (
        <ul className="space-y-4">
          {rows.map((e) => (
            <li key={e.id} className="rounded-2xl bg-white p-5 shadow-[0_8px_24px_rgba(15,46,99,0.05)] ring-1 ring-line sm:p-6">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-heading text-lg font-bold text-navy">
                    {e.name}
                    <span className="ml-2 rounded-md bg-surface px-1.5 py-0.5 align-middle text-[11px] font-bold uppercase tracking-[0.08em] text-slate-500 ring-1 ring-line">{e.type}</span>
                  </p>
                  <p className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-sm">
                    <a href={`mailto:${e.email}?subject=${encodeURIComponent(`Your enquiry to SSCFI (${e.reference})`)}`} className="inline-flex items-center gap-1.5 font-semibold text-royal hover:underline">
                      <Mail className="size-3.5" aria-hidden="true" />
                      {e.email}
                    </a>
                    <a href={`tel:${e.mobile}`} className="inline-flex items-center gap-1.5 font-semibold text-royal hover:underline">
                      <Phone className="size-3.5" aria-hidden="true" />
                      {e.mobile}
                    </a>
                    {e.role ? <span className="text-slate-500">{e.role}</span> : null}
                  </p>
                </div>
                <div className="text-right">
                  <StatusPill status={e.status} />
                  <p className="mt-1 text-xs text-slate-400">{dateTime(e.created_at)}</p>
                </div>
              </div>
              <p className="mt-4 whitespace-pre-line rounded-xl bg-surface/70 p-4 text-[15px] leading-relaxed text-navy ring-1 ring-line">{e.message}</p>
              <AdminForm action={saveEnquiry.bind(null, e.id)} submitLabel="Save" className="mt-4" footerClassName="mt-3">
                <div className="grid gap-3 sm:grid-cols-[12rem_minmax(0,1fr)]">
                  <Select
                    name="status"
                    label="Status"
                    defaultValue={e.status}
                    options={[
                      { value: "new", label: "New" },
                      { value: "replied", label: "Replied" },
                      { value: "closed", label: "Closed" },
                    ]}
                  />
                  <Input name="note" label="Internal note" optional defaultValue={e.note ?? ""} placeholder="Called back on 18 Nov; sending the corporate deck" />
                </div>
              </AdminForm>
            </li>
          ))}
        </ul>
      ) : (
        <Empty icon={Inbox} title={status === "new" ? "Inbox zero" : `No ${status} enquiries`}>
          {status === "new" ? "Messages from the Contact page land here. Reply by email or phone, then mark them replied." : null}
        </Empty>
      )}
    </div>
  );
}

export default function EnquiriesAdminPage({ searchParams }: PageProps<"/admin/enquiries">) {
  return (
    <div className="space-y-8">
      <PageTitle eyebrow="Inbox" title="Enquiries" description="Messages sent from the website's Contact page. Click an email address to reply from your own mail app." />
      <Suspense fallback={<PanelSkeleton />}>
        <Body searchParams={searchParams} />
      </Suspense>
    </div>
  );
}
