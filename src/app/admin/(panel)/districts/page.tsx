import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { ExternalLink, Map } from "lucide-react";
import { AdminForm } from "@/components/admin/admin-form";
import { buttonBase, buttonTones } from "@/components/admin/styles";
import { PageTitle, Panel, PanelSkeleton } from "@/components/admin/ui";
import { requireAdmin } from "@/lib/admin/auth";
import { saveDistrictStatuses } from "@/lib/admin/actions/inbox";
import { getDistrictList, stateBySlug, states } from "@/lib/geo/load";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "District status" };

const options = [
  { value: "not_reached", label: "Not reached", dot: "bg-status-unreached" },
  { value: "in_discussion", label: "In talks", dot: "bg-status-talks" },
  { value: "onboarded", label: "Onboarded", dot: "bg-status-onboarded" },
];

async function Body({ searchParams }: { searchParams: PageProps<"/admin/districts">["searchParams"] }) {
  const { db } = await requireAdmin();
  const params = await searchParams;
  const { data: rows } = await db.from("districts").select("state_code, slug, status").returns<{ state_code: string; slug: string; status: string }[]>();
  const all = rows ?? [];
  const live = all.some((r) => r.status !== "not_reached");

  const stateSlug = typeof params.state === "string" && stateBySlug.has(params.state) ? params.state : "west-bengal";
  const state = stateBySlug.get(stateSlug)!;
  const districts = await getDistrictList(stateSlug);
  const current = new globalThis.Map(all.filter((r) => r.state_code === state.code).map((r) => [r.slug, r.status]));

  const perState = (code: string, status: string) => all.filter((r) => r.state_code === code && r.status === status).length;

  return (
    <div className="grid gap-6 lg:grid-cols-[17rem_minmax(0,1fr)]">
      <Panel title="States" className="lg:sticky lg:top-6 lg:max-h-[calc(100dvh-3rem)] lg:overflow-y-auto">
        <ul className="space-y-0.5">
          {states.map((s) => {
            const on = perState(s.code, "onboarded");
            const talks = perState(s.code, "in_discussion");
            const active = s.slug === stateSlug;
            return (
              <li key={s.slug}>
                <Link
                  href={`/admin/districts?state=${s.slug}`}
                  aria-current={active ? "page" : undefined}
                  className={cn("flex items-center justify-between gap-2 rounded-lg px-2.5 py-1.5 text-sm transition", active ? "bg-navy font-bold text-white" : "text-navy hover:bg-surface")}
                >
                  <span className="truncate">{s.name}</span>
                  <span className="flex shrink-0 items-center gap-1 text-[11px] font-bold tabular-nums">
                    {on ? <span className="rounded-full bg-status-onboarded/80 px-1.5 text-navy">{on}</span> : null}
                    {talks ? <span className="rounded-full bg-status-talks/80 px-1.5 text-navy">{talks}</span> : null}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </Panel>

      <div className="space-y-4">
        {!live ? (
          <p className="rounded-xl bg-gold/10 px-4 py-3 text-sm text-[#7a5a16] ring-1 ring-gold/30">
            The public map still shows the concept&apos;s <strong>sample colours</strong>. As soon as one district is set to In talks or Onboarded, it switches to these real statuses.
          </p>
        ) : null}
        <Panel
          title={state.name}
          description={`${districts.length} districts. Change any, then save once.`}
          icon={Map}
          actions={
            <Link href={`/locations/${stateSlug}`} target="_blank" className={cn(buttonBase, buttonTones.quiet, "h-9 px-3 text-[13px]")}>
              <ExternalLink className="size-4" aria-hidden="true" />
              Public map
            </Link>
          }
        >
          <AdminForm key={stateSlug} action={saveDistrictStatuses.bind(null, state.code)} submitLabel="Save changes" tone="gold" footerClassName="sticky bottom-0 -mx-5 border-t border-line bg-white/95 px-5 py-3 backdrop-blur sm:-mx-6 sm:px-6">
            <div className="mb-3 flex flex-wrap gap-4 text-xs font-bold text-slate-500">
              {options.map((o) => (
                <span key={o.value} className="inline-flex items-center gap-1.5">
                  <span className={cn("size-2.5 rounded-full", o.dot)} aria-hidden="true" />
                  {o.label}
                </span>
              ))}
            </div>
            <ul className="divide-y divide-line">
              {districts.map((d) => {
                const value = current.get(d.slug) ?? "not_reached";
                return (
                  <li key={d.slug} className="flex flex-wrap items-center justify-between gap-2 py-2">
                    <label htmlFor={`d-${d.slug}`} className="text-sm font-semibold text-navy">
                      {d.name}
                    </label>
                    <input type="hidden" name={`was:${d.slug}`} value={value} />
                    <select
                      id={`d-${d.slug}`}
                      name={`status:${d.slug}`}
                      defaultValue={value}
                      className="h-9 w-44 cursor-pointer rounded-lg bg-white px-2.5 text-sm text-navy outline-none ring-1 ring-line focus:ring-2 focus:ring-royal"
                    >
                      {options.map((o) => (
                        <option key={o.value} value={o.value}>
                          {o.label}
                        </option>
                      ))}
                    </select>
                  </li>
                );
              })}
            </ul>
          </AdminForm>
        </Panel>
      </div>
    </div>
  );
}

export default function DistrictsAdminPage({ searchParams }: PageProps<"/admin/districts">) {
  return (
    <div className="space-y-8">
      <PageTitle
        eyebrow="Map"
        title="District status"
        description="What the Locations map shows: red for not reached, yellow for in talks, green for onboarded. A state takes the colour of its best district."
      />
      <Suspense fallback={<PanelSkeleton rows={8} />}>
        <Body searchParams={searchParams} />
      </Suspense>
    </div>
  );
}
