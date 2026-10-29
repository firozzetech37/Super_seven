import Link from "next/link";
import { ArrowDown, ArrowRight, Award, MapPinned, Users } from "lucide-react";
import { GroundWatermark } from "@/components/layout/ground-watermark";
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
      <Reveal stagger={110} className="mx-auto grid max-w-7xl gap-5 px-4 py-10 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:py-14">
        {cards.map(({ title, body, href, icon: Icon }, i) => (
          <Link
            key={title}
            href={href}
            className="group card-premium relative flex flex-col overflow-hidden rounded-3xl bg-surface p-6 ring-1 ring-line transition duration-300 hover:-translate-y-1.5 hover:bg-white hover:shadow-[0_28px_56px_rgba(15,46,99,0.14)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-gold"
          >
            <span
              aria-hidden="true"
              className="pointer-events-none absolute -right-2 -top-5 font-heading text-[6.5rem] font-bold leading-none text-navy/[0.05] transition duration-500 group-hover:-translate-y-1 group-hover:text-gold/20"
            >
              {String(i + 1).padStart(2, "0")}
            </span>
            <span aria-hidden="true" className="absolute inset-x-6 top-0 h-[3px] origin-left scale-x-0 rounded-b-full bg-gradient-to-r from-gold to-gold-deep transition-transform duration-500 group-hover:scale-x-100" />
            <span className="relative grid size-12 place-items-center rounded-2xl bg-royal/10 text-royal transition duration-300 group-hover:-rotate-6 group-hover:bg-royal group-hover:text-white group-hover:shadow-[0_10px_22px_rgba(28,79,160,0.35)]">
              <Icon className="size-6" aria-hidden="true" />
            </span>
            <h2 className="relative mt-5 font-heading text-[1.4rem] font-bold leading-tight text-navy">{title}</h2>
            <p className="relative mt-2 text-[15px] leading-relaxed text-slate-500">{body}</p>
            <span className="relative mt-auto flex items-center justify-between pt-6 text-sm font-bold text-royal">
              Open
              <span className="grid size-9 place-items-center rounded-full bg-white text-royal ring-1 ring-line transition duration-300 group-hover:bg-royal group-hover:text-white group-hover:ring-royal">
                <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5" aria-hidden="true" />
              </span>
            </span>
          </Link>
        ))}
        <a
          href="#people"
          className="group relative isolate flex flex-col justify-between overflow-hidden rounded-3xl bg-stadium p-6 text-white shadow-[0_22px_48px_rgba(15,46,99,0.32)] transition duration-300 hover:-translate-y-1.5 hover:shadow-[0_30px_60px_rgba(15,46,99,0.4)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-gold"
        >
          <GroundWatermark className="absolute -bottom-10 -right-24 -z-10 w-80 text-white/[0.08] transition-transform duration-700 group-hover:-rotate-6 group-hover:scale-110" />
          <span aria-hidden="true" className="pointer-events-none absolute -right-10 -top-10 -z-10 size-40 rounded-full bg-gold/20 blur-3xl transition-transform duration-700 group-hover:scale-150" />
          <span className="flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.24em] text-gold">
            <span aria-hidden="true" className="h-px w-6 bg-gold" />
            Keep going
          </span>
          <span className="mt-4 font-heading text-2xl font-bold leading-snug">
            Scroll down for people, the map and how to join
          </span>
          <span className="relative mt-6 grid size-12 place-items-center">
            <span aria-hidden="true" className="absolute inset-0 rounded-full bg-gold/40 motion-safe:animate-ping [animation-duration:2.2s]" />
            <span className="relative grid size-12 place-items-center rounded-full bg-gold text-navy shadow-[0_8px_20px_rgba(4,15,42,0.4)] transition-transform group-hover:translate-y-1">
              <ArrowDown className="size-5 motion-safe:animate-bounce" aria-hidden="true" />
            </span>
          </span>
        </a>
      </Reveal>
    </section>
  );
}
