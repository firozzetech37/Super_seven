import { Table2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { StandingsGroup } from "@/lib/queries/fixtures";

const columns = [
  { key: "P", label: "Played" },
  { key: "W", label: "Won" },
  { key: "L", label: "Lost" },
  { key: "T", label: "Tied" },
  { key: "RF", label: "Runs for" },
  { key: "RA", label: "Runs against" },
];

/** League table for one group: navy scoreboard header, rank badges, the leader highlighted in gold. */
export function StandingsTable({ group }: { group: StandingsGroup }) {
  return (
    <div className="group card-premium overflow-hidden rounded-3xl bg-white shadow-[0_12px_30px_rgba(15,46,99,0.07)] ring-1 ring-line transition duration-300 hover:shadow-[0_28px_60px_rgba(15,46,99,0.14)]">
      <div className="relative flex items-center justify-between gap-3 overflow-hidden bg-stadium px-5 py-4 text-white">
        <span aria-hidden="true" className="absolute inset-x-0 bottom-0 h-px bg-[linear-gradient(90deg,transparent,rgba(217,174,86,0.9)_20%,rgba(217,174,86,0.9)_80%,transparent)]" />
        <p className="flex items-center gap-3 font-heading text-xl font-bold">
          <span className="grid size-9 place-items-center rounded-xl bg-white/10 text-gold ring-1 ring-white/15 transition duration-300 group-hover:-rotate-6 group-hover:bg-gold group-hover:text-navy">
            <Table2 className="size-4" aria-hidden="true" />
          </span>
          {group.group}
        </p>
        <p className="text-right text-[11px] font-bold uppercase tracking-[0.16em] text-gold">{group.tournament}</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[30rem] text-left text-sm tabular-nums">
          <caption className="sr-only">
            {group.tournament} {group.group} standings
          </caption>
          <thead className="bg-surface text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500">
            <tr>
              <th scope="col" className="w-12 py-3 pl-5 pr-2">
                <abbr title="Position" className="no-underline">#</abbr>
              </th>
              <th scope="col" className="px-2 py-3">Team</th>
              {columns.map((c) => (
                <th key={c.key} scope="col" className="px-2 py-3 text-center">
                  <abbr title={c.label} className="no-underline">
                    {c.key}
                  </abbr>
                </th>
              ))}
              <th scope="col" className="py-3 pl-2 pr-5 text-right">
                <abbr title="Points" className="no-underline">Pts</abbr>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line text-navy">
            {group.rows.map((r, i) => {
              // Gold only for an outright leader, never for a team level on points with the next one.
              const lead = i === 0 && (group.rows.length === 1 || r.points > group.rows[1].points);
              return (
                <tr key={r.team} className={cn("transition-colors hover:bg-surface", lead && "bg-gold/10 hover:bg-gold/15")}>
                  <td className={cn("py-3 pl-5 pr-2", lead && "shadow-[inset_3px_0_0_#d9ae56]")}>
                    <span
                      className={cn(
                        "grid size-7 place-items-center rounded-full text-xs font-bold",
                        lead ? "bg-gold text-navy" : "bg-surface text-slate-500 ring-1 ring-line",
                      )}
                    >
                      {i + 1}
                    </span>
                  </td>
                  <th scope="row" className="px-2 py-3 font-bold">
                    {r.team}
                  </th>
                  <td className="px-2 py-3 text-center">{r.played}</td>
                  <td className="px-2 py-3 text-center">{r.won}</td>
                  <td className="px-2 py-3 text-center">{r.lost}</td>
                  <td className="px-2 py-3 text-center">{r.tied}</td>
                  <td className="px-2 py-3 text-center text-slate-500">{r.runs_for}</td>
                  <td className="px-2 py-3 text-center text-slate-500">{r.runs_against}</td>
                  <td className="py-3 pl-2 pr-5 text-right">
                    <span className={cn("font-heading text-xl font-bold", lead ? "text-gold-deep" : "text-navy")}>{r.points}</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/**
 * Shown while no league results are stored: a faint, empty table in the real shape (no numbers)
 * behind the explanation, so visitors see what will appear here.
 */
export function StandingsEmpty() {
  return (
    <div className="relative isolate overflow-hidden rounded-3xl bg-white shadow-[0_12px_30px_rgba(15,46,99,0.07)] ring-1 ring-line">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 select-none">
        <div className="flex items-center justify-between bg-navy/90 px-5 py-4">
          <span className="h-4 w-24 rounded-full bg-white/20" />
          <span className="h-3 w-32 rounded-full bg-gold/40" />
        </div>
        <div className="grid grid-cols-[2.5rem_1fr_repeat(4,2.5rem)] gap-3 bg-surface px-5 py-3 text-[11px] font-bold uppercase tracking-[0.16em] text-slate-400 sm:grid-cols-[2.5rem_1fr_repeat(7,2.5rem)]">
          <span>#</span>
          <span>Team</span>
          <span className="text-center">P</span>
          <span className="text-center">W</span>
          <span className="hidden text-center sm:block">L</span>
          <span className="hidden text-center sm:block">T</span>
          <span className="hidden text-center sm:block">RF</span>
          <span className="text-center">RA</span>
          <span className="text-right">Pts</span>
        </div>
        <ul className="divide-y divide-line [mask-image:linear-gradient(to_bottom,#000,transparent_95%)]">
          {Array.from({ length: 7 }).map((_, i) => (
            <li key={i} className="grid grid-cols-[2.5rem_1fr_repeat(4,2.5rem)] items-center gap-3 px-5 py-3.5 sm:grid-cols-[2.5rem_1fr_repeat(7,2.5rem)]">
              <span className={cn("size-7 rounded-full", i === 0 ? "bg-gold/40" : "bg-surface ring-1 ring-line")} />
              <span className="h-3.5 rounded-full shimmer-light" style={{ width: `${72 - (i % 4) * 12}%` }} />
              {Array.from({ length: 7 }).map((__, j) => (
                <span key={j} className={cn("mx-auto h-3 w-5 rounded-full bg-line", j >= 2 && j <= 4 && "hidden sm:block")} />
              ))}
            </li>
          ))}
        </ul>
      </div>

      <div className="grid place-items-center bg-white/55 px-4 py-14 backdrop-blur-[2px] sm:py-20">
        <div className="max-w-md rounded-3xl bg-white/95 p-6 text-center shadow-[0_24px_60px_rgba(15,46,99,0.16)] ring-1 ring-line sm:p-8">
          <span className="relative mx-auto grid size-12 place-items-center rounded-2xl bg-royal text-white">
            <span aria-hidden="true" className="absolute inset-0 rounded-2xl bg-royal/40 motion-safe:animate-ping [animation-duration:2.4s]" />
            <Table2 className="relative size-6" aria-hidden="true" />
          </span>
          <h3 className="mt-5 font-heading text-2xl font-bold text-navy">No league results stored yet</h3>
          <p className="mt-2 text-slate-600">
            Tables appear here automatically as results are entered. Nothing is typed by hand, so nothing can go stale.
          </p>
        </div>
      </div>
    </div>
  );
}
