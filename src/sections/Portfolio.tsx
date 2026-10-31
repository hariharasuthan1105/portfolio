import { useRef, useState } from "react";
import {
  ArrowUpRight,
  ArrowRight,
  Copy,
  Check,
  GraduationCap,
  Mail,
  Github,
  Linkedin,
  Trophy,
  X,
  Key,
  ExternalLink,
  Code2,
  AlertTriangle,
  Lightbulb,
  Cpu,
} from "lucide-react";
import {
  profile,
  skills,
  descriptions,
  projects,
  experience,
  awards,
} from "../data/profile";
import { Scene } from "../components/ui/Scene";
import {
  DocReconHologram,
  PathwayAIHologram,
  HefinHologram,
} from "../components/ui/ProjectHolograms";

function Heading({ n, title, sub }: { n: string; title: string; sub: string }) {
  return (
    <div className="section-heading">
      <span className="eyebrow">
        [ {n} / {sub} ]
      </span>
      <h2>{title}</h2>
    </div>
  );
}

function Exhibit({ index }: { index: number }) {
  return (
    <div className={"exhibit exhibit-" + index} aria-hidden="true">
      <div className="exhibit-hologram-stage">
        {index === 0 && <DocReconHologram />}
        {index === 1 && <PathwayAIHologram />}
        {index === 2 && <HefinHologram />}
      </div>
    </div>
  );
}

