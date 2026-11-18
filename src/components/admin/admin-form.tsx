"use client";

import { createContext, useActionState, useContext, useEffect, useRef } from "react";
import { useFormStatus } from "react-dom";
import { AlertCircle, CheckCircle2, LoaderCircle } from "lucide-react";
import { toast } from "sonner";
import { buttonBase, buttonTones, type ButtonTone } from "@/components/admin/styles";
import { idle, type ActionResult } from "@/lib/admin/result";
import { cn } from "@/lib/utils";

type Action = (prev: ActionResult, formData: FormData) => Promise<ActionResult>;

/** Field errors from the last submission, read by the admin field components. */
const FormErrors = createContext<Record<string, string>>({});
export const useFieldError = (name: string) => useContext(FormErrors)[name];

function Submit({ children, tone, pendingLabel, small }: { children: React.ReactNode; tone: ButtonTone; pendingLabel: string; small?: boolean }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className={cn(buttonBase, buttonTones[tone], small && "h-9 px-3 text-[13px]")}>
      {pending ? <LoaderCircle className="size-4 animate-spin" aria-hidden="true" /> : null}
      {pending ? pendingLabel : children}
    </button>
  );
}

/**
 * Form for an admin server action: shows a pending state, the action's message beside the button,
 * and passes field errors to the admin fields inside it. `resetOnSuccess` clears the form after a save.
 */
export function AdminForm({
  action,
  children,
  submitLabel,
  pendingLabel = "Saving…",
  tone = "primary",
  resetOnSuccess = false,
  small = false,
  className,
  footerClassName,
  footer,
  inline = true,
}: {
  action: Action;
  children?: React.ReactNode;
  submitLabel: React.ReactNode;
  pendingLabel?: string;
  tone?: ButtonTone;
  resetOnSuccess?: boolean;
  small?: boolean;
  className?: string;
  footerClassName?: string;
  /** Extra controls placed after the submit button (e.g. a cancel link). */
  footer?: React.ReactNode;
  /** Show the result beside the button (false: toast only, for compact icon buttons). */
  inline?: boolean;
}) {
  // Toast straight from the action's reply: when an approval moves an item out of the list, this form
  // unmounts in the same update, so an effect would never get to show the message.
  const [state, formAction] = useActionState(async (prev: ActionResult, formData: FormData) => {
    const result = await action(prev, formData);
    if (result.message) {
      if (result.ok) toast.success(result.message);
      else toast.error(result.message);
    }
    return result;
  }, idle);
  const ref = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.ok && resetOnSuccess) ref.current?.reset();
  }, [state, resetOnSuccess]);

  return (
    <FormErrors value={state.errors ?? {}}>
      <form ref={ref} action={formAction} className={className}>
        {children}
        <div className={cn("flex flex-wrap items-center gap-x-3 gap-y-2", children ? "mt-5" : "", footerClassName)}>
          <Submit tone={tone} pendingLabel={pendingLabel} small={small}>
            {submitLabel}
          </Submit>
          {footer}
          {inline && state.message ? (
            <p
              key={state.at}
              data-at={state.at}
              role={state.ok ? "status" : "alert"}
              className={cn(
                "flex items-start gap-1.5 text-[13px] font-bold leading-5 motion-safe:animate-in motion-safe:fade-in",
                state.ok ? "text-emerald-700" : "text-ball",
              )}
            >
              {state.ok ? <CheckCircle2 className="mt-0.5 size-4 shrink-0" aria-hidden="true" /> : <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden="true" />}
              {state.message}
            </p>
          ) : null}
        </div>
      </form>
    </FormErrors>
  );
}
