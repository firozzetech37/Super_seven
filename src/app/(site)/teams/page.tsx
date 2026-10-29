import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, BadgeCheck, Building2, ClipboardList, Map as MapIcon, MapPinned, PhoneCall, Trophy, Whistle } from "lucide-react";
import { JumpLinks } from "@/components/fixtures/jump-links";
import { PageHeader } from "@/components/layout/page-header";
import { SectionHeading } from "@/components/layout/section-heading";
import { OfficialCard } from "@/components/teams/official-card";
import { StateUnitCard } from "@/components/teams/state-unit-card";
import { archiveTeams2014, officials, stateUnits } from "@/lib/data/teams";
import { Reveal } from "@/components/motion/reveal";
import { CountUp } from "@/components/motion/count-up";
import { GroundWatermark } from "@/components/layout/ground-watermark";
import { statusMeta, type Status } from "@/lib/data/locations";

export const metadata: Metadata = {
  title: "Teams",
  description: "State units and their officials, district teams, and the umpires, scorers and coaches who run the matches.",
};

const jump = [
  { label: "State teams", href: "#state" },
  { label: "District teams", href: "#district" },
  { label: "Officials", href: "#officials" },
];

const districtSteps = [
  { icon: ClipboardList, title: "Submit the form", text: "The district association registers online." },
  { icon: PhoneCall, title: "SSCFI reviews and calls back", text: "The federation checks the details with you." },
  { icon: BadgeCheck, title: "Certificate or player ID", text: "Issued once the registration is approved." },
  { icon: MapIcon, title: "Yellow, then green", text: "The district changes colour on the map." },
];

const statusOrder: Status[] = ["onboarded", "talks", "unreached"];

