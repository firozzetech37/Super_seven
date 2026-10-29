"use client";

import { useFormStatus } from "react-dom";
import { ArrowRight, LoaderCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export function SubmitButton({
  children,
  pendingLabel = "Sending…",
  className,
}: {
  children: React.ReactNode;
  pendingLabel?: string;
  className?: string;
}) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className={cn(
        "group inline-flex h-12 items-center justify-center gap-2 rounded-full bg-gold px-7 font-bold text-navy shadow-[0_10px_24px_rgba(4,15,42,0.25)] transition hover:-translate-y-0.5 hover:bg-gold-deep focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-royal/40 disabled:cursor-wait disabled:opacity-70 disabled:hover:translate-y-0",
        className,
      )}
    >
      {pending ? (
        <>
          <LoaderCircle className="size-4 animate-spin" aria-hidden="true" />
          {pendingLabel}
        </>
      ) : (
        <>
          {children}
          <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
        </>
      )}
    </button>
  );
}
