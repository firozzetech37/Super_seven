import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Building2, MapPinned, Whistle } from "lucide-react";
import { JumpLinks } from "@/components/fixtures/jump-links";
import { PageHeader } from "@/components/layout/page-header";
import { SectionHeading } from "@/components/layout/section-heading";
import { OfficialCard } from "@/components/teams/official-card";
import { StateUnitCard } from "@/components/teams/state-unit-card";
import { archiveTeams2014, officials, stateUnits } from "@/lib/data/teams";
import { Reveal } from "@/components/motion/reveal";

export const metadata: Metadata = {
  title: "Teams",
  description: "State units and their officials, district teams, and the umpires, scorers and coaches who run the matches.",
};

const jump = [
  { label: "State teams", href: "#state" },
  { label: "District teams", href: "#district" },
  { label: "Officials", href: "#officials" },
];

export default function TeamsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Door 1 of 7"
        title="Teams"
        description="State teams, district teams and the officials who run the matches."
        crumbs={[{ label: "Teams" }]}
        aside={<JumpLinks links={jump} />}
      />

      <section id="state" className="scroll-mt-28 bg-white py-14 lg:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <SectionHeading
            eyebrow="State teams"
            title="Nine state units"
            description="Presidents and secretaries as published in the SSCFI State Officials list. Changes come through the state units themselves."
            action={
              <Link href="/players" className="inline-flex items-center gap-2 font-bold text-royal underline-offset-4 hover:underline">
                Player directory
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            }
          />
          <Reveal stagger className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {stateUnits.map((u) => (
              <StateUnitCard key={u.id} unit={u} />
            ))}
          </Reveal>

          <div className="mt-14 rounded-3xl bg-surface p-6 ring-1 ring-line sm:p-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-royal">2014 archive</p>
                <h3 className="mt-2 font-heading text-2xl font-bold text-navy">The 24 teams of NCL S7 Amroha</h3>
                <p className="mt-1 text-[15px] text-slate-500">
                  National Cricket League Super 7, Abbasi Cricket Ground, 22–25 June 2014. Eight groups of three.
                </p>
              </div>
              <Link href="/fixtures#archive" className="inline-flex items-center gap-2 font-bold text-royal underline-offset-4 hover:underline">
                Results and fixtures
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            </div>
            <ul className="mt-6 flex flex-wrap gap-2">
              {archiveTeams2014.map((t) => (
                <li key={t} className="rounded-full bg-white px-4 py-1.5 text-sm font-bold text-navy ring-1 ring-line">
                  {t}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section id="district" className="scroll-mt-28 border-t border-line bg-surface py-14 lg:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <SectionHeading
            eyebrow="District teams"
            title="Teams registered through district associations"
            description="District teams come onto this page the day their district association is approved and its first team is registered."
          />
          <div className="mt-10 grid gap-5 lg:grid-cols-[1.4fr_1fr]">
            <div className="relative overflow-hidden rounded-3xl bg-[linear-gradient(150deg,#1c4fa0,#0f2e63_60%,#0b2550)] p-8 text-white shadow-[0_24px_50px_rgba(15,46,99,0.3)]">
              <span aria-hidden="true" className="pointer-events-none absolute -right-16 -top-16 size-56 rounded-full bg-white/10 blur-3xl" />
              <span className="grid size-12 place-items-center rounded-2xl bg-white/10 text-gold ring-1 ring-white/20">
                <Building2 className="size-6" aria-hidden="true" />
              </span>
              <h3 className="mt-5 font-heading text-2xl font-bold">No district teams listed yet</h3>
              <p className="mt-2 max-w-xl text-white/80">
                Four steps: submit the form, SSCFI reviews and calls back, a certificate or player ID is issued, and the
                district turns yellow and then green on the map.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Link
                  href="/register/district"
                  className="group inline-flex items-center gap-2 rounded-full bg-gold px-6 py-3 font-bold text-navy shadow transition hover:bg-gold-deep"
                >
                  Register your District Association
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                </Link>
                <Link
                  href="/register/team"
                  className="inline-flex items-center gap-2 rounded-full px-6 py-3 font-bold text-white ring-2 ring-white/60 transition hover:bg-white/10"
                >
                  Register a team or club
                </Link>
              </div>
            </div>
            <Link
              href="/locations"
              className="group flex flex-col justify-between rounded-3xl bg-white p-8 ring-1 ring-line transition hover:-translate-y-0.5 hover:shadow-[0_18px_40px_rgba(15,46,99,0.12)]"
            >
              <span className="grid size-12 place-items-center rounded-2xl bg-royal/10 text-royal">
                <MapPinned className="size-6" aria-hidden="true" />
              </span>
              <span className="mt-5 block font-heading text-2xl font-bold text-navy">Find your district on the map</span>
              <span className="mt-2 block text-slate-500">India › State › District › Locality, with the same three status colours as the District Tracker.</span>
              <span className="mt-6 inline-flex items-center gap-2 font-bold text-royal">
                Open the map
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
              </span>
            </Link>
          </div>
        </div>
      </section>

      <section id="officials" className="scroll-mt-28 bg-white py-14 lg:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <SectionHeading
            eyebrow="Officials"
            title="Umpires, scorers and coaches"
            description="The officials who run Super Seven matches. The federation is building its panel; two of its umpires are below."
          />
          <Reveal stagger className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {officials.map((o) => (
              <OfficialCard key={o.id} official={o} />
            ))}
            <Link
              href="/careers"
              className="group flex flex-col justify-between rounded-3xl bg-surface p-6 ring-1 ring-dashed ring-royal/40 transition hover:bg-white hover:ring-royal sm:col-span-2"
            >
              <span className="grid size-12 place-items-center rounded-2xl bg-royal text-white">
                <Whistle className="size-6" aria-hidden="true" />
              </span>
              <span className="mt-6 block font-heading text-2xl font-bold text-navy">Join as an official</span>
              <span className="mt-2 block text-slate-500">
                Umpires, scorers, coaches and coordinators are needed in every district. See the open roles and how to apply.
              </span>
              <span className="mt-6 inline-flex items-center gap-2 font-bold text-royal">
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
