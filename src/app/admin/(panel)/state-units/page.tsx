import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { ExternalLink, Flag, Plus, UserPlus, Whistle } from "lucide-react";
import { AdminForm } from "@/components/admin/admin-form";
import { ContentSetupNeeded, DeleteConfirm, MoveButtons } from "@/components/admin/content-bits";
import { Checkbox, Input } from "@/components/admin/fields";
import { ImageUpload } from "@/components/admin/image-upload";
import { missingTables } from "@/components/admin/media-bits";
import { buttonBase, buttonTones } from "@/components/admin/styles";
import { Disclosure, Empty, PageTitle, Panel, PanelSkeleton, StatusPill } from "@/components/admin/ui";
import { requireAdmin } from "@/lib/admin/auth";
import {
  addOfficial,
  addStateUnit,
  deleteOfficial,
  deleteStateUnit,
  moveOfficial,
  moveStateUnit,
  saveOfficial,
  saveStateUnit,
} from "@/lib/admin/actions/content";
import { OFFICIAL_ROWS } from "@/lib/admin/content-shared";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "State units & officials" };

type Unit = { id: string; state: string; code: string; officials: { role?: string; name?: string }[]; published: boolean };
type Official = { id: string; name: string; role: string; state: string | null; photo_src: string | null; published: boolean };

function UnitFields({ u }: { u?: Unit }) {
  const officials = Array.isArray(u?.officials) ? u.officials : [];
  return (
    <>
      <div className="grid gap-4 @md:grid-cols-[minmax(0,1fr)_8rem]">
        <Input name="state" label="State" required defaultValue={u?.state ?? ""} placeholder="West Bengal" />
        <Input name="code" label="Code" required maxLength={5} defaultValue={u?.code ?? ""} placeholder="WB" hint="1–5 letters" />
      </div>
      <p className="mb-2 mt-5 text-[12px] font-bold uppercase tracking-[0.08em] text-slate-500">
        Office bearers <span className="text-[10px] font-semibold normal-case tracking-normal text-slate-400">· empty rows are ignored</span>
      </p>
      <div className="space-y-2">
        {Array.from({ length: OFFICIAL_ROWS }, (_, i) => (
          <div key={i} className="grid gap-2 @md:grid-cols-[14rem_minmax(0,1fr)]">
            <Input name={`role_${i}`} label={`Role ${i + 1}`} defaultValue={officials[i]?.role ?? ""} placeholder={i === 0 ? "President" : i === 1 ? "Secretary" : "Role"} />
            <Input name={`name_${i}`} label={`Name ${i + 1}`} defaultValue={officials[i]?.name ?? ""} placeholder="Full name" />
          </div>
        ))}
      </div>
    </>
  );
}

function OfficialFields({ o }: { o?: Official }) {
  return (
    <div className="grid gap-4 @md:grid-cols-3">
      <Input name="name" label="Name" required defaultValue={o?.name ?? ""} placeholder="Full name" />
      <Input name="role" label="Role" required defaultValue={o?.role ?? ""} placeholder="Umpire, Scorer, Coach…" />
      <Input name="state" label="State" optional defaultValue={o?.state ?? ""} placeholder="Uttar Pradesh" />
    </div>
  );
}

