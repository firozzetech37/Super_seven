import { BadgeCheck, Camera, Inbox, MapPin, UserRound, Type } from "lucide-react";
import { PeopleNav } from "@/components/about/people-nav";
import { UpdateCta } from "@/components/about/update-cta";
import { PageHeader } from "@/components/layout/page-header";
import { SectionHeading } from "@/components/layout/section-heading";
import { Reveal } from "@/components/motion/reveal";
import { CommitteeCard } from "@/components/people/committee-card";
import { committees, type CommitteeMember } from "@/lib/data/people";

const fields = [
  { icon: Camera, label: "Photo" },
  { icon: Type, label: "Name" },
  { icon: BadgeCheck, label: "Role" },
  { icon: MapPin, label: "State" },
];

function MemberCard({ member }: { member: CommitteeMember }) {
  return (
    <article className="group card-premium relative flex h-full flex-col items-center overflow-hidden rounded-3xl bg-white px-5 pb-6 text-center shadow-[0_12px_30px_rgba(15,46,99,0.07)] ring-1 ring-line transition duration-300 hover:-translate-y-1.5 hover:shadow-[0_28px_60px_rgba(15,46,99,0.14)]">
      <div aria-hidden="true" className="absolute inset-x-0 top-0 h-20 overflow-hidden bg-stadium">
        <span className="absolute inset-y-0 left-0 w-1/2 -translate-x-[140%] skew-x-[-20deg] bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-1000 ease-out group-hover:translate-x-[300%]" />
        <span className="absolute inset-x-0 bottom-0 h-px bg-[linear-gradient(90deg,transparent,rgba(217,174,86,0.9)_20%,rgba(217,174,86,0.9)_80%,transparent)]" />
      </div>
      <div className="relative mt-8 size-24">
        <span
          aria-hidden="true"
          className="absolute -inset-[6px] rounded-full bg-[conic-gradient(from_0deg,#d9ae56,#f6dfa2,#c99b43,#1c4fa0,#d9ae56)] shadow-[0_10px_24px_rgba(15,46,99,0.25)] motion-safe:group-hover:animate-[spin_4s_linear_infinite]"
        />
        <span aria-hidden="true" className="absolute inset-0 grid place-items-center rounded-full bg-[linear-gradient(150deg,#1c4fa0,#0f2e63)] font-heading text-3xl font-bold tracking-wide text-gold ring-4 ring-white">
          {member.initials}
        </span>
      </div>
      <h3 className="mt-5 font-heading text-xl font-bold leading-tight text-navy">{member.name}</h3>
      <p className="mt-1 text-[11px] font-bold uppercase tracking-[0.2em] text-royal">{member.role}</p>
      {member.state ? <p className="mt-1 text-sm text-slate-500">{member.state}</p> : null}
      <span className="mt-auto inline-flex items-center gap-1.5 rounded-full bg-status-onboarded/20 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-ground-deep">
        <BadgeCheck className="size-3.5" aria-hidden="true" />
        Confirmed
      </span>
    </article>
  );
}

function EmptySeat() {
  return (
    <div className="group relative flex h-full flex-col items-center rounded-3xl border-2 border-dashed border-line bg-white/60 px-5 pb-6 pt-8 text-center transition duration-300 hover:border-royal/30 hover:bg-white">
      <span className="grid size-24 place-items-center rounded-full bg-avatar ring-4 ring-white transition-transform duration-500 group-hover:scale-105">
        <UserRound className="size-10 text-royal/35" aria-hidden="true" />
      </span>
      <p className="mt-5 font-heading text-lg font-bold text-slate-400">Name to be added</p>
      <span aria-hidden="true" className="shimmer-light mt-2 h-2.5 w-24 rounded-full motion-reduce:animate-none" />
      <span aria-hidden="true" className="shimmer-light mt-2 h-2.5 w-16 rounded-full motion-reduce:animate-none" />
      <span className="mt-auto pt-5 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">Awaiting details</span>
    </div>
  );
}

