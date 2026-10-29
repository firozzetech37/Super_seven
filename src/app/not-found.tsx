import Link from "next/link";
import { ArrowRight, Search } from "lucide-react";
import { Footer } from "@/components/layout/footer";
import { GroundWatermark } from "@/components/layout/ground-watermark";
import { Header } from "@/components/layout/header";
import { Ticker } from "@/components/layout/ticker";

export default function NotFound() {
  return (
    <>
      <Header />
      <Ticker />
      <main className="relative isolate flex flex-1 items-center overflow-hidden bg-stadium py-20 text-white">
        <GroundWatermark className="pointer-events-none absolute -right-32 -top-24 w-[720px] text-white/[0.07]" />
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
          <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-gold">Error 404</p>
          <p className="mt-4 font-heading text-[6rem] font-bold leading-none tracking-tight sm:text-[8rem]">
            4<span className="text-gold">0</span>4
          </p>
          <h1 className="mt-4 font-heading text-3xl font-bold sm:text-4xl">That one went over the boundary</h1>
          <p className="mx-auto mt-3 max-w-xl text-lg text-white/80">
            The page you asked for isn&apos;t here. It may have moved when the site was rebuilt, or the link had a typo.
          </p>
          <form action="/search" role="search" className="mx-auto mt-8 flex max-w-md gap-2">
            <label htmlFor="nf-search" className="sr-only">
              Search the site
            </label>
            <input
              id="nf-search"
              name="q"
              type="search"
              placeholder="Search teams, fixtures, rules…"
              className="h-12 flex-1 rounded-full bg-white px-5 text-navy outline-none ring-2 ring-transparent placeholder:text-slate-400 focus:ring-gold"
            />
            <button type="submit" className="grid size-12 place-items-center rounded-full bg-gold text-navy transition hover:bg-gold-deep" aria-label="Search">
              <Search className="size-5" />
            </button>
          </form>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/" className="group inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 font-bold text-navy transition hover:bg-gold">
              Back to the ground
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
            </Link>
            <Link href="/fixtures" className="rounded-full px-6 py-3 font-bold text-white ring-2 ring-white/60 transition hover:bg-white/10">
              Fixtures & Results
            </Link>
            <Link href="/contact" className="rounded-full px-6 py-3 font-bold text-white ring-2 ring-white/60 transition hover:bg-white/10">
              Contact
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
