import { Suspense } from "react";
import type { Metadata } from "next";
import { FileText, Trophy } from "lucide-react";
import { ReviewActions, ReviewToolbar, readStatus, searchFilter, type Review } from "@/components/admin/review";
import { dateTime, Details, Empty, PageTitle, PanelSkeleton, StatusPill } from "@/components/admin/ui";
import { requireAdmin } from "@/lib/admin/auth";
import { slugify } from "@/lib/admin/result";
import { getDistrictList, stateByCode } from "@/lib/geo/load";

export const metadata: Metadata = { title: "District associations" };

type Association = Review & {
  id: string;
  reference: string;
  association_name: string;
  registration_number: string;
  state_code: string;
  district_name: string;
  contact_person: string;
  designation: string;
  phone: string;
  email: string;
  address: string;
  teams_count: number;
  players_count: number;
  certificate_path: string | null;
  certificate_name: string | null;
  created_at: string;
};

/** The map district closest to the name they typed: exact slug, then one containing the other. */
function suggest(typed: string, options: { slug: string; name: string }[]) {
  const s = slugify(typed);
  return (options.find((o) => o.slug === s) ?? options.find((o) => o.slug.includes(s) || s.includes(o.slug)))?.slug;
}

async function Body({ searchParams }: { searchParams: PageProps<"/admin/associations">["searchParams"] }) {
  const { db } = await requireAdmin();
  const params = await searchParams;
  const status = readStatus(params.status);
  const q = typeof params.q === "string" ? params.q.trim() : "";

  let query = db.from("associations").select("*").order("created_at", { ascending: status === "pending" }).limit(200);
  if (status !== "all") query = query.eq("status", status);
  const filter = searchFilter(q, ["association_name", "reference", "district_name", "contact_person", "phone", "email"]);
  if (filter) query = query.or(filter);

  const head = { count: "exact" as const, head: true };
  const [{ data: rows }, pending, approved, rejected] = await Promise.all([
    query.returns<Association[]>(),
    db.from("associations").select("id", head).eq("status", "pending"),
    db.from("associations").select("id", head).eq("status", "approved"),
    db.from("associations").select("id", head).eq("status", "rejected"),
  ]);

  // Short-lived links to the private certificate files, and the map's districts for each pending state.
  const items = await Promise.all(
    (rows ?? []).map(async (a) => {
      const cert = a.certificate_path ? await db.storage.from("certificates").createSignedUrl(a.certificate_path, 60 * 30) : null;
      let districts: { options: { value: string; label: string }[]; suggested?: string } | undefined;
      if (a.status === "pending") {
        const state = stateByCode.get(a.state_code);
        const list = state ? await getDistrictList(state.slug) : [];
        districts = { options: list.map((d) => ({ value: d.slug, label: d.name })), suggested: suggest(a.district_name, list) };
      }
      return { a, certUrl: cert?.data?.signedUrl, districts };
    }),
  );

  return (
    <div className="space-y-6">
      <ReviewToolbar
        base="/admin/associations"
        status={status}
        q={q}
        counts={{ pending: pending.count ?? 0, approved: approved.count ?? 0, rejected: rejected.count ?? 0 }}
        placeholder="Association, district, contact…"
      />
      {items.length ? (
        <ul className="space-y-4">
          {items.map(({ a, certUrl, districts }) => (
            <li key={a.id} className="rounded-2xl bg-white p-5 shadow-[0_8px_24px_rgba(15,46,99,0.05)] ring-1 ring-line sm:p-6">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-heading text-xl font-bold text-navy">{a.association_name}</p>
                  <p className="mt-0.5 text-sm text-slate-500">
                    {/district$/i.test(a.district_name.trim()) ? a.district_name : `${a.district_name} district`}, {stateByCode.get(a.state_code)?.name ?? a.state_code}
                  </p>
                </div>
                <StatusPill status={a.status} />
              </div>
              <div className="mt-5">
                <Details
                  items={[
                    { label: "Reference", value: <span className="font-mono">{a.reference}</span> },
                    { label: "Received", value: dateTime(a.created_at) },
                    { label: "Registration no.", value: a.registration_number },
                    { label: "Contact", value: `${a.contact_person} (${a.designation})` },
                    { label: "Phone", value: <a className="text-royal hover:underline" href={`tel:${a.phone}`}>{a.phone}</a> },
                    { label: "Email", value: <a className="text-royal hover:underline" href={`mailto:${a.email}`}>{a.email}</a> },
                    { label: "Teams / players", value: `${a.teams_count} teams · ${a.players_count} players` },
                    { label: "Address", value: a.address },
                    {
                      label: "Certificate",
                      value: certUrl ? (
                        <a href={certUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 font-bold text-royal hover:underline">
                          <FileText className="size-4" aria-hidden="true" />
                          {a.certificate_name ?? "Open file"}
                        </a>
                      ) : (
                        <span className="text-slate-500">Not uploaded; ask for it by email</span>
                      ),
                    },
                  ]}
                />
              </div>
              <div className="mt-5">
                <ReviewActions kind="associations" id={a.id} review={a} districts={districts} />
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <Empty icon={Trophy} title={q ? "No associations match that search" : status === "pending" ? "No associations waiting" : `No ${status} associations`}>
          {status === "pending" && !q ? "District association registrations (with their certificate) appear here. Approving one can turn its district green on the map." : null}
        </Empty>
      )}
    </div>
  );
}

export default function AssociationsAdminPage({ searchParams }: PageProps<"/admin/associations">) {
  return (
    <div className="space-y-8">
      <PageTitle
        eyebrow="Registrations"
        title="District associations"
        description="Verify the registration certificate, then approve. Certificate links work for 30 minutes after the page loads."
      />
      <Suspense fallback={<PanelSkeleton />}>
        <Body searchParams={searchParams} />
      </Suspense>
    </div>
  );
}
