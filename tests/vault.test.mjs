import test from "node:test";
import assert from "node:assert/strict";
import {
  networkConnected,
  addEdge,
  isUnlocked,
  questions,
  nodeLabels,
  SUPERPOWER_TEXT,
} from "../src/features/intelligence-vault/logic.mjs";

test("disconnected islands cannot unlock connection", () => {
  assert.equal(
    networkConnected([
      [0, 1],
      [2, 3],
    ]),
    false,
  );
});

test("connected paths work in either direction", () => {
  assert.equal(
    networkConnected([
      [3, 2],
      [2, 1],
      [1, 0],
    ]),
    true,
  );
});

test("duplicate and self connections are rejected", () => {
  const a = [[0, 1]];
  assert.deepEqual(addEdge(a, 1, 0), a);
  assert.deepEqual(addEdge(a, 2, 2), a);
  assert.deepEqual(addEdge(a, 1, 2), [
    [0, 1],
    [1, 2],
  ]);
});

test("vault requires all three independent keys", () => {
  assert.equal(isUnlocked([true, true, false]), false);
  assert.equal(isUnlocked([true, false, true]), false);
  assert.equal(isUnlocked([false, true, true]), false);
  assert.equal(isUnlocked([true, true, true]), true);
  assert.equal(isUnlocked([]), false);
  assert.equal(isUnlocked([false, false, false]), false);
});

test("sample answers preserve supplied sensor values", () => {
  assert.match(questions[0].answer, /82 versus 21/);
  assert.match(questions[1].answer, /12 km\/h compared with 38/);
  assert.match(questions[2].answer, /14\.8 MW/);
});

test("node labels contain all 4 decentralized roles", () => {
  assert.equal(nodeLabels.length, 4);
  const roles = nodeLabels.map((n) => n.role);
  assert.ok(roles.includes("Core Ledger"));
  assert.ok(roles.includes("Inference"));
  assert.ok(roles.includes("Storage"));
  assert.ok(roles.includes("Edge Client"));
});

test("superpower text contains verified authentic engineering connections", () => {
  assert.equal(SUPERPOWER_TEXT.title, "MY SUPERPOWER");
  assert.equal(
    SUPERPOWER_TEXT.statement,
    "TRANSFORMING COMPLEX DATA INTO INTELLIGENT DECISIONS.",
  );
  assert.equal(SUPERPOWER_TEXT.pillars.length, 3);

  const [p1, p2, p3] = SUPERPOWER_TEXT.pillars;
  assert.equal(p1.name, "PERCEPTION");
  assert.equal(p1.project, "DocRecon");

  assert.equal(p2.name, "REASONING");
  assert.equal(p2.project, "Pathway AI");

  assert.equal(p3.name, "CONNECTION");
  assert.equal(p3.project, "HEFIN");
});

test("progressive addition of edges unlocks network and handles cycle gracefully", () => {
  let edges = [];
  assert.equal(networkConnected(edges), false);
  edges = addEdge(edges, 0, 1);
  assert.equal(networkConnected(edges), false);
  edges = addEdge(edges, 1, 2);
  assert.equal(networkConnected(edges), false);
  edges = addEdge(edges, 2, 3);
  assert.equal(networkConnected(edges), true);

  // Cycle addition should not break connected status
  edges = addEdge(edges, 3, 0);
  assert.equal(networkConnected(edges), true);
  assert.equal(edges.length, 4);
});
