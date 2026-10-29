"use client";

import { useEffect } from "react";
import Link from "next/link";
import { RotateCcw } from "lucide-react";

/** Branded error boundary for the public site. */
export default function SiteError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="bg-stadium py-24 text-white">
      <div className="mx-auto max-w-2xl px-4 text-center sm:px-6">
        <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-gold">Something went wrong</p>
        <h1 className="mt-4 font-heading text-4xl font-bold">Rain stopped play</h1>
        <p className="mt-3 text-lg text-white/80">An unexpected error interrupted this page. Try again, or head back to the ground.</p>
        {error.digest ? <p className="mt-2 font-mono text-xs text-white/50">Reference {error.digest}</p> : null}
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <button type="button" onClick={reset} className="inline-flex items-center gap-2 rounded-full bg-gold px-6 py-3 font-bold text-navy transition hover:bg-gold-deep">
            <RotateCcw className="size-4" aria-hidden="true" />
            Try again
          </button>
          <Link href="/" className="rounded-full px-6 py-3 font-bold text-white ring-2 ring-white/60 transition hover:bg-white/10">
            Home
          </Link>
        </div>
      </div>
    </main>
  );
}
