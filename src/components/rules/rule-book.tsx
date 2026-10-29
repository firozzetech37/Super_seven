"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Languages } from "lucide-react";
import { cn } from "@/lib/utils";
import type { RuleSection } from "@/lib/data/rules";

type Lang = "en" | "bn";

/** Numbered rule book with an English/Bengali switch. The Bengali tab points to the full translation in the multilingual rulebook. */
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
            <p className="font-bengali text-xl font-bold text-navy">বাংলায় সম্পূর্ণ নিয়মাবলী</p>
            <p className="mt-2 text-[16px] leading-relaxed text-slate-600">
              The complete forty-rule book in Bengali is published in the multilingual rulebook, pages 30 to 44, alongside fifteen other
              languages. The translation is under Technical Committee review; the English text is the reference until it is approved.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link
                href="/rules/rulebook?lang=bengali#reader"
                className="group inline-flex items-center gap-2 rounded-full bg-navy px-5 py-2.5 font-bold text-white transition hover:bg-royal"
              >
                <span className="font-bengali">বাংলা</span> rulebook
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
              </Link>
              <Link href="/rules/rulebook" className="inline-flex items-center gap-2 rounded-full bg-surface px-5 py-2.5 font-bold text-navy ring-1 ring-line transition hover:ring-royal">
                All 16 languages
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
