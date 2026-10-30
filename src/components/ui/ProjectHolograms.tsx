export function DocReconHologram() {
  return (
    <svg
      width="100%"
      height="68"
      viewBox="0 0 160 68"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="project-hologram-svg"
      aria-hidden="true"
    >
      {/* Perspective Grid Floor */}
      <ellipse cx="80" cy="58" rx="60" ry="8" stroke="rgba(180, 210, 255, 0.25)" strokeWidth="0.8" />
      <ellipse cx="80" cy="58" rx="38" ry="5" stroke="rgba(180, 210, 255, 0.4)" strokeWidth="0.8" />

      {/* Hologram Box / Terminal Display Outline */}
      <path
        d="M38 46L54 14H106L122 46H38Z"
        fill="rgba(120, 170, 240, 0.06)"
        stroke="rgba(200, 225, 255, 0.4)"
        strokeWidth="1.2"
      />
      {/* Front panel glass */}
      <rect
        x="50"
        y="18"
        width="60"
        height="32"
        rx="2"
        fill="rgba(140, 190, 255, 0.08)"
        stroke="rgba(220, 235, 255, 0.6)"
        strokeWidth="1.2"
      />
      {/* Interior document scanning lines */}
      <line x1="56" y1="26" x2="84" y2="26" stroke="rgba(200, 225, 255, 0.45)" strokeWidth="1" />
      <line x1="56" y1="31" x2="96" y2="31" stroke="rgba(200, 225, 255, 0.45)" strokeWidth="1" />
      <line x1="56" y1="36" x2="78" y2="36" stroke="rgba(200, 225, 255, 0.45)" strokeWidth="1" />
      <line x1="56" y1="41" x2="90" y2="41" stroke="rgba(200, 225, 255, 0.45)" strokeWidth="1" />

      {/* Glowing AI Intelligence Core in Center */}
      <circle cx="95" cy="27" r="9" fill="url(#coreGlow)" />
      <circle cx="95" cy="27" r="4" fill="#FFFFFF" />
      <circle cx="95" cy="27" r="7" stroke="rgba(180, 220, 255, 0.8)" strokeWidth="0.8" strokeDasharray="2 2" />

      {/* Scanning beam */}
      <line x1="48" y1="34" x2="112" y2="34" stroke="rgba(255, 255, 255, 0.8)" strokeWidth="0.8" />

      <defs>
        <radialGradient id="coreGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.9" />
          <stop offset="40%" stopColor="#8AB4F8" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#4285F4" stopOpacity="0" />
        </radialGradient>
      </defs>
    </svg>
  );
}

export function PathwayAIHologram() {
  return (
    <svg
      width="100%"
      height="68"
      viewBox="0 0 160 68"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="project-hologram-svg"
      aria-hidden="true"
    >
      {/* Concentric Base Rings */}
      <ellipse cx="80" cy="56" rx="55" ry="8" stroke="rgba(180, 210, 255, 0.3)" strokeWidth="0.8" />
      <ellipse cx="80" cy="56" rx="36" ry="5.5" stroke="rgba(180, 210, 255, 0.55)" strokeWidth="1" />
      <ellipse cx="80" cy="56" rx="18" ry="3" stroke="#FFFFFF" strokeWidth="1.2" />

      {/* Futuristic Smart City Spire Matrix */}
      {/* Tall center tower */}
      <path d="M78 54V12L80 8L82 12V54" stroke="#FFFFFF" strokeWidth="1.2" fill="rgba(200, 225, 255, 0.15)" />
      <line x1="80" y1="8" x2="80" y2="54" stroke="rgba(255, 255, 255, 0.6)" strokeWidth="0.6" />

      {/* Flanking spires */}
      <path d="M72 54V24L74 20L76 24V54" stroke="rgba(200, 225, 255, 0.7)" strokeWidth="1" fill="rgba(160, 200, 255, 0.1)" />
      <path d="M84 54V24L86 20L88 24V54" stroke="rgba(200, 225, 255, 0.7)" strokeWidth="1" fill="rgba(160, 200, 255, 0.1)" />

      {/* Outer pillars */}
      <path d="M66 55V32L68 28L70 32V55" stroke="rgba(180, 210, 255, 0.5)" strokeWidth="0.8" />
      <path d="M90 55V32L92 28L94 32V55" stroke="rgba(180, 210, 255, 0.5)" strokeWidth="0.8" />

      {/* Data network pulse rings rising */}
      <ellipse cx="80" cy="40" rx="26" ry="4" stroke="rgba(200, 230, 255, 0.4)" strokeWidth="0.8" strokeDasharray="3 3" />
      <ellipse cx="80" cy="28" rx="16" ry="2.5" stroke="rgba(220, 240, 255, 0.6)" strokeWidth="0.8" />

      {/* Beacon beacon light */}
      <circle cx="80" cy="8" r="3" fill="#FFFFFF" />
      <circle cx="80" cy="8" r="6" stroke="rgba(255, 255, 255, 0.5)" strokeWidth="0.6" />
    </svg>
  );
}

