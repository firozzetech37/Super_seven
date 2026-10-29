import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { registrationSteps } from "@/lib/forms";

/** Success panel shown in place of a submitted form. */
export function FormSuccess({
  title,
  message,
  reference,
  showSteps = false,
  links,
}: {
  title: string;
  message?: string;
  reference?: string;
  showSteps?: boolean;
  links: { label: string; href: string }[];
}) {
  return (
    <div role="status" className="overflow-hidden rounded-3xl bg-white shadow-[0_18px_40px_rgba(15,46,99,0.1)] ring-1 ring-line">
      <div aria-hidden="true" className="h-1.5 bg-gradient-to-r from-status-onboarded to-ground" />
      <div className="p-8 sm:p-10">
        <div className="flex items-start gap-4">
          <span className="grid size-12 shrink-0 place-items-center rounded-full bg-status-onboarded/40 text-ground">
            <CheckCircle2 className="size-7" aria-hidden="true" />
          </span>
          <div>
            <h2 className="font-heading text-2xl font-bold text-navy sm:text-3xl">{title}</h2>
            {message ? <p className="mt-2 text-[17px] leading-relaxed text-slate-600">{message}</p> : null}
          </div>
        </div>

        {reference ? (
          <dl className="mt-6 inline-flex flex-wrap items-center gap-x-3 gap-y-1 rounded-2xl bg-surface px-5 py-3 ring-1 ring-line">
            <dt className="text-[11px] font-bold uppercase tracking-[0.2em] text-royal">Reference</dt>
            <dd className="font-mono text-[15px] font-bold text-navy">{reference.toUpperCase()}</dd>
          </dl>
        ) : null}

        {showSteps ? (
          <ol className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {registrationSteps.map((s) => (
              <li key={s.n} className="rounded-2xl bg-surface p-4 ring-1 ring-line">
                <span className="grid size-8 place-items-center rounded-full bg-navy font-heading text-sm font-bold text-white">
                  {s.n}
                </span>
                <p className="mt-3 font-bold text-navy">{s.title}</p>
                <p className="mt-1 text-sm text-slate-500">{s.text}</p>
              </li>
            ))}
          </ol>
        ) : null}

        <ul className="mt-8 flex flex-wrap gap-3">
          {links.map((l, i) => (
            <li key={l.href}>
              <Link
                href={l.href}
                className={
                  i === 0
                    ? "group inline-flex items-center gap-2 rounded-full bg-navy px-6 py-3 font-bold text-white transition hover:bg-royal"
                    : "inline-flex items-center gap-2 rounded-full px-6 py-3 font-bold text-navy ring-1 ring-line transition hover:ring-royal"
                }
              >
                {l.label}
                {i === 0 ? <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden="true" /> : null}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
