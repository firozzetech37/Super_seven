import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Building2, CalendarDays, Info, Mail, MapPin, Phone, UserRound } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { PageSkeleton } from "@/components/layout/page-skeleton";
import { SectionHeading } from "@/components/layout/section-heading";
import { DrillTrail } from "@/components/locations/drill-trail";
import { GlassPanel, MapBand } from "@/components/locations/map-band";
import { PlaceDirectory } from "@/components/locations/place-directory";
import { RegisterBand } from "@/components/locations/register-band";
import { Choropleth } from "@/components/map/choropleth";
import { GroundMap } from "@/components/map/ground-map";
import { StatusChip } from "@/components/map/status-dot";
import { CountUp } from "@/components/motion/count-up";
import { Reveal } from "@/components/motion/reveal";
import { getDistrictList, getStateMap, stateByCode, stateBySlug } from "@/lib/geo/load";
import { getLocalities, getLocality, listLocalityParams } from "@/lib/geo/localities";
import { districtShapes } from "@/lib/geo/shapes";
import { getStatusMap } from "@/lib/geo/status";

export async function generateStaticParams() {
  const list = await listLocalityParams();
  return list
    .map((l) => ({ state: stateByCode.get(l.stateCode)?.slug ?? "", district: l.districtSlug, locality: l.slug }))
    .filter((p) => p.state);
}

export async function generateMetadata({ params }: PageProps<"/locations/[state]/[district]/[locality]">): Promise<Metadata> {
  const { state, district, locality } = await params;
  const info = stateBySlug.get(state);
  const loc = info ? await getLocality(info.code, district, locality) : null;
  if (!info || !loc) return { title: "Locations" };
  return { title: `${loc.name}, ${info.name}`, description: `Super Seven cricket in ${loc.name}: who we are, the ground, how to reach us and the next fixture.` };
}

/** Params are URL data under Cache Components: the shell renders instantly and the page body streams in. */
export default function LocalityPage(props: PageProps<"/locations/[state]/[district]/[locality]">) {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <LocalityPageBody params={props.params} />
    </Suspense>
  );
}

