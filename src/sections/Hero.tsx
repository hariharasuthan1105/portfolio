import {
  ArrowRight,
  ChevronDown,
  LockKeyhole,
  MapPin,
  ExternalLink,
} from "lucide-react";
import CastleGatewayScene from "../components/3d/CastleGatewayScene";
import {
  DocReconHologram,
  PathwayAIHologram,
  HefinHologram,
} from "../components/ui/ProjectHolograms";

import { QualityPreset } from "../components/3d/atmosphere/AtmosphericQualityController";

export default function Hero({
  enter,
  reduced,
  low,
  quality,
  isEntering = false,
  onFlyComplete,
}: {
  enter: () => void;
  reduced: boolean;
  low: boolean;
  quality?: QualityPreset;
  isEntering?: boolean;
  onFlyComplete?: () => void;
}) {
  return (
    <section id="home" className="hero">
      {/* 3D Interactive Gothic Castle Gateway Scene */}
      <CastleGatewayScene
        reduced={reduced}
        low={low}
        quality={quality}
        isEntering={isEntering}
        onEnterRealm={enter}
        onFlyComplete={onFlyComplete}
      />

      {/* Cinematic Vignette & Atmospheric Shadows */}
      <div className="hero-vignette" />

      {/* Left Hero HUD Area (Matching Reference Image A) */}
      <div className="hero-hud-panel">
        <div className="hero-hud-frame">
          <div className="eyebrow-badge mono">
            <span className="blink-dot" />
            <span>:WELCOME TO MY REALM : • • • • •</span>
          </div>

          <h1 className="hero-title">
            KINGDOM
            <br />
            <span className="hero-subtext">OF CODE</span>
          </h1>

          <div className="identity-block">
            <div className="identity-name">HARIHARASUTHAN V</div>
            <div className="identity-role mono">AI &amp; DATA SCIENCE DEVELOPER</div>
          </div>

          <p className="hero-desc">
            Turning complex information
            <br />
            into intelligent systems.
          </p>

          <div className="hero-actions">
            <button
              className="hero-btn-enter"
              onClick={enter}
              aria-label="Enter the Kingdom"
            >
              <span>ENTER THE KINGDOM</span>
              <ArrowRight size={15} />
            </button>

            <a
              className="hero-btn-explore mono"
              href="#projects"
              aria-label="Explore Projects"
            >
              <span>EXPLORE PROJECTS</span>
              <ExternalLink size={13} />
            </a>
          </div>
        </div>
      </div>

      {/* Center-Lower Secret Vault Trigger (Direct access to Intelligence Vault) */}
      <a
        className="hero-vault-btn mono"
        href="#vault"
        aria-label="Unlock the Secret Vault: Three Keys, One Intelligence"
      >
        <LockKeyhole size={14} className="vault-icon" />
        <div className="vault-btn-copy">
          <span className="vault-btn-title">THE SECRET VAULT</span>
          <span className="vault-btn-sub">THREE KEYS. ONE INTELLIGENCE.</span>
        </div>
        <ArrowRight size={13} className="vault-arrow" />
      </a>

      {/* Bottom Interface: Location Badge, 3 Featured Project Cards, Scroll Cue */}
      <div className="hero-bottom-strip">
        {/* Left: Location & Status */}
        <div className="status-badge mono">
          <MapPin size={12} className="pin-icon" />
          <span>COIMBATORE, INDIA</span>
          <span className="status-separator">•</span>
          <span className="status-text">OPEN TO OPPORTUNITIES</span>
        </div>

        {/* Center: 3 Featured Project Cards (Matching Reference Image A) */}
        <div className="hero-project-cards">
          <a href="#projects" className="hero-project-card" aria-label="View DocRecon Project">
            <div className="project-card-hologram">
              <DocReconHologram />
            </div>
            <div className="project-card-footer">
              <div className="project-card-info">
                <span className="project-card-title">DocRecon</span>
                <span className="project-card-desc">Document Intelligence</span>
              </div>
              <div className="project-card-circle-btn">
                <ArrowRight size={13} />
              </div>
            </div>
          </a>

          <a href="#projects" className="hero-project-card" aria-label="View Pathway AI Project">
            <div className="project-card-hologram">
              <PathwayAIHologram />
            </div>
            <div className="project-card-footer">
              <div className="project-card-info">
                <span className="project-card-title">Pathway AI</span>
                <span className="project-card-desc">RAG for Smart Cities</span>
              </div>
              <div className="project-card-circle-btn">
                <ArrowRight size={13} />
              </div>
            </div>
          </a>

          <a href="#projects" className="hero-project-card" aria-label="View HEFIN Project">
            <div className="project-card-hologram">
              <HefinHologram />
            </div>
            <div className="project-card-footer">
              <div className="project-card-info">
                <span className="project-card-title">HEFIN</span>
                <span className="project-card-desc">Decentralized AI Chatbot</span>
              </div>
              <div className="project-card-circle-btn">
                <ArrowRight size={13} />
              </div>
            </div>
          </a>
        </div>

        {/* Right: Mouse Scroll Indicator */}
        <a href="#about" className="scroll-cue mono" aria-label="Scroll down to explore portfolio">
          <div className="scroll-mouse-icon">
            <div className="scroll-wheel-dot" />
          </div>
          <span>SCROLL TO EXPLORE</span>
          <ChevronDown size={13} />
        </a>
      </div>

      {/* Right HUD Telemetry Indicators (Matching Image A) */}
      <div className="hero-telemetry mono" aria-hidden="true">
        <div className="telemetry-row">
          <span>DISCIPLINE</span>
          <div className="telemetry-slider">
            <div className="telemetry-track" />
            <div className="telemetry-pip pip-85" />
          </div>
        </div>
        <div className="telemetry-row">
          <span>CREATIVITY</span>
          <div className="telemetry-slider">
            <div className="telemetry-track" />
            <div className="telemetry-pip pip-92" />
          </div>
        </div>
        <div className="telemetry-row">
          <span>ANALYSIS</span>
          <div className="telemetry-slider">
            <div className="telemetry-track" />
            <div className="telemetry-pip pip-78" />
          </div>
        </div>
        <div className="telemetry-row">
          <span>INNOVATION</span>
          <div className="telemetry-slider">
            <div className="telemetry-track" />
            <div className="telemetry-pip pip-95" />
          </div>
        </div>
        <div className="telemetry-row">
          <span>IMPACT</span>
          <div className="telemetry-slider">
            <div className="telemetry-track" />
            <div className="telemetry-pip pip-90" />
          </div>
        </div>
      </div>

      {/* Corner Technical Framing Marks */}
      <div className="corner-bracket top-left" aria-hidden="true" />
      <div className="corner-bracket bottom-right" aria-hidden="true" />
    </section>
  );
}
