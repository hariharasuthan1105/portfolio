import { lazy, Suspense, useEffect, useState } from "react";
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

const Portfolio = lazy(() => import("./sections/Portfolio"));
const Vault = lazy(() => import("./features/intelligence-vault/Vault"));

const links = [
  "Home",
  "About",
  "Skills",
  "Projects",
  "Experience",
  "Achievements",
  "Contact",
];

export default function App() {
  const reduced = useMotionPreference();
  const { quality, cycleQuality } = useAtmosphericQuality(reduced);
  const low = quality === "low";
  const [menu, setMenu] = useState(false);
  const [active, setActive] = useState("home");
  const [isEntering, setIsEntering] = useState(false);
  const [intro, setIntro] = useState(false);
  const [muted, setMuted] = useState(true);

  useEffect(() => {
    document.documentElement.dataset.motion =
      reduced || low ? "reduced" : "full";
  }, [reduced, low]);

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
        if (current) setActive(current.id);
      });
    };
    addEventListener("scroll", update, { passive: true });
    return () => {
      removeEventListener("scroll", update);
      cancelAnimationFrame(frame);
    };
  }, []);

  const enter = () => {
    if (reduced) {
      location.hash = "about";
      document.getElementById("about")?.scrollIntoView({ behavior: "smooth" });
      return;
    }
    setIsEntering(true);
  };

  const handleFlyComplete = () => {
    setIsEntering(false);
    location.hash = "about";
    document.getElementById("about")?.scrollIntoView({ behavior: "smooth" });
  };

  const skipToAbout = () => {
    setIsEntering(false);
    setIntro(false);
    location.hash = "about";
    document.getElementById("about")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <a href="#about" className="skip-link">
        Skip to portfolio
      </a>

      <header className="topbar">
        <a className="brand" href="#home">
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
              onClick={() => setMenu(false)}
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
            className="icon-button audio-toggle"
            aria-label={muted ? "Sound muted" : "Sound active"}
            title={muted ? "Sound muted" : "Sound active"}
            onClick={() => setMuted(!muted)}
          >
            {muted ? <VolumeX size={15} /> : <Volume2 size={15} />}
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
          isEntering={isEntering}
          onFlyComplete={handleFlyComplete}
        />

        <Suspense fallback={<p className="loading">Opening the archive…</p>}>
          <Portfolio reduced={reduced} low={low} />
          <Vault />
        </Suspense>
      </main>

      <footer>
        <a href="#home">KINGDOM OF CODE</a>
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
        {isEntering && (
          <motion.div
            className="portal-flash-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.2, 0.85, 0] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.4, times: [0, 0.4, 0.85, 1.0] }}
          />
        )}
      </AnimatePresence>
    </>
  );
}
