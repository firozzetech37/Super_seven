import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Database, Map, Palette } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { SectionHeading } from "@/components/layout/section-heading";
import { MapStage } from "@/components/map/map-stage";
import { StatusDot } from "@/components/map/status-dot";
import { Reveal } from "@/components/motion/reveal";
import { statusMeta, type Status } from "@/lib/data/locations";
import { getIndiaMap, states } from "@/lib/geo/load";
import { stateShapes } from "@/lib/geo/shapes";
import { countByStatus, getStatusMap, stateStatus } from "@/lib/geo/status";

export const metadata: Metadata = {
  title: "Locations",
  description: "Find us on the map: India › State › District › Locality. Every state and all 737 districts, coloured by status.",
};

const notes = [
  {
    icon: Map,
    title: "Real boundaries",
    text: "36 states and union territories and 737 districts, drawn from public boundary data and simplified so every map loads in a blink. Outlines are checked against Survey of India maps before launch.",
  },
  {
    icon: Palette,
    title: "Same colours as the tracker",
    text: "Onboarded, in discussion and not reached use the same three colours and the same data as SSCFI's internal District Tracker.",
  },
  {
    icon: Database,
    title: "Live from the database",
    text: "Every approved district association turns its district yellow, then green, with nothing drawn by hand. Until the first real status is recorded, the concept's sample colours are shown and labelled.",
  },
];

export default async function LocationsPage() {
  const [india, statuses] = await Promise.all([getIndiaMap(), getStatusMap()]);
  const shapes = stateShapes(india, statuses);
  const counts = countByStatus(states, (s) => stateStatus(statuses, s.slug));
  const active = states.filter((s) => stateStatus(statuses, s.slug) !== "unreached").sort((a, b) => a.name.localeCompare(b.name));

  return (
    <>
      <PageHeader
        eyebrow="Door 6 · Locations"
        title="Find us on the map"
        description="Four taps: India › State › District › Locality. Real geographic maps, not a family tree, and the India map stays faded behind every step so nobody gets lost."
        crumbs={[{ label: "Locations" }]}
        aside={
          <ul className="flex flex-wrap gap-2">
            {(Object.keys(statusMeta) as Status[]).map((s) => (
              <li key={s} className={`${statusMeta[s].chip} rounded-full px-4 py-1.5 text-sm font-bold`}>
                {statusMeta[s].label}
              </li>
            ))}
          </ul>
        }
      />

      <section className="relative isolate overflow-hidden bg-navy-hero py-10 text-white lg:py-14">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-[radial-gradient(55%_70%_at_30%_40%,rgba(44,103,196,0.5),transparent_70%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(120%_90%_at_50%_120%,rgba(5,16,45,0.8),transparent_60%)]" />
        </div>
        <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[1fr_380px] lg:items-start">
          <Reveal>
            <MapStage map={india} shapes={shapes} title="Map of India: tap a state" sample={statuses.sample} />
          </Reveal>

          <Reveal delay={120} as="section" className="rounded-3xl bg-navy/70 p-6 ring-1 ring-white/15 backdrop-blur">
            <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-gold">1 · India</p>
            <h2 className="mt-2 font-heading text-3xl font-bold">Tap any state</h2>
            <p className="mt-2 text-white/80">Colours show where Super Seven is played. Hover for the name; tap to open the state and its districts.</p>
            <dl className="mt-5 grid grid-cols-3 gap-2 text-center">
              {(Object.keys(statusMeta) as Status[]).map((s) => (
                <div key={s} className={`${statusMeta[s].chip} rounded-xl px-2 py-2.5`}>
                  <dd className="font-heading text-2xl font-bold">{counts[s]}</dd>
                  <dt className="text-[11px] font-bold">{statusMeta[s].label}</dt>
                </div>
              ))}
            </dl>
            {active.length ? (
              <ul className="mt-5 space-y-1">
                {active.map((s) => (
                  <li key={s.slug}>
                    <Link
                      href={`/locations/${s.slug}`}
                      className="group flex items-center gap-3 rounded-xl px-3 py-2 transition hover:bg-white/10"
                    >
                      <StatusDot status={stateStatus(statuses, s.slug)} />
                      <span className="flex-1 font-bold">{s.name}</span>
                      <span className="text-xs text-white/60">{s.districts} district{s.districts === 1 ? "" : "s"}</span>
                      <ArrowRight className="size-4 text-white/50 transition group-hover:translate-x-1 group-hover:text-gold" aria-hidden="true" />
                    </Link>
                  </li>
                ))}
              </ul>
            ) : null}
            <Link
              href="/register/district"
              className="group mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-gold px-5 py-3 font-bold text-navy transition hover:bg-gold-deep"
            >
              Register your District Association
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
            </Link>
            {statuses.sample ? (
              <p className="mt-4 text-xs italic text-white/60">Colours are sample data from the concept until SSCFI records the first real district status.</p>
            ) : null}
          </Reveal>
        </div>
      </section>

      <section className="bg-white py-14 lg:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <SectionHeading eyebrow="Every state" title="36 states and union territories" description="Each opens to its districts. Numbers are district counts." />
          <ul className="mt-8 grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {states.map((s, i) => (
              <Reveal as="li" key={s.slug} delay={Math.min(i, 12) * 30}>
                <Link
                  href={`/locations/${s.slug}`}
                  className="group card-premium flex items-center gap-3 rounded-2xl bg-surface px-4 py-3 ring-1 ring-line transition hover:bg-white hover:shadow-[0_12px_30px_rgba(15,46,99,0.1)]"
                >
                  <StatusDot status={stateStatus(statuses, s.slug)} className="ring-line" />
                  <span className="flex-1 font-bold text-navy">{s.name}</span>
                  <span className="text-xs font-bold text-slate-400">{s.districts}</span>
                  <ArrowRight className="size-4 text-slate-300 transition group-hover:translate-x-1 group-hover:text-royal" aria-hidden="true" />
                </Link>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      <section className="border-t border-line bg-surface py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <SectionHeading eyebrow="How the map works" title="Built on real data, not drawings" />
          <ul className="mt-10 grid gap-5 md:grid-cols-3">
            {notes.map(({ icon: Icon, title, text }, i) => (
              <Reveal as="li" key={title} delay={i * 90} className="rounded-2xl bg-white p-6 ring-1 ring-line">
                <span className="grid size-11 place-items-center rounded-xl bg-royal/10 text-royal">
                  <Icon className="size-5" aria-hidden="true" />
                </span>
                <h3 className="mt-4 font-heading text-xl font-bold text-navy">{title}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-slate-500">{text}</p>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
