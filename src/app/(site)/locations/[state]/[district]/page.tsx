import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Building2, MapPin, Users } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { PageSkeleton } from "@/components/layout/page-skeleton";
import { SectionHeading } from "@/components/layout/section-heading";
import { MapStage } from "@/components/map/map-stage";
import { StatusChip, StatusDot } from "@/components/map/status-dot";
import { Reveal } from "@/components/motion/reveal";
import { statusMeta } from "@/lib/data/locations";
import { getDistrictList, getIndiaMap, getStateMap, stateBySlug, states } from "@/lib/geo/load";
import { getLocalities } from "@/lib/geo/localities";
import { districtShapes, stateShapes } from "@/lib/geo/shapes";
import { districtStatus, getStatusMap } from "@/lib/geo/status";

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

  return (
    <>
      <PageHeader
        eyebrow="3 · District"
        title={current.name}
        description={`${info.name}. ${meaning[status]}`}
        crumbs={[{ label: "Locations", href: "/locations" }, { label: info.name, href: `/locations/${state}` }, { label: current.name }]}
        aside={
          <div className="flex items-center gap-3 rounded-2xl bg-white/10 px-5 py-3 ring-1 ring-white/15">
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/70">District status</span>
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
              title={`Map of ${info.name} with ${current.name} highlighted`}
              highlight={district}
              labels={districts.length <= 40 ? "all" : "none"}
              backdrop={{ map: india, shapes: stateShapes(india, statuses, false), highlight: state }}
              sample={statuses.sample}
            />
          </Reveal>

          <Reveal delay={120} as="section" className="rounded-3xl bg-navy/70 p-6 ring-1 ring-white/15 backdrop-blur">
            <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-gold">{current.name} · {info.name}</p>
            <h2 className="mt-2 font-heading text-3xl font-bold">Localities</h2>
            <p className="mt-2 text-sm text-white/75">Towns and grounds where Super Seven is played or being set up.</p>
            {localities.length ? (
              <ul className="mt-4 grid grid-cols-2 gap-2">
                {localities.map((l) => (
                  <li key={l.slug}>
                    <Link
                      href={`/locations/${state}/${district}/${l.slug}`}
                      className="flex w-full items-center gap-2 rounded-full bg-white/5 px-3 py-2 text-sm font-bold ring-1 ring-white/15 transition hover:bg-white/10"
                    >
                      <StatusDot status={l.status} />
                      <span className="truncate">{l.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="mt-4 rounded-2xl bg-white/5 p-4 text-sm text-white/80 ring-1 ring-white/10">
                No localities registered in {current.name} yet. They appear here as teams and associations register.
              </div>
            )}
            <div className="mt-5 grid gap-2">
              <Link
                href="/register/district"
                className="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-gold px-5 py-3 font-bold text-navy transition hover:bg-gold-deep"
              >
                Register your District Association
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
              </Link>
              <Link href="/register/team" className="inline-flex w-full items-center justify-center gap-2 rounded-full px-5 py-3 font-bold text-white ring-2 ring-white/50 transition hover:bg-white/10">
                Register a team here
              </Link>
            </div>
            <Link href={`/locations/${state}`} className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-white/70 transition hover:text-white">
              ← Back to {info.name}
            </Link>
          </Reveal>
        </div>
      </section>

      <section className="bg-white py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <SectionHeading eyebrow="What the colour means" title={`${current.name} is ${statusMeta[status].label.toLowerCase()}`} description={meaning[status]} />
          <ul className="mt-8 grid gap-5 md:grid-cols-3">
            {[
              { icon: Building2, title: "District association", text: status === "onboarded" ? "Registered and approved." : "Not registered yet. One form, reviewed by SSCFI." },
              { icon: Users, title: "Teams and players", text: localities.reduce((n, l) => n + (l.teamsCount ?? 0), 0) > 0 ? `${localities.reduce((n, l) => n + (l.teamsCount ?? 0), 0)} teams and ${localities.reduce((n, l) => n + (l.playersCount ?? 0), 0)} players across the localities listed.` : "Counts appear as teams and players register." },
              { icon: MapPin, title: "Grounds", text: localities.some((l) => l.groundName) ? localities.filter((l) => l.groundName).map((l) => l.groundName).join(", ") : "Ground locations are added with each locality." },
            ].map(({ icon: Icon, title, text }, i) => (
              <Reveal as="li" key={title} delay={i * 90} className="rounded-2xl bg-surface p-6 ring-1 ring-line">
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
