import Image from "next/image";
import { MapPin } from "lucide-react";
import type { Official } from "@/lib/data/teams";

export function OfficialCard({ official }: { official: Official }) {
  return (
    <article className="group overflow-hidden rounded-3xl bg-white ring-1 ring-line transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_18px_40px_rgba(15,46,99,0.12)]">
      <div className="relative aspect-square overflow-hidden bg-avatar">
        <Image
          src={official.photo}
          alt={`${official.name}, ${official.role}`}
          fill
          sizes="(min-width: 1024px) 300px, 45vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <span className="absolute left-4 top-4 rounded-full bg-navy/85 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-gold backdrop-blur">
          {official.role}
        </span>
      </div>
      <div className="p-5">
        <h3 className="font-heading text-xl font-bold text-navy">{official.name}</h3>
        <p className="mt-1 flex items-center gap-1.5 text-[15px] text-slate-500">
          <MapPin className="size-4 text-gold-deep" aria-hidden="true" />
          {official.state}
        </p>
      </div>
    </article>
  );
}
