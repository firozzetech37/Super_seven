import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { NotFoundPanel } from "@/components/layout/not-found-panel";
import { Ticker } from "@/components/layout/ticker";

/** Addresses that match no route: shown outside the site layout, so it brings its own header and footer. */
export default function NotFound() {
  return (
    <>
      <Header />
      <Ticker />
      <NotFoundPanel as="main" className="flex-1" />
      <Footer />
    </>
  );
}
