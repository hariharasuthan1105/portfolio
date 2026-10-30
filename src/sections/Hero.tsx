import { useState, useCallback } from "react";
import {
  ArrowRight,
  ChevronDown,
  LockKeyhole,
  MapPin,
  ExternalLink,
} from "lucide-react";
import CastleGatewayScene from "../components/3d/CastleGatewayScene";

export default function Hero({
  enter,
  reduced,
  low,
  isEntering = false,
  onFlyComplete,
}: {
  enter: () => void;
  reduced: boolean;
  low: boolean;
  isEntering?: boolean;
  onFlyComplete?: () => void;
}) {
  return (
    <section id="home" className="hero">
      {/* 3D Interactive Gothic Castle Gateway Scene */}
      <CastleGatewayScene
        reduced={reduced}
        low={low}
        isEntering={isEntering}
        onEnterRealm={enter}
        onFlyComplete={onFlyComplete}
      />

      {/* Cinematic Vignette & Atmospheric Shadows */}
      <div className="hero-vignette" />

      {/* Glassmorphic Hero Left HUD Panel */}
      <div className="hero-hud-panel">
        <div className="eyebrow-badge mono">
          <span className="blink-dot" />
          [ WELCOME_TO_MY_REALM ]
        </div>

        <h1 className="hero-title">
          KINGDOM
          <br />
          <span className="hero-subtext">OF_CODE</span>
        </h1>

        <div className="identity-block">
          <div className="identity-name">HARIHARASUTHAN V</div>
          <div className="identity-role mono">AI & DATA SCIENCE DEVELOPER</div>
        </div>

        <p className="hero-desc">
          Turning complex information
          <br />
          into intelligent systems.
        </p>

        <div className="hero-actions">
          <button
            className="button primary hero-btn-enter"
            onClick={enter}
            aria-label="Enter the Kingdom"
          >
            <span>ENTER THE KINGDOM</span>
            <ArrowRight size={16} />
          </button>

          <a
            className="button secondary hero-btn-explore"
            href="#projects"
            aria-label="Explore Projects"
          >
            <span>EXPLORE PROJECTS</span>
            <ExternalLink size={14} />
          </a>
        </div>
      </div>

      {/* Bottom Featured Projects Strip (matching Reference Image 1 & 3) */}
      <div className="hero-bottom-strip">
        <div className="status-badge mono">
          <MapPin size={13} className="pin-icon" />
          <span>COIMBATORE, INDIA</span>
          <span className="status-dot" />
          <span className="status-text">OPEN TO OPPORTUNITIES</span>
        </div>

        <div className="featured-projects-cards">
          <a href="#projects" className="feat-card">
            <span className="feat-num mono">01</span>
            <div className="feat-info">
              <span className="feat-name">DocRecon</span>
              <span className="feat-desc">Document Intelligence & Field Extraction</span>
            </div>
          </a>

          <a href="#projects" className="feat-card">
            <span className="feat-num mono">02</span>
            <div className="feat-info">
              <span className="feat-name">Pathway AI</span>
              <span className="feat-desc">RAG for Smart Urban Management</span>
            </div>
          </a>

          <a href="#projects" className="feat-card">
            <span className="feat-num mono">03</span>
            <div className="feat-info">
              <span className="feat-name">HEFIN</span>
              <span className="feat-desc">Decentralized AI Chatbot</span>
            </div>
          </a>
        </div>

        <div className="hero-motto mono">
          SOME BUILD SYSTEMS.
          <br />
          <strong>I BUILD POSSIBILITIES.</strong>
        </div>
      </div>

      {/* Secret Vault Discovery Hint Badge */}
      <a className="vault-hint" href="#vault" aria-label="Discover Secret Vault">
        <LockKeyhole size={16} />
        <div>
          <span className="vault-label">THE SECRET VAULT</span>
          <small>THREE KEYS. ONE INTELLIGENCE.</small>
        </div>
        <ArrowRight size={14} />
      </a>

      {/* Right HUD Telemetry Values */}
      <div className="hero-values mono" aria-hidden="true">
        <span>DISCIPLINE</span>
        <i />
        <span>CREATIVITY</span>
        <i />
        <span>ANALYSIS</span>
        <i />
        <span>INNOVATION</span>
        <i />
        <span>IMPACT</span>
      </div>

      {/* Bottom Right Scroll Cue */}
      <a href="#about" className="scroll-cue mono" aria-label="Scroll to explore">
        <div className="scroll-mouse-icon">
          <div className="scroll-wheel-dot" />
        </div>
        <span>SCROLL TO EXPLORE</span>
        <ChevronDown size={14} />
      </a>

      {/* Technical Corner Crosshairs */}
      <div className="corner-reticle top-left" aria-hidden="true" />
      <div className="corner-reticle bottom-right" aria-hidden="true" />
    </section>
  );
}
