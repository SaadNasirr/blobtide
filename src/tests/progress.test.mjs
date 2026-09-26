import assert from "node:assert/strict";
import test from "node:test";
import { starRating, sanitizeStats, mergeLevelStat } from "../game/progress.js";
import { Platform } from "../platform/adapter.js";
import { sanitizeSave } from "../game/Economy.js";

test("star rating is 1 on a thin smash and 3 on a fat surplus", () => {
  assert.equal(starRating({ leftover: 0, doorHp: 10 }), 1);
  assert.equal(starRating({ leftover: 2, doorHp: 10 }), 2);
  assert.equal(starRating({ leftover: 5, doorHp: 10 }), 3);
});

test("stats sanitizer drops junk keys", () => {
  const stats = sanitizeStats({ 0: { stars: 9, bestCoins: 12, completed: true, hack: 1 }, foo: {} });
  assert.equal(stats[0].stars, 3);
  assert.equal(stats[0].bestCoins, 12);
  assert.equal(stats[0].completed, true);
  assert.equal(stats.foo, undefined);
});

test("merge keeps the best run", () => {
  const merged = mergeLevelStat({ stars: 1, bestCoins: 10, bestCrowd: 8, completed: true }, {
    stars: 3,
    bestCoins: 4,
    bestCrowd: 20,
    completed: true,
  });
  assert.equal(merged.stars, 3);
  assert.equal(merged.bestCoins, 10);
  assert.equal(merged.bestCrowd, 20);
});

test("save round-trip keeps stats", () => {
  const clean = sanitizeSave({ coins: 20, stats: { 0: { stars: 2, bestCoins: 9, bestCrowd: 11, completed: true } } });
  assert.equal(clean.stats[0].stars, 2);
  assert.equal(clean.stats[0].bestCoins, 9);
});

test("platform adapter is a no-op without an SDK", async () => {
  assert.equal(Platform.has("commercialBreak"), false);
  assert.equal(await Platform.commercialBreak(), true);
  assert.equal(await Platform.rewardedBreak(), false);
});
