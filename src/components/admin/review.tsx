import { CheckCircle2, Search } from "lucide-react";
import { AdminForm } from "@/components/admin/admin-form";
import { buttonBase, buttonTones } from "@/components/admin/styles";
import { Checkbox, Input, Select } from "@/components/admin/fields";
import { dateTime, FilterTabs, StatusPill } from "@/components/admin/ui";
import { approveAssociation, approvePlayer, approveTeam, rejectRegistration, reopenRegistration, type Kind } from "@/lib/admin/actions/registrations";
import { cn } from "@/lib/utils";

export type Review = { status: string; review_note: string | null; reviewed_by: string | null; reviewed_at: string | null };

export const statusTabs = ["pending", "approved", "rejected", "all"] as const;
export type StatusTab = (typeof statusTabs)[number];

export function readStatus(value: unknown): StatusTab {
  return statusTabs.includes(value as StatusTab) ? (value as StatusTab) : "pending";
}

/** Status tabs plus a search box (a plain GET form, so it works without JavaScript). */
export function ReviewToolbar({
  base,
  status,
  q,
  counts,
  placeholder,
}: {
  base: string;
  status: StatusTab;
  q: string;
  counts: Record<string, number>;
  placeholder: string;
}) {
  const href = (s: string) => `${base}?status=${s}${q ? `&q=${encodeURIComponent(q)}` : ""}`;
  return (
    <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
      <FilterTabs
        current={status}
        tabs={statusTabs.map((s) => ({ value: s, href: href(s), label: s[0].toUpperCase() + s.slice(1), count: s === "all" ? undefined : counts[s] ?? 0 }))}
      />
      <form action={base} className="flex gap-2">
        <input type="hidden" name="status" value={status} />
        <label className="relative">
          <span className="sr-only">Search</span>
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" aria-hidden="true" />
          <input
            name="q"
            defaultValue={q}
            placeholder={placeholder}
            className="h-10 w-64 max-w-full rounded-xl bg-white pl-9 pr-3 text-sm text-navy outline-none ring-1 ring-line focus:ring-2 focus:ring-royal"
          />
        </label>
        <button type="submit" className={cn(buttonBase, buttonTones.quiet)}>
          Search
        </button>
      </form>
    </div>
  );
}

/** The decision area under a registration: approve / reject with a reason / reopen, depending on its status. */
export function ReviewActions({
  kind,
  id,
  review,
  approvedNote,
  canReopen = true,
  districts,
}: {
  kind: Kind;
  id: string;
  review: Review;
  approvedNote?: React.ReactNode;
  canReopen?: boolean;
  /** Associations only: the map's districts for the association's state, with the closest match to what they typed. */
  districts?: { options: { value: string; label: string }[]; suggested?: string };
}) {
  if (review.status === "pending") {
    const approve =
      kind === "players" ? approvePlayer.bind(null, id) : kind === "teams" ? approveTeam.bind(null, id) : approveAssociation.bind(null, id);
    return (
      <div className="grid gap-4 border-t border-line pt-4 lg:grid-cols-2">
        <div className="rounded-xl bg-emerald-50/60 p-4 ring-1 ring-emerald-200/70">
          <AdminForm action={approve} submitLabel={kind === "players" ? "Approve & issue Player ID" : "Approve"} pendingLabel="Approving…" tone="gold">
            {kind === "associations" ? (
              <div className="space-y-3">
                <Checkbox name="onboard" label="Also turn this district green (onboarded) on the public map" defaultChecked />
                {districts?.options.length ? (
                  <Select
                    name="district_slug"
                    label="District on the map"
                    options={districts.options}
                    placeholder="Choose…"
                    defaultValue={districts.suggested ?? ""}
                    hint={districts.suggested ? "Matched from what they typed. Change it if it's wrong." : "Couldn't match what they typed; pick the district."}
                  />
                ) : null}
              </div>
            ) : (
              <p className="text-sm text-slate-600">
                {kind === "players"
                  ? "Issues the next Player ID for their state and lists them in the public player directory."
                  : "Marks the team as approved for SSCFI tournaments."}
              </p>
            )}
          </AdminForm>
        </div>
        <div className="rounded-xl bg-ball/[0.03] p-4 ring-1 ring-ball/15">
          <AdminForm action={rejectRegistration.bind(null, kind, id)} submitLabel="Reject" pendingLabel="Saving…" tone="danger">
            <Input name="note" label="Reason (kept on the record)" placeholder="Certificate missing; asked them to re-apply" />
          </AdminForm>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line pt-4">
      <p className="flex flex-wrap items-center gap-2 text-sm text-slate-600">
        <StatusPill status={review.status} />
        {review.reviewed_by ? (
          <span>
            by {review.reviewed_by}
            {review.reviewed_at ? `, ${dateTime(review.reviewed_at)}` : ""}
          </span>
        ) : null}
        {review.status === "approved" && approvedNote ? (
          <span className="inline-flex items-center gap-1.5 font-bold text-emerald-700">
            <CheckCircle2 className="size-4" aria-hidden="true" />
            {approvedNote}
          </span>
        ) : null}
        {review.review_note ? <span className="text-slate-500">· “{review.review_note}”</span> : null}
      </p>
      {canReopen ? <AdminForm action={reopenRegistration.bind(null, kind, id)} submitLabel="Move back to pending" pendingLabel="Moving…" tone="quiet" small /> : null}
    </div>
  );
}

/** Builds a PostgREST `or` filter for a search term across the given columns. */
export function searchFilter(q: string, columns: string[]) {
  const term = q.replace(/[,()*%]/g, " ").trim();
  return term ? columns.map((c) => `${c}.ilike.*${term}*`).join(",") : null;
}
