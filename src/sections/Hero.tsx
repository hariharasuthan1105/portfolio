import {
  ArrowRight,
  ChevronDown,
  MoveUpRight,
  LockKeyhole,
} from "lucide-react";
import { Scene } from "../components/ui/Scene";
export default function Hero({
  enter,
  reduced,
  low,
}: {
  enter: () => void;
  reduced: boolean;
  low: boolean;
}) {
  return (
    <section id="home" className="hero">
      <div className="hero-art" />
      <div className="hero-shade" />
      <Scene reduced={reduced} low={low} />
      <div className="fog fog-one" />
      <div className="fog fog-two" />
      <div className="hero-copy">
        <span className="eyebrow">[ WELCOME_TO_MY_REALM ]</span>
        <h1>
          CODE
          <br />
          KINGDOM<span className="cursor">_</span>
        </h1>
        <div className="identity">
          HARIHARASUTHAN V<span>AI & DATA SCIENCE DEVELOPER</span>
        </div>
        <p>
          Turning complex information
          <br />
          into intelligent systems.
        </p>
        <button className="button primary" onClick={enter}>
          ENTER THE KINGDOM <ArrowRight size={16} />
        </button>
        <a className="text-link" href="#projects">
          EXPLORE PROJECTS <MoveUpRight size={15} />
        </a>
      </div>
      <div className="castle-links">
        <a href="#skills" className="castle-link forge">
          SKILLS<small>THE FORGE</small>
        </a>
        <a href="#projects" className="castle-link archive">
          PROJECTS<small>THE ARCHIVE</small>
        </a>
        <a href="#about" className="castle-link origin">
          ABOUT<small>THE ORIGIN</small>
        </a>
        <a href="#experience" className="castle-link journey">
          EXPERIENCE<small>THE JOURNEY</small>
        </a>
      </div>
      <button
        className="entrance"
        onClick={enter}
        aria-label="Enter the castle"
      >
        <span />
        <small>ENTER</small>
      </button>
      <a className="vault-hint" href="#vault">
        <LockKeyhole size={17} />
        <div>
          THE SECRET VAULT<small>THREE KEYS. ONE INTELLIGENCE.</small>
        </div>
        <ArrowRight size={15} />
      </a>
      <div className="hero-coordinate mono">
        EST. 2023 <span>·</span> BUILT WITH CURIOSITY
      </div>
      <a href="#about" className="scroll-cue mono">
        SCROLL TO EXPLORE <ChevronDown size={15} />
      </a>
      <div className="hero-values mono">
        DISCIPLINE
        <i />
        CREATIVITY
        <i />
        ANALYSIS
        <i />
        INNOVATION
        <i />
        IMPACT
      </div>
    </section>
  );
}