export function HefinHologram() {
  return (
    <svg
      width="100%"
      height="68"
      viewBox="0 0 160 68"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="project-hologram-svg"
      aria-hidden="true"
    >
      {/* Isometric Cube 1 (Center Large) */}
      <g transform="translate(80, 32)">
        {/* Top Face */}
        <polygon points="0,-16 16,-8 0,0 -16,-8" fill="rgba(180, 215, 255, 0.15)" stroke="rgba(230, 240, 255, 0.85)" strokeWidth="1.1" />
        {/* Left Face */}
        <polygon points="-16,-8 0,0 0,16 -16,8" fill="rgba(120, 160, 230, 0.1)" stroke="rgba(200, 225, 255, 0.65)" strokeWidth="1.1" />
        {/* Right Face */}
        <polygon points="0,0 16,-8 16,8 0,16" fill="rgba(140, 180, 250, 0.12)" stroke="rgba(210, 230, 255, 0.75)" strokeWidth="1.1" />
        {/* Inner vertex node */}
        <circle cx="0" cy="0" r="1.8" fill="#FFFFFF" />
      </g>

      {/* Floating Satellite Cube (Left) */}
      <g transform="translate(46, 42) scale(0.65)">
        <polygon points="0,-16 16,-8 0,0 -16,-8" fill="rgba(180, 215, 255, 0.12)" stroke="rgba(200, 225, 255, 0.65)" strokeWidth="1.2" />
        <polygon points="-16,-8 0,0 0,16 -16,8" fill="rgba(120, 160, 230, 0.08)" stroke="rgba(180, 210, 255, 0.5)" strokeWidth="1.2" />
        <polygon points="0,0 16,-8 16,8 0,16" fill="rgba(140, 180, 250, 0.1)" stroke="rgba(190, 220, 255, 0.6)" strokeWidth="1.2" />
      </g>

      {/* Floating Satellite Cube (Right Upper) */}
      <g transform="translate(116, 22) scale(0.72)">
        <polygon points="0,-16 16,-8 0,0 -16,-8" fill="rgba(180, 215, 255, 0.14)" stroke="rgba(220, 235, 255, 0.75)" strokeWidth="1.2" />
        <polygon points="-16,-8 0,0 0,16 -16,8" fill="rgba(120, 160, 230, 0.09)" stroke="rgba(190, 215, 255, 0.55)" strokeWidth="1.2" />
        <polygon points="0,0 16,-8 16,8 0,16" fill="rgba(140, 180, 250, 0.11)" stroke="rgba(200, 225, 255, 0.65)" strokeWidth="1.2" />
      </g>

      {/* Decentralized node link lines */}
      <line x1="56" y1="36" x2="68" y2="30" stroke="rgba(200, 230, 255, 0.4)" strokeWidth="0.8" strokeDasharray="2 2" />
      <line x1="92" y1="26" x2="106" y2="24" stroke="rgba(200, 230, 255, 0.4)" strokeWidth="0.8" strokeDasharray="2 2" />
    </svg>
  );
}