async function Body() {
  const { db } = await requireAdmin();
  const [units, officials] = await Promise.all([
    db.from("state_units").select("id, state, code, officials, published").order("sort_order").order("created_at").returns<Unit[]>(),
    db.from("match_officials").select("id, name, role, state, photo_src, published").order("sort_order").order("created_at").returns<Official[]>(),
  ]);
  if (missingTables(units.error) || missingTables(officials.error)) return <ContentSetupNeeded />;
  const unitList = units.data ?? [];
  const officialList = officials.data ?? [];

  return (
    <div className="space-y-8">
      <Panel
        title={`State units (${unitList.length})`}
        description="The state cards on the Teams page, in this order. Open one to change its office bearers."
        icon={Flag}
        actions={
          <Link href="/teams#state" target="_blank" className={cn(buttonBase, buttonTones.quiet, "h-9 px-3 text-[13px]")}>
            <ExternalLink className="size-4" aria-hidden="true" />
            View page
          </Link>
        }
      >
        {unitList.length ? (
          <ul className="space-y-2">
            {unitList.map((u, i) => {
              const people = (Array.isArray(u.officials) ? u.officials : []).filter((o) => o.name);
              return (
                <li key={u.id} className="flex items-start gap-2">
                  <Disclosure
                    className="min-w-0 flex-1"
                    summary={
                      <span className="flex min-w-0 items-center gap-3">
                        <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-stadium font-heading text-[11px] font-bold text-gold">{u.code}</span>
                        <span className="min-w-0">
                          <span className="block truncate">{u.state}</span>
                          <span className="block truncate text-xs font-normal text-slate-500">{people.length ? people.map((o) => `${o.role}: ${o.name}`).join(" · ") : "No office bearers listed"}</span>
                        </span>
                        {u.published ? null : <StatusPill status="pending" label="hidden" />}
                      </span>
                    }
                  >
                    <AdminForm action={saveStateUnit.bind(null, u.id)} submitLabel="Save" className="@container">
                      <UnitFields u={u} />
                      <Checkbox name="published" label="Show on the website" defaultChecked={u.published} className="mt-4" />
                    </AdminForm>
                    <div className="mt-5 border-t border-line pt-5">
                      <DeleteConfirm action={deleteStateUnit.bind(null, u.id)} label={`Yes, remove ${u.state} from the Teams page`} />
                    </div>
                  </Disclosure>
                  <span className="pt-1.5">
                    <MoveButtons up={moveStateUnit.bind(null, u.id, "up")} down={moveStateUnit.bind(null, u.id, "down")} first={i === 0} last={i === unitList.length - 1} />
                  </span>
                </li>
              );
            })}
          </ul>
        ) : (
          <Empty icon={Flag} title="No state units yet">
            Add the first one below.
          </Empty>
        )}
        <Disclosure summary={<span className="flex items-center gap-2"><Plus className="size-4 text-royal" aria-hidden="true" />Add a state unit</span>} tone="accent" className="mt-5">
          <AdminForm action={addStateUnit} submitLabel="Add state unit" pendingLabel="Adding…" tone="gold" resetOnSuccess className="@container">
            <UnitFields />
          </AdminForm>
        </Disclosure>
      </Panel>

      <Panel
        title={`Match officials (${officialList.length})`}
        description="Umpires, scorers and coaches in the Officials section of the Teams page."
        icon={Whistle}
        actions={
          <Link href="/teams#officials" target="_blank" className={cn(buttonBase, buttonTones.quiet, "h-9 px-3 text-[13px]")}>
            <ExternalLink className="size-4" aria-hidden="true" />
            View page
          </Link>
        }
      >
        {officialList.length ? (
          <ul className="space-y-3">
            {officialList.map((o, i) => (
              <li key={o.id} className="rounded-2xl bg-surface/50 p-4 ring-1 ring-line">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                  <ImageUpload kind="official" id={o.id} src={o.photo_src} />
                  <div className="min-w-0 flex-1">
                    {o.published ? null : <StatusPill status="pending" label="hidden" />}
                    <p className="font-heading text-lg font-bold leading-tight text-navy">{o.name}</p>
                    <p className="text-sm text-slate-500">{[o.role, o.state].filter(Boolean).join(" · ")}</p>
                  </div>
                  <MoveButtons up={moveOfficial.bind(null, o.id, "up")} down={moveOfficial.bind(null, o.id, "down")} first={i === 0} last={i === officialList.length - 1} />
                </div>
                <Disclosure summary="Edit details" className="mt-4">
                  <AdminForm action={saveOfficial.bind(null, o.id)} submitLabel="Save" className="@container">
                    <OfficialFields o={o} />
                    <Checkbox name="published" label="Show on the website" defaultChecked={o.published} className="mt-4" />
                  </AdminForm>
                  <div className="mt-5 border-t border-line pt-5">
                    <DeleteConfirm action={deleteOfficial.bind(null, o.id)} label={`Yes, remove ${o.name} from the website`} />
                  </div>
                </Disclosure>
              </li>
            ))}
          </ul>
        ) : (
          <Empty icon={Whistle} title="No officials yet">
            Add the first one below.
          </Empty>
        )}
        <Disclosure summary={<span className="flex items-center gap-2"><UserPlus className="size-4 text-royal" aria-hidden="true" />Add an official</span>} tone="accent" className="mt-5">
          <AdminForm action={addOfficial} submitLabel="Add official" pendingLabel="Adding…" tone="gold" resetOnSuccess className="@container">
            <OfficialFields />
          </AdminForm>
        </Disclosure>
      </Panel>
    </div>
  );
}

export default function StateUnitsAdminPage() {
  return (
    <div className="space-y-8">
      <PageTitle
        eyebrow="Website"
        title="State units & officials"
        description="The state associations with their office bearers, and the match officials, as shown on the Teams page."
      />
      <Suspense fallback={<PanelSkeleton />}>
        <Body />
      </Suspense>
    </div>
  );
}
