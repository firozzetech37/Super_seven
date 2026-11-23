import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { ExternalLink, UserPlus, UsersRound } from "lucide-react";
import { AdminForm } from "@/components/admin/admin-form";
import { ContentSetupNeeded, DeleteConfirm, MoveButtons } from "@/components/admin/content-bits";
import { Checkbox, Input, Select, Textarea } from "@/components/admin/fields";
import { ImageUpload } from "@/components/admin/image-upload";
import { missingTables } from "@/components/admin/media-bits";
import { buttonBase, buttonTones } from "@/components/admin/styles";
import { Disclosure, Empty, FilterTabs, PageTitle, Panel, PanelSkeleton, StatusPill } from "@/components/admin/ui";
import { requireAdmin } from "@/lib/admin/auth";
import { addPerson, deletePerson, movePerson, savePerson } from "@/lib/admin/actions/content";
import { peopleSections, type PeopleSection } from "@/lib/admin/content-shared";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "People" };

type Row = {
  id: string;
  section: PeopleSection;
  name: string | null;
  role: string;
  state: string | null;
  photo_src: string | null;
  emails: string[];
  phones: string[];
  email_suggested: boolean;
  linkedin: string | null;
  address: string | null;
  from_2014: boolean;
  published: boolean;
};

const publicPage: Record<PeopleSection, string> = {
  leadership: "/about#leadership",
  office_bearer: "/about/office-bearers",
  advisory: "/about/advisory-committee",
  committee: "/about/committee",
  core: "/about/core-members",
};

/** Contact fields matter for leadership and office bearers; committee cards show name, role, state and photo. */
const hasContacts = (s: PeopleSection) => s === "leadership" || s === "office_bearer";

function PersonFields({ section, p }: { section: PeopleSection; p?: Row }) {
  const contacts = hasContacts(section);
  return (
    <div className="grid gap-4 @md:grid-cols-2 @3xl:grid-cols-3">
      <Input
        name="name"
        label="Name"
        optional={section === "leadership"}
        required={section !== "leadership"}
        defaultValue={p?.name ?? ""}
        placeholder="Full name"
        hint={section === "leadership" ? "Leave empty to show “Name to be added”" : undefined}
      />
      <Input name="role" label="Role" required defaultValue={p?.role ?? ""} placeholder={section === "leadership" ? "Secretary" : "Treasurer"} />
      <Input name="state" label="State" optional defaultValue={p?.state ?? ""} placeholder="West Bengal" />
      {contacts ? (
        <>
          <Input name="emails" label="Email" optional defaultValue={p?.emails.join(", ") ?? ""} placeholder="name@sscfi.org" hint="Several? Separate with commas" />
          <Input name="phones" label="Phone" optional defaultValue={p?.phones.join(", ") ?? ""} placeholder="+91 98100 00000" hint="Several? Separate with commas" />
          <Input name="linkedin" label="LinkedIn" optional defaultValue={p?.linkedin ?? ""} placeholder="https://www.linkedin.com/in/…" />
          <Textarea name="address" label="Address" optional rows={2} defaultValue={p?.address ?? ""} className="@md:col-span-2 @3xl:col-span-3" />
        </>
      ) : null}
    </div>
  );
}

