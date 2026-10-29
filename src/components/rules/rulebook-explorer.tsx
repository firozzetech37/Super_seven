"use client";

import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useEffect, useState, useSyncExternalStore } from "react";
import { Check, ChevronLeft, ChevronRight, Download, ExternalLink, Link2, ListOrdered } from "lucide-react";
import { SectionHeading } from "@/components/layout/section-heading";
import { Reveal } from "@/components/motion/reveal";
import { englishRuleTitle, pdfPageUrl, ruleChapters, rulebookPdf, scriptClass, type RulebookLanguage } from "@/lib/data/rulebook";
import { cn } from "@/lib/utils";

const WIDE = "(min-width: 1024px)";
const subscribeWide = (cb: () => void) => {
  const mq = window.matchMedia(WIDE);
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
};

const scrollToReader = () => document.getElementById("reader")?.scrollIntoView({ behavior: "smooth", block: "start" });

/**
 * Language picker, rule list and PDF reader for the multilingual rulebook.
 * Desktop embeds the PDF at the chosen page; phones get a page preview and open the PDF in their own viewer.
 * The choice is mirrored into ?lang=&rule= so a rule in a language can be linked.
 */
export function RulebookExplorer({ languages }: { languages: RulebookLanguage[] }) {
  const params = useSearchParams();
  const fromUrl = languages.find((l) => l.slug === params.get("lang"));
  const ruleFromUrl = Number(params.get("rule"));

  const [slug, setSlug] = useState((fromUrl ?? languages.find((l) => l.slug === "hindi") ?? languages[0]).slug);
  const [rule, setRule] = useState<number | null>(ruleFromUrl >= 1 && ruleFromUrl <= 40 ? ruleFromUrl : null);
  const [loadedPage, setLoadedPage] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);
  const wide = useSyncExternalStore(subscribeWide, () => window.matchMedia(WIDE).matches, () => false);

  const lang = languages.find((l) => l.slug === slug) ?? languages[0];
  const current = rule ? lang.rules[rule - 1] : null;
  const page = current ? current.page : lang.page;
  const script = scriptClass[lang.script];

  useEffect(() => {
    const url = new URL(window.location.href);
    url.searchParams.set("lang", lang.slug);
    if (rule) url.searchParams.set("rule", String(rule));
    else url.searchParams.delete("rule");
    window.history.replaceState(window.history.state, "", url);
  }, [lang.slug, rule]);

  const pickLanguage = (next: string, scroll = true) => {
    setSlug(next);
    if (scroll) scrollToReader();
  };
  const pickRule = (n: number | null, scroll = true) => {
    setRule(n);
    if (scroll) scrollToReader();
  };
  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard blocked: the address bar still has the link */
    }
  };

  const viewerSrc = `${rulebookPdf}#page=${page}&zoom=page-width&view=FitH&toolbar=0&navpanes=0`;

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6">
      {/* 1 · Languages */}
      <section id="languages" className="scroll-mt-28">
        <SectionHeading
          eyebrow="1 · Choose a language"
          title="Sixteen languages, one rulebook"
          description="Every language carries the same forty rules and glossary. Tap one to read it below."
        />
        <ul className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {languages.map((l, i) => {
            const selected = l.slug === lang.slug;
            return (
              <Reveal as="li" key={l.slug} delay={Math.min(i, 11) * 35}>
                <button
                  type="button"
                  aria-pressed={selected}
                  onClick={() => pickLanguage(l.slug)}
                  className={cn(
                    "group card-premium relative flex min-h-36 w-full flex-col items-start rounded-2xl p-5 text-left transition duration-200",
                    selected
                      ? "bg-navy text-white shadow-[0_18px_40px_rgba(15,46,99,0.28)] ring-2 ring-gold"
                      : "bg-white text-navy ring-1 ring-line hover:-translate-y-0.5 hover:shadow-[0_18px_40px_rgba(15,46,99,0.12)]",
                  )}
                >
                  <span className={cn("text-[11px] font-bold uppercase tracking-[0.2em]", selected ? "text-gold" : "text-slate-400")}>
                    {String(l.n).padStart(2, "0")}
                  </span>
                  <span
                    lang={l.code}
                    dir={l.dir}
                    className={cn("mt-2 block w-full font-bold leading-tight", scriptClass[l.script], l.script === "arabic" ? "text-[26px] leading-[1.6]" : "text-2xl")}
                  >
                    {l.native}
                  </span>
                  <span className={cn("mt-1 text-sm", selected ? "text-white/75" : "text-slate-500")}>{l.name}</span>
                  <span className={cn("mt-auto pt-4 text-[11px] font-bold uppercase tracking-[0.14em]", selected ? "text-white/60" : "text-slate-400")}>
                    Pages {l.page}–{l.endPage}
                  </span>
                  {selected ? (
                    <span className="absolute right-4 top-4 grid size-7 place-items-center rounded-full bg-gold text-navy">
                      <Check className="size-4" aria-hidden="true" />
                    </span>
                  ) : null}
                </button>
              </Reveal>
            );
          })}
        </ul>
      </section>

      {/* 2 · Reader */}
      <section id="reader" className="mt-16 scroll-mt-24">
        <SectionHeading
          eyebrow="2 · Read"
          title={
            <>
              <span lang={lang.code} dir={lang.dir} className={script}>
                {lang.native}
              </span>
              {lang.native !== lang.name ? <span className="text-slate-400"> · {lang.name}</span> : null}
            </>
          }
          description={current ? `Rule ${current.n}, ${englishRuleTitle.get(current.n)}. Page ${page} of the PDF.` : `The ${lang.name} section runs from page ${lang.page} to ${lang.endPage}. Pick a rule from the list to jump straight to it.`}
        />

        <div className="mt-8 grid gap-6 lg:grid-cols-[320px_minmax(0,1fr)] lg:items-start">
          {/* Sidebar */}
          <aside className="rounded-3xl bg-white p-4 ring-1 ring-line lg:sticky lg:top-28">
            <label className="block text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500" htmlFor="rulebook-language">
              Language
            </label>
            <select
              id="rulebook-language"
              value={lang.slug}
              onChange={(e) => pickLanguage(e.target.value, false)}
              className="mt-2 w-full rounded-xl border border-line bg-surface px-3 py-2.5 text-sm font-bold text-navy outline-none ring-royal/40 focus:ring-2"
            >
              {languages.map((l) => (
                <option key={l.slug} value={l.slug}>
                  {l.native}
                  {l.native !== l.name ? ` · ${l.name}` : ""}
                </option>
              ))}
            </select>

            <div className="mt-5 flex items-center justify-between">
              <p className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500">
                <ListOrdered className="size-4 text-gold-deep" aria-hidden="true" />
                Rules 1–40
              </p>
              {rule ? (
                <button type="button" onClick={() => pickRule(null, false)} className="text-xs font-bold text-royal hover:underline">
                  Section start
                </button>
              ) : null}
            </div>
            <ol className="mt-2 max-h-[52vh] space-y-0.5 overflow-y-auto pr-1 [scrollbar-width:thin]">
              {lang.rules.map((r) => {
                const on = rule === r.n;
                return (
                  <li key={r.n}>
                    <button
                      type="button"
                      aria-pressed={on}
                      onClick={() => pickRule(r.n, false)}
                      className={cn("flex w-full items-start gap-3 rounded-xl px-2.5 py-2 text-left transition", on ? "bg-navy text-white" : "hover:bg-surface")}
                    >
                      <span className={cn("mt-0.5 grid size-7 shrink-0 place-items-center rounded-lg text-[11px] font-bold", on ? "bg-gold text-navy" : "bg-royal/10 text-royal")}>
                        {r.n}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span lang={lang.code} dir={lang.dir} className={cn("block truncate text-sm font-bold", script)}>
                          {r.title}
                        </span>
                        <span className={cn("block text-[11px]", on ? "text-white/70" : "text-slate-500")}>
                          {r.inferred ? "Heading missing in the PDF · " : ""}
                          {englishRuleTitle.get(r.n)} · p.{r.page}
                        </span>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ol>
          </aside>

          {/* Viewer */}
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2 rounded-t-3xl bg-navy px-4 py-3 text-white ring-1 ring-navy">
              <span className="rounded-full bg-gold px-3 py-1 text-[11px] font-bold uppercase tracking-[0.14em] text-navy">
                {current ? `Rule ${current.n}` : "Section"}
              </span>
              <span className="text-sm font-bold">Page {page}</span>
              <span className="hidden text-sm text-white/60 sm:inline">of {lang.endPage}</span>
              <span className="ml-auto flex items-center gap-1.5">
                <button
                  type="button"
                  aria-label="Previous rule"
                  disabled={!rule || rule <= 1}
                  onClick={() => pickRule(rule ? rule - 1 : 1, false)}
                  className="grid size-9 place-items-center rounded-full bg-white/10 transition hover:bg-white/20 disabled:opacity-30"
                >
                  <ChevronLeft className="size-4" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  aria-label="Next rule"
                  disabled={rule === 40}
                  onClick={() => pickRule(rule ? rule + 1 : 1, false)}
                  className="grid size-9 place-items-center rounded-full bg-white/10 transition hover:bg-white/20 disabled:opacity-30"
                >
                  <ChevronRight className="size-4" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={copyLink}
                  className="ml-1 hidden items-center gap-1.5 rounded-full bg-white/10 px-3 py-2 text-xs font-bold transition hover:bg-white/20 sm:inline-flex"
                >
                  <Link2 className="size-3.5" aria-hidden="true" />
                  {copied ? "Copied" : "Copy link"}
                </button>
                <a
                  href={pdfPageUrl(page)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-2 text-xs font-bold transition hover:bg-white/20"
                >
                  <ExternalLink className="size-3.5" aria-hidden="true" />
                  <span className="hidden sm:inline">Open in new tab</span>
                  <span className="sm:hidden">Open</span>
                </a>
                <a
                  href={rulebookPdf}
                  download
                  className="inline-flex items-center gap-1.5 rounded-full bg-gold px-3 py-2 text-xs font-bold text-navy transition hover:bg-gold-deep"
                >
                  <Download className="size-3.5" aria-hidden="true" />
                  PDF
                </a>
              </span>
            </div>

            {/* Desktop: embedded PDF */}
            <div className="relative hidden overflow-hidden rounded-b-3xl bg-slate-200 ring-1 ring-line lg:block">
              {loadedPage !== page ? (
                <div aria-hidden="true" className="absolute inset-0 grid place-items-center">
                  <div className="shimmer-light h-[90%] w-[70%] rounded-xl bg-white" />
                </div>
              ) : null}
              {wide ? (
                <iframe
                  key={page}
                  title={`${lang.name} rulebook, page ${page}`}
                  src={viewerSrc}
                  onLoad={() => setLoadedPage(page)}
                  className="relative block h-[clamp(560px,78vh,960px)] w-full"
                />
              ) : (
                <div className="h-[clamp(560px,78vh,960px)]" />
              )}
            </div>

            {/* Phones and tablets: page preview + open in the device viewer */}
            <div className="overflow-hidden rounded-b-3xl bg-white ring-1 ring-line lg:hidden">
              <div className="relative">
                <Image
                  src={lang.thumb}
                  alt={`First page of the ${lang.name} section`}
                  width={720}
                  height={932}
                  sizes="(max-width: 1024px) 100vw, 0px"
                  className="w-full"
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-navy via-navy/85 to-transparent px-5 pb-5 pt-20 text-white">
                  <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-gold">
                    {current ? `Rule ${current.n} · ${englishRuleTitle.get(current.n)}` : `${lang.name} section`}
                  </p>
                  <a
                    href={pdfPageUrl(page)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-full bg-gold px-5 py-3 font-bold text-navy transition hover:bg-gold-deep"
                  >
                    Open page {page} in your PDF viewer
                    <ExternalLink className="size-4" aria-hidden="true" />
                  </a>
                </div>
              </div>
              <p className="px-5 py-3 text-xs text-slate-500">
                Phones open the PDF in their own viewer; most desktop browsers jump straight to the page. The full in-page reader appears on screens wider than a tablet.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3 · Index */}
      <section id="index" className="mt-16 scroll-mt-28">
        <SectionHeading
          eyebrow="3 · Rule index"
          title="Forty rules in five chapters"
          description={`Pick a rule to open it in ${lang.name}. Titles are the English ones from the Pocket Rulebook the translations were made from.`}
        />
        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {ruleChapters.map((c, i) => (
            <Reveal key={c.title} delay={i * 70} className="rounded-2xl bg-white p-6 ring-1 ring-line">
              <h3 className="font-heading text-xl font-bold text-navy">{c.title}</h3>
              <p className="mt-1 text-sm text-slate-500">{c.blurb}</p>
              <ul className="mt-4 flex flex-wrap gap-2">
                {c.rules.map((r) => {
                  const on = rule === r.n;
                  return (
                    <li key={r.n}>
                      <button
                        type="button"
                        aria-pressed={on}
                        onClick={() => pickRule(r.n)}
                        className={cn(
                          "inline-flex items-center gap-2 rounded-full py-1.5 pl-1.5 pr-3 text-sm font-bold ring-1 transition",
                          on ? "bg-navy text-white ring-navy" : "bg-surface text-navy ring-line hover:bg-white hover:ring-royal",
                        )}
                      >
                        <span className={cn("grid size-6 place-items-center rounded-full text-[11px]", on ? "bg-gold text-navy" : "bg-navy text-gold")}>{r.n}</span>
                        {r.title}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </Reveal>
          ))}
        </div>
      </section>
    </div>
  );
}
