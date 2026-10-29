"use client";

import { useActionState } from "react";
import { CheckCircle2, Send } from "lucide-react";
import { cn } from "@/lib/utils";
import { subscribeNewsletter, type NewsletterState } from "@/lib/actions/newsletter";

const initial: NewsletterState = { status: "idle" };

/** Email sign-up used in the homepage band and on the News page. */
export function NewsletterForm({ tone = "dark", className }: { tone?: "dark" | "light"; className?: string }) {
  const [state, action, pending] = useActionState(subscribeNewsletter, initial);
  const dark = tone === "dark";

  if (state.status === "success") {
    return (
      <p
        role="status"
        className={cn(
          "flex items-center gap-2 rounded-2xl px-4 py-3 text-[15px] font-bold",
          dark ? "bg-white/10 text-white ring-1 ring-white/20" : "bg-status-onboarded/30 text-navy ring-1 ring-status-onboarded",
          className,
        )}
      >
        <CheckCircle2 className="size-5 shrink-0 text-gold" aria-hidden="true" />
        {state.message}
      </p>
    );
  }

  return (
    <form action={action} className={cn("w-full", className)}>
      <div className="flex flex-col gap-2 sm:flex-row">
        <label htmlFor="newsletter-email" className="sr-only">
          Email address
        </label>
        <input
          id="newsletter-email"
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="you@example.com"
          aria-invalid={state.status === "error" || undefined}
          aria-describedby="newsletter-message"
          className={cn(
            "h-12 w-full rounded-full px-5 text-[15px] outline-none ring-2 transition sm:flex-1",
            dark
              ? "bg-white text-navy ring-transparent placeholder:text-slate-400 focus:ring-gold"
              : "bg-white text-navy ring-line placeholder:text-slate-400 focus:ring-royal",
            state.status === "error" && "ring-ball",
          )}
        />
        <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" />
        <button
          type="submit"
          disabled={pending}
          className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-gold px-6 font-bold text-navy shadow-[0_8px_20px_rgba(4,15,42,0.3)] transition hover:bg-gold-deep disabled:opacity-70"
        >
          {pending ? "Sending…" : "Subscribe"}
          <Send className="size-4" aria-hidden="true" />
        </button>
      </div>
      <p id="newsletter-message" aria-live="polite" className={cn("mt-2 min-h-5 text-sm", state.status === "error" ? "text-ball" : dark ? "text-white/70" : "text-slate-500")}>
        {state.status === "error" ? state.message : "No spam. Unsubscribe with one click."}
      </p>
    </form>
  );
}
