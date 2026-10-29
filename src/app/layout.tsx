import type { Metadata } from "next";
import { Caladea, Carlito, Noto_Sans_Bengali } from "next/font/google";
import { Suspense } from "react";
import { NavProgress } from "@/components/layout/nav-progress";
import { Splash } from "@/components/layout/splash";
import "./globals.css";

const carlito = Carlito({
  subsets: ["latin"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
  variable: "--font-carlito",
  display: "swap",
});

const caladea = Caladea({
  subsets: ["latin"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
  variable: "--font-caladea",
  display: "swap",
});

const bengali = Noto_Sans_Bengali({
  subsets: ["bengali"],
  variable: "--font-bengali",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://sscfi.org"),
  title: {
    default: "Super Seven Cricket Federation of India",
    template: "%s | SSCFI",
  },
  description:
    "Super Seven Cricket Federation of India (SSCFI): seven players, seven overs. Teams, fixtures and results, rules, registration, careers, locations and contact.",
  openGraph: {
    type: "website",
    siteName: "SSCFI",
    locale: "en_IN",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${carlito.variable} ${caladea.variable} ${bengali.variable} h-full antialiased`}
    >
      <body id="top" className="flex min-h-full flex-col">
        {/* Runs before first paint: flags JS so scroll-reveal styles (and the splash) apply only when scripts run. */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
        <Splash />
        <Suspense fallback={null}>
          <NavProgress />
        </Suspense>
        {children}
      </body>
    </html>
  );
}
