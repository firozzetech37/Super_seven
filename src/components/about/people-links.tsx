import Link from "next/link";
import { ArrowRight, BadgeCheck, FileText, Scale, UserCheck, Users, UsersRound } from "lucide-react";
import { Reveal } from "@/components/motion/reveal";

const links = [
  { title: "Advisory Committee", text: "Senior advisers to the federation.", href: "/about/advisory-committee", icon: Users, kind: "People" },
  { title: "Office Bearers", text: "President, Senior Vice President, Secretary General and the committee chairs.", href: "/about/office-bearers", icon: BadgeCheck, kind: "People" },
  { title: "Committee Members", text: "Photo, name, role and state of every committee member.", href: "/about/committee", icon: UsersRound, kind: "People" },
  { title: "Core Members", text: "The core group that runs tournaments and districts.", href: "/about/core-members", icon: UserCheck, kind: "People" },
  { title: "Constitution", text: "How the federation is governed.", href: "/governance/constitution", icon: Scale, kind: "Governance" },
  { title: "Documents", text: "Rule books, forms, fixtures and results.", href: "/governance/documents", icon: FileText, kind: "Governance" },
];

/** Six numbered link cards into the people and governance pages. */
export function PeopleLinks() {
  return (
    <Reveal stagger={90} as="ul" className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {links.map(({ title, text, href, icon: Icon, kind }, i) => (
        <li key={href}>
          <Link
            href={href}
            className="group card-premium relative flex h-full flex-col overflow-hidden rounded-3xl bg-white p-6 shadow-[0_12px_30px_rgba(15,46,99,0.07)] ring-1 ring-line transition duration-300 hover:-translate-y-1.5 hover:shadow-[0_28px_60px_rgba(15,46,99,0.14)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-gold"
          >
            <span
              aria-hidden="true"
              className="pointer-events-none absolute -right-2 -top-5 font-heading text-[6rem] font-bold leading-none text-navy/[0.05] transition duration-500 group-hover:-translate-y-1 group-hover:text-gold/20"
            >
              {String(i + 1).padStart(2, "0")}
            </span>
            <span aria-hidden="true" className="absolute inset-x-6 top-0 h-[3px] origin-left scale-x-0 rounded-b-full bg-gradient-to-r from-gold to-gold-deep transition-transform duration-500 group-hover:scale-x-100" />
            <span className="relative flex items-center gap-3">
              <span
                className={
                  kind === "People"
                    ? "grid size-12 place-items-center rounded-2xl bg-royal/10 text-royal transition duration-300 group-hover:-rotate-6 group-hover:bg-royal group-hover:text-white group-hover:shadow-[0_10px_22px_rgba(28,79,160,0.35)]"
                    : "grid size-12 place-items-center rounded-2xl bg-gold/20 text-gold-deep transition duration-300 group-hover:-rotate-6 group-hover:bg-gold group-hover:text-navy group-hover:shadow-[0_10px_22px_rgba(201,155,67,0.4)]"
                }
              >
                <Icon className="size-6" aria-hidden="true" />
              </span>
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">{kind}</span>
            </span>
            <span className="relative mt-5 block font-heading text-[1.35rem] font-bold leading-tight text-navy transition-colors group-hover:text-royal">{title}</span>
            <span className="relative mt-2 block text-[15px] leading-relaxed text-slate-500">{text}</span>
            <span className="relative mt-auto flex items-center justify-between pt-6 text-sm font-bold text-royal">
              Open
              <span className="grid size-9 place-items-center rounded-full bg-surface text-royal ring-1 ring-line transition duration-300 group-hover:bg-royal group-hover:text-white group-hover:ring-royal">
                <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5" aria-hidden="true" />
              </span>
            </span>
          </Link>
        </li>
      ))}
    </Reveal>
  );
}
