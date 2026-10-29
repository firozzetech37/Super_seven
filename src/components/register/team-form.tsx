"use client";

import { useActionState, useState } from "react";
import { Award, Crown, ListOrdered, Map as MapIcon, MapPin, Phone, Shield, UserRound } from "lucide-react";
import { Fieldset, FormError, Honeypot, SelectField, TextField, TextareaField } from "@/components/forms/field";
import { FormActions } from "@/components/forms/form-actions";
import { FormSuccess } from "@/components/forms/form-success";
import { Reveal } from "@/components/motion/reveal";
import { registerTeam } from "@/lib/actions/register";
import { idleState, indianStates } from "@/lib/forms";
import { registerFormId, teamSections } from "./sections";

const [team, captaincy, squad, coach] = teamSections;

/** Non-empty lines in the squad box, shown as a live count beside the hint. */
function countNames(text: string) {
  return text.split("\n").filter((line) => line.trim() !== "").length;
}

export function TeamForm() {
  const [state, action] = useActionState(registerTeam, idleState);
  const errors = state.errors ?? {};
  const values = state.values ?? {};
  const [squadCount, setSquadCount] = useState(() => countNames(values.squad ?? ""));

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
    <form id={registerFormId} action={action} className="space-y-6">
      <FormError message={state.status === "error" ? state.message : undefined} />
      <Honeypot />

      <Reveal stagger={110} className="space-y-6">
      <Fieldset legend={team.title} id={team.id} icon={team.icon} step={1}>
        <TextField name="teamName" label="Team or club name" icon={Shield} defaultValue={values.teamName} error={errors.teamName} className="sm:col-span-2" />
        <TextField name="city" label="City" icon={MapPin} autoComplete="address-level2" defaultValue={values.city} error={errors.city} />
        <SelectField name="state" label="State or union territory" icon={MapIcon} options={indianStates} defaultValue={values.state} error={errors.state} />
      </Fieldset>

      <Fieldset legend={captaincy.title} id={captaincy.id} icon={captaincy.icon} step={2}>
        <TextField name="captainName" label="Captain" icon={Crown} defaultValue={values.captainName} error={errors.captainName} />
        <TextField name="captainMobile" label="Captain's mobile" icon={Phone} type="tel" inputMode="tel" placeholder="+91 98765 43210" defaultValue={values.captainMobile} error={errors.captainMobile} />
        <TextField name="viceCaptainName" label="Vice-captain" icon={Award} defaultValue={values.viceCaptainName} error={errors.viceCaptainName} className="sm:col-span-2" />
      </Fieldset>

      <Fieldset legend={squad.title} id={squad.id} icon={squad.icon} step={3} description="Twelve players: seven on the field plus five substitutes.">
        <TextareaField
          name="squad"
          label="Players"
          rows={12}
          placeholder={"One name per line, for example:\nRahul Sharma\nPriya Das\n…"}
          defaultValue={values.squad}
          error={errors.squad}
          onChange={(e) => setSquadCount(countNames(e.target.value))}
          hint={`Exactly 12 names, one per line. ${squadCount} of 12 so far.`}
          className="sm:col-span-2"
        />
      </Fieldset>

      <Fieldset legend={coach.title} id={coach.id} icon={coach.icon} step={4}>
        <TextField name="coachName" label="Name" icon={UserRound} defaultValue={values.coachName} error={errors.coachName} />
        <TextField name="coachContact" label="Mobile" icon={Phone} type="tel" inputMode="tel" placeholder="+91 98765 43210" defaultValue={values.coachContact} error={errors.coachContact} />
        <TextareaField
          name="previousTournaments"
          label="Previous tournaments"
          icon={ListOrdered}
          optional
          rows={3}
          placeholder="Tournament, city and year"
          defaultValue={values.previousTournaments}
          error={errors.previousTournaments}
          className="sm:col-span-2"
        />
      </Fieldset>

      <FormActions label="Submit registration" pendingLabel="Submitting…" note="The team certificate is emailed after review." />
      </Reveal>
    </form>
  );
}
