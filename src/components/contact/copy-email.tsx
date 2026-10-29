"use client";

import { useEffect, useState } from "react";
import { Check, Copy } from "lucide-react";

/** Small "Copy" pill beside an email address, with a short confirmation announced to screen readers. */
export function CopyEmail({ email }: { email: string }) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const t = window.setTimeout(() => setCopied(false), 2000);
    return () => window.clearTimeout(t);
  }, [copied]);

  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(email);
          setCopied(true);
        } catch {
          // Clipboard blocked: the address stays visible and selectable beside the button.
        }
      }}
      className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-white/10 px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.12em] text-white/80 ring-1 ring-white/20 transition hover:bg-white/20 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
    >
      {copied ? <Check className="size-3.5 text-status-onboarded" aria-hidden="true" /> : <Copy className="size-3.5" aria-hidden="true" />}
      <span aria-live="polite">{copied ? "Copied" : "Copy"}</span>
      <span className="sr-only"> email address</span>
    </button>
  );
}
