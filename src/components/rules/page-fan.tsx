import Image from "next/image";
import { rulebookCover, rulebookLanguages } from "@/lib/data/rulebook";
import { cn } from "@/lib/utils";

/**
 * Three rulebook pages fanned like a hand of cards, with the cover tucked in the corner.
 * Positioning (translate/rotate) lives on the wrapper and the float animation on the image:
 * the `float` keyframes animate the `translate` property, so putting both on one element
 * would let the animation overwrite the offset and shift the cards off centre.
 */
export function PageFan({ cover = true, className }: { cover?: boolean; className?: string }) {
  const pages = ["bengali", "hindi", "tamil"].map((s) => rulebookLanguages.find((l) => l.slug === s)!);
  const slots = [
    "-translate-x-[82%] -rotate-[12deg] group-hover:-translate-x-[92%] group-hover:-rotate-[16deg]",
    "z-10 -translate-x-1/2 group-hover:-translate-y-[56%]",
    "-translate-x-[18%] rotate-[12deg] group-hover:-translate-x-[8%] group-hover:rotate-[16deg]",
  ];
  return (
    <div aria-hidden="true" className={cn("group relative mx-auto h-[300px] w-[300px] sm:h-[340px] sm:w-[360px]", className)}>
      {pages.map((l, i) => (
        <div
          key={l.slug}
          className={cn(
            "absolute left-1/2 top-1/2 w-[190px] -translate-y-1/2 transition-transform duration-700 ease-[cubic-bezier(.2,.7,.2,1)] sm:w-[210px]",
            slots[i],
          )}
        >
          <Image
            src={l.thumb}
            alt=""
            width={720}
            height={932}
            sizes="220px"
            className={cn(
              "h-auto w-full rounded-lg shadow-[0_24px_60px_rgba(4,15,42,0.5)] ring-1 ring-white/20",
              i === 1 ? "motion-safe:animate-float" : "motion-safe:animate-float-slow",
            )}
          />
        </div>
      ))}
      {cover ? (
        <div className="absolute -bottom-2 -right-2 z-20 w-[110px] rotate-6 transition-transform duration-700 ease-[cubic-bezier(.2,.7,.2,1)] group-hover:rotate-3 group-hover:-translate-y-1">
          <Image src={rulebookCover} alt="" width={720} height={932} sizes="120px" className="h-auto w-full rounded-md shadow-2xl ring-1 ring-white/30" />
        </div>
      ) : null}
    </div>
  );
}
