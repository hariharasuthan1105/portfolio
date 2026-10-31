import { useEffect, useRef, useState } from "react";
import {
  LockKeyhole,
  Unlock,
  ScanLine,
  ArrowRight,
  Check,
  RotateCcw,
  Network,
  Key,
  Sparkles,
  Layers,
  Cpu,
  Database,
  ChevronDown,
} from "lucide-react";
import {
  addEdge,
  isUnlocked,
  networkConnected,
  questions,
  nodeLabels,
  SUPERPOWER_TEXT,
} from "./logic.mjs";
import VaultChamberScene from "../../components/3d/VaultChamberScene";

export default function Vault({ reduced = false }: { reduced?: boolean }) {
  const [keys, setKeys] = useState([false, false, false]);
  const [scan, setScan] = useState(0);
  const [q, setQ] = useState(0);
  const [stage, setStage] = useState(0);
  const [edges, setEdges] = useState<number[][]>([]);
  const [selectedNode, setSelectedNode] = useState<number | null>(null);
  const [networkNote, setNetworkNote] = useState(
    "Select a node, then choose another node to bridge them.",
  );
  const [invalidFlash, setInvalidFlash] = useState(false);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  const unlockKey = (index: number) => {
    setKeys((curr) => {
      if (curr[index]) return curr;
      const next = [...curr];
      next[index] = true;
      return next;
    });
  };

  const unlocked = isUnlocked(keys);

  const points = [
    [50, 18],  // Node 0: Top
    [82, 50],  // Node 1: Right
    [50, 82],  // Node 2: Bottom
    [18, 50],  // Node 3: Left
  ];

  useEffect(() => {
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, []);

  // Challenge 2: RAG Pipeline Trigger
  const runRagPipeline = () => {
    if (timer.current) clearInterval(timer.current);
    setStage(1);
    let currentStep = 1;
    timer.current = setInterval(() => {
      currentStep++;
      setStage(currentStep);
      if (currentStep >= 4) {
        if (timer.current) clearInterval(timer.current);
        timer.current = null;
        unlockKey(1);
      }
    }, 550);
  };

  // Challenge 3: Network Connection
  const handleNodeClick = (nodeIndex: number) => {
    if (selectedNode === null) {
      setSelectedNode(nodeIndex);
      setNetworkNote(`${nodeLabels[nodeIndex].title} [${nodeLabels[nodeIndex].role}] selected. Choose another node.`);
      return;
    }

    if (selectedNode === nodeIndex) {
      setNetworkNote("Cannot link a node to itself! Choose a different node.");
      setInvalidFlash(true);
      setTimeout(() => setInvalidFlash(false), 800);
      setSelectedNode(null);
      return;
    }

    const nextEdges = addEdge(edges, selectedNode, nodeIndex);
    if (nextEdges === edges) {
      setNetworkNote("Edge already exists! Connect an unlinked pair of nodes.");
      setInvalidFlash(true);
      setTimeout(() => setInvalidFlash(false), 800);
      setSelectedNode(null);
      return;
    }

    setEdges(nextEdges);
    setSelectedNode(null);

    if (networkConnected(nextEdges)) {
      unlockKey(2);
      setNetworkNote("✓ Consensus achieved! All 4 decentralized nodes are fully synchronized.");
    } else {
      setNetworkNote(`${nextEdges.length} connections established. Continue linking all 4 nodes.`);
    }
  };

  // Replay & Reset all states
  const handleReplay = () => {
    if (timer.current) clearInterval(timer.current);
    timer.current = null;
    setKeys([false, false, false]);
    setScan(0);
    setStage(0);
    setEdges([]);
    setSelectedNode(null);
    setNetworkNote("Select a node, then choose another node to bridge them.");
  };

  const activeQuestion = questions[q] || questions[0];
  const detectedCount = (scan >= 25 ? 1 : 0) + (scan >= 50 ? 1 : 0) + (scan >= 85 ? 1 : 0);

  return (
    <section id="vault" className="section vault-section vault-cinematic-section" aria-label="Intelligence Vault Section">
      {/* ======================================================================
          REGION A — CINEMATIC VAULT CHAMBER
          Full architectural view with central floating intelligence sphere & guardians
          ====================================================================== */}
      <div className="vault-cinematic-chamber">
        {/* Real-Time Three.js Astral Core & Atmospheric Particles */}
        <div className="vault-chamber-scene-container" aria-hidden="false">
          <VaultChamberScene keys={keys} unlocked={unlocked} reduced={reduced} />
        </div>

        {/* Cinematic Chamber Foreground HUD & Gateway */}
        <div className="vault-chamber-overlay-inner">
          <div className="vault-chamber-header">
            <span className="eyebrow mono">[ 08 / THE SIGNATURE EXPERIMENT ]</span>
            <div className="vault-title-row">
              <LockKeyhole size={28} className={unlocked ? "unlocked-icon" : "locked-icon"} />
              <h2 className="vault-main-title">THE INTELLIGENCE VAULT</h2>
            </div>
            <p className="vault-subheading mono">
              THREE KEYS. ONE INTELLIGENCE. UNLOCK MY SUPERPOWER.
            </p>

            {/* Unobtrusive Progress Indicator */}
            <div
              className="key-progress"
              aria-label={`${keys.filter(Boolean).length} of 3 keys collected`}
            >
              {keys.map((k, i) => (
                <span key={i} className={`key-chip ${k ? "complete" : ""}`}>
                  {k ? <Key size={13} className="key-spin" /> : <LockKeyhole size={11} />}
                  <strong className="mono">KEY 0{i + 1}</strong>
                  <small className="mono">
                    {i === 0 ? "PERCEPTION" : i === 1 ? "REASONING" : "CONNECTION"}
                  </small>
                </span>
              ))}
            </div>

            {/* Interactive Gateway Cue */}
            <div className="vault-gateway-cue">
              <a href="#vault-trials" className="vault-trial-cue-btn mono">
                <span>[ BEGIN THE INTELLIGENCE TRIAL ]</span>
                <ChevronDown size={14} className="cue-bounce-icon" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* ======================================================================
          REGION B — THREE INTERACTIVE CHALLENGES
          Dedicated interface region placed below the primary cinematic chamber
          ====================================================================== */}
      <div id="vault-trials" className="vault-challenges-wrapper">
        <div className="section-inner">
          <div className="vault-trials-header">
            <span className="mono trials-eyebrow">[ THREE TRIAL CHAMBERS ]</span>
            <p className="trials-instructions">
              Complete each engineering challenge to forge the three intelligence keys and align the astral core.
            </p>
          </div>

          {/* 3 Challenge Pillars */}
          <div className="vault-grid">
            {/* CHALLENGE 1: PERCEPTION (DocRecon) */}
            <article className={`challenge ${keys[0] ? "solved" : ""}`} aria-labelledby="c1-title">
              <header>
                <span className="challenge-index mono">01</span>
                <div>
                  <h3 id="c1-title">PERCEPTION</h3>
                  <p className="challenge-inspiration">Inspired by DocRecon</p>
                </div>
                <div className="challenge-status">
                  {keys[0] ? (
                    <span className="key-unlocked-badge mono" title="Key 01 Unlocked">
                      <Key size={14} /> KEY 01
                    </span>
                  ) : (
                    <ScanLine size={18} className="idle-icon" />
                  )}
                </div>
              </header>

              <p className="challenge-description">
                Extract structured signal from unstructured document layers.
              </p>

              {/* Simulated Document Viewport */}
              <div className="fictional-doc" aria-hidden="true">
                <div className="doc-meta-bar mono">
                  <span>SAMPLE DOCUMENT / INVOICE</span>
                  <span className="doc-ocr-tag">OCR ENGINE v2.4</span>
                </div>
                <h4 className="doc-org-name mono">NORTHSTAR LABS INC.</h4>

                {/* Field 1: Invoice ID */}
                <div className={`doc-field-row ${scan >= 25 ? "scanned" : ""}`}>
                  <span className="field-name">Invoice ID</span>
                  <div className="field-value-box">
                    <b>{scan >= 25 ? "INV-2048-DX" : "••••••••••••"}</b>
                    {scan >= 25 && <span className="conf-pill mono">99.8%</span>}
                  </div>
                </div>

                {/* Field 2: Date */}
                <div className={`doc-field-row ${scan >= 50 ? "scanned" : ""}`}>
                  <span className="field-name">Issue Date</span>
                  <div className="field-value-box">
                    <b>{scan >= 50 ? "30 OCT 2026" : "••••••••••••"}</b>
                    {scan >= 50 && <span className="conf-pill mono">99.1%</span>}
                  </div>
                </div>

                {/* Field 3: Total */}
                <div className={`doc-field-row ${scan >= 85 ? "scanned" : ""}`}>
                  <span className="field-name">Total Amount</span>
                  <div className="field-value-box">
                    <b>{scan >= 85 ? "₹ 12,450.00" : "••••••••••••"}</b>
                    {scan >= 85 && <span className="conf-pill mono">99.4%</span>}
                  </div>
                </div>

                {/* Visual Scanning Laser Beam */}
                <div
                  className="scanner-beam"
                  style={{ top: `${Math.min(scan, 98)}%` }}
                />
              </div>

              {/* Controls */}
              <div className="scanner-control-strip">
                <label className="scanner-label mono" htmlFor="scanner">
                  <span>SWEEP OCR SCANNER</span>
                  <span className="scanner-pct">{scan}%</span>
                </label>
                <input
                  id="scanner"
                  type="range"
                  min="0"
                  max="100"
                  value={scan}
                  onChange={(e) => {
                    const v = Number(e.target.value);
                    setScan(v);
                    if (v >= 95) unlockKey(0);
                  }}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={scan}
                  aria-label="Document scanner slider control"
                />
              </div>

              <div className="challenge-result" aria-live="polite">
                {keys[0] ? (
                  <div className="result-success mono">
                    <Check size={14} className="check-icon" />
                    <span>3/3 fields identified · Mean confidence 99.4% · Key 01 Acquired</span>
                  </div>
                ) : (
                  <span className="result-hint mono">
                    Fields detected: {detectedCount}/3 · Sweep beam to 95%+ to extract all entities.
                  </span>
                )}
              </div>

              <small className="demo-label mono">
                [ DEMO: Predefined offline document layout simulation. No external OCR called. ]
              </small>
            </article>

            {/* CHALLENGE 2: REASONING (Pathway AI) */}
            <article className={`challenge ${keys[1] ? "solved" : ""}`} aria-labelledby="c2-title">
              <header>
                <span className="challenge-index mono">02</span>
                <div>
                  <h3 id="c2-title">REASONING</h3>
                  <p className="challenge-inspiration">Inspired by Pathway AI</p>
                </div>
                <div className="challenge-status">
                  {keys[1] ? (
                    <span className="key-unlocked-badge mono" title="Key 02 Unlocked">
                      <Key size={14} /> KEY 02
                    </span>
                  ) : (
                    <Layers size={18} className="idle-icon" />
                  )}
                </div>
              </header>

              <p className="challenge-description">
                Query real-time IoT municipal streams and trace grounded evidence.
              </p>

              <label htmlFor="question" className="eyebrow mono">
                SELECT URBAN INVESTIGATION QUERY:
              </label>
              <select
                id="question"
                className="mono"
                value={q}
                onChange={(e) => {
                  setQ(Number(e.target.value));
                  setStage(0);
                  if (timer.current) clearInterval(timer.current);
                }}
              >
                {questions.map((x, i) => (
                  <option key={x.id || i} value={i}>
                    {x.question}
                  </option>
                ))}
              </select>

              {/* RAG Pipeline 4-Stage Stepper */}
              <div className="rag-steps" aria-hidden="true">
                {[
                  { label: "QUERY", icon: Cpu },
                  { label: "RETRIEVAL", icon: Database },
                  { label: "EVIDENCE", icon: Layers },
                  { label: "SYNTHESIS", icon: Check },
                ].map((s, i) => (
                  <span key={s.label} className={`rag-step-chip ${stage > i ? "active" : ""}`}>
                    <s.icon size={10} />
                    <span>{s.label}</span>
                    {i < 3 && <ArrowRight size={8} className="rag-arrow" />}
                  </span>
                ))}
              </div>

              {/* Dynamic Evidence Display */}
              <div className="evidence" aria-live="polite">
                {stage >= 3 ? (
                  <>
                    <div className="evidence-header mono">
                      <span className="eyebrow">GROUNDED TELEMETRY STREAM</span>
                      <span className="sim-badge">Cosine Sim: {activeQuestion.retrievalScore}</span>
                    </div>
                    <p className="evidence-text">{activeQuestion.evidence}</p>

                    {stage >= 4 && (
                      <div className="grounded-answer-box">
                        <span className="eyebrow mono">VERIFIED SYNTHESIS</span>
                        <p className="answer-text">{activeQuestion.answer}</p>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="evidence-placeholder">
                    <p>
                      Initialize the RAG pipeline to pull the real-time sensor reading,
                      cross-validate telemetry, and verify the conclusion.
                    </p>
                  </div>
                )}
              </div>

              <button
                className="button rag-action-btn"
                disabled={stage > 0 && stage < 4}
                onClick={runRagPipeline}
              >
                <span className="mono">
                  {stage > 0 && stage < 4 ? "STREAMING IoT CONTEXT..." : "TRACE RAG PIPELINE"}
                </span>
                <ArrowRight size={14} />
              </button>

              <small className="demo-label mono">
                [ DEMO: Streaming RAG workflow simulation with grounded IoT telemetry. ]
              </small>
            </article>

            {/* CHALLENGE 3: CONNECTION (HEFIN) */}
            <article className={`challenge ${keys[2] ? "solved" : ""}`} aria-labelledby="c3-title">
              <header>
                <span className="challenge-index mono">03</span>
                <div>
                  <h3 id="c3-title">CONNECTION</h3>
                  <p className="challenge-inspiration">Inspired by HEFIN</p>
                </div>
                <div className="challenge-status">
                  {keys[2] ? (
                    <span className="key-unlocked-badge mono" title="Key 03 Unlocked">
                      <Key size={14} /> KEY 03
                    </span>
                  ) : (
                    <Network size={18} className="idle-icon" />
                  )}
                </div>
              </header>

              <p className="challenge-description">
                Bridge distributed nodes to establish decentralized consensus.
              </p>

              {/* Interactive SVG Network Board */}
              <div className={`network-board ${invalidFlash ? "invalid-pulse" : ""}`}>
                <svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
                  {edges.map(([a, b], i) => (
                    <line
                      key={i}
                      x1={points[a][0]}
                      y1={points[a][1]}
                      x2={points[b][0]}
                      y2={points[b][1]}
                      className="network-line"
                      stroke="#ffffff"
                      strokeWidth="1.2"
                    />
                  ))}
                </svg>

                {points.map(([x, y], i) => (
                  <button
                    key={i}
                    aria-label={`${nodeLabels[i].title}: ${nodeLabels[i].role}`}
                    aria-pressed={selectedNode === i}
                    className={`node-button ${selectedNode === i ? "selected" : ""}`}
                    style={{ left: `${x}%`, top: `${y}%` }}
                    onClick={() => handleNodeClick(i)}
                    title={`${nodeLabels[i].title} - ${nodeLabels[i].role}`}
                  >
                    <span className="node-icon">◇</span>
                    <small className="mono">0{i + 1}</small>
                  </button>
                ))}
              </div>

              <div className="challenge-result" aria-live="polite">
                <span className="network-note mono">{networkNote}</span>
              </div>

              <small className="demo-label mono">
                [ DEMO: Decentralized topology simulation. Accessible via keyboard & touch. ]
              </small>
            </article>
          </div>

          {/* GRAND FINALE — THE INTELLIGENCE REVEAL */}
          <div
            className={`vault-reveal ${unlocked ? "unlocked" : "locked"}`}
            aria-live="polite"
          >
            {unlocked ? (
              <div className="reveal-chamber">
                {/* Concentric Alignment Mechanism Visual */}
                <div className="chamber-rings-wrapper" aria-hidden="true">
                  <div className="align-ring outer-ring" />
                  <div className="align-ring mid-ring" />
                  <div className="align-ring inner-ring" />
                  <div className="orbiting-keys-group">
                    <div className="orbit-key k1"><Key size={14} /></div>
                    <div className="orbit-key k2"><Key size={14} /></div>
                    <div className="orbit-key k3"><Key size={14} /></div>
                  </div>
                  <div className="center-core-glow">
                    <Unlock size={32} className="reveal-unlock-icon" />
                  </div>
                </div>

                <span className="eyebrow mono reveal-eyebrow">
                  <Sparkles size={13} className="sparkle-icon" />
                  [ GRAND FINALE: THREE KEYS MERGED · REVEALING MY SUPERPOWER ]
                </span>

                <h3 className="superpower-heading">
                  TRANSFORMING COMPLEX DATA
                  <br />
                  INTO INTELLIGENT DECISIONS.
                </h3>

                {/* 3 Pillars Connecting Real Projects */}
                <div className="superpower-pillars">
                  {SUPERPOWER_TEXT.pillars.map((pillar) => (
                    <div className="pillar-card glass" key={pillar.name}>
                      <div className="pillar-header">
                        <span className="pillar-tag mono">{pillar.name}</span>
                        <strong className="pillar-project mono">{pillar.project}</strong>
                      </div>
                      <p className="pillar-detail">{pillar.detail}</p>
                    </div>
                  ))}
                </div>

                <p className="superpower-synthesis">{SUPERPOWER_TEXT.synthesis}</p>
              </div>
            ) : (
              <div className="locked-preview">
                <LockKeyhole size={28} className="lock-subtle" />
                <p>Complete all three challenges above to align the keys and open the vault.</p>
                <span className="mono key-count-tag">
                  {keys.filter(Boolean).length} / 3 KEYS COLLECTED
                </span>
              </div>
            )}

            <div className="vault-actions-row">
              <button className="button-subtle text-link mono" onClick={handleReplay}>
                <RotateCcw size={14} />
                <span>[ REPLAY THE EXPERIENCE ]</span>
              </button>
              {unlocked && (
                <a href="#projects" className="button-accent mono">
                  <span>VIEW ENGINEERING ARCHIVE</span>
                  <ArrowRight size={14} />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
