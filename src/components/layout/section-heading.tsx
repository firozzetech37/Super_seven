import { Reveal } from "@/components/motion/reveal";
import { cn } from "@/lib/utils";

/** Eyebrow + heading + optional description, shared by every section so pages feel like one site. */
export function SectionHeading({
  eyebrow,
  title,
  description,
  tone = "light",
  align = "left",
  action,
  className,
  as: Tag = "h2",
}: {
  eyebrow?: string;
  title: React.ReactNode;
  description?: string;
  tone?: "light" | "dark";
  align?: "left" | "center";
  action?: React.ReactNode;
  className?: string;
  as?: "h1" | "h2" | "h3";
}) {
  const dark = tone === "dark";
  return (
    <Reveal
      className={cn(
        "flex flex-col gap-5 md:flex-row md:items-end md:justify-between",
        align === "center" && "md:flex-col md:items-center md:text-center",
        className,
      )}
    >
      <div className={cn("max-w-2xl", align === "center" && "mx-auto")}>
        {eyebrow ? (
          <p
            className={cn(
              "flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.24em]",
              dark ? "text-gold" : "text-royal",
              align === "center" && "justify-center",
            )}
          >
            <span aria-hidden="true" className={cn("eyebrow-dash h-px w-8", dark ? "bg-gold" : "bg-gold-deep")} />
            {eyebrow}
          </p>
        ) : null}
        <Tag className={cn("mt-3 font-heading text-[2rem] font-bold leading-[1.1] sm:text-4xl lg:text-[2.75rem]", dark ? "text-white" : "text-ink")}>
          {title}
        </Tag>
        {description ? (
          <p className={cn("mt-3 text-lg leading-relaxed", dark ? "text-white/75" : "text-slate-500")}>{description}</p>
        ) : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </Reveal>
  );
}
