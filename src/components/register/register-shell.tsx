import Link from "next/link";
import { ArrowRight, Lock } from "lucide-react";
import { RegistrationSteps } from "./registration-steps";

const forms = [
  { label: "Player", href: "/register/player" },
  { label: "Team or club", href: "/register/team" },
  { label: "District Association", href: "/register/district" },
];

/** Form on the left, "what happens next" and the other forms on the right. */
export function RegisterShell({ current, children }: { current: string; children: React.ReactNode }) {
  return (
    <section className="bg-surface py-12 lg:py-16">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[1fr_340px]">
        <div className="min-w-0">{children}</div>
        <aside className="space-y-6 lg:sticky lg:top-20 lg:h-fit">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-royal">What happens next</p>
            <div className="mt-3">
              <RegistrationSteps compact />
            </div>
          </div>
          <div className="flex items-start gap-3 rounded-2xl bg-white p-5 text-sm text-slate-600 ring-1 ring-line">
            <Lock className="mt-0.5 size-4 shrink-0 text-royal" aria-hidden="true" />
            <p>
              Forms are stored securely and reviewed by SSCFI. Only name, Player ID, state and category ever appear in
              the public directory. Dates of birth and guardian names stay private.
            </p>
          </div>
          <div className="rounded-2xl bg-white p-5 ring-1 ring-line">
            <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-royal">Other forms</p>
            <ul className="mt-3 divide-y divide-line">
              {forms
                .filter((f) => f.href !== current)
                .map((f) => (
                  <li key={f.href}>
                    <Link href={f.href} className="group flex items-center justify-between py-2.5 font-bold text-navy hover:text-royal">
                      {f.label}
                      <ArrowRight className="size-4 text-slate-300 transition group-hover:translate-x-1 group-hover:text-royal" aria-hidden="true" />
                    </Link>
                  </li>
                ))}
            </ul>
          </div>
        </aside>
      </div>
    </section>
  );
}
