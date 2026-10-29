import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Building2, CalendarDays, Mail, ScrollText, UserRound } from "lucide-react";
import { PeopleLinks } from "@/components/about/people-links";
import { Timeline } from "@/components/about/timeline";
import { PageHeader } from "@/components/layout/page-header";
import { SectionHeading } from "@/components/layout/section-heading";
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
            {[
              { v: String(site.foundedYear), l: "Founded" },
              { v: "7", l: "Players" },
              { v: "7", l: "Overs" },
            ].map((s) => (
              <div key={s.l} className="rounded-2xl bg-white/10 px-4 py-3 text-center ring-1 ring-white/15 backdrop-blur">
                <dd className="font-heading text-2xl font-bold">{s.v}</dd>
                <dt className="text-[11px] font-bold uppercase tracking-[0.18em] text-gold">{s.l}</dt>
              </div>
            ))}
          </dl>
        }
      />

      <section className="mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[1fr_380px]">
        <div>
          <SectionHeading eyebrow="Who we are" title="Cricket as never experienced before" />
          <div className="mt-6 space-y-4 text-[17px] leading-relaxed text-slate-600">
            <p>
              {site.name} was founded in {site.foundedYear}, initiated by {site.foundedBy}, to promote and develop the
              game of cricket for men and women from the grassroots level across India. It is registered as society no.
              521/2003-04 under the Societies Registration Act, 1860.
            </p>
            <p>
              Super Seven presents cricket as never experienced before. Seven players a side. Seven overs an innings,
              with six of the seven players bowling an over each. Six balls an over, a match inside two hours, and a
              penalty for every no-ball, wide and bouncer so the game stays sharp.
            </p>
            <p>
              It is a golden opportunity for every cricketer, where the passion runs high and far, all the way to the
              boundaries. From district grounds to the National Cricket League Super 7, the federation gives talent a
              platform: state and district teams, registered players with an ID, umpires and scorers trained in the
              format, and tournaments for juniors, seniors, women and corporate sides.
            </p>
            <p>
              Today the federation works district by district. A district association registers, its teams and players
              follow, and the map on this site turns from pink to yellow to green as each district comes on board.
            </p>
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/rules"
              className="group inline-flex items-center gap-2 rounded-full bg-navy px-6 py-3 font-bold text-white transition hover:bg-royal"
            >
              Read the rules
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
            </Link>
            <Link
              href="/register/district"
              className="inline-flex items-center gap-2 rounded-full px-6 py-3 font-bold text-navy ring-2 ring-navy/20 transition hover:ring-navy"
            >
              Register your District Association
            </Link>
          </div>
        </div>

        <aside className="h-fit overflow-hidden rounded-3xl bg-white shadow-[0_18px_40px_rgba(15,46,99,0.1)] ring-1 ring-line">
          <div aria-hidden="true" className="h-1 bg-gradient-to-r from-gold to-gold-deep" />
          <dl className="divide-y divide-line p-6">
            {facts.map(({ icon: Icon, label, value, href }) => (
              <div key={label} className="flex gap-4 py-4 first:pt-0 last:pb-0">
                <span className="grid size-10 shrink-0 place-items-center rounded-full bg-royal/10 text-royal">
                  <Icon className="size-5" aria-hidden="true" />
                </span>
                <div className="min-w-0">
                  <dt className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500">{label}</dt>
                  <dd className="mt-0.5 text-[15px] font-bold leading-snug text-navy">
                    {href ? (
                      <a href={href} className="underline-offset-4 hover:underline">
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
      </section>

      <section className="border-y border-line bg-surface py-16">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-[380px_1fr]">
          <SectionHeading
            eyebrow="Milestones"
            title="From 2003 to today"
            description="The federation's journey, from a registered society to national tournaments and a district map."
          />
          <Timeline />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <SectionHeading
          eyebrow="Leadership"
          title="Who runs the federation"
          description="Leadership first, then the committees. Each card has a photo and direct contact."
          action={
            <Link href="/about/office-bearers" className="inline-flex items-center gap-2 font-bold text-royal underline-offset-4 hover:underline">
              All office bearers
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          }
        />
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {leadership.map((p) => (
            <PersonCard key={p.id} person={p} />
          ))}
        </div>
      </section>

      <section className="border-t border-line bg-surface py-16">
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
