import Link from "next/link";
import { ArrowRight, BookOpen, Download, ExternalLink } from "lucide-react";
import { GroundWatermark } from "@/components/layout/ground-watermark";
import { documentCategories, legacyDocumentBase, type LegacyDocument } from "@/lib/data/documents";

/** A small PDF page with a folded corner; it tilts when its card is hovered. */
function PdfGlyph() {
  return (
    <span
      aria-hidden="true"
      className="relative block h-14 w-11 shrink-0 drop-shadow-[0_6px_10px_rgba(15,46,99,0.2)] transition duration-300 group-hover:-translate-y-0.5 group-hover:-rotate-6"
    >
      <span className="absolute inset-0 rounded-md bg-white [clip-path:polygon(0_0,calc(100%-12px)_0,100%_12px,100%_100%,0_100%)]" />
      <span className="absolute right-0 top-0 size-3 rounded-bl-[3px] bg-[linear-gradient(to_bottom_left,transparent_50%,#c9d3ea_50%)]" />
      <span className="absolute inset-x-2 top-3.5 space-y-1">
        <span className="block h-0.5 w-5 rounded bg-slate-200" />
        <span className="block h-0.5 w-6 rounded bg-slate-200" />
        <span className="block h-0.5 w-4 rounded bg-slate-200" />
      </span>
      <span className="absolute inset-x-1.5 bottom-1.5 rounded-sm bg-ball text-center text-[9px] font-black leading-[14px] tracking-wider text-white">PDF</span>
    </span>
  );
}

export function documentHref(d: LegacyDocument) {
  return d.href ?? `${legacyDocumentBase}${d.file}`;
}

/** Library card for one PDF; legacy files open the 2014 site in a new tab. */
export function DocumentCard({ doc }: { doc: LegacyDocument }) {
  const hosted = Boolean(doc.href);
  return (
    <a
      href={documentHref(doc)}
      target="_blank"
      rel="noopener noreferrer"
      className="group card-premium relative flex h-full flex-col overflow-hidden rounded-3xl bg-white p-6 shadow-[0_12px_30px_rgba(15,46,99,0.07)] ring-1 ring-line transition duration-300 hover:-translate-y-1.5 hover:shadow-[0_28px_60px_rgba(15,46,99,0.14)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-gold"
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-5 -right-1 font-heading text-[5.5rem] font-bold leading-none text-navy/[0.045] transition duration-500 group-hover:-translate-y-1 group-hover:text-gold/20"
      >
        {doc.year}
      </span>
      <span aria-hidden="true" className="absolute inset-x-6 top-0 h-[3px] origin-left scale-x-0 rounded-b-full bg-gradient-to-r from-gold to-gold-deep transition-transform duration-500 group-hover:scale-x-100" />
      <div className="relative flex items-start justify-between gap-3">
        <PdfGlyph />
        <span className="rounded-full bg-royal/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-royal">{documentCategories[doc.category]}</span>
      </div>
      <h4 className="relative mt-5 font-heading text-lg font-bold leading-snug text-navy transition-colors group-hover:text-royal">{doc.title}</h4>
      <p className="relative mt-2 text-[15px] leading-relaxed text-slate-500">{doc.description}</p>
      <p className="relative mt-auto flex flex-wrap items-center gap-2 pt-5 text-[11px] font-bold uppercase tracking-[0.14em] text-slate-500">
        <span className="rounded-full bg-surface px-2.5 py-1 ring-1 ring-line">{doc.year}</span>
        <span className="rounded-full bg-surface px-2.5 py-1 ring-1 ring-line">
          {doc.pages} {doc.pages === 1 ? "page" : "pages"}
        </span>
      </p>
      <span className="relative mt-4 flex items-center justify-between border-t border-line pt-4 text-sm font-bold text-royal">
        <span>{hosted ? "Open PDF" : "Open from sscfi.org (2014)"}</span>
        <span className="grid size-9 place-items-center rounded-full bg-surface text-royal ring-1 ring-line transition duration-300 group-hover:bg-royal group-hover:text-white group-hover:ring-royal">
          <ExternalLink className="size-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
        </span>
      </span>
      <span className="sr-only">(opens in a new tab)</span>
    </a>
  );
}

/** Wide navy card for a document hosted on this site, with download and read-online actions. */
export function FeaturedDocument({ doc, readHref }: { doc: LegacyDocument; readHref?: string }) {
  return (
    <article className="group relative isolate flex h-full flex-col overflow-hidden rounded-3xl bg-stadium p-6 text-white shadow-[0_24px_54px_rgba(15,46,99,0.3)] sm:p-8">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <GroundWatermark className="absolute -bottom-24 -right-28 w-[520px] text-white/[0.07] transition-transform duration-700 group-hover:-rotate-3 group-hover:scale-105" />
        <div className="absolute -left-16 -top-16 size-56 rounded-full bg-gold/15 blur-3xl" />
        <div className="absolute inset-y-0 left-0 w-1/3 skew-x-[-20deg] bg-gradient-to-r from-transparent via-white/[0.07] to-transparent motion-safe:animate-sweep" />
      </div>
      <div className="flex items-start justify-between gap-4">
        <PdfGlyph />
        <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-gold ring-1 ring-white/15">
          <span aria-hidden="true" className="size-1.5 rounded-full bg-status-onboarded" />
          Hosted on this site
        </span>
      </div>
      <p className="mt-6 text-[11px] font-bold uppercase tracking-[0.24em] text-gold">Featured · {documentCategories[doc.category]}</p>
      <h4 className="mt-2 max-w-xl font-heading text-2xl font-bold leading-tight sm:text-[1.75rem]">{doc.title}</h4>
      <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-white/75">{doc.description}</p>
      <p className="mt-5 flex flex-wrap gap-2 text-[11px] font-bold uppercase tracking-[0.14em] text-white/80">
        <span className="rounded-full bg-white/10 px-2.5 py-1 ring-1 ring-white/15">{doc.year}</span>
        <span className="rounded-full bg-white/10 px-2.5 py-1 ring-1 ring-white/15">{doc.pages} pages</span>
      </p>
      <div className="mt-auto flex flex-col gap-3 pt-7 sm:flex-row sm:flex-wrap">
        <a
          href={documentHref(doc)}
          download
          className="group/btn inline-flex items-center justify-center gap-2 rounded-full bg-gold px-6 py-3 font-bold text-navy shadow-[0_12px_28px_rgba(4,15,42,0.45)] transition hover:bg-gold-deep focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-gold/50"
        >
          <Download className="size-4 transition-transform group-hover/btn:translate-y-0.5" aria-hidden="true" />
          Download PDF
        </a>
        {readHref ? (
          <Link
            href={readHref}
            className="group/btn inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 font-bold text-white ring-1 ring-white/35 transition hover:bg-white/10 hover:ring-white/60 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-gold/50"
          >
            <BookOpen className="size-4" aria-hidden="true" />
            Read online
            <ArrowRight className="size-4 transition-transform group-hover/btn:translate-x-1" aria-hidden="true" />
          </Link>
        ) : null}
      </div>
    </article>
  );
}
