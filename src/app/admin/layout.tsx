import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { default: "Admin", template: "%s | SSCFI Admin" },
  robots: { index: false, follow: false },
};

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-full flex-1 flex-col bg-surface">
      {/* The admin area is a tool, not a showcase: hide the site's page-load splash here. */}
      <style>{".splash{display:none!important}"}</style>
      {children}
    </div>
  );
}
