"use client";

import { useActionState } from "react";
import { Upload } from "lucide-react";
import { Fieldset, FormError, Honeypot, SelectField, TextField, TextareaField } from "@/components/forms/field";
import { FormSuccess } from "@/components/forms/form-success";
import { SubmitButton } from "@/components/forms/submit-button";
import { registerDistrict } from "@/lib/actions/register";
import { idleState, indianStates } from "@/lib/forms";
import { cn } from "@/lib/utils";

export function DistrictForm() {
  const [state, action] = useActionState(registerDistrict, idleState);
  const errors = state.errors ?? {};
  const values = state.values ?? {};

  if (state.status === "success") {
    return (
      <FormSuccess
        title="District association registration received"
        message={state.message}
        reference={state.reference}
        showSteps
        links={[
          { label: "See the map", href: "/locations" },
          { label: "Back to home", href: "/" },
        ]}
      />
    );
  }

  return (
    <form action={action} className="space-y-6">
      <FormError message={state.status === "error" ? state.message : undefined} />
      <Honeypot />

      <Fieldset legend="Association">
        <TextField name="associationName" label="Association name" defaultValue={values.associationName} error={errors.associationName} className="sm:col-span-2" />
        <TextField name="registrationNumber" label="Registration number" defaultValue={values.registrationNumber} error={errors.registrationNumber} hint="As on the society or trust certificate." />
        <TextField name="district" label="District" defaultValue={values.district} error={errors.district} />
        <SelectField name="state" label="State or union territory" options={indianStates} defaultValue={values.state} error={errors.state} className="sm:col-span-2" />
      </Fieldset>

      <Fieldset legend="Contact person">
        <TextField name="contactPerson" label="Name" autoComplete="name" defaultValue={values.contactPerson} error={errors.contactPerson} />
        <TextField name="designation" label="Designation" placeholder="e.g. Secretary" defaultValue={values.designation} error={errors.designation} />
        <TextField name="phone" label="Phone" type="tel" inputMode="tel" placeholder="+91 98765 43210" defaultValue={values.phone} error={errors.phone} />
        <TextField name="email" label="Email" type="email" autoComplete="email" defaultValue={values.email} error={errors.email} />
        <TextareaField name="address" label="Full address" rows={3} defaultValue={values.address} error={errors.address} className="sm:col-span-2" />
      </Fieldset>

      <Fieldset legend="Teams and players today" description="Rough numbers are fine; SSCFI confirms them during review.">
        <TextField name="teamsCount" label="Teams" type="number" inputMode="numeric" min={0} defaultValue={values.teamsCount} error={errors.teamsCount} />
        <TextField name="playersCount" label="Players" type="number" inputMode="numeric" min={0} defaultValue={values.playersCount} error={errors.playersCount} />
      </Fieldset>

      <Fieldset legend="Registration certificate" description="PDF, JPG or PNG up to 5 MB. If the upload fails, SSCFI will request it by email.">
        <div className="sm:col-span-2">
          <label
            htmlFor="certificate"
            className={cn(
              "flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed px-6 py-8 text-center transition hover:border-royal hover:bg-surface",
              errors.certificate ? "border-ball" : "border-line",
            )}
          >
            <Upload className="size-6 text-royal" aria-hidden="true" />
            <span className="font-bold text-navy">Choose a file</span>
            <span className="text-sm text-slate-500">Optional now, required before approval.</span>
            <input
              id="certificate"
              name="certificate"
              type="file"
              accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png"
              aria-invalid={errors.certificate ? true : undefined}
              aria-describedby="certificate-message"
              className="mt-2 block w-full max-w-xs text-sm text-slate-500 file:mr-3 file:rounded-full file:border-0 file:bg-navy file:px-4 file:py-2 file:text-sm file:font-bold file:text-white"
            />
          </label>
          <p id="certificate-message" aria-live="polite" className={cn("mt-1.5 min-h-4 text-xs", errors.certificate ? "text-ball" : "text-slate-500")}>
            {errors.certificate}
          </p>
        </div>
      </Fieldset>

      <div className="flex flex-wrap items-center gap-4">
        <SubmitButton pendingLabel="Submitting…">Submit registration</SubmitButton>
        <p className="text-sm text-slate-500">Approved districts turn green on the map.</p>
      </div>
    </form>
  );
}
