import { useId } from "react";
import { cn } from "@/lib/utils";

/** A leather cricket ball: graded red with stitched seams and a gloss highlight. */
export function Ball({ className }: { className?: string }) {
  // Gradient id must be unique: the ball renders twice on the page (desktop hero and mobile lineup).
  const leather = `${useId()}leather`;
  return (
    <svg
      viewBox="0 0 150 150"
      className={cn("drop-shadow-[0_16px_22px_rgba(4,15,42,0.55)]", className)}
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <radialGradient id={leather} cx="36%" cy="30%" r="76%">
          <stop offset="0%" stopColor="#e65d6b" />
          <stop offset="45%" stopColor="#b82237" />
          <stop offset="100%" stopColor="#660d1d" />
        </radialGradient>
      </defs>
      <circle cx="75" cy="75" r="72" fill={`url(#${leather})`} />
      <circle cx="75" cy="75" r="72" fill="none" stroke="#56091a" strokeWidth="1.5" />

      {/* Seams: two ridges with cross stitches */}
      <g fill="none" stroke="#f7f1e4" strokeLinecap="round">
        <path d="M56 8 q-26 67 0 134" strokeWidth="1.4" opacity="0.85" />
        <path d="M64 8 q-26 67 0 134" strokeWidth="1.4" opacity="0.85" />
        <path d="M60 8 q-26 67 0 134" strokeWidth="7" strokeDasharray="1.5 4.3" />
        <path d="M86 8 q26 67 0 134" strokeWidth="1.4" opacity="0.85" />
        <path d="M94 8 q26 67 0 134" strokeWidth="1.4" opacity="0.85" />
        <path d="M90 8 q26 67 0 134" strokeWidth="7" strokeDasharray="1.5 4.3" />
      </g>

      {/* Gloss */}
      <ellipse cx="52" cy="40" rx="18" ry="10" fill="#ffffff" opacity="0.16" transform="rotate(-35 52 40)" />
    </svg>
  );
}
