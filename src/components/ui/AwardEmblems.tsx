export function LaurelEmblem({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Outer Glow Halo */}
      <circle cx="50" cy="50" r="44" stroke="#ffffff" strokeOpacity="0.15" strokeWidth="1" strokeDasharray="3 3" />
      
      {/* Left Laurel Branch */}
      <path
        d="M 48 82 C 30 78, 18 64, 20 46 C 22 34, 30 24, 46 18"
        stroke="#dadada"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      {/* Left Leaves */}
      <path d="M 42 80 C 35 78, 30 72, 33 66 C 36 68, 41 74, 42 80 Z" fill="#ffffff" fillOpacity="0.8" />
      <path d="M 32 70 C 24 67, 20 59, 24 53 C 27 56, 31 63, 32 70 Z" fill="#ffffff" fillOpacity="0.85" />
      <path d="M 23 55 C 16 50, 16 41, 21 36 C 24 40, 26 48, 23 55 Z" fill="#ffffff" fillOpacity="0.9" />
      <path d="M 24 38 C 20 31, 23 23, 29 20 C 31 25, 30 33, 24 38 Z" fill="#ffffff" fillOpacity="0.9" />
      <path d="M 33 24 C 32 17, 38 12, 45 12 C 45 18, 40 23, 33 24 Z" fill="#ffffff" fillOpacity="0.95" />

      {/* Right Laurel Branch */}
      <path
        d="M 52 82 C 70 78, 82 64, 80 46 C 78 34, 70 24, 54 18"
        stroke="#dadada"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      {/* Right Leaves */}
      <path d="M 58 80 C 65 78, 70 72, 67 66 C 64 68, 59 74, 58 80 Z" fill="#ffffff" fillOpacity="0.8" />
      <path d="M 68 70 C 76 67, 80 59, 76 53 C 73 56, 69 63, 68 70 Z" fill="#ffffff" fillOpacity="0.85" />
      <path d="M 77 55 C 84 50, 84 41, 79 36 C 76 40, 74 48, 77 55 Z" fill="#ffffff" fillOpacity="0.9" />
      <path d="M 76 38 C 80 31, 77 23, 71 20 C 69 25, 70 33, 76 38 Z" fill="#ffffff" fillOpacity="0.9" />
      <path d="M 67 24 C 68 17, 62 12, 55 12 C 55 18, 60 23, 67 24 Z" fill="#ffffff" fillOpacity="0.95" />

      {/* Central Faceted Star */}
      <polygon
        points="50,34 54,44 65,45 57,52 60,63 50,57 40,63 43,52 35,45 46,44"
        fill="#ffffff"
        stroke="#999999"
        strokeWidth="1"
      />
      {/* Base Ribbon Knot */}
      <circle cx="50" cy="83" r="3.5" fill="#ffffff" />
    </svg>
  );
}

export function GeometricEmblem({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Outer Coordinate Grid */}
      <rect x="12" y="12" width="76" height="76" stroke="#ffffff" strokeOpacity="0.12" strokeWidth="1" />
      <circle cx="50" cy="50" r="42" stroke="#ffffff" strokeOpacity="0.2" strokeWidth="1" strokeDasharray="4 4" />
      
      {/* Central Diamond Octahedron Facets */}
      <polygon points="50,18 78,50 50,82 22,50" stroke="#ffffff" strokeWidth="1.8" fill="#141414" fillOpacity="0.8" />
      <polygon points="50,18 64,50 50,82 36,50" stroke="#dadada" strokeWidth="1.2" fill="#222222" fillOpacity="0.6" />
      
      {/* Center Facet Ridge */}
      <line x1="50" y1="18" x2="50" y2="82" stroke="#ffffff" strokeWidth="1.5" />
      <line x1="22" y1="50" x2="78" y2="50" stroke="#ffffff" strokeWidth="1.5" />

      {/* Intersecting Orbit Rings */}
      <ellipse cx="50" cy="50" rx="40" ry="14" transform="rotate(-28 50 50)" stroke="#ffffff" strokeOpacity="0.8" strokeWidth="1.4" />
      <ellipse cx="50" cy="50" rx="40" ry="14" transform="rotate(28 50 50)" stroke="#999999" strokeOpacity="0.6" strokeWidth="1.2" />

      {/* Radiant Apex Nodes */}
      <circle cx="50" cy="18" r="2.5" fill="#ffffff" />
      <circle cx="50" cy="82" r="2.5" fill="#ffffff" />
      <circle cx="22" cy="50" r="2.5" fill="#ffffff" />
      <circle cx="78" cy="50" r="2.5" fill="#ffffff" />
      <circle cx="50" cy="50" r="4" fill="#ffffff" />
    </svg>
  );
}

export function GlobeEmblem({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Geodesic Outer Sphere */}
      <circle cx="50" cy="50" r="40" stroke="#ffffff" strokeWidth="1.6" />
      
      {/* Latitudinal Rings */}
      <ellipse cx="50" cy="50" rx="40" ry="16" stroke="#dadada" strokeWidth="1.2" />
      <ellipse cx="50" cy="50" rx="36" ry="32" stroke="#ffffff" strokeOpacity="0.4" strokeWidth="1" strokeDasharray="3 3" />

      {/* Longitudinal Curves */}
      <ellipse cx="50" cy="50" rx="18" ry="40" stroke="#dadada" strokeWidth="1.2" />
      <line x1="50" y1="10" x2="50" y2="90" stroke="#ffffff" strokeWidth="1.4" />
      <line x1="10" y1="50" x2="90" y2="50" stroke="#ffffff" strokeWidth="1.4" />

      {/* Network Nodes */}
      <circle cx="50" cy="10" r="3" fill="#ffffff" />
      <circle cx="50" cy="90" r="3" fill="#ffffff" />
      <circle cx="10" cy="50" r="3" fill="#ffffff" />
      <circle cx="90" cy="50" r="3" fill="#ffffff" />
      <circle cx="32" cy="34" r="2.5" fill="#ffffff" />
      <circle cx="68" cy="34" r="2.5" fill="#ffffff" />
      <circle cx="32" cy="66" r="2.5" fill="#ffffff" />
      <circle cx="68" cy="66" r="2.5" fill="#ffffff" />

      {/* Network Conduits */}
      <line x1="32" y1="34" x2="68" y2="34" stroke="#ffffff" strokeOpacity="0.5" strokeWidth="1" />
      <line x1="32" y1="66" x2="68" y2="66" stroke="#ffffff" strokeOpacity="0.5" strokeWidth="1" />
      <line x1="32" y1="34" x2="32" y2="66" stroke="#ffffff" strokeOpacity="0.5" strokeWidth="1" />
      <line x1="68" y1="34" x2="68" y2="66" stroke="#ffffff" strokeOpacity="0.5" strokeWidth="1" />

      {/* Core Node */}
      <circle cx="50" cy="50" r="4.5" fill="#ffffff" stroke="#000000" strokeWidth="1" />
    </svg>
  );
}
