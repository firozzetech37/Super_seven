"use client";

import { usePathname } from "next/navigation";

/**
 * Remounts the page body on every route change so the `page-enter` keyframes (globals.css) replay:
 * a short fade-and-rise that makes client-side navigation feel like a page turn rather than a swap.
 * The animation uses `backwards` fill, so once it ends the wrapper has no transform and cannot
 * trap `position: fixed` descendants (dialogs, sheets).
 */
export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return (
    <div key={pathname} className="page-enter">
      {children}
    </div>
  );
}