const darkBand = (
  <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
    <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:22px_22px] [mask-image:radial-gradient(60%_70%_at_30%_40%,#000,transparent)]" />
    <div className="absolute -right-40 top-1/3 size-[560px] rounded-full bg-royal/40 blur-[120px]" />
    <GroundWatermark className="parallax-slow absolute -left-64 -top-16 w-[900px] text-white/[0.05]" />
    <div className="absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(217,174,86,0.7)_20%,rgba(217,174,86,0.7)_80%,transparent)]" />
  </div>
);

export default function TeamsPage() {
  const officeBearers = stateUnits.reduce((n, u) => n + u.officials.length, 0);
  const stats = [
    { value: stateUnits.length, label: "State units" },
    { value: officeBearers, label: "Office-bearers listed" },
    { value: archiveTeams2014.length, label: "Teams at NCL S7 2014" },
  ];

  return (
    <>
      <PageHeader
        eyebrow="Door 1 of 7"
        title="Teams"
        description="State teams, district teams and the officials who run the matches."
        crumbs={[{ label: "Teams" }]}
        aside={<JumpLinks links={jump} />}
      />

      <section id="state" className="relative isolate scroll-mt-28 overflow-hidden bg-white py-16 lg:py-20">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute -right-40 -top-40 size-[520px] rounded-full bg-royal/[0.06] blur-3xl" />
          <GroundWatermark className="parallax-slow absolute -left-72 top-1/3 w-[820px] text-navy/[0.035]" />
        </div>
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <SectionHeading
            eyebrow="State teams"
            title={
              <>
                Nine <span className="text-royal">state units</span>
              </>
            }
            description="Presidents and secretaries as published in the SSCFI State Officials list. Changes come through the state units themselves."
            action={
              <Link
                href="/players"
                className="group inline-flex items-center gap-2 rounded-full px-5 py-2.5 font-bold text-royal ring-1 ring-royal/30 transition hover:bg-royal hover:text-white hover:ring-royal"
              >
                Player directory
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
              </Link>
            }
          />

          <Reveal as="dl" stagger={100} className="mt-10 grid grid-cols-3 gap-3 sm:gap-5">
            {stats.map((s) => (
              <div key={s.label} className="flex flex-col-reverse rounded-2xl bg-surface px-3 py-4 text-center ring-1 ring-line sm:px-6 sm:py-5 sm:text-left">
                <dt className="mt-1 text-[10px] font-bold uppercase leading-tight tracking-[0.14em] text-slate-500 sm:text-[11px] sm:tracking-[0.18em]">{s.label}</dt>
                <dd className="font-heading text-3xl font-bold tabular-nums text-navy sm:text-4xl">
                  <CountUp value={s.value} />
                </dd>
              </div>
            ))}
          </Reveal>

          <Reveal stagger className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {stateUnits.map((u) => (
              <StateUnitCard key={u.id} unit={u} />
            ))}
          </Reveal>

          <Reveal className="relative mt-16 overflow-hidden rounded-[2rem] bg-surface p-6 ring-1 ring-line sm:p-10">
            <span
              aria-hidden="true"
              className="pointer-events-none absolute -right-4 -top-10 select-none font-heading text-[8rem] font-bold leading-none text-navy/[0.04] sm:text-[11rem]"
            >
              2014
            </span>
            <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div className="flex items-start gap-4">
                <span className="grid size-14 shrink-0 place-items-center rounded-2xl bg-gold text-navy shadow-[0_0_0_6px_rgba(217,174,86,0.18)]">
                  <Trophy className="size-7" aria-hidden="true" />
                </span>
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-royal">2014 archive</p>
                  <h3 className="mt-1 font-heading text-2xl font-bold text-navy sm:text-3xl">The 24 teams of NCL S7 Amroha</h3>
                  <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-slate-500">
                    National Cricket League Super 7, Abbasi Cricket Ground, 22–25 June 2014. Eight groups of three.
                  </p>
                </div>
              </div>
              <Link
                href="/fixtures#archive"
                className="group inline-flex shrink-0 items-center gap-2 self-start rounded-full bg-navy px-6 py-3 font-bold text-white shadow-[0_12px_28px_rgba(15,46,99,0.2)] transition hover:bg-royal lg:self-auto"
              >
                Results and fixtures
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
              </Link>
            </div>
            <Reveal as="ul" stagger={35} from="scale" className="relative mt-8 flex flex-wrap gap-2">
              {archiveTeams2014.map((t) => (
                <li
                  key={t}
                  className="rounded-full bg-white px-4 py-1.5 text-sm font-bold text-navy shadow-[0_4px_10px_rgba(15,46,99,0.04)] ring-1 ring-line transition duration-300 hover:-translate-y-0.5 hover:bg-navy hover:text-gold hover:ring-navy"
                >
                  {t}
                </li>
              ))}
            </Reveal>
          </Reveal>
        </div>
      </section>

      <section id="district" className="relative isolate scroll-mt-28 overflow-hidden bg-stadium py-16 text-white lg:py-24">
        {darkBand}
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <SectionHeading
            tone="dark"
            eyebrow="District teams"
            title="Teams registered through district associations"
            description="District teams come onto this page the day their district association is approved and its first team is registered."
          />
          <div className="mt-10 grid gap-6 lg:grid-cols-[1.45fr_1fr]">
            <Reveal from="left" className="card-premium relative overflow-hidden rounded-[2rem] bg-white/[0.05] p-6 shadow-[0_40px_90px_rgba(4,15,42,0.45)] ring-1 ring-white/10 backdrop-blur sm:p-8">
              <div className="flex items-start gap-4">
                <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-white/10 text-gold ring-1 ring-white/20">
                  <Building2 className="size-6" aria-hidden="true" />
                </span>
                <div>
                  <h3 className="font-heading text-2xl font-bold">No district teams listed yet</h3>
                  <p className="mt-1.5 text-white/75">Four steps take a district from the form to the map.</p>
                </div>
              </div>

              <Reveal as="ol" stagger={110} className="mt-7 grid gap-3 sm:grid-cols-2">
                {districtSteps.map(({ icon: Icon, title, text }, i) => (
                  <li key={title} className="group relative flex gap-4 rounded-2xl bg-white/[0.05] p-4 ring-1 ring-white/10 transition duration-300 hover:bg-white/[0.09] hover:ring-gold/40">
                    <span className="grid size-10 shrink-0 place-items-center rounded-full bg-gold font-heading text-lg font-bold text-navy shadow-[0_0_0_5px_rgba(217,174,86,0.15)]">
                      {i + 1}
                    </span>
                    <span className="min-w-0">
                      <span className="flex items-center gap-2 font-bold text-white">
                        {title}
                        <Icon className="size-4 shrink-0 text-gold/80 transition-transform duration-300 group-hover:-rotate-6" aria-hidden="true" />
                      </span>
                      <span className="mt-0.5 block text-sm text-white/65">{text}</span>
                    </span>
                  </li>
                ))}
              </Reveal>

              <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <Link
                  href="/register/district"
                  className="group inline-flex items-center justify-center gap-2 rounded-full bg-gold px-6 py-3 font-bold text-navy shadow-[0_12px_28px_rgba(4,15,42,0.45)] transition hover:bg-gold-deep"
                >
                  Register your District Association
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                </Link>
                <Link
                  href="/register/team"
                  className="inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 font-bold text-white ring-1 ring-white/35 transition hover:bg-white/10 hover:ring-white/60"
                >
                  Register a team or club
                </Link>
              </div>
            </Reveal>

            <Reveal from="right" delay={120}>
              <Link
                href="/locations"
                className="group relative flex h-full flex-col overflow-hidden rounded-[2rem] bg-white p-6 text-ink shadow-[0_40px_90px_rgba(4,15,42,0.45)] transition duration-300 hover:-translate-y-1.5 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-gold sm:p-8"
              >
                <GroundWatermark className="absolute -bottom-20 -right-24 w-[420px] text-royal/[0.07] transition-transform duration-700 ease-out group-hover:-rotate-3 group-hover:scale-110" />
                <span className="relative grid size-12 place-items-center rounded-2xl bg-royal/10 text-royal transition duration-300 group-hover:-rotate-6 group-hover:bg-royal group-hover:text-white">
                  <MapPinned className="size-6" aria-hidden="true" />
                </span>
                <span className="relative mt-5 block font-heading text-2xl font-bold text-navy">Find your district on the map</span>
                <span className="relative mt-2 block text-slate-500">India › State › District › Locality, with the same three status colours as the District Tracker.</span>
                <span className="relative mt-6 flex flex-wrap gap-2">
                  {statusOrder.map((st) => (
                    <span key={st} className="inline-flex items-center gap-2 rounded-full bg-surface px-3 py-1 text-xs font-bold text-slate-600 ring-1 ring-line">
                      <span aria-hidden="true" className={`size-2 rounded-full ${statusMeta[st].dot}`} />
                      {statusMeta[st].label}
                    </span>
                  ))}
                </span>
                <span className="relative mt-8 flex items-center justify-between border-t border-line pt-5 lg:mt-auto">
                  <span className="font-bold text-royal">Open the map</span>
                  <span className="grid size-10 place-items-center rounded-full bg-surface text-royal ring-1 ring-line transition duration-300 group-hover:bg-royal group-hover:text-white group-hover:ring-royal">
                    <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
                  </span>
                </span>
              </Link>
            </Reveal>
          </div>
        </div>
      </section>

      <section id="officials" className="scroll-mt-28 bg-white py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <SectionHeading
            eyebrow="Officials"
            title="Umpires, scorers and coaches"
            description="The officials who run Super Seven matches. The federation is building its panel; two of its umpires are below."
          />
          <Reveal stagger={110} className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {officials.map((o) => (
              <OfficialCard key={o.id} official={o} />
            ))}
            <Link
              href="/careers"
              className="group relative isolate flex flex-col justify-between overflow-hidden rounded-3xl bg-stadium p-7 text-white shadow-[0_24px_50px_rgba(15,46,99,0.25)] transition duration-300 hover:-translate-y-1.5 hover:shadow-[0_32px_70px_rgba(15,46,99,0.35)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-gold sm:col-span-2 sm:p-9"
            >
              <GroundWatermark className="absolute -right-24 -top-16 -z-10 w-[520px] text-white/[0.07] transition-transform duration-700 ease-out group-hover:-rotate-3 group-hover:scale-110" />
              <span aria-hidden="true" className="absolute -bottom-24 -left-16 -z-10 size-72 rounded-full bg-gold/20 blur-[90px] motion-safe:animate-float-slow" />
              <span className="grid size-14 place-items-center rounded-2xl bg-gold text-navy shadow-[0_0_0_6px_rgba(217,174,86,0.15)] transition duration-300 group-hover:-rotate-6">
                <Whistle className="size-7" aria-hidden="true" />
              </span>
              <span className="mt-8 block">
                <span className="block text-[11px] font-bold uppercase tracking-[0.24em] text-gold">Officials wanted</span>
                <span className="mt-2 block font-heading text-3xl font-bold leading-tight sm:text-4xl">Join as an official</span>
                <span className="mt-3 block max-w-md text-white/75">
                  Umpires, scorers, coaches and coordinators are needed in every district. See the open roles and how to apply.
                </span>
              </span>
              <span className="mt-8 inline-flex items-center gap-2 self-start rounded-full bg-white/10 px-5 py-2.5 font-bold text-white ring-1 ring-white/30 transition group-hover:bg-gold group-hover:text-navy group-hover:ring-gold">
                Careers
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
              </span>
            </Link>
          </Reveal>
        </div>
      </section>
    </>
  );
}
