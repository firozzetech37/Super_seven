import type { StateUnit } from "@/lib/data/teams";

const titles = new Set(["dr", "mr", "mrs", "ms", "hony."]);

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter((w) => !titles.has(w.toLowerCase()))
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
}

/**
 * State unit: navy code badge that tilts on hover, the state name, then its office-bearers with
 * gradient initials. The state code sits behind as a large faint numeral.
 */
export function StateUnitCard({ unit }: { unit: StateUnit }) {
  return (
    <article className="group card-premium relative flex h-full flex-col overflow-hidden rounded-3xl bg-white p-6 shadow-[0_12px_30px_rgba(15,46,99,0.07)] ring-1 ring-line transition duration-300 hover:-translate-y-1.5 hover:shadow-[0_28px_60px_rgba(15,46,99,0.14)]">
      <span aria-hidden="true" className="absolute inset-x-6 top-0 h-[3px] origin-left scale-x-0 rounded-b-full bg-gold transition-transform duration-500 group-hover:scale-x-100" />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-7 -right-2 select-none font-heading text-[6rem] font-bold leading-none text-navy/[0.05] transition-colors duration-300 group-hover:text-gold/20"
      >
        {unit.code}
      </span>
      <span aria-hidden="true" className="pointer-events-none absolute -right-20 -top-20 size-56 rounded-full bg-gold/15 opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100" />

      <div className="relative flex items-center gap-4">
        <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-stadium font-heading text-sm font-bold tracking-[0.06em] text-gold shadow-[0_8px_18px_rgba(15,46,99,0.25)] ring-1 ring-gold/30 transition duration-300 group-hover:-rotate-6">
          <span className="sr-only">State code </span>
          {unit.code}
        </span>
        <div className="min-w-0">
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-royal">State unit</p>
          <h3 className="font-heading text-xl font-bold text-navy transition-colors group-hover:text-royal">{unit.state}</h3>
        </div>
      </div>

      <ul className="relative mt-6 space-y-3 border-t border-line pt-5">
        {unit.officials.map((o) => (
          <li key={o.name} className="flex items-center gap-3">
            <span
              aria-hidden="true"
              className="grid size-11 shrink-0 place-items-center rounded-full bg-[linear-gradient(150deg,#1c4fa0,#0f2e63)] text-xs font-bold tracking-wide text-gold shadow-[0_6px_14px_rgba(15,46,99,0.2)] ring-[3px] ring-white"
            >
              {initials(o.name)}
            </span>
            <span className="min-w-0">
              <span className="block text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500">{o.role}</span>
              <span className="block truncate font-bold text-ink">{o.name}</span>
            </span>
          </li>
        ))}
      </ul>
    </article>
  );
}
