import { Suspense } from "react";
import { AdminBar } from "@/components/layout/admin-bar";
import { BackToTop } from "@/components/layout/back-to-top";
import { Footer } from "@/components/layout/footer";
import { MobileCta } from "@/components/layout/mobile-cta";
import { Header } from "@/components/layout/header";
import { PageSkeleton } from "@/components/layout/page-skeleton";
import { Ticker } from "@/components/layout/ticker";
import { PageTransition } from "@/components/motion/page-transition";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* Only signed-in admins ever see this (it reads the URL, so it sits in its own boundary). */}
      <Suspense fallback={null}>
        <AdminBar />
      </Suspense>
      <Header />
      <Ticker />
      <main className="flex-1">
        {/* PageTransition keys on the URL, which pages built on demand (a new tournament or story) only know at request time. */}
        <Suspense fallback={<PageSkeleton />}>
          <PageTransition>{children}</PageTransition>
        </Suspense>
      </main>
      <Footer />
      <MobileCta />
      <BackToTop />
    </>
  );
}
