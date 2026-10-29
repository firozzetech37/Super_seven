import { Mail } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { SectionHeading } from "@/components/layout/section-heading";
import { SectionPlaceholder } from "@/components/layout/section-placeholder";
import { committees } from "@/lib/data/people";
import { site } from "@/lib/site";
import { Reveal } from "@/components/motion/reveal";

/** Shared page for the three committee lists until SSCFI supplies names and photos. */
export function CommitteePage({ id, title, description }: { id: string; title: string; description: string }) {
  const committee = committees.find((c) => c.id === id);
  const members = committee?.members ?? [];

  return (
    <>
      <PageHeader
        eyebrow="About SSCFI"
        title={title}
        description={description}
        crumbs={[{ label: "About", href: "/about" }, { label: title }]}
      />

      {members.length ? (
        <section className="mx-auto max-w-7xl px-4 pt-12 sm:px-6">
          <SectionHeading eyebrow="Confirmed" title="Known members" />
          <Reveal stagger as="ul" className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {members.map((m) => (
              <li key={m.name} className="flex items-center gap-4 rounded-2xl bg-white p-5 ring-1 ring-line">
                <span className="grid size-14 shrink-0 place-items-center rounded-full bg-royal font-bold text-white ring-4 ring-gold/80">
                  {m.initials}
                </span>
                <span>
                  <span className="block font-heading text-lg font-bold text-navy">{m.name}</span>
                  <span className="block text-sm text-slate-500">
                    {m.role}
                    {m.state ? ` · ${m.state}` : ""}
                  </span>
                </span>
              </li>
            ))}
          </Reveal>
        </section>
      ) : null}

      <SectionPlaceholder
        phase="Content from SSCFI"
        note={`The ${title.toLowerCase()} list has been requested from the federation: name, role, state and a photo for each member. Cards appear here as soon as they arrive.`}
        items={["Photo", "Name", "Role", "State"]}
      />

      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6">
        <div className="flex flex-col items-start gap-5 rounded-3xl bg-[linear-gradient(135deg,#1c4fa0,#0f2e63)] p-8 text-white shadow-[0_24px_50px_rgba(15,46,99,0.3)] sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-gold">Are you a member?</p>
            <h2 className="mt-2 font-heading text-2xl font-bold">Send your name, role, state and photo</h2>
            <p className="mt-1 text-white/75">One email to the COO and your card goes up on this page.</p>
          </div>
          <a
            href={`mailto:${site.email}?subject=${encodeURIComponent(`${title}: member details`)}`}
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
