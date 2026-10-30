export default function BrandEmblem({ size = 28 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 36 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="brand-emblem-svg"
      aria-hidden="true"
    >
      {/* Crown spires at top */}
      <path
        d="M10 6L14 12M18 4V12M26 6L22 12"
        stroke="#FFFFFF"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      {/* Top jewels / dots */}
      <circle cx="10" cy="5" r="1.2" fill="#FFFFFF" />
      <circle cx="18" cy="3" r="1.4" fill="#FFFFFF" />
      <circle cx="26" cy="5" r="1.2" fill="#FFFFFF" />
      {/* Upper crown chevron / peak */}
      <path
        d="M8 14L18 8L28 14"
        stroke="#FFFFFF"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      {/* Interlocking Monogram Chevron (A/M/V shape) */}
      <path
        d="M6 31L18 13L30 31"
        stroke="#FFFFFF"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      {/* Inner cross-triangle */}
      <path
        d="M11 25H25"
        stroke="#FFFFFF"
        strokeWidth="1.4"
      />
      {/* Lower inverted chevron */}
      <path
        d="M12 31L18 22L24 31"
        stroke="#FFFFFF"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      {/* Center diamond spark */}
      <polygon
        points="18,17 19.5,19 18,21 16.5,19"
        fill="#FFFFFF"
      />
    </svg>
  );
}
