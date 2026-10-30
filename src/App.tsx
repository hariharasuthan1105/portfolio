import { lazy, Suspense, useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  ArrowUpRight,
  Menu,
  X,
  SlidersHorizontal,
  ArrowRight,
} from "lucide-react";
import Hero from "./sections/Hero";
import { useMotionPreference } from "./hooks/useMotionPreference";
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
  const [low, setLow] = useState(
    () => localStorage.getItem("kingdom-quality") === "low",
  );
  const [menu, setMenu] = useState(false);
  const [active, setActive] = useState("home");
  const [intro, setIntro] = useState(false);
  useEffect(() => {
    document.documentElement.dataset.motion =
      reduced || low ? "reduced" : "full";
    localStorage.setItem("kingdom-quality", low ? "low" : "high");
  }, [reduced, low]);
  useEffect(() => {
    if (!intro) return;
    const t = setTimeout(() => {
      setIntro(false);
      document.getElementById("about")?.scrollIntoView({ behavior: "instant" });
    }, 1200);
    return () => clearTimeout(t);
  }, [intro]);
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
      return;
    }
    setIntro(true);
  };
  return (
    <>
      <a href="#about" className="skip-link">
        Skip to portfolio
      </a>
      <header className="topbar">
        <a className="brand" href="#home">
          HARIHARASUTHAN V<span>[ AI & DATA SCIENCE ]</span>
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
          <span className="signal">▂▃▅▇</span>
          <button
            className="icon-button"
            aria-label={
              low ? "Enable cinematic effects" : "Enable low quality mode"
            }
            title={
              low
                ? "Lite mode · click for cinematic"
                : "Cinematic · click for lite mode"
            }
            onClick={() => setLow(!low)}
          >
            <SlidersHorizontal size={17} />
            <span>{low ? "LITE" : "HQ"}</span>
          </button>
          <button
            className="menu-toggle icon-button"
            aria-label="Toggle navigation"
            aria-expanded={menu}
            onClick={() => setMenu(!menu)}
          >
            {menu ? <X /> : <Menu />}
          </button>
        </div>
      </header>
      <main>
        <Hero enter={enter} reduced={reduced} low={low} />
        <div className="project-strip">
          <span className="mono">
            SELECTED SYSTEMS <ArrowRight size={14} />
          </span>
          {["DocRecon", "Pathway AI", "HEFIN"].map((name, i) => (
            <a href="#projects" key={name}>
              <small>0{i + 1}</small>
              {name}
              <ArrowUpRight size={17} />
            </a>
          ))}
        </div>
        <Suspense fallback={<p className="loading">Opening the archive…</p>}>
          <Portfolio reduced={reduced} low={low} />
          <Vault />
        </Suspense>
      </main>
      <footer>
        <a href="#home">KINGDOM OF CODE</a>
        <span>HARIHARASUTHAN V · BUILT WITH CURIOSITY</span>
        <a href="https://github.com/hariharasuthan1105/portfolio" target="_blank" rel="noreferrer">SOURCE CODE ↗</a>
        <a href="#vault">UNLOCK THE VAULT ↗</a>
      </footer>
      <AnimatePresence>
        {intro && (
          <motion.div
            className="intro-overlay"
            initial={{ opacity: 0, scale: 1 }}
            animate={{ opacity: 1, scale: 1.08 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="eyebrow">THE GATES ARE OPENING</span>
            <h2>
              WELCOME TO
              <br />
              THE KINGDOM.
            </h2>
            <button
              className="button"
              onClick={() => {
                setIntro(false);
                location.hash = "about";
              }}
            >
              Skip intro <ArrowRight size={16} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
