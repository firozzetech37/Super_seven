"use client";

import { useActionState, useState } from "react";
import { AlertCircle, AtSign, BadgeInfo, FileCheck2, Hash, Landmark, Map as MapIcon, MapPin, Phone, Trophy, UploadCloud, UserRound, Users } from "lucide-react";
import { Fieldset, FormError, Honeypot, SelectField, TextField, TextareaField } from "@/components/forms/field";
import { FormActions } from "@/components/forms/form-actions";
import { FormSuccess } from "@/components/forms/form-success";
import { Reveal } from "@/components/motion/reveal";
import { registerDistrict } from "@/lib/actions/register";
import { idleState, indianStates } from "@/lib/forms";
import { districtSections, registerFormId } from "./sections";

const [association, contactPerson, teamsAndPlayers, certificate] = districtSections;

function formatSize(bytes: number) {
  return bytes >= 1024 * 1024 ? `${(bytes / (1024 * 1024)).toFixed(1)} MB` : `${Math.max(1, Math.round(bytes / 1024))} KB`;
}
import { cn } from "@/lib/utils";

export function DistrictForm() {
  const [state, action] = useActionState(registerDistrict, idleState);
  const errors = state.errors ?? {};
  const values = state.values ?? {};
  const [file, setFile] = useState<{ name: string; size: number } | null>(null);

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

  // React resets the form after each submission, clearing the file input; keep the dropzone label in step.
  return (
    <form id={registerFormId} action={action} onReset={() => setFile(null)} className="space-y-6">
      <FormError message={state.status === "error" ? state.message : undefined} />
      <Honeypot />

      <Reveal stagger={110} className="space-y-6">
        <Fieldset legend={association.title} id={association.id} icon={association.icon} step={1}>
          <TextField name="associationName" label="Association name" icon={Landmark} defaultValue={values.associationName} error={errors.associationName} className="sm:col-span-2" />
          <TextField name="registrationNumber" label="Registration number" icon={Hash} defaultValue={values.registrationNumber} error={errors.registrationNumber} hint="As on the society or trust certificate." />
          <TextField name="district" label="District" icon={MapPin} defaultValue={values.district} error={errors.district} />
          <SelectField name="state" label="State or union territory" icon={MapIcon} options={indianStates} defaultValue={values.state} error={errors.state} className="sm:col-span-2" />
        </Fieldset>

        <Fieldset legend={contactPerson.title} id={contactPerson.id} icon={contactPerson.icon} step={2}>
          <TextField name="contactPerson" label="Name" icon={UserRound} autoComplete="name" defaultValue={values.contactPerson} error={errors.contactPerson} />
          <TextField name="designation" label="Designation" icon={BadgeInfo} placeholder="e.g. Secretary" defaultValue={values.designation} error={errors.designation} />
          <TextField name="phone" label="Phone" icon={Phone} type="tel" inputMode="tel" placeholder="+91 98765 43210" defaultValue={values.phone} error={errors.phone} />
          <TextField name="email" label="Email" icon={AtSign} type="email" autoComplete="email" defaultValue={values.email} error={errors.email} />
          <TextareaField name="address" label="Full address" rows={3} defaultValue={values.address} error={errors.address} className="sm:col-span-2" />
        </Fieldset>

        <Fieldset legend={teamsAndPlayers.title} id={teamsAndPlayers.id} icon={teamsAndPlayers.icon} step={3} description="Rough numbers are fine; SSCFI confirms them during review.">
          <TextField name="teamsCount" label="Teams" icon={Trophy} type="number" inputMode="numeric" min={0} defaultValue={values.teamsCount} error={errors.teamsCount} />
          <TextField name="playersCount" label="Players" icon={Users} type="number" inputMode="numeric" min={0} defaultValue={values.playersCount} error={errors.playersCount} />
        </Fieldset>

        <Fieldset legend={certificate.title} id={certificate.id} icon={certificate.icon} step={4} description="PDF, JPG or PNG up to 5 MB. If the upload fails, SSCFI will request it by email.">
          <div className="sm:col-span-2">
            <label
              htmlFor="certificate"
              className={cn(
                "group/drop relative flex cursor-pointer flex-col items-center justify-center gap-2 overflow-hidden rounded-3xl border-2 border-dashed px-6 py-10 text-center transition duration-300 hover:border-royal hover:bg-royal/[0.03] has-[:focus-visible]:border-royal has-[:focus-visible]:ring-4 has-[:focus-visible]:ring-royal/15",
                errors.certificate ? "border-ball bg-ball/[0.03]" : file ? "border-ground/60 bg-status-onboarded/10" : "border-line bg-surface/60",
              )}
            >
              <span
                aria-hidden="true"
                className={cn(
                  "grid size-16 place-items-center rounded-2xl shadow-[0_12px_24px_rgba(15,46,99,0.12)] ring-1 transition duration-300 group-hover/drop:-translate-y-1 group-hover/drop:-rotate-6",
                  file ? "bg-ground text-white ring-ground" : "bg-white text-royal ring-line group-hover/drop:bg-royal group-hover/drop:text-white",
                )}
              >
                {file ? <FileCheck2 className="size-7" /> : <UploadCloud className="size-7" />}
              </span>
              <span className="mt-2 font-heading text-lg font-bold text-navy">{file ? "File ready to upload" : "Choose a file to upload"}</span>
              <span className="text-sm text-slate-500">
                {file ? `${file.name} · ${formatSize(file.size)}` : "Optional now, required before approval."}
              </span>
              <span aria-hidden="true" className="mt-1 flex flex-wrap justify-center gap-1.5">
                {["PDF", "JPG", "PNG", "Up to 5 MB"].map((t) => (
                  <span key={t} className="rounded-full bg-white px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500 ring-1 ring-line">
                    {t}
                  </span>
                ))}
              </span>
              <input
                id="certificate"
                name="certificate"
                type="file"
                accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png"
                aria-invalid={errors.certificate ? true : undefined}
                aria-describedby="certificate-message"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  setFile(f ? { name: f.name, size: f.size } : null);
                }}
                className="mt-3 block w-full max-w-xs cursor-pointer text-sm text-slate-500 file:mr-3 file:cursor-pointer file:rounded-full file:border-0 file:bg-navy file:px-4 file:py-2 file:text-sm file:font-bold file:text-white file:transition hover:file:bg-royal focus-visible:outline-none"
              />
            </label>
            <p
              id="certificate-message"
              aria-live="polite"
              className={cn("mt-1.5 flex min-h-5 items-start gap-1.5 text-xs leading-5", errors.certificate ? "font-bold text-ball" : "text-slate-500")}
            >
              {errors.certificate ? <AlertCircle className="mt-[3px] size-3.5 shrink-0" aria-hidden="true" /> : null}
              {errors.certificate}
            </p>
          </div>
        </Fieldset>

        <FormActions label="Submit registration" pendingLabel="Submitting…" note="Approved districts turn green on the map." />
      </Reveal>
    </form>
  );
}
