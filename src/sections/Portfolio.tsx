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
  Layers,
  Sparkles as SparklesIcon,
  Calendar,
  ChevronLeft,
  ChevronRight,
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
import ForgeOfIntelligenceScene, {
  FORGE_NODES,
} from "../components/3d/ForgeOfIntelligenceScene";
import ArchiveGalleryScene from "../components/3d/ArchiveGalleryScene";
import JourneyTimelineScene, {
  MILESTONES,
} from "../components/3d/JourneyTimelineScene";
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
  const [selectedNodeId, setSelectedNodeId] = useState("python");
  const [selectedProjectIndex, setSelectedProjectIndex] = useState<number | null>(null);
  const [activeMilestoneIndex, setActiveMilestoneIndex] = useState(1);
  const [detail, setDetail] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);

  const currentNode =
    FORGE_NODES.find((n) => n.id === selectedNodeId) || FORGE_NODES[0];

  const currentMilestone = MILESTONES[activeMilestoneIndex] || MILESTONES[0];

  const visible =
    category === "All skills" ? Object.values(skills).flat() : skills[category] || [];

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
    setSelectedProjectIndex(i);
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

      {/* 03 / SKILLS: THE FORGE OF INTELLIGENCE */}
      <section id="skills" className="section forge-section">
        {/* Environment Background Layer */}
        <div className="forge-background-layer" aria-hidden="true" />

        <div className="forge-container">
          {/* Top Gothic Details & Hanging Banner */}
          <div className="forge-top-bar" aria-hidden="true">
            <div className="forge-banner-emblem">
              <span className="banner-icon">♆</span>
              <span className="banner-text mono">KNOWLEDGE FUELS A BRIGHTER TOMORROW.</span>
            </div>
          </div>

          <div className="forge-main-grid">
            {/* Left HUD: Title & Filter Nav */}
            <div className="forge-left-hud">
              <div className="forge-title-block">
                <span className="eyebrow mono">[ 03 ]</span>
                <h2 className="forge-heading">SKILLS</h2>
                <h3 className="forge-subheading mono">THE FORGE OF INTELLIGENCE</h3>
              </div>

              <div className="forge-category-nav" role="tablist" aria-label="Skill Categories">
                {["All skills", ...Object.keys(skills)].map((c) => {
                  const isActive = category.toLowerCase() === c.toLowerCase();
                  return (
                    <button
                      key={c}
                      role="tab"
                      aria-selected={isActive}
                      className={`forge-cat-btn ${isActive ? "active" : ""}`}
                      onClick={() => {
                        setCategory(c);
                        const match = FORGE_NODES.find(
                          (n) => c === "All skills" || n.category.toLowerCase() === c.toLowerCase()
                        );
                        if (match) {
                          setSelectedNodeId(match.id);
                          setSelected(match.skills[0] || selected);
                        }
                      }}
                    >
                      <span className="cat-name mono">{c.toUpperCase()}</span>
                      <ArrowRight size={13} className="cat-arrow" />
                    </button>
                  );
                })}
              </div>

              <div className="forge-tagline mono">
                TECHNOLOGIES THAT POWER MY KINGDOM.
              </div>
            </div>

            {/* Center 3D Stage: Intelligence Core & Orbital Nodes */}
            <div className="forge-stage">
              <ForgeOfIntelligenceScene
                activeCategory={category}
                selectedNodeId={selectedNodeId}
                onSelectNode={(node) => {
                  setSelectedNodeId(node.id);
                  setSelected(node.skills[0] || node.name);
                }}
                reduced={reduced}
              />
            </div>

            {/* Right HUD: Selected Tech Inspector & Realities Card */}
            <div className="forge-right-hud">
              {/* Detailed Tool Inspector Glass Card */}
              <aside className="forge-inspector glass" aria-live="polite">
                <div className="inspector-header">
                  <span className="eyebrow mono">FORGE TELEMETRY // 03</span>
                  <h4 className="inspector-title">{currentNode?.name || selected}</h4>
                  <span className="inspector-category mono">{currentNode?.category || category}</span>
                </div>

                <p className="inspector-desc">{descriptions[selected] || currentNode?.description}</p>

                <div className="inspector-subskills">
                  <span className="subskills-label mono">VERIFIED CAPABILITIES:</span>
                  <div className="subskills-pills">
                    {(currentNode?.skills || visible).map((s) => (
                      <button
                        key={s}
                        className={`subskill-pill mono ${selected === s ? "active" : ""}`}
                        onClick={() => setSelected(s)}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="inspector-footer mono">
                  <span>EXPLORE · BUILD · DEPLOY</span>
                </div>
              </aside>

              {/* Bottom Right Floating Card */}
              <div className="forge-quote-card glass" aria-hidden="true">
                <div className="quote-globe-icon">
                  <span className="globe-symbol">◈</span>
                </div>
                <div className="quote-text mono">
                  SKILLS COMBINE<br />
                  TO BUILD<br />
                  BIGGER REALITIES.
                </div>
              </div>
            </div>
          </div>

          {/* Accessible Index for keyboard and screen readers */}
          <details className="skill-list" open>
            <summary className="mono">Accessible skill index · {visible.length} verified technologies</summary>
            <div>
              {visible.map((s) => (
                <button
                  key={s}
                  aria-pressed={selected === s}
                  onClick={() => {
                    setSelected(s);
                    // Match corresponding node if exists
                    const matchingNode = FORGE_NODES.find((n) =>
                      n.skills.includes(s)
                    );
                    if (matchingNode) setSelectedNodeId(matchingNode.id);
                  }}
                >
                  {s}
                </button>
              ))}
            </div>
          </details>
        </div>
      </section>

      {/* 04 / PROJECTS: THE ARCHIVE OF CREATIONS */}
      <section id="projects" className="section archive-section">
        {/* Environment Background Layer */}
        <div className="archive-background-layer" aria-hidden="true" />

        <div className="archive-container">
          <div className="archive-main-grid">
            {/* Left HUD: Title & Actions */}
            <div className="archive-left-hud">
              <div className="archive-title-block">
                <span className="eyebrow mono">[ THE ARCHIVE ]</span>
                <h2 className="archive-heading">THE ARCHIVE<br />OF CREATIONS</h2>
                <p className="archive-subhead mono">REAL PROJECTS. INTELLIGENT WORLDS.</p>
                <p className="archive-desc">
                  A collection of AI-powered systems, built for a smarter, more connected future.
                </p>
              </div>

              <div className="archive-actions">
                <button
                  className="archive-cta-btn mono"
                  onClick={() => openProjectModal(0)}
                >
                  <span>EXPLORE PROJECTS</span>
                  <ArrowRight size={14} />
                </button>
                <button
                  className="archive-secondary-btn mono"
                  onClick={() => openProjectModal(1)}
                >
                  <span>▶ VIEW ARCHITECTURE SPECS</span>
                </button>
              </div>
            </div>

            {/* Mobile Exhibit Selector (Visible only on mobile/tablet) */}
            <div className="archive-mobile-selector mono" aria-label="Select mobile exhibit">
              {projects.map((p, i) => (
                <button
                  key={p.shortName}
                  type="button"
                  className={`archive-mobile-tab ${(selectedProjectIndex ?? 0) === i ? "active" : ""}`}
                  onClick={() => setSelectedProjectIndex(i)}
                  aria-label={`View ${p.shortName} exhibit`}
                >
                  0{i + 1} // {p.shortName}
                </button>
              ))}
            </div>

            {/* Center 3D Stage: 3 Distinct Spatial Exhibits */}
            <div className="archive-stage">
              <ArchiveGalleryScene
                selectedProjectIndex={selectedProjectIndex}
                onSelectProject={(i) => {
                  setSelectedProjectIndex(i);
                  openProjectModal(i);
                }}
                reduced={reduced}
              />
            </div>

            {/* Right HUD: Vertical Philosophy Track */}
            <div className="archive-right-hud" aria-hidden="true">
              <div className="vertical-philosophy-track mono">
                <span>IDEAS</span>
                <span className="dot" />
                <span>SYSTEMS</span>
                <span className="dot" />
                <span>INTELLIGENCE</span>
                <span className="dot" />
                <span>IMPACT</span>
                <span className="dot" />
                <span>AND BEYOND</span>
              </div>
            </div>
          </div>

          {/* Accessible Project Cards (Preserved for screen readers and keyboard navigation) */}
          <div className="projects-grid sr-only-focusable">
            {projects.map((p, i) => (
              <article className="project-card" key={p.shortName}>
                <div className="project-number mono">
                  0{i + 1} <span>{p.type}</span>
                </div>
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

      {/* 05 / EXPERIENCE: THE JOURNEY ARCHIVE */}
      <section id="experience" className="section journey-section">
        {/* Environment Background Layer */}
        <div className="journey-background-layer" aria-hidden="true" />

        <div className="journey-container">
          <div className="journey-main-grid">
            {/* Left HUD: Title & Chronicle Intro */}
            <div className="journey-left-hud">
              <div className="journey-title-block">
                <span className="eyebrow mono">[ A CHRONICLE OF GROWTH ]</span>
                <h2 className="journey-heading">THE JOURNEY<br />ARCHIVE</h2>
                <h3 className="journey-subhead mono">HARIHARASUTHAN V</h3>
                <span className="journey-role mono">AI &amp; DATA SCIENCE DEVELOPER</span>
                <p className="journey-desc">
                  A timeline of roles, internships, projects, and experiences that shaped my path.
                  Each milestone represents a step towards building a more intelligent tomorrow.
                </p>
              </div>

              <div className="journey-actions">
                <button
                  className="journey-cta-btn mono"
                  onClick={() => {
                    const next = (activeMilestoneIndex + 1) % MILESTONES.length;
                    setActiveMilestoneIndex(next);
                  }}
                  aria-label="Advance to next milestone"
                >
                  <span>NEXT MILESTONE</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>

            {/* Center 3D Stage: Floating Winding Pathway & Milestone Monuments */}
            <div className="journey-stage">
              <JourneyTimelineScene
                activeMilestoneIndex={activeMilestoneIndex}
                onSelectMilestone={(i) => setActiveMilestoneIndex(i)}
                reduced={reduced}
              />
            </div>

            {/* Right HUD: Active Milestone Inspector Card & Track */}
            <div className="journey-right-hud">
              <aside className="journey-inspector glass" aria-live="polite">
                {/* Meta Counter & Status */}
                <div className="inspector-meta-row">
                  <span className="eyebrow mono">
                    {currentMilestone.isFuture ? "FUTURE HORIZON" : `MILESTONE 0${activeMilestoneIndex + 1} OF 04`}
                  </span>
                  <span className="inspector-counter mono">
                    0{activeMilestoneIndex + 1} / 04
                  </span>
                </div>

                <div className="inspector-header">
                  <div className="inspector-year-row">
                    <span className="inspector-year mono">{currentMilestone.year}</span>
                    <span className="inspector-sub mono">{currentMilestone.subtitle}</span>
                  </div>
                  <h4 className="inspector-title">{currentMilestone.title}</h4>
                  <span className="inspector-org mono">{currentMilestone.organization}</span>
                  <span className="inspector-date mono">
                    <Calendar size={11} /> {currentMilestone.dateRange}
                  </span>
                </div>

                {currentMilestone.isFuture && (
                  <div className="future-goal-badge mono">
                    [ FUTURE GOAL · ACTIVE RESEARCH &amp; ARCHITECTURE ]
                  </div>
                )}

                <p className="inspector-desc">{currentMilestone.description}</p>

                <div className="inspector-tags mono">
                  {currentMilestone.tags.map((t) => (
                    <span key={t}>{t}</span>
                  ))}
                </div>

                {/* Milestone Navigation Controls */}
                <div className="inspector-nav-controls">
                  <button
                    type="button"
                    className="inspector-nav-btn mono"
                    onClick={() => {
                      const prev = (activeMilestoneIndex - 1 + MILESTONES.length) % MILESTONES.length;
                      setActiveMilestoneIndex(prev);
                    }}
                    aria-label="Previous milestone"
                  >
                    <ChevronLeft size={13} />
                    <span>PREV</span>
                  </button>

                  <div className="milestone-steps" role="tablist" aria-label="Milestone steps">
                    {MILESTONES.map((m, idx) => (
                      <button
                        key={m.id}
                        type="button"
                        className={`milestone-step-btn mono ${activeMilestoneIndex === idx ? "active" : ""}`}
                        onClick={() => setActiveMilestoneIndex(idx)}
                        aria-label={`Jump to ${m.year} milestone`}
                        role="tab"
                        aria-selected={activeMilestoneIndex === idx}
                      >
                        {m.year === "FUTURE" ? "F" : `0${idx + 1}`}
                      </button>
                    ))}
                  </div>

                  <button
                    type="button"
                    className="inspector-nav-btn mono"
                    onClick={() => {
                      const next = (activeMilestoneIndex + 1) % MILESTONES.length;
                      setActiveMilestoneIndex(next);
                    }}
                    aria-label="Next milestone"
                  >
                    <span>NEXT</span>
                    <ChevronRight size={13} />
                  </button>
                </div>
              </aside>

              <div className="vertical-journey-track mono" aria-hidden="true">
                {["LEARN", "BUILD", "SOLVE", "COLLABORATE", "INNOVATE", "GROW", "IMPACT"].map((w) => (
                  <span key={w}>{w}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom Chronicle Banner */}
          <div className="journey-bottom-banner mono" aria-hidden="true">
            <span>"MORE EXPERIENCES LEAD TO A BRIGHTER TOMORROW."</span>
          </div>

          {/* Accessible Semantic Timeline for Screen Readers & Tests */}
          <ol className="timeline sr-only-focusable">
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
