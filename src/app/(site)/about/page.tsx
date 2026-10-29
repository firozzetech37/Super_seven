import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Building2, CalendarDays, Mail, ScrollText, UserRound } from "lucide-react";
import { PeopleLinks } from "@/components/about/people-links";
import { PeopleNav } from "@/components/about/people-nav";
import { Timeline } from "@/components/about/timeline";
import { GroundWatermark } from "@/components/layout/ground-watermark";
import { PageHeader } from "@/components/layout/page-header";
import { SectionHeading } from "@/components/layout/section-heading";
import { CountUp } from "@/components/motion/count-up";
import { Reveal } from "@/components/motion/reveal";
import { PersonCard } from "@/components/people/person-card";
import { leadership } from "@/lib/data/people";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "About",
  description: "Our story, the advisory committee, office bearers, committee and core members.",
};

const facts = [
  { icon: CalendarDays, label: "Founded", value: String(site.foundedYear) },
  { icon: UserRound, label: "Initiated by", value: site.foundedBy },
  { icon: ScrollText, label: "Registration", value: site.registration },
  { icon: Building2, label: "Registered office", value: site.address },
  { icon: Mail, label: "Email", value: site.email, href: `mailto:${site.email}` },
];

/** The format in four numbers, taken from the story text below. */
const format: { value?: number; text?: string; label: string }[] = [
  { value: 7, label: "Players a side" },
  { value: 7, label: "Overs an innings" },
  { value: 6, label: "Balls an over" },
  { text: "<2", label: "Hours a match" },
];

const headerStats: { v: number; l: string; plain?: boolean }[] = [
  { v: site.foundedYear, l: "Founded", plain: true },
  { v: 7, l: "Players" },
  { v: 7, l: "Overs" },
];

