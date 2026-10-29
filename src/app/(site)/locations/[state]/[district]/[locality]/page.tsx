import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Building2, CalendarDays, Mail, MapPin, Phone, UserRound, Users } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { PageSkeleton } from "@/components/layout/page-skeleton";
import { GroundMap } from "@/components/map/ground-map";
import { StatusChip } from "@/components/map/status-dot";
import { Reveal } from "@/components/motion/reveal";
import { getDistrictList, stateByCode, stateBySlug } from "@/lib/geo/load";
import { getLocality, listLocalityParams } from "@/lib/geo/localities";

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

  const rows = [
    { icon: Building2, label: "Association", value: loc.association },
    { icon: Users, label: "Teams and players", value: loc.teamsCount != null ? `${loc.teamsCount} teams • ${loc.playersCount ?? 0} players` : null },
    { icon: MapPin, label: "Ground", value: loc.groundName ? `${loc.groundName}${loc.groundAddress ? `, ${loc.groundAddress}` : ""}` : null },
    { icon: UserRound, label: "Contact person", value: loc.contactName },
    { icon: Phone, label: "Phone", value: loc.contactPhone, href: loc.contactPhone ? `tel:${loc.contactPhone}` : undefined },
    { icon: Mail, label: "Email", value: loc.contactEmail, href: loc.contactEmail ? `mailto:${loc.contactEmail}` : undefined },
    { icon: CalendarDays, label: "Next fixture", value: loc.nextFixture },
  ];
  const known = rows.filter((r) => r.value);

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
          <div className="flex items-center gap-3 rounded-2xl bg-white/10 px-5 py-3 ring-1 ring-white/15">
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/70">Status</span>
            <StatusChip status={loc.status} />
          </div>
        }
      />

      <section className="bg-surface py-14 lg:py-16">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[1fr_1fr] lg:items-start">
          <Reveal className="overflow-hidden rounded-3xl bg-white shadow-[0_18px_40px_rgba(15,46,99,0.1)] ring-1 ring-line">
            <div aria-hidden="true" className="h-1.5 bg-gradient-to-r from-gold to-gold-deep" />
            <div className="p-6 sm:p-8">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-royal">Locality card</p>
                  <h2 className="mt-2 font-heading text-3xl font-bold text-navy">{loc.name}</h2>
                </div>
                {loc.sample ? (
                  <span className="rounded-full bg-ball/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-ball">Sample data</span>
                ) : null}
              </div>
              {known.length ? (
                <dl className="mt-6 divide-y divide-line">
                  {known.map(({ icon: Icon, label, value, href }) => (
                    <div key={label} className="grid grid-cols-[auto_140px_1fr] items-start gap-3 py-3 max-sm:grid-cols-[auto_1fr]">
                      <span className="grid size-8 place-items-center rounded-full bg-royal/10 text-royal">
                        <Icon className="size-4" aria-hidden="true" />
                      </span>
                      <dt className="pt-1.5 text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500">{label}</dt>
                      <dd className="pt-1 font-bold text-navy max-sm:col-start-2">
                        {href ? (
                          <a href={href} className="underline-offset-4 hover:underline">
                            {value}
                          </a>
                        ) : (
                          value
                        )}
                      </dd>
                    </div>
                  ))}
                </dl>
              ) : (
                <p className="mt-6 text-slate-600">
                  Association, teams, ground, contact person and next fixture for {loc.name} appear here once the local association registers.
                </p>
              )}
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/contact" className="group inline-flex items-center gap-2 rounded-full bg-gold px-6 py-3 font-bold text-navy transition hover:bg-gold-deep">
                  Contact
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                </Link>
                <Link href="/register/team" className="inline-flex items-center gap-2 rounded-full bg-royal px-6 py-3 font-bold text-white transition hover:bg-navy">
                  Register a team here
                </Link>
              </div>
            </div>
          </Reveal>

          <Reveal delay={120}>
            {loc.lat != null && loc.lng != null ? (
              <GroundMap lat={loc.lat} lng={loc.lng} name={loc.groundName ?? loc.name} />
            ) : (
              <div className="flex aspect-[16/10] flex-col items-center justify-center rounded-3xl bg-white p-8 text-center ring-1 ring-line">
                <span className="grid size-12 place-items-center rounded-2xl bg-royal/10 text-royal">
                  <MapPin className="size-6" aria-hidden="true" />
                </span>
                <h3 className="mt-4 font-heading text-xl font-bold text-navy">Ground location to be added</h3>
                <p className="mt-2 max-w-sm text-sm text-slate-500">A street map with a pin appears here once the local association shares the ground&apos;s location.</p>
              </div>
            )}
            <Link href={`/locations/${state}/${district}`} className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-royal underline-offset-4 hover:underline">
              ← Back to {d.name}
            </Link>
          </Reveal>
        </div>
      </section>
    </>
  );
}
