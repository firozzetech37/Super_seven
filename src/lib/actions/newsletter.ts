"use server";

import { z } from "zod";
import { saveSubscriber, SubmissionError } from "@/lib/submissions";

export type NewsletterState = { status: "idle" | "success" | "error"; message?: string };

const schema = z.object({ email: z.email("Enter a valid email address") });

export async function subscribeNewsletter(_prev: NewsletterState, formData: FormData): Promise<NewsletterState> {
  // Honeypot: bots fill the hidden field, people never see it.
  if (formData.get("website")) return { status: "success", message: "Thanks, you're on the list." };

  const parsed = schema.safeParse({ email: String(formData.get("email") ?? "").trim() });
  if (!parsed.success) {
    return { status: "error", message: parsed.error.issues[0]?.message ?? "Enter a valid email address" };
  }
  try {
    const { alreadySubscribed } = await saveSubscriber(parsed.data.email);
    return {
      status: "success",
      message: alreadySubscribed
        ? "You're already on the list. Fixtures and results will reach you as they're published."
        : "Thanks, you're on the list. Fixtures and results will reach you as they're published.",
    };
  } catch (error) {
    return { status: "error", message: error instanceof SubmissionError ? error.message : "Something went wrong. Please try again." };
  }
}
