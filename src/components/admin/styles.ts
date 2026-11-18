/*
 * Button classes for the admin area. Kept out of the "use client" form module on purpose: a server
 * component importing a plain value from a client module receives a reference, not the string.
 */
export type ButtonTone = "primary" | "gold" | "danger" | "quiet";

export const buttonTones: Record<ButtonTone, string> = {
  primary: "bg-navy text-white hover:bg-royal focus-visible:ring-royal/40",
  gold: "bg-gold text-navy hover:bg-gold-deep focus-visible:ring-gold/50",
  danger: "bg-white text-ball ring-1 ring-ball/40 hover:bg-ball hover:text-white focus-visible:ring-ball/40",
  quiet: "bg-white text-navy ring-1 ring-line hover:bg-surface hover:ring-slate-300 focus-visible:ring-royal/30",
};

export const buttonBase =
  "inline-flex h-10 items-center justify-center gap-2 rounded-xl px-4 text-sm font-bold transition duration-200 focus-visible:outline-none focus-visible:ring-4 disabled:cursor-wait disabled:opacity-70";
