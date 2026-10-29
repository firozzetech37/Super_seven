import Link from "next/link";
import { Fragment } from "react";
import { Reveal } from "@/components/motion/reveal";
import { GroundWatermark } from "./ground-watermark";

export type Crumb = { label: string; href?: string };

/** Navy page banner with breadcrumb, optional eyebrow and an optional aside (CTA, stats) on the right. */
export function PageHeader({
  title,
  description,
  crumbs = [],
  eyebrow,
  aside,
}: {
  title: string;
  description?: string;
  crumbs?: Crumb[];
  eyebrow?: string;
  aside?: React.ReactNode;
}) {
  return (
    <section className="relative isolate overflow-hidden bg-stadium text-white">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:22px_22px] [mask-image:radial-gradient(60%_90%_at_15%_60%,#000,transparent)]" />
        <div className="absolute -bottom-40 right-[12%] size-[420px] rounded-full bg-gold/15 blur-[110px]" />
        <div className="absolute -left-32 -top-32 size-[460px] rounded-full bg-royal/50 blur-[120px]" />
        <GroundWatermark className="parallax-slow absolute -right-28 -top-20 w-[640px] text-white/[0.07] lg:-top-32 lg:w-[760px]" />
        {/* Floodlight sweep: a soft diagonal beam crossing the banner every few seconds */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-y-0 left-0 w-1/3 skew-x-[-18deg] bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.07),transparent)] motion-safe:animate-sweep" />
        </div>
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.05),transparent_40%)]" />
        <div className="absolute inset-x-0 bottom-0 h-px bg-[linear-gradient(90deg,transparent,rgba(217,174,86,0.85)_18%,rgba(217,174,86,0.85)_82%,transparent)]" />
      </div>
      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-12 sm:px-6 lg:flex-row lg:items-end lg:justify-between lg:py-16">
        <Reveal className="max-w-3xl">
          <nav aria-label="Breadcrumb" className="text-sm">
            <ol className="flex w-fit flex-wrap items-center gap-1.5 rounded-full bg-white/10 px-3.5 py-1.5 text-white/75 ring-1 ring-white/15 backdrop-blur">
              <li>
                <Link href="/" className="transition-colors hover:text-white">
                  Home
                </Link>
              </li>
              {crumbs.map((c) => (
                <Fragment key={c.label}>
                  <li aria-hidden="true" className="text-gold">
                    ›
                  </li>
                  <li>
                    {c.href ? (
                      <Link href={c.href} className="transition-colors hover:text-white">
                        {c.label}
                      </Link>
                    ) : (
                      <span className="font-bold text-white">{c.label}</span>
                    )}
                  </li>
                </Fragment>
              ))}
            </ol>
          </nav>
          {eyebrow ? (
            <p className="mt-6 flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.24em] text-gold">
              <span aria-hidden="true" className="eyebrow-dash h-px w-8 bg-gold" />
              {eyebrow}
            </p>
          ) : null}
          <h1 className="mt-4 bg-[linear-gradient(180deg,#ffffff_55%,rgba(255,255,255,0.78))] bg-clip-text font-heading text-4xl font-bold leading-[1.05] text-transparent sm:text-5xl lg:text-[3.4rem]">{title}</h1>
          {description ? <p className="mt-4 max-w-2xl text-lg leading-relaxed text-white/80">{description}</p> : null}
        </Reveal>
        {aside ? <Reveal delay={150} from="right" className="shrink-0">{aside}</Reveal> : null}
      </div>
    </section>
  );
}
