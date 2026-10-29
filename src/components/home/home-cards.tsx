import Link from "next/link";
import { ArrowDown, ArrowRight, Award, MapPinned, Users } from "lucide-react";
import { Reveal } from "@/components/motion/reveal";

const cards = [
  {
    title: "Leadership",
    body: "President Firozze Kamaal Abbasi, the Secretary and the COO, with direct contact.",
    href: "#people",
    icon: Award,
  },
  {
    title: "Committee & Core Members",
    body: "The advisory, committee and core members behind the federation.",
    href: "/about/committee",
    icon: Users,
  },
  {
    title: "Find us on the map",
    body: "India › State › District › Locality. See where Super Seven is played.",
    href: "/locations",
    icon: MapPinned,
  },
];

/** Four quick links under the ground: three white cards and one navy "scroll" card, as in the concept. */
export function HomeCards() {
  return (
    <section className="relative bg-white">
      <div className="mx-auto grid max-w-7xl gap-5 px-4 py-8 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:py-10">
        {cards.map(({ title, body, href, icon: Icon }, i) => (
          <Reveal key={title} delay={i * 90} className="flex">
          <Link
            href={href}
            className="group card-premium flex flex-1 flex-col rounded-2xl bg-surface p-6 ring-1 ring-line transition duration-200 hover:-translate-y-1 hover:bg-white hover:shadow-[0_18px_40px_rgba(15,46,99,0.12)]"
          >
            <span className="grid size-12 place-items-center rounded-xl bg-royal/10 text-royal transition-colors group-hover:bg-royal group-hover:text-white">
              <Icon className="size-6" aria-hidden="true" />
            </span>
            <h2 className="mt-5 font-heading text-[1.4rem] font-bold leading-tight text-navy">{title}</h2>
            <p className="mt-2 text-[15px] leading-relaxed text-slate-500">{body}</p>
            <span className="mt-auto flex items-center gap-1.5 pt-5 text-sm font-bold text-royal">
              Open
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
            </span>
          </Link>
          </Reveal>
        ))}
        <Reveal delay={270} className="flex">
        <a
          href="#people"
          className="group relative flex flex-1 flex-col justify-between overflow-hidden rounded-2xl bg-[linear-gradient(145deg,#1c4fa0,#0f2e63)] p-6 text-white shadow-[0_18px_40px_rgba(15,46,99,0.3)] transition duration-200 hover:-translate-y-1"
        >
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -right-10 -top-10 size-40 rounded-full bg-white/10 blur-2xl transition-transform duration-500 group-hover:scale-150"
          />
          <span className="text-[11px] font-bold uppercase tracking-[0.24em] text-gold">Keep going</span>
          <span className="mt-4 font-heading text-2xl font-bold leading-snug">
            Scroll down for people, the map and how to join
          </span>
          <span className="mt-6 grid size-11 place-items-center rounded-full bg-gold text-navy transition-transform group-hover:translate-y-1">
            <ArrowDown className="size-5 motion-safe:animate-bounce" aria-hidden="true" />
          </span>
        </a>
        </Reveal>
      </div>
    </section>
  );
}
