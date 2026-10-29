import { Info } from "lucide-react";
import { cn } from "@/lib/utils";

/** Gold-tinted note for content that is historical, sample or awaiting confirmation. */
export function NoticeCard({ title, children, className }: { title: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("flex gap-4 rounded-2xl bg-gold/10 p-5 ring-1 ring-gold/40", className)}>
      <span className="grid size-10 shrink-0 place-items-center rounded-full bg-gold text-navy">
        <Info className="size-5" aria-hidden="true" />
      </span>
      <div className="min-w-0">
        <p className="font-bold text-navy">{title}</p>
        <div className="mt-1 text-[15px] leading-relaxed text-slate-600">{children}</div>
      </div>
    </div>
  );
}
