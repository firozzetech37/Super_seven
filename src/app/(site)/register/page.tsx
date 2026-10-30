import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Building2, Check, Lock, User, Users } from "lucide-react";
import { GroundWatermark } from "@/components/layout/ground-watermark";
import { PageHeader } from "@/components/layout/page-header";
import { SectionHeading } from "@/components/layout/section-heading";
import { RegistrationSteps } from "@/components/register/registration-steps";
import { Reveal } from "@/components/motion/reveal";

export const metadata: Metadata = {
  title: "New Registration",
  description: "Register as a player, a team or club, or a district association. SSCFI reviews every submission and calls back.",
};

const forms = [
  {
    title: "Player",
    href: "/register/player",
    icon: User,
    intro: "For individual cricketers, junior to corporate.",
    tag: "Individual",
    fields: ["Full name, father or guardian name", "Email, mobile", "Date of birth, gender", "Address, pincode, city, state", "Category: junior, senior, women, corporate", "Batting and bowling style", "Club or school (if any)"],
    cta: "Register as a player",
  },
  {
    title: "Team / Club",
    href: "/register/team",
    icon: Users,
    intro: "For a side that wants to enter tournaments.",
    tag: "Squad of 12",
    fields: ["Team name, city, state", "Captain and vice-captain", "Squad list (12 players)", "Coach or manager contact", "Previous tournaments"],
    cta: "Register a team",
  },
  {
    title: "District Association",
    href: "/register/district",
    icon: Building2,
    intro: "For the body that runs Super Seven in a district.",
    tag: "Association",
    fields: ["Association name, registration number", "State and district", "Contact person, designation, phone, email", "Full address", "Teams and players today", "Registration certificate upload"],
    cta: "Register your district",
  },
];

export default function RegisterPage() {
  return (
    <>
      <PageHeader
        eyebrow="Player 4"
        title="New Registration"
        description="One gold button, three forms. Register as a player, a team or club, or a district association. SSCFI reviews every submission and calls back."
        crumbs={[{ label: "New Registration" }]}
        aside={
          <Link
            href="/players"
            className="group inline-flex items-center gap-2 rounded-full bg-white/10 px-5 py-3 font-bold text-white ring-1 ring-white/25 backdrop-blur transition hover:bg-white/15 hover:ring-gold/60"
          >
            Already registered? Player directory
            <ArrowRight className="size-4 text-gold transition-transform group-hover:translate-x-1" aria-hidden="true" />
          </Link>
        }
      />

      <section className="relative isolate overflow-hidden bg-surface py-14 lg:py-20">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
          <GroundWatermark className="parallax-slow absolute -right-48 -top-10 w-[820px] text-navy/[0.035]" />
        </div>
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <SectionHeading eyebrow="How it works" title="Four steps from form to field" />
          <div className="mt-10">
            <RegistrationSteps />
          </div>
        </div>
      </section>

      <section className="relative bg-white py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <SectionHeading
            eyebrow="Choose a form"
            title={
              <>
                Who are you <span className="text-royal">registering?</span>
              </>
            }
            description="Three forms, one review process. Pick the one that fits; you can always come back for the others."
          />
          <Reveal stagger={120} className="mt-12 grid gap-6 lg:grid-cols-3">
            {forms.map(({ title, href, icon: Icon, intro, tag, fields, cta }, i) => (
              <article
                key={href}
                className="group card-premium relative flex flex-col overflow-hidden rounded-3xl bg-white shadow-[0_12px_30px_rgba(15,46,99,0.07)] ring-1 ring-line transition duration-300 hover:-translate-y-1.5 hover:shadow-[0_28px_60px_rgba(15,46,99,0.14)]"
              >
                <div className="relative h-28 overflow-hidden bg-stadium">
                  <GroundWatermark className="absolute -right-14 -top-12 w-72 text-white/[0.1] transition-transform duration-700 ease-out group-hover:-rotate-3 group-hover:scale-110" />
                  <span
                    aria-hidden="true"
                    className="absolute inset-y-0 left-0 w-1/2 -translate-x-[140%] skew-x-[-20deg] bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-1000 ease-out group-hover:translate-x-[300%]"
                  />
                  <span aria-hidden="true" className="absolute bottom-1 right-5 select-none font-heading text-7xl font-bold leading-none text-white/[0.12]">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="absolute left-6 top-5 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-gold ring-1 ring-white/15 backdrop-blur">
                    <span aria-hidden="true" className="size-1.5 rounded-full bg-gold" />
                    {tag}
                  </span>
                  <span aria-hidden="true" className="absolute inset-x-0 bottom-0 h-px bg-[linear-gradient(90deg,transparent,rgba(217,174,86,0.9)_20%,rgba(217,174,86,0.9)_80%,transparent)]" />
                </div>
                <div className="relative flex flex-1 flex-col px-7 pb-7">
                  <span className="-mt-7 grid size-14 place-items-center rounded-2xl bg-white text-royal shadow-[0_12px_26px_rgba(15,46,99,0.18)] ring-1 ring-line transition duration-300 group-hover:-rotate-6 group-hover:bg-royal group-hover:text-white group-hover:ring-royal">
                    <Icon className="size-6" aria-hidden="true" />
                  </span>
                  <h3 className="mt-5 font-heading text-2xl font-bold text-navy">{title}</h3>
                  <p className="mt-1 text-[15px] text-slate-500">{intro}</p>
                  <p className="mt-6 text-[11px] font-bold uppercase tracking-[0.2em] text-royal">What you will need</p>
                  <ul className="mt-3 space-y-2.5 text-[15px] text-slate-600">
                    {fields.map((f) => (
                      <li key={f} className="flex items-start gap-3">
                        <span aria-hidden="true" className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-gold/20 text-gold-deep">
                          <Check className="size-3" strokeWidth={3} />
                        </span>
                        {f}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-auto pt-8">
                    <Link
                      href={href}
                      className="group/btn inline-flex w-full items-center justify-center gap-2 rounded-full bg-gold px-6 py-3.5 font-bold text-navy shadow-[0_10px_24px_rgba(4,15,42,0.2)] transition hover:bg-gold-deep focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-royal/30"
                    >
                      {cta}
                      <ArrowRight className="size-4 transition-transform group-hover/btn:translate-x-1" aria-hidden="true" />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </Reveal>
          <Reveal className="relative mt-10 flex flex-col gap-4 overflow-hidden rounded-3xl bg-stadium p-6 text-white ring-1 ring-white/10 sm:flex-row sm:items-center sm:p-8">
            <span aria-hidden="true" className="pointer-events-none absolute -right-16 -top-16 size-56 rounded-full bg-gold/20 blur-3xl" />
            <span className="relative grid size-12 shrink-0 place-items-center rounded-2xl bg-white/10 text-gold ring-1 ring-white/15">
              <Lock className="size-5" aria-hidden="true" />
            </span>
            <p className="relative max-w-3xl text-[15px] leading-relaxed text-white/80">
              <span className="font-bold text-white">Private by design. </span>
              Forms are stored securely and reviewed by SSCFI. The public player directory shows only name, Player ID,
              state and category; dates of birth and guardian names are never published.
            </p>
          </Reveal>
        </div>
      </section>
    </>
  );
}
