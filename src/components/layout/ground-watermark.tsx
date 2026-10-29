/** Faint cricket-ground outline used as a watermark on navy banners. */
export function GroundWatermark({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 820 440" aria-hidden="true" className={className} fill="none" stroke="currentColor">
      <ellipse cx="410" cy="220" rx="400" ry="210" strokeWidth="3" />
      <ellipse cx="410" cy="220" rx="345" ry="160" strokeWidth="2" strokeDasharray="14 12" />
      <rect x="390" y="120" width="40" height="200" rx="4" strokeWidth="2" />
      <circle cx="410" cy="220" r="60" strokeWidth="2" />
    </svg>
  );
}
