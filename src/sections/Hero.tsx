import {
  ArrowRight,
  ChevronDown,
  MapPin,
  ExternalLink,
} from "lucide-react";
import CastleGatewayScene from "../components/3d/CastleGatewayScene";
import { QualityPreset } from "../components/3d/atmosphere/AtmosphericQualityController";
import { PortalAnimationState } from "../components/3d/portalTransition/PortalTransitionManager";

export default function Hero({
  enter,
  reduced,
  low,
  quality,
  portalState = "IDLE",
  onPortalStateChange,
  onFlyComplete,
}: {
  enter: () => void;
  reduced: boolean;
  low: boolean;
  quality?: QualityPreset;
  portalState?: PortalAnimationState;
  onPortalStateChange?: (state: PortalAnimationState) => void;
  onFlyComplete?: () => void;
}) {
  return (
    <section id="home" className="hero">
      {/* 3D Interactive Gothic Castle Gateway Scene */}
      <CastleGatewayScene
        reduced={reduced}
        low={low}
        quality={quality}
        portalState={portalState}
        onPortalStateChange={onPortalStateChange}
        onEnterRealm={enter}
        onFlyComplete={onFlyComplete}
      />

      {/* Cinematic Vignette & Atmospheric Shadows */}
      <div className="hero-vignette" />

      {/* Left Hero HUD Area */}
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
              onClick={() => enter()}
              aria-label="Explore Projects"
            >
              <span>EXPLORE PROJECTS</span>
              <ExternalLink size={13} />
            </a>
          </div>

          {/* Visible Homepage Vault Hint */}
          <div className="hero-vault-hint-card mono">
            <div className="vault-hint-header">
              <span className="blink-dot" />
              <span className="vault-hint-label">CHAMBER OBJECTIVE</span>
            </div>
            <p className="vault-hint-text">
              THREE KEYS. ONE INTELLIGENCE. UNLOCK MY SUPERPOWER.
            </p>
            <a
              href="#vault"
              className="vault-hint-link"
              onClick={() => enter()}
              aria-label="Jump directly to the Intelligence Vault"
            >
              <span>ACCESS THE VAULT</span>
              <ArrowRight size={11} />
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Interface: Location Badge and Scroll Cue */}
      <div className="hero-bottom-strip">
        {/* Left: Location & Status */}
        <div className="status-badge mono">
          <MapPin size={12} className="pin-icon" />
          <span>COIMBATORE, INDIA</span>
          <span className="status-separator">•</span>
          <span className="status-text">OPEN TO OPPORTUNITIES</span>
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
