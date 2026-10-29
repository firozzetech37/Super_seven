"use client";

import { useEffect, useState } from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

type Section = { id: string; title: string };
type Count = { done: number; total: number };

/** Required controls in a section that hold a value the browser accepts. */
function countSection(fs: HTMLElement): Count {
  const fields = [...fs.querySelectorAll<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>(
    "input[required], select[required], textarea[required]",
  )];
  const done = fields.filter((el) =>
    el instanceof HTMLInputElement && el.type === "checkbox" ? el.checked : el.value.trim() !== "" && el.validity.valid,
  ).length;
  return { done, total: fields.length };
}

/**
 * Read-only progress tracker for a long form: watches the form's sections (fieldsets with matching
 * ids) and shows how many required fields are complete, which section is in use, and links to
 * each one. It never touches the form's values. Hides itself once the form is gone (submitted).
 */
export function FormProgress({
  formId,
  sections,
  variant = "card",
}: {
  formId: string;
  sections: Section[];
  variant?: "card" | "bar";
}) {
  const [counts, setCounts] = useState<Record<string, Count>>({});
  const [active, setActive] = useState(sections[0]?.id);
  const [present, setPresent] = useState(true);

  useEffect(() => {
    const form = document.getElementById(formId);
    if (!form) return;
    const container = form.parentElement;

    const measure = () => {
      const live = document.getElementById(formId);
      setPresent(Boolean(live));
      if (!live) return;
      const next: Record<string, Count> = {};
      for (const s of sections) {
        const fs = document.getElementById(s.id);
        if (fs) next[s.id] = countSection(fs);
      }
      setCounts(next);
    };
    const onReset = () => window.setTimeout(measure, 0);
    const onFocus = (e: FocusEvent) => {
      const fs = (e.target as HTMLElement | null)?.closest?.("fieldset[id]");
      if (fs && sections.some((s) => s.id === fs.id)) setActive(fs.id);
    };

    measure();
    document.addEventListener("input", measure);
    document.addEventListener("change", measure);
    document.addEventListener("reset", onReset, true);
    document.addEventListener("focusin", onFocus);

    // The form swaps for a success panel, and conditional fields (guardian consent) come and go.
    const mo = container ? new MutationObserver(measure) : null;
    if (container) mo?.observe(container, { childList: true, subtree: true });

    // Highlight whichever section crosses the upper-middle of the viewport.
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) if (entry.isIntersecting) setActive(entry.target.id);
      },
      { rootMargin: "-30% 0px -60% 0px" },
    );
    for (const s of sections) {
      const fs = document.getElementById(s.id);
      if (fs) io.observe(fs);
    }

    return () => {
      document.removeEventListener("input", measure);
      document.removeEventListener("change", measure);
      document.removeEventListener("reset", onReset, true);
      document.removeEventListener("focusin", onFocus);
      mo?.disconnect();
      io.disconnect();
    };
  }, [formId, sections]);

  if (!present) return null;

  const done = sections.reduce((n, s) => n + (counts[s.id]?.done ?? 0), 0);
  const total = sections.reduce((n, s) => n + (counts[s.id]?.total ?? 0), 0);
  const pct = total ? Math.round((done / total) * 100) : 0;
  const activeIndex = Math.max(0, sections.findIndex((s) => s.id === active));
  const complete = (id: string) => {
    const c = counts[id];
    return Boolean(c && c.total > 0 && c.done === c.total);
  };

  const bar = (
    <div
      role="progressbar"
      aria-label="Required fields completed"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={pct}
      className="h-2 overflow-hidden rounded-full bg-surface ring-1 ring-line"
    >
      <div
        className="h-full rounded-full bg-[linear-gradient(90deg,#d9ae56,#c99b43)] shadow-[0_0_12px_rgba(217,174,86,0.6)] transition-[width] duration-700 ease-out motion-reduce:transition-none"
        style={{ width: `${pct}%` }}
      />
    </div>
  );

  if (variant === "bar") {
    return (
      <div className="rounded-2xl bg-white/95 px-4 py-3 shadow-[0_14px_30px_rgba(15,46,99,0.14)] ring-1 ring-line backdrop-blur">
        <div className="mb-2 flex items-center justify-between gap-3 text-sm">
          <p className="min-w-0 truncate">
            <span className="font-bold text-royal">
              {activeIndex + 1}/{sections.length}
            </span>
            <span className="mx-2 text-slate-300" aria-hidden="true">
              |
            </span>
            <span className="font-bold text-navy">{sections[activeIndex]?.title}</span>
          </p>
          <p className="shrink-0 font-heading text-base font-bold text-navy">{pct}%</p>
        </div>
        {bar}
      </div>
    );
  }

  return (
    <nav aria-label="Form sections" className="overflow-hidden rounded-3xl bg-white p-6 shadow-[0_12px_30px_rgba(15,46,99,0.07)] ring-1 ring-line">
      <div className="flex items-end justify-between gap-3">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-royal">Your progress</p>
          <p className="mt-1 text-sm text-slate-500">
            {total ? `${done} of ${total} required fields` : "Required fields"}
          </p>
        </div>
        <p className="font-heading text-3xl font-bold leading-none text-navy">
          {pct}
          <span className="text-lg text-gold-deep">%</span>
        </p>
      </div>
      <div className="mt-4">{bar}</div>
      <ol className="relative mt-5 space-y-1">
        {sections.map((s, i) => {
          const isActive = s.id === active;
          const isDone = complete(s.id);
          const c = counts[s.id];
          return (
            <li key={s.id} className="relative">
              {i < sections.length - 1 ? (
                <span aria-hidden="true" className="absolute left-[1.6rem] top-10 h-[calc(100%-1.75rem)] w-px bg-line" />
              ) : null}
              <a
                href={`#${s.id}`}
                aria-current={isActive ? "step" : undefined}
                className={cn(
                  "group relative flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm transition duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-royal",
                  isActive ? "bg-surface ring-1 ring-line" : "hover:bg-surface/70",
                )}
              >
                <span
                  className={cn(
                    "relative grid size-7 shrink-0 place-items-center rounded-full text-xs font-bold transition duration-300",
                    isDone
                      ? "bg-ground text-white"
                      : isActive
                        ? "bg-royal text-white shadow-[0_0_0_4px_rgba(28,79,160,0.15)]"
                        : "bg-white text-slate-500 ring-1 ring-line group-hover:ring-royal/40",
                  )}
                >
                  {isDone ? <Check className="size-3.5" aria-hidden="true" /> : i + 1}
                </span>
                <span className={cn("min-w-0 flex-1 font-bold", isActive || isDone ? "text-navy" : "text-slate-600")}>{s.title}</span>
                <span className="shrink-0 text-xs tabular-nums text-slate-400">
                  {c ? (c.total ? `${c.done}/${c.total}` : "Optional") : ""}
                </span>
                {isDone ? <span className="sr-only">(complete)</span> : null}
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
