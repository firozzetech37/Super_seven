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
        "group inline-flex h-14 items-center justify-center gap-3 rounded-full bg-gold pl-7 pr-2 text-[15px] font-bold text-navy shadow-[0_14px_30px_rgba(4,15,42,0.28)] transition duration-300 hover:-translate-y-0.5 hover:bg-gold-deep hover:shadow-[0_20px_40px_rgba(4,15,42,0.32)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-gold/50 focus-visible:ring-offset-2 focus-visible:ring-offset-navy disabled:cursor-wait disabled:opacity-80 disabled:hover:translate-y-0",
        className,
      )}
    >
      {pending ? (
        <>
          {pendingLabel}
          <span aria-hidden="true" className="grid size-10 place-items-center rounded-full bg-navy text-gold">
            <LoaderCircle className="size-4 animate-spin" />
          </span>
        </>
      ) : (
        <>
          {children}
          <span aria-hidden="true" className="grid size-10 place-items-center rounded-full bg-navy text-gold transition duration-300 group-hover:bg-white group-hover:text-navy">
            <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5" />
          </span>
        </>
      )}
    </button>
  );
}
