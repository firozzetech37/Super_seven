import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { ExternalLink, LogOut } from "lucide-react";
import { AdminSidebarNav, AdminTabsNav, type NavCounts } from "@/components/admin/admin-nav";
import { AdminToaster } from "@/components/admin/admin-toaster";
import { getAdmin } from "@/lib/admin/auth";
import { signOut } from "@/lib/admin/actions/auth";

/** Items waiting for an admin, shown as badges in the navigation. */
async function counts(): Promise<NavCounts> {
  const admin = await getAdmin();
  if (!admin) return {};
  const { db } = admin;
  const today = new Date().toISOString().slice(0, 10);
  const head = { count: "exact" as const, head: true };
  const [players, teams, associations, enquiries, results] = await Promise.all([
    db.from("players").select("id", head).eq("status", "pending"),
    db.from("teams").select("id", head).eq("status", "pending"),
    db.from("associations").select("id", head).eq("status", "pending"),
    db.from("enquiries").select("id", head).eq("status", "new"),
    db.from("fixtures").select("id", head).in("status", ["scheduled", "live"]).lt("match_date", today),
  ]);
  return {
    players: players.count ?? 0,
    teams: teams.count ?? 0,
    associations: associations.count ?? 0,
    enquiries: enquiries.count ?? 0,
    results: results.count ?? 0,
  };
}

async function SidebarNav() {
  return <AdminSidebarNav counts={await counts()} />;
}
async function TabsNav() {
  return <AdminTabsNav counts={await counts()} />;
}
async function SignedInAs() {
  const admin = await getAdmin();
  return admin ? <span className="block truncate">{admin.email}</span> : null;
}

/** Loading placeholders for the navigation (they must not read the URL: that would block the static shell). */
function SidebarSkeleton() {
  return (
    <div className="space-y-2 px-3" aria-hidden="true">
      {Array.from({ length: 9 }, (_, i) => (
        <div key={i} className="h-9 animate-pulse rounded-xl bg-white/[0.06]" />
      ))}
    </div>
  );
}
function TabsSkeleton() {
  return <div className="h-9 animate-pulse rounded-full bg-white/[0.06]" aria-hidden="true" />;
}

function SignOutButton() {
  return (
    <form action={signOut}>
      <button type="submit" className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-bold text-white/80 transition hover:bg-white/10 hover:text-white">
        <LogOut className="size-4" aria-hidden="true" />
        Sign out
      </button>
    </form>
  );
}

function Brand() {
  return (
    <Link href="/admin" className="flex items-center gap-3">
      <Image src="/brand/logo.png" alt="" width={40} height={40} className="size-10 rounded-full bg-white p-0.5 ring-2 ring-gold/60" />
      <span className="leading-tight">
        <span className="block font-heading text-lg font-bold text-white">SSCFI Admin</span>
        <span className="block text-[10px] font-bold uppercase tracking-[0.22em] text-gold">Control room</span>
      </span>
    </Link>
  );
}

export default function AdminPanelLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-1">
      <aside className="sticky top-0 hidden h-dvh w-72 shrink-0 flex-col overflow-y-auto bg-stadium px-4 py-6 lg:flex">
        <div className="px-2">
          <Brand />
        </div>
        <div className="mt-8 flex-1">
          <Suspense fallback={<SidebarSkeleton />}>
            <SidebarNav />
          </Suspense>
        </div>
        <div className="mt-6 space-y-1 border-t border-white/10 pt-4">
          <p className="px-3 text-[10px] font-bold uppercase tracking-[0.22em] text-white/40">Signed in as</p>
          <div className="px-3 pb-1 text-sm text-white/85">
            <Suspense fallback={<span className="block h-5 w-40 animate-pulse rounded bg-white/10" />}>
              <SignedInAs />
            </Suspense>
          </div>
          <Link href="/" target="_blank" className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-bold text-white/80 transition hover:bg-white/10 hover:text-white">
            <ExternalLink className="size-4" aria-hidden="true" />
            View the website
          </Link>
          <SignOutButton />
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 bg-stadium px-4 pb-3 pt-[calc(env(safe-area-inset-top,0px)+0.75rem)] shadow-[0_10px_30px_rgba(4,15,42,0.25)] sm:px-6 lg:hidden">
          <div className="flex items-center justify-between gap-3">
            <Brand />
            <SignOutButton />
          </div>
          <div className="mt-3">
            <Suspense fallback={<TabsSkeleton />}>
              <TabsNav />
            </Suspense>
          </div>
        </header>
        <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 sm:px-6 lg:px-10 lg:py-10">{children}</main>
        <AdminToaster />
      </div>
    </div>
  );
}
