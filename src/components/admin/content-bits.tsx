import { ArrowDown, ArrowUp, Database, Trash2 } from "lucide-react";
import { AdminForm } from "@/components/admin/admin-form";
import { Checkbox } from "@/components/admin/fields";
import { Panel } from "@/components/admin/ui";
import type { ActionResult } from "@/lib/admin/result";

type Action = (prev: ActionResult, formData: FormData) => Promise<ActionResult>;

/** Shown on the content pages until supabase/migrations/20261119000000_content.sql has been run. */
export function ContentSetupNeeded() {
  return (
    <Panel title="One step before you can edit this" icon={Database} className="ring-gold/50">
      <ol className="list-decimal space-y-2 pl-5 text-[15px] leading-relaxed text-slate-600">
        <li>
          Open your Supabase project → <strong className="text-navy">SQL Editor</strong> → New query.
        </li>
        <li>
          Paste everything from <code className="rounded bg-surface px-1.5 py-0.5 text-[13px] text-navy">supabase/migrations/20261119000000_content.sql</code> and press{" "}
          <strong className="text-navy">Run</strong>.
        </li>
        <li>Reload this page. Everything the website shows today (news, people, state units, officials and documents) will already be here, ready to edit.</li>
      </ol>
      <p className="mt-4 text-sm text-slate-500">Until then the website keeps showing the content that shipped with it, so nothing is broken in the meantime.</p>
    </Panel>
  );
}

/** Up / down arrows for a manually ordered list. */
export function MoveButtons({ up, down, first, last }: { up: Action; down: Action; first: boolean; last: boolean }) {
  return (
    <span className="flex items-center gap-1">
      <AdminForm action={up} submitLabel={<ArrowUp className="size-4" aria-label="Move up" />} pendingLabel="…" tone="quiet" small inline={false} footerClassName={first ? "hidden" : ""} />
      <AdminForm action={down} submitLabel={<ArrowDown className="size-4" aria-label="Move down" />} pendingLabel="…" tone="quiet" small inline={false} footerClassName={last ? "hidden" : ""} />
    </span>
  );
}

/** Delete button behind a confirmation tick. */
export function DeleteConfirm({ action, label, hint }: { action: Action; label: string; hint?: string }) {
  return (
    <AdminForm
      action={action}
      submitLabel={
        <>
          <Trash2 className="size-4" aria-hidden="true" />
          Delete
        </>
      }
      pendingLabel="Deleting…"
      tone="danger"
      small
      className="rounded-xl bg-ball/[0.03] p-3 ring-1 ring-ball/15"
      footerClassName="mt-3"
    >
      <Checkbox name="confirm" label={label} hint={hint ?? "This can't be undone."} />
    </AdminForm>
  );
}
