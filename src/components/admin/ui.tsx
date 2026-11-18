import Link from "next/link";
import { ChevronDown, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

/* Server-safe building blocks for admin pages. */

export function PageTitle({
  eyebrow,
  title,
  description,
  actions,
  back,
}: {
  eyebrow: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  actions?: React.ReactNode;
  back?: { href: string; label: string };
}) {
  return (
    <header className="flex flex-col gap-4 border-b border-line pb-6 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        {back ? (
          <Link href={back.href} className="mb-3 inline-flex items-center gap-1.5 text-xs font-bold text-royal hover:underline">
            ← {back.label}
          </Link>
        ) : null}
        <p className="flex items-center gap-2.5 text-[11px] font-bold uppercase tracking-[0.22em] text-gold-deep">
          <span aria-hidden="true" className="h-px w-6 bg-gold" />
          {eyebrow}
        </p>
        <h1 className="mt-2 font-heading text-3xl font-bold leading-tight text-navy sm:text-[2.1rem]">{title}</h1>
        {description ? <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-slate-500">{description}</p> : null}
      </div>
      {actions ? <div className="flex shrink-0 flex-wrap gap-2">{actions}</div> : null}
    </header>
  );
}

export function Panel({
  title,
  description,
  icon: Icon,
  actions,
  children,
  className,
  id,
}: {
  title?: React.ReactNode;
  description?: React.ReactNode;
  icon?: LucideIcon;
  actions?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <section id={id} className={cn("scroll-mt-24 rounded-2xl bg-white p-5 shadow-[0_8px_24px_rgba(15,46,99,0.05)] ring-1 ring-line sm:p-6", className)}>
      {title ? (
        <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
          <div className="flex min-w-0 items-start gap-3">
            {Icon ? (
              <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-royal/10 text-royal">
                <Icon className="size-5" aria-hidden="true" />
              </span>
            ) : null}
            <div className="min-w-0">
              <h2 className="font-heading text-xl font-bold leading-tight text-navy">{title}</h2>
              {description ? <p className="mt-1 text-sm leading-relaxed text-slate-500">{description}</p> : null}
            </div>
          </div>
          {actions}
        </div>
      ) : null}
      {children}
    </section>
  );
}

const pillTones = {
  pending: "bg-gold/15 text-[#8a6418] ring-gold/40",
  approved: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  rejected: "bg-ball/10 text-ball ring-ball/30",
  scheduled: "bg-royal/10 text-royal ring-royal/25",
  live: "bg-ball text-white ring-ball",
  completed: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  walkover: "bg-slate-100 text-slate-600 ring-slate-200",
  abandoned: "bg-slate-100 text-slate-500 ring-slate-200",
  new: "bg-gold/15 text-[#8a6418] ring-gold/40",
  replied: "bg-royal/10 text-royal ring-royal/25",
  closed: "bg-slate-100 text-slate-500 ring-slate-200",
  confirmed: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  unsubscribed: "bg-slate-100 text-slate-500 ring-slate-200",
  onboarded: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  in_discussion: "bg-gold/15 text-[#8a6418] ring-gold/40",
  not_reached: "bg-slate-100 text-slate-500 ring-slate-200",
} as const;

export type PillTone = keyof typeof pillTones;

export function StatusPill({ status, label }: { status: string; label?: string }) {
  const tone = pillTones[status as PillTone] ?? "bg-slate-100 text-slate-600 ring-slate-200";
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-[0.08em] ring-1", tone)}>
      {status === "live" ? <span aria-hidden="true" className="size-1.5 animate-pulse rounded-full bg-white" /> : null}
      {label ?? status.replace("_", " ")}
    </span>
  );
}

