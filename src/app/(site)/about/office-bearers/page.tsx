import type { Metadata } from "next";
import { Mail } from "lucide-react";
import { NoticeCard } from "@/components/about/notice-card";
import { OfficeBearerCard } from "@/components/about/office-bearer-card";
import { PageHeader } from "@/components/layout/page-header";
import { SectionHeading } from "@/components/layout/section-heading";
import { officeBearers2014 } from "@/lib/data/people";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Office Bearers",
  description: "President, Senior Vice President, Secretary General and the committee chairs.",
};

export default function OfficeBearersPage() {
  return (
    <>
      <PageHeader
        eyebrow="About SSCFI"
        title="Office Bearers"
        description="President, Senior Vice President, Secretary General and the committee chairs."
        crumbs={[{ label: "About", href: "/about" }, { label: "Office Bearers" }]}
        aside={
          <div className="rounded-2xl bg-white/10 px-5 py-4 ring-1 ring-white/15 backdrop-blur">
            <p className="font-heading text-3xl font-bold">{officeBearers2014.length}</p>
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-gold">Office bearers on record</p>
          </div>
        }
      />

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <NoticeCard title="Records from the 2014 site">
          SSCFI is confirming the current office bearers. Names, roles and photos below are as published in 2014; the
          @sscfi.in email addresses no longer resolve and are shown for reference only.
        </NoticeCard>

        <div className="mt-12">
          <SectionHeading eyebrow="Federation" title="Office bearers" description="Designation, name and direct contact where it was published." />
        </div>
        <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {officeBearers2014.map((p) => (
            <li key={p.id}>
              <OfficeBearerCard person={p} />
            </li>
          ))}
        </ul>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6">
        <div className="flex flex-col items-start gap-5 rounded-3xl bg-[linear-gradient(135deg,#1c4fa0,#0f2e63)] p-8 text-white shadow-[0_24px_50px_rgba(15,46,99,0.3)] sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-gold">Keep this page current</p>
            <h2 className="mt-2 font-heading text-2xl font-bold">Changed role or a new office bearer?</h2>
            <p className="mt-1 text-white/75">Send the designation, name, phone, email and a photo to the COO.</p>
          </div>
          <a
            href={`mailto:${site.email}?subject=${encodeURIComponent("Office bearers: update")}`}
            className="inline-flex shrink-0 items-center gap-2 rounded-full bg-gold px-6 py-3 font-bold text-navy shadow transition hover:bg-gold-deep"
          >
            <Mail className="size-4" aria-hidden="true" />
            {site.email}
          </a>
        </div>
      </section>
    </>
  );
}
