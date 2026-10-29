import Link from "next/link";
import { Lock } from "lucide-react";
import { GroundWatermark } from "@/components/layout/ground-watermark";
import { cn } from "@/lib/utils";
import { SubmitButton } from "./submit-button";

/**
 * Closing band of a form: navy stadium panel with the gold submit button, a one-line note on what
 * happens next, and a reminder that starred fields are required. Must render inside the <form>.
 */
export function FormActions({
  label,
  pendingLabel,
  note,
  className,
}: {
  label: string;
  pendingLabel: string;
  note: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative isolate overflow-hidden rounded-3xl bg-stadium p-6 text-white shadow-[0_24px_50px_rgba(15,46,99,0.22)] ring-1 ring-white/10 sm:p-8",
        className,
      )}
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <GroundWatermark className="absolute -right-24 -top-16 w-[420px] text-white/[0.06]" />
        <div className="absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(217,174,86,0.8)_20%,rgba(217,174,86,0.8)_80%,transparent)]" />
      </div>
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="max-w-md">
          <p className="font-heading text-xl font-bold leading-snug">{note}</p>
          <p className="mt-2 flex items-start gap-2 text-sm text-white/65">
            <Lock className="mt-0.5 size-3.5 shrink-0 text-gold" aria-hidden="true" />
            <span>
              Fields marked <span className="font-bold text-gold">*</span> are required. See how we use your details in the{" "}
              <Link href="/privacy" className="font-bold text-white underline decoration-gold/60 underline-offset-4 hover:decoration-gold">
                Privacy Policy
              </Link>
              .
            </span>
          </p>
        </div>
        <SubmitButton pendingLabel={pendingLabel} className="w-full shrink-0 sm:w-auto">
          {label}
        </SubmitButton>
      </div>
    </div>
  );
}
