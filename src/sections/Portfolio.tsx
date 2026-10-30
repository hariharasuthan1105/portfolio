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
function Exhibit({ index }: { index: number }) { return <div className={"exhibit exhibit-" + index} aria-hidden="true" />; }
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
  return (
    <>
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
                I’m Hariharasuthan, an AI & Data Science undergraduate exploring
                how complex information becomes a clear, intelligent decision.
              </p>
              <p>
                My interests lie at the intersection of artificial intelligence,
                quantitative finance, probability, optimization, and intelligent
                decision systems.
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
                className="text-link"
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
                <p>Drives exploration.</p>
              </div>
              <div>
                <span>02</span>
                <h3>INTELLIGENCE</h3>
                <p>Builds solutions.</p>
              </div>
              <div>
                <span>03</span>
                <h3>IMPACT</h3>
                <p>Creates purpose.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section id="skills" className="section skills-section">
        <div className="section-inner">
          <Heading n="03" title="THE FORGE." sub="SKILLS" />
          <div className="skills-layout">
            <div className="skill-sidebar">
              <p>
                The tools behind
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
              <span className="eyebrow">TOOL INSIGHT</span>
              <h3>{selected}</h3>
              <p>{descriptions[selected]}</p>
              <span className="mono">EXPLORE · BUILD · ITERATE</span>
            </aside>
          </div>
          <details className="skill-list" open>
            <summary>Accessible skill list · {visible.length} tools</summary>
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
      <section id="projects" className="section projects-section">
        <div className="section-inner">
          <Heading n="04" title="THE ARCHIVE." sub="SELECTED PROJECTS" />
          <p className="section-intro">
            Three systems. Three ways to make information useful.
          </p>
          <div className="projects-grid">
            {projects.map((p, i) => (
              <article className="project-card" key={p.name}>
                <div className="project-number mono">
                  0{i + 1} <span>{p.type}</span>
                </div>
                <Exhibit index={i} />
                <div className="project-body">
                  <h3>{p.name}</h3>
                  <p>{p.description}</p>
                  <div className="tags">
                    {p.tags.map((t) => (
                      <span key={t}>{t}</span>
                    ))}
                  </div>
                  <button
                    className="project-open"
                    onClick={() => {
                      setDetail(i);
                      dialog.current?.showModal();
                    }}
                  >
                    EXPLORE SYSTEM <ArrowUpRight size={19} />
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section id="experience" className="section experience-section chamber">
        <div className="section-inner journey-layout">
          <div>
            <Heading n="05" title="THE JOURNEY." sub="EXPERIENCE" />
            <p className="lead">
              From ideas
              <br />
              to real-world systems.
            </p>
            <span className="eyebrow">LEARN. BUILD. REFINE.</span>
          </div>
          <ol className="timeline">
            {experience.map((e) => (
              <li key={e.company}>
                <span className="timeline-dot" />
                <span className="eyebrow">{e.date}</span>
                <h3>{e.role}</h3>
                <h4>{e.company}</h4>
                <p>{e.detail}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>
      <section id="achievements" className="section awards-section">
        <div className="section-inner">
          <Heading n="06" title="THE HALL OF HONOR." sub="ACHIEVEMENTS" />
          <div className="awards-grid">
            {awards.map((a, i) => (
              <article className="award" key={a}>
                <span className="mono">0{i + 1} / RECOGNITION</span>
                <div className="award-symbol">
                  <Trophy strokeWidth={0.7} />
                </div>
                <p className="eyebrow">{a.split("|")[1]}</p>
                <h3>{a.split("|")[0]}</h3>
              </article>
            ))}
          </div>
          <details className="certifications">
            <summary>
              CERTIFICATIONS <span>05 CREDENTIALS +</span>
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
                  {c}
                </li>
              ))}
            </ul>
          </details>
        </div>
      </section>
      <section id="contact" className="section contact-section chamber">
        <div className="section-inner contact-layout">
          <div>
            <Heading
              n="07"
              title="LET’S BUILD SOMETHING MEANINGFUL."
              sub="THE PORTAL"
            />
            <p className="lead">
              A conversation can be
              <br />
              the start of something extraordinary.
            </p>
            <p>
              Open to opportunities, interesting projects, and ideas in AI, data
              science, and technology.
            </p>
            <span className="availability mono">
              <i />
              COIMBATORE, INDIA · OPEN TO OPPORTUNITIES
            </span>
          </div>
          <div className="contact-links">
            <a href={"mailto:" + profile.email}>
              <Mail />
              <div>
                <span className="mono">EMAIL</span>
                <strong>{profile.email}</strong>
              </div>
              <ArrowUpRight />
            </a>
            <button onClick={copy}>
              {copied ? <Check size={16} /> : <Copy size={16} />}
              <span aria-live="polite">
                {copied
                  ? "EMAIL COPIED"
                  : copyError
                    ? "SELECT THE EMAIL ABOVE TO COPY"
                    : "COPY EMAIL"}
              </span>
            </button>
            <a href={profile.linkedin} target="_blank" rel="noreferrer">
              <Linkedin />
              <div>
                <span className="mono">LINKEDIN</span>
                <strong>Let’s connect</strong>
              </div>
              <ArrowUpRight />
            </a>
            <a href={profile.github} target="_blank" rel="noreferrer">
              <Github />
              <div>
                <span className="mono">GITHUB</span>
                <strong>Explore my work</strong>
              </div>
              <ArrowUpRight />
            </a>
          </div>
        </div>
      </section>
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
          <X />
        </button>
        {detail !== null && (
          <>
            <span className="eyebrow">
              SYSTEM 0{detail + 1} / TECHNICAL OVERVIEW
            </span>
            <h2>{projects[detail].name}</h2>
            <p>{projects[detail].description}</p>
            <h3>FEATURES</h3>
            <ul>
              {projects[detail].features.map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ul>
            <h3>TECHNICAL CHALLENGE</h3>
            <p>{projects[detail].challenge}</p>
            <div className="tags">
              {projects[detail].tags.map((t) => (
                <span key={t}>{t}</span>
              ))}
            </div>
            <a
              href="#vault"
              className="button"
              onClick={() => dialog.current?.close()}
            >
              TRY THE INSPIRED DEMO <ArrowRight size={16} />
            </a>
          </>
        )}
      </dialog>
    </>
  );
}
