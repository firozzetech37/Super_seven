import Image from "next/image";
import { Award, Trophy } from "lucide-react";
import { GroundWatermark } from "@/components/layout/ground-watermark";
import { cn } from "@/lib/utils";
import type { MatchResult } from "@/lib/data/fixtures";

type Variant = "final" | "photo" | "score";

/** One line of the scoreboard: winner marker, team name and runs. */
function TeamRow({ name, score, won, dark, big = false }: { name: string; score?: string; won: boolean; dark: boolean; big?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span
        className={cn(
          "flex min-w-0 items-center gap-2.5",
          big ? "text-xl sm:text-2xl" : "text-lg",
          won ? "font-bold" : dark ? "text-white/60" : "text-slate-500",
          won && (dark ? "text-white" : "text-navy"),
        )}
      >
        {won ? (
          <span className={cn("grid shrink-0 place-items-center rounded-full", big ? "size-8" : "size-6", dark ? "bg-gold text-navy" : "bg-gold/15 text-gold-deep")}>
            <Trophy className={big ? "size-4" : "size-3.5"} aria-hidden="true" />
          </span>
        ) : (
          <span aria-hidden="true" className={cn("shrink-0", big ? "size-8" : "size-6")} />
        )}
        <span className="min-w-0">
          {name}
          {won ? <span className="sr-only"> (winner)</span> : null}
        </span>
      </span>
      <span
        className={cn(
          "shrink-0 font-heading font-bold leading-none tabular-nums",
          big ? "text-5xl sm:text-6xl" : "text-3xl",
          won ? (dark ? "text-gold" : "text-navy") : dark ? "text-white/45" : "text-slate-300",
        )}
      >
        {score ?? "—"}
      </span>
    </div>
  );
}

function Outcome({ result, dark }: { result: MatchResult; dark: boolean }) {
  return (
    <div className={cn("flex flex-wrap items-center gap-x-4 gap-y-2 border-t pt-4 text-sm", dark ? "border-white/15 text-white/80" : "border-line text-slate-600")}>
      {result.winner ? (
        <span>
          <strong className={dark ? "text-white" : "text-navy"}>{result.winner}</strong> won {result.margin}
        </span>
      ) : (
        <span className={cn("rounded-full px-2.5 py-0.5 text-xs font-bold uppercase tracking-[0.12em]", dark ? "bg-white/10 text-white" : "bg-royal/10 text-royal")}>
          {result.margin}
        </span>
      )}
      {result.manOfMatch ? (
        <span className={cn("inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold", dark ? "bg-gold text-navy" : "bg-gold/15 text-gold-deep")}>
          <Award className="size-3.5" aria-hidden="true" />
          Man of the Match: {result.manOfMatch}
        </span>
      ) : null}
    </div>
  );
}

/**
 * One match result, scoreboard style.
 * "final": navy stadium card with big gold numerals and the winners' photo.
 * "photo": white card led by the match photo (semi-finals).
 * "score": compact white scoreboard (quarter-finals, league).
 */
export function ResultCard({ result, variant = "score" }: { result: MatchResult; variant?: Variant }) {
  const wonA = result.winner === result.teamA;
  const wonB = result.winner === result.teamB;

  if (variant === "final") {
    return (
      <article className="group relative isolate overflow-hidden rounded-[2rem] bg-stadium p-5 text-white shadow-[0_40px_90px_rgba(4,15,42,0.35)] ring-1 ring-white/10 sm:p-8 lg:p-10">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:22px_22px] [mask-image:radial-gradient(70%_80%_at_25%_50%,#000,transparent)]" />
          <GroundWatermark className="absolute -left-40 -top-24 w-[760px] text-white/[0.05]" />
          <div className="absolute -right-24 -top-24 size-80 rounded-full bg-gold/20 blur-[100px] motion-safe:animate-float-slow" />
          <div className="absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(217,174,86,0.8)_20%,rgba(217,174,86,0.8)_80%,transparent)]" />
        </div>
        <div className={cn("grid gap-8", result.image && "lg:grid-cols-[1.15fr_1fr] lg:items-center lg:gap-12")}>
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-2 rounded-full bg-gold px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.2em] text-navy shadow-[0_8px_20px_rgba(217,174,86,0.35)]">
                <Trophy className="size-3.5" aria-hidden="true" />
                {result.label}
              </span>
            </div>
            <div className="mt-6 space-y-4 rounded-3xl bg-navy-deep/60 p-5 ring-1 ring-white/10 backdrop-blur sm:p-6">
              <TeamRow name={result.teamA} score={result.scoreA} won={wonA} dark big />
              <div aria-hidden="true" className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.3em] text-white/40">
                <span className="h-px flex-1 bg-white/10" />v<span className="h-px flex-1 bg-white/10" />
              </div>
              <TeamRow name={result.teamB} score={result.scoreB} won={wonB} dark big />
            </div>
            <div className="mt-5">
              <Outcome result={result} dark />
            </div>
          </div>
          {result.image ? (
            <figure className="relative aspect-[4/3] overflow-hidden rounded-3xl shadow-[0_24px_60px_rgba(4,15,42,0.5)] ring-1 ring-white/20 lg:rotate-1 lg:transition-transform lg:duration-500 lg:group-hover:rotate-0">
              <Image
                src={result.image.src}
                alt={result.image.alt}
                fill
                sizes="(min-width: 1024px) 520px, 92vw"
                className="object-cover motion-safe:transition-transform motion-safe:duration-[1.6s] motion-safe:ease-out motion-safe:group-hover:scale-[1.06]"
              />
              <span aria-hidden="true" className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-navy-deep/85 to-transparent" />
              <figcaption className="absolute bottom-4 left-4 right-4 text-[11px] font-bold uppercase tracking-[0.2em] text-gold">
                Champions · {result.winner}
              </figcaption>
            </figure>
          ) : null}
        </div>
      </article>
    );
  }

  const photo = variant === "photo" ? result.image : undefined;
  return (
    <article className="group card-premium relative flex h-full flex-col overflow-hidden rounded-3xl bg-white shadow-[0_12px_30px_rgba(15,46,99,0.07)] ring-1 ring-line transition duration-300 hover:-translate-y-1.5 hover:shadow-[0_28px_60px_rgba(15,46,99,0.14)]">
      <span aria-hidden="true" className="absolute inset-x-6 top-0 z-10 h-[3px] origin-left scale-x-0 rounded-b-full bg-gold transition-transform duration-500 group-hover:scale-x-100" />
      {photo ? (
        <div className="relative aspect-[16/9] overflow-hidden bg-navy lg:aspect-[2/1]">
          <Image
            src={photo.src}
            alt={photo.alt}
            fill
            sizes="(min-width: 768px) 600px, 92vw"
            className="object-cover motion-safe:transition-transform motion-safe:duration-700 motion-safe:group-hover:scale-105"
          />
          <span aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-navy/80 via-navy/10 to-transparent" />
          <p className="absolute bottom-4 left-5 rounded-full bg-white/15 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.2em] text-white ring-1 ring-white/25 backdrop-blur">
            {result.label}
          </p>
        </div>
      ) : null}
      <div className="flex flex-1 flex-col p-6">
        {photo ? null : <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-royal">{result.label}</p>}
        <div className={cn("space-y-3", !photo && "mt-4")}>
          <TeamRow name={result.teamA} score={result.scoreA} won={wonA} dark={false} />
          <TeamRow name={result.teamB} score={result.scoreB} won={wonB} dark={false} />
        </div>
        <div className="mt-auto pt-5">
          <Outcome result={result} dark={false} />
        </div>
      </div>
    </article>
  );
}
