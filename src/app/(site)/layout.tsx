import { Suspense } from "react";
import { AdminBar } from "@/components/layout/admin-bar";
import { BackToTop } from "@/components/layout/back-to-top";
import { Footer } from "@/components/layout/footer";
import { MobileCta } from "@/components/layout/mobile-cta";
import { Header } from "@/components/layout/header";
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
        <PageTransition>{children}</PageTransition>
      </main>
      <Footer />
      <MobileCta />
      <BackToTop />
    </>
  );
}
