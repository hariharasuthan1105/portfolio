import { useEffect, useRef, useState } from "react";
import {
  LockKeyhole,
  Unlock,
  ScanLine,
  ArrowRight,
  Check,
  RotateCcw,
  Network,
} from "lucide-react";
import { addEdge, isUnlocked, networkConnected, questions } from "./logic.mjs";
export default function Vault() {
  const [keys, setKeys] = useState([false, false, false]);
  const [scan, setScan] = useState(0);
  const [q, setQ] = useState(0);
  const [stage, setStage] = useState(0);
  const [edges, setEdges] = useState<number[][]>([]);
  const [node, setNode] = useState<number | null>(null);
  const [note, setNote] = useState(
    "Select a node, then another to connect them.",
  );
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);
  const unlock = (i: number) =>
    setKeys((k) => k.map((v, j) => (j === i ? true : v)));
  const unlocked = isUnlocked(keys);
  const points = [
    [50, 19],
    [82, 52],
    [50, 84],
    [18, 52],
  ];
  useEffect(
    () => () => {
      if (timer.current) clearInterval(timer.current);
    },
    [],
  );
  const retrieve = () => {
    if (timer.current) clearInterval(timer.current);
    setStage(1);
    let n = 1;
    timer.current = setInterval(() => {
      n++;
      setStage(n);
      if (n === 4) {
        if (timer.current) clearInterval(timer.current);
        timer.current = null;
        unlock(1);
      }
    }, 450);
  };
  const connect = (i: number) => {
    if (node === null) {
      setNode(i);
      setNote(`Node ${i + 1} selected. Choose another node.`);
      return;
    }
    const next = addEdge(edges, node, i);
    setEdges(next);
    setNode(null);
    if (networkConnected(next)) {
      unlock(2);
      setNote("Network connected. All four nodes can share information.");
    } else
      setNote(
        next === edges
          ? "Choose two different nodes without repeating an edge."
          : `${next.length} connections. Connect all four nodes.`,
      );
  };
  const replay = () => {
    if (timer.current) clearInterval(timer.current);
    timer.current = null;
    setKeys([false, false, false]);
    setScan(0);
    setStage(0);
    setEdges([]);
    setNode(null);
    setNote("Select a node, then another to connect them.");
  };
  return (
    <section id="vault" className="section vault-section">
      <div className="section-inner">
        <div className="vault-heading">
          <span className="eyebrow">[ 08 / A ONE-MINUTE EXPERIMENT ]</span>
          <LockKeyhole size={28} />
          <h2>THE INTELLIGENCE VAULT</h2>
          <p className="mono">THREE KEYS. ONE INTELLIGENCE.</p>
          <div
            className="key-progress"
            aria-label={`${keys.filter(Boolean).length} of 3 keys collected`}
          >
            {keys.map((k, i) => (
              <span key={i} className={k ? "complete" : ""}>
                {k ? <Check size={14} /> : <LockKeyhole size={12} />}KEY 0
                {i + 1}
              </span>
            ))}
          </div>
        </div>
        <div className="vault-grid">
          <article className={"challenge " + (keys[0] ? "solved" : "")}>
            <header>
              <span>01</span>
              <div>
                <h3>PERCEPTION</h3>
                <p>Inspired by DocRecon</p>
              </div>
              {keys[0] ? <Check /> : <ScanLine />}
            </header>
            <p className="challenge-description">
              Find the signal in the unstructured.
            </p>
            <div className="fictional-doc">
              <span className="mono">FICTIONAL SAMPLE / INVOICE</span>
              <h4>NORTHSTAR LABS</h4>
              <div>
                Invoice <b>{scan >= 25 ? "INV-2048" : "••••••••"}</b>
              </div>
              <div>
                Date <b>{scan >= 50 ? "30 OCT 2026" : "••••••••"}</b>
              </div>
              <div>
                Total <b>{scan >= 85 ? "₹ 12,450.00" : "••••••••"}</b>
              </div>
              <div className="scanner-beam" style={{ top: `${scan}%` }} />
            </div>
            <label className="scanner-label" htmlFor="scanner">
              MOVE THE SCANNER <span>{scan}%</span>
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
                if (v >= 95) unlock(0);
              }}
            />
            <div className="challenge-result" aria-live="polite">
              {keys[0]
                ? "✓ 3 fields extracted · simulated confidence 98%"
                : "Slide to the end to reveal all three fields."}
            </div>
            <small className="demo-label">
              Predefined frontend simulation · no OCR model runs.
            </small>
          </article>
          <article className={"challenge " + (keys[1] ? "solved" : "")}>
            <header>
              <span>02</span>
              <div>
                <h3>REASONING</h3>
                <p>Inspired by Pathway AI</p>
              </div>
              {keys[1] ? <Check /> : <span>◇</span>}
            </header>
            <p className="challenge-description">
              An answer is only as good as its evidence.
            </p>
            <label htmlFor="question" className="eyebrow">
              ASK THE CITY
            </label>
            <select
              id="question"
              value={q}
              onChange={(e) => {
                setQ(Number(e.target.value));
                setStage(0);
                if (timer.current) clearInterval(timer.current);
              }}
            >
              {questions.map((x, i) => (
                <option key={x.question} value={i}>
                  {x.question}
                </option>
              ))}
            </select>
            <div className="rag-steps">
              {["QUESTION", "RETRIEVAL", "EVIDENCE", "ANSWER"].map((s, i) => (
                <span key={s} className={stage > i ? "active" : ""}>
                  {s}
                  {i < 3 && <ArrowRight size={10} />}
                </span>
              ))}
            </div>
            <div className="evidence" aria-live="polite">
              {stage >= 3 ? (
                <>
                  <span className="eyebrow">SAMPLE EVIDENCE</span>
                  <p>{questions[q].evidence}</p>
                  {stage === 4 && (
                    <>
                      <span className="eyebrow">GROUNDED ANSWER</span>
                      <p>{questions[q].answer}</p>
                    </>
                  )}
                </>
              ) : (
                <p>
                  Retrieve the relevant sample sensor readings, then trace the
                  answer back to its source.
                </p>
              )}
            </div>
            <button
              className="button"
              disabled={stage > 0 && stage < 4}
              onClick={retrieve}
            >
              {stage > 0 && stage < 4 ? "RETRIEVING…" : "TRACE THE ANSWER"}
              <ArrowRight size={15} />
            </button>
            <small className="demo-label">
              RAG workflow demonstration · predefined evidence.
            </small>
          </article>
          <article className={"challenge " + (keys[2] ? "solved" : "")}>
            <header>
              <span>03</span>
              <div>
                <h3>CONNECTION</h3>
                <p>Inspired by HEFIN</p>
              </div>
              {keys[2] ? <Check /> : <Network />}
            </header>
            <p className="challenge-description">
              Intelligence grows through connection.
            </p>
            <div className="network-board">
              <svg
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
                aria-hidden="true"
              >
                {edges.map(([a, b], i) => (
                  <line
                    key={i}
                    x1={points[a][0]}
                    y1={points[a][1]}
                    x2={points[b][0]}
                    y2={points[b][1]}
                    stroke="white"
                    strokeWidth=".4"
                  />
                ))}
              </svg>
              {points.map(([x, y], i) => (
                <button
                  key={i}
                  aria-label={`Network node ${i + 1}`}
                  aria-pressed={node === i}
                  className={node === i ? "selected" : ""}
                  style={{ left: `${x}%`, top: `${y}%` }}
                  onClick={() => connect(i)}
                >
                  <span>◇</span>
                  <small>0{i + 1}</small>
                </button>
              ))}
            </div>
            <div className="challenge-result" aria-live="polite">
              {note}
            </div>
            <small className="demo-label">
              Network simulation · select nodes with touch or keyboard.
            </small>
          </article>
        </div>
        <div
          className={"vault-reveal " + (unlocked ? "unlocked" : "")}
          aria-live="polite"
        >
          {unlocked ? (
            <>
              <Unlock size={30} />
              <span className="eyebrow">VAULT UNLOCKED / MY SUPERPOWER</span>
              <h3>
                TRANSFORMING COMPLEX DATA
                <br />
                INTO INTELLIGENT DECISIONS.
              </h3>
              <p>
                Perception finds the signal. Reasoning gives it meaning.
                Connection makes it useful. I explore these ideas through AI,
                quantitative finance, probability, and optimization — building
                systems that turn information into decisions.
              </p>
            </>
          ) : (
            <>
              <LockKeyhole size={25} />
              <p>Complete all three challenges to reveal what connects them.</p>
              <span className="mono">
                {keys.filter(Boolean).length} / 3 KEYS COLLECTED
              </span>
            </>
          )}
          <button className="text-link" onClick={replay}>
            <RotateCcw size={14} /> REPLAY THE VAULT
          </button>
          {unlocked && (
            <a href="#projects" className="text-link">
              RETURN TO THE ARCHIVE <ArrowRight size={14} />
            </a>
          )}
        </div>
      </div>
    </section>
  );
}
