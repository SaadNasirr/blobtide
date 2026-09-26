import assert from "node:assert/strict";
import test from "node:test";
import { LEVELS, applyOp, simulateBest } from "../content/levels.js";
import { LAST_LEVEL_INDEX, progressAfterWin } from "../game/Economy.js";

test("campaign has 56 completable levels", () => {
  assert.equal(LEVELS.length, 56);
  assert.equal(LAST_LEVEL_INDEX, LEVELS.length - 1);
  for (const level of LEVELS) {
    const finish = level.pieces.filter((p) => p.type === "finish");
    assert.equal(finish.length, 1, `level ${level.id} needs one door`);
    const sim = simulateBest(level);
    assert.ok(sim.count >= sim.hp, `level ${level.id} best path ${sim.count} < door ${sim.hp}`);
    assert.ok(level.startCount >= 1);
  }
});

test("beating the last level completes instead of wrapping", () => {
  assert.deepEqual(progressAfterWin(0), { levelIndex: 1, campaignComplete: false });
  assert.deepEqual(progressAfterWin(54), { levelIndex: 55, campaignComplete: false });
  assert.deepEqual(progressAfterWin(55), { levelIndex: 55, campaignComplete: true });
  assert.deepEqual(progressAfterWin(99), { levelIndex: 55, campaignComplete: true });
});

test("gate math stays whole-crowd", () => {
  assert.equal(applyOp("add", 3, 4), 7);
  assert.equal(applyOp("mul", 4, 2), 8);
  assert.equal(applyOp("div", 9, 2), 4);
  assert.equal(applyOp("sub", 2, 9), 0);
});

test("every level ends with a smash door and valid pieces", () => {
  for (const level of LEVELS) {
    const last = level.pieces.at(-1);
    assert.equal(last.type, "finish", `level ${level.id} last piece is ${last.type}`);
    let z = 0;
    for (const p of level.pieces) {
      assert.ok(p.z >= z - 0.01, `level ${level.id} pieces go backwards at z=${p.z}`);
      z = p.z;
      if (p.type === "dualgate") {
        assert.ok(p.left?.op && p.right?.op, `level ${level.id} dual missing ops`);
      }
    }
  }
});

test("late levels are stricter and longer than the tutorial", () => {
  const early = simulateBest(LEVELS[0]);
  const late = simulateBest(LEVELS[55]);
  assert.ok(LEVELS[55].pieces.length > LEVELS[0].pieces.length);
  assert.ok(late.hp > early.hp, `late door ${late.hp} should beat early door ${early.hp}`);
  assert.ok(LEVELS[0].pieces.at(-1).z >= 90, "level 1 should run for a while");
  assert.ok(LEVELS[20].pieces.at(-1).z > LEVELS[0].pieces.at(-1).z + 20);
  assert.ok(LEVELS[0].pieces.some((p) => p.type === "army"));
  assert.ok(LEVELS[1].pieces.some((p) => p.type === "star"));
});
