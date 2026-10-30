"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowRight, ChevronDown, Clock3, FileSignature, ListOrdered, Mail } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Reveal } from "@/components/motion/reveal";
import { site } from "@/lib/site";
import { cn } from "@/lib/utils";

export type LegalSection = { id: string; heading: string; paragraphs?: string[]; bullets?: string[] };

const legalPages = [
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms", href: "/terms" },
  { label: "Disclaimer", href: "/disclaimer" },
];

const pad = (n: number) => String(n).padStart(2, "0");

/** Roughly 220 words a minute, rounded up, never below one. */
function readingMinutes(sections: LegalSection[]) {
  const text = sections.flatMap((s) => [s.heading, ...(s.paragraphs ?? []), ...(s.bullets ?? [])]).join(" ");
  return Math.max(1, Math.ceil(text.split(/\s+/).filter(Boolean).length / 220));
}

/**
 * Reading layout for Privacy, Terms and Disclaimer: numbered sections at a comfortable measure, a
 * sticky contents list on desktop that highlights the section being read and shows reading
 * progress, a collapsible contents list on phones, and a closing card with the other legal pages.
 */
export function LegalArticle({
  title,
  description,
  updated,
  sections,
}: {
  title: string;
  description: string;
  updated: string;
  sections: LegalSection[];
}) {
  const articleRef = useRef<HTMLElement>(null);
  const [active, setActive] = useState(sections[0]?.id);
  const [progress, setProgress] = useState(0);
  const minutes = readingMinutes(sections);

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) if (entry.isIntersecting) setActive(entry.target.id);
      },
      { rootMargin: "-20% 0px -70% 0px" },
    );
    for (const s of sections) {
      const el = document.getElementById(s.id);
      if (el) io.observe(el);
    }

    let frame = 0;
    const measure = () => {
      frame = 0;
      const el = articleRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const span = r.height - window.innerHeight * 0.6;
      const done = span > 0 ? (window.innerHeight * 0.4 - r.top) / span : 1;
      setProgress(Math.min(1, Math.max(0, done)));
    };
    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(measure);
    };
    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [sections]);

  const activeIndex = Math.max(0, sections.findIndex((s) => s.id === active));

  const contents = (variant: "desktop" | "mobile") => (
    <ol className="space-y-0.5 text-[15px]">
      {sections.map((s, i) => {
        const isActive = variant === "desktop" && s.id === active;
        return (
          <li key={s.id}>
            <a
              href={`#${s.id}`}
              aria-current={isActive ? "location" : undefined}
              className={cn(
                "group relative flex gap-3 rounded-xl px-3 py-2 leading-snug transition duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-royal",
                isActive ? "bg-white font-bold text-navy shadow-[0_8px_20px_rgba(15,46,99,0.08)] ring-1 ring-line" : "text-slate-600 hover:bg-white/70 hover:text-navy",
              )}
            >
              <span
                aria-hidden="true"
                className={cn(
                  "absolute inset-y-2 left-0 w-[3px] rounded-full bg-gold transition-opacity duration-300",
                  isActive ? "opacity-100" : "opacity-0",
                )}
              />
              <span className={cn("w-6 shrink-0 text-xs font-bold tabular-nums leading-[1.4rem]", isActive ? "text-gold-deep" : "text-slate-400")}>
                {pad(i + 1)}
              </span>
              {s.heading}
            </a>
          </li>
        );
      })}
    </ol>
  );

  return (
    <>
      <PageHeader
        eyebrow="Legal"
        title={title}
        description={description}
        crumbs={[{ label: title }]}
        aside={
          <div className="w-full rounded-2xl bg-white/10 p-5 ring-1 ring-white/15 backdrop-blur sm:min-w-72">
            <p className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-gold">
              <FileSignature className="size-4" aria-hidden="true" />
              Draft for SSCFI review
            </p>
            <p className="mt-3 text-sm text-white/80">Last updated {updated}</p>
            <p className="mt-1 flex items-center gap-4 text-sm text-white/60">
              <span className="inline-flex items-center gap-1.5">
                <ListOrdered className="size-3.5 text-gold/80" aria-hidden="true" />
                {sections.length} sections
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Clock3 className="size-3.5 text-gold/80" aria-hidden="true" />
                {minutes} min read
              </span>
            </p>
            <a href={`mailto:${site.email}`} className="mt-3 inline-block text-sm font-bold text-white underline decoration-gold/60 underline-offset-4 hover:decoration-gold">
              Questions: {site.email}
            </a>
          </div>
        }
      />

      <div className="relative isolate bg-surface">
        <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-96 bg-[linear-gradient(to_bottom,rgba(28,79,160,0.05),transparent)]" />
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[270px_minmax(0,1fr)] lg:gap-14 lg:py-16">
          {/* Desktop: sticky contents with active section and reading progress */}
          <nav aria-label="Contents" className="hidden lg:sticky lg:top-20 lg:block lg:self-start">
            <div className="rounded-3xl bg-surface/80 p-4 ring-1 ring-line backdrop-blur">
              <div className="flex items-center justify-between px-3 pt-1">
                <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-royal">On this page</p>
                <p className="text-xs font-bold tabular-nums text-slate-400">
                  {pad(activeIndex + 1)} / {pad(sections.length)}
                </p>
              </div>
              <div aria-hidden="true" className="mx-3 mb-3 mt-3 h-1 overflow-hidden rounded-full bg-line">
                <div
                  className="h-full origin-left rounded-full bg-[linear-gradient(90deg,#d9ae56,#c99b43)] transition-transform duration-150 ease-out motion-reduce:transition-none"
                  style={{ transform: `scaleX(${progress})` }}
                />
              </div>
              {contents("desktop")}
            </div>
            <a
              href={`mailto:${site.email}`}
              className="group mt-4 flex items-center gap-3 rounded-2xl bg-white p-4 text-sm ring-1 ring-line transition hover:ring-royal/40"
            >
              <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-royal/10 text-royal transition duration-300 group-hover:-rotate-6 group-hover:bg-royal group-hover:text-white">
                <Mail className="size-4" aria-hidden="true" />
              </span>
              <span>
                <span className="block font-bold text-navy">Questions?</span>
                <span className="block text-slate-500">{site.email}</span>
              </span>
            </a>
          </nav>

          {/* Phones and tablets: collapsible contents */}
          <details className="group/toc rounded-3xl bg-white ring-1 ring-line lg:hidden">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-3 rounded-3xl px-5 py-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-royal [&::-webkit-details-marker]:hidden">
              <span className="flex items-center gap-3">
                <span className="grid size-9 place-items-center rounded-xl bg-royal/10 text-royal">
                  <ListOrdered className="size-4" aria-hidden="true" />
                </span>
                <span>
                  <span className="block font-bold text-navy">Contents</span>
                  <span className="block text-xs text-slate-500">
                    {sections.length} sections · {minutes} min read
                  </span>
                </span>
              </span>
              <ChevronDown className="size-5 text-royal transition-transform duration-300 group-open/toc:rotate-180" aria-hidden="true" />
            </summary>
            <div className="border-t border-line px-2 pb-3 pt-2">{contents("mobile")}</div>
          </details>

          <article ref={articleRef} className="min-w-0 rounded-[2rem] bg-white px-5 py-4 shadow-[0_18px_44px_rgba(15,46,99,0.07)] ring-1 ring-line sm:px-10 sm:py-6 lg:px-14">
            {sections.map((s, i) => (
              <Reveal
                as="section"
                key={s.id}
                id={s.id}
                className="group/sec scroll-mt-28 border-b border-line py-8 last:border-b-0 sm:py-10"
              >
                <div className="flex items-start gap-4 sm:gap-5">
                  <span
                    aria-hidden="true"
                    className={cn(
                      "mt-0.5 grid size-10 shrink-0 place-items-center rounded-2xl font-heading text-sm font-bold transition duration-300 sm:size-11",
                      s.id === active ? "bg-navy text-gold shadow-[0_0_0_5px_rgba(217,174,86,0.18)]" : "bg-surface text-gold-deep ring-1 ring-line",
                    )}
                  >
                    {pad(i + 1)}
                  </span>
                  <div className="min-w-0 max-w-[68ch] flex-1">
                    <h2 className="font-heading text-2xl font-bold leading-tight text-navy sm:text-[1.7rem]">
                      <span className="sr-only">{i + 1}. </span>
                      {s.heading}
                    </h2>
                    {s.paragraphs?.map((p) => (
                      <p key={p} className="mt-4 text-[17px] leading-[1.75] text-slate-600">
                        {p}
                      </p>
                    ))}
                    {s.bullets?.length ? (
                      <ul className="mt-5 space-y-3 text-[17px] leading-[1.7] text-slate-600">
                        {s.bullets.map((b) => (
                          <li key={b} className="flex gap-3.5">
                            <span aria-hidden="true" className="mt-[0.7rem] size-2 shrink-0 rotate-45 rounded-[2px] bg-gold" />
                            <span>{b}</span>
                          </li>
                        ))}
                      </ul>
                    ) : null}
                  </div>
                </div>
              </Reveal>
            ))}
          </article>
        </div>

        <div className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:pb-20">
          <Reveal className="relative isolate overflow-hidden rounded-3xl bg-stadium p-6 text-white ring-1 ring-white/10 sm:p-10 lg:ml-[calc(270px+3.5rem)]">
            <span aria-hidden="true" className="pointer-events-none absolute -right-16 -top-16 -z-10 size-64 rounded-full bg-gold/20 blur-3xl" />
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-gold">Questions about this page?</p>
                <p className="mt-2 font-heading text-2xl font-bold">Write to the federation</p>
                <a href={`mailto:${site.email}`} className="mt-2 inline-flex items-center gap-2 font-bold text-white/85 underline decoration-gold/60 underline-offset-4 hover:text-white hover:decoration-gold">
                  <Mail className="size-4 text-gold" aria-hidden="true" />
                  {site.email}
                </a>
              </div>
              <ul className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
                {legalPages
                  .filter((l) => l.label !== title)
                  .map((l) => (
                    <li key={l.href}>
                      <Link
                        href={l.href}
                        className="group inline-flex w-full items-center justify-center gap-2 rounded-full px-5 py-3 font-bold text-white ring-1 ring-white/35 transition hover:bg-white/10 hover:ring-white/60 sm:w-auto"
                      >
                        {l.label}
                        <ArrowRight className="size-4 text-gold transition-transform group-hover:translate-x-1" aria-hidden="true" />
                      </Link>
                    </li>
                  ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </div>
    </>
  );
}