export default function AboutPage() {
  return (
    <>
      <PageHeader
        eyebrow="About SSCFI"
        title="Our story"
        description="Seven players a side, seven overs an innings, a match inside two hours. Cricket for men and women from the grassroots across India since 2003."
        crumbs={[{ label: "About" }]}
        aside={
          <dl className="grid grid-cols-3 gap-3">
            {headerStats.map((s) => (
              <div
                key={s.l}
                className="flex flex-col-reverse rounded-2xl bg-white/10 px-4 py-3 text-center ring-1 ring-white/15 backdrop-blur transition duration-300 hover:-translate-y-1 hover:bg-white/15 hover:ring-gold/50"
              >
                <dt className="text-[11px] font-bold uppercase tracking-[0.18em] text-gold">{s.l}</dt>
                <dd className="font-heading text-2xl font-bold sm:text-3xl">{s.plain ? s.v : <CountUp value={s.v} />}</dd>
              </div>
            ))}
          </dl>
        }
      />

      <PeopleNav current="/about" />

      {/* Story + federation facts */}
      <section className="relative isolate overflow-clip">
        <GroundWatermark className="parallax-slow pointer-events-none absolute -left-64 top-24 -z-10 w-[760px] text-navy/[0.035]" />
        <div className="mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[1fr_400px] lg:gap-16 lg:py-20">
          <div>
            <SectionHeading
              eyebrow="Who we are"
              title={
                <>
                  Cricket as <span className="text-royal">never experienced</span> before
                </>
              }
            />
            <Reveal delay={120} className="mt-8 space-y-5 text-[17px] leading-relaxed text-slate-600">
              <p className="border-l-[3px] border-gold pl-5 font-heading text-xl leading-relaxed text-ink sm:text-[1.35rem]">
                {site.name} was founded in {site.foundedYear}, initiated by {site.foundedBy}, to promote and develop the game of cricket for men and
                women from the grassroots level across India. It is registered as society no. 521/2003-04 under the Societies Registration Act, 1860.
              </p>
              <p>
                Super Seven presents cricket as never experienced before. Seven players a side. Seven overs an innings, with six of the seven players
                bowling an over each. Six balls an over, a match inside two hours, and a penalty for every no-ball, wide and bouncer so the game stays
                sharp.
              </p>
            </Reveal>

            <Reveal as="dl" stagger={100} from="scale" className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {format.map((f) => (
                <div
                  key={f.label}
                  className="group card-premium relative flex flex-col-reverse overflow-hidden rounded-2xl bg-white px-4 py-5 text-center shadow-[0_10px_24px_rgba(15,46,99,0.06)] ring-1 ring-line transition duration-300 hover:-translate-y-1 hover:shadow-[0_20px_44px_rgba(15,46,99,0.12)]"
                >
                  <dt className="mt-1 text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500">{f.label}</dt>
                  <dd className="font-heading text-4xl font-bold text-navy transition-colors group-hover:text-royal">
                    {f.value !== undefined ? <CountUp value={f.value} /> : f.text}
                  </dd>
                  <span aria-hidden="true" className="absolute inset-x-5 top-0 h-[3px] origin-left scale-x-0 rounded-b-full bg-gradient-to-r from-gold to-gold-deep transition-transform duration-500 group-hover:scale-x-100" />
                </div>
              ))}
            </Reveal>

            <Reveal className="mt-8 space-y-5 text-[17px] leading-relaxed text-slate-600">
              <p>
                It is a golden opportunity for every cricketer, where the passion runs high and far, all the way to the boundaries. From district
                grounds to the National Cricket League Super 7, the federation gives talent a platform: state and district teams, registered players
                with an ID, umpires and scorers trained in the format, and tournaments for juniors, seniors, women and corporate sides.
              </p>
              <p>
                Today the federation works district by district. A district association registers, its teams and players follow, and the map on this
                site turns from pink to yellow to green as each district comes on board.
              </p>
            </Reveal>

            <Reveal delay={100} className="mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Link
                href="/rules"
                className="group inline-flex items-center justify-center gap-2 rounded-full bg-navy px-6 py-3.5 font-bold text-white shadow-[0_12px_26px_rgba(15,46,99,0.25)] transition hover:-translate-y-0.5 hover:bg-royal focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-gold"
              >
                Read the rules
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
              </Link>
              <Link
                href="/register/district"
                className="inline-flex items-center justify-center gap-2 rounded-full px-6 py-3.5 font-bold text-navy ring-2 ring-navy/15 transition hover:-translate-y-0.5 hover:bg-surface hover:ring-navy focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-gold"
              >
                Register your District Association
              </Link>
            </Reveal>
          </div>

          <Reveal from="right" className="lg:sticky lg:top-28 lg:self-start">
            <aside aria-label="Federation facts" className="group overflow-hidden rounded-[1.75rem] bg-white shadow-[0_24px_54px_rgba(15,46,99,0.12)] ring-1 ring-line">
              <div className="relative isolate overflow-hidden bg-stadium px-6 py-6 text-white">
                <GroundWatermark className="absolute -right-16 -top-12 -z-10 w-72 text-white/[0.1] transition-transform duration-700 group-hover:-rotate-3 group-hover:scale-110" />
                <span aria-hidden="true" className="absolute inset-x-0 bottom-0 h-px bg-[linear-gradient(90deg,transparent,rgba(217,174,86,0.9)_20%,rgba(217,174,86,0.9)_80%,transparent)]" />
                <div className="flex items-center gap-4">
                  <span className="relative grid size-16 shrink-0 place-items-center rounded-full bg-gold font-heading text-navy shadow-[0_0_0_5px_rgba(217,174,86,0.2)]">
                    <span aria-hidden="true" className="absolute inset-1 rounded-full border border-dashed border-navy/40 motion-safe:animate-[spin_18s_linear_infinite]" />
                    <span className="text-center leading-none">
                      <span className="block text-[9px] font-bold uppercase tracking-[0.18em]">Est.</span>
                      <span className="block text-lg font-bold">{site.foundedYear}</span>
                    </span>
                  </span>
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-gold">At a glance</p>
                    <p className="mt-1 font-heading text-xl font-bold leading-tight">The federation on record</p>
                  </div>
                </div>
              </div>
              <dl className="divide-y divide-line px-6 py-2">
                {facts.map(({ icon: Icon, label, value, href }) => (
                  <div key={label} className="group/row flex gap-4 py-4">
                    <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-royal/10 text-royal transition duration-300 group-hover/row:-rotate-6 group-hover/row:bg-royal group-hover/row:text-white">
                      <Icon className="size-5" aria-hidden="true" />
                    </span>
                    <div className="min-w-0">
                      <dt className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500">{label}</dt>
                      <dd className="mt-0.5 text-[15px] font-bold leading-snug text-navy">
                        {href ? (
                          <a href={href} className="underline decoration-gold/60 decoration-2 underline-offset-4 transition-colors hover:text-royal hover:decoration-royal">
                            {value}
                          </a>
                        ) : (
                          value
                        )}
                      </dd>
                    </div>
                  </div>
                ))}
              </dl>
            </aside>
          </Reveal>
        </div>
      </section>

      {/* Milestones on a navy band */}
      <section className="relative isolate overflow-hidden bg-stadium py-16 text-white sm:py-20 lg:py-24">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:22px_22px] [mask-image:radial-gradient(70%_70%_at_70%_40%,#000,transparent)]" />
          <div className="absolute -left-40 top-1/3 size-[560px] rounded-full bg-royal/40 blur-[120px]" />
          <GroundWatermark className="parallax-slow absolute -right-48 -top-16 w-[820px] text-white/[0.05]" />
          <div className="absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(217,174,86,0.7)_20%,rgba(217,174,86,0.7)_80%,transparent)]" />
        </div>
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <SectionHeading
            tone="dark"
            eyebrow="Milestones"
            title={
              <>
                From {site.foundedYear} to <span className="text-gold">today</span>
              </>
            }
            description="The federation's journey, from a registered society to national tournaments and a district map."
          />
          <div className="mt-12 lg:mt-14">
            <Timeline />
          </div>
        </div>
      </section>

      {/* Leadership */}
      <section className="relative isolate overflow-hidden py-16 lg:py-20">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute -right-32 top-10 size-96 rounded-full bg-gold/10 blur-3xl" />
          <div className="absolute -left-32 bottom-0 size-96 rounded-full bg-royal/[0.06] blur-3xl" />
        </div>
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <SectionHeading
            eyebrow="Leadership"
            title="Who runs the federation"
            description="Leadership first, then the committees. Each card has a photo and direct contact."
            action={
              <Link
                href="/about/office-bearers"
                className="group inline-flex items-center gap-2 rounded-full bg-surface px-5 py-2.5 font-bold text-royal ring-1 ring-line transition hover:bg-royal hover:text-white hover:ring-royal focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-gold"
              >
                All office bearers
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
              </Link>
            }
          />
          <Reveal stagger={120} as="ul" className="mt-10 grid gap-6 md:grid-cols-3">
            {leadership.map((p) => (
              <li key={p.id}>
                <PersonCard person={p} />
              </li>
            ))}
          </Reveal>
        </div>
      </section>

      {/* Onward links */}
      <section className="relative border-t border-line bg-surface py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <SectionHeading eyebrow="People and governance" title="Committees, office bearers and documents" />
          <div className="mt-10">
            <PeopleLinks />
          </div>
        </div>
      </section>
    </>
  );
}
