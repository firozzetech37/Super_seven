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
        <GroundWatermark className="absolute -right-28 -top-20 w-[640px] text-white/[0.07] lg:-top-32 lg:w-[760px]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.05),transparent_40%)]" />
        <div className="absolute inset-x-0 bottom-0 h-px bg-[linear-gradient(90deg,transparent,rgba(217,174,86,0.85)_18%,rgba(217,174,86,0.85)_82%,transparent)]" />
      </div>
      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-12 sm:px-6 lg:flex-row lg:items-end lg:justify-between lg:py-16">
        <Reveal className="max-w-3xl">
          <nav aria-label="Breadcrumb" className="text-sm">
            <ol className="flex flex-wrap items-center gap-1.5 rounded-full bg-white/10 px-3.5 py-1.5 ring-1 ring-white/15 w-fit text-white/75">
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
              <span aria-hidden="true" className="h-px w-8 bg-gold" />
              {eyebrow}
            </p>
          ) : null}
          <h1 className="mt-4 font-heading text-4xl font-bold leading-[1.05] sm:text-5xl lg:text-[3.4rem]">{title}</h1>
          {description ? <p className="mt-4 max-w-2xl text-lg leading-relaxed text-white/80">{description}</p> : null}
        </Reveal>
        {aside ? <Reveal delay={150} className="shrink-0">{aside}</Reveal> : null}
      </div>
    </section>
  );
}
