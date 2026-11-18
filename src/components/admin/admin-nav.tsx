"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CalendarRange, Images, Inbox, LayoutDashboard, Map, Mail, Newspaper, ShieldCheck, Trophy, UserRound, Users, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export type NavCounts = Partial<Record<"players" | "teams" | "associations" | "enquiries" | "results", number>>;

type NavItem = { href: string; label: string; icon: LucideIcon; exact?: boolean; count?: keyof NavCounts; /** A sub-path that has its own item. */ except?: string };

const groups: { title: string; items: NavItem[] }[] = [
  { title: "Overview", items: [{ href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true }] },
  { title: "Matches", items: [{ href: "/admin/fixtures", label: "Tournaments & fixtures", icon: CalendarRange, count: "results" }] },
  {
    title: "Registrations",
    items: [
      { href: "/admin/players", label: "Players", icon: UserRound, count: "players" },
      { href: "/admin/teams", label: "Teams", icon: Users, count: "teams" },
      { href: "/admin/associations", label: "District associations", icon: Trophy, count: "associations" },
    ],
  },
  {
    title: "Media",
    items: [
      { href: "/admin/media", label: "Photo albums", icon: Images, except: "/admin/media/press" },
      { href: "/admin/media/press", label: "Press clippings", icon: Newspaper },
    ],
  },
  { title: "Map", items: [{ href: "/admin/districts", label: "District status", icon: Map }] },
  {
    title: "Inbox",
    items: [
      { href: "/admin/enquiries", label: "Enquiries", icon: Inbox, count: "enquiries" },
      { href: "/admin/subscribers", label: "Newsletter", icon: Mail },
    ],
  },
  { title: "Settings", items: [{ href: "/admin/admins", label: "Admins", icon: ShieldCheck }] },
];

const all = groups.flatMap((g) => g.items);

function isActive(pathname: string, item: NavItem) {
  if (item.except && pathname.startsWith(item.except)) return false;
  return item.exact ? pathname === item.href : pathname === item.href || pathname.startsWith(`${item.href}/`);
}

function Badge({ n, active }: { n?: number; active: boolean }) {
  if (!n) return null;
  return (
    <span className={cn("ml-auto rounded-full px-2 py-px text-[11px] font-bold tabular-nums", active ? "bg-navy text-gold" : "bg-gold text-navy")}>
      {n > 99 ? "99+" : n}
    </span>
  );
}

/** Sidebar navigation (desktop). Counts are items waiting for an admin. */
export function AdminSidebarNav({ counts = {} }: { counts?: NavCounts }) {
  const pathname = usePathname();
  return (
    <nav aria-label="Admin" className="space-y-6">
      {groups.map((g) => (
        <div key={g.title}>
          <p className="px-3 text-[10px] font-bold uppercase tracking-[0.22em] text-white/40">{g.title}</p>
          <ul className="mt-2 space-y-1">
            {g.items.map((item) => {
              const active = isActive(pathname, item);
              const Icon = item.icon;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-bold transition",
                      active ? "bg-gold text-navy shadow-[0_8px_20px_rgba(217,174,86,0.25)]" : "text-white/80 hover:bg-white/10 hover:text-white",
                    )}
                  >
                    <Icon className="size-[1.1rem] shrink-0" aria-hidden="true" />
                    {item.label}
                    <Badge n={item.count ? counts[item.count] : undefined} active={active} />
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}

/** Horizontal scrolling navigation (phones and tablets). */
export function AdminTabsNav({ counts = {} }: { counts?: NavCounts }) {
  const pathname = usePathname();
  return (
    <nav aria-label="Admin" className="-mx-4 overflow-x-auto px-4 pb-1 [scrollbar-width:none] sm:-mx-6 sm:px-6">
      <ul className="flex w-max gap-2">
        {all.map((item) => {
          const active = isActive(pathname, item);
          const Icon = item.icon;
          const n = item.count ? counts[item.count] : undefined;
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex items-center gap-2 whitespace-nowrap rounded-full px-3.5 py-2 text-[13px] font-bold ring-1 transition",
                  active ? "bg-gold text-navy ring-gold" : "bg-white/5 text-white/85 ring-white/15 hover:bg-white/10",
                )}
              >
                <Icon className="size-4" aria-hidden="true" />
                {item.label}
                {n ? <span className={cn("rounded-full px-1.5 text-[11px] tabular-nums", active ? "bg-navy text-gold" : "bg-gold text-navy")}>{n}</span> : null}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
