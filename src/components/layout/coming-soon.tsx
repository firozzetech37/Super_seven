import { Reveal } from "@/components/motion/reveal";
import { cn } from "@/lib/utils";

/**
 * Holding message while SSCFI prepares a list: a soft circle with a group icon, the message and a
 * short gold rule. "page" fills the space under a banner and ends in a wave into the footer;
 * "inline" sits inside an existing section.
 */
export function ComingSoon({
  message,
  variant = "page",
  as: Heading = "h2",
  className,
}: {
  message: string;
  variant?: "page" | "inline";
  as?: "h2" | "h3";
  className?: string;
}) {
  const inline = variant === "inline";
  const body = (
    <Reveal from="scale" className="mx-auto flex max-w-3xl flex-col items-center text-center">
      <div aria-hidden="true" className={cn("relative motion-safe:animate-float-slow", inline ? "size-32 sm:size-40" : "size-36 sm:size-48")}>
        <span className="grid size-full place-items-center rounded-full bg-royal/[0.07]">
          <GroupIcon className="w-[58%] text-royal/45" />
        </span>
        <Sparks className="absolute -top-[12%] left-[80%] size-[23%] text-gold" />
      </div>
      <Heading
        className={cn(
          "text-balance font-heading font-bold leading-tight text-navy",
          inline ? "mt-7 text-2xl sm:mt-8 sm:text-3xl lg:text-4xl" : "mt-8 text-3xl sm:mt-10 sm:text-4xl lg:text-5xl",
        )}
      >
        {message}
      </Heading>
      <span aria-hidden="true" className="mt-6 h-1.5 w-28 rounded-full bg-gold sm:mt-8 sm:w-32" />
    </Reveal>
  );

  if (inline) return <div className={cn("py-12 sm:py-16", className)}>{body}</div>;

  return (
    <section className={cn("relative isolate overflow-hidden bg-white", className)}>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(rgba(15,46,99,0.07)_1px,transparent_1px)] [background-size:22px_22px] [mask-image:radial-gradient(55%_60%_at_50%_35%,#000,transparent)]"
      />
      <div className="mx-auto max-w-7xl px-4 pb-36 pt-16 sm:px-6 sm:pb-44 lg:pb-52 lg:pt-24">{body}</div>
      <svg aria-hidden="true" viewBox="0 0 1440 200" preserveAspectRatio="none" className="absolute inset-x-0 bottom-0 h-24 w-full sm:h-32 lg:h-40">
        <path d="M0 70C260 10 520 60 800 120s480 0 640-70v150H0Z" className="fill-royal/[0.04]" />
        <path d="M0 105C230 45 500 75 780 140s470 10 660-55v110H0Z" className="fill-[#eef2fa]" />
      </svg>
    </section>
  );
}

/** Three people, the middle one in front. */
function GroupIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 72 44" fill="none" stroke="currentColor" strokeWidth={2.6} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="36" cy="12" r="7.5" />
      <path d="M22 42v-3a14 14 0 0 1 28 0v3" />
      <circle cx="17" cy="17" r="6" />
      <path d="M5 42v-2a12 12 0 0 1 19-9.7" />
      <circle cx="55" cy="17" r="6" />
      <path d="M67 42v-2a12 12 0 0 0-19-9.7" />
    </svg>
  );
}

/** Three short gold strokes fanning out from the circle's edge. */
function Sparks({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.6} strokeLinecap="round" className={className}>
      <path d="M1.9 15.2 3.7 6.4" />
      <path d="M6.4 17.6 12.7 11.3" />
      <path d="M8.8 22.1 17.6 20.3" />
    </svg>
  );
}