/** Shared page for the three committee lists until SSCFI supplies names and photos. */
export function CommitteePage({ id, title, description }: { id: string; title: string; description: string }) {
  const committee = committees.find((c) => c.id === id);
  const members = committee?.members ?? [];
  const seats = committee?.placeholders ?? 0;
  const others = committees.filter((c) => c.id !== id);
  const href = committee?.href ?? "/about";

  return (
    <>
      <PageHeader
        eyebrow="About SSCFI"
        title={title}
        description={description}
        crumbs={[{ label: "About", href: "/about" }, { label: title }]}
        aside={
          <div className="flex items-center gap-4 rounded-3xl bg-white/10 p-4 pr-6 ring-1 ring-white/15 backdrop-blur">
            <span aria-hidden="true" className="flex -space-x-3">
              {members.slice(0, 3).map((m) => (
                <span key={m.name} className="grid size-12 place-items-center rounded-full bg-[linear-gradient(150deg,#1c4fa0,#0f2e63)] text-sm font-bold text-gold ring-[3px] ring-gold">
                  {m.initials}
                </span>
              ))}
              {Array.from({ length: Math.max(0, 3 - members.length) }).map((_, i) => (
                <span key={i} className="grid size-12 place-items-center rounded-full bg-white/15 ring-[3px] ring-navy">
                  <UserRound className="size-5 text-white/60" />
                </span>
              ))}
            </span>
            <span>
              <span className="block font-heading text-2xl font-bold leading-none">{members.length ? `${members.length} confirmed` : "List coming"}</span>
              <span className="mt-1 block text-[11px] font-bold uppercase tracking-[0.18em] text-gold">Full list requested</span>
            </span>
          </div>
        }
      />

      <PeopleNav current={href} />

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:py-16">
        <SectionHeading
          eyebrow={members.length ? "Confirmed so far" : "Seats to be filled"}
          title="Members"
          description={
            members.length
              ? "Confirmed members first. The remaining seats fill in as SSCFI sends each member's details."
              : "Each seat fills in as SSCFI sends the member's details."
          }
        />
        <Reveal stagger={80} as="ul" className="mt-10 grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4">
          {members.map((m) => (
            <li key={m.name}>
              <MemberCard member={m} />
            </li>
          ))}
          {Array.from({ length: seats }).map((_, i) => (
            <li key={`seat-${i}`}>
              <EmptySeat />
            </li>
          ))}
        </Reveal>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6">
        <Reveal className="relative overflow-hidden rounded-[2rem] bg-surface p-6 ring-1 ring-line sm:p-10">
          <span aria-hidden="true" className="pointer-events-none absolute -right-20 -top-20 size-72 rounded-full bg-royal/[0.06] blur-3xl" />
          <div className="relative grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
            <div className="flex items-start gap-4">
              <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-royal text-white shadow-[0_10px_22px_rgba(28,79,160,0.3)]">
                <Inbox className="size-6" aria-hidden="true" />
              </span>
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-royal">Content from SSCFI</p>
                <p className="mt-2 max-w-2xl text-[17px] leading-relaxed text-slate-600">
                  The {title.toLowerCase()} list has been requested from the federation: name, role, state and a photo for each member. Cards appear here as soon as they arrive.
                </p>
              </div>
            </div>
            <Reveal as="ul" stagger={90} from="scale" className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-2">
              {fields.map(({ icon: Icon, label }) => (
                <li key={label} className="group flex items-center gap-3 rounded-2xl bg-white px-4 py-3 ring-1 ring-line transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_26px_rgba(15,46,99,0.1)]">
                  <span className="grid size-9 place-items-center rounded-xl bg-royal/10 text-royal transition duration-300 group-hover:-rotate-6 group-hover:bg-royal group-hover:text-white">
                    <Icon className="size-4" aria-hidden="true" />
                  </span>
                  <span className="font-bold text-navy">{label}</span>
                </li>
              ))}
            </Reveal>
          </div>
        </Reveal>
      </section>

      {others.length ? (
        <section className="border-t border-line bg-surface py-14 lg:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <SectionHeading eyebrow="Also in About" title="The other committees" />
            <Reveal stagger={110} as="ul" className="mt-10 grid gap-6 md:grid-cols-2">
              {others.map((c) => (
                <li key={c.id}>
                  <CommitteeCard committee={c} />
                </li>
              ))}
            </Reveal>
          </div>
        </section>
      ) : null}

      <div className="bg-surface pb-px">
        <UpdateCta
          eyebrow="Are you a member?"
          title="Send your name, role, state and photo"
          text="One email to the COO and your card goes up on this page."
          subject={`${title}: member details`}
        />
      </div>
    </>
  );
}
