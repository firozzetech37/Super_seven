import { Suspense } from "react";
import type { Metadata } from "next";
import { Users } from "lucide-react";
import { ReviewActions, ReviewToolbar, readStatus, searchFilter, type Review } from "@/components/admin/review";
import { dateTime, Details, Empty, PageTitle, PanelSkeleton, StatusPill } from "@/components/admin/ui";
import { requireAdmin } from "@/lib/admin/auth";
import { stateByCode } from "@/lib/geo/load";

export const metadata: Metadata = { title: "Teams" };

type Team = Review & {
  id: string;
  reference: string;
  team_name: string;
  city: string;
  state_code: string;
  captain_name: string;
  captain_mobile: string;
  vice_captain_name: string;
  squad: string[];
  coach_name: string;
  coach_contact: string;
  previous_tournaments: string | null;
  created_at: string;
};

async function Body({ searchParams }: { searchParams: PageProps<"/admin/teams">["searchParams"] }) {
  const { db } = await requireAdmin();
  const params = await searchParams;
  const status = readStatus(params.status);
  const q = typeof params.q === "string" ? params.q.trim() : "";

  let query = db.from("teams").select("*").order("created_at", { ascending: status === "pending" }).limit(200);
  if (status !== "all") query = query.eq("status", status);
  const filter = searchFilter(q, ["team_name", "reference", "city", "captain_name", "captain_mobile"]);
  if (filter) query = query.or(filter);

  const head = { count: "exact" as const, head: true };
  const [{ data: teams }, pending, approved, rejected] = await Promise.all([
    query.returns<Team[]>(),
    db.from("teams").select("id", head).eq("status", "pending"),
    db.from("teams").select("id", head).eq("status", "approved"),
    db.from("teams").select("id", head).eq("status", "rejected"),
  ]);

  return (
    <div className="space-y-6">
      <ReviewToolbar
        base="/admin/teams"
        status={status}
        q={q}
        counts={{ pending: pending.count ?? 0, approved: approved.count ?? 0, rejected: rejected.count ?? 0 }}
        placeholder="Team, captain, city…"
      />
      {teams?.length ? (
        <ul className="space-y-4">
          {teams.map((t) => (
            <li key={t.id} className="rounded-2xl bg-white p-5 shadow-[0_8px_24px_rgba(15,46,99,0.05)] ring-1 ring-line sm:p-6">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-heading text-xl font-bold text-navy">{t.team_name}</p>
                  <p className="mt-0.5 text-sm text-slate-500">
                    {t.city}, {stateByCode.get(t.state_code)?.name ?? t.state_code}
                  </p>
                </div>
                <StatusPill status={t.status} />
              </div>
              <div className="mt-5">
                <Details
                  items={[
                    { label: "Reference", value: <span className="font-mono">{t.reference}</span> },
                    { label: "Received", value: dateTime(t.created_at) },
                    { label: "Captain", value: <>{t.captain_name} · <a className="text-royal hover:underline" href={`tel:${t.captain_mobile}`}>{t.captain_mobile}</a></> },
                    { label: "Vice-captain", value: t.vice_captain_name },
                    { label: "Coach", value: `${t.coach_name} · ${t.coach_contact}` },
                    { label: "Previous tournaments", value: t.previous_tournaments },
                  ]}
                />
                <p className="mt-4 text-[11px] font-bold uppercase tracking-[0.1em] text-slate-400">Squad of {t.squad.length}</p>
                <ol className="mt-2 grid list-inside list-decimal gap-x-6 gap-y-1 text-sm text-navy sm:grid-cols-2 lg:grid-cols-3">
                  {t.squad.map((name, i) => (
                    <li key={`${name}-${i}`}>{name}</li>
                  ))}
                </ol>
              </div>
              <div className="mt-5">
                <ReviewActions kind="teams" id={t.id} review={t} />
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <Empty icon={Users} title={q ? "No teams match that search" : status === "pending" ? "No teams waiting" : `No ${status} teams`}>
          {status === "pending" && !q ? "Team entries from the website appear here for approval. Approved teams are suggested when you add fixtures." : null}
        </Empty>
      )}
    </div>
  );
}

export default function TeamsAdminPage({ searchParams }: PageProps<"/admin/teams">) {
  return (
    <div className="space-y-8">
      <PageTitle eyebrow="Registrations" title="Teams" description="Team entries with their squad of twelve. Approve them to enter tournaments, or reject with a reason." />
      <Suspense fallback={<PanelSkeleton />}>
        <Body searchParams={searchParams} />
      </Suspense>
    </div>
  );
}
