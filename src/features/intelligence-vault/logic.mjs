export const questions = [
  {
    id: "q1",
    question: "Which district needs attention?",
    retrievalScore: 0.94,
    sourceDoc: "Stream: Urban-Environment-Index #402",
    evidence:
      "Sample sensor A17 · North district · PM2.5: 82 µg/m³. Sample sensor B04 · South district · PM2.5: 21 µg/m³.",
    answer:
      "North district has the higher PM2.5 reading in this sample (82 versus 21 µg/m³). Prioritize a closer review of North’s conditions.",
  },
  {
    id: "q2",
    question: "Where is traffic moving slowly?",
    retrievalScore: 0.91,
    sourceDoc: "Stream: Municipal-Transit-Corridors #108",
    evidence:
      "Sample traffic T01 · Central corridor · mean speed: 12 km/h. Sample traffic T02 · East corridor · mean speed: 38 km/h.",
    answer:
      "The Central corridor is slower in this sample: 12 km/h compared with 38 km/h in the East corridor.",
  },
  {
    id: "q3",
    question: "What is the peak energy load on the East Grid?",
    retrievalScore: 0.96,
    sourceDoc: "Stream: Smart-Grid-Distribution #882",
    evidence:
      "Sample meter E09 · East district · Peak load: 14.8 MW (92% capacity). Sample meter W02 · West district · Peak load: 6.2 MW.",
    answer:
      "East district peak load reached 14.8 MW (92% threshold). Recommend automated load redistribution to West district.",
  },
];

export const nodeLabels = [
  { id: 0, title: "Node 01", role: "Core Ledger", desc: "Decentralized consensus state" },
  { id: 1, title: "Node 02", role: "Inference", desc: "Local model execution" },
  { id: 2, title: "Node 03", role: "Storage", desc: "Persistent on-chain data" },
  { id: 3, title: "Node 04", role: "Edge Client", desc: "User query interface" },
];

export function networkConnected(edges) {
  if (!edges || edges.length === 0) return false;
  const seen = new Set([0]);
  let changed = true;
  while (changed) {
    changed = false;
    for (const [a, b] of edges) {
      if (seen.has(a) && !seen.has(b)) {
        seen.add(b);
        changed = true;
      }
      if (seen.has(b) && !seen.has(a)) {
        seen.add(a);
        changed = true;
      }
    }
  }
  return seen.size === 4;
}

export function addEdge(edges, a, b) {
  if (
    a === b ||
    edges.some(([x, y]) => (x === a && y === b) || (x === b && y === a))
  )
    return edges;
  return [...edges, [a, b]];
}

export function isUnlocked(keys) {
  return Array.isArray(keys) && keys.length === 3 && keys.every(Boolean);
}

export const SUPERPOWER_TEXT = {
  title: "MY SUPERPOWER",
  statement: "TRANSFORMING COMPLEX DATA INTO INTELLIGENT DECISIONS.",
  pillars: [
    {
      name: "PERCEPTION",
      project: "DocRecon",
      detail: "Extracting structured signal and spatial layout from unstructured invoices and forms.",
    },
    {
      name: "REASONING",
      project: "Pathway AI",
      detail: "Retrieving dynamic real-time sensor streams and grounding AI answers in empirical evidence.",
    },
    {
      name: "CONNECTION",
      project: "HEFIN",
      detail: "Bridging decentralized on-chain storage with conversational neural interfaces.",
    },
  ],
  synthesis:
    "My engineering focus is not passive prediction, but actionable intelligence: systems that perceive accurately, reason transparently, and connect reliably to empower high-stakes human decisions.",
};
