export function DocReconSchematic() {
  return (
    <div className="schematic-container docrecon-schematic">
      <svg
        viewBox="0 0 280 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="schematic-svg"
      >
        {/* Angled background sheet */}
        <rect
          x="45"
          y="15"
          width="190"
          height="170"
          rx="4"
          fill="rgba(14, 14, 20, 0.9)"
          stroke="rgba(255, 255, 255, 0.2)"
          strokeWidth="1"
        />
        {/* Header banner */}
        <rect x="58" y="28" width="164" height="24" rx="2" fill="rgba(255, 255, 255, 0.08)" />
        <rect x="65" y="35" width="40" height="10" rx="1" fill="rgba(255, 255, 255, 0.7)" />
        <rect x="180" y="35" width="34" height="10" rx="1" fill="rgba(255, 255, 255, 0.4)" />
        {/* Barcode strip */}
        <line x1="65" y1="62" x2="140" y2="62" stroke="rgba(255, 255, 255, 0.5)" strokeWidth="1.5" />
        <line x1="65" y1="68" x2="120" y2="68" stroke="rgba(255, 255, 255, 0.3)" strokeWidth="1" />
        {/* OCR Field Bounding Box (Grounded Field) */}
        <rect
          x="62"
          y="78"
          width="156"
          height="54"
          rx="2"
          fill="rgba(255, 255, 255, 0.04)"
          stroke="rgba(255, 255, 255, 0.6)"
          strokeWidth="1.2"
          strokeDasharray="4 2"
        />
        {/* Data rows */}
        <line x1="68" y1="92" x2="210" y2="92" stroke="rgba(255, 255, 255, 0.2)" strokeWidth="1" />
        <line x1="68" y1="106" x2="210" y2="106" stroke="rgba(255, 255, 255, 0.2)" strokeWidth="1" />
        <line x1="68" y1="120" x2="210" y2="120" stroke="rgba(255, 255, 255, 0.2)" strokeWidth="1" />
        {/* Verification stamp */}
        <circle cx="195" cy="155" r="18" stroke="rgba(255, 255, 255, 0.75)" strokeWidth="1.2" strokeDasharray="3 2" />
        <text x="182" y="159" fill="#ffffff" fontSize="9" fontFamily="monospace" letterSpacing="0.08em">
          VERIFIED
        </text>
        {/* Scanner highlight line */}
        <line x1="50" y1="96" x2="230" y2="96" stroke="#ffffff" strokeWidth="1.8" />
      </svg>
      <div className="schematic-caption mono">
        <span>FIELD EXTRACTION MAPPING // PADDLEOCR</span>
      </div>
    </div>
  );
}

export function PathwayAISchematic() {
  return (
    <div className="schematic-container pathway-schematic">
      <svg
        viewBox="0 0 280 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="schematic-svg"
      >
        {/* Ground grid */}
        <ellipse cx="140" cy="165" rx="110" ry="22" stroke="rgba(255, 255, 255, 0.2)" strokeWidth="1" />
        <ellipse cx="140" cy="165" rx="75" ry="15" stroke="rgba(255, 255, 255, 0.35)" strokeWidth="1" />
        
        {/* Towers silhouette */}
        <rect x="65" y="95" width="22" height="70" fill="rgba(20, 20, 26, 0.9)" stroke="rgba(255, 255, 255, 0.3)" />
        <rect x="92" y="70" width="26" height="95" fill="rgba(24, 24, 32, 0.9)" stroke="rgba(255, 255, 255, 0.4)" />
        <rect x="124" y="38" width="32" height="127" fill="rgba(30, 30, 40, 0.95)" stroke="rgba(255, 255, 255, 0.7)" />
        <rect x="162" y="65" width="28" height="100" fill="rgba(24, 24, 32, 0.9)" stroke="rgba(255, 255, 255, 0.4)" />
        <rect x="195" y="105" width="20" height="60" fill="rgba(20, 20, 26, 0.9)" stroke="rgba(255, 255, 255, 0.3)" />
        
        {/* Spire beacon on central tower */}
        <line x1="140" y1="38" x2="140" y2="15" stroke="#ffffff" strokeWidth="1.5" />
        <circle cx="140" cy="15" r="3.5" fill="#ffffff" />
        
        {/* Orbital intelligence ring */}
        <ellipse
          cx="140"
          cy="48"
          rx="52"
          ry="12"
          stroke="rgba(255, 255, 255, 0.85)"
          strokeWidth="1.2"
          strokeDasharray="6 3"
        />
        {/* Streaming data telemetry pulse points */}
        <circle cx="85" cy="135" r="2" fill="#ffffff" />
        <circle cx="140" cy="115" r="2.5" fill="#ffffff" />
        <circle cx="178" cy="125" r="2" fill="#ffffff" />
        <circle cx="140" cy="165" r="3" fill="#ffffff" />
      </svg>
      <div className="schematic-caption mono">
        <span>LIVE TELEMETRY STREAMING RAG // PATHWAY</span>
      </div>
    </div>
  );
}

