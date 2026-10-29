import { Building2, Mail, MapPin, Phone } from "lucide-react";
import { GroundWatermark } from "@/components/layout/ground-watermark";
import { SocialLinks } from "@/components/layout/social-links";
import { site } from "@/lib/site";
import { CopyEmail } from "./copy-email";

const tile =
  "grid size-11 shrink-0 place-items-center rounded-2xl bg-white/10 text-gold ring-1 ring-white/15 transition duration-300 group-hover:-rotate-6 group-hover:bg-gold group-hover:text-navy";
const row = "group flex items-start gap-4 rounded-2xl p-3 transition-colors duration-300 hover:bg-white/[0.06]";

/** Registered office, email and social links beside the enquiry form; sticks while the form scrolls on desktop. */
export function ContactInfo() {
  return (
    <aside className="relative isolate h-fit overflow-hidden rounded-3xl bg-stadium text-white shadow-[0_24px_50px_rgba(15,46,99,0.28)] ring-1 ring-white/10 lg:sticky lg:top-20">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:20px_20px] [mask-image:radial-gradient(70%_60%_at_80%_10%,#000,transparent)]" />
        <GroundWatermark className="absolute -right-32 -top-16 w-[460px] text-white/[0.07]" />
        <div className="absolute -bottom-24 -left-16 size-64 rounded-full bg-gold/15 blur-3xl" />
      </div>
      <div aria-hidden="true" className="h-1 bg-gradient-to-r from-gold via-gold-deep to-gold" />
      <div className="p-5 sm:p-7">
        <p className="flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.24em] text-gold">
          <span aria-hidden="true" className="h-px w-8 bg-gold" />
          Reach us
        </p>
        <h2 className="mt-2 font-heading text-2xl font-bold sm:text-[1.75rem]">{site.shortName} secretariat</h2>
        <ul className="-mx-3 mt-5 space-y-1 text-[15px]">
          <li className={row}>
            <span className={tile}>
              <MapPin className="size-5" aria-hidden="true" />
            </span>
            <div className="min-w-0">
              <p className="font-bold">Registered office</p>
              <p className="mt-0.5 leading-snug text-white/75">{site.address}</p>
            </div>
          </li>
          <li className={row}>
            <span className={tile}>
              <Mail className="size-5" aria-hidden="true" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="font-bold">Email</p>
              <div className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-1.5">
                <a href={`mailto:${site.email}`} className="break-all text-white/85 underline decoration-gold/50 underline-offset-4 hover:text-white hover:decoration-gold">
                  {site.email}
                </a>
                <CopyEmail email={site.email} />
              </div>
            </div>
          </li>
          <li className={row}>
            <span className={tile}>
              <Phone className="size-5" aria-hidden="true" />
            </span>
            <div className="min-w-0">
              <p className="font-bold">Phone</p>
              <p className="mt-0.5 text-white/60">Phone to be added</p>
            </div>
          </li>
          <li className={row}>
            <span className={tile}>
              <Building2 className="size-5" aria-hidden="true" />
            </span>
            <div className="min-w-0">
              <p className="font-bold">Registration</p>
              <p className="mt-0.5 leading-snug text-white/75">{site.registration}.</p>
            </div>
          </li>
        </ul>
        <div className="mt-6 border-t border-white/10 pt-6">
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/60">Follow {site.shortName}</p>
          <SocialLinks className="mt-3" />
        </div>
      </div>
    </aside>
  );
}
