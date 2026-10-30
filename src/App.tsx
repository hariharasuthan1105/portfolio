import { useCallback, lazy, Suspense, useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  Menu,
  X,
  SlidersHorizontal,
  FastForward,
  Volume2,
  VolumeX,
} from "lucide-react";
import Hero from "./sections/Hero";
import BrandEmblem from "./components/ui/BrandEmblem";
import { useMotionPreference } from "./hooks/useMotionPreference";
import { useAtmosphericQuality } from "./components/3d/atmosphere/AtmosphericQualityController";
import { PortalAnimationState } from "./components/3d/portalTransition/PortalTransitionManager";
import { useKingdomAudio } from "./hooks/useKingdomAudio";

const Portfolio = lazy(() => import("./sections/Portfolio"));
const Vault = lazy(() => import("./features/intelligence-vault/Vault"));

const links = [
  "Home",
  "About",
  "Skills",
  "Projects",
  "Experience",
  "Achievements",
  "Vault",
  "Contact",
];

export default function App() {
  const reduced = useMotionPreference();
  const { quality, cycleQuality } = useAtmosphericQuality(reduced);
  const low = quality === "low";
  const [menu, setMenu] = useState(false);
  const [active, setActive] = useState("home");
  const [portalState, setPortalState] = useState<PortalAnimationState>("IDLE");
  const [intro, setIntro] = useState(false);
  const { isPlaying: musicPlaying, toggle: toggleMusic } = useKingdomAudio();

  // Centralized Return-to-Home trigger
  const triggerReturnHome = useCallback(() => {
    setPortalState((curr) => {
      if (curr === "IDLE" || curr === "RETURNING") return curr;
      return "RETURNING";
    });
  }, []);

  // Listen for browser navigation (Back / Forward button, Hash changes)
  useEffect(() => {
    const handleNavigation = () => {
      const hash = location.hash.toLowerCase();
      if (!hash || hash === "#home" || hash === "#") {
        triggerReturnHome();
      }
    };
    window.addEventListener("hashchange", handleNavigation);
    window.addEventListener("popstate", handleNavigation);
    return () => {
      window.removeEventListener("hashchange", handleNavigation);
      window.removeEventListener("popstate", handleNavigation);
    };
  }, [triggerReturnHome]);

  useEffect(() => {
    document.documentElement.dataset.motion =
      reduced || low ? "reduced" : "full";
  }, [reduced, low]);

  // Section scroll tracker
  useEffect(() => {
    let frame = 0;
    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const sections = Array.from(
          document.querySelectorAll("main section[id]"),
        );
        const current = sections
          .filter((s) => s.getBoundingClientRect().top <= innerHeight * 0.45)
          .at(-1);
        if (current) {
          setActive(current.id);
          // If user scrolled back up to home section, trigger return reset
          if (current.id === "home") {
            triggerReturnHome();
          }
        }
      });
    };
    addEventListener("scroll", update, { passive: true });
    return () => {
      removeEventListener("scroll", update);
      cancelAnimationFrame(frame);
    };
  }, [triggerReturnHome]);

  const enter = () => {
    if (reduced) {
      location.hash = "about";
      document.getElementById("about")?.scrollIntoView({ behavior: "smooth" });
      return;
    }
    setPortalState("ACTIVATING");
  };

  const handleFlyComplete = () => {
    setPortalState("INSIDE");
    location.hash = "about";
    document.getElementById("about")?.scrollIntoView({ behavior: "smooth" });
  };

  const skipToAbout = () => {
    setPortalState("INSIDE");
    setIntro(false);
    location.hash = "about";
    document.getElementById("about")?.scrollIntoView({ behavior: "smooth" });
  };

  const handleNavClick = (linkName: string) => {
    setMenu(false);
    if (linkName.toLowerCase() === "home") {
      triggerReturnHome();
    }
  };

  return (
    <>
      <a href="#about" className="skip-link">
        Skip to portfolio
      </a>

      <header className="topbar">
        <a className="brand" href="#home" onClick={() => handleNavClick("home")}>
          <BrandEmblem size={28} />
          <div className="brand-text">
            <span className="brand-name mono">HARIHARASUTHAN V</span>
            <span className="brand-role mono">[ AI &amp; DATA SCIENCE ]</span>
          </div>
        </a>

        <nav aria-label="Main navigation" className={menu ? "open" : ""}>
          {links.map((l, i) => (
            <a
              href={"#" + l.toLowerCase()}
              onClick={() => handleNavClick(l)}
              aria-current={active === l.toLowerCase() ? "location" : undefined}
              key={l}
            >
              <small>0{i + 1}</small>
              {l}
            </a>
          ))}
        </nav>

        <div className="nav-end">
          <button
            className="skip-intro-btn mono"
            onClick={skipToAbout}
            aria-label="Skip to portfolio about section"
          >
            <FastForward size={11} className="skip-icon" />
            <span>SKIP INTRO</span>
          </button>

          <button
            className={`icon-button audio-toggle ${musicPlaying ? "active" : ""}`}
            aria-label={musicPlaying ? "Mute background music" : "Enable background music"}
            title={musicPlaying ? "Mute background music" : "Enable background music"}
            onClick={toggleMusic}
          >
            {musicPlaying ? (
              <div className="audio-icon-wrapper active">
                <Volume2 size={15} className="audio-speaker-icon" />
                <span className="audio-eq-bars" aria-hidden="true">
                  <span className="bar bar-1"></span>
                  <span className="bar bar-2"></span>
                  <span className="bar bar-3"></span>
                </span>
              </div>
            ) : (
              <div className="audio-icon-wrapper muted">
                <VolumeX size={15} className="audio-speaker-icon" />
              </div>
            )}
          </button>

          <button
            className="icon-button quality-toggle"
            aria-label={`Atmospheric VFX quality: ${quality.toUpperCase()}`}
            title={`VFX Quality: ${quality.toUpperCase()} (Click to toggle HIGH / MED / LOW)`}
            onClick={cycleQuality}
          >
            <SlidersHorizontal size={15} />
            <span>{quality === "high" ? "HQ" : quality === "medium" ? "MED" : "LITE"}</span>
          </button>

          <button
            className="menu-toggle icon-button"
            aria-label="Toggle navigation"
            aria-expanded={menu}
            onClick={() => setMenu(!menu)}
          >
            {menu ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </header>

      <main>
        <Hero
          enter={enter}
          reduced={reduced}
          low={low}
          quality={quality}
          portalState={portalState}
          onPortalStateChange={setPortalState}
          onFlyComplete={handleFlyComplete}
        />

        <Suspense fallback={<p className="loading">Opening the archive…</p>}>
          <Portfolio reduced={reduced} low={low} />
          <Vault />
        </Suspense>
      </main>

      <footer>
        <a href="#home" onClick={() => handleNavClick("home")}>KINGDOM OF CODE</a>
        <span>HARIHARASUTHAN V · BUILT WITH CURIOSITY</span>
        <a
          href="https://github.com/hariharasuthan1105/portfolio"
          target="_blank"
          rel="noreferrer"
        >
          SOURCE CODE ↗
        </a>
        <a href="#vault">UNLOCK THE VAULT ↗</a>
      </footer>

      {/* Fly-Through Flash Bloom Overlay */}
      <AnimatePresence>
        {(portalState === "ACTIVATING" || portalState === "ENTERING") && (
          <motion.div
            className="portal-flash-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.15, 0.85, 0] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.45, times: [0, 0.35, 0.85, 1.0] }}
          />
        )}
      </AnimatePresence>
    </>
  );
}
