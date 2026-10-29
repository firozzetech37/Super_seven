import { ExternalLink, MapPin } from "lucide-react";

/** Street map of a ground with a pin, embedded from OpenStreetMap (no API key, attribution included). */
export function GroundMap({ lat, lng, name }: { lat: number; lng: number; name: string }) {
  const d = 0.012;
  const bbox = [lng - d * 1.6, lat - d, lng + d * 1.6, lat + d].map((n) => n.toFixed(5)).join(",");
  const embed = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat.toFixed(5)},${lng.toFixed(5)}`;
  return (
    <figure className="overflow-hidden rounded-3xl bg-white ring-1 ring-line">
      <iframe
        title={`Map of ${name}`}
        src={embed}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        className="aspect-[16/10] w-full border-0"
      />
      <figcaption className="flex flex-wrap items-center justify-between gap-3 px-5 py-3 text-sm text-slate-600">
        <span className="flex items-center gap-2">
          <MapPin className="size-4 text-ball" aria-hidden="true" />
          {name}
        </span>
        <span className="flex flex-wrap gap-3">
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${lat},${lng}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 font-bold text-royal hover:underline"
          >
            Google Maps
            <ExternalLink className="size-3.5" aria-hidden="true" />
          </a>
          <a
            href={`https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}#map=15/${lat}/${lng}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 font-bold text-royal hover:underline"
          >
            OpenStreetMap
            <ExternalLink className="size-3.5" aria-hidden="true" />
          </a>
        </span>
      </figcaption>
    </figure>
  );
}
