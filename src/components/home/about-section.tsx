import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SectionHeading } from "@/components/layout/section-heading";
import { CountUp } from "@/components/motion/count-up";
import { Reveal } from "@/components/motion/reveal";
import { aboutLinks, site } from "@/lib/site";

const stats = [
  { value: site.foundedYear, from: site.foundedYear - 60, suffix: "", label: "Founded" },
  { value: 7, from: 0, suffix: "", label: "Players a side" },
  { value: 7, from: 0, suffix: "", label: "Overs an innings" },
  { value: 2, from: 0, suffix: " h", label: "Per match" },
];

export function AboutSection() {
  return (
    <section className="border-t border-line bg-surface py-16 lg:py-20">
      <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-[1fr_360px]">
        <div>
          <SectionHeading eyebrow="About SSCFI" title="Our story" />
          <p className="mt-6 text-[17px] leading-relaxed text-slate-600">
            {site.name} was founded in {site.foundedYear}, initiated by {site.foundedBy}, to promote and develop the
            game of cricket for men and women from the grassroots level across India. Super Seven presents cricket as
            never experienced before: seven players a side, seven overs an innings, a match inside two hours.
          </p>
          <p className="mt-4 text-[17px] leading-relaxed text-slate-600">
            It is a golden opportunity for every cricketer, where the passion runs high and far, all the way to the
            boundaries. A platform for showing talent, from district grounds to national championships.
          </p>
          <dl className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {stats.map((s, i) => (
              <Reveal key={s.label} delay={i * 80} className="rounded-2xl bg-white p-4 ring-1 ring-line">
                <dt className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500">{s.label}</dt>
                <dd className="mt-1 font-heading text-3xl font-bold tabular-nums text-navy">
                  <CountUp value={s.value} from={s.from} suffix={s.suffix} />
                </dd>
              </Reveal>
            ))}
          </dl>
          <Link href="/about" className="group mt-8 inline-flex items-center gap-2 font-bold text-royal underline-offset-4 hover:underline">
            Read our story
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
          </Link>
        </div>

        <Reveal delay={120} className="h-fit">
        <nav aria-label="About" className="overflow-hidden rounded-3xl bg-white shadow-[0_18px_40px_rgba(15,46,99,0.1)] ring-1 ring-line">
          <div aria-hidden="true" className="h-1 bg-gradient-to-r from-gold to-gold-deep" />
          <div className="p-6">
            <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-royal">About</p>
            <ul className="mt-3 divide-y divide-line">
              {aboutLinks.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="group flex items-center justify-between py-3 font-bold text-navy transition-colors hover:text-royal">
                    {l.label}
                    <ArrowRight className="size-4 text-slate-300 transition group-hover:translate-x-1 group-hover:text-royal" aria-hidden="true" />
                  </Link>
                </li>
              ))}
            </ul>
            <p className="mt-5 text-xs leading-relaxed text-slate-500">{site.registration}.</p>
          </div>
        </nav>
        </Reveal>
      </div>
    </section>
  );
}
