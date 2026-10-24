const test = require("node:test");
const assert = require("node:assert/strict");

const { textToSimlish, stopSimlish } = require("../");

test("exports the Simlish playback functions", () => {
  assert.equal(typeof textToSimlish, "function");
  assert.equal(typeof stopSimlish, "function");
});

test("empty text resolves without requiring browser audio APIs", async () => {
  await assert.doesNotReject(textToSimlish(""));
});
