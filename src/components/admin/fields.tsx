"use client";

import { useId } from "react";
import { ChevronDown } from "lucide-react";
import { useFieldError } from "@/components/admin/admin-form";
import { cn } from "@/lib/utils";

/* Compact form controls for the admin area. They read their error from the surrounding AdminForm. */

const control =
  "w-full bg-white text-sm text-navy outline-none ring-1 ring-line transition duration-150 placeholder:text-slate-400 hover:ring-slate-300 focus:ring-2 focus:ring-royal aria-[invalid=true]:ring-2 aria-[invalid=true]:ring-ball";

type Base = { name: string; label: string; hint?: string; className?: string; optional?: boolean };

function Frame({ id, name, label, hint, optional, className, children }: Base & { id: string; children: React.ReactNode }) {
  const error = useFieldError(name);
  return (
    <div className={cn("min-w-0", className)}>
      <label htmlFor={id} className="mb-1.5 flex items-baseline justify-between gap-2 text-[12px] font-bold uppercase tracking-[0.08em] text-slate-500">
        {label}
        {optional ? <span className="text-[10px] font-semibold normal-case tracking-normal text-slate-400">optional</span> : null}
      </label>
      {children}
      {error || hint ? (
        <p id={`${id}-msg`} className={cn("mt-1 text-xs leading-5", error ? "font-bold text-ball" : "text-slate-500")}>
          {error ?? hint}
        </p>
      ) : null}
    </div>
  );
}

export function Input({ name, label, hint, className, optional, ...props }: Base & Omit<React.ComponentProps<"input">, "name" | "className">) {
  const error = useFieldError(name);
  const id = useId();
  return (
    <Frame id={id} name={name} label={label} hint={hint} className={className} optional={optional}>
      <input
        id={id}
        name={name}
        aria-invalid={error ? true : undefined}
        aria-describedby={error || hint ? `${id}-msg` : undefined}
        className={cn(control, "h-10 rounded-xl px-3")}
        {...props}
      />
    </Frame>
  );
}

export function Select({
  name,
  label,
  hint,
  className,
  optional,
  options,
  placeholder,
  ...props
}: Base & { options: readonly { value: string; label: string }[]; placeholder?: string } & Omit<React.ComponentProps<"select">, "name" | "className">) {
  const error = useFieldError(name);
  const id = useId();
  return (
    <Frame id={id} name={name} label={label} hint={hint} className={className} optional={optional}>
      <div className="relative">
        <select
          id={id}
          name={name}
          aria-invalid={error ? true : undefined}
          className={cn(control, "h-10 cursor-pointer appearance-none rounded-xl pl-3 pr-9")}
          {...props}
        >
          {placeholder !== undefined ? <option value="">{placeholder}</option> : null}
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" aria-hidden="true" />
      </div>
    </Frame>
  );
}

export function Textarea({ name, label, hint, className, optional, ...props }: Base & Omit<React.ComponentProps<"textarea">, "name" | "className">) {
  const error = useFieldError(name);
  const id = useId();
  return (
    <Frame id={id} name={name} label={label} hint={hint} className={className} optional={optional}>
      <textarea
        id={id}
        name={name}
        aria-invalid={error ? true : undefined}
        className={cn(control, "min-h-24 rounded-xl px-3 py-2.5 leading-relaxed")}
        {...props}
      />
    </Frame>
  );
}

export function Checkbox({ name, label, hint, className, ...props }: Omit<Base, "optional"> & Omit<React.ComponentProps<"input">, "name" | "className" | "type">) {
  const error = useFieldError(name);
  return (
    <div className={className}>
      <label className="flex cursor-pointer items-start gap-2.5 text-sm font-semibold text-navy">
        <input type="checkbox" name={name} className="mt-0.5 size-4 shrink-0 cursor-pointer accent-royal" {...props} />
        <span>
          {label}
          {hint ? <span className="mt-0.5 block text-xs font-normal text-slate-500">{hint}</span> : null}
        </span>
      </label>
      {error ? <p className="mt-1 text-xs font-bold text-ball">{error}</p> : null}
    </div>
  );
}
