/** Mown rings: alternating lighter bands, every 48 units from the boundary inwards. */
const rings = [374, 326, 278, 230, 182, 134];
const RY = 208 / 398;

/** The oval ground: boundary rope, mown rings, 30-yard circle, pitch with creases and stumps, and the white mount for the centre logo. */
export function GroundField() {
  return (
    <svg viewBox="0 0 820 440" className="absolute inset-0 h-full w-full overflow-visible" aria-hidden="true" focusable="false">
      <defs>
        <radialGradient id="sscfi-grass" cx="50%" cy="40%" r="70%">
          <stop offset="0%" stopColor="#4cae54" />
          <stop offset="60%" stopColor="#3b9743" />
          <stop offset="100%" stopColor="#2a7335" />
        </radialGradient>
        <linearGradient id="sscfi-sheen" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.14" />
          <stop offset="55%" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="sscfi-pitch" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#cdb878" />
          <stop offset="50%" stopColor="#eee2b8" />
          <stop offset="100%" stopColor="#cdb878" />
        </linearGradient>
        <clipPath id="sscfi-oval">
          <ellipse cx="410" cy="220" rx="398" ry="208" />
        </clipPath>
        <filter id="sscfi-lift" x="-15%" y="-15%" width="130%" height="140%">
          <feDropShadow dx="0" dy="16" stdDeviation="16" floodColor="#040f2a" floodOpacity="0.6" />
        </filter>
        <filter id="sscfi-mount" x="-30%" y="-30%" width="160%" height="160%">
          <feDropShadow dx="0" dy="5" stdDeviation="6" floodColor="#0b2550" floodOpacity="0.45" />
        </filter>
      </defs>

      {/* Boundary rope and grass, lifted off the navy with a soft shadow */}
      <g filter="url(#sscfi-lift)">
        <ellipse cx="410" cy="220" rx="404" ry="214" fill="#ffffff" />
        <ellipse cx="410" cy="220" rx="398" ry="208" fill="url(#sscfi-grass)" />
      </g>

      {/* Mown rings and a top sheen */}
      <g clipPath="url(#sscfi-oval)" fill="none" stroke="#ffffff" strokeOpacity="0.07" strokeWidth="24">
        {rings.map((rx) => (
          <ellipse key={rx} cx="410" cy="220" rx={rx} ry={rx * RY} />
        ))}
      </g>
      <ellipse cx="410" cy="220" rx="398" ry="208" fill="url(#sscfi-sheen)" />

      {/* Inner rope line and the dashed 30-yard circle */}
      <ellipse cx="410" cy="220" rx="388" ry="198" fill="none" stroke="#ffffff" strokeOpacity="0.3" strokeWidth="1.5" />
      <ellipse cx="410" cy="220" rx="345" ry="160" fill="none" stroke="#ffffff" strokeWidth="2" strokeDasharray="10 8" opacity="0.95" />

      {/* Pitch with popping creases and stumps at both ends */}
      <rect x="390" y="110" width="40" height="220" rx="5" fill="url(#sscfi-pitch)" />
      <rect x="390" y="110" width="40" height="220" rx="5" fill="none" stroke="#b9a263" strokeOpacity="0.6" strokeWidth="1" />
      <g stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round">
        <line x1="384" y1="132" x2="436" y2="132" />
        <line x1="384" y1="308" x2="436" y2="308" />
      </g>
      <g stroke="#5a4520" strokeWidth="1.6" strokeLinecap="round">
        <line x1="405" y1="113" x2="405" y2="122" />
        <line x1="410" y1="113" x2="410" y2="122" />
        <line x1="415" y1="113" x2="415" y2="122" />
        <line x1="405" y1="318" x2="405" y2="327" />
        <line x1="410" y1="318" x2="410" y2="327" />
        <line x1="415" y1="318" x2="415" y2="327" />
      </g>

      {/* White mount with a gold ring for the centre logo */}
      <g filter="url(#sscfi-mount)">
        <circle cx="410" cy="220" r="78" fill="#ffffff" />
      </g>
      <circle cx="410" cy="220" r="71" fill="none" stroke="#d9ae56" strokeWidth="5" />
    </svg>
  );
}
