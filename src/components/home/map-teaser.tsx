import Link from "next/link";
import { ArrowRight, ArrowUpRight, Globe2, House, Info, Map as MapIcon, MapPinned, MousePointerClick } from "lucide-react";
import { GroundWatermark } from "@/components/layout/ground-watermark";
import { SectionHeading } from "@/components/layout/section-heading";
import { Choropleth } from "@/components/map/choropleth";
import { Reveal } from "@/components/motion/reveal";
import { statusMeta, type Status } from "@/lib/data/locations";
import { getIndiaMap } from "@/lib/geo/load";
import { stateShapes } from "@/lib/geo/shapes";
import { countByStatus, getStatusMap } from "@/lib/geo/status";

const steps = [
  { n: 1, icon: Globe2, title: "India", text: "Click any state. Colours show where we are.", href: "/locations" },
  { n: 2, icon: MapIcon, title: "State", text: "West Bengal opens with all 23 districts.", href: "/locations/west-bengal" },
  { n: 3, icon: MapPinned, title: "District", text: "Hooghly opens with its towns and localities.", href: "/locations/west-bengal/hooghly" },
  { n: 4, icon: House, title: "Locality", text: "Dankuni: who we are, how to reach us.", href: "/locations/west-bengal/hooghly/dankuni" },
];

const order: Status[] = ["onboarded", "talks", "unreached"];

/**
 * Home-page invitation to the map: a live India map (hover or tap a state) with pulsing pins on
 * onboarded states and status counts, beside the four map levels as a linked timeline.
 */
