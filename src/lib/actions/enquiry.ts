"use server";

import { z } from "zod";
import { enquiryTypes, formValues, mobileSchema, requiredText, toErrors, type FormState } from "@/lib/forms";
import { saveEnquiry, SubmissionError } from "@/lib/submissions";

const schema = z.object({
  name: requiredText("Name"),
  mobile: mobileSchema,
  email: z.email("Enter a valid email address"),
  type: z.enum(enquiryTypes.map((t) => t.value) as [string, ...string[]], { message: "Choose a subject" }),
  role: z.string().trim().max(80).optional(),
  message: z.string().trim().min(20, "Tell us a little more (at least 20 characters)").max(2000, "Keep the message under 2000 characters"),
  consent: z.literal("on", { message: "Please agree so we can reply to you" }),
});

export async function sendEnquiry(_prev: FormState, formData: FormData): Promise<FormState> {
  if (formData.get("website")) return { status: "success", message: "Thanks, we'll be in touch.", reference: "enquiry-ok" };

  const values = formValues(formData);
  const parsed = schema.safeParse(values);
  if (!parsed.success) {
    return { status: "error", message: "Please check the highlighted fields.", errors: toErrors(parsed.error), values };
  }
  const { name, mobile, email, type, role, message } = parsed.data;
  try {
    const { reference } = await saveEnquiry({ name, mobile, email, type, role, message });
    return {
      status: "success",
      reference,
      message: "Thanks for writing to SSCFI. We reply to every enquiry, usually within three working days.",
    };
  } catch (error) {
    return { status: "error", message: error instanceof SubmissionError ? error.message : "Something went wrong. Please try again.", values };
  }
}
