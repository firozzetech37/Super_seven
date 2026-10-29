import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { statusMeta, type Status } from "@/lib/data/locations";
import { cn } from "@/lib/utils";

/** A row link on the dark glass panel: status dot, name, a short note and an arrow that lifts on hover. */
export function PanelLink({ href, name, status, meta }: { href: string; name: string; status: Status; meta?: string }) {
  return (
    <Link
      href={href}
      className="group flex items-center gap-3 rounded-2xl bg-white/[0.05] px-3.5 py-2.5 ring-1 ring-white/10 transition duration-300 hover:translate-x-1 hover:bg-white/[0.1] hover:ring-gold/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
    >
      <span className="grid size-8 shrink-0 place-items-center rounded-xl bg-white/10 transition-colors duration-300 group-hover:bg-gold">
        <span aria-hidden="true" className={cn("size-2.5 rounded-full ring-2 ring-navy/30", statusMeta[status].dot)} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate font-bold text-white">{name}</span>
        <span className="block truncate text-xs text-white/55">
          {statusMeta[status].label}
          {meta ? ` · ${meta}` : ""}
        </span>
      </span>
      <ArrowUpRight className="size-4 shrink-0 text-white/30 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-gold" aria-hidden="true" />
    </Link>
  );
}