function PersonCard({ p, index, count }: { p: Row; index: number; count: number }) {
  return (
    <li className="rounded-2xl bg-white p-4 shadow-[0_6px_18px_rgba(15,46,99,0.05)] ring-1 ring-line sm:p-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <ImageUpload kind="person" id={p.id} src={p.photo_src} />
        <div className="min-w-0 flex-1">
          <p className="flex flex-wrap items-center gap-1.5">
            {p.published ? null : <StatusPill status="pending" label="hidden" />}
            {p.from_2014 ? <StatusPill status="closed" label="2014 record" /> : null}
          </p>
          <p className={cn("mt-1 font-heading text-lg font-bold leading-tight", p.name ? "text-navy" : "text-slate-400")}>{p.name ?? "Name to be added"}</p>
          <p className="text-[12px] font-bold uppercase tracking-[0.12em] text-royal">{p.role}</p>
          {[p.state, ...p.emails, ...p.phones].filter(Boolean).length ? (
            <p className="mt-1 truncate text-sm text-slate-500">{[p.state, ...p.emails, ...p.phones].filter(Boolean).join(" · ")}</p>
          ) : null}
        </div>
        <MoveButtons up={movePerson.bind(null, p.id, "up")} down={movePerson.bind(null, p.id, "down")} first={index === 0} last={index === count - 1} />
      </div>
      <Disclosure summary="Edit details" className="mt-4">
        <AdminForm action={savePerson.bind(null, p.id)} submitLabel="Save" className="@container">
          <div className="mb-4 grid gap-4 @md:grid-cols-2 @3xl:grid-cols-3">
            <Select name="section" label="Appears in" options={peopleSections} defaultValue={p.section} hint="Change to move them to another list" />
          </div>
          <PersonFields section={p.section} p={p} />
          <div className="mt-5 grid gap-3 @md:grid-cols-3">
            <Checkbox name="published" label="Show on the website" defaultChecked={p.published} />
            {hasContacts(p.section) ? (
              <Checkbox name="email_suggested" label="Email is a suggestion" hint="Adds a “Suggested” tag (address not set up yet)" defaultChecked={p.email_suggested} />
            ) : null}
            <Checkbox name="from_2014" label="From the 2014 records" hint="Not yet confirmed by SSCFI" defaultChecked={p.from_2014} />
          </div>
        </AdminForm>
        <div className="mt-5 border-t border-line pt-5">
          <DeleteConfirm action={deletePerson.bind(null, p.id)} label={`Yes, remove ${p.name ?? p.role} from the website`} />
        </div>
      </Disclosure>
    </li>
  );
}

async function Body({ searchParams }: { searchParams: PageProps<"/admin/people">["searchParams"] }) {
  const { db } = await requireAdmin();
  const query = await searchParams;
  const section = (peopleSections.find((s) => s.value === query.section)?.value ?? "leadership") as PeopleSection;
  const { data, error } = await db
    .from("people")
    .select("id, section, name, role, state, photo_src, emails, phones, email_suggested, linkedin, address, from_2014, published")
    .order("sort_order")
    .order("created_at")
    .returns<Row[]>();
  if (missingTables(error)) return <ContentSetupNeeded />;
  const all = data ?? [];
  const list = all.filter((p) => p.section === section);
  const meta = peopleSections.find((s) => s.value === section)!;

  return (
    <div className="space-y-6">
      <FilterTabs
        current={section}
        tabs={peopleSections.map((s) => ({ value: s.value, label: s.label, href: `/admin/people?section=${s.value}`, count: all.filter((p) => p.section === s.value).length }))}
      />

      <Panel
        title={meta.label}
        description={`Shown on ${meta.where}, in this order. Use the arrows to change it.`}
        icon={UsersRound}
        actions={
          <Link href={publicPage[section]} target="_blank" className={cn(buttonBase, buttonTones.quiet, "h-9 px-3 text-[13px]")}>
            <ExternalLink className="size-4" aria-hidden="true" />
            View page
          </Link>
        }
      >
        {list.length ? (
          <ul className="space-y-3">
            {list.map((p, i) => (
              <PersonCard key={p.id} p={p} index={i} count={list.length} />
            ))}
          </ul>
        ) : (
          <Empty icon={UsersRound} title="Nobody here yet">
            {section === "advisory" || section === "committee" || section === "core"
              ? "The website shows empty “Name to be added” seats until members are added below."
              : "Add the first person below."}
          </Empty>
        )}
      </Panel>

      <Panel title={`Add to ${meta.label}`} description="Add the photo from their card once they're on the list." icon={UserPlus}>
        <AdminForm key={section} action={addPerson} submitLabel="Add person" pendingLabel="Adding…" tone="gold" resetOnSuccess className="@container">
          <input type="hidden" name="section" value={section} />
          <PersonFields section={section} />
        </AdminForm>
      </Panel>
    </div>
  );
}

export default function PeopleAdminPage({ searchParams }: PageProps<"/admin/people">) {
  return (
    <div className="space-y-8">
      <PageTitle
        eyebrow="Website"
        title="People"
        description="Leadership, office bearers and the three committees, with their photos and contact details."
      />
      <Suspense fallback={<PanelSkeleton />}>
        <Body searchParams={searchParams} />
      </Suspense>
    </div>
  );
}