export async function MapTeaser() {
  const [india, statuses] = await Promise.all([getIndiaMap(), getStatusMap()]);
  const shapes = stateShapes(india, statuses, true);
  const counts = countByStatus(shapes, (s) => s.status);
  const pins = shapes.filter((s) => s.status === "onboarded");

  return (
    <section className="relative isolate overflow-hidden bg-stadium py-16 text-white sm:py-20 lg:py-24">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.09)_1px,transparent_1px)] [background-size:22px_22px] [mask-image:radial-gradient(70%_70%_at_30%_50%,#000,transparent)]" />
        <div className="absolute -left-40 top-1/2 size-[640px] -translate-y-1/2 rounded-full bg-royal/40 blur-[120px]" />
        <GroundWatermark className="parallax-slow absolute -right-56 -top-24 w-[900px] text-white/[0.05]" />
        <div className="absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(217,174,86,0.7)_20%,rgba(217,174,86,0.7)_80%,transparent)]" />
      </div>

      <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[1.05fr_1fr] lg:grid-rows-[auto_1fr] lg:gap-x-16 lg:gap-y-0">
        {/* Map panel */}
        <Reveal from="scale" className="lg:col-start-1 lg:row-span-2 lg:row-start-1 lg:self-center">
          <div className="group/panel card-premium relative overflow-hidden rounded-[2rem] bg-white/[0.04] p-4 shadow-[0_40px_90px_rgba(4,15,42,0.55)] ring-1 ring-white/10 backdrop-blur sm:p-7">
            <span aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_55%_at_50%_42%,rgba(44,103,196,0.55),transparent_72%)]" />
            <span aria-hidden="true" className="pointer-events-none absolute left-1/2 top-[42%] size-[70%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/[0.06]" />
            <span aria-hidden="true" className="pointer-events-none absolute left-1/2 top-[42%] size-[95%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-white/[0.06]" />

            <div className="relative flex items-center justify-between gap-3">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-white ring-1 ring-white/20">
                <span aria-hidden="true" className={statuses.sample ? "size-1.5 rounded-full bg-gold" : "size-1.5 rounded-full bg-status-onboarded"} />
                {statuses.sample ? "Sample data" : "Live status"}
              </span>
              <span className="hidden items-center gap-1.5 text-xs text-white/60 sm:inline-flex">
                <MousePointerClick className="size-3.5 text-gold" aria-hidden="true" />
                Hover or tap a state
              </span>
            </div>

            <div className="relative mx-auto mt-2 max-w-[480px]">
              <Choropleth map={india} shapes={shapes} title="Map of India with states coloured by SSCFI status. Select a state to open it." />
              {pins.map((p, i) => (
                <span
                  key={p.slug}
                  aria-hidden="true"
                  className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2"
                  style={{ left: `${(p.cx / india.width) * 100}%`, top: `${(p.cy / india.height) * 100}%` }}
                >
                  <span className="absolute inset-0 rounded-full bg-gold/80 motion-safe:animate-ping" style={{ animationDelay: `${i * 600}ms`, animationDuration: "2.4s" }} />
                  <span className="relative block size-3 rounded-full bg-gold ring-2 ring-white shadow-[0_0_14px_rgba(217,174,86,0.9)]" />
                </span>
              ))}
            </div>

            <dl className="relative mt-5 grid grid-cols-3 gap-2 sm:gap-3">
              {order.map((s) => (
                <div key={s} className="rounded-2xl bg-white/[0.06] px-2 py-3 text-center ring-1 ring-white/10 sm:px-4">
                  <dd className="font-heading text-2xl font-bold text-white sm:text-3xl">{counts[s]}</dd>
                  <dt className="mt-1.5 flex flex-col items-center justify-center gap-1.5 text-[10px] font-bold uppercase leading-tight tracking-[0.12em] text-white/70 sm:text-[11px]">
                    <span aria-hidden="true" className={`size-2 shrink-0 rounded-full ${statusMeta[s].dot}`} />
                    {statusMeta[s].label}
                  </dt>
                </div>
              ))}
            </dl>
            <p className="relative mt-3 text-center text-[11px] font-bold uppercase tracking-[0.16em] text-white/45">States and union territories</p>
          </div>
        </Reveal>

        {/* Copy + timeline: heading first on phones, then the map, then the steps */}
        <div className="row-start-1 lg:col-start-2 lg:self-end">
          <SectionHeading
            tone="dark"
            eyebrow="Locations"
            title={
              <>
                Find us on the map: <span className="text-gold">four taps</span>
              </>
            }
            description="Real geographic maps, not a family tree. The India map stays faded behind every step, so nobody gets lost."
          />
        </div>

        <div className="lg:col-start-2 lg:row-start-2">
          <Reveal as="ol" stagger={120} className="relative mt-8 space-y-3">
            {steps.map(({ n, icon: Icon, title, text, href }) => (
              <li key={n} className="relative pl-14">
                {n < steps.length ? (
                  <span aria-hidden="true" className="absolute left-[19px] top-11 h-[calc(100%-1.25rem)] w-px bg-[linear-gradient(to_bottom,rgba(217,174,86,0.8),rgba(217,174,86,0.15))]" />
                ) : null}
                <span className="absolute left-0 top-3 grid size-10 place-items-center rounded-full bg-gold font-heading text-lg font-bold text-navy shadow-[0_0_0_6px_rgba(217,174,86,0.15)]">
                  {n}
                </span>
                <Link
                  href={href}
                  className="group flex items-center gap-4 rounded-2xl bg-white/[0.05] p-4 ring-1 ring-white/10 transition duration-300 hover:translate-x-1 hover:bg-white/[0.1] hover:ring-gold/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
                >
                  <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-white/10 text-gold transition-colors duration-300 group-hover:bg-gold group-hover:text-navy">
                    <Icon className="size-5" aria-hidden="true" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-bold text-white">{title}</span>
                    <span className="block text-[15px] text-white/65">{text}</span>
                  </span>
                  <ArrowUpRight className="size-4 shrink-0 text-white/30 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-gold" aria-hidden="true" />
                </Link>
              </li>
            ))}
          </Reveal>

          <Reveal delay={200} className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4">
            <Link
              href="/locations"
              className="group inline-flex items-center justify-center gap-2 rounded-full bg-gold px-6 py-3 font-bold text-navy shadow-[0_12px_28px_rgba(4,15,42,0.45)] transition hover:bg-gold-deep"
            >
              Open the map
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
            </Link>
            <Link
              href="/register/district"
              className="inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 font-bold text-white ring-1 ring-white/30 transition hover:bg-white/10 hover:ring-white/60"
            >
              Register your District Association
            </Link>
          </Reveal>
          <p className="mt-5 flex items-start gap-2 text-sm text-white/55">
            <Info className="mt-0.5 size-4 shrink-0 text-gold/80" aria-hidden="true" />
            <span>
              Same three colours as the internal District Tracker.
              {statuses.sample ? " Colours shown are sample data until the first real status is recorded." : ""}
            </span>
          </p>
        </div>
      </div>
    </section>
  );
}
