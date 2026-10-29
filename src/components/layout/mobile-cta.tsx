"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight, MessageCircle } from "lucide-react";
import { registerCta } from "@/lib/site";
import { cn } from "@/lib/utils";
import { usePastHero } from "./use-past-hero";

const hiddenOn = ["/register", "/contact"];

/** Sticky Register bar on phones and tablets; hidden on the pages it links to, and over the home hero. */
export function MobileCta() {
  const pathname = usePathname();
  const show = usePastHero();
  if (hiddenOn.some((p) => pathname.startsWith(p))) return null;
  return (
    <>
      <div aria-hidden="true" className="h-[4.5rem] lg:hidden" />
      <div
        data-mobile-cta
        aria-hidden={!show}
        inert={!show}
        className={cn(
          "fixed inset-x-0 bottom-0 z-30 border-t border-white/10 bg-navy-deep/95 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 text-white shadow-[0_-12px_30px_rgba(4,15,42,0.35)] backdrop-blur transition-[translate,opacity] duration-500 ease-[cubic-bezier(.2,.7,.2,1)] lg:hidden print:hidden",
          !show && "pointer-events-none translate-y-full opacity-0",
        )}
      >
        <div className="mx-auto flex max-w-xl items-center gap-3">
          <Link
            href={registerCta.href}
            className="group inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-full bg-gold font-bold text-navy transition active:scale-[0.98]"
          >
            Register with SSCFI
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
          </Link>
          <Link
            href="/contact"
            aria-label="Contact"
            className="grid size-12 shrink-0 place-items-center rounded-full bg-white/10 ring-1 ring-white/25 transition active:scale-[0.98]"
          >
            <MessageCircle className="size-5" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </>
  );
}
