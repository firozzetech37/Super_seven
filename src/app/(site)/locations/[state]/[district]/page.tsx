import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Building2, Info, MapPin, MapPinned, Users } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { PageSkeleton } from "@/components/layout/page-skeleton";
import { SectionHeading } from "@/components/layout/section-heading";
import { DrillTrail } from "@/components/locations/drill-trail";
import { GlassPanel, MapBand } from "@/components/locations/map-band";
import { PanelLink } from "@/components/locations/panel-link";
import { PlaceDirectory } from "@/components/locations/place-directory";
import { RegisterBand } from "@/components/locations/register-band";
import { StatusLadder } from "@/components/locations/status-ladder";
import { StatusTiles } from "@/components/locations/status-tiles";
import { MapStage } from "@/components/map/map-stage";
import { StatusChip } from "@/components/map/status-dot";
import { Reveal } from "@/components/motion/reveal";
import { statusMeta } from "@/lib/data/locations";
import { getDistrictList, getIndiaMap, getStateMap, stateBySlug, states } from "@/lib/geo/load";
import { getLocalities } from "@/lib/geo/localities";
import { districtShapes, stateShapes } from "@/lib/geo/shapes";
import { countByStatus, districtStatus, getStatusMap } from "@/lib/geo/status";

export async function generateStaticParams() {
  const all = await Promise.all(states.map(async (s) => (await getDistrictList(s.slug)).map((d) => ({ state: s.slug, district: d.slug }))));
  return all.flat();
}

export async function generateMetadata({ params }: PageProps<"/locations/[state]/[district]">): Promise<Metadata> {
  const { state, district } = await params;
  const info = stateBySlug.get(state);
  const d = info ? (await getDistrictList(state)).find((x) => x.slug === district) : undefined;
  if (!info || !d) return { title: "Locations" };
  return { title: `${d.name}, ${info.name}`, description: `Super Seven cricket in ${d.name} district, ${info.name}: status, localities, grounds and how to register.` };
}

const meaning = {
  onboarded: "A district association is registered and approved. Teams and players here get IDs and enter fixtures.",
  talks: "SSCFI is in discussion with people in this district. A district association can register any time.",
  unreached: "Nobody has registered here yet. Be the first: register a district association or a team.",
};

/** Params are URL data under Cache Components: the shell renders instantly and the page body streams in. */
export default function DistrictPage(props: PageProps<"/locations/[state]/[district]">) {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <DistrictPageBody params={props.params} />
    </Suspense>
  );
}