async function LocalityPageBody({ params }: { params: PageProps<"/locations/[state]/[district]/[locality]">["params"] }) {
  const { state, district, locality } = await params;
  const info = stateBySlug.get(state);
  if (!info) notFound();
  const d = (await getDistrictList(state)).find((x) => x.slug === district);
  const loc = await getLocality(info.code, district, locality);
  if (!d || !loc) notFound();

  const [map, statuses, siblings] = await Promise.all([getStateMap(state), getStatusMap(), getLocalities(info.code, district)]);
  const shapes = map ? districtShapes(map, statuses, info.code, state) : [];
  const here = shapes.find((s) => s.slug === district);
  const others = siblings.filter((l) => l.slug !== loc.slug);

  const rows = [
    { icon: Building2, label: "Association", value: loc.association },
    { icon: MapPin, label: "Ground", value: loc.groundName ? `${loc.groundName}${loc.groundAddress ? `, ${loc.groundAddress}` : ""}` : null },
    { icon: UserRound, label: "Contact person", value: loc.contactName },
    { icon: Phone, label: "Phone", value: loc.contactPhone, href: loc.contactPhone ? `tel:${loc.contactPhone}` : undefined },
    { icon: Mail, label: "Email", value: loc.contactEmail, href: loc.contactEmail ? `mailto:${loc.contactEmail}` : undefined },
    { icon: CalendarDays, label: "Next fixture", value: loc.nextFixture },
  ];
  const known = rows.filter((r) => r.value);
  const hasCounts = loc.teamsCount != null;

  return (
    <>
      <PageHeader
        eyebrow="4 · Locality"
        title={loc.name}
        description={`${d.name} district, ${info.name}. Who we are here, where we play and how to reach us.`}
        crumbs={[
          { label: "Locations", href: "/locations" },
          { label: info.name, href: `/locations/${state}` },
          { label: d.name, href: `/locations/${state}/${district}` },
          { label: loc.name },
        ]}
        aside={
          <div className="flex items-center gap-4 rounded-2xl bg-white/10 px-5 py-4 ring-1 ring-white/15 backdrop-blur">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/60">Status</p>
              <StatusChip status={loc.status} live={loc.status === "onboarded"} className="mt-2" />
            </div>
            {loc.sample ? (
              <>
                <span aria-hidden="true" className="h-10 w-px bg-white/15" />
                <span className="inline-flex items-center gap-1.5 rounded-full bg-gold/15 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-gold ring-1 ring-gold/40">
                  <span aria-hidden="true" className="size-1.5 rounded-full bg-gold" />
                  Sample data
                </span>
              </>
            ) : null}
          </div>
        }
      />

      <MapBand>
        <DrillTrail
          trail={[
            { label: "All of India", href: "/locations" },
            { label: info.name, href: `/locations/${state}` },
            { label: d.name, href: `/locations/${state}/${district}` },
            { label: loc.name },
          ]}
        />
        <div className="mt-8 grid gap-6 lg:mt-10 lg:grid-cols-[1.05fr_1fr] lg:items-start lg:gap-8">
          {/* Locality card */}
          <Reveal from="left" className="relative overflow-hidden rounded-[2rem] bg-white text-ink shadow-[0_40px_90px_rgba(4,15,42,0.5)] ring-1 ring-white/20">
            <div aria-hidden="true" className="h-1.5 bg-gradient-to-r from-gold via-gold-deep to-gold" />
            <div className="p-6 sm:p-8">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-royal">Locality card</p>
                  <h2 className="mt-2 font-heading text-3xl font-bold text-navy sm:text-4xl">{loc.name}</h2>
                  <p className="mt-1 text-sm text-slate-500">
                    {d.name} district, {info.name}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <StatusChip status={loc.status} live={loc.status === "onboarded"} />
                  {loc.sample ? (
                    <span className="rounded-full bg-ball/10 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-ball">Sample data</span>
                  ) : null}
                </div>
              </div>

              {hasCounts ? (
                <dl className="mt-6 grid grid-cols-2 gap-3">
                  {[
                    { n: loc.teamsCount ?? 0, label: "Teams" },
                    { n: loc.playersCount ?? 0, label: "Players" },
                  ].map(({ n, label }) => (
                    <div key={label} className="relative flex flex-col-reverse overflow-hidden rounded-2xl bg-stadium px-5 py-4 text-white">
                      <span aria-hidden="true" className="absolute inset-x-5 top-0 h-0.5 rounded-full bg-gold" />
                      <dt className="mt-1 text-[11px] font-bold uppercase tracking-[0.18em] text-white/65">{label}</dt>
                      <dd className="font-heading text-4xl font-bold text-gold">
                        <CountUp value={n} />
                      </dd>
                    </div>
                  ))}
                </dl>
              ) : null}

              {known.length ? (
                <Reveal as="dl" stagger={70} className="mt-6 divide-y divide-line">
                  {known.map(({ icon: Icon, label, value, href }) => (
                    <div key={label} className="group flex items-start gap-4 py-3.5">
                      <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-royal/10 text-royal transition-colors duration-300 group-hover:bg-royal group-hover:text-white">
                        <Icon className="size-[18px]" aria-hidden="true" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <dt className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500">{label}</dt>
                        <dd className="mt-0.5 break-words font-bold text-navy">
                          {href ? (
                            <a href={href} className="underline decoration-gold/60 decoration-2 underline-offset-4 transition hover:text-royal hover:decoration-royal">
                              {value}
                            </a>
                          ) : (
                            value
                          )}
                        </dd>
                      </div>
                    </div>
                  ))}
                </Reveal>
              ) : (
                <div className="mt-6 rounded-2xl border border-dashed border-line bg-surface p-5 text-slate-600">
                  Association, teams, ground, contact person and next fixture for {loc.name} appear here once the local association registers.
                </div>
              )}

              {loc.sample ? (
                <p className="mt-4 flex items-start gap-2 text-xs text-slate-500">
                  <Info className="mt-px size-3.5 shrink-0 text-gold-deep" aria-hidden="true" />
                  Every field on this card is placeholder data from the concept until the local association registers.
                </p>
              ) : null}

              <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <Link
                  href="/contact"
                  className="group inline-flex items-center justify-center gap-2 rounded-full bg-gold px-6 py-3 font-bold text-navy shadow-[0_12px_24px_rgba(201,155,67,0.35)] transition hover:bg-gold-deep"
                >
                  Contact
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                </Link>
                <Link href="/register/team" className="inline-flex items-center justify-center gap-2 rounded-full bg-navy px-6 py-3 font-bold text-white transition hover:bg-royal">
                  Register a team here
                </Link>
              </div>
            </div>
          </Reveal>

          {/* Ground and where it is */}
          <div className="grid gap-6">
            <Reveal delay={120} from="right">
              {loc.lat != null && loc.lng != null ? (
                <GroundMap lat={loc.lat} lng={loc.lng} name={loc.groundName ?? loc.name} tone="dark" />
              ) : (
                <GlassPanel className="flex aspect-[16/10] flex-col items-center justify-center text-center">
                  <span className="relative grid size-14 place-items-center rounded-2xl bg-gold/15 text-gold">
                    <span aria-hidden="true" className="absolute inset-0 rounded-2xl ring-1 ring-gold/40 motion-safe:animate-ping [animation-duration:2.6s]" />
                    <MapPin className="size-7" aria-hidden="true" />
                  </span>
                  <h3 className="mt-4 font-heading text-xl font-bold">Ground location to be added</h3>
                  <p className="mt-2 max-w-sm text-sm text-white/65">A street map with a pin appears here once the local association shares the ground&apos;s location.</p>
                </GlassPanel>
              )}
            </Reveal>

            {map && here ? (
              <Reveal delay={200} from="right">
                <GlassPanel className="grid items-center gap-5 sm:grid-cols-[200px_1fr]">
                  <div className="relative mx-auto w-full max-w-[220px]">
                    <Choropleth map={map} shapes={shapes} title={`Map of ${info.name} with ${d.name} highlighted`} highlight={district} highlightColor="#d9ae56" dimOpacity={0.82} />
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2"
                      style={{ left: `${(here.cx / map.width) * 100}%`, top: `${(here.cy / map.height) * 100}%` }}
                    >
                      <span className="absolute -inset-1.5 rounded-full bg-gold/50 motion-safe:animate-ping [animation-duration:2s]" />
                      <span className="relative block size-3 rounded-full bg-gold shadow-[0_0_14px_rgba(217,174,86,0.9)] ring-2 ring-white" />
                    </span>
                  </div>
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-gold">Where it is</p>
                    <h3 className="mt-2 font-heading text-2xl font-bold">
                      {d.name}, {info.name}
                    </h3>
                    <p className="mt-2 text-sm text-white/65">The gold pin marks {d.name} district. Tap any other district to explore it.</p>
                    <Link href={`/locations/${state}/${district}`} className="group mt-4 inline-flex items-center gap-2 text-sm font-bold text-white/75 transition hover:text-white">
                      <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-1" aria-hidden="true" />
                      Back to {d.name}
                    </Link>
                  </div>
                </GlassPanel>
              </Reveal>
            ) : null}
          </div>
        </div>
      </MapBand>

      <section className="bg-surface py-14 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          {others.length ? (
            <>
              <SectionHeading
                eyebrow={`More in ${d.name}`}
                title="Nearby localities"
                description={others.some((l) => l.sample) ? "Sample localities from the concept, shown until the local association lists its own." : undefined}
              />
              <div className="mb-14 mt-8">
                <PlaceDirectory
                  noun={{ one: "locality", many: "localities" }}
                  items={others.map((l) => ({
                    slug: l.slug,
                    name: l.name,
                    href: `/locations/${state}/${district}/${l.slug}`,
                    status: l.status,
                    meta: l.groundName ? "Ground listed" : l.sample ? "Sample" : undefined,
                  }))}
                />
              </div>
            </>
          ) : null}
          <RegisterBand
            eyebrow={`Play in ${loc.name}`}
            title="Bring your team to the ground"
            text="Register a team and its players get SSCFI IDs and a place in district fixtures."
            primary={{ href: "/register/team", label: "Register a team" }}
            secondary={{ href: "/contact", label: "Contact SSCFI" }}
          />
        </div>
      </section>
    </>
  );
}
