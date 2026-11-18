import { Suspense } from "react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { AlertCircle, CheckCircle2, MailCheck, ShieldCheck } from "lucide-react";
import { AdminForm } from "@/components/admin/admin-form";
import { Input } from "@/components/admin/fields";
import { GroundWatermark } from "@/components/layout/ground-watermark";
import { getAdmin } from "@/lib/admin/auth";
import { sendLoginLink } from "@/lib/admin/actions/auth";

export const metadata: Metadata = { title: "Sign in" };

const notices: Record<string, { tone: "error" | "ok"; text: string }> = {
  link: { tone: "error", text: "That sign-in link has expired or was opened in a different browser. Ask for a new one below." },
  denied: { tone: "error", text: "This account is not on the admin list. Ask an existing admin to add your email." },
  "signed-out": { tone: "ok", text: "You are signed out." },
};

async function Notice({ searchParams }: { searchParams: PageProps<"/admin/login">["searchParams"] }) {
  const params = await searchParams;
  if (!params.error && (await getAdmin())) redirect("/admin");
  const key = typeof params.error === "string" ? params.error : params["signed-out"] ? "signed-out" : null;
  const notice = key ? notices[key] : null;
  const next = typeof params.next === "string" ? params.next : "/admin";
  return (
    <>
      {notice ? (
        <p
          role={notice.tone === "error" ? "alert" : "status"}
          className={
            notice.tone === "error"
              ? "mb-5 flex gap-2 rounded-xl bg-ball/10 px-3.5 py-3 text-sm font-semibold text-ball ring-1 ring-ball/20"
              : "mb-5 flex gap-2 rounded-xl bg-emerald-50 px-3.5 py-3 text-sm font-semibold text-emerald-700 ring-1 ring-emerald-200"
          }
        >
          {notice.tone === "error" ? <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden="true" /> : <CheckCircle2 className="mt-0.5 size-4 shrink-0" aria-hidden="true" />}
          {notice.text}
        </p>
      ) : null}
      <AdminForm action={sendLoginLink} submitLabel="Email me a sign-in link" pendingLabel="Sending…" tone="gold" footerClassName="flex-col items-stretch [&>button]:h-12 [&>button]:w-full">
        <input type="hidden" name="next" value={next} />
        <Input name="email" label="Admin email" type="email" autoComplete="email" required placeholder="you@example.com" />
      </AdminForm>
    </>
  );
}

export default function LoginPage({ searchParams }: PageProps<"/admin/login">) {
  return (
    <div className="relative isolate grid min-h-dvh flex-1 place-items-center overflow-hidden bg-stadium px-4 py-12">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:22px_22px] [mask-image:radial-gradient(60%_60%_at_50%_40%,#000,transparent)]" />
        <GroundWatermark className="absolute left-1/2 top-1/2 w-[1100px] -translate-x-1/2 -translate-y-1/2 text-white/[0.05]" />
        <div className="absolute -right-24 -top-24 size-96 rounded-full bg-gold/15 blur-[110px]" />
      </div>

      <div className="w-full max-w-md">
        <div className="mb-8 flex flex-col items-center text-center text-white">
          <Image src="/brand/logo.png" alt="" width={72} height={72} className="size-[72px] rounded-full bg-white p-1 ring-4 ring-gold/50" priority />
          <p className="mt-5 text-[11px] font-bold uppercase tracking-[0.3em] text-gold">SSCFI · Admin</p>
          <h1 className="mt-2 font-heading text-3xl font-bold">Sign in to the control room</h1>
        </div>

        <div className="rounded-3xl bg-white p-6 shadow-[0_40px_90px_rgba(4,15,42,0.45)] sm:p-8">
          <Suspense fallback={<div className="h-40 animate-pulse rounded-2xl bg-surface" />}>
            <Notice searchParams={searchParams} />
          </Suspense>
          <ul className="mt-6 space-y-3 border-t border-line pt-5 text-sm leading-relaxed text-slate-500">
            <li className="flex gap-2.5">
              <MailCheck className="mt-0.5 size-4 shrink-0 text-royal" aria-hidden="true" />
              No password: we email a one-time link. Open it in this same browser.
            </li>
            <li className="flex gap-2.5">
              <ShieldCheck className="mt-0.5 size-4 shrink-0 text-royal" aria-hidden="true" />
              Only emails on the admin list can sign in. An existing admin adds new ones under Settings → Admins.
            </li>
          </ul>
        </div>

        <p className="mt-6 text-center text-sm text-white/60">
          <Link href="/" className="font-bold text-white/80 hover:text-white">
            ← Back to sscfi.org
          </Link>
        </p>
      </div>
    </div>
  );
}
