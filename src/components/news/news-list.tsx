"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Archive, CalendarDays, Inbox } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatNewsDate, newsTypeLabel, newsTypes, type NewsItem, type NewsType } from "@/lib/data/news";
import { Reveal } from "@/components/motion/reveal";

export function NewsList({ items }: { items: NewsItem[] }) {
  const [filter, setFilter] = useState<NewsType | "all">("all");
  const visible = items.filter((n) => filter === "all" || n.type === filter);
  const counts = Object.fromEntries(newsTypes.map((t) => [t.value, t.value === "all" ? items.length : items.filter((n) => n.type === t.value).length]));

  return (
    <div>
      <div role="group" aria-label="Filter by type" className="flex flex-wrap gap-2">
        {newsTypes.map((t) => {
          const active = filter === t.value;
          return (
            <button
              key={t.value}
              type="button"
              aria-pressed={active}
              onClick={() => setFilter(t.value)}
              className={cn(
                "inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold ring-1 transition",
                active ? "bg-navy text-white ring-navy" : "bg-white text-navy ring-line hover:ring-royal/40",
              )}
            >
              {t.label}
              <span className={cn("rounded-full px-1.5 text-[11px]", active ? "bg-white/15" : "bg-surface text-slate-500")}>{counts[t.value]}</span>
            </button>
          );
        })}
      </div>

      {visible.length ? (
        <Reveal stagger as="ul" className="mt-8 grid gap-6 md:grid-cols-2">
          {visible.map((n) => (
            <li key={n.id} className={cn(n.featured && "md:col-span-2")}>
              <NewsCard item={n} />
            </li>
          ))}
        </Reveal>
      ) : (
        <div className="mt-8 flex flex-col items-center gap-3 rounded-3xl bg-surface p-10 text-center ring-1 ring-line">
          <span className="grid size-12 place-items-center rounded-full bg-royal/10 text-royal">
            <Inbox className="size-6" aria-hidden="true" />
          </span>
          <p className="font-heading text-xl font-bold text-navy">No newsletters yet</p>
          <p className="max-w-md text-[15px] text-slate-500">
            The first issue goes out when the next fixtures are confirmed. Subscribe below and it lands in your inbox.
          </p>
          <a href="#newsletter" className="mt-2 inline-flex items-center gap-2 font-bold text-royal underline-offset-4 hover:underline">
            Subscribe
            <ArrowRight className="size-4" aria-hidden="true" />
          </a>
        </div>
      )}
    </div>
  );
}

function NewsCard({ item }: { item: NewsItem }) {
  const body = (
    <>
      {item.cover ? (
        <div className={cn("relative overflow-hidden bg-navy", item.featured ? "aspect-[16/9] md:aspect-auto md:min-h-[320px]" : "aspect-[16/9]")}>
          <Image
            src={item.cover}
            alt={item.coverAlt ?? ""}
            fill
            sizes={item.featured ? "(min-width: 768px) 50vw, 100vw" : "(min-width: 768px) 40vw, 100vw"}
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <span className="absolute left-4 top-4 rounded-full bg-gold px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-navy shadow">
            {item.featured ? "Featured" : newsTypeLabel[item.type]}
          </span>
        </div>
      ) : null}
      <div className={cn("flex flex-1 flex-col p-6", item.featured && "lg:p-10")}>
        <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] font-bold uppercase tracking-[0.2em] text-royal">
          {!item.cover ? <span>{newsTypeLabel[item.type]}</span> : null}
          <span className="flex items-center gap-1.5 text-slate-500">
            <CalendarDays className="size-3.5" aria-hidden="true" />
            {formatNewsDate(item.date)}
          </span>
          {item.archive ? (
            <span className="flex items-center gap-1 rounded-full bg-surface px-2 py-0.5 text-slate-500 ring-1 ring-line">
              <Archive className="size-3" aria-hidden="true" />
              Archive
            </span>
          ) : null}
        </p>
        <h3 className={cn("mt-3 font-heading font-bold leading-tight text-navy transition-colors group-hover:text-royal", item.featured ? "text-2xl lg:text-3xl" : "text-xl")}>
          {item.title}
        </h3>
        <p className="mt-3 text-[15px] leading-relaxed text-slate-600">{item.summary}</p>
        <p className="mt-auto pt-5 text-sm font-bold text-royal">
          {item.pending ? (
            <span className="inline-flex items-center gap-2 rounded-full bg-gold/15 px-3 py-1 text-gold-deep ring-1 ring-gold/40">
              Details to be added
            </span>
          ) : item.href ? (
            <span className="inline-flex items-center gap-1.5">
              Read more
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
            </span>
          ) : null}
        </p>
      </div>
    </>
  );

  const className = cn(
    "group flex h-full flex-col overflow-hidden rounded-3xl bg-white ring-1 ring-line shadow-[0_12px_30px_rgba(15,46,99,0.06)] transition hover:shadow-[0_18px_40px_rgba(15,46,99,0.12)]",
    item.featured && "md:grid md:grid-cols-2",
  );

  return item.href ? (
    <Link href={item.href} className={className}>
      {body}
    </Link>
  ) : (
    <article className={className}>{body}</article>
  );
}
