import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Database, Info, Map as MapIcon, Palette } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { SectionHeading } from "@/components/layout/section-heading";
import { DrillTrail } from "@/components/locations/drill-trail";
import { GlassPanel, MapBand } from "@/components/locations/map-band";
import { PanelLink } from "@/components/locations/panel-link";
import { PlaceDirectory } from "@/components/locations/place-directory";
import { StatusTiles } from "@/components/locations/status-tiles";
import { MapStage } from "@/components/map/map-stage";
import { CountUp } from "@/components/motion/count-up";
import { Reveal } from "@/components/motion/reveal";
import { getIndiaMap, states } from "@/lib/geo/load";
import { stateShapes } from "@/lib/geo/shapes";
import { countByStatus, getStatusMap, stateStatus } from "@/lib/geo/status";

export const metadata: Metadata = {
  title: "Locations",
  description: "Find us on the map: India › State › District › Locality. Every state and all 737 districts, coloured by status.",
};

const notes = [
  {
    icon: MapIcon,
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

const rank = { onboarded: 0, talks: 1, unreached: 2 } as const;

export default async function LocationsPage() {
  const [india, statuses] = await Promise.all([getIndiaMap(), getStatusMap()]);
  const districtsOf = new Map(states.map((s) => [s.slug, s.districts]));
  const shapes = stateShapes(india, statuses).map((s) => {
    const n = districtsOf.get(s.slug);
    return n ? { ...s, note: `${n} district${n === 1 ? "" : "s"}` } : s;
  });
  const counts = countByStatus(states, (s) => stateStatus(statuses, s.slug));
  const totalDistricts = states.reduce((n, s) => n + s.districts, 0);
  const active = states
    .filter((s) => stateStatus(statuses, s.slug) !== "unreached")
    .sort((a, b) => rank[stateStatus(statuses, a.slug)] - rank[stateStatus(statuses, b.slug)] || a.name.localeCompare(b.name));

  return (
    <>
      <PageHeader
        eyebrow="Door 6 · Locations"
        title="Find us on the map"
        description="Four taps: India › State › District › Locality. Real geographic maps, not a family tree, and the India map stays faded behind every step so nobody gets lost."
        crumbs={[{ label: "Locations" }]}
        aside={
          <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl bg-white/15 ring-1 ring-white/15 backdrop-blur">
            {[
              { n: states.length, label: "States and UTs" },
              { n: totalDistricts, label: "Districts" },
            ].map(({ n, label }) => (
              <div key={label} className="flex flex-col-reverse bg-navy/60 px-6 py-4 text-center">
                <dt className="mt-1 text-[10px] font-bold uppercase tracking-[0.2em] text-white/60">{label}</dt>
                <dd className="font-heading text-3xl font-bold text-gold">
                  <CountUp value={n} />
                </dd>
              </div>
            ))}
          </dl>
        }
      />

      <MapBand>
        <DrillTrail trail={[{ label: "All of India" }]} />
        <div className="mt-8 grid gap-6 lg:mt-10 lg:grid-cols-[1fr_400px] lg:items-start lg:gap-8">
          <Reveal from="scale" className="lg:sticky lg:top-24">
            <MapStage map={india} shapes={shapes} title="Map of India: select a state to open it" sample={statuses.sample} hint="Hover or tap a state" pins />
          </Reveal>

          <Reveal delay={120} from="right">
            <GlassPanel>
              <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-gold">Step 1 · India</p>
              <h2 className="mt-2 font-heading text-3xl font-bold">Tap any state</h2>
              <p className="mt-2 text-white/70">Colours show where Super Seven is played. Hover for the name; tap to open the state and its districts.</p>
              <StatusTiles counts={counts} caption="States and union territories" className="mt-5" />
              {active.length ? (
                <>
                  <p className="mt-6 text-[11px] font-bold uppercase tracking-[0.2em] text-white/50">Where we are active</p>
                  <Reveal as="ul" stagger={60} className="mt-3 max-h-[19rem] space-y-2 overflow-y-auto pr-1 [scrollbar-width:thin]">
                    {active.map((s) => (
                      <li key={s.slug}>
                        <PanelLink href={`/locations/${s.slug}`} name={s.name} status={stateStatus(statuses, s.slug)} meta={`${s.districts} district${s.districts === 1 ? "" : "s"}`} />
                      </li>
                    ))}
                  </Reveal>
                </>
              ) : null}
              <Link
                href="/register/district"
                className="group mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-gold px-5 py-3 font-bold text-navy shadow-[0_12px_28px_rgba(4,15,42,0.45)] transition hover:bg-gold-deep"
              >
                Register your District Association
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
              </Link>
              {statuses.sample ? (
                <p className="mt-4 flex items-start gap-2 text-xs text-white/55">
                  <Info className="mt-px size-3.5 shrink-0 text-gold/80" aria-hidden="true" />
                  Colours are sample data from the concept until SSCFI records the first real district status.
                </p>
              ) : null}
            </GlassPanel>
          </Reveal>
        </div>
      </MapBand>

      <section className="bg-surface py-14 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <SectionHeading eyebrow="Every state" title="36 states and union territories" description="Each opens to its districts. Filter by colour or search by name." />
          <div className="mt-8">
            <PlaceDirectory
              noun={{ one: "state", many: "states" }}
              items={states.map((s) => ({
                slug: s.slug,
                name: s.name,
                href: `/locations/${s.slug}`,
                status: stateStatus(statuses, s.slug),
                meta: `${s.districts} district${s.districts === 1 ? "" : "s"}`,
              }))}
            />
          </div>
        </div>
      </section>

      <section className="border-t border-line bg-white py-14 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <SectionHeading eyebrow="How the map works" title="Built on real data, not drawings" />
          <Reveal as="ul" stagger={110} className="mt-10 grid gap-5 md:grid-cols-3">
            {notes.map(({ icon: Icon, title, text }, i) => (
              <li
                key={title}
                className="group card-premium relative overflow-hidden rounded-3xl bg-surface p-7 ring-1 ring-line transition duration-300 hover:-translate-y-1 hover:bg-white hover:shadow-[0_24px_50px_rgba(15,46,99,0.12)]"
              >
                <span aria-hidden="true" className="pointer-events-none absolute -right-2 -top-6 font-heading text-[7rem] font-bold leading-none text-navy/[0.04]">
                  {i + 1}
                </span>
                <span className="relative grid size-12 place-items-center rounded-2xl bg-royal/10 text-royal transition-colors duration-300 group-hover:bg-royal group-hover:text-white">
                  <Icon className="size-5" aria-hidden="true" />
                </span>
                <h3 className="relative mt-5 font-heading text-xl font-bold text-navy">{title}</h3>
                <p className="relative mt-2 text-[15px] leading-relaxed text-slate-500">{text}</p>
              </li>
            ))}
          </Reveal>
        </div>
      </section>
    </>
  );
}
