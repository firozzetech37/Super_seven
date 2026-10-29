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

export function StateUnitCard({ unit }: { unit: StateUnit }) {
  return (
    <article className="group relative overflow-hidden rounded-2xl bg-white p-6 ring-1 ring-line transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_18px_40px_rgba(15,46,99,0.12)] hover:ring-royal/30">
      <div className="flex items-center justify-between gap-3">
        <h3 className="font-heading text-xl font-bold text-navy">{unit.state}</h3>
        <span className="rounded-full bg-navy px-2.5 py-1 text-[11px] font-bold tracking-[0.14em] text-gold ring-1 ring-gold/40">
          {unit.code}
        </span>
      </div>
      <ul className="mt-5 space-y-3">
        {unit.officials.map((o) => (
          <li key={o.name} className="flex items-center gap-3">
            <span className="grid size-10 shrink-0 place-items-center rounded-full bg-royal/10 text-xs font-bold text-royal ring-2 ring-white">
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
