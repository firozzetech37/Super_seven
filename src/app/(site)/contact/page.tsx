import type { Metadata } from "next";
import { Suspense } from "react";
import { ArrowDown, Briefcase, Mail, MessageSquareText, UsersRound } from "lucide-react";
import { GroundWatermark } from "@/components/layout/ground-watermark";
import { ContactInfo } from "@/components/contact/contact-info";
import { CorporateCard } from "@/components/contact/corporate-card";
import { EnquiryForm } from "@/components/contact/enquiry-form";
import { PageHeader } from "@/components/layout/page-header";
import { SectionHeading } from "@/components/layout/section-heading";
import { PersonCard } from "@/components/people/person-card";
import { leadership } from "@/lib/data/people";
import { enquiryTypes, type EnquiryType } from "@/lib/forms";
import { site } from "@/lib/site";
import { Reveal } from "@/components/motion/reveal";

export const metadata: Metadata = {
  title: "Contact",
  description: "Leadership, enquiry form and corporate bookings.",
};

const jumps = [
  { href: "#leadership", label: "Leadership", text: "Who to write to", icon: UsersRound },
  { href: "#enquiry", label: "Enquiry form", text: "Questions, careers and press", icon: MessageSquareText },
  { href: "#corporate", label: "Corporate bookings", text: "Fun Fridays and corporate days", icon: Briefcase },
];

export default function ContactPage(props: PageProps<"/contact">) {
  return (
    <>
      <PageHeader
        eyebrow="Player 7"
        title="Contact"
        description="Leadership, enquiry form and corporate bookings. Every message gets a reply."
        crumbs={[{ label: "Contact" }]}
        aside={
          <a
            href={`mailto:${site.email}`}
            className="group inline-flex items-center gap-3 rounded-2xl bg-white/10 py-2.5 pl-2.5 pr-5 text-white ring-1 ring-white/25 backdrop-blur transition hover:bg-white/15 hover:ring-gold/60"
          >
            <span className="grid size-10 place-items-center rounded-xl bg-gold text-navy transition duration-300 group-hover:-rotate-6">
              <Mail className="size-5" aria-hidden="true" />
            </span>
            <span>
              <span className="block text-[10px] font-bold uppercase tracking-[0.2em] text-gold">Write to us</span>
              <span className="block font-bold">{site.email}</span>
            </span>
          </a>
        }
      />


      <section className="relative isolate flow-root bg-surface pb-16 lg:pb-20">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
          <GroundWatermark className="parallax-slow absolute -left-40 top-24 w-[760px] text-navy/[0.035]" />
        </div>
      <nav aria-label="On this page" className="relative z-10 mx-auto -mt-8 mb-14 max-w-7xl px-4 sm:px-6">
        <Reveal as="ul" stagger={90} className="grid gap-3 sm:grid-cols-3">
          {jumps.map(({ href, label, text, icon: Icon }) => (
            <li key={href}>
              <a
                href={href}
                className="group card-premium flex h-full items-center gap-4 rounded-2xl bg-white p-4 shadow-[0_18px_40px_rgba(15,46,99,0.12)] ring-1 ring-line transition duration-300 hover:-translate-y-1 hover:shadow-[0_26px_56px_rgba(15,46,99,0.16)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-royal"
              >
                <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-royal/10 text-royal transition duration-300 group-hover:-rotate-6 group-hover:bg-royal group-hover:text-white">
                  <Icon className="size-5" aria-hidden="true" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block font-bold text-navy">{label}</span>
                  <span className="block truncate text-sm text-slate-500">{text}</span>
                </span>
                <ArrowDown className="size-4 shrink-0 text-slate-300 transition duration-300 group-hover:translate-y-0.5 group-hover:text-royal" aria-hidden="true" />
              </a>
            </li>
          ))}
        </Reveal>
      </nav>
        <div id="leadership" className="mx-auto max-w-7xl scroll-mt-28 px-4 sm:px-6">
          <SectionHeading eyebrow="Leadership" title="Who to write to" description="President, Secretary and Chief Operating Officer, with direct contact." />
          <Reveal stagger className="mt-10 grid gap-6 md:grid-cols-3">
            {leadership.map((p) => (
              <PersonCard key={p.id} person={p} />
            ))}
          </Reveal>
        </div>
      </section>

      <section id="enquiry" className="relative scroll-mt-28 bg-white py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <SectionHeading eyebrow="Enquiry form" title="Write to the federation" description="For general questions, corporate bookings, careers and press." />
          <div className="mt-10 grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_380px]">
            <Suspense fallback={<FormSkeleton />}>
              <EnquiryFromParams searchParams={props.searchParams} />
            </Suspense>
            <ContactInfo />
          </div>
        </div>
      </section>

      <section id="corporate" className="scroll-mt-28 bg-surface py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <CorporateCard />
        </div>
      </section>
    </>
  );
}

/** Reads ?type= and ?role= (runtime data) so links like "Book a corporate day" preselect the subject. */
async function EnquiryFromParams({ searchParams }: Pick<PageProps<"/contact">, "searchParams">) {
  const sp = await searchParams;
  const rawType = Array.isArray(sp.type) ? sp.type[0] : sp.type;
  const rawRole = Array.isArray(sp.role) ? sp.role[0] : sp.role;
  const type = enquiryTypes.some((t) => t.value === rawType) ? (rawType as EnquiryType) : "general";
  const role = typeof rawRole === "string" ? rawRole.slice(0, 80) : "";
  return <EnquiryForm defaultType={type} defaultRole={role} />;
}

function FormSkeleton() {
  return (
    <div aria-hidden="true" className="rounded-3xl bg-white p-5 ring-1 ring-line sm:p-8">
      <div className="flex items-center gap-4 border-b border-line pb-6">
        <div className="size-12 rounded-2xl shimmer-light" />
        <div className="h-6 w-48 rounded-full shimmer-light" />
      </div>
      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-[3.25rem] rounded-2xl shimmer-light" />
        ))}
        <div className="h-40 rounded-2xl shimmer-light sm:col-span-2" />
      </div>
    </div>
  );
}
