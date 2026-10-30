export const questions = [
  {
    question: "Which district needs attention?",
    evidence:
      "Sample sensor A17 · North district · PM2.5: 82 µg/m³. Sample sensor B04 · South district · PM2.5: 21 µg/m³.",
    answer:
      "North district has the higher PM2.5 reading in this sample (82 versus 21 µg/m³). Prioritize a closer review of North’s conditions.",
  },
  {
    question: "Where is traffic moving slowly?",
    evidence:
      "Sample traffic T01 · Central corridor · mean speed: 12 km/h. Sample traffic T02 · East corridor · mean speed: 38 km/h.",
    answer:
      "The Central corridor is slower in this sample: 12 km/h compared with 38 km/h in the East corridor.",
  },
];
export function networkConnected(edges) {
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
  return keys.length === 3 && keys.every(Boolean);
}