export function HefinSchematic() {
  return (
    <div className="schematic-container hefin-schematic">
      <svg
        viewBox="0 0 280 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="schematic-svg"
      >
        {/* Outer network boundary */}
        <circle cx="140" cy="100" r="75" stroke="rgba(255, 255, 255, 0.15)" strokeWidth="1" strokeDasharray="4 4" />
        
        {/* Polyhedral intelligence core */}
        <polygon
          points="140,55 178,78 178,122 140,145 102,122 102,78"
          fill="rgba(18, 18, 24, 0.9)"
          stroke="rgba(255, 255, 255, 0.8)"
          strokeWidth="1.5"
        />
        <line x1="140" y1="55" x2="140" y2="145" stroke="rgba(255, 255, 255, 0.4)" strokeWidth="1" />
        <line x1="102" y1="78" x2="178" y2="122" stroke="rgba(255, 255, 255, 0.4)" strokeWidth="1" />
        <line x1="178" y1="78" x2="102" y2="122" stroke="rgba(255, 255, 255, 0.4)" strokeWidth="1" />
        
        {/* Orbiting decentralized nodes */}
        {/* Node 1 */}
        <rect x="68" y="52" width="16" height="16" rx="2" fill="rgba(12, 12, 16, 0.9)" stroke="#ffffff" strokeWidth="1.2" />
        <line x1="84" y1="60" x2="102" y2="78" stroke="rgba(255, 255, 255, 0.5)" strokeWidth="1" strokeDasharray="3 2" />
        
        {/* Node 2 */}
        <rect x="195" y="48" width="16" height="16" rx="2" fill="rgba(12, 12, 16, 0.9)" stroke="#ffffff" strokeWidth="1.2" />
        <line x1="195" y1="56" x2="178" y2="78" stroke="rgba(255, 255, 255, 0.5)" strokeWidth="1" strokeDasharray="3 2" />
        
        {/* Node 3 */}
        <rect x="60" y="125" width="16" height="16" rx="2" fill="rgba(12, 12, 16, 0.9)" stroke="#ffffff" strokeWidth="1.2" />
        <line x1="76" y1="133" x2="102" y2="122" stroke="rgba(255, 255, 255, 0.5)" strokeWidth="1" strokeDasharray="3 2" />
        
        {/* Node 4 */}
        <rect x="205" y="128" width="16" height="16" rx="2" fill="rgba(12, 12, 16, 0.9)" stroke="#ffffff" strokeWidth="1.2" />
        <line x1="205" y1="136" x2="178" y2="122" stroke="rgba(255, 255, 255, 0.5)" strokeWidth="1" strokeDasharray="3 2" />
        
        {/* Center state hash */}
        <circle cx="140" cy="100" r="6" fill="#ffffff" />
        <circle cx="140" cy="100" r="12" stroke="#ffffff" strokeWidth="0.8" />
      </svg>
      <div className="schematic-caption mono">
        <span>DECENTRALIZED IPFS STATE MESH // WEB3</span>
      </div>
    </div>
  );
}
