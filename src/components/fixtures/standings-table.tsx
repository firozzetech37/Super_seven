import type { StandingsGroup } from "@/lib/queries/fixtures";

export function StandingsTable({ group }: { group: StandingsGroup }) {
  return (
    <div className="overflow-hidden rounded-3xl bg-white ring-1 ring-line">
      <div className="flex items-baseline justify-between gap-3 bg-navy px-5 py-3 text-white">
        <p className="font-heading text-lg font-bold">{group.group}</p>
        <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-gold">{group.tournament}</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <caption className="sr-only">
            {group.tournament} {group.group} standings
          </caption>
          <thead className="bg-surface text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500">
            <tr>
              <th className="px-4 py-2.5">Team</th>
              <th className="px-2 py-2.5 text-center">P</th>
              <th className="px-2 py-2.5 text-center">W</th>
              <th className="px-2 py-2.5 text-center">L</th>
              <th className="px-2 py-2.5 text-center">T</th>
              <th className="px-2 py-2.5 text-center">RF</th>
              <th className="px-2 py-2.5 text-center">RA</th>
              <th className="px-4 py-2.5 text-right">Pts</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line text-navy">
            {group.rows.map((r, i) => (
              <tr key={r.team} className={i === 0 ? "bg-gold/10" : undefined}>
                <td className="px-4 py-2.5 font-bold">{r.team}</td>
                <td className="px-2 py-2.5 text-center">{r.played}</td>
                <td className="px-2 py-2.5 text-center">{r.won}</td>
                <td className="px-2 py-2.5 text-center">{r.lost}</td>
                <td className="px-2 py-2.5 text-center">{r.tied}</td>
                <td className="px-2 py-2.5 text-center text-slate-500">{r.runs_for}</td>
                <td className="px-2 py-2.5 text-center text-slate-500">{r.runs_against}</td>
                <td className="px-4 py-2.5 text-right font-heading text-lg font-bold">{r.points}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
