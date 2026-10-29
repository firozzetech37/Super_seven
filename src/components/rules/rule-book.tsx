"use client";

import { useState } from "react";
import { Languages } from "lucide-react";
import { cn } from "@/lib/utils";
import type { RuleSection } from "@/lib/data/rules";

type Lang = "en" | "bn";

/** Numbered rule book with an English/Bengali switch. The Bengali text is pending from SSCFI, so that tab says so. */
export function RuleBook({ sections }: { sections: RuleSection[] }) {
  const [lang, setLang] = useState<Lang>("en");

  return (
    <div>
      <div role="tablist" aria-label="Language" className="inline-flex rounded-full bg-surface p-1 ring-1 ring-line">
        {(
          [
            { id: "en", label: "English" },
            { id: "bn", label: "বাংলা" },
          ] as { id: Lang; label: string }[]
        ).map((t) => (
          <button
            key={t.id}
            role="tab"
            type="button"
            aria-selected={lang === t.id}
            aria-controls={`rules-${t.id}`}
            onClick={() => setLang(t.id)}
            className={cn(
              "rounded-full px-5 py-2 text-sm font-bold transition",
              t.id === "bn" && "font-bengali",
              lang === t.id ? "bg-navy text-white shadow" : "text-navy hover:bg-white",
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      <ol id="rules-en" role="tabpanel" hidden={lang !== "en"} className="mt-8 space-y-4">
        {sections.map((s) => (
          <li key={s.id} id={s.id} className="scroll-mt-28 grid gap-4 rounded-2xl bg-white p-6 ring-1 ring-line sm:grid-cols-[72px_1fr]">
            <span className="grid size-12 place-items-center rounded-2xl bg-navy font-heading text-xl font-bold text-gold">{s.n}</span>
            <div>
              <h3 className="font-heading text-xl font-bold text-navy">{s.title}</h3>
              <ul className="mt-3 space-y-2 text-[16px] leading-relaxed text-slate-600">
                {s.points.map((p) => (
                  <li key={p} className="flex gap-3">
                    <span aria-hidden="true" className="mt-[11px] size-1.5 shrink-0 rounded-full bg-gold" />
                    {p}
                  </li>
                ))}
              </ul>
            </div>
          </li>
        ))}
      </ol>

      <div id="rules-bn" role="tabpanel" hidden={lang !== "bn"} className="mt-8 rounded-2xl bg-white p-8 ring-1 ring-line">
        <div className="flex items-start gap-4">
          <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-royal/10 text-royal">
            <Languages className="size-6" aria-hidden="true" />
          </span>
          <div>
            <p className="font-bengali text-xl font-bold text-navy">বাংলা অনুবাদ শীঘ্রই আসছে</p>
            <p className="mt-2 text-[16px] leading-relaxed text-slate-600">
              The Bengali rule book is pending from SSCFI. It will be published here, section for section, once the
              official translation is approved. Until then the English rule book above is the reference.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
