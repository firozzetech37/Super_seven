"use client";

import { useActionState, useState } from "react";
import { CheckboxField, Fieldset, FormError, Honeypot, SelectField, TextField } from "@/components/forms/field";
import { FormSuccess } from "@/components/forms/form-success";
import { SubmitButton } from "@/components/forms/submit-button";
import { registerPlayer } from "@/lib/actions/register";
import { idleState, indianStates, yearsBetween } from "@/lib/forms";

const bowlingStyles = ["Right-arm fast", "Right-arm medium", "Right-arm spin", "Left-arm fast", "Left-arm medium", "Left-arm spin", "None"];

function ageFrom(dob: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dob)) return null;
  const d = new Date(`${dob}T00:00:00Z`);
  return Number.isNaN(d.getTime()) ? null : yearsBetween(d, new Date());
}

export function PlayerForm() {
  const [state, action] = useActionState(registerPlayer, idleState);
  const errors = state.errors ?? {};
  const values = state.values ?? {};
  const [dob, setDob] = useState(values.dob ?? "");
  const age = ageFrom(dob);
  const minor = age !== null && age >= 0 && age < 18;

  if (state.status === "success") {
    return (
      <FormSuccess
        title="Player registration received"
        message={state.message}
        reference={state.reference}
        showSteps
        links={[
          { label: "Back to home", href: "/" },
          { label: "Register a team", href: "/register/team" },
        ]}
      />
    );
  }

  return (
    <form action={action} className="space-y-6">
      <FormError message={state.status === "error" ? state.message : undefined} />
      <Honeypot />

      <Fieldset legend="About you">
        <TextField name="fullName" label="Full name" autoComplete="name" defaultValue={values.fullName} error={errors.fullName} />
        <TextField name="guardianName" label="Father or guardian name" defaultValue={values.guardianName} error={errors.guardianName} />
        <TextField
          name="dob"
          label="Date of birth"
          type="date"
          defaultValue={values.dob}
          onChange={(e) => setDob(e.target.value)}
          error={errors.dob}
          hint={age !== null && age >= 0 ? `Age ${age}` : undefined}
        />
        <SelectField name="gender" label="Gender" options={["Male", "Female", "Other"]} defaultValue={values.gender} error={errors.gender} />
        {minor ? (
          <CheckboxField
            name="guardianConsent"
            label="I am the parent or guardian of this player and consent to this registration."
            defaultChecked={values.guardianConsent === "on"}
            error={errors.guardianConsent}
            className="sm:col-span-2"
          />
        ) : null}
      </Fieldset>

      <Fieldset legend="Contact">
        <TextField name="email" label="Email" type="email" autoComplete="email" defaultValue={values.email} error={errors.email} />
        <TextField name="mobile" label="Mobile" type="tel" inputMode="tel" autoComplete="tel" placeholder="+91 98765 43210" defaultValue={values.mobile} error={errors.mobile} />
      </Fieldset>

      <Fieldset legend="Address">
        <TextField name="address" label="Address" autoComplete="street-address" defaultValue={values.address} error={errors.address} className="sm:col-span-2" />
        <TextField name="city" label="City" autoComplete="address-level2" defaultValue={values.city} error={errors.city} />
        <TextField name="pincode" label="Pincode" inputMode="numeric" autoComplete="postal-code" maxLength={6} defaultValue={values.pincode} error={errors.pincode} />
        <SelectField name="state" label="State or union territory" options={indianStates} defaultValue={values.state} error={errors.state} className="sm:col-span-2" />
      </Fieldset>

      <Fieldset legend="Cricket" description="Category decides which championships you can enter.">
        <SelectField name="category" label="Category" options={["Junior", "Senior", "Women", "Corporate"]} defaultValue={values.category} error={errors.category} />
        <TextField name="club" label="Club or school" optional defaultValue={values.club} error={errors.club} />
        <SelectField name="battingStyle" label="Batting style" options={["Right-hand", "Left-hand"]} defaultValue={values.battingStyle} error={errors.battingStyle} />
        <SelectField name="bowlingStyle" label="Bowling style" options={bowlingStyles} defaultValue={values.bowlingStyle} error={errors.bowlingStyle} />
      </Fieldset>

      <div className="flex flex-wrap items-center gap-4">
        <SubmitButton pendingLabel="Submitting…">Submit registration</SubmitButton>
        <p className="text-sm text-slate-500">SSCFI calls back before issuing a Player ID.</p>
      </div>
    </form>
  );
}
