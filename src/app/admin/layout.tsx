import type { Metadata, Viewport } from "next";

export const metadata: Metadata = {
  title: { default: "Admin", template: "%s | SSCFI Admin" },
  robots: { index: false, follow: false },
  // "Add to Home Screen" gives an SSCFI Admin icon. It opens in the normal browser (minimal-ui, no iOS standalone
  // mode) so the emailed sign-in link and the icon share one session.
  manifest: "/admin-app/manifest.webmanifest",
  icons: { apple: "/admin-app/apple-touch-icon.png" },
  applicationName: "SSCFI Admin",
};

export const viewport: Viewport = { themeColor: "#0b2550" };

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-full flex-1 flex-col bg-surface">
      {/* The admin area is a tool, not a showcase: hide the site's page-load splash here. */}
      <style>{".splash{display:none!important}"}</style>
      {children}
    </div>
  );
}
