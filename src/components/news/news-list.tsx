"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Archive, ArrowRight, CalendarDays, Hourglass, Inbox, Megaphone, Newspaper, Mail } from "lucide-react";
import { GroundWatermark } from "@/components/layout/ground-watermark";
import { Reveal } from "@/components/motion/reveal";
import { cn } from "@/lib/utils";
import { formatNewsDate, newsTypeLabel, newsTypes, type NewsItem, type NewsType } from "@/lib/data/news";

const typeIcons = { news: Newspaper, announcement: Megaphone, newsletter: Mail } as const;

export function NewsList({ items }: { items: NewsItem[] }) {
  const [filter, setFilter] = useState<NewsType | "all">("all");
  const visible = items.filter((n) => filter === "all" || n.type === filter);
  const counts = Object.fromEntries(newsTypes.map((t) => [t.value, t.value === "all" ? items.length : items.filter((n) => n.type === t.value).length]));
  const featured = visible.filter((n) => n.featured);
  const rest = visible.filter((n) => !n.featured);

  return (
    <div>
      <Reveal className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div
          role="group"
          aria-label="Filter by type"
          className="flex flex-wrap gap-1.5 sm:w-fit sm:flex-nowrap sm:rounded-full sm:bg-white sm:p-1.5 sm:shadow-[0_12px_30px_rgba(15,46,99,0.08)] sm:ring-1 sm:ring-line"
        >
          {newsTypes.map((t) => {
            const active = filter === t.value;
            return (
              <button
                key={t.value}
                type="button"
                aria-pressed={active}
                onClick={() => setFilter(t.value)}
                className={cn(
                  "inline-flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-sm font-bold ring-1 transition duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold sm:ring-0",
                  active ? "bg-navy text-white shadow-[0_8px_18px_rgba(15,46,99,0.25)] ring-navy" : "bg-white text-navy ring-line hover:bg-surface hover:text-royal",
                )}
              >
                {t.label}
                <span className={cn("rounded-full px-1.5 text-[11px] tabular-nums", active ? "bg-gold text-navy" : "bg-surface text-slate-500")}>{counts[t.value]}</span>
              </button>
            );
          })}
        </div>
        <p aria-live="polite" className="text-sm text-slate-500">
          Showing <span className="font-bold text-navy">{visible.length}</span> of {items.length}
        </p>
      </Reveal>

      {visible.length ? (
        <div key={filter} className="mt-8 space-y-6">
          {featured.map((n) => (
            <Reveal key={n.id} from="scale">
              <FeaturedCard item={n} />
            </Reveal>
          ))}
          {rest.length ? (
            <Reveal stagger={90} as="ul" className="grid gap-6 lg:grid-cols-2">
              {rest.map((n) => (
                <li key={n.id}>
                  <NewsCard item={n} />
                </li>
              ))}
            </Reveal>
          ) : null}
        </div>
      ) : (
        <div className="relative mt-8 flex flex-col items-center gap-3 overflow-hidden rounded-3xl bg-white px-6 py-12 text-center ring-1 ring-line motion-safe:animate-in motion-safe:fade-in motion-safe:zoom-in-95 motion-safe:duration-500">
          <GroundWatermark className="pointer-events-none absolute left-1/2 top-1/2 w-[640px] -translate-x-1/2 -translate-y-1/2 text-navy/[0.04]" />
          <span className="relative grid size-14 place-items-center rounded-2xl bg-royal/10 text-royal motion-safe:animate-float">
            <Inbox className="size-7" aria-hidden="true" />
          </span>
          <p className="relative font-heading text-2xl font-bold text-navy">No {filter === "all" ? "stories" : newsTypes.find((t) => t.value === filter)?.label.toLowerCase()} yet</p>
          <p className="relative max-w-md text-[15px] text-slate-500">
            {filter === "newsletter"
              ? "The first issue goes out when the next fixtures are confirmed. Subscribe below and it lands in your inbox."
              : "Nothing here yet. Subscribe below to hear the moment something is published."}
          </p>
          <a
            href="#newsletter"
            className="group relative mt-2 inline-flex items-center gap-2 rounded-full bg-navy px-5 py-2.5 font-bold text-white transition hover:bg-royal"
          >
            Subscribe
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
          </a>
        </div>
      )}
    </div>
  );
}

function Meta({ item, dark }: { item: NewsItem; dark?: boolean }) {
  return (
    <p className={cn("flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[11px] font-bold uppercase tracking-[0.18em]", dark ? "text-white/70" : "text-slate-500")}>
      <span className="flex items-center gap-1.5">
        <CalendarDays className={cn("size-3.5", dark ? "text-gold" : "text-gold-deep")} aria-hidden="true" />
        {formatNewsDate(item.date)}
      </span>
      {item.archive ? (
        <span className={cn("flex items-center gap-1 rounded-full px-2 py-0.5 ring-1", dark ? "bg-white/10 ring-white/15" : "bg-surface ring-line")}>
          <Archive className="size-3" aria-hidden="true" />
          Archive
        </span>
      ) : null}
    </p>
  );
}

function Status({ item, dark }: { item: NewsItem; dark?: boolean }) {
  if (item.pending) {
    return (
      <span className={cn("inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-bold ring-1", dark ? "bg-gold/15 text-gold ring-gold/40" : "bg-gold/15 text-gold-deep ring-gold/40")}>
        <Hourglass className="size-3.5" aria-hidden="true" />
        Details to be added
      </span>
    );
  }
  if (item.href) {
    return (
      <span className={cn("inline-flex items-center gap-3 text-sm font-bold", dark ? "text-white" : "text-royal")}>
        Read more
        <span className="grid size-9 place-items-center rounded-full bg-surface text-royal ring-1 ring-line transition duration-300 group-hover:bg-royal group-hover:text-white group-hover:ring-royal">
          <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5" aria-hidden="true" />
        </span>
      </span>
    );
  }
  return null;
}

