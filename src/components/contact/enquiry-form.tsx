"use client";

import { useActionState, useState } from "react";
import { AtSign, Briefcase, Clock3, MessageSquareText, Phone, Send, Tag, UserRound } from "lucide-react";
import { CheckboxField, FormError, Honeypot, SelectField, TextField, TextareaField } from "@/components/forms/field";
import { FormSuccess } from "@/components/forms/form-success";
import { SubmitButton } from "@/components/forms/submit-button";
import { sendEnquiry } from "@/lib/actions/enquiry";
import { enquiryTypes, idleState, type EnquiryType } from "@/lib/forms";

export function EnquiryForm({ defaultType = "general", defaultRole = "" }: { defaultType?: EnquiryType; defaultRole?: string }) {
  const [state, action] = useActionState(sendEnquiry, idleState);
  const errors = state.errors ?? {};
  const values = state.values ?? {};
  const [length, setLength] = useState(() => (values.message ?? "").trim().length);

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
    <form
      action={action}
      className="group/form card-premium relative space-y-6 overflow-hidden rounded-3xl bg-white p-5 shadow-[0_18px_40px_rgba(15,46,99,0.08)] ring-1 ring-line transition-shadow duration-300 focus-within:shadow-[0_28px_60px_rgba(15,46,99,0.14)] sm:p-8"
    >
      <span aria-hidden="true" className="pointer-events-none absolute -right-24 -top-24 size-64 rounded-full bg-gold/10 blur-3xl" />
      <div className="relative flex flex-wrap items-start justify-between gap-4 border-b border-line pb-6">
        <div className="flex items-start gap-4">
          <span aria-hidden="true" className="grid size-12 shrink-0 place-items-center rounded-2xl bg-royal/10 text-royal transition duration-300 group-focus-within/form:-rotate-6 group-focus-within/form:bg-royal group-focus-within/form:text-white">
            <Send className="size-5" />
          </span>
          <div>
            <h3 className="font-heading text-2xl font-bold text-navy">Send an enquiry</h3>
            <p className="mt-0.5 text-sm text-slate-500">
              Fields marked <span className="font-bold text-gold-deep">*</span> are required.
            </p>
          </div>
        </div>
        <span className="inline-flex items-center gap-2 rounded-full bg-surface px-3 py-1.5 text-xs font-bold text-slate-600 ring-1 ring-line">
          <Clock3 className="size-3.5 text-royal" aria-hidden="true" />
          Every message gets a reply
        </span>
      </div>
      <FormError message={state.status === "error" ? state.message : undefined} />
      <Honeypot />
      <div className="relative grid gap-x-5 gap-y-2 sm:grid-cols-2">
        <TextField name="name" label="Your name" icon={UserRound} autoComplete="name" placeholder="Full name" defaultValue={values.name} error={errors.name} />
        <TextField
          name="mobile"
          label="Mobile"
          icon={Phone}
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          placeholder="+91 98765 43210"
          defaultValue={values.mobile}
          error={errors.mobile}
        />
        <TextField name="email" label="Email" icon={AtSign} type="email" autoComplete="email" placeholder="you@example.com" defaultValue={values.email} error={errors.email} />
        <SelectField
          name="type"
          label="Subject"
          icon={Tag}
          options={enquiryTypes}
          placeholder="Choose a subject"
          defaultValue={values.type ?? defaultType}
          error={errors.type}
        />
        <TextField
          name="role"
          label="Role you are asking about"
          icon={Briefcase}
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
          icon={MessageSquareText}
          rows={6}
          placeholder="How can we help?"
          defaultValue={values.message}
          error={errors.message}
          onChange={(e) => setLength(e.target.value.trim().length)}
          hint={length >= 20 ? `${length} characters. Looks good.` : `At least 20 characters (${length} of 20).`}
          className="sm:col-span-2"
        />
      </div>
      <CheckboxField
        className="relative"
        name="consent"
        label="I agree that SSCFI may contact me about this enquiry."
        defaultChecked={values.consent === "on"}
        error={errors.consent}
      />
      <div className="relative flex flex-col gap-4 border-t border-line pt-6 sm:flex-row sm:items-center sm:justify-between">
        <p className="max-w-sm text-sm text-slate-500">We reply to every enquiry, usually within three working days.</p>
        <SubmitButton pendingLabel="Sending message…" className="w-full sm:w-auto">
          Send message
        </SubmitButton>
      </div>
    </form>
  );
}