export function Empty({ icon: Icon, title, children }: { icon: LucideIcon; title: string; children?: React.ReactNode }) {
  return (
    <div className="grid place-items-center rounded-2xl border border-dashed border-line bg-surface/60 px-6 py-12 text-center">
      <span className="grid size-12 place-items-center rounded-2xl bg-white text-royal shadow-sm ring-1 ring-line">
        <Icon className="size-6" aria-hidden="true" />
      </span>
      <p className="mt-4 font-heading text-lg font-bold text-navy">{title}</p>
      {children ? <div className="mt-1.5 max-w-md text-sm leading-relaxed text-slate-500">{children}</div> : null}
    </div>
  );
}

/** Native <details> styled as an expandable row; open state survives server refreshes when `open` is passed. */
export function Disclosure({
  summary,
  children,
  open,
  className,
  tone = "plain",
}: {
  summary: React.ReactNode;
  children: React.ReactNode;
  open?: boolean;
  className?: string;
  tone?: "plain" | "accent";
}) {
  return (
    <details open={open} className={cn("group/d rounded-xl ring-1", tone === "accent" ? "bg-royal/[0.03] ring-royal/20" : "bg-white ring-line", className)}>
      <summary className="flex cursor-pointer list-none items-center justify-between gap-3 rounded-xl px-4 py-3 text-sm font-bold text-navy outline-none transition hover:bg-surface focus-visible:ring-2 focus-visible:ring-royal [&::-webkit-details-marker]:hidden">
        <span className="min-w-0">{summary}</span>
        <ChevronDown className="size-4 shrink-0 text-slate-400 transition-transform duration-200 group-open/d:rotate-180" aria-hidden="true" />
      </summary>
      <div className="border-t border-line px-4 pb-4 pt-4">{children}</div>
    </details>
  );
}

/** Tab-like filter links (server-rendered; the current one is highlighted). */
export function FilterTabs({ tabs, current }: { tabs: { href: string; label: string; count?: number; value: string }[]; current: string }) {
  return (
    <nav aria-label="Filter" className="flex flex-wrap gap-2">
      {tabs.map((t) => {
        const active = t.value === current;
        return (
          <Link
            key={t.value}
            href={t.href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-sm font-bold ring-1 transition",
              active ? "bg-navy text-white ring-navy" : "bg-white text-navy ring-line hover:ring-slate-300",
            )}
          >
            {t.label}
            {t.count !== undefined ? (
              <span className={cn("rounded-full px-1.5 text-[11px] tabular-nums", active ? "bg-white/20" : "bg-surface text-slate-500")}>{t.count}</span>
            ) : null}
          </Link>
        );
      })}
    </nav>
  );
}

/** Key–value grid for registration details. */
export function Details({ items }: { items: { label: string; value?: React.ReactNode }[] }) {
  return (
    <dl className="grid gap-x-6 gap-y-3 sm:grid-cols-2 lg:grid-cols-3">
      {items
        .filter((i) => i.value !== undefined && i.value !== null && i.value !== "")
        .map((i) => (
          <div key={i.label} className="min-w-0">
            <dt className="text-[11px] font-bold uppercase tracking-[0.1em] text-slate-400">{i.label}</dt>
            <dd className="mt-0.5 break-words text-sm text-navy">{i.value}</dd>
          </div>
        ))}
    </dl>
  );
}

export function PanelSkeleton({ rows = 4 }: { rows?: number }) {
  return (
    <div className="space-y-6" aria-busy="true" aria-label="Loading">
      <div className="h-24 animate-pulse rounded-2xl bg-white ring-1 ring-line" />
      <div className="space-y-3 rounded-2xl bg-white p-6 ring-1 ring-line">
        {Array.from({ length: rows }, (_, i) => (
          <div key={i} className="h-12 animate-pulse rounded-xl bg-surface" />
        ))}
      </div>
    </div>
  );
}

export const dateTime = (iso: string) =>
  new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit", timeZone: "Asia/Kolkata" }).format(new Date(iso));

export const dateOnly = (iso?: string | null) =>
  iso ? new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" }).format(new Date(`${iso.slice(0, 10)}T00:00:00Z`)) : "Date to be announced";
