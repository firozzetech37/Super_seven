import { AdminForm } from "@/components/admin/admin-form";
import { Checkbox, Input, Select, Textarea } from "@/components/admin/fields";
import { clearResult, deleteFixture, deleteTournament, importFixtures, saveFixture, saveResult, saveTournament } from "@/lib/admin/actions/fixtures";
import { stageOptions, statusOptions } from "@/lib/admin/fixtures-input";
import { indianStates, stateCodes } from "@/lib/forms";

export type TournamentRow = {
  id: string;
  slug: string;
  name: string;
  short_name: string | null;
  city: string | null;
  state_code: string | null;
  venue: string | null;
  season: string | null;
  start_date: string | null;
  end_date: string | null;
  format: string | null;
  notes: string | null;
};

export type FixtureRow = {
  id: string;
  stage: string;
  group_name: string | null;
  match_no: number | null;
  label: string | null;
  team_a: string;
  team_b: string;
  match_date: string | null;
  match_time: string | null;
  venue: string | null;
  status: string;
  results: {
    score_a: number | null;
    wickets_a: number | null;
    overs_a: number | null;
    score_b: number | null;
    wickets_b: number | null;
    overs_b: number | null;
    winner: "a" | "b" | "tie" | null;
    margin: string | null;
    man_of_match: string | null;
    notes: string | null;
  } | null;
};

const stateOptions = indianStates.map((name) => ({ value: stateCodes[name], label: name }));

export function TournamentForm({ tournament }: { tournament?: TournamentRow }) {
  const t = tournament;
  return (
    <AdminForm action={saveTournament.bind(null, t?.id ?? null)} className="@container" submitLabel={t ? "Save tournament" : "Create tournament"} tone={t ? "primary" : "gold"}>
      <div className="grid gap-4 @sm:grid-cols-2 @3xl:grid-cols-6">
        <Input name="name" label="Tournament name" required defaultValue={t?.name} placeholder="Youth National Championship" className="@sm:col-span-2 @3xl:col-span-4" />
        <Input name="short_name" label="Short name" optional defaultValue={t?.short_name ?? ""} placeholder="Youth National 2026" className="@3xl:col-span-2" hint="Shown in the ticker" />
        <Input name="city" label="City" optional defaultValue={t?.city ?? ""} className="@3xl:col-span-2" />
        <Select name="state_code" label="State" optional options={stateOptions} placeholder="Select…" defaultValue={t?.state_code ?? ""} className="@3xl:col-span-2" />
        <Input name="season" label="Season" optional defaultValue={t?.season ?? ""} placeholder="2026" className="@3xl:col-span-2" />
        <Input name="venue" label="Main venue" optional defaultValue={t?.venue ?? ""} placeholder="Abbasi Cricket Ground, Amroha" className="@sm:col-span-2 @3xl:col-span-4" />
        <Input name="start_date" label="Starts" type="date" optional defaultValue={t?.start_date ?? ""} className="@3xl:col-span-1" />
        <Input name="end_date" label="Ends" type="date" optional defaultValue={t?.end_date ?? ""} className="@3xl:col-span-1" />
        <Textarea name="format" label="Format" optional defaultValue={t?.format ?? ""} placeholder="Eight groups of three; group winners to the quarter-finals…" className="@sm:col-span-2 @3xl:col-span-3" />
        <Textarea name="notes" label="Notes for the public page" optional defaultValue={t?.notes ?? ""} className="@sm:col-span-2 @3xl:col-span-3" />
        {t ? (
          <Input
            name="slug"
            label="Web address"
            optional
            defaultValue={t.slug}
            hint={`sscfi.org/fixtures/${t.slug}`}
            className="@sm:col-span-2 @3xl:col-span-3"
          />
        ) : null}
      </div>
    </AdminForm>
  );
}

export function DeleteTournamentForm({ id }: { id: string }) {
  return (
    <AdminForm action={deleteTournament.bind(null, id)} submitLabel="Delete tournament" pendingLabel="Deleting…" tone="danger">
      <Checkbox name="confirm" label="Yes, delete this tournament with all its matches and results" hint="This can't be undone." />
    </AdminForm>
  );
}

export function FixtureForm({ tournamentId, fixture, venue }: { tournamentId: string; fixture?: FixtureRow; venue?: string | null }) {
  const f = fixture;
  return (
    <AdminForm
      action={saveFixture.bind(null, tournamentId, f?.id ?? null)} className="@container"
      submitLabel={f ? "Save match" : "Add match"}
      tone={f ? "primary" : "gold"}
      resetOnSuccess={!f}
    >
      <div className="grid gap-4 @sm:grid-cols-2 @3xl:grid-cols-6">
        <Input name="team_a" label="Team A" required list="team-names" defaultValue={f?.team_a} autoComplete="off" className="@3xl:col-span-2" />
        <Input name="team_b" label="Team B" required list="team-names" defaultValue={f?.team_b} autoComplete="off" className="@3xl:col-span-2" />
        <Select name="stage" label="Stage" options={stageOptions} defaultValue={f?.stage ?? "league"} className="@3xl:col-span-1" />
        <Input name="group_name" label="Group" optional defaultValue={f?.group_name ?? ""} placeholder="A" className="@3xl:col-span-1" />
        <Input name="match_date" label="Date" type="date" optional defaultValue={f?.match_date ?? ""} className="@3xl:col-span-2" />
        <Input name="match_time" label="Time" type="time" optional defaultValue={f?.match_time?.slice(0, 5) ?? ""} className="@3xl:col-span-1" />
        <Input name="match_no" label="Match no." type="number" min={1} optional defaultValue={f?.match_no ?? ""} className="@3xl:col-span-1" />
        <Input name="venue" label="Venue" optional defaultValue={f?.venue ?? venue ?? ""} className="@3xl:col-span-2" />
        <Input name="label" label="Label" optional defaultValue={f?.label ?? ""} placeholder="Semi-final 1" className="@3xl:col-span-3" hint="Optional title shown on the card" />
        <Select name="status" label="Status" options={statusOptions} defaultValue={f?.status ?? "scheduled"} className="@3xl:col-span-3" />
      </div>
    </AdminForm>
  );
}