async function DistrictPageBody({ params }: { params: PageProps<"/locations/[state]/[district]">["params"] }) {
  const { state, district } = await params;
  const info = stateBySlug.get(state);
  if (!info) notFound();
  const districts = await getDistrictList(state);
  const current = districts.find((d) => d.slug === district);
  if (!current) notFound();

  const [map, india, statuses, localities] = await Promise.all([getStateMap(state), getIndiaMap(), getStatusMap(), getLocalities(info.code, district)]);
  if (!map) notFound();

  const status = districtStatus(statuses, info.code, district);
  const shapes = districtShapes(map, statuses, info.code, state);
  const localityCounts = countByStatus(localities, (l) => l.status);
  const sampleLocalities = localities.some((l) => l.sample);
  const teams = localities.reduce((n, l) => n + (l.teamsCount ?? 0), 0);
  const players = localities.reduce((n, l) => n + (l.playersCount ?? 0), 0);
  const grounds = localities.filter((l) => l.groundName).map((l) => l.groundName);

  const facts = [
    { icon: Building2, title: "District association", text: status === "onboarded" ? "Registered and approved." : "Not registered yet. One form, reviewed by SSCFI." },
    {
      icon: Users,
      title: "Teams and players",
      text: teams > 0 ? `${teams} teams and ${players} players across the localities listed${sampleLocalities ? " (sample data)" : ""}.` : "Counts appear as teams and players register.",
    },
    { icon: MapPin, title: "Grounds", text: grounds.length ? `${grounds.join(", ")}${sampleLocalities ? " (sample data)" : ""}.` : "Ground locations are added with each locality." },
  ];

  return (
    <>
      <PageHeader
        eyebrow="3 · District"
        title={current.name}
        description={`${info.name}. ${meaning[status]}`}
        crumbs={[{ label: "Locations", href: "/locations" }, { label: info.name, href: `/locations/${state}` }, { label: current.name }]}
        aside={
          <div className="flex items-center gap-4 rounded-2xl bg-white/10 px-5 py-4 ring-1 ring-white/15 backdrop-blur">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/60">District status</p>
              <StatusChip status={status} live={status === "onboarded"} className="mt-2" />
            </div>
            <span aria-hidden="true" className="h-10 w-px bg-white/15" />
            <div className="text-center">
              <p className="font-heading text-3xl font-bold leading-none text-gold">{localities.length}</p>
              <p className="mt-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-white/60">{localities.length === 1 ? "Locality" : "Localities"}</p>
            </div>
          </div>
        }
      />

      <MapBand>
        <DrillTrail trail={[{ label: "All of India", href: "/locations" }, { label: info.name, href: `/locations/${state}` }, { label: current.name }]} />
        <div className="mt-8 grid gap-6 lg:mt-10 lg:grid-cols-[1fr_400px] lg:items-start lg:gap-8">
          <Reveal from="scale" className="lg:sticky lg:top-24">
            <MapStage
              map={map}
              shapes={shapes}
              title={`Map of ${info.name} with ${current.name} highlighted. Select another district to open it.`}
              highlight={district}
              marker={district}
              labels={districts.length <= 40 ? "all" : "none"}
              backdrop={{ map: india, shapes: stateShapes(india, statuses, false), highlight: state }}
              sample={statuses.sample}
              hint="Gold pin: you are here"
            />
          </Reveal>

          <Reveal delay={120} from="right">
            <GlassPanel>
              <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-gold">
                {current.name} · {info.name}
              </p>
              <h2 className="mt-2 font-heading text-3xl font-bold">Localities</h2>
              <p className="mt-2 text-white/70">Towns and grounds where Super Seven is played or being set up.</p>

              {localities.length ? (
                <>
                  <StatusTiles counts={localityCounts} caption={sampleLocalities ? "Localities · sample data" : "Localities"} className="mt-5" />
                  <Reveal as="ul" stagger={60} className="mt-5 max-h-[19rem] space-y-2 overflow-y-auto pr-1 [scrollbar-width:thin]">
                    {localities.map((l) => (
                      <li key={l.slug}>
                        <PanelLink href={`/locations/${state}/${district}/${l.slug}`} name={l.name} status={l.status} meta={l.groundName ? "Ground listed" : undefined} />
                      </li>
                    ))}
                  </Reveal>
                </>
              ) : (
                <div className="mt-5 flex flex-col items-center rounded-2xl border border-dashed border-white/20 bg-white/[0.04] px-5 py-8 text-center">
                  <span className="relative grid size-12 place-items-center rounded-2xl bg-gold/15 text-gold">
                    <span aria-hidden="true" className="absolute inset-0 rounded-2xl ring-1 ring-gold/40 motion-safe:animate-ping [animation-duration:2.6s]" />
                    <MapPinned className="size-6" aria-hidden="true" />
                  </span>
                  <p className="mt-4 font-heading text-lg font-bold">No localities listed yet</p>
                  <p className="mt-1 text-sm text-white/65">Towns in {current.name} appear here as teams and associations register.</p>
                </div>
              )}

              <div className="mt-6 grid gap-2.5">
                <Link
                  href="/register/district"
                  className="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-gold px-5 py-3 font-bold text-navy shadow-[0_12px_28px_rgba(4,15,42,0.45)] transition hover:bg-gold-deep"
                >
                  Register your District Association
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                </Link>
                <Link
                  href="/register/team"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full px-5 py-3 font-bold text-white ring-1 ring-white/30 transition hover:bg-white/10 hover:ring-white/60"
                >
                  Register a team here
                </Link>
              </div>
              <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                <Link href={`/locations/${state}`} className="group inline-flex items-center gap-2 text-sm font-bold text-white/70 transition hover:text-white">
                  <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-1" aria-hidden="true" />
                  Back to {info.name}
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

      {localities.length ? (
        <section className="bg-surface py-14 lg:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <SectionHeading
              eyebrow="Localities"
              title={`Where to play in ${current.name}`}
              description={
                sampleLocalities
                  ? "Sample localities from the concept, shown until the local association lists its own. Open one for its card, ground and contact."
                  : "Open a locality for its card, ground and contact."
              }
            />
            <div className="mt-8">
              <PlaceDirectory
                noun={{ one: "locality", many: "localities" }}
                items={localities.map((l) => ({
                  slug: l.slug,
                  name: l.name,
                  href: `/locations/${state}/${district}/${l.slug}`,
                  status: l.status,
                  meta: l.groundName ? "Ground listed" : l.sample ? "Sample" : undefined,
                }))}
              />
            </div>
          </div>
        </section>
      ) : null}

      <section className={localities.length ? "border-t border-line bg-white py-14 lg:py-20" : "bg-surface py-14 lg:py-20"}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <SectionHeading eyebrow="What the colour means" title={`${current.name} is ${statusMeta[status].label.toLowerCase()}`} description="Every district moves along the same three colours as people register and SSCFI approves them." />
          <div className="mt-10">
            <StatusLadder current={status} meaning={meaning} here={current.name} />
          </div>
          <Reveal as="ul" stagger={110} className="mt-12 grid gap-5 md:grid-cols-3">
            {facts.map(({ icon: Icon, title, text }) => (
              <li
                key={title}
                className="group card-premium rounded-3xl bg-surface p-7 ring-1 ring-line transition duration-300 hover:-translate-y-1 hover:bg-white hover:shadow-[0_24px_50px_rgba(15,46,99,0.12)]"
              >
                <span className="grid size-12 place-items-center rounded-2xl bg-royal/10 text-royal transition-colors duration-300 group-hover:bg-royal group-hover:text-white">
                  <Icon className="size-5" aria-hidden="true" />
                </span>
                <h3 className="mt-5 font-heading text-xl font-bold text-navy">{title}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-slate-500">{text}</p>
              </li>
            ))}
          </Reveal>
          <div className="mt-14">
            <RegisterBand
              eyebrow={`Cricket in ${current.name}`}
              title={status === "onboarded" ? `Join the game in ${current.name}` : `Bring Super Seven to ${current.name}`}
              text={
                status === "onboarded"
                  ? "The district association is approved. Register your team so your players get IDs and enter fixtures."
                  : "Register a District Association or a team. SSCFI reviews every request and the map updates once it is approved."
              }
              primary={status === "onboarded" ? { href: "/register/team", label: "Register a team" } : { href: "/register/district", label: "Register your District Association" }}
              secondary={{ href: "/contact", label: "Talk to SSCFI" }}
            />
          </div>
        </div>
      </section>
    </>
  );
}
