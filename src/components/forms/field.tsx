import { AlertCircle, Check, ChevronDown, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

/*
 * Form primitives shared by the enquiry and registration forms.
 * Controls sit on a soft surface fill, lift to white with a royal focus ring and halo, and turn red
 * either after a server-side error (aria-invalid) or once the browser's own validation has flagged
 * them after the person interacted (:user-invalid), so empty required fields are obvious before
 * anything reaches the server.
 */
const control =
  "peer w-full bg-surface/70 text-[15px] text-navy outline-none ring-1 ring-line shadow-[inset_0_1px_2px_rgba(15,46,99,0.04)] transition duration-200 placeholder:text-slate-400 hover:bg-white hover:ring-slate-300 focus:bg-white focus:shadow-[0_0_0_5px_rgba(28,79,160,0.12)] focus:ring-2 focus:ring-royal disabled:bg-surface user-invalid:bg-white user-invalid:ring-2 user-invalid:ring-ball/60 aria-[invalid=true]:bg-white aria-[invalid=true]:shadow-[0_0_0_5px_rgba(178,34,52,0.08)] aria-[invalid=true]:ring-2 aria-[invalid=true]:ring-ball";

export const inputClass = cn(control, "h-[3.25rem] rounded-2xl px-4");
export const selectClass = cn(control, "h-[3.25rem] cursor-pointer appearance-none rounded-2xl pl-4 pr-12");
export const textareaClass = cn(control, "min-h-32 rounded-2xl px-4 py-3.5 leading-relaxed");

/** Left padding when an inline icon sits inside the control. */
const withIcon = "pl-11";
const iconClass =
  "pointer-events-none absolute left-4 top-[1.625rem] size-[1.05rem] -translate-y-1/2 text-slate-400 transition-colors duration-200 peer-focus:text-royal peer-aria-[invalid=true]:text-ball";

type Common = {
  name: string;
  label: string;
  error?: string;
  hint?: string;
  optional?: boolean;
  className?: string;
  /** Decorative icon shown inside the control on the left. */
  icon?: LucideIcon;
};

function Wrapper({
  name,
  label,
  error,
  hint,
  optional,
  required,
  className,
  children,
}: Omit<Common, "icon"> & { required: boolean; children: React.ReactNode }) {
  return (
    <div className={cn("min-w-0", className)}>
      <label htmlFor={name} className="mb-2 flex items-baseline justify-between gap-3 text-sm font-bold text-navy">
        <span>
          {label}
          {required ? (
            <span aria-hidden="true" className="ml-0.5 text-gold-deep">
              *
            </span>
          ) : null}
        </span>
        {optional ? (
          <span className="rounded-full bg-surface px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400 ring-1 ring-line">
            Optional
          </span>
        ) : null}
      </label>
      {children}
      <p
        id={`${name}-message`}
        aria-live="polite"
        className={cn("mt-1.5 flex min-h-5 items-start gap-1.5 text-xs leading-5", error ? "font-bold text-ball" : "text-slate-500")}
      >
        {error ? <AlertCircle className="mt-[3px] size-3.5 shrink-0" aria-hidden="true" /> : null}
        {error ?? hint}
      </p>
    </div>
  );
}

function describedBy(name: string, error?: string, hint?: string) {
  return error || hint ? `${name}-message` : undefined;
}

export function TextField({
  error,
  hint,
  optional,
  className,
  icon: Icon,
  label,
  ...props
}: Common & Omit<React.ComponentProps<"input">, "name" | "className">) {
  const { name } = props;
  const required = !optional && props.required !== false;
  return (
    <Wrapper name={name} label={label} error={error} hint={hint} optional={optional} required={required} className={className}>
      <div className="relative">
        <input
          id={name}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy(name, error, hint)}
          required={required}
          className={cn(inputClass, Icon && withIcon)}
          {...props}
          aria-label={undefined}
        />
        {Icon ? <Icon className={iconClass} aria-hidden="true" /> : null}
      </div>
    </Wrapper>
  );
}

export function SelectField({
  error,
  hint,
  optional,
  className,
  options,
  placeholder = "Select…",
  icon: Icon,
  label,
  ...props
}: Common & { options: readonly (string | { value: string; label: string })[]; placeholder?: string } & Omit<
    React.ComponentProps<"select">,
    "name" | "className"
  >) {
  const { name } = props;
  const required = !optional && props.required !== false;
  return (
    <Wrapper name={name} label={label} error={error} hint={hint} optional={optional} required={required} className={className}>
      <div className="relative">
        {/* Keyed on the echoed value so the select keeps the chosen option after a server-side validation round-trip. */}
        <select
          key={String(props.defaultValue ?? "")}
          id={name}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy(name, error, hint)}
          required={required}
          className={cn(selectClass, Icon && withIcon)}
          {...props}
        >
          <option value="">{placeholder}</option>
          {options.map((o) => {
            const { value, label } = typeof o === "string" ? { value: o, label: o } : o;
            return (
              <option key={value} value={value}>
                {label}
              </option>
            );
          })}
        </select>
        {Icon ? <Icon className={iconClass} aria-hidden="true" /> : null}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute right-3 top-1/2 grid size-7 -translate-y-1/2 place-items-center rounded-full bg-white text-royal ring-1 ring-line transition duration-200 peer-focus:rotate-180 peer-focus:bg-royal peer-focus:text-white peer-focus:ring-royal"
        >
          <ChevronDown className="size-4" />
        </span>
      </div>
    </Wrapper>
  );
}

