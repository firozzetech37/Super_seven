import { Database } from "lucide-react";
import { AdminForm } from "@/components/admin/admin-form";
import { Checkbox, Input, Textarea } from "@/components/admin/fields";
import { Panel } from "@/components/admin/ui";
import { deleteAlbum, saveAlbum } from "@/lib/admin/actions/media";

export type AlbumRow = {
  id: string;
  slug: string;
  title: string;
  label: string | null;
  description: string | null;
  event_date: string | null;
  published: boolean;
  sort_order: number;
};

/** True when Supabase says the media tables don't exist yet (the migration hasn't been run). */
export const missingTables = (error: { code?: string } | null) => error?.code === "PGRST205" || error?.code === "42P01";

export function MediaSetupNeeded() {
  return (
    <Panel title="One step before you can upload" icon={Database} className="ring-gold/50">
      <ol className="list-decimal space-y-2 pl-5 text-[15px] leading-relaxed text-slate-600">
        <li>
          Open your Supabase project → <strong className="text-navy">SQL Editor</strong> → New query.
        </li>
        <li>
          Paste everything from <code className="rounded bg-surface px-1.5 py-0.5 text-[13px] text-navy">supabase/migrations/20261118000000_media.sql</code> and press{" "}
          <strong className="text-navy">Run</strong>.
        </li>
        <li>Reload this page. The current gallery (5 albums, 49 photos, 42 press clippings) will already be here, ready to edit.</li>
      </ol>
      <p className="mt-4 text-sm text-slate-500">Until then the website keeps showing the gallery that shipped with it, so nothing is broken in the meantime.</p>
    </Panel>
  );
}

export function AlbumForm({ album }: { album?: AlbumRow }) {
  const a = album;
  return (
    <AdminForm action={saveAlbum.bind(null, a?.id ?? null)} submitLabel={a ? "Save album" : "Create album"} tone={a ? "primary" : "gold"} className="@container">
      <div className="grid gap-4 @md:grid-cols-2 @3xl:grid-cols-4">
        <Input name="title" label="Album title" required defaultValue={a?.title} placeholder="Youth National Championship 2026" className="@md:col-span-2" />
        <Input name="label" label="Year or label" optional defaultValue={a?.label ?? ""} placeholder="2026" hint="Small text above the title" />
        <Input name="event_date" label="Event date" type="date" optional defaultValue={a?.event_date ?? ""} />
        <Textarea name="description" label="Description" optional defaultValue={a?.description ?? ""} placeholder="Where and when, who organised it…" className="@md:col-span-2 @3xl:col-span-4" />
      </div>
    </AdminForm>
  );
}

export function DeleteAlbumForm({ id, photos }: { id: string; photos: number }) {
  return (
    <AdminForm action={deleteAlbum.bind(null, id)} submitLabel="Delete album" pendingLabel="Deleting…" tone="danger">
      <Checkbox
        name="confirm"
        label={`Yes, delete this album and its ${photos} ${photos === 1 ? "photo" : "photos"}`}
        hint="Uploaded files are removed from storage too. This can't be undone."
      />
    </AdminForm>
  );
}
