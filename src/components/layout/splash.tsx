"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

/**
 * Branded page-load splash: logo in a gold ring with a spinning arc and an orbiting ball.
 * Shown on every full page load (client-side navigations use the progress bar instead);
 * fades out once the page has loaded, holding at least 1s and at most 1.8s.
 */
export function Splash() {
  const [phase, setPhase] = useState<"show" | "done" | "gone">("show");

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const min = reduce ? 300 : 1000;
    const start = performance.now();
    let release: number | undefined;
    const finish = () => {
      const wait = Math.max(0, min - (performance.now() - start));
      release = window.setTimeout(() => setPhase("done"), wait);
    };
    if (document.readyState === "complete") finish();
    else window.addEventListener("load", finish, { once: true });
    const cap = window.setTimeout(() => setPhase("done"), 1800);
    return () => {
      window.clearTimeout(release);
      window.clearTimeout(cap);
      window.removeEventListener("load", finish);
    };
  }, []);

  useEffect(() => {
    if (phase !== "done") return;
    const t = window.setTimeout(() => setPhase("gone"), 650);
    return () => window.clearTimeout(t);
  }, [phase]);

  if (phase === "gone") return null;

  return (
    <div
      aria-hidden="true"
      className={cn(
        "splash fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[radial-gradient(60%_60%_at_50%_40%,#1c4fa0,#0f2e63_60%,#0b2550)] text-white transition-opacity duration-600 ease-out",
        phase === "done" && "pointer-events-none opacity-0",
      )}
    >
      <div className="relative">
        <span aria-hidden="true" className="absolute -inset-6 rounded-full border-2 border-gold/15" />
        <span aria-hidden="true" className="absolute -inset-6 rounded-full border-[3px] border-transparent border-t-gold motion-safe:animate-[spin_1.1s_cubic-bezier(.4,.1,.3,1)_infinite]" />
        <span aria-hidden="true" className="absolute -inset-6 motion-safe:animate-orbit">
          <span className="absolute left-1/2 top-0 size-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-ball shadow-[0_2px_6px_rgba(0,0,0,0.4)] ring-2 ring-white/90" />
        </span>
        <span className="grid size-28 place-items-center rounded-full bg-white p-1 shadow-[0_24px_60px_rgba(4,15,42,0.6)]">
          <Image src="/brand/logo.png" alt="" width={112} height={112} priority className="size-full rounded-full object-cover" />
        </span>
      </div>
      <p className="mt-10 text-[11px] font-bold uppercase tracking-[0.34em] text-gold motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-2 motion-safe:duration-700 motion-safe:fill-mode-both motion-safe:delay-150">
        Seven players · Seven overs
      </p>
      <p className="mt-2 font-heading text-lg text-white/80 motion-safe:animate-in motion-safe:fade-in motion-safe:duration-700 motion-safe:fill-mode-both motion-safe:delay-300">
        Super Seven Cricket Federation of India
      </p>
    </div>
  );
}
