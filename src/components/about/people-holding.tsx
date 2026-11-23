import Image from "next/image";
import { UserRound } from "lucide-react";
import { PeopleNav } from "@/components/about/people-nav";
import { ComingSoon } from "@/components/layout/coming-soon";
import { PageHeader } from "@/components/layout/page-header";
import type { CommitteeMember } from "@/lib/data/people";

/** Banner badge on the people pages: up to three member avatars (empty seats until confirmed) and the count. */
export function MembersBadge({ members = [] }: { members?: CommitteeMember[] }) {
  return (
    <div className="flex items-center gap-4 rounded-3xl bg-white/10 p-4 pr-6 ring-1 ring-white/15 backdrop-blur">
      <span aria-hidden="true" className="flex -space-x-3">
        {members.slice(0, 3).map((m, i) => (
          <span key={`${m.name}-${i}`} className="grid size-12 place-items-center overflow-hidden rounded-full bg-[linear-gradient(150deg,#1c4fa0,#0f2e63)] text-sm font-bold text-gold ring-[3px] ring-gold">
            {m.photo ? <Image src={m.photo} alt="" width={48} height={48} className="size-full object-cover object-top" /> : m.initials}
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
  );
}

/** An About people page while SSCFI prepares the new list (see `holding` in site.ts): banner, section pills and the holding message. */
export function PeopleHoldingPage({ title, description, current }: { title: string; description: string; current: string }) {
  return (
    <>
      <PageHeader
        eyebrow="About SSCFI"
        title={title}
        description={description}
        crumbs={[{ label: "About", href: "/about" }, { label: title }]}
        aside={<MembersBadge />}
      />
      <PeopleNav current={current} />
      <ComingSoon message="We will update this section soon." />
    </>
  );
}
