import { Building2, Mail, MapPin, Phone } from "lucide-react";
import { SocialLinks } from "@/components/layout/social-links";
import { site } from "@/lib/site";

/** Registered office, email and social links beside the enquiry form. */
export function ContactInfo() {
  return (
    <aside className="h-fit overflow-hidden rounded-3xl bg-[linear-gradient(160deg,#163a78,#0f2e63_70%,#0b2550)] text-white shadow-[0_18px_40px_rgba(15,46,99,0.25)] ring-1 ring-white/10">
      <div aria-hidden="true" className="h-1 bg-gradient-to-r from-gold to-gold-deep" />
      <div className="p-6 sm:p-8">
        <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-gold">Reach us</p>
        <h2 className="mt-2 font-heading text-2xl font-bold">{site.shortName} secretariat</h2>
        <ul className="mt-6 space-y-5 text-[15px]">
          <li className="flex items-start gap-3">
            <span className="grid size-9 shrink-0 place-items-center rounded-full bg-white/10 text-gold ring-1 ring-white/15">
              <MapPin className="size-4" aria-hidden="true" />
            </span>
            <div>
              <p className="font-bold">Registered office</p>
              <p className="mt-0.5 leading-snug text-white/75">{site.address}</p>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <span className="grid size-9 shrink-0 place-items-center rounded-full bg-white/10 text-gold ring-1 ring-white/15">
              <Mail className="size-4" aria-hidden="true" />
            </span>
            <div>
              <p className="font-bold">Email</p>
              <a href={`mailto:${site.email}`} className="mt-0.5 block text-white/85 underline-offset-4 hover:underline">
                {site.email}
              </a>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <span className="grid size-9 shrink-0 place-items-center rounded-full bg-white/10 text-gold ring-1 ring-white/15">
              <Phone className="size-4" aria-hidden="true" />
            </span>
            <div>
              <p className="font-bold">Phone</p>
              <p className="mt-0.5 text-white/60">Phone to be added</p>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <span className="grid size-9 shrink-0 place-items-center rounded-full bg-white/10 text-gold ring-1 ring-white/15">
              <Building2 className="size-4" aria-hidden="true" />
            </span>
            <div>
              <p className="font-bold">Registration</p>
              <p className="mt-0.5 leading-snug text-white/75">{site.registration}.</p>
            </div>
          </li>
        </ul>
        <div className="mt-8 border-t border-white/10 pt-6">
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/60">Follow {site.shortName}</p>
          <SocialLinks className="mt-3" />
        </div>
      </div>
    </aside>
  );
}