function Shell({ item, className, children }: { item: NewsItem; className: string; children: React.ReactNode }) {
  return item.href ? (
    <Link href={item.href} className={cn(className, "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-gold")}>
      {children}
    </Link>
  ) : (
    <article className={className}>{children}</article>
  );
}

/** The lead story: a dark stage with the cover beside the copy. */
function FeaturedCard({ item }: { item: NewsItem }) {
  const Icon = typeIcons[item.type];
  return (
    <Shell
      item={item}
      className="group card-premium relative isolate grid overflow-hidden rounded-[2rem] bg-stadium text-white shadow-[0_40px_80px_rgba(15,46,99,0.28)] md:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)]"
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <GroundWatermark className="parallax-slow absolute -right-40 -top-24 w-[720px] text-white/[0.05]" />
        <div className="absolute -bottom-32 right-1/4 size-[380px] rounded-full bg-gold/10 blur-[110px]" />
        <div className="absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(217,174,86,0.8)_25%,rgba(217,174,86,0.8)_75%,transparent)]" />
      </div>
      {item.cover ? (
        <div className="p-3 sm:p-4">
          <div className="relative aspect-[16/10] overflow-hidden rounded-[1.4rem] bg-navy-deep ring-1 ring-white/10 md:aspect-auto md:h-full md:min-h-[300px]">
            <Image
              src={item.cover}
              alt={item.coverAlt ?? ""}
              fill
              sizes="(min-width: 1280px) 600px, (min-width: 768px) 50vw, 92vw"
              className="object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-105"
            />
            <span aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(to_top,rgba(5,16,45,0.55),transparent_45%)]" />
            <span className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full bg-gold px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-navy shadow-[0_6px_16px_rgba(4,15,42,0.4)]">
              <span aria-hidden="true" className="relative flex size-1.5">
                <span className="absolute inset-0 rounded-full bg-navy motion-safe:animate-ping" />
                <span className="relative size-1.5 rounded-full bg-navy" />
              </span>
              Featured
            </span>
          </div>
        </div>
      ) : null}
      <div className="flex flex-col justify-center px-6 pb-8 pt-3 sm:px-8 md:py-10 lg:px-12">
        <p className="flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.24em] text-gold">
          <Icon className="size-4" aria-hidden="true" />
          {newsTypeLabel[item.type]}
        </p>
        <h3 className="mt-4 font-heading text-[1.75rem] font-bold leading-[1.12] sm:text-3xl lg:text-[2.4rem]">{item.title}</h3>
        <div className="mt-4">
          <Meta item={item} dark />
        </div>
        <p className="mt-4 text-[17px] leading-relaxed text-white/75">{item.summary}</p>
        <div className="mt-7">
          <Status item={item} dark />
        </div>
      </div>
    </Shell>
  );
}

/** Standard story: compact cover (archive photos are small) beside the copy; a designed panel when there is no cover. */
function NewsCard({ item }: { item: NewsItem }) {
  const Icon = typeIcons[item.type];
  const year = item.date?.slice(0, 4);
  return (
    <Shell
      item={item}
      className="group card-premium relative flex h-full flex-col overflow-hidden rounded-3xl bg-white p-3 shadow-[0_12px_30px_rgba(15,46,99,0.07)] ring-1 ring-line transition duration-300 hover:-translate-y-1.5 hover:shadow-[0_28px_60px_rgba(15,46,99,0.14)] sm:flex-row"
    >
      <div className="relative aspect-[16/9] shrink-0 overflow-hidden rounded-2xl bg-navy sm:aspect-auto sm:w-52 lg:w-56">
        {item.cover ? (
          <span className="duotone absolute inset-0 block">
            <Image
              src={item.cover}
              alt={item.coverAlt ?? ""}
              fill
              sizes="(min-width: 640px) 224px, 92vw"
              className="object-cover transition-transform duration-700 group-hover:scale-110"
            />
          </span>
        ) : (
          <span aria-hidden="true" className="absolute inset-0 grid place-items-center overflow-hidden bg-stadium">
            <GroundWatermark className="absolute left-1/2 top-1/2 w-[260%] -translate-x-1/2 -translate-y-1/2 text-white/[0.08] transition-transform duration-1000 group-hover:rotate-6" />
            <span className="relative text-center">
              <Icon className="mx-auto size-7 text-gold transition-transform duration-300 group-hover:-rotate-6" />
              {year ? <span className="mt-2 block font-heading text-4xl font-bold text-white/90">{year}</span> : null}
            </span>
          </span>
        )}
        <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-white/95 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-navy shadow">
          <Icon className="size-3 text-royal" aria-hidden="true" />
          {newsTypeLabel[item.type]}
        </span>
      </div>
      <div className="flex flex-1 flex-col px-3 pb-3 pt-5 sm:px-6 sm:py-4">
        <Meta item={item} />
        <h3 className="mt-3 font-heading text-xl font-bold leading-snug text-navy transition-colors group-hover:text-royal">{item.title}</h3>
        <p className="mt-2 text-[15px] leading-relaxed text-slate-600">{item.summary}</p>
        <div className="mt-auto pt-5">
          <Status item={item} />
        </div>
      </div>
      <span aria-hidden="true" className="absolute inset-x-6 top-0 h-[3px] origin-left scale-x-0 rounded-b-full bg-gold transition-transform duration-500 group-hover:scale-x-100" />
    </Shell>
  );
}
