import { registrationSteps } from "@/lib/forms";
import { cn } from "@/lib/utils";

/** The four-step process from the concept: Submit → Review → ID issued → Map updates. */
export function RegistrationSteps({ compact = false }: { compact?: boolean }) {
  return (
    <ol className={cn("grid gap-4", compact ? "grid-cols-1" : "sm:grid-cols-2 lg:grid-cols-4")}>
      {registrationSteps.map((s, i) => (
        <li key={s.n} className="relative flex gap-4 rounded-2xl bg-white p-5 ring-1 ring-line">
          {!compact && i < registrationSteps.length - 1 ? (
            <span aria-hidden="true" className="absolute -right-4 top-1/2 hidden h-px w-4 bg-gold-deep lg:block" />
          ) : null}
          <span className="grid size-10 shrink-0 place-items-center rounded-full bg-navy font-heading text-base font-bold text-white ring-4 ring-gold/70">
            {s.n}
          </span>
          <div>
            <p className="font-bold text-navy">{s.title}</p>
            <p className="mt-1 text-sm leading-snug text-slate-500">{s.text}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}
