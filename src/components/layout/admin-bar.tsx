"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { CalendarRange, Images, LayoutDashboard, LogOut, Pencil, ShieldCheck } from "lucide-react";
import { signOut } from "@/lib/admin/actions/auth";
import { cn } from "@/lib/utils";

type Me = { email: string; waiting: number };

const links = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/fixtures", label: "Fixtures", icon: CalendarRange },
  { href: "/admin/media", label: "Media", icon: Images },
];

/** A shortcut to the admin page that manages what is on the current public page. */
const shortcuts: { match: (path: string) => boolean; label: string; href: string }[] = [
  { match: (p) => p.startsWith("/gallery"), label: "Add photos", href: "/admin/media" },
  { match: (p) => p.startsWith("/fixtures"), label: "Enter results", href: "/admin/fixtures" },
  { match: (p) => p.startsWith("/players") || p.startsWith("/register/player"), label: "Approve players", href: "/admin/players" },
  { match: (p) => p.startsWith("/teams"), label: "Edit state units", href: "/admin/state-units" },
  { match: (p) => p.startsWith("/register/team"), label: "Approve teams", href: "/admin/teams" },
  { match: (p) => p.startsWith("/news"), label: "Edit news", href: "/admin/news" },
  { match: (p) => p.startsWith("/about"), label: "Edit people", href: "/admin/people" },
  { match: (p) => p.startsWith("/governance/documents"), label: "Edit documents", href: "/admin/documents" },
  { match: (p) => p.startsWith("/register/district"), label: "District associations", href: "/admin/associations" },
  { match: (p) => p.startsWith("/locations"), label: "Update the map", href: "/admin/districts" },
  { match: (p) => p.startsWith("/contact"), label: "Read enquiries", href: "/admin/enquiries" },
];

/** True when a Supabase sign-in cookie exists, so ordinary visitors never trigger the admin check. */
const hasSession = () => document.cookie.split("; ").some((c) => /^sb-[^=]+-auth-token/.test(c));

/**
 * Slim bar above the site header, shown only to signed-in admins: links into the admin area, a shortcut for the
 * current page, items waiting for review, and sign out. The public pages stay static; the check runs in the browser.
 */
export function AdminBar() {
  const pathname = usePathname();
  const [me, setMe] = useState<Me | null>(null);

  useEffect(() => {
    if (!hasSession()) return;
    let alive = true;
    fetch("/admin/me", { cache: "no-store", credentials: "same-origin" })
      .then((r) => (r.ok ? r.json() : null))
      .then((d: { admin?: boolean; email?: string; waiting?: number } | null) => {
        if (alive && d?.admin && d.email) setMe({ email: d.email, waiting: d.waiting ?? 0 });
      })
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, []);

  if (!me) return null;
  const shortcut = shortcuts.find((s) => s.match(pathname));

  return (
    <div role="region" aria-label="Admin shortcuts" className="relative z-50 border-b border-white/10 bg-navy-deep text-[13px] text-white">
      <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-1.5 sm:px-6">
        <Link href="/admin" className="inline-flex shrink-0 items-center gap-1.5 font-bold text-gold hover:text-white">
          <ShieldCheck className="size-4" aria-hidden="true" />
          <span className="hidden sm:inline">SSCFI Admin</span>
        </Link>
        <span aria-hidden="true" className="h-4 w-px shrink-0 bg-white/15" />
        <nav aria-label="Admin" className="flex min-w-0 flex-1 items-center gap-1 overflow-x-auto [scrollbar-width:none]">
          {shortcut ? (
            <Link
              href={shortcut.href}
              className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-gold px-2.5 py-1 font-bold text-navy transition hover:bg-white"
            >
              <Pencil className="size-3.5" aria-hidden="true" />
              {shortcut.label}
            </Link>
          ) : null}
          {links
            .filter((l) => l.href !== shortcut?.href)
            .map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 font-semibold text-white/80 transition hover:bg-white/10 hover:text-white"
              >
                <l.icon className="size-3.5" aria-hidden="true" />
                {l.label}
                {l.href === "/admin" && me.waiting ? (
                  <span className="rounded-full bg-gold px-1.5 text-[11px] font-bold tabular-nums text-navy" title="Registrations and enquiries waiting">
                    {me.waiting}
                  </span>
                ) : null}
              </Link>
            ))}
        </nav>
        <span className="hidden max-w-48 shrink truncate text-white/50 md:inline">{me.email}</span>
        <form action={signOut} className="shrink-0">
          <button type="submit" className={cn("inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 font-semibold text-white/80 transition hover:bg-white/10 hover:text-white")}>
            <LogOut className="size-3.5" aria-hidden="true" />
            <span className="hidden sm:inline">Sign out</span>
          </button>
        </form>
      </div>
    </div>
  );
}
