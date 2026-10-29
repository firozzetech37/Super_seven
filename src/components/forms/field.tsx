import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const control =
  "w-full bg-white text-navy outline-none ring-1 ring-line transition placeholder:text-slate-400 focus:ring-2 focus:ring-royal disabled:bg-surface aria-[invalid=true]:ring-2 aria-[invalid=true]:ring-ball";

export const inputClass = cn(control, "h-12 rounded-full px-5 text-[15px]");
export const selectClass = cn(control, "h-12 appearance-none rounded-full pl-5 pr-12 text-[15px]");
export const textareaClass = cn(control, "min-h-32 rounded-2xl px-5 py-3.5 text-[15px] leading-relaxed");

type Common = {
  name: string;
  label: string;
  error?: string;
  hint?: string;
  optional?: boolean;
  className?: string;
};

function Wrapper({
  name,
  label,
  error,
  hint,
  optional,
  className,
  children,
}: Common & { children: React.ReactNode }) {
  return (
    <div className={cn("min-w-0", className)}>
      <label htmlFor={name} className="mb-1.5 flex items-baseline justify-between gap-3 text-sm font-bold text-navy">
        {label}
        {optional ? <span className="text-xs font-normal text-slate-400">Optional</span> : null}
      </label>
      {children}
      <p id={`${name}-message`} aria-live="polite" className={cn("mt-1.5 min-h-4 text-xs", error ? "text-ball" : "text-slate-500")}>
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
  ...props
}: Common & Omit<React.ComponentProps<"input">, "name" | "className">) {
  const { name, label } = props;
  return (
    <Wrapper name={name} label={label} error={error} hint={hint} optional={optional} className={className}>
      <input
        id={name}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(name, error, hint)}
        required={!optional && props.required !== false}
        className={inputClass}
        {...props}
        aria-label={undefined}
      />
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
  ...props
}: Common & { options: readonly (string | { value: string; label: string })[]; placeholder?: string } & Omit<
    React.ComponentProps<"select">,
    "name" | "className"
  >) {
  const { name, label } = props;
  return (
    <Wrapper name={name} label={label} error={error} hint={hint} optional={optional} className={className}>
      <div className="relative">
        {/* Keyed on the echoed value so the select keeps the chosen option after a server-side validation round-trip. */}
        <select
          key={String(props.defaultValue ?? "")}
          id={name}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy(name, error, hint)}
          required={!optional && props.required !== false}
          className={selectClass}
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
        <ChevronDown className="pointer-events-none absolute right-5 top-1/2 size-4 -translate-y-1/2 text-royal" aria-hidden="true" />
      </div>
    </Wrapper>
  );
}

export function TextareaField({
  error,
  hint,
  optional,
  className,
  ...props
}: Common & Omit<React.ComponentProps<"textarea">, "name" | "className">) {
  const { name, label } = props;
  return (
    <Wrapper name={name} label={label} error={error} hint={hint} optional={optional} className={className}>
      <textarea
        id={name}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(name, error, hint)}
        required={!optional && props.required !== false}
        className={textareaClass}
        {...props}
      />
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
      <label htmlFor={name} className="flex items-start gap-3 text-[15px] text-slate-600">
        <input
          key={String(props.defaultChecked ?? false)}
          id={name}
          name={name}
          type="checkbox"
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${name}-message` : undefined}
          className="mt-1 size-4 shrink-0 accent-royal"
          {...props}
        />
        <span>{label}</span>
      </label>
      {error ? (
        <p id={`${name}-message`} className="mt-1.5 pl-7 text-xs text-ball">
          {error}
        </p>
      ) : null}
    </div>
  );
}

/** Group of fields with a numbered legend. */
export function Fieldset({
  legend,
  description,
  children,
  className,
}: {
  legend: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <fieldset className={cn("rounded-3xl bg-white p-6 ring-1 ring-line sm:p-8", className)}>
      <legend className="float-left mb-5 w-full">
        <span className="font-heading text-xl font-bold text-navy">{legend}</span>
        {description ? <span className="mt-1 block text-sm text-slate-500">{description}</span> : null}
      </legend>
      <div className="clear-both grid gap-x-5 gap-y-3 sm:grid-cols-2">{children}</div>
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
    <p role="alert" className="rounded-2xl bg-ball/10 px-5 py-3 text-[15px] font-bold text-ball ring-1 ring-ball/30">
      {message}
    </p>
  );
}
