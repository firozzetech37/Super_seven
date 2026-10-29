import Link from "next/link";
import type { Door } from "@/lib/site";
import { cn } from "@/lib/utils";

/**
 * One fielder: capped head, numbered jersey badge and name pill, plus a hover card listing what the door opens.
 * Sized with container-query units so it scales with the ground.
 */
export function Fielder({ door }: { door: Door }) {
  const left = ((410 + door.x) / 820) * 100;
  const top = ((220 + door.y) / 440) * 100;
  // Top-row fielders drop their card below the name pill; bottom-row fielders raise it above the head.
  const cardBelow = door.y < 0;

  return (
    <Link
      href={door.href}
      style={{ left: `${left}%`, top: `${top}%`, animationDelay: `${200 + door.number * 70}ms` }}
      className="group absolute block size-[5.8cqw] -translate-x-1/2 -translate-y-1/2 rounded-[1.1cqw] outline-none hover:z-20 focus-visible:z-20 focus-visible:ring-[0.5cqw] focus-visible:ring-gold motion-safe:animate-in motion-safe:fade-in motion-safe:zoom-in-50 motion-safe:fill-mode-both motion-safe:animation-duration-500"
    >
      <span className="sr-only">
        {door.number}. {door.label}: {door.items.join(", ")}
      </span>

      {/* Shadow on the grass */}
      <span
        aria-hidden="true"
        className="absolute left-1/2 top-[calc(100%-0.5cqw)] h-[1.3cqw] w-[7cqw] -translate-x-1/2 rounded-full bg-navy-deep/35 blur-[0.35cqw]"
      />

      {/* Head with cap */}
      <span
        aria-hidden="true"
        className="absolute left-1/2 -top-[3.4cqw] size-[3.6cqw] -translate-x-1/2 overflow-visible rounded-full bg-skin ring-[0.2cqw] ring-white/70 transition-transform duration-200 group-hover:-translate-y-[0.3cqw]"
      >
        <span className="absolute inset-x-0 top-0 h-1/2 rounded-t-full bg-navy" />
        <span className="absolute -inset-x-[0.3cqw] top-[42%] h-[0.55cqw] rounded-full bg-navy-deep" />
      </span>

      {/* Jersey badge */}
      <span
        aria-hidden="true"
        className="relative grid size-full place-items-center rounded-[1.1cqw] bg-gradient-to-b from-royal to-navy text-[2.5cqw] font-bold leading-none text-white shadow-[0_0.6cqw_1.2cqw_rgba(4,15,42,0.45)] ring-[0.25cqw] ring-white transition-transform duration-200 group-hover:-translate-y-[0.2cqw] group-hover:scale-110"
      >
        {door.number}
      </span>

      {/* Name pill */}
      <span
        aria-hidden="true"
        className="absolute left-1/2 top-[calc(100%+0.9cqw)] -translate-x-1/2 whitespace-nowrap rounded-full bg-white px-[1.8cqw] py-[0.8cqw] text-[1.85cqw] font-bold leading-none text-navy shadow-[0_0.3cqw_0.8cqw_rgba(4,15,42,0.35)] transition-colors duration-200 group-hover:bg-gold group-focus-visible:bg-gold"
      >
        {door.label}
      </span>

      {/* Hover card: what this door opens */}
      <span
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute left-1/2 w-max max-w-[28cqw] -translate-x-1/2 rounded-[1cqw] bg-navy-deep/95 px-[1.6cqw] py-[1.1cqw] text-left text-[1.5cqw] font-normal leading-snug text-white opacity-0 shadow-[0_1cqw_2cqw_rgba(4,15,42,0.5)] ring-1 ring-white/15 backdrop-blur-sm transition-[opacity,translate] duration-200 group-hover:opacity-100 group-focus-visible:opacity-100",
          cardBelow
            ? "top-[calc(100%+4.8cqw)] translate-y-[0.6cqw] group-hover:translate-y-0 group-focus-visible:translate-y-0"
            : "bottom-[calc(100%+3.9cqw)] -translate-y-[0.6cqw] group-hover:translate-y-0 group-focus-visible:translate-y-0",
        )}
      >
        {door.items.map((item) => (
          <span key={item} className="flex gap-[0.6cqw]">
            <span className="text-gold">•</span>
            {item}
          </span>
        ))}
      </span>
    </Link>
  );
}
