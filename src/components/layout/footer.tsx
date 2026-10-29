import Image from "next/image";
import Link from "next/link";
import { cacheLife } from "next/cache";
import { ArrowRight, ArrowUp, Mail, MapPin, Phone } from "lucide-react";
import { footerColumns, legalLinks, site } from "@/lib/site";
import { GroundWatermark } from "./ground-watermark";
import { SocialLinks } from "./social-links";
import { Reveal } from "@/components/motion/reveal";

/** Four-column footer on every page (borrowed from BCCI and TCAI's "Let's Connect"). */
export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-navy-deep text-white">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(50%_60%_at_100%_0%,rgba(44,103,196,0.28),transparent_70%)]" />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(217,174,86,0.85)_18%,rgba(217,174,86,0.85)_82%,transparent)]"
      />
      <GroundWatermark className="parallax-slow pointer-events-none absolute -bottom-40 -left-48 w-[820px] text-white/[0.035]" />
      <div className="mx-auto max-w-7xl px-4 pb-8 pt-12 sm:px-6">
        <Reveal className="relative mb-14 overflow-hidden rounded-3xl bg-[linear-gradient(120deg,rgba(217,174,86,0.16),rgba(28,79,160,0.25))] p-6 ring-1 ring-white/10 sm:p-8">
          <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 left-0 w-1/3 skew-x-[-18deg] bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.08),transparent)] motion-safe:animate-sweep" />
          <div className="relative flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-gold">Play Super Seven</p>
              <p className="mt-2 font-heading text-2xl font-bold leading-snug sm:text-3xl">Bring the game to your district.</p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href="/register"
                className="group inline-flex items-center justify-center gap-2 rounded-full bg-gold px-6 py-3 font-bold text-navy shadow-[0_12px_28px_rgba(4,15,42,0.45)] transition hover:bg-gold-deep"
              >
                Register
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 font-bold text-white ring-1 ring-white/30 transition hover:bg-white/10 hover:ring-white/60"
              >
                Talk to SSCFI
              </Link>
            </div>
          </div>
        </Reveal>
        <Reveal stagger className="grid gap-10 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr_1.2fr]">
          <div className="md:col-span-2 lg:col-span-1">
            <Link href="/" className="inline-flex items-center gap-4">
              <span className="rounded-full bg-gradient-to-br from-gold to-gold-deep p-[3px]">
                <span className="grid size-14 place-items-center overflow-hidden rounded-full bg-white">
                  <Image src="/brand/logo.png" alt="" width={64} height={64} className="size-full rounded-full object-cover" />
                </span>
              </span>
              <span className="max-w-[13rem] text-[15px] font-bold uppercase leading-snug tracking-[0.1em]">{site.name}</span>
            </Link>
            <p className="mt-5 max-w-sm text-[15px] leading-relaxed text-white/70">
              Seven players, seven overs, a match inside two hours. Promoting cricket for men and women from the
              grassroots across India since {site.foundedYear}.
            </p>
            <p className="mt-3 text-xs text-white/50">{site.registration}.</p>
            <SocialLinks className="mt-6" />
          </div>

          {footerColumns.map((col) => (
            <div key={col.title}>
              <h2 className="text-[11px] font-bold uppercase tracking-[0.24em] text-gold">{col.title}</h2>
              <ul className="mt-5 space-y-2.5 text-[15px] text-white/80">
                {col.links.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="group inline-flex items-center transition-colors hover:text-white">
                      <span aria-hidden="true" className="h-px w-0 bg-gold transition-all duration-300 group-hover:mr-2 group-hover:w-3" />
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <h2 className="text-[11px] font-bold uppercase tracking-[0.24em] text-gold">Contact</h2>
            <ul className="mt-5 space-y-3 text-[15px] text-white/80">
              <li className="flex items-start gap-3">
                <Mail className="mt-1 size-4 shrink-0 text-gold" aria-hidden="true" />
                <a href={`mailto:${site.email}`} className="transition-colors hover:text-white">
                  {site.email}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="mt-1 size-4 shrink-0 text-gold" aria-hidden="true" />
                <span className="leading-snug">{site.address}</span>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="mt-1 size-4 shrink-0 text-gold" aria-hidden="true" />
                <span className="text-white/60">Phone to be added</span>
              </li>
            </ul>
          </div>
        </Reveal>

        <p
          aria-hidden="true"
          className="mt-14 select-none bg-[linear-gradient(180deg,rgba(255,255,255,0.09),rgba(255,255,255,0))] bg-clip-text text-center font-heading text-[16vw] font-bold leading-[0.8] tracking-tight text-transparent lg:text-[10.5rem]"
        >
          Super Seven
        </p>
        <div className="flex flex-col gap-4 border-t border-white/10 pt-6 text-sm text-white/60 sm:flex-row sm:items-center sm:justify-between">
          <ul className="flex flex-wrap items-center gap-x-2 gap-y-1">
            {legalLinks.map((l, i) => (
              <li key={l.href} className="flex items-center gap-2">
                {i > 0 ? <span aria-hidden="true">•</span> : null}
                <Link href={l.href} className="transition-colors hover:text-white">
                  {l.label}
                </Link>
              </li>
            ))}
            <li className="flex items-center gap-2">
              <span aria-hidden="true">•</span>
              <span>
                © <CopyrightYear /> {site.shortName}
              </span>
            </li>
          </ul>
          <a href="#top" className="group inline-flex items-center gap-2 font-bold text-white/80 transition-colors hover:text-white">
            Back to top
            <span className="grid size-8 place-items-center rounded-full bg-white/10 ring-1 ring-white/20 transition group-hover:-translate-y-0.5 group-hover:bg-gold group-hover:text-navy">
              <ArrowUp className="size-4" aria-hidden="true" />
            </span>
          </a>
        </div>
      </div>
    </footer>
  );
}

async function CopyrightYear() {
  "use cache";
  cacheLife("days");
  return <>{new Date().getFullYear()}</>;
}
