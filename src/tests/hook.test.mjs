import assert from "node:assert/strict";
import test from "node:test";
import {
  advanceDaily,
  applyMission,
  nearMiss,
  nextSkinGoal,
  streakBonus,
  utcDay,
} from "../game/hook.js";

test("daily streak claims once per UTC day and resets after a gap", () => {
  const t = Date.parse("2026-09-25T12:00:00.000Z");
  const first = advanceDaily("", 0, t);
  assert.equal(first.streak, 1);
  assert.ok(first.claim >= 15);
  const same = advanceDaily(first.day, first.streak, t + 3600_000);
  assert.equal(same.claim, 0);
  assert.equal(same.streak, 1);
  const next = advanceDaily(first.day, 1, t + 86400000);
  assert.equal(next.streak, 2);
  assert.ok(next.claim > first.claim);
  const gap = advanceDaily(first.day, 5, t + 86400000 * 3);
  assert.equal(gap.streak, 1);
});

test("near-miss copy fires when the door was almost smashable", () => {
  assert.equal(nearMiss({ reason: "door", crowd: 9, doorHp: 10 }).close, true);
  assert.equal(nearMiss({ reason: "door", crowd: 2, doorHp: 20 }).close, false);
  assert.equal(nearMiss({ reason: "hazard", crowd: 9, doorHp: 10 }).close, false);
});

test("missions complete and rotate", () => {
  const mid = applyMission(0, 2, "wins", 1);
  assert.equal(mid.completed, true);
  assert.equal(mid.reward, 40);
  assert.equal(mid.missionIndex, 1);
  const coins = applyMission(1, 50, "coins", 20);
  assert.equal(coins.completed, true);
});

test("next skin goal is the cheapest unowned cosmetic", () => {
  const goal = nextSkinGoal(["lime"], 20);
  assert.equal(goal.id, "cyan");
  assert.equal(goal.price, 50);
  assert.equal(goal.have, 20);
});

test("streak bonus scales and utc day is stable", () => {
  assert.equal(streakBonus(3), 12);
  assert.equal(utcDay(Date.parse("2026-09-25T23:00:00.000Z")), "2026-09-25");
});
