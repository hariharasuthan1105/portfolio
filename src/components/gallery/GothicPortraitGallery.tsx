import React, { useState, useEffect, useRef } from "react";
import { ProjectData } from "../../data/profile";
import {
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  X,
  FileText,
  Activity,
  Shield,
  Layers,
  Cpu,
  Brain,
  CheckCircle2,
} from "lucide-react";

interface GothicPortraitGalleryProps {
  projects: ProjectData[];
  selectedProjectIndex: number | null;
  onSelectProject: (index: number | null) => void;
  reduced: boolean;
}

export default function GothicPortraitGallery({
  projects,
  selectedProjectIndex,
  onSelectProject,
  reduced,
}: GothicPortraitGalleryProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [mobileIndex, setMobileIndex] = useState<number>(1); // Center (Pathway AI) by default on mobile
  const detailsRef = useRef<HTMLDivElement>(null);

  // Keyboard navigation & Escape handling
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && selectedProjectIndex !== null) {
        onSelectProject(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedProjectIndex, onSelectProject]);

  // Scroll smoothly to details panel when opened
  useEffect(() => {
    if (selectedProjectIndex !== null && detailsRef.current) {
      detailsRef.current.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }, [selectedProjectIndex]);

  // Project portraits metadata
  const portraitItems = [
    {
      index: 0,
      id: "docrecon",
      name: "DocRecon",
      category: "Document Intelligence",
      categoryShort: "DOCUMENT INTELLIGENCE",
      headline: "Turning unstructured scan pages into reviewable, structured relational fields.",
      artworkWebp: "/assets/portrait-docrecon.webp",
      artworkJpg: "/assets/portrait-docrecon.jpg",
      actionText: "VIEW SOURCE CODE",
      actionUrl: "https://github.com/hariharasuthan1105/docai",
      isLive: false,
      badgeIcon: <FileText size={16} aria-hidden="true" />,
      techBadges: ["Python", "PaddleOCR", "FastAPI", "OpenCV"],
    },
    {
      index: 1,
      id: "pathway",
      name: "Pathway AI",
      category: "Smart Urban Intelligence",
      categoryShort: "SMART CITY INTELLIGENCE",
      headline: "Real-time retrieval-augmented generation grounded in live municipal IoT telemetry.",
      artworkWebp: "/assets/portrait-pathway.webp",
      artworkJpg: "/assets/portrait-pathway.jpg",
      actionText: "LAUNCH PROJECT",
      actionUrl: "https://hariharasuthan1105.github.io/pathway-safety-urban-planning/",
      isLive: true,
      badgeIcon: <Activity size={16} aria-hidden="true" />,
      techBadges: ["Python", "Pathway", "LangChain", "FastAPI"],
    },
    {
      index: 2,
      id: "hefin",
      name: "HEFIN",
      category: "Decentralized AI",
      categoryShort: "DECENTRALIZED DATA SECURITY",
      headline: "Conversational language model interface connected to decentralized storage.",
      artworkWebp: "/assets/portrait-hefin.webp",
      artworkJpg: "/assets/portrait-hefin.jpg",
      actionText: "LAUNCH PROJECT",
      actionUrl: "https://hariharasuthan1105.github.io/-HEFIN/",
      isLive: true,
      badgeIcon: <Shield size={16} aria-hidden="true" />,
      techBadges: ["Node.js", "Express", "Web3", "IPFS"],
    },
  ];

  const activeProject =
    selectedProjectIndex !== null ? projects[selectedProjectIndex] : null;
  const activePortraitItem =
    selectedProjectIndex !== null ? portraitItems[selectedProjectIndex] : null;

  return (
    <div className="gothic-gallery-stage-container" aria-label="Gothic Portrait Gallery">
      {/* =================================================================== */}
      {/* 1. ATMOSPHERIC CATHEDRAL LIGHTING & MOVING BANNERS LAYER             */}
      {/* =================================================================== */}
      <div className="gallery-atmospheric-layer" aria-hidden="true">
        {/* Soft atmospheric window light shafts */}
        <div className="cathedral-window-rays ray-left" />
        <div className="cathedral-window-rays ray-center" />
        <div className="cathedral-window-rays ray-right" />

        {/* Ambient candle flame flickers on columns */}
        <div className="cathedral-candle-sconce sconce-left">
          <span className="candle-flame flame-1" />
          <span className="candle-flame flame-2" />
        </div>
        <div className="cathedral-candle-sconce sconce-mid-left">
          <span className="candle-flame flame-1" />
          <span className="candle-flame flame-2" />
        </div>
        <div className="cathedral-candle-sconce sconce-mid-right">
          <span className="candle-flame flame-1" />
          <span className="candle-flame flame-2" />
        </div>
        <div className="cathedral-candle-sconce sconce-right">
          <span className="candle-flame flame-1" />
          <span className="candle-flame flame-2" />
        </div>

        {/* =================================================================== */}
        {/* 2. NATURAL MOVING CATHEDRAL BANNERS (LEFT & RIGHT ARCHES)            */}
        {/* Natural fabric wave with fixed upper attachment & graceful swaying  */}
        {/* =================================================================== */}
        {/* Upper Left Cathedral Banner */}
        <div className={`cathedral-banner banner-left ${reduced ? "motion-reduced" : ""}`}>
          <div className="banner-hanging-rod" />
          <div className="banner-hanging-cords" />
          <div className="banner-fabric-body">
            <svg
              className="banner-crest-svg"
              viewBox="0 0 120 280"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Gothic Swallowtail Banner Outline */}
              <path
                d="M10 0 H110 V230 L60 270 L10 230 Z"
                fill="#0a0a0d"
                stroke="rgba(255, 255, 255, 0.35)"
                strokeWidth="1.5"
              />
              {/* Inner Embroidered Filigree Border */}
              <path
                d="M18 8 H102 V222 L60 256 L18 222 Z"
                fill="none"
                stroke="rgba(255, 255, 255, 0.18)"
                strokeWidth="1"
                strokeDasharray="3 3"
              />
              {/* Laurel Crest Wreath */}
              <path
                d="M45 70 C35 85 35 110 48 125 C40 120 32 105 35 85 Z"
                fill="rgba(255, 255, 255, 0.55)"
              />
              <path
                d="M75 70 C85 85 85 110 72 125 C80 120 88 105 85 85 Z"
                fill="rgba(255, 255, 255, 0.55)"
              />
              {/* Center Heraldic Sword / Star */}
              <circle cx="60" cy="98" r="7" fill="rgba(255, 255, 255, 0.75)" />
              <path
                d="M60 82 L63 94 L75 97 L63 100 L60 112 L57 100 L45 97 L57 94 Z"
                fill="#ffffff"
              />
              {/* Roman Numeral & Gothic Flourish */}
              <text
                x="60"
                y="160"
                textAnchor="middle"
                fill="rgba(255, 255, 255, 0.45)"
                fontFamily="var(--font-mono)"
                fontSize="10"
                letterSpacing="3"
              >
                M M X X I V
              </text>
              <line
                x1="36"
                y1="175"
                x2="84"
                y2="175"
                stroke="rgba(255, 255, 255, 0.25)"
                strokeWidth="1"
              />
            </svg>
            <div className="banner-shadow-fold" />
          </div>
        </div>

        {/* Upper Right Cathedral Banner */}
        <div className={`cathedral-banner banner-right ${reduced ? "motion-reduced" : ""}`}>
          <div className="banner-hanging-rod" />
          <div className="banner-hanging-cords" />
          <div className="banner-fabric-body">
            <svg
              className="banner-crest-svg"
              viewBox="0 0 120 280"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Gothic Swallowtail Banner Outline */}
              <path
                d="M10 0 H110 V230 L60 270 L10 230 Z"
                fill="#0a0a0d"
                stroke="rgba(255, 255, 255, 0.35)"
                strokeWidth="1.5"
              />
              {/* Inner Embroidered Filigree Border */}
              <path
                d="M18 8 H102 V222 L60 256 L18 222 Z"
                fill="none"
                stroke="rgba(255, 255, 255, 0.18)"
                strokeWidth="1"
                strokeDasharray="3 3"
              />
              {/* Laurel Crest Wreath */}
              <path
                d="M45 70 C35 85 35 110 48 125 C40 120 32 105 35 85 Z"
                fill="rgba(255, 255, 255, 0.55)"
              />
              <path
                d="M75 70 C85 85 85 110 72 125 C80 120 88 105 85 85 Z"
                fill="rgba(255, 255, 255, 0.55)"
              />
              {/* Center Heraldic Shield / Diamond */}
              <circle cx="60" cy="98" r="7" fill="rgba(255, 255, 255, 0.75)" />
              <path
                d="M60 82 L63 94 L75 97 L63 100 L60 112 L57 100 L45 97 L57 94 Z"
                fill="#ffffff"
              />
              {/* Latin Creed */}
              <text
                x="60"
                y="160"
                textAnchor="middle"
                fill="rgba(255, 255, 255, 0.45)"
                fontFamily="var(--font-mono)"
                fontSize="9"
                letterSpacing="2.5"
              >
                V E R I T A S
              </text>
              <line
                x1="36"
                y1="175"
                x2="84"
                y2="175"
                stroke="rgba(255, 255, 255, 0.25)"
                strokeWidth="1"
              />
            </svg>
            <div className="banner-shadow-fold" />
          </div>
        </div>

        {/* Floating atmospheric dust motes */}
        {!reduced && (
          <div className="cathedral-dust-motes">
            {[...Array(16)].map((_, i) => (
              <span
                key={i}
                className="dust-mote"
                style={{
                  left: `${(i * 6.2 + 8) % 92}%`,
                  top: `${(i * 9.4 + 14) % 80}%`,
                  animationDelay: `${(i * 0.7) % 5}s`,
                  animationDuration: `${6 + (i % 4) * 2}s`,
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* =================================================================== */}
      {/* 3. TRIPTYCH WALL PORTRAIT GALLERY                                   */}
      {/* Three monumental gothic framed wall portraits displayed side-by-side */}
      {/* =================================================================== */}
      <div className="gothic-triptych-wall" role="list" aria-label="Monumental Project Wall Portraits">
        {portraitItems.map((item) => {
          const isSelected = selectedProjectIndex === item.index;
          const isHovered = hoveredIndex === item.index;
          const isCenter = item.index === 1;

          return (
            <div
              key={item.id}
              role="listitem"
              className={`gothic-portrait-station station-${item.id} ${
                isCenter ? "station-center-prominent" : "station-side"
              } ${isSelected ? "is-selected" : ""} ${isHovered ? "is-hovered" : ""}`}
              onMouseEnter={() => setHoveredIndex(item.index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              {/* Overhead Tubular Silver Gallery Spotlight */}
              <div className="overhead-spotlight-fixture" aria-hidden="true">
                <div className="spotlight-casing">
                  <span className="spotlight-tube-mount" />
                  <span className="spotlight-tube-lamp" />
                </div>
                {/* Projected Downward Conical Spotlight Beam */}
                <div className={`spotlight-beam-cone ${isHovered || isSelected ? "beam-active" : ""}`} />
              </div>

              {/* Ornate Gothic Picture Frame & Artwork Canvas */}
              <div
                className="gothic-frame-assembly"
                onClick={() => {
                  onSelectProject(isSelected ? null : item.index);
                  setMobileIndex(item.index);
                }}
                tabIndex={0}
                role="button"
                aria-pressed={isSelected}
                aria-label={`Select ${item.name} project portrait to view architecture specifications`}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    onSelectProject(isSelected ? null : item.index);
                    setMobileIndex(item.index);
                  }
                }}
              >
                {/* Silver corner embellishments & travelling highlight gleam */}
                <div className="frame-gleam-line" aria-hidden="true" />

                <div className="frame-canvas-wrapper">
                  <picture>
                    <source srcSet={item.artworkWebp} type="image/webp" />
                    <img
                      src={item.artworkJpg}
                      alt={`${item.name} - ${item.category}`}
                      className="portrait-canvas-image"
                      loading="lazy"
                    />
                  </picture>

                  {/* Subtle inner shadow and holographic overlay */}
                  <div className="canvas-vignette-inner" aria-hidden="true" />

                  {/* Corner Index Tag */}
                  <div className="portrait-canvas-index mono" aria-hidden="true">
                    0{item.index + 1}
                  </div>
                </div>
              </div>

              {/* Mounted Obsidian Inscription Plaque (Below Frame) */}
              <div className="obsidian-inscription-plaque">
                <div className="plaque-top-meta">
                  <h3 className="plaque-project-title">{item.name}</h3>
                  <span className="plaque-category-label mono">{item.categoryShort}</span>
                </div>

                <p className="plaque-summary-text">{item.headline}</p>

                {/* Tech Badges & Interactive Trigger */}
                <div className="plaque-bottom-bar">
                  <div className="plaque-tech-pills mono">
                    {item.techBadges.map((tech) => (
                      <span key={tech} className="tech-badge-item">
                        {tech}
                      </span>
                    ))}
                  </div>

                  <button
                    type="button"
                    className={`plaque-view-cta mono ${isSelected ? "cta-active" : ""}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectProject(isSelected ? null : item.index);
                      setMobileIndex(item.index);
                    }}
                    aria-expanded={isSelected}
                  >
                    <span>{isSelected ? "HIDE SPECS" : "VIEW DETAILS"}</span>
                    <span className="cta-arrow">{isSelected ? "▲" : "→"}</span>
                  </button>
                </div>
              </div>

              {/* Soft Floor Reflection directly beneath portrait */}
              <div className="portrait-floor-reflection" aria-hidden="true" />
            </div>
          );
        })}
      </div>

      {/* =================================================================== */}
      {/* 4. FOREGROUND EXPLORER SILHOUETTE & CONCENTRIC MARBLE FLOOR         */}
      {/* =================================================================== */}
      <div className="gallery-foreground-floor" aria-hidden="true">
        {/* Intricate Concentric Marble Inlaid Rings */}
        <div className="concentric-marble-inlay">
          <div className="marble-ring ring-outer" />
          <div className="marble-ring ring-mid" />
          <div className="marble-ring ring-inner" />
          <div className="marble-ring-spokes" />
        </div>

        {/* Cloaked Explorer Silhouette Facing the Gallery */}
        <div className="cloaked-explorer-figure">
          <img
            src="/assets/cloaked-explorer.png"
            alt=""
            className="explorer-silhouette-img"
            loading="lazy"
          />
          <div className="explorer-ground-contact-shadow" />
        </div>
      </div>

      {/* =================================================================== */}
      {/* 5. MOBILE ACCESSIBLE NAVIGATION STRIP (VISIBLE ON <= 880px)         */}
      {/* =================================================================== */}
      <div className="gallery-mobile-nav-strip">
        <button
          type="button"
          className="mobile-gallery-arrow prev mono"
          aria-label="Previous project portrait"
          onClick={() => {
            const prev = (mobileIndex - 1 + portraitItems.length) % portraitItems.length;
            setMobileIndex(prev);
            onSelectProject(prev);
          }}
        >
          <ChevronLeft size={20} />
        </button>

        <div className="mobile-gallery-indicators">
          {portraitItems.map((item, idx) => (
            <button
              key={item.id}
              type="button"
              className={`mobile-indicator-pip mono ${mobileIndex === idx ? "active" : ""}`}
              onClick={() => {
                setMobileIndex(idx);
                onSelectProject(idx);
              }}
              aria-label={`View portrait 0${idx + 1}: ${item.name}`}
            >
              0{idx + 1}
            </button>
          ))}
        </div>

        <button
          type="button"
          className="mobile-gallery-arrow next mono"
          aria-label="Next project portrait"
          onClick={() => {
            const next = (mobileIndex + 1) % portraitItems.length;
            setMobileIndex(next);
            onSelectProject(next);
          }}
        >
          <ChevronRight size={20} />
        </button>
      </div>

      {/* =================================================================== */}
      {/* 6. EXPANDED OBSIDIAN SPECIFICATIONS PANEL (CLICK-TO-REVEAL)         */}
      {/* Reserved region below gallery with authentic problem/approach/specs */}
      {/* =================================================================== */}
      {activeProject && activePortraitItem && (
        <aside
          ref={detailsRef}
          className="gallery-expanded-specs-panel glassmorphism"
          role="region"
          aria-label={`${activeProject.name} Architecture Specifications`}
          tabIndex={-1}
        >
          {/* Panel Header */}
          <div className="specs-panel-header">
            <div className="specs-header-meta mono">
              <span className="specs-tag-pill">
                0{activePortraitItem.index + 1} // {activePortraitItem.categoryShort}
              </span>
              <span className="specs-status-indicator">
                <span className="specs-status-dot" />
                <span>ACTIVE ARCHIVE SPECIFICATION</span>
              </span>
            </div>

            <button
              type="button"
              className="specs-close-btn mono"
              onClick={() => onSelectProject(null)}
              aria-label="Close project specifications"
            >
              <X size={16} />
              <span>CLOSE</span>
            </button>
          </div>

          {/* Panel Body Grid */}
          <div className="specs-panel-body-grid">
            {/* Left Column: Title, Headline, Problem & Approach */}
            <div className="specs-col-primary">
              <h3 className="specs-project-title">{activeProject.name}</h3>
              <p className="specs-project-headline mono">{activeProject.headline}</p>

              <div className="specs-narrative-block">
                <h4 className="narrative-label mono">THE ENGINEERING PROBLEM:</h4>
                <p className="narrative-text">{activeProject.problem}</p>
              </div>

              <div className="specs-narrative-block">
                <h4 className="narrative-label mono">SYSTEM ARCHITECTURE & APPROACH:</h4>
                <p className="narrative-text">{activeProject.approach}</p>
              </div>

              {/* Primary Project Action Button */}
              <div className="specs-action-row">
                <a
                  href={activePortraitItem.actionUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="gallery-primary-action-btn mono"
                  aria-label={`${activePortraitItem.actionText} for ${activeProject.name}`}
                >
                  <span>{activePortraitItem.actionText}</span>
                  <ExternalLink size={15} />
                </a>

                {activeProject.github && activePortraitItem.isLive && (
                  <a
                    href={activeProject.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="gallery-secondary-action-btn mono"
                  >
                    <span>VIEW GITHUB REPO</span>
                    <ExternalLink size={13} />
                  </a>
                )}
              </div>
            </div>

            {/* Right Column: Verified Capabilities, Tech Stack & Key Takeaway */}
            <div className="specs-col-secondary">
              {/* Verified Capabilities */}
              <div className="specs-features-card">
                <h4 className="specs-card-heading mono">VERIFIED SYSTEM CAPABILITIES</h4>
                <ul className="specs-features-list">
                  {activeProject.features.map((feat, i) => (
                    <li key={i} className="specs-feature-item">
                      <CheckCircle2 size={15} className="feature-check-icon" aria-hidden="true" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Technical Stack Tags */}
              <div className="specs-stack-card">
                <h4 className="specs-card-heading mono">TECHNOLOGY ARSENAL</h4>
                <div className="specs-tech-pills-wrap mono">
                  {activeProject.technologies.map((tech) => (
                    <span key={tech} className="specs-tech-tag">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Engineering Lesson / Challenge */}
              {activeProject.lessonsLearned && (
                <div className="specs-takeaway-card">
                  <h4 className="specs-card-heading mono">ENGINEERING TAKEAWAY</h4>
                  <p className="specs-takeaway-text">{activeProject.lessonsLearned}</p>
                </div>
              )}
            </div>
          </div>
        </aside>
      )}
    </div>
  );
}
