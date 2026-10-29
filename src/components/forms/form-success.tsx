"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { ArrowRight, Check, CheckCircle2 } from "lucide-react";
import { GroundWatermark } from "@/components/layout/ground-watermark";
import { registrationSteps } from "@/lib/forms";
import { cn } from "@/lib/utils";

/**
 * Success panel shown in place of a submitted form: a navy banner with an animated tick, the
 * reference, the four-step process with "Submit" marked done, and onward links. On mount it scrolls
 * itself into view and takes focus so the confirmation is seen and announced.
 */
export function FormSuccess({
  title,
  message,
  reference,
  showSteps = false,
  links,
}: {
  title: string;
  message?: string;
  reference?: string;
  showSteps?: boolean;
  links: { label: string; href: string }[];
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollIntoView({ block: "start", behavior: reduce ? "auto" : "smooth" });
    el.focus({ preventScroll: true });
  }, []);

  return (
    <div
      ref={ref}
      role="status"
      tabIndex={-1}
      className="scroll-mt-28 overflow-hidden rounded-3xl bg-white shadow-[0_24px_56px_rgba(15,46,99,0.14)] ring-1 ring-line outline-none motion-safe:animate-in motion-safe:fade-in motion-safe:zoom-in-95 motion-safe:duration-700"
    >
      <div className="relative isolate overflow-hidden bg-stadium px-6 py-8 text-white sm:px-10 sm:py-10">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
          <GroundWatermark className="absolute -right-24 -top-20 w-[520px] text-white/[0.07]" />
          <div className="absolute inset-x-0 bottom-0 h-px bg-[linear-gradient(90deg,transparent,rgba(217,174,86,0.85)_20%,rgba(217,174,86,0.85)_80%,transparent)]" />
        </div>
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
          <span aria-hidden="true" className="relative grid size-16 shrink-0 place-items-center">
            <span className="absolute inset-0 rounded-full bg-status-onboarded/40 motion-safe:animate-ping [animation-duration:2.4s] [animation-iteration-count:3]" />
            <span className="relative grid size-16 place-items-center rounded-full bg-status-onboarded text-navy shadow-[0_0_0_8px_rgba(123,198,126,0.18)]">
              <CheckCircle2 className="size-8" />
            </span>
          </span>
          <div className="min-w-0">
            <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-gold">Submitted</p>
            <h2 className="mt-1 font-heading text-2xl font-bold leading-tight sm:text-3xl">{title}</h2>
          </div>
        </div>
      </div>

      <div className="p-6 sm:p-10">
        {message ? <p className="max-w-2xl text-[17px] leading-relaxed text-slate-600">{message}</p> : null}

        {reference ? (
          <dl className="mt-6 inline-flex flex-wrap items-center gap-x-4 gap-y-1 rounded-2xl bg-surface px-5 py-3.5 ring-1 ring-line">
            <dt className="text-[11px] font-bold uppercase tracking-[0.2em] text-royal">Your reference</dt>
            <dd className="font-mono text-lg font-bold tracking-wider text-navy">{reference.toUpperCase()}</dd>
          </dl>
        ) : null}

        {showSteps ? (
          <ol className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {registrationSteps.map((s, i) => {
              const done = i === 0;
              const next = i === 1;
              return (
                <li
                  key={s.n}
                  className={cn(
                    "relative rounded-2xl p-4 ring-1 motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-2 motion-safe:fill-mode-backwards motion-safe:duration-500",
                    done ? "bg-status-onboarded/15 ring-status-onboarded/60" : next ? "bg-white ring-royal/40" : "bg-surface ring-line",
                  )}
                  style={{ animationDelay: `${300 + i * 110}ms` }}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={cn(
                        "grid size-8 place-items-center rounded-full font-heading text-sm font-bold",
                        done ? "bg-ground text-white" : next ? "bg-royal text-white" : "bg-navy text-white",
                      )}
                    >
                      {done ? <Check className="size-4" aria-hidden="true" /> : s.n}
                    </span>
                    {done || next ? (
                      <span
                        className={cn(
                          "rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.14em]",
                          done ? "bg-ground/10 text-ground-deep" : "bg-royal/10 text-royal",
                        )}
                      >
                        {done ? "Done" : "Next"}
                      </span>
                    ) : null}
                  </div>
                  <p className="mt-3 font-bold text-navy">{s.title}</p>
                  <p className="mt-1 text-sm leading-snug text-slate-500">{s.text}</p>
                </li>
              );
            })}
          </ol>
        ) : null}

        <ul className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          {links.map((l, i) => (
            <li key={l.href}>
              <Link
                href={l.href}
                className={
                  i === 0
                    ? "group inline-flex w-full items-center justify-center gap-2 rounded-full bg-navy px-6 py-3 font-bold text-white transition hover:bg-royal sm:w-auto"
                    : "inline-flex w-full items-center justify-center gap-2 rounded-full px-6 py-3 font-bold text-navy ring-1 ring-line transition hover:bg-surface hover:ring-royal sm:w-auto"
                }
              >
                {l.label}
                {i === 0 ? <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden="true" /> : null}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
