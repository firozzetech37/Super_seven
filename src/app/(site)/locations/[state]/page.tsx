import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Info, Sprout } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { PageSkeleton } from "@/components/layout/page-skeleton";
import { SectionHeading } from "@/components/layout/section-heading";
import { DrillTrail } from "@/components/locations/drill-trail";
import { GlassPanel, MapBand } from "@/components/locations/map-band";
import { PanelLink } from "@/components/locations/panel-link";
import { PlaceDirectory } from "@/components/locations/place-directory";
import { StatusTiles } from "@/components/locations/status-tiles";
import { MapStage } from "@/components/map/map-stage";
import { StatusChip } from "@/components/map/status-dot";
import { Reveal } from "@/components/motion/reveal";
import { getDistrictList, getIndiaMap, getStateMap, stateBySlug, states } from "@/lib/geo/load";
import { districtShapes, stateShapes } from "@/lib/geo/shapes";
import { countByStatus, districtStatus, getStatusMap, stateStatus } from "@/lib/geo/status";

export async function generateStaticParams() {
  return states.map((s) => ({ state: s.slug }));
}

export async function generateMetadata({ params }: PageProps<"/locations/[state]">): Promise<Metadata> {
  const { state } = await params;
  const info = stateBySlug.get(state);
  if (!info) return { title: "Locations" };
  return {
    title: `${info.name} on the map`,
    description: `Super Seven cricket in ${info.name}: all ${info.districts} districts coloured by status, with district associations and localities.`,
  };
}

const rank = { onboarded: 0, talks: 1, unreached: 2 } as const;

/** Params are URL data under Cache Components: the shell renders instantly and the page body streams in. */
export default function StatePage(props: PageProps<"/locations/[state]">) {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <StatePageBody params={props.params} />
    </Suspense>
  );
}

async function StatePageBody({ params }: { params: PageProps<"/locations/[state]">["params"] }) {
  const { state } = await params;
  const info = stateBySlug.get(state);
  if (!info) notFound();

  const [map, india, statuses, districts] = await Promise.all([getStateMap(state), getIndiaMap(), getStatusMap(), getDistrictList(state)]);
  if (!map) notFound();

  const shapes = districtShapes(map, statuses, info.code, state);
  const statusOf = (slug: string) => districtStatus(statuses, info.code, slug);
  const counts = countByStatus(districts, (d) => statusOf(d.slug));
  const status = stateStatus(statuses, state);
  const active = districts
    .filter((d) => statusOf(d.slug) !== "unreached")
    .sort((a, b) => rank[statusOf(a.slug)] - rank[statusOf(b.slug)] || a.name.localeCompare(b.name));
  const plural = info.districts === 1 ? "district" : "districts";

  return (
    <>
      <PageHeader
        eyebrow="2 · State"
        title={info.name}
        description={`${info.districts} ${plural}. ${counts.onboarded} onboarded, ${counts.talks} in discussion, ${counts.unreached} not reached yet. Tap a district to see its localities.`}
        crumbs={[{ label: "Locations", href: "/locations" }, { label: info.name }]}
        aside={
          <div className="flex items-center gap-4 rounded-2xl bg-white/10 px-5 py-4 ring-1 ring-white/15 backdrop-blur">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/60">State status</p>
              <StatusChip status={status} live={status === "onboarded"} className="mt-2" />
            </div>
            <span aria-hidden="true" className="h-10 w-px bg-white/15" />
            <div className="text-center">
              <p className="font-heading text-3xl font-bold leading-none text-gold">{info.districts}</p>
              <p className="mt-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-white/60">{plural}</p>
            </div>
          </div>
        }
      />

      <MapBand>
        <DrillTrail trail={[{ label: "All of India", href: "/locations" }, { label: info.name }]} />
        <div className="mt-8 grid gap-6 lg:mt-10 lg:grid-cols-[1fr_400px] lg:items-start lg:gap-8">
          <Reveal from="scale" className="lg:sticky lg:top-24">
            <MapStage
              map={map}
              shapes={shapes}
              title={`Map of ${info.name}: select a district to open it`}
              labels={districts.length <= 40 ? "all" : "none"}
              backdrop={{ map: india, shapes: stateShapes(india, statuses, false), highlight: state }}
              sample={statuses.sample}
              hint="Hover or tap a district"
              pins
            />
          </Reveal>

          <Reveal delay={120} from="right">
            <GlassPanel>
              <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-gold">
                {info.code} · {info.districts} {plural}
              </p>
              <h2 className="mt-2 font-heading text-3xl font-bold">Tap a district</h2>
              <p className="mt-2 text-white/70">Each district opens to its towns, grounds and the people to contact.</p>
              <StatusTiles counts={counts} caption={`Districts of ${info.name}`} className="mt-5" />

              {active.length ? (
                <>
                  <p className="mt-6 text-[11px] font-bold uppercase tracking-[0.2em] text-white/50">Where we are active</p>
                  <Reveal as="ul" stagger={60} className="mt-3 max-h-[19rem] space-y-2 overflow-y-auto pr-1 [scrollbar-width:thin]">
                    {active.map((d) => (
                      <li key={d.slug}>
                        <PanelLink href={`/locations/${state}/${d.slug}`} name={d.name} status={statusOf(d.slug)} />
                      </li>
                    ))}
                  </Reveal>
                </>
              ) : (
                <div className="mt-6 flex items-start gap-3 rounded-2xl bg-white/[0.05] p-4 border border-dashed border-white/20">
                  <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-gold/15 text-gold">
                    <Sprout className="size-5" aria-hidden="true" />
                  </span>
                  <p className="text-sm text-white/75">
                    <span className="block font-bold text-white">No district association yet</span>
                    Nobody in {info.name} has registered so far. The first association turns its district green.
                  </p>
                </div>
              )}

              <Link
                href="/register/district"
                className="group mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-gold px-5 py-3 font-bold text-navy shadow-[0_12px_28px_rgba(4,15,42,0.45)] transition hover:bg-gold-deep"
              >
                Register your District Association
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
              </Link>
              <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                <Link href="/locations" className="group inline-flex items-center gap-2 text-sm font-bold text-white/70 transition hover:text-white">
                  <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-1" aria-hidden="true" />
                  Back to India
                </Link>
                {statuses.sample ? (
                  <span className="inline-flex items-center gap-1.5 text-xs text-white/50">
                    <Info className="size-3.5 text-gold/80" aria-hidden="true" />
                    Sample colours
                  </span>
                ) : null}
              </div>
            </GlassPanel>
          </Reveal>
        </div>
      </MapBand>

      <section className="bg-surface py-14 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <SectionHeading
            eyebrow="Districts"
            title={`Every district of ${info.name}`}
            description="Green districts have an onboarded association, yellow ones are in discussion, pink ones are not reached yet."
          />
          <div className="mt-8">
            <PlaceDirectory
              noun={{ one: "district", many: "districts" }}
              items={districts.map((d) => ({ slug: d.slug, name: d.name, href: `/locations/${state}/${d.slug}`, status: statusOf(d.slug) }))}
            />
          </div>
        </div>
      </section>
    </>
  );
}
