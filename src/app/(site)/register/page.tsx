import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Building2, Lock, User, Users } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { SectionHeading } from "@/components/layout/section-heading";
import { RegistrationSteps } from "@/components/register/registration-steps";

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
    fields: ["Full name, father or guardian name", "Email, mobile", "Date of birth, gender", "Address, pincode, city, state", "Category: junior, senior, women, corporate", "Batting and bowling style", "Club or school (if any)"],
    cta: "Register as a player",
  },
  {
    title: "Team / Club",
    href: "/register/team",
    icon: Users,
    intro: "For a side that wants to enter tournaments.",
    fields: ["Team name, city, state", "Captain and vice-captain", "Squad list (12 players)", "Coach or manager contact", "Previous tournaments"],
    cta: "Register a team",
  },
  {
    title: "District Association",
    href: "/register/district",
    icon: Building2,
    intro: "For the body that runs Super Seven in a district.",
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
            className="inline-flex items-center gap-2 rounded-full bg-white/10 px-5 py-3 font-bold text-white ring-1 ring-white/25 transition hover:bg-white/15"
          >
            Already registered? Player directory
            <ArrowRight className="size-4 text-gold" aria-hidden="true" />
          </Link>
        }
      />

      <section className="bg-surface py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <SectionHeading eyebrow="How it works" title="Four steps from form to field" />
          <div className="mt-8">
            <RegistrationSteps />
          </div>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <SectionHeading eyebrow="Choose a form" title="Who are you registering?" />
          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            {forms.map(({ title, href, icon: Icon, intro, fields, cta }) => (
              <article key={href} className="group flex flex-col overflow-hidden rounded-3xl bg-surface ring-1 ring-line transition hover:-translate-y-1 hover:bg-white hover:shadow-[0_18px_40px_rgba(15,46,99,0.12)] hover:ring-royal/30">
                <div className="p-7">
                  <span className="grid size-12 place-items-center rounded-xl bg-royal/10 text-royal transition-colors group-hover:bg-royal group-hover:text-white">
                    <Icon className="size-6" aria-hidden="true" />
                  </span>
                  <h3 className="mt-5 font-heading text-2xl font-bold text-navy">{title}</h3>
                  <p className="mt-1 text-[15px] text-slate-500">{intro}</p>
                  <ul className="mt-5 space-y-2 text-[15px] text-slate-600">
                    {fields.map((f) => (
                      <li key={f} className="flex items-start gap-2.5">
                        <span aria-hidden="true" className="mt-2 size-1.5 shrink-0 rounded-full bg-gold-deep" />
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="mt-auto p-7 pt-0">
                  <Link
                    href={href}
                    className="group/btn inline-flex w-full items-center justify-center gap-2 rounded-full bg-gold px-6 py-3 font-bold text-navy shadow-[0_10px_24px_rgba(4,15,42,0.2)] transition hover:bg-gold-deep"
                  >
                    {cta}
                    <ArrowRight className="size-4 transition-transform group-hover/btn:translate-x-1" aria-hidden="true" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
          <p className="mt-8 flex items-start gap-3 rounded-2xl bg-surface p-5 text-sm text-slate-600 ring-1 ring-line">
            <Lock className="mt-0.5 size-4 shrink-0 text-royal" aria-hidden="true" />
            Forms are stored securely and reviewed by SSCFI. The public player directory shows only name, Player ID,
            state and category; dates of birth and guardian names are never published.
          </p>
        </div>
      </section>
    </>
  );
}
