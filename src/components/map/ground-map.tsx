import { ExternalLink, MapPin, Navigation } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Street map of a ground with a pin, embedded from OpenStreetMap (no API key, attribution included).
 * `tone="dark"` frames it as a glass panel for the navy map band.
 */
export function GroundMap({ lat, lng, name, tone = "light" }: { lat: number; lng: number; name: string; tone?: "light" | "dark" }) {
  const d = 0.012;
  const bbox = [lng - d * 1.6, lat - d, lng + d * 1.6, lat + d].map((n) => n.toFixed(5)).join(",");
  const embed = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat.toFixed(5)},${lng.toFixed(5)}`;
  const dark = tone === "dark";
  const link = cn(
    "inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm font-bold transition focus-visible:outline-none focus-visible:ring-2",
    dark ? "bg-white/10 text-white ring-1 ring-white/20 hover:bg-white/15 hover:ring-gold/60 focus-visible:ring-gold" : "bg-royal/10 text-royal hover:bg-royal hover:text-white focus-visible:ring-royal",
  );
  return (
    <figure
      className={cn(
        "overflow-hidden rounded-[2rem] p-2",
        dark ? "bg-white/[0.05] shadow-[0_30px_70px_rgba(4,15,42,0.45)] ring-1 ring-white/10 backdrop-blur" : "bg-white shadow-[0_18px_40px_rgba(15,46,99,0.1)] ring-1 ring-line",
      )}
    >
      <div className={cn("relative overflow-hidden rounded-[1.5rem]", dark ? "bg-navy-deep" : "bg-surface")}>
        <iframe title={`Map of ${name}`} src={embed} loading="lazy" referrerPolicy="no-referrer-when-downgrade" className="relative aspect-[16/10] w-full border-0" />
      </div>
      <figcaption className="flex flex-wrap items-center justify-between gap-3 px-3 pb-2 pt-4">
        <span className={cn("flex min-w-0 items-center gap-2.5 text-sm font-bold", dark ? "text-white" : "text-navy")}>
          <span className={cn("grid size-8 shrink-0 place-items-center rounded-xl", dark ? "bg-gold text-navy" : "bg-ball/10 text-ball")}>
            <MapPin className="size-4" aria-hidden="true" />
          </span>
          <span className="min-w-0">{name}</span>
        </span>
        <span className="flex flex-wrap gap-2">
          <a href={`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`} target="_blank" rel="noopener noreferrer" className={link}>
            <Navigation className="size-3.5" aria-hidden="true" />
            Directions
            <span className="sr-only"> (opens Google Maps in a new tab)</span>
          </a>
          <a href={`https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}#map=15/${lat}/${lng}`} target="_blank" rel="noopener noreferrer" className={link}>
            OpenStreetMap
            <ExternalLink className="size-3.5" aria-hidden="true" />
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
        </span>
      </figcaption>
    </figure>
  );
}
