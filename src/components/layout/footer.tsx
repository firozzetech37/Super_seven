import Image from "next/image";
import Link from "next/link";
import { cacheLife } from "next/cache";
import { ArrowUp, Mail, MapPin, Phone } from "lucide-react";
import { footerColumns, legalLinks, site } from "@/lib/site";
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
      <div className="mx-auto max-w-7xl px-4 pb-8 pt-14 sm:px-6">
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
                    <Link href={l.href} className="transition-colors hover:text-white">
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

        <div className="mt-12 flex flex-col gap-4 border-t border-white/10 pt-6 text-sm text-white/60 sm:flex-row sm:items-center sm:justify-between">
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
          <a href="#top" className="inline-flex items-center gap-2 font-bold text-white/80 transition-colors hover:text-white">
            Back to top
            <span className="grid size-8 place-items-center rounded-full bg-white/10 ring-1 ring-white/20">
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
