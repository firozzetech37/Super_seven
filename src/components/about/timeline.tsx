import { Flag, Landmark, MapPinned, Trophy, type LucideIcon } from "lucide-react";
import { Reveal } from "@/components/motion/reveal";
import { site } from "@/lib/site";

const milestones: { year: string; title: string; text: string; icon: LucideIcon }[] = [
  {
    year: String(site.foundedYear),
    title: "Federation founded",
    text: `Initiated by ${site.foundedBy} and registered as a society (no. 521/2003-04) to take seven-a-side cricket to the grassroots.`,
    icon: Landmark,
  },
  {
    year: "2014",
    title: "NCL Super 7, Amroha",
    text: "24 teams from across India at Abbasi Cricket Ground, 22 to 25 June. Uttar Pradesh (Host) beat Mumbai in the final.",
    icon: Trophy,
  },
  {
    year: "2014",
    title: "NCL Super 7 Under-23, Hyderabad",
    text: "The under-23 league announced for 24 to 28 September.",
    icon: Flag,
  },
  {
    year: "Today",
    title: "District by district",
    text: "District associations register online, players get an ID, and the map shows where Super Seven is played.",
    icon: MapPinned,
  },
];

/**
 * Milestones on a navy band: a gold rail that draws itself in (down on phones, across on desktop)
 * with a glass card per milestone entering one after another.
 */
export function Timeline() {
  return (
    <Reveal
      as="ol"
      stagger={150}
      className="relative grid gap-5 pl-12 before:absolute before:bottom-6 before:left-[19px] before:top-6 before:w-px before:origin-top before:bg-[linear-gradient(to_bottom,#d9ae56,rgba(217,174,86,0.15))] before:transition-transform before:duration-[1600ms] before:ease-out motion-safe:[.js_&]:not-data-inview:before:scale-y-0 lg:grid-cols-4 lg:gap-6 lg:pl-0 lg:pt-14 lg:before:inset-x-6 lg:before:bottom-auto lg:before:left-6 lg:before:top-[19px] lg:before:h-px lg:before:w-auto lg:before:origin-left lg:before:bg-[linear-gradient(to_right,#d9ae56,rgba(217,174,86,0.15))] motion-safe:lg:[.js_&]:not-data-inview:before:scale-x-0 motion-safe:lg:[.js_&]:not-data-inview:before:scale-y-100"
    >
      {milestones.map(({ year, title, text, icon: Icon }, i) => (
        <li key={`${year}-${i}`} className="group relative">
          <span
            aria-hidden="true"
            className="absolute -left-12 top-5 grid size-10 place-items-center rounded-full bg-gold text-navy shadow-[0_0_0_6px_rgba(217,174,86,0.15)] transition duration-300 group-hover:scale-110 group-hover:shadow-[0_0_0_10px_rgba(217,174,86,0.18)] lg:-top-14 lg:left-6"
          >
            <Icon className="size-[18px]" />
          </span>
          <article className="relative h-full overflow-hidden rounded-3xl bg-white/[0.06] p-6 ring-1 ring-white/10 backdrop-blur transition duration-300 hover:-translate-y-1.5 hover:bg-white/[0.1] hover:ring-gold/50 hover:shadow-[0_24px_50px_rgba(4,15,42,0.45)]">
            <span
              aria-hidden="true"
              className="pointer-events-none absolute -bottom-5 -right-2 font-heading text-[5rem] font-bold leading-none text-white/[0.04] transition duration-500 group-hover:-translate-y-1 group-hover:text-gold/15"
            >
              {year === "Today" ? "Now" : year}
            </span>
            <span aria-hidden="true" className="absolute inset-x-6 top-0 h-[3px] origin-left scale-x-0 rounded-b-full bg-gradient-to-r from-gold to-gold-deep transition-transform duration-500 group-hover:scale-x-100" />
            <p className="relative inline-flex rounded-full bg-gold/15 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.24em] text-gold ring-1 ring-gold/30">{year}</p>
            <h3 className="relative mt-4 font-heading text-xl font-bold leading-snug text-white">{title}</h3>
            <p className="relative mt-2 text-[15px] leading-relaxed text-white/70">{text}</p>
          </article>
        </li>
      ))}
    </Reveal>
  );
}
