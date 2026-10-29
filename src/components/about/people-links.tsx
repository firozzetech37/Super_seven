import Link from "next/link";
import { ArrowRight, BadgeCheck, FileText, Scale, UserCheck, Users, UsersRound } from "lucide-react";
import { Reveal } from "@/components/motion/reveal";

const links = [
  { title: "Advisory Committee", text: "Senior advisers to the federation.", href: "/about/advisory-committee", icon: Users },
  { title: "Office Bearers", text: "President, Senior Vice President, Secretary General and the committee chairs.", href: "/about/office-bearers", icon: BadgeCheck },
  { title: "Committee Members", text: "Photo, name, role and state of every committee member.", href: "/about/committee", icon: UsersRound },
  { title: "Core Members", text: "The core group that runs tournaments and districts.", href: "/about/core-members", icon: UserCheck },
  { title: "Constitution", text: "How the federation is governed.", href: "/governance/constitution", icon: Scale },
  { title: "Documents", text: "Rule books, forms, fixtures and results.", href: "/governance/documents", icon: FileText },
];

export function PeopleLinks() {
  return (
    <Reveal stagger as="ul" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {links.map(({ title, text, href, icon: Icon }) => (
        <li key={href}>
          <Link
            href={href}
            className="group flex h-full items-start gap-4 rounded-2xl bg-white p-5 ring-1 ring-line transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_18px_40px_rgba(15,46,99,0.12)] hover:ring-royal/40"
          >
            <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-royal/10 text-royal transition-colors group-hover:bg-royal group-hover:text-white">
              <Icon className="size-5" aria-hidden="true" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="flex items-center justify-between gap-2 font-heading text-lg font-bold text-navy">
                {title}
                <ArrowRight className="size-4 shrink-0 text-slate-300 transition group-hover:translate-x-1 group-hover:text-royal" aria-hidden="true" />
              </span>
              <span className="mt-1 block text-[15px] text-slate-500">{text}</span>
            </span>
          </Link>
        </li>
      ))}
    </Reveal>
  );
}
