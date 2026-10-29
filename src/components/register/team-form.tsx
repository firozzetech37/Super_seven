"use client";

import { useActionState } from "react";
import { Fieldset, FormError, Honeypot, SelectField, TextField, TextareaField } from "@/components/forms/field";
import { FormSuccess } from "@/components/forms/form-success";
import { SubmitButton } from "@/components/forms/submit-button";
import { registerTeam } from "@/lib/actions/register";
import { idleState, indianStates } from "@/lib/forms";

export function TeamForm() {
  const [state, action] = useActionState(registerTeam, idleState);
  const errors = state.errors ?? {};
  const values = state.values ?? {};

  if (state.status === "success") {
    return (
      <FormSuccess
        title="Team registration received"
        message={state.message}
        reference={state.reference}
        showSteps
        links={[
          { label: "Back to home", href: "/" },
          { label: "Register a player", href: "/register/player" },
        ]}
      />
    );
  }

  return (
    <form action={action} className="space-y-6">
      <FormError message={state.status === "error" ? state.message : undefined} />
      <Honeypot />

      <Fieldset legend="Team">
        <TextField name="teamName" label="Team or club name" defaultValue={values.teamName} error={errors.teamName} className="sm:col-span-2" />
        <TextField name="city" label="City" autoComplete="address-level2" defaultValue={values.city} error={errors.city} />
        <SelectField name="state" label="State or union territory" options={indianStates} defaultValue={values.state} error={errors.state} />
      </Fieldset>

      <Fieldset legend="Captaincy">
        <TextField name="captainName" label="Captain" defaultValue={values.captainName} error={errors.captainName} />
        <TextField name="captainMobile" label="Captain's mobile" type="tel" inputMode="tel" placeholder="+91 98765 43210" defaultValue={values.captainMobile} error={errors.captainMobile} />
        <TextField name="viceCaptainName" label="Vice-captain" defaultValue={values.viceCaptainName} error={errors.viceCaptainName} className="sm:col-span-2" />
      </Fieldset>

      <Fieldset legend="Squad" description="Twelve players: seven on the field plus five substitutes.">
        <TextareaField
          name="squad"
          label="Players"
          rows={12}
          placeholder={"One name per line, for example:\nRahul Sharma\nPriya Das\n…"}
          defaultValue={values.squad}
          error={errors.squad}
          hint="Exactly 12 names, one per line."
          className="sm:col-span-2"
        />
      </Fieldset>

      <Fieldset legend="Coach or manager">
        <TextField name="coachName" label="Name" defaultValue={values.coachName} error={errors.coachName} />
        <TextField name="coachContact" label="Mobile" type="tel" inputMode="tel" placeholder="+91 98765 43210" defaultValue={values.coachContact} error={errors.coachContact} />
        <TextareaField
          name="previousTournaments"
          label="Previous tournaments"
          optional
          rows={3}
          placeholder="Tournament, city and year"
          defaultValue={values.previousTournaments}
          error={errors.previousTournaments}
          className="sm:col-span-2"
        />
      </Fieldset>

      <div className="flex flex-wrap items-center gap-4">
        <SubmitButton pendingLabel="Submitting…">Submit registration</SubmitButton>
        <p className="text-sm text-slate-500">The team certificate is emailed after review.</p>
      </div>
    </form>
  );
}
