import { ArrowDown } from "lucide-react";

/** "On this page" pills shown in the PageHeader aside of the content pages. */
export function JumpLinks({ links }: { links: { label: string; href: string }[] }) {
  return (
    <nav aria-label="On this page" className="flex flex-wrap gap-2">
      {links.map((l) => (
        <a
          key={l.href}
          href={l.href}
          className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-4 py-2 text-sm font-bold text-white ring-1 ring-white/20 transition hover:bg-gold hover:text-navy hover:ring-gold"
        >
          {l.label}
          <ArrowDown className="size-3.5" aria-hidden="true" />
        </a>
      ))}
    </nav>
  );
}
