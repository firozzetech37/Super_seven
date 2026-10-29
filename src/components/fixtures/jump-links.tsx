import { ArrowDown } from "lucide-react";

/** "On this page" pills shown in the PageHeader aside of the content pages. */
export function JumpLinks({ links }: { links: { label: string; href: string }[] }) {
  return (
    <nav aria-label="On this page" className="flex flex-wrap gap-2">
      {links.map((l) => (
        <a
          key={l.href}
          href={l.href}
          className="group inline-flex items-center gap-2 rounded-full bg-white/10 py-1.5 pl-4 pr-1.5 text-sm font-bold text-white ring-1 ring-white/20 backdrop-blur transition duration-300 hover:-translate-y-0.5 hover:bg-gold hover:text-navy hover:shadow-[0_10px_24px_rgba(4,15,42,0.35)] hover:ring-gold"
        >
          {l.label}
          <span className="grid size-6 place-items-center rounded-full bg-white/15 transition-colors group-hover:bg-navy/10">
            <ArrowDown className="size-3.5 transition-transform duration-300 group-hover:translate-y-0.5" aria-hidden="true" />
          </span>
        </a>
      ))}
    </nav>
  );
}
