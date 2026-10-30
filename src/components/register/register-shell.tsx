import Link from "next/link";
import { ArrowRight, Building2, LockKeyhole, Mail, User, Users } from "lucide-react";
import { FormProgress } from "@/components/forms/form-progress";
import { SectionHeading } from "@/components/layout/section-heading";
import { site } from "@/lib/site";
import { RegistrationSteps } from "./registration-steps";
import { registerFormId, sectionsByForm } from "./sections";

const forms = [
  { label: "Player", text: "Individual cricketers, junior to corporate.", href: "/register/player", icon: User },
  { label: "Team or club", text: "A side entering tournaments, squad of 12.", href: "/register/team", icon: Users },
  { label: "District Association", text: "The body that runs Super Seven in a district.", href: "/register/district", icon: Building2 },
];

/**
 * Form on the left; on the right a sticky column with live progress through the form's sections
 * and the privacy promise. On phones and tablets a slim progress bar sticks under the header
 * instead. Below the form, a band with "what happens next" and the other registration forms.
 */
export function RegisterShell({ current, children }: { current: string; children: React.ReactNode }) {
  const sections = (sectionsByForm[current] ?? []).map(({ id, title }) => ({ id, title }));
  const others = forms.filter((f) => f.href !== current);

  return (
    <>
      <section className="relative isolate overflow-clip bg-surface py-10 lg:py-16">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute -left-40 top-24 size-[520px] rounded-full bg-royal/[0.06] blur-[100px]" />
          <div className="absolute -right-32 bottom-0 size-[460px] rounded-full bg-gold/[0.1] blur-[110px]" />
        </div>
        <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[minmax(0,1fr)_340px] lg:gap-10">
          <div className="min-w-0">
            {sections.length ? (
              <div className="sticky top-[5.5rem] z-30 mb-6 lg:hidden">
                <FormProgress formId={registerFormId} sections={sections} variant="bar" />
              </div>
            ) : null}
            <div>{children}</div>
          </div>

          <aside className="min-w-0">
            <div className="space-y-5 lg:sticky lg:top-20">
              {sections.length ? (
                <div className="hidden lg:block">
                  <FormProgress formId={registerFormId} sections={sections} />
                </div>
              ) : null}

              <div className="relative isolate overflow-hidden rounded-3xl bg-stadium p-6 text-white shadow-[0_18px_40px_rgba(15,46,99,0.2)] ring-1 ring-white/10">
                <span aria-hidden="true" className="absolute -right-10 -top-10 -z-10 size-40 rounded-full bg-gold/20 blur-3xl" />
                <div className="flex items-center gap-3">
                  <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-white/10 text-gold ring-1 ring-white/15">
                    <LockKeyhole className="size-5" aria-hidden="true" />
                  </span>
                  <p className="font-heading text-lg font-bold">Your details stay private</p>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-white/70">
                  Forms are stored securely and reviewed by SSCFI. Only name, Player ID, state and category ever appear
                  in the public directory. Dates of birth and guardian names stay private.
                </p>
                <a
                  href={`mailto:${site.email}`}
                  className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-gold underline-offset-4 hover:underline"
                >
                  <Mail className="size-4" aria-hidden="true" />
                  Questions? {site.email}
                </a>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <section className="relative bg-white py-14 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <SectionHeading eyebrow="What happens next" title="From this form to the field" />
          <div className="mt-10">
            <RegistrationSteps />
          </div>

          <div className="mt-12 grid gap-4 border-t border-line pt-10 md:grid-cols-[220px_1fr_1fr] md:items-center">
            <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-royal">Registering someone else?</p>
            {others.map(({ label, text, href, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className="group card-premium flex items-center gap-4 rounded-3xl bg-surface p-5 ring-1 ring-line transition duration-300 hover:-translate-y-1 hover:bg-white hover:shadow-[0_18px_40px_rgba(15,46,99,0.1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-royal"
              >
                <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-royal/10 text-royal transition duration-300 group-hover:-rotate-6 group-hover:bg-royal group-hover:text-white">
                  <Icon className="size-5" aria-hidden="true" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block font-bold text-navy">{label}</span>
                  <span className="block text-sm text-slate-500">{text}</span>
                </span>
                <span className="grid size-9 shrink-0 place-items-center rounded-full bg-white text-royal ring-1 ring-line transition duration-300 group-hover:bg-royal group-hover:text-white group-hover:ring-royal">
                  <ArrowRight className="size-4" aria-hidden="true" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