export function TextareaField({
  error,
  hint,
  optional,
  className,
  icon: Icon,
  label,
  ...props
}: Common & Omit<React.ComponentProps<"textarea">, "name" | "className">) {
  const { name } = props;
  const required = !optional && props.required !== false;
  return (
    <Wrapper name={name} label={label} error={error} hint={hint} optional={optional} required={required} className={className}>
      <div className="relative">
        <textarea
          id={name}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy(name, error, hint)}
          required={required}
          className={cn(textareaClass, Icon && withIcon)}
          {...props}
        />
        {Icon ? <Icon className={cn(iconClass, "top-[1.65rem]")} aria-hidden="true" /> : null}
      </div>
    </Wrapper>
  );
}

export function CheckboxField({
  name,
  label,
  error,
  className,
  ...props
}: { name: string; label: React.ReactNode; error?: string; className?: string } & Omit<
  React.ComponentProps<"input">,
  "name" | "className" | "type"
>) {
  return (
    <div className={className}>
      <label
        htmlFor={name}
        className={cn(
          "flex cursor-pointer items-start gap-3.5 rounded-2xl bg-surface/70 p-4 text-[15px] leading-relaxed text-slate-600 ring-1 transition duration-200 hover:bg-white hover:ring-royal/40 has-[:checked]:bg-royal/[0.05] has-[:checked]:ring-royal/40 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-royal",
          error ? "ring-ball/60" : "ring-line",
        )}
      >
        <span className="relative mt-0.5 grid size-5 shrink-0 place-items-center">
          <input
            key={String(props.defaultChecked ?? false)}
            id={name}
            name={name}
            type="checkbox"
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? `${name}-message` : undefined}
            className="peer size-5 cursor-pointer appearance-none rounded-md bg-white ring-1 ring-slate-300 transition duration-200 checked:bg-royal checked:ring-royal focus-visible:outline-none aria-[invalid=true]:ring-2 aria-[invalid=true]:ring-ball forced-colors:appearance-auto"
            {...props}
          />
          <Check
            aria-hidden="true"
            strokeWidth={3}
            className="pointer-events-none absolute size-3.5 scale-50 text-white opacity-0 transition duration-200 peer-checked:scale-100 peer-checked:opacity-100 forced-colors:hidden"
          />
        </span>
        <span>{label}</span>
      </label>
      {error ? (
        <p id={`${name}-message`} className="mt-1.5 flex items-start gap-1.5 pl-1 text-xs font-bold leading-5 text-ball">
          <AlertCircle className="mt-[3px] size-3.5 shrink-0" aria-hidden="true" />
          {error}
        </p>
      ) : null}
    </div>
  );
}

/**
 * Group of fields with a numbered header: an icon tile carrying a gold step badge, the legend, and
 * a faint outsized numeral behind the corner. The gradient border lights up while a field inside
 * has focus. `id` + `data-progress` let FormProgress track the section.
 */
export function Fieldset({
  legend,
  description,
  children,
  className,
  step,
  icon: Icon,
  id,
}: {
  legend: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
  step?: number;
  icon?: LucideIcon;
  id?: string;
}) {
  return (
    <fieldset
      id={id}
      data-progress={id ? legend : undefined}
      className={cn(
        "group/fs card-premium relative min-w-0 scroll-mt-40 overflow-hidden rounded-3xl bg-white p-5 shadow-[0_12px_30px_rgba(15,46,99,0.06)] ring-1 ring-line transition-shadow duration-300 focus-within:shadow-[0_26px_56px_rgba(15,46,99,0.12)] sm:p-8 lg:scroll-mt-24",
        className,
      )}
    >
      {step ? (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -right-1 -top-5 select-none font-heading text-[6.5rem] font-bold leading-none text-navy/[0.035] transition-colors duration-500 group-focus-within/fs:text-gold/[0.16] sm:text-[8rem]"
        >
          {String(step).padStart(2, "0")}
        </span>
      ) : null}
      <legend className="float-left mb-6 w-full">
        <span className="flex items-start gap-4">
          {Icon || step ? (
            <span aria-hidden="true" className="relative mt-0.5 shrink-0">
              <span className="grid size-12 place-items-center rounded-2xl bg-royal/10 text-royal transition duration-300 group-focus-within/fs:-rotate-6 group-focus-within/fs:bg-royal group-focus-within/fs:text-white group-hover/fs:-rotate-6">
                {Icon ? <Icon className="size-[1.35rem]" /> : <span className="font-heading text-lg font-bold">{step}</span>}
              </span>
              {Icon && step ? (
                <span className="absolute -right-1.5 -top-1.5 grid size-5 place-items-center rounded-full bg-gold text-[10px] font-bold text-navy ring-2 ring-white">
                  {step}
                </span>
              ) : null}
            </span>
          ) : null}
          <span className="min-w-0 pt-0.5">
            <span className="block font-heading text-xl font-bold leading-tight text-navy sm:text-2xl">{legend}</span>
            {description ? <span className="mt-1 block text-sm leading-relaxed text-slate-500">{description}</span> : null}
          </span>
        </span>
      </legend>
      <div className="relative clear-both grid gap-x-5 gap-y-2 sm:grid-cols-2">{children}</div>
    </fieldset>
  );
}

/** Hidden honeypot: bots fill it, people never see it. */
export function Honeypot() {
  return <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" />;
}

export function FormError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <div
      role="alert"
      className="flex items-start gap-3 rounded-2xl bg-ball/[0.07] px-5 py-4 text-[15px] text-ball ring-1 ring-ball/30 motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-top-2 motion-safe:duration-500"
    >
      <span aria-hidden="true" className="grid size-8 shrink-0 place-items-center rounded-full bg-ball text-white">
        <AlertCircle className="size-4" />
      </span>
      <p className="pt-1 font-bold">{message}</p>
    </div>
  );
}
