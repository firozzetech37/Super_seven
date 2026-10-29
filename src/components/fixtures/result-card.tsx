import Image from "next/image";
import { Trophy } from "lucide-react";
import { cn } from "@/lib/utils";
import type { MatchResult } from "@/lib/data/fixtures";

function TeamRow({ name, score, won, featured }: { name: string; score?: string; won: boolean; featured: boolean }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className={cn("flex items-center gap-2 text-lg", won ? "font-bold" : featured ? "text-white/70" : "text-slate-500")}>
        {won ? <Trophy className={cn("size-4 shrink-0", featured ? "text-gold" : "text-gold-deep")} aria-hidden="true" /> : <span className="size-4 shrink-0" />}
        {name}
      </span>
      <span className={cn("font-heading text-2xl font-bold tabular-nums", won ? (featured ? "text-gold" : "text-navy") : featured ? "text-white/60" : "text-slate-400")}>
        {score ?? "—"}
      </span>
    </div>
  );
}

/** One match result. The featured variant (the final) is a navy card with the winners' photo. */
export function ResultCard({ result, featured = false }: { result: MatchResult; featured?: boolean }) {
  const wonA = result.winner === result.teamA;
  const wonB = result.winner === result.teamB;
  return (
    <article
      className={cn(
        "relative overflow-hidden rounded-2xl p-6 ring-1",
        featured
          ? "bg-[linear-gradient(150deg,#1c4fa0,#0f2e63_60%,#0b2550)] text-white shadow-[0_24px_50px_rgba(15,46,99,0.3)] ring-white/10"
          : "bg-white text-ink ring-line",
      )}
    >
      <div className={cn("grid gap-6", featured && result.image && "md:grid-cols-[1fr_200px] md:items-center")}>
        <div>
          <p className={cn("text-[11px] font-bold uppercase tracking-[0.2em]", featured ? "text-gold" : "text-royal")}>{result.label}</p>
          <div className="mt-4 space-y-2">
            <TeamRow name={result.teamA} score={result.scoreA} won={wonA} featured={featured} />
            <TeamRow name={result.teamB} score={result.scoreB} won={wonB} featured={featured} />
          </div>
          <div className={cn("mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 border-t pt-4 text-sm", featured ? "border-white/15 text-white/80" : "border-line text-slate-600")}>
            {result.winner ? (
              <span>
                <strong className={featured ? "text-white" : "text-navy"}>{result.winner}</strong> won {result.margin}
              </span>
            ) : (
              <span className="font-bold">{result.margin}</span>
            )}
            {result.manOfMatch ? (
              <span className={cn("rounded-full px-2.5 py-0.5 text-xs font-bold", featured ? "bg-gold text-navy" : "bg-gold/15 text-gold-deep")}>
                Man of the Match: {result.manOfMatch}
              </span>
            ) : null}
          </div>
        </div>
        {result.image ? (
          <div className={cn("relative overflow-hidden rounded-xl ring-1", featured ? "aspect-[4/3] ring-white/20" : "hidden")}>
            <Image src={result.image.src} alt={result.image.alt} fill sizes="200px" className="object-cover" />
          </div>
        ) : null}
      </div>
    </article>
  );
}
