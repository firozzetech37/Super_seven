import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SectionHeading } from "@/components/layout/section-heading";
import { Choropleth } from "@/components/map/choropleth";
import { Reveal } from "@/components/motion/reveal";
import { getIndiaMap } from "@/lib/geo/load";
import { stateShapes } from "@/lib/geo/shapes";
import { getStatusMap } from "@/lib/geo/status";

const steps = [
  { n: 1, title: "India", text: "Click any state. Colours show where we are." },
  { n: 2, title: "State", text: "West Bengal opens with all 23 districts." },
  { n: 3, title: "District", text: "Hooghly opens with its towns and localities." },
  { n: 4, title: "Locality", text: "Dankuni: who we are, how to reach us." },
];

const legend = [
  { label: "Onboarded", className: "bg-status-onboarded" },
  { label: "In discussion", className: "bg-status-talks" },
  { label: "Not reached", className: "bg-status-unreached" },
];

export async function MapTeaser() {
  const [india, statuses] = await Promise.all([getIndiaMap(), getStatusMap()]);
  return (
    <section className="bg-white py-16 lg:py-20">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-[1fr_1.05fr]">
        <Reveal>
        <Link
          href="/locations"
          className="group relative block overflow-hidden rounded-3xl bg-[linear-gradient(160deg,#163a78,#0b2550)] p-6 shadow-[0_30px_60px_rgba(15,46,99,0.3)] ring-1 ring-white/10"
        >
          <span aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_60%_at_50%_40%,rgba(44,103,196,0.45),transparent_70%)]" />
          <div className="relative mx-auto max-w-[460px] transition-transform duration-500 group-hover:scale-[1.02]">
            <Choropleth map={india} shapes={stateShapes(india, statuses, false)} title="Map of India with states coloured by SSCFI status" interactive={false} />
          </div>
          <ul className="relative mt-5 flex flex-wrap justify-center gap-2">
            {legend.map((l) => (
              <li key={l.label} className={`${l.className} rounded-full px-4 py-1.5 text-sm font-bold text-navy`}>
                {l.label}
              </li>
            ))}
          </ul>
          <span className="absolute left-5 top-5 rounded-full bg-white/10 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-white ring-1 ring-white/20">
            {statuses.sample ? "Sample data" : "Live status"}
          </span>
        </Link>
        </Reveal>

        <div>
          <SectionHeading
            eyebrow="Locations"
            title="Find us on the map: four taps"
            description="Real geographic maps, not a family tree. The India map stays faded behind every step, so nobody gets lost."
          />
          <ol className="mt-8 space-y-3">
            {steps.map((s) => (
              <Reveal as="li" key={s.n} delay={s.n * 70} className="flex items-start gap-4 rounded-2xl bg-surface p-4 ring-1 ring-line">
                <span className="grid size-10 shrink-0 place-items-center rounded-full bg-gold font-heading text-lg font-bold text-navy">
                  {s.n}
                </span>
                <div>
                  <p className="font-bold text-navy">{s.title}</p>
                  <p className="text-[15px] text-slate-500">{s.text}</p>
                </div>
              </Reveal>
            ))}
          </ol>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link
              href="/locations"
              className="group inline-flex items-center gap-2 rounded-full bg-royal px-6 py-3 font-bold text-white shadow-[0_10px_24px_rgba(28,79,160,0.35)] transition hover:bg-navy"
            >
              Open the map
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
            </Link>
            <Link href="/register/district" className="font-bold text-royal underline-offset-4 hover:underline">
              Register your District Association
            </Link>
          </div>
          <p className="mt-4 text-sm italic text-slate-500">
            Same three colours as the internal District Tracker.{statuses.sample ? " Colours shown are sample data until the first real status is recorded." : ""}
          </p>
        </div>
      </div>
    </section>
  );
}
