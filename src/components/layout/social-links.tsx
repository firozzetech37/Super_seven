import { cn } from "@/lib/utils";
import { site, type SocialId } from "@/lib/site";

const glyphs: Record<SocialId, React.ReactNode> = {
  facebook: <span className="text-[1.2em] font-bold leading-none">f</span>,
  instagram: (
    <svg viewBox="0 0 24 24" className="size-[1.15em]" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.3" cy="6.7" r="1.1" fill="currentColor" stroke="none" />
    </svg>
  ),
  linkedin: <span className="text-[0.95em] font-bold leading-none">in</span>,
  youtube: (
    <svg viewBox="0 0 24 24" className="size-[1.2em]" fill="currentColor" aria-hidden="true">
      <path d="M8 5v14l11-7z" />
    </svg>
  ),
};

const colors: Record<SocialId, string> = {
  facebook: "bg-facebook",
  instagram: "bg-instagram",
  linkedin: "bg-linkedin",
  youtube: "bg-youtube",
};

export function SocialLinks({ className, size = "md" }: { className?: string; size?: "md" | "lg" }) {
  return (
    <ul className={cn("flex items-center gap-2.5", className)}>
      {site.social.map((s) => (
        <li key={s.id}>
          <a
            href={s.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={s.label}
            title={s.label}
            className={cn(
              "grid place-items-center rounded-full text-white ring-2 ring-white/90 shadow-sm transition hover:scale-105 hover:ring-gold",
              size === "lg" ? "size-11 text-lg" : "size-10 text-base",
              colors[s.id],
            )}
          >
            {glyphs[s.id]}
          </a>
        </li>
      ))}
    </ul>
  );
}
