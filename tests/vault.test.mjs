import test from "node:test";
import assert from "node:assert/strict";
import {
  networkConnected,
  addEdge,
  isUnlocked,
  questions,
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
  assert.equal(isUnlocked([true, true, true]), true);
  assert.equal(isUnlocked([]), false);
});
test("sample answers preserve supplied sensor values", () => {
  assert.match(questions[0].answer, /82 versus 21/);
  assert.match(questions[1].answer, /12 km\/h compared with 38/);
});
