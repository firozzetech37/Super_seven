import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CalendarClock, CalendarRange, Clock3, Inbox, Mail, Trophy, UserRound, Users } from "lucide-react";
import { dateOnly, Empty, PageTitle, Panel, PanelSkeleton } from "@/components/admin/ui";
import { requireAdmin } from "@/lib/admin/auth";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Dashboard" };

type Upcoming = { id: string; team_a: string; team_b: string; match_date: string | null; match_time: string | null; tournament_id: string; tournaments: { short_name: string | null; name: string } | null };

async function Body() {
  const { db, email } = await requireAdmin();
  const today = new Date().toISOString().slice(0, 10);
  const head = { count: "exact" as const, head: true };
  const [players, teams, associations, enquiries, subscribers, overdue, upcoming] = await Promise.all([
    db.from("players").select("id", head).eq("status", "pending"),
    db.from("teams").select("id", head).eq("status", "pending"),
    db.from("associations").select("id", head).eq("status", "pending"),
    db.from("enquiries").select("id", head).eq("status", "new"),
    db.from("subscribers").select("id", head).neq("status", "unsubscribed"),
    db
      .from("fixtures")
      .select("id, team_a, team_b, match_date, match_time, tournament_id, tournaments(short_name, name)")
      .in("status", ["scheduled", "live"])
      .lt("match_date", today)
      .order("match_date")
      .limit(6)
      .returns<Upcoming[]>(),
    db
      .from("fixtures")
      .select("id, team_a, team_b, match_date, match_time, tournament_id, tournaments(short_name, name)")
      .in("status", ["scheduled", "live"])
      .or(`match_date.is.null,match_date.gte.${today}`)
      .order("match_date", { nullsFirst: false })
      .order("match_time", { nullsFirst: false })
      .limit(6)
      .returns<Upcoming[]>(),
  ]);

  const cards = [
    { href: "/admin/players", label: "Players to review", value: players.count ?? 0, icon: UserRound },
    { href: "/admin/teams", label: "Teams to review", value: teams.count ?? 0, icon: Users },
    { href: "/admin/associations", label: "Associations to review", value: associations.count ?? 0, icon: Trophy },
    { href: "/admin/enquiries", label: "New enquiries", value: enquiries.count ?? 0, icon: Inbox },
    { href: "/admin/fixtures", label: "Results to enter", value: overdue.data?.length ?? 0, icon: Clock3 },
    { href: "/admin/subscribers", label: "Newsletter subscribers", value: subscribers.count ?? 0, icon: Mail, neutral: true },
  ];

  const matchList = (rows: Upcoming[]) => (
    <ul className="divide-y divide-line">
      {rows.map((f) => (
        <li key={f.id}>
          <Link href={`/admin/fixtures/${f.tournament_id}#m-${f.id}`} className="group flex flex-wrap items-center justify-between gap-x-3 gap-y-1 py-3 text-sm">
            <span className="font-bold text-navy group-hover:text-royal">
              {f.team_a} v {f.team_b}
            </span>
            <span className="text-slate-500">
              {f.tournaments?.short_name ?? f.tournaments?.name} · {dateOnly(f.match_date)}
              {f.match_time ? `, ${f.match_time.slice(0, 5)}` : ""}
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );

  return (
    <div className="space-y-8">
      <PageTitle eyebrow="Dashboard" title={<>Namaste{email ? <span className="text-royal">, {email.split("@")[0]}</span> : null}</>} description="What needs you today. Numbers in gold are waiting for an admin." />

      <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {cards.map((c) => {
          const Icon = c.icon;
          const waiting = !c.neutral && c.value > 0;
          return (
            <li key={c.href}>
              <Link
                href={c.href}
                className={cn(
                  "group flex items-center gap-4 rounded-2xl p-5 ring-1 transition hover:-translate-y-0.5",
                  waiting ? "bg-stadium text-white shadow-[0_18px_40px_rgba(15,46,99,0.25)] ring-navy" : "bg-white text-navy shadow-[0_8px_24px_rgba(15,46,99,0.05)] ring-line hover:ring-royal/30",
                )}
              >
                <span className={cn("grid size-12 shrink-0 place-items-center rounded-2xl", waiting ? "bg-gold text-navy" : "bg-royal/10 text-royal")}>
                  <Icon className="size-6" aria-hidden="true" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className={cn("block font-heading text-3xl font-bold leading-none tabular-nums", waiting ? "text-gold" : "text-navy")}>{c.value}</span>
                  <span className={cn("mt-1 block text-sm font-bold", waiting ? "text-white/80" : "text-slate-500")}>{c.label}</span>
                </span>
                <ArrowRight className={cn("size-5 shrink-0 transition-transform group-hover:translate-x-1", waiting ? "text-gold" : "text-slate-300")} aria-hidden="true" />
              </Link>
            </li>
          );
        })}
      </ul>

      <div className="grid gap-6 lg:grid-cols-2">
        <Panel title="Waiting for a result" description="Played (date has passed) but no score yet." icon={Clock3}>
          {overdue.data?.length ? matchList(overdue.data) : <p className="text-sm text-slate-500">All caught up.</p>}
        </Panel>
        <Panel
          title="Coming up"
          description="The next matches, as shown in the ticker on every page."
          icon={CalendarClock}
          actions={
            <Link href="/admin/fixtures" className="text-sm font-bold text-royal hover:underline">
              All fixtures
            </Link>
          }
        >
          {upcoming.data?.length ? (
            matchList(upcoming.data)
          ) : (
            <Empty icon={CalendarRange} title="No upcoming matches">
              The site shows &ldquo;Fixtures to be announced&rdquo;. <Link href="/admin/fixtures#new" className="font-bold text-royal hover:underline">Create a tournament</Link> to add some.
            </Empty>
          )}
        </Panel>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  return (
    <Suspense fallback={<PanelSkeleton rows={6} />}>
      <Body />
    </Suspense>
  );
}
