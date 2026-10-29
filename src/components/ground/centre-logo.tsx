import Image from "next/image";
import Link from "next/link";

export function CentreLogo() {
  return (
    <Link
      href="/"
      aria-label="Home"
      title="Click the centre logo anytime to return Home"
      className="absolute left-1/2 top-1/2 size-[16.2cqw] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-full outline-none transition-transform duration-200 hover:scale-105 focus-visible:ring-4 focus-visible:ring-gold motion-safe:animate-in motion-safe:fade-in motion-safe:zoom-in-75 motion-safe:fill-mode-both motion-safe:animation-duration-700"
    >
      <Image src="/brand/logo.png" alt="" fill sizes="160px" className="object-cover" priority />
    </Link>
  );
}
