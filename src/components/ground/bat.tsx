import { useId } from "react";
import { cn } from "@/lib/utils";

/** A willow bat: rubber grip, splice, graded blade with a navy and gold sticker. */
export function Bat({ className }: { className?: string }) {
  // Gradient ids must be unique: the bat renders twice on the page (desktop hero and mobile lineup).
  const id = useId();
  const willow = `${id}willow`;
  const grip = `${id}grip`;
  const wrap = `${id}wrap`;
  return (
    <svg
      viewBox="0 0 90 320"
      className={cn("drop-shadow-[0_18px_22px_rgba(4,15,42,0.55)]", className)}
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient id={willow} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#b3843a" />
          <stop offset="30%" stopColor="#dcb05e" />
          <stop offset="68%" stopColor="#d4a655" />
          <stop offset="100%" stopColor="#a4762f" />
        </linearGradient>
        <linearGradient id={grip} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#1b2130" />
          <stop offset="50%" stopColor="#3b4457" />
          <stop offset="100%" stopColor="#141924" />
        </linearGradient>
        <pattern id={wrap} width="9" height="9" patternUnits="userSpaceOnUse" patternTransform="rotate(-32)">
          <rect width="9" height="3" fill="#ffffff" opacity="0.12" />
        </pattern>
      </defs>

      {/* Handle and grip */}
      <rect x="34" y="4" width="22" height="120" rx="10" fill="#6d4320" />
      <rect x="34" y="0" width="22" height="86" rx="10" fill={`url(#${grip})`} />
      <rect x="34" y="0" width="22" height="86" rx="10" fill={`url(#${wrap})`} />

      {/* Blade */}
      <path d="M6 120 q0 -12 12 -12 h54 q12 0 12 12 v176 a39 39 0 0 1 -78 0 z" fill={`url(#${willow})`} />
      <path d="M34 108 L45 152 L56 108 Z" fill="#8f5f2a" opacity="0.8" />
      {/* Grain */}
      <g stroke="#a87a30" strokeWidth="1.2" opacity="0.35" fill="none">
        <path d="M28 160 q2 60 0 130" />
        <path d="M45 170 q-2 55 0 125" />
        <path d="M62 160 q2 60 0 130" />
      </g>
      {/* Edges */}
      <path d="M82 124 v172 a37 37 0 0 1 -10 22" stroke="#f3d690" strokeWidth="2" fill="none" opacity="0.75" />
      <path d="M8 124 v172 a37 37 0 0 0 10 22" stroke="#86561c" strokeWidth="3" fill="none" opacity="0.5" />

      {/* Sticker */}
      <rect x="14" y="166" width="62" height="16" rx="3" fill="#0f2e63" />
      <rect x="14" y="184" width="62" height="4" fill="#d9ae56" />
      <circle cx="45" cy="174" r="5" fill="#d9ae56" />
      <text x="45" y="176.6" textAnchor="middle" fontSize="7.5" fontWeight="700" fill="#0f2e63" fontFamily="sans-serif">
        7
      </text>
    </svg>
  );
}
