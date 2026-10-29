"use client";

import { useActionState } from "react";
import { CheckboxField, FormError, Honeypot, SelectField, TextField, TextareaField } from "@/components/forms/field";
import { FormSuccess } from "@/components/forms/form-success";
import { SubmitButton } from "@/components/forms/submit-button";
import { sendEnquiry } from "@/lib/actions/enquiry";
import { enquiryTypes, idleState, type EnquiryType } from "@/lib/forms";

export function EnquiryForm({ defaultType = "general", defaultRole = "" }: { defaultType?: EnquiryType; defaultRole?: string }) {
  const [state, action] = useActionState(sendEnquiry, idleState);
  const errors = state.errors ?? {};
  const values = state.values ?? {};

  if (state.status === "success") {
    return (
      <FormSuccess
        title="Message sent"
        message={state.message}
        reference={state.reference}
        links={[
          { label: "Back to home", href: "/" },
          { label: "Fixtures & Results", href: "/fixtures" },
        ]}
      />
    );
  }

  return (
    <form action={action} className="space-y-5 rounded-3xl bg-white p-6 shadow-[0_18px_40px_rgba(15,46,99,0.08)] ring-1 ring-line sm:p-8">
      <FormError message={state.status === "error" ? state.message : undefined} />
      <Honeypot />
      <div className="grid gap-x-5 gap-y-3 sm:grid-cols-2">
        <TextField name="name" label="Your name" autoComplete="name" placeholder="Full name" defaultValue={values.name} error={errors.name} />
        <TextField
          name="mobile"
          label="Mobile"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          placeholder="+91 98765 43210"
          defaultValue={values.mobile}
          error={errors.mobile}
        />
        <TextField name="email" label="Email" type="email" autoComplete="email" placeholder="you@example.com" defaultValue={values.email} error={errors.email} />
        <SelectField
          name="type"
          label="Subject"
          options={enquiryTypes}
          placeholder="Choose a subject"
          defaultValue={values.type ?? defaultType}
          error={errors.type}
        />
        <TextField
          name="role"
          label="Role you are asking about"
          optional
          placeholder="e.g. Umpire, Scorer, Coach"
          defaultValue={values.role ?? defaultRole}
          error={errors.role}
          hint="For careers and corporate bookings."
          className="sm:col-span-2"
        />
        <TextareaField
          name="message"
          label="Message"
          placeholder="How can we help?"
          defaultValue={values.message}
          error={errors.message}
          hint="At least 20 characters."
          className="sm:col-span-2"
        />
      </div>
      <CheckboxField
        name="consent"
        label="I agree that SSCFI may contact me about this enquiry."
        defaultChecked={values.consent === "on"}
        error={errors.consent}
      />
      <div className="flex flex-wrap items-center gap-4 pt-1">
        <SubmitButton pendingLabel="Sending message…">Send message</SubmitButton>
        <p className="text-sm text-slate-500">We reply to every enquiry, usually within three working days.</p>
      </div>
    </form>
  );
}
