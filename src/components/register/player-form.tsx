"use client";

import { useActionState, useState } from "react";
import { AtSign, Building, CalendarDays, CircleDot, CircleUserRound, Hand, Hash, Map as MapIcon, MapPin, Phone, School, Trophy, UserRound, Users } from "lucide-react";
import { CheckboxField, Fieldset, FormError, Honeypot, SelectField, TextField } from "@/components/forms/field";
import { FormActions } from "@/components/forms/form-actions";
import { FormSuccess } from "@/components/forms/form-success";
import { Reveal } from "@/components/motion/reveal";
import { registerPlayer } from "@/lib/actions/register";
import { idleState, indianStates, yearsBetween } from "@/lib/forms";
import { playerSections, registerFormId } from "./sections";

const [aboutYou, contact, address, cricket] = playerSections;

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
    <form id={registerFormId} action={action} className="space-y-6">
      <FormError message={state.status === "error" ? state.message : undefined} />
      <Honeypot />

      <Reveal stagger={110} className="space-y-6">
        <Fieldset legend={aboutYou.title} id={aboutYou.id} icon={aboutYou.icon} step={1}>
          <TextField name="fullName" label="Full name" icon={UserRound} autoComplete="name" defaultValue={values.fullName} error={errors.fullName} />
          <TextField name="guardianName" label="Father or guardian name" icon={Users} defaultValue={values.guardianName} error={errors.guardianName} />
          <TextField
            name="dob"
            label="Date of birth"
            icon={CalendarDays}
            type="date"
            defaultValue={values.dob}
            onChange={(e) => setDob(e.target.value)}
            error={errors.dob}
            hint={age !== null && age >= 0 ? (minor ? `Age ${age}. A parent or guardian confirms consent below.` : `Age ${age}`) : undefined}
          />
          <SelectField name="gender" label="Gender" icon={CircleUserRound} options={["Male", "Female", "Other"]} defaultValue={values.gender} error={errors.gender} />
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

        <Fieldset legend={contact.title} id={contact.id} icon={contact.icon} step={2}>
          <TextField name="email" label="Email" icon={AtSign} type="email" autoComplete="email" defaultValue={values.email} error={errors.email} />
          <TextField name="mobile" label="Mobile" icon={Phone} type="tel" inputMode="tel" autoComplete="tel" placeholder="+91 98765 43210" defaultValue={values.mobile} error={errors.mobile} />
        </Fieldset>

        <Fieldset legend={address.title} id={address.id} icon={address.icon} step={3}>
          <TextField name="address" label="Address" icon={Building} autoComplete="street-address" defaultValue={values.address} error={errors.address} className="sm:col-span-2" />
          <TextField name="city" label="City" icon={MapPin} autoComplete="address-level2" defaultValue={values.city} error={errors.city} />
          <TextField name="pincode" label="Pincode" icon={Hash} inputMode="numeric" autoComplete="postal-code" maxLength={6} defaultValue={values.pincode} error={errors.pincode} />
          <SelectField name="state" label="State or union territory" icon={MapIcon} options={indianStates} defaultValue={values.state} error={errors.state} className="sm:col-span-2" />
        </Fieldset>

        <Fieldset legend={cricket.title} id={cricket.id} icon={cricket.icon} step={4} description="Category decides which championships you can enter.">
          <SelectField name="category" label="Category" icon={Trophy} options={["Junior", "Senior", "Women", "Corporate"]} defaultValue={values.category} error={errors.category} />
          <TextField name="club" label="Club or school" icon={School} optional defaultValue={values.club} error={errors.club} />
          <SelectField name="battingStyle" label="Batting style" icon={Hand} options={["Right-hand", "Left-hand"]} defaultValue={values.battingStyle} error={errors.battingStyle} />
          <SelectField name="bowlingStyle" label="Bowling style" icon={CircleDot} options={bowlingStyles} defaultValue={values.bowlingStyle} error={errors.bowlingStyle} />
        </Fieldset>

        <FormActions label="Submit registration" pendingLabel="Submitting…" note="SSCFI calls back before issuing a Player ID." />
      </Reveal>
    </form>
  );
}
