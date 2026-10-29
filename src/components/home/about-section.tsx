import Link from "next/link";
import { ArrowRight, CalendarDays, Clock3, Quote, RotateCcw, Users } from "lucide-react";
import { GroundWatermark } from "@/components/layout/ground-watermark";
import { SectionHeading } from "@/components/layout/section-heading";
import { CountUp } from "@/components/motion/count-up";
import { Reveal } from "@/components/motion/reveal";
import { aboutLinks, site } from "@/lib/site";

const stats = [
  { value: site.foundedYear, from: site.foundedYear - 60, suffix: "", label: "Founded", icon: CalendarDays },
  { value: 7, from: 0, suffix: "", label: "Players a side", icon: Users },
  { value: 7, from: 0, suffix: "", label: "Overs an innings", icon: RotateCcw },
  { value: 2, from: 0, suffix: " h", label: "Per match", icon: Clock3 },
];

export function AboutSection() {
  return (
    <section className="relative isolate overflow-hidden border-t border-line bg-surface py-16 lg:py-24">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(40%_50%_at_0%_0%,rgba(217,174,86,0.14),transparent_70%)]" />
        <GroundWatermark className="parallax-slow absolute -left-56 bottom-0 w-[760px] text-navy/[0.04]" />
      </div>
      <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-[1fr_380px] lg:gap-16">
        <div>
          <SectionHeading
            eyebrow="About SSCFI"
            title={
              <>
                Our <span className="text-royal">story</span>
              </>
            }
          />
          <Reveal className="relative mt-8 rounded-3xl bg-white p-6 shadow-[0_12px_30px_rgba(15,46,99,0.06)] ring-1 ring-line sm:p-8">
            <Quote aria-hidden="true" className="absolute -top-4 left-6 size-9 rounded-xl bg-gold p-2 text-navy shadow-[0_8px_18px_rgba(201,155,67,0.4)]" />
            <p className="text-[17px] leading-relaxed text-slate-600">
              <span className="font-heading text-xl font-bold text-navy">{site.name}</span> was founded in {site.foundedYear}, initiated by{" "}
              {site.foundedBy}, to promote and develop the game of cricket for men and women from the grassroots level across India. Super
              Seven presents cricket as never experienced before: seven players a side, seven overs an innings, a match inside two hours.
            </p>
            <p className="mt-4 text-[17px] leading-relaxed text-slate-600">
              It is a golden opportunity for every cricketer, where the passion runs high and far, all the way to the boundaries. A platform
              for showing talent, from district grounds to national championships.
            </p>
          </Reveal>
          <Reveal as="dl" stagger={90} className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {stats.map(({ label, value, from, suffix, icon: Icon }) => (
              <div
                key={label}
                className="group relative overflow-hidden rounded-2xl bg-white p-4 ring-1 ring-line transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_36px_rgba(15,46,99,0.12)]"
              >
                <span aria-hidden="true" className="absolute inset-x-4 top-0 h-[3px] origin-left scale-x-0 rounded-b-full bg-gradient-to-r from-gold to-gold-deep transition-transform duration-500 group-hover:scale-x-100" />
                <Icon className="size-5 text-gold-deep" aria-hidden="true" />
                <dd className="mt-3 font-heading text-3xl font-bold tabular-nums text-navy">
                  <CountUp value={value} from={from} suffix={suffix} />
                </dd>
                <dt className="mt-1 text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500">{label}</dt>
              </div>
            ))}
          </Reveal>
          <Link
            href="/about"
            className="group mt-8 inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 font-bold text-royal shadow-[0_8px_20px_rgba(15,46,99,0.08)] ring-1 ring-line transition hover:ring-royal"
          >
            Read our story
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
          </Link>
        </div>

        <Reveal from="right" delay={120} className="h-fit lg:sticky lg:top-24">
          <nav aria-label="About" className="relative isolate overflow-hidden rounded-3xl bg-stadium p-6 text-white shadow-[0_30px_60px_rgba(15,46,99,0.3)] ring-1 ring-white/10">
            <GroundWatermark className="absolute -right-24 -top-16 -z-10 w-80 text-white/[0.07]" />
            <div aria-hidden="true" className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-gold to-gold-deep" />
            <p className="flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.24em] text-gold">
              <span aria-hidden="true" className="h-px w-6 bg-gold" />
              Explore the federation
            </p>
            <ul className="mt-4 space-y-1">
              {aboutLinks.map((l, i) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="group flex items-center gap-3 rounded-xl px-3 py-3 font-bold text-white/90 transition hover:bg-white/10 hover:text-white"
                  >
                    <span className="grid size-7 shrink-0 place-items-center rounded-full bg-white/10 font-mono text-[11px] text-gold ring-1 ring-white/15 transition-colors group-hover:bg-gold group-hover:text-navy">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="flex-1">{l.label}</span>
                    <ArrowRight className="size-4 text-white/30 transition group-hover:translate-x-1 group-hover:text-gold" aria-hidden="true" />
                  </Link>
                </li>
              ))}
            </ul>
            <p className="mt-5 border-t border-white/10 pt-4 text-xs leading-relaxed text-white/55">{site.registration}.</p>
          </nav>
        </Reveal>
      </div>
    </section>
  );
}
