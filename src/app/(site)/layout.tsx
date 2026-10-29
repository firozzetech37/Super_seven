import { BackToTop } from "@/components/layout/back-to-top";
import { Footer } from "@/components/layout/footer";
import { MobileCta } from "@/components/layout/mobile-cta";
import { Header } from "@/components/layout/header";
import { Ticker } from "@/components/layout/ticker";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <Ticker />
      <main className="flex-1">{children}</main>
      <Footer />
      <MobileCta />
      <BackToTop />
    </>
  );
}