export function ResultForm({ fixture }: { fixture: FixtureRow }) {
  const r = fixture.results;
  const status = ["live", "completed", "walkover", "abandoned"].includes(fixture.status) ? fixture.status : "completed";
  const side = (key: "a" | "b", team: string) => (
    <fieldset className="rounded-xl bg-surface/70 p-3 ring-1 ring-line">
      <legend className="px-1 text-sm font-bold text-navy">{team}</legend>
      <div className="grid grid-cols-3 gap-2">
        <Input name={`score_${key}`} label="Runs" type="number" min={0} inputMode="numeric" defaultValue={r?.[`score_${key}`] ?? ""} />
        <Input name={`wickets_${key}`} label="Wkts" type="number" min={0} max={7} inputMode="numeric" defaultValue={r?.[`wickets_${key}`] ?? ""} />
        <Input name={`overs_${key}`} label="Overs" inputMode="decimal" placeholder="7" defaultValue={r?.[`overs_${key}`] ?? ""} />
      </div>
    </fieldset>
  );
  return (
    <AdminForm action={saveResult.bind(null, fixture.id)} className="@container" submitLabel="Save result" tone="gold">
      <div className="grid gap-3 @xl:grid-cols-2">
        {side("a", fixture.team_a)}
        {side("b", fixture.team_b)}
      </div>
      <div className="mt-4 grid gap-4 @sm:grid-cols-2 @3xl:grid-cols-4">
        <Select
          name="status"
          label="Match status"
          options={[
            { value: "completed", label: "Completed" },
            { value: "live", label: "Live (partial score)" },
            { value: "walkover", label: "Walkover" },
            { value: "abandoned", label: "Abandoned" },
          ]}
          defaultValue={status}
        />
        <Select
          name="winner"
          label="Winner"
          options={[
            { value: "auto", label: "Work it out from the runs" },
            { value: "a", label: fixture.team_a },
            { value: "b", label: fixture.team_b },
            { value: "tie", label: "Tie" },
            { value: "none", label: "No result" },
          ]}
          defaultValue={r?.winner ?? "auto"}
        />
        <Input name="margin" label="Margin" optional placeholder="by 59 runs" defaultValue={r?.margin ?? ""} />
        <Input name="man_of_match" label="Player of the match" optional defaultValue={r?.man_of_match ?? ""} />
        <Input name="notes" label="Note" optional placeholder="Rain shortened to 5 overs" defaultValue={r?.notes ?? ""} className="@sm:col-span-2 @3xl:col-span-4" />
      </div>
    </AdminForm>
  );
}

/** Separate form (forms can't nest): removes the result and puts the match back to scheduled. */
export function ClearResultForm({ id }: { id: string }) {
  return <AdminForm action={clearResult.bind(null, id)} submitLabel="Clear result" pendingLabel="Clearing…" tone="quiet" small />;
}

export function DeleteFixtureForm({ id }: { id: string }) {
  return <AdminForm action={deleteFixture.bind(null, id)} submitLabel="Delete match" pendingLabel="Deleting…" tone="danger" small />;
}

export function ImportForm({ tournamentId }: { tournamentId: string }) {
  return (
    <AdminForm action={importFixtures.bind(null, tournamentId)} className="@container" submitLabel="Import matches" pendingLabel="Importing…" tone="gold" resetOnSuccess>
      <div className="grid gap-4 @3xl:grid-cols-2">
        <div>
          <label htmlFor="f-file" className="mb-1.5 block text-[12px] font-bold uppercase tracking-[0.08em] text-slate-500">
            CSV file
          </label>
          <input
            id="f-file"
            name="file"
            type="file"
            accept=".csv,text/csv,text/plain"
            className="block w-full cursor-pointer rounded-xl bg-white text-sm text-slate-600 ring-1 ring-line file:mr-3 file:cursor-pointer file:rounded-l-xl file:border-0 file:bg-navy file:px-4 file:py-2.5 file:text-sm file:font-bold file:text-white hover:file:bg-royal"
          />
          <p className="mt-2 text-xs leading-5 text-slate-500">
            Columns: <code className="rounded bg-surface px-1">match_no, stage, group, team_a, team_b, date, time, venue, label</code>. Only team_a and team_b are
            required. From Excel or Google Sheets: File → Download / Save as → CSV.
          </p>
        </div>
        <Textarea name="pasted" label="…or paste rows here" optional placeholder={"match_no,stage,group,team_a,team_b,date,time,venue\n1,league,A,Delhi,Punjab,05/12/2026,09:00,Abbasi Cricket Ground"} className="[&_textarea]:font-mono [&_textarea]:text-xs" />
      </div>
    </AdminForm>
  );
}
