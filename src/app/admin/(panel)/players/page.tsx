import { Suspense } from "react";
import type { Metadata } from "next";
import { UserRound } from "lucide-react";
import { ReviewActions, ReviewToolbar, readStatus, searchFilter, type Review } from "@/components/admin/review";
import { dateOnly, dateTime, Details, Empty, PageTitle, PanelSkeleton, StatusPill } from "@/components/admin/ui";
import { requireAdmin } from "@/lib/admin/auth";
import { stateByCode } from "@/lib/geo/load";

export const metadata: Metadata = { title: "Players" };

type Player = Review & {
  id: string;
  reference: string;
  player_id: string | null;
  full_name: string;
  guardian_name: string;
  email: string;
  mobile: string;
  dob: string;
  gender: string;
  address: string;
  pincode: string;
  city: string;
  state_code: string;
  category: string;
  batting_style: string;
  bowling_style: string;
  club: string | null;
  guardian_consent: boolean;
  created_at: string;
};

function age(dob: string) {
  const d = new Date(`${dob}T00:00:00Z`);
  const now = new Date();
  let a = now.getUTCFullYear() - d.getUTCFullYear();
  if (now.getUTCMonth() < d.getUTCMonth() || (now.getUTCMonth() === d.getUTCMonth() && now.getUTCDate() < d.getUTCDate())) a--;
  return a;
}

async function Body({ searchParams }: { searchParams: PageProps<"/admin/players">["searchParams"] }) {
  const { db } = await requireAdmin();
  const params = await searchParams;
  const status = readStatus(params.status);
  const q = typeof params.q === "string" ? params.q.trim() : "";

  let query = db.from("players").select("*").order("created_at", { ascending: status === "pending" }).limit(200);
  if (status !== "all") query = query.eq("status", status);
  const filter = searchFilter(q, ["full_name", "reference", "player_id", "email", "mobile", "city"]);
  if (filter) query = query.or(filter);

  const head = { count: "exact" as const, head: true };
  const [{ data: players }, pending, approved, rejected] = await Promise.all([
    query.returns<Player[]>(),
    db.from("players").select("id", head).eq("status", "pending"),
    db.from("players").select("id", head).eq("status", "approved"),
    db.from("players").select("id", head).eq("status", "rejected"),
  ]);

  return (
    <div className="space-y-6">
      <ReviewToolbar
        base="/admin/players"
        status={status}
        q={q}
        counts={{ pending: pending.count ?? 0, approved: approved.count ?? 0, rejected: rejected.count ?? 0 }}
        placeholder="Name, reference, ID, phone…"
      />
      {players?.length ? (
        <ul className="space-y-4">
          {players.map((p) => (
            <li key={p.id} className="rounded-2xl bg-white p-5 shadow-[0_8px_24px_rgba(15,46,99,0.05)] ring-1 ring-line sm:p-6">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-heading text-xl font-bold text-navy">{p.full_name}</p>
                  <p className="mt-0.5 text-sm text-slate-500">
                    {p.category[0].toUpperCase() + p.category.slice(1)} · {p.gender} · {age(p.dob)} years · {p.city}, {stateByCode.get(p.state_code)?.name ?? p.state_code}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  {p.player_id ? <span className="rounded-lg bg-navy px-2.5 py-1 font-mono text-sm font-bold text-gold">{p.player_id}</span> : null}
                  <StatusPill status={p.status} />
                </div>
              </div>
              <div className="mt-5">
                <Details
                  items={[
                    { label: "Reference", value: <span className="font-mono">{p.reference}</span> },
                    { label: "Received", value: dateTime(p.created_at) },
                    { label: "Date of birth", value: dateOnly(p.dob) },
                    { label: "Mobile", value: <a className="text-royal hover:underline" href={`tel:${p.mobile}`}>{p.mobile}</a> },
                    { label: "Email", value: <a className="text-royal hover:underline" href={`mailto:${p.email}`}>{p.email}</a> },
                    { label: "Parent / guardian", value: `${p.guardian_name}${p.guardian_consent ? " (consent given)" : ""}` },
                    { label: "Batting", value: `${p.batting_style}-handed` },
                    { label: "Bowling", value: p.bowling_style },
                    { label: "Club", value: p.club },
                    { label: "Address", value: `${p.address}, ${p.city} ${p.pincode}` },
                  ]}
                />
              </div>
              <div className="mt-5">
                <ReviewActions kind="players" id={p.id} review={p} approvedNote={p.player_id ? `ID ${p.player_id}` : undefined} canReopen={!p.player_id} />
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <Empty icon={UserRound} title={q ? "No players match that search" : status === "pending" ? "No players waiting" : `No ${status} players`}>
          {status === "pending" && !q ? "New player registrations from the website appear here for approval." : null}
        </Empty>
      )}
    </div>
  );
}

export default function PlayersAdminPage({ searchParams }: PageProps<"/admin/players">) {
  return (
    <div className="space-y-8">
      <PageTitle
        eyebrow="Registrations"
        title="Players"
        description="Check each registration, then approve it to issue a Player ID (00001-WB style, numbered per state) or reject it with a reason."
      />
      <Suspense fallback={<PanelSkeleton />}>
        <Body searchParams={searchParams} />
      </Suspense>
    </div>
  );
}