export default function Portfolio({
  reduced,
  low,
}: {
  reduced: boolean;
  low: boolean;
}) {
  const [category, setCategory] = useState("All skills");
  const [selected, setSelected] = useState("Python");
  const [detail, setDetail] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);

  const visible =
    category === "All skills" ? Object.values(skills).flat() : skills[category];

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      setCopyError(false);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      setCopyError(true);
    }
  };

  const openProjectModal = (i: number) => {
    setDetail(i);
    dialog.current?.showModal();
  };

  return (
    <>
      {/* 02 / ABOUT ME */}
      <section id="about" className="section about chamber">
        <div className="section-inner">
          <Heading n="02" title="THE ORIGIN." sub="ABOUT ME" />
          <div className="about-layout">
            <div className="about-copy">
              <p className="lead">
                Curiosity is where
                <br />
                everything begins.
              </p>
              <p>
                I’m Hariharasuthan, an AI &amp; Data Science undergraduate exploring
                how complex information transforms into dependable, intelligent decisions.
              </p>
              <p>
                My focus lies at the confluence of artificial intelligence,
                quantitative finance, probability, optimization, and real-time decision architectures.
              </p>
              <div className="education glass">
                <GraduationCap size={25} />
                <div>
                  <span className="mono">{profile.education.years}</span>
                  <h3>{profile.education.degree}</h3>
                  <p>{profile.education.college}</p>
                  <strong>CGPA {profile.education.cgpa}</strong>
                </div>
              </div>
              <a
                className="text-link mono"
                href="/assets/hariharasuthan-resume.pdf"
                download
              >
                DOWNLOAD RESUME <ArrowRight size={16} />
              </a>
            </div>
            <div className="principles">
              <div>
                <span>01</span>
                <h3>CURIOSITY</h3>
                <p>Drives continuous inquiry and first-principles exploration.</p>
              </div>
              <div>
                <span>02</span>
                <h3>INTELLIGENCE</h3>
                <p>Architects verified, grounded algorithmic solutions.</p>
              </div>
              <div>
                <span>03</span>
                <h3>IMPACT</h3>
                <p>Empowers real-world human decisions in critical systems.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 03 / SKILLS */}
      <section id="skills" className="section skills-section">
        <div className="section-inner">
          <Heading n="03" title="THE FORGE." sub="SKILLS" />
          <div className="skills-layout">
            <div className="skill-sidebar">
              <p>
                The engineering tools behind
                <br />
                the intelligence.
              </p>
              <div className="filters" aria-label="Filter skills">
                {["All skills", ...Object.keys(skills)].map((c) => (
                  <button
                    key={c}
                    aria-pressed={c === category}
                    onClick={() => setCategory(c)}
                  >
                    {c}
                    <ArrowUpRight size={14} />
                  </button>
                ))}
              </div>
            </div>
            <div className="skill-orbit">
              <Scene sphere reduced={reduced} low={low} />
              <div className="orbit-label mono">
                INTELLIGENCE CORE<small>SELECT A TOOL</small>
              </div>
              <div className="orbital-skills">
                {visible.slice(0, 8).map((s, i) => (
                  <button
                    key={s}
                    style={{
                      left: `${50 + 43 * Math.cos((i / Math.min(visible.length, 8)) * Math.PI * 2)}%`,
                      top: `${49 + 40 * Math.sin((i / Math.min(visible.length, 8)) * Math.PI * 2)}%`,
                    }}
                    className={selected === s ? "selected" : ""}
                    onClick={() => setSelected(s)}
                  >
                    <span>◇</span>
                    {s}
                  </button>
                ))}
              </div>
            </div>
            <aside className="skill-detail glass" aria-live="polite">
              <span className="eyebrow mono">TOOL INSIGHT</span>
              <h3>{selected}</h3>
              <p>{descriptions[selected]}</p>
              <span className="mono">EXPLORE · BUILD · DEPLOY</span>
            </aside>
          </div>
          <details className="skill-list" open>
            <summary className="mono">Accessible skill index · {visible.length} verified technologies</summary>
            <div>
              {visible.map((s) => (
                <button
                  key={s}
                  aria-pressed={selected === s}
                  onClick={() => setSelected(s)}
                >
                  {s}
                </button>
              ))}
            </div>
          </details>
        </div>
      </section>

      {/* 04 / SELECTED PROJECTS */}
      <section id="projects" className="section projects-section">
        <div className="section-inner">
          <Heading n="04" title="THE ARCHIVE." sub="SELECTED PROJECTS" />
          <p className="section-intro">
            Three authentic engineering systems. Three ways to turn complex data into intelligent action.
          </p>
          <div className="projects-grid">
            {projects.map((p, i) => (
              <article className="project-card" key={p.shortName}>
                <div className="project-number mono">
                  0{i + 1} <span>{p.type}</span>
                </div>
                <Exhibit index={i} />
                <div className="project-body">
                  <h3>{p.shortName}</h3>
                  <p className="project-headline">{p.headline}</p>
                  <div className="tags">
                    {p.tags.map((t) => (
                      <span key={t} className="mono">{t}</span>
                    ))}
                  </div>
                  <button
                    className="project-open mono"
                    onClick={() => openProjectModal(i)}
                    aria-label={`Explore technical details for ${p.shortName}`}
                  >
                    <span>EXPLORE ARCHITECTURE</span>
                    <ArrowUpRight size={17} />
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* 05 / EXPERIENCE */}
      <section id="experience" className="section experience-section chamber">
        <div className="section-inner journey-layout">
          <div>
            <Heading n="05" title="THE JOURNEY." sub="EXPERIENCE" />
            <p className="lead">
              From concepts
              <br />
              to deployed systems.
            </p>
            <span className="eyebrow mono">LEARN. ARCHITECT. REFINE.</span>
          </div>
          <ol className="timeline">
            {experience.map((e) => (
              <li key={e.company}>
                <span className="timeline-dot" />
                <span className="eyebrow mono">{e.date}</span>
                <h3>{e.role}</h3>
                <h4>{e.company}</h4>
                <p>{e.detail}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* 06 / ACHIEVEMENTS */}
      <section id="achievements" className="section awards-section">
        <div className="section-inner">
          <Heading n="06" title="THE HALL OF HONOR." sub="ACHIEVEMENTS" />
          <div className="awards-grid">
            {awards.map((a, i) => (
              <article className="award" key={a}>
                <span className="mono">0{i + 1} / COMPETITION</span>
                <div className="award-symbol" aria-hidden="true">
                  <Trophy strokeWidth={0.7} />
                </div>
                <p className="eyebrow mono">{a.split("|")[1]}</p>
                <h3>{a.split("|")[0]}</h3>
              </article>
            ))}
          </div>
          <details className="certifications">
            <summary className="mono">
              VERIFIED CREDENTIALS <span>05 CERTIFICATIONS +</span>
            </summary>
            <ul>
              {[
                "Programming in Java — NPTEL",
                "Cloud Computing — NPTEL",
                "Cloud Computing Fundamentals — IBM SkillsBuild",
                "Data Analytics Job Simulation — Deloitte",
                "6-Week Data Science and Machine Learning Program — IIT Guwahati",
              ].map((c) => (
                <li key={c}>
                  <Check size={16} />
                  <span>{c}</span>
                </li>
              ))}
            </ul>
          </details>
        </div>
      </section>

      {/* 07 / CONTACT */}
      <section id="contact" className="section contact-section chamber">
        <div className="section-inner contact-layout">
          <div>
            <Heading
              n="07"
              title="LET’S BUILD SOMETHING MEANINGFUL."
              sub="THE PORTAL"
            />
            <p className="lead">
              A single conversation can
              <br />
              spark groundbreaking innovation.
            </p>
            <p>
              Always open to opportunities, research collaborations, and engineering discussions
              in AI, quantitative methods, and distributed intelligence.
            </p>
            <span className="availability mono">
              <i />
              COIMBATORE, INDIA · OPEN TO OPPORTUNITIES
            </span>
          </div>
          <div className="contact-links">
            <a href={"mailto:" + profile.email} aria-label={`Send email to ${profile.email}`}>
              <Mail />
              <div>
                <span className="mono">DIRECT EMAIL</span>
                <strong>{profile.email}</strong>
              </div>
              <ArrowUpRight />
            </a>
            <button onClick={copy} aria-label="Copy email address to clipboard">
              {copied ? <Check size={16} /> : <Copy size={16} />}
              <span className="mono" aria-live="polite">
                {copied
                  ? "EMAIL COPIED TO CLIPBOARD"
                  : copyError
                    ? "SELECT EMAIL TO COPY"
                    : "COPY EMAIL ADDRESS"}
              </span>
            </button>
            <a href={profile.linkedin} target="_blank" rel="noreferrer" aria-label="Connect on LinkedIn">
              <Linkedin />
              <div>
                <span className="mono">LINKEDIN</span>
                <strong>Connect with Hariharasuthan</strong>
              </div>
              <ArrowUpRight />
            </a>
            <a href={profile.github} target="_blank" rel="noreferrer" aria-label="View GitHub repositories">
              <Github />
              <div>
                <span className="mono">GITHUB</span>
                <strong>Explore Source Code &amp; Repos</strong>
              </div>
              <ArrowUpRight />
            </a>
          </div>
        </div>
      </section>

      {/* DETAILED PROJECT MODAL DIALOG */}
      <dialog
        ref={dialog}
        className="project-dialog"
        onClick={(e) => {
          if (e.target === dialog.current) dialog.current.close();
        }}
      >
        <button
          className="dialog-close icon-button"
          aria-label="Close project details"
          onClick={() => dialog.current?.close()}
        >
          <X size={20} />
        </button>

        {detail !== null && projects[detail] && (
          <div className="project-dialog-body">
            <div className="dialog-header">
              <span className="eyebrow mono">
                SYSTEM 0{detail + 1} / TECHNICAL SPECIFICATION
              </span>
              <h2>{projects[detail].name}</h2>
              <p className="dialog-headline">{projects[detail].headline}</p>
            </div>

            {/* Hologram Stage */}
            <div className="dialog-hologram-stage" aria-hidden="true">
              {detail === 0 && <DocReconHologram />}
              {detail === 1 && <PathwayAIHologram />}
              {detail === 2 && <HefinHologram />}
            </div>

            {/* Technical Breakdown Grid */}
            <div className="dialog-specs-grid">
              <div className="spec-card">
                <span className="spec-label mono">
                  <AlertTriangle size={12} /> PROBLEM BEING SOLVED
                </span>
                <p>{projects[detail].problem}</p>
              </div>

              <div className="spec-card">
                <span className="spec-label mono">
                  <Code2 size={12} /> ENGINEERING APPROACH
                </span>
                <p>{projects[detail].approach}</p>
              </div>

              <div className="spec-card">
                <span className="spec-label mono">
                  <Cpu size={12} /> TECHNOLOGIES USED
                </span>
                <div className="tech-tags">
                  {projects[detail].technologies.map((t) => (
                    <span key={t} className="tech-tag mono">{t}</span>
                  ))}
                </div>
              </div>

              <div className="spec-card">
                <span className="spec-label mono">
                  <Lightbulb size={12} /> KEY FEATURES
                </span>
                <ul className="spec-features-list">
                  {projects[detail].features.map((f) => (
                    <li key={f}>
                      <Check size={13} className="bullet-check" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="spec-card full-width">
                <span className="spec-label mono">
                  <AlertTriangle size={12} /> TECHNICAL CHALLENGE
                </span>
                <p>{projects[detail].challenge}</p>
              </div>

              <div className="spec-card full-width">
                <span className="spec-label mono">
                  <Lightbulb size={12} /> LESSONS LEARNED
                </span>
                <p>{projects[detail].lessonsLearned}</p>
              </div>
            </div>

            {/* Actions: GitHub & Vault Simulator */}
            <div className="dialog-actions-strip">
              <a
                href={projects[detail].github}
                target="_blank"
                rel="noreferrer"
                className="button-subtle mono"
              >
                <Github size={15} />
                <span>VERIFIED SOURCE REPOSITORY</span>
                <ArrowUpRight size={14} />
              </a>

              <a
                href="#vault"
                className="button-accent mono"
                onClick={() => dialog.current?.close()}
              >
                <Key size={15} />
                <span>TRY INSPIRED VAULT CHALLENGE</span>
                <ArrowRight size={14} />
              </a>
            </div>
          </div>
        )}
      </dialog>
    </>
  );
}
