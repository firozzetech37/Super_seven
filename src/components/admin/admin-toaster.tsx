"use client";

import { Toaster } from "sonner";

/** Toasts for admin actions: they stay visible even when the item that was acted on leaves the list. */
export function AdminToaster() {
  return (
    <Toaster
      position="top-center"
      richColors
      closeButton
      duration={4000}
      toastOptions={{ classNames: { toast: "!rounded-2xl !font-sans !text-sm !shadow-[0_18px_40px_rgba(15,46,99,0.18)]", title: "!font-bold" } }}
    />
  );
}
