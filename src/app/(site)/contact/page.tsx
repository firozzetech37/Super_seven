import type { Metadata } from "next";
import { Suspense } from "react";
import { Mail } from "lucide-react";
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
            className="inline-flex items-center gap-2 rounded-full bg-white/10 px-5 py-3 font-bold text-white ring-1 ring-white/25 transition hover:bg-white/15"
          >
            <Mail className="size-4 text-gold" aria-hidden="true" />
            {site.email}
          </a>
        }
      />

      <section id="leadership" className="scroll-mt-28 bg-surface py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <SectionHeading eyebrow="Leadership" title="Who to write to" description="President, Secretary and Chief Operating Officer, with direct contact." />
          <Reveal stagger className="mt-10 grid gap-6 md:grid-cols-3">
            {leadership.map((p) => (
              <PersonCard key={p.id} person={p} />
            ))}
          </Reveal>
        </div>
      </section>

      <section id="enquiry" className="scroll-mt-28 bg-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <SectionHeading eyebrow="Enquiry form" title="Write to the federation" description="For general questions, corporate bookings, careers and press." />
          <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_380px]">
            <Suspense fallback={<FormSkeleton />}>
              <EnquiryFromParams searchParams={props.searchParams} />
            </Suspense>
            <ContactInfo />
          </div>
        </div>
      </section>

      <section id="corporate" className="scroll-mt-28 bg-surface py-16">
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
    <div aria-hidden="true" className="space-y-4 rounded-3xl bg-white p-8 ring-1 ring-line">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="h-12 animate-pulse rounded-full bg-surface" />
      ))}
      <div className="h-32 animate-pulse rounded-2xl bg-surface" />
    </div>
  );
}
