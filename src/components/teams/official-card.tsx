import Image from "next/image";
import { MapPin } from "lucide-react";
import type { Official } from "@/lib/data/teams";

/** Match official: portrait with a navy fade, role pill, and name and state set on the photo. */
export function OfficialCard({ official }: { official: Official }) {
  return (
    <article className="group card-premium relative overflow-hidden rounded-3xl bg-navy shadow-[0_12px_30px_rgba(15,46,99,0.1)] ring-1 ring-line transition duration-300 hover:-translate-y-1.5 hover:shadow-[0_28px_60px_rgba(15,46,99,0.2)]">
      <div className="relative aspect-[4/5] overflow-hidden bg-avatar">
        <Image
          src={official.photo}
          alt={`${official.name}, ${official.role}`}
          fill
          sizes="(min-width: 1024px) 300px, (min-width: 640px) 45vw, 92vw"
          className="object-cover object-top motion-safe:transition-transform motion-safe:duration-700 motion-safe:ease-out motion-safe:group-hover:scale-105"
        />
        <span aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-navy via-navy/30 to-transparent" />
        <span
          aria-hidden="true"
          className="absolute inset-y-0 left-0 w-1/2 -translate-x-[140%] skew-x-[-20deg] bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-1000 ease-out group-hover:translate-x-[300%]"
        />
        <span className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full bg-navy/80 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-gold ring-1 ring-white/15 backdrop-blur">
          <span aria-hidden="true" className="size-1.5 rounded-full bg-gold" />
          {official.role}
        </span>
        <div className="absolute inset-x-0 bottom-0 p-5">
          <span aria-hidden="true" className="mb-3 block h-[3px] w-10 rounded-full bg-gold transition-[width] duration-500 group-hover:w-20" />
          <h3 className="font-heading text-2xl font-bold text-white">{official.name}</h3>
          <p className="mt-1 flex items-center gap-1.5 text-[15px] text-white/75">
            <MapPin className="size-4 text-gold" aria-hidden="true" />
            {official.state}
          </p>
        </div>
      </div>
    </article>
  );
}
