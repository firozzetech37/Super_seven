import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { PageSkeleton } from "@/components/layout/page-skeleton";
import { SectionHeading } from "@/components/layout/section-heading";
import { MapStage } from "@/components/map/map-stage";
import { StatusChip, StatusDot } from "@/components/map/status-dot";
import { Reveal } from "@/components/motion/reveal";
import { statusMeta, type Status } from "@/lib/data/locations";
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
  const counts = countByStatus(districts, (d) => districtStatus(statuses, info.code, d.slug));
  const status = stateStatus(statuses, state);

  return (
    <>
      <PageHeader
        eyebrow="2 · State"
        title={info.name}
        description={`${info.districts} districts. ${counts.onboarded} onboarded, ${counts.talks} in discussion, ${counts.unreached} not reached yet. Tap a district to see its localities.`}
        crumbs={[{ label: "Locations", href: "/locations" }, { label: info.name }]}
        aside={
          <div className="flex items-center gap-3 rounded-2xl bg-white/10 px-5 py-3 ring-1 ring-white/15">
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/70">State status</span>
            <StatusChip status={status} />
          </div>
        }
      />

      <section className="relative isolate overflow-hidden bg-navy-hero py-10 text-white lg:py-14">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-[radial-gradient(55%_70%_at_30%_40%,rgba(44,103,196,0.5),transparent_70%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(120%_90%_at_50%_120%,rgba(5,16,45,0.8),transparent_60%)]" />
        </div>
        <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[1fr_380px] lg:items-start">
          <Reveal>
            <MapStage
              map={map}
              shapes={shapes}
              title={`Map of ${info.name}: tap a district`}
              labels={districts.length <= 40 ? "all" : "none"}
              backdrop={{ map: india, shapes: stateShapes(india, statuses, false), highlight: state }}
              sample={statuses.sample}
            />
          </Reveal>

          <Reveal delay={120} as="section" className="rounded-3xl bg-navy/70 p-6 ring-1 ring-white/15 backdrop-blur">
            <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-gold">{info.code} · {info.districts} districts</p>
            <h2 className="mt-2 font-heading text-3xl font-bold">Tap a district</h2>
            <dl className="mt-4 grid grid-cols-3 gap-2 text-center">
              {(Object.keys(statusMeta) as Status[]).map((s) => (
                <div key={s} className={`${statusMeta[s].chip} rounded-xl px-2 py-2.5`}>
                  <dd className="font-heading text-2xl font-bold">{counts[s]}</dd>
                  <dt className="text-[11px] font-bold">{statusMeta[s].label}</dt>
                </div>
              ))}
            </dl>
            <ol className="mt-4 grid max-h-80 grid-cols-2 gap-x-3 gap-y-0.5 overflow-y-auto pr-1 text-sm">
              {districts.map((d) => (
                <li key={d.slug}>
                  <Link href={`/locations/${state}/${d.slug}`} className="flex items-center gap-2 rounded-lg px-2 py-1.5 transition hover:bg-white/10">
                    <StatusDot status={districtStatus(statuses, info.code, d.slug)} />
                    <span className="truncate">{d.name}</span>
                  </Link>
                </li>
              ))}
            </ol>
            <Link
              href="/register/district"
              className="group mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-gold px-5 py-3 font-bold text-navy transition hover:bg-gold-deep"
            >
              Register your District Association
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
            </Link>
            <Link href="/locations" className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-white/70 transition hover:text-white">
              ← Back to India
            </Link>
          </Reveal>
        </div>
      </section>

      <section className="bg-white py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <SectionHeading eyebrow="Districts" title={`Every district of ${info.name}`} description="Green districts have an onboarded association, yellow ones are in discussion, pink ones are not reached yet." />
          <ul className="mt-8 grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {districts.map((d, i) => (
              <Reveal as="li" key={d.slug} delay={Math.min(i, 12) * 25}>
                <Link
                  href={`/locations/${state}/${d.slug}`}
                  className="group card-premium flex items-center gap-3 rounded-2xl bg-surface px-4 py-3 ring-1 ring-line transition hover:bg-white hover:shadow-[0_12px_30px_rgba(15,46,99,0.1)]"
                >
                  <StatusDot status={districtStatus(statuses, info.code, d.slug)} className="ring-line" />
                  <span className="flex-1 font-bold text-navy">{d.name}</span>
                  <ArrowRight className="size-4 text-slate-300 transition group-hover:translate-x-1 group-hover:text-royal" aria-hidden="true" />
                </Link>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
