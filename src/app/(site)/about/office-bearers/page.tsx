import type { Metadata } from "next";
import { NoticeCard } from "@/components/about/notice-card";
import { OfficeBearerCard } from "@/components/about/office-bearer-card";
import { PeopleHoldingPage } from "@/components/about/people-holding";
import { PeopleNav } from "@/components/about/people-nav";
import { UpdateCta } from "@/components/about/update-cta";
import { PageHeader } from "@/components/layout/page-header";
import { SectionHeading } from "@/components/layout/section-heading";
import { CountUp } from "@/components/motion/count-up";
import { Reveal } from "@/components/motion/reveal";
import { getOfficeBearers } from "@/lib/queries/content";
import { holding } from "@/lib/site";

const description = "President, Senior Vice President, Secretary General and the committee chairs.";

export const metadata: Metadata = {
  title: "Office Bearers",
  description,
};

export default async function OfficeBearersPage() {
  if (holding.aboutPeople) return <PeopleHoldingPage title="Office Bearers" description={description} current="/about/office-bearers" />;

  const people = await getOfficeBearers();
  // Officers with published contact details lead; the committee chairs and match officials follow.
  const officers = people.filter((p) => p.phones?.length || p.emails?.length || p.address);
  const chairs = people.filter((p) => !officers.includes(p));
  const allArchive = people.length > 0 && people.every((p) => p.archive);
  return (
    <>
      <PageHeader
        eyebrow="About SSCFI"
        title="Office Bearers"
        description={description}
        crumbs={[{ label: "About", href: "/about" }, { label: "Office Bearers" }]}
        aside={
          <div className="flex items-center gap-4 rounded-3xl bg-white/10 p-4 pr-6 ring-1 ring-white/15 backdrop-blur">
            <span className="grid size-16 place-items-center rounded-2xl bg-gold font-heading text-3xl font-bold text-navy shadow-[0_10px_24px_rgba(4,15,42,0.35)]">
              <CountUp value={people.length} />
            </span>
            <span>
              <span className="block text-[11px] font-bold uppercase tracking-[0.18em] text-gold">On record</span>
              <span className="mt-0.5 block font-heading text-lg font-bold leading-tight">{allArchive ? "Office bearers, 2014" : "Office bearers"}</span>
            </span>
          </div>
        }
      />

      <PeopleNav current="/about/office-bearers" />

      <section className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:py-16">
        {people.some((p) => p.archive) ? (
          <div className="mb-14">
            <NoticeCard title="Records from the 2014 site">
              SSCFI is confirming the current office bearers. {allArchive ? "Names, roles and photos below are" : "Entries carried over from 2014 are"} as
              published in 2014; the @sscfi.in email addresses no longer resolve and are shown for reference only.
            </NoticeCard>
          </div>
        ) : null}

        <div>
          <SectionHeading eyebrow="Federation officers" title="Office bearers" description="Designation, name and direct contact where it was published." />
        </div>
        <Reveal stagger={110} as="ul" className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {officers.map((p, i) => (
            <li key={p.id}>
              <OfficeBearerCard person={p} index={i} />
            </li>
          ))}
        </Reveal>
        {!people.length ? <p className="mt-6 text-[15px] text-slate-500">The list of office bearers is being updated.</p> : null}
      </section>

      {chairs.length ? (
        <section className="relative isolate overflow-hidden border-y border-line bg-surface py-14 lg:py-16">
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(rgba(15,46,99,0.07)_1px,transparent_1px)] [background-size:24px_24px] [mask-image:linear-gradient(to_bottom,#000,transparent_70%)]" />
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <SectionHeading
              eyebrow="Committees and officials"
              title="Chairs and match officials"
              description="Organizing and technical committee chairs, public relations, scoring and umpiring."
            />
            <Reveal stagger as="ul" className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {chairs.map((p, i) => (
                <li key={p.id}>
                  <OfficeBearerCard person={p} index={officers.length + i} variant="compact" />
                </li>
              ))}
            </Reveal>
          </div>
        </section>
      ) : null}

      <div className="pt-16 lg:pt-20">
        <UpdateCta
          eyebrow="Keep this page current"
          title="Changed role or a new office bearer?"
          text="Send the designation, name, phone, email and a photo to the COO."
          subject="Office bearers: update"
        />
      </div>
    </>
  );
}
