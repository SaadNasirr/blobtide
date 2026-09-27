import assert from "node:assert/strict";
import test from "node:test";
import { LEVELS, applyOp, opLabel, simulateBest, simulatePlay } from "../content/levels.js";
import { LAST_LEVEL_INDEX, progressAfterWin } from "../game/Economy.js";
import { slamArmAngle, slamDownAmount, slamHeadLocalX, slamHeadWorldY, slamHitbox, slamHitHalf, SLAM_HEAD } from "../game/LevelWorld.js";
import { leechAmount, leechLabel } from "../game/look.js";

test("a skilled run can clear every campaign level", () => {
  for (const level of LEVELS) {
    const run = simulatePlay(level);
    assert.ok(run.ok, `level ${level.id} playtest failed with ${run.n} vs ${run.hp} at ${run.at || "end"}`);
  }
});

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

test("gate labels stay ASCII so boards never show garbage", () => {
  assert.equal(opLabel("add", 5), "+5");
  assert.equal(opLabel("sub", 2), "-2");
  assert.equal(opLabel("mul", 2), "x2");
  assert.equal(opLabel("div", 3), "/3");
});

test("wrong dual-gate path cannot clear a split level", () => {
  let splits = 0;
  for (const level of LEVELS) {
    if (!level.pieces.some((p) => p.type === "dualgate")) continue;
    splits += 1;
    const best = simulatePlay(level);
    const worst = simulatePlay(level, { worst: true });
    const hp = level.pieces.at(-1).hp;
    assert.ok(best.ok, `level ${level.id} best path should still win`);
    assert.ok(!worst.ok || worst.n < hp, `level ${level.id} trap path still wins with ${worst.n} vs door ${hp}`);
  }
  assert.ok(splits >= 20, `expected many split levels, got ${splits}`);
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
  assert.ok(LEVELS[40].pieces.at(-1).z > LEVELS[0].pieces.at(-1).z + 40);
  assert.ok(LEVELS[55].pieces.at(-1).z > LEVELS[20].pieces.at(-1).z + 30);
  assert.ok(LEVELS.some((l) => l.pieces.some((p) => p.type === "geyser")));
  assert.ok(LEVELS.some((l) => l.pieces.some((p) => p.type === "geyser" && (p.period || 3) === 3)));
  assert.ok(LEVELS.some((l) => l.pieces.some((p) => p.type === "hole")));
  assert.ok(LEVELS.some((l) => l.pieces.some((p) => p.type === "pendulum")));
  assert.ok(LEVELS.some((l) => l.pieces.some((p) => p.type === "orbit")));
  assert.ok(LEVELS.some((l) => l.pieces.some((p) => p.type === "slam")));
  assert.ok(LEVELS.some((l) => l.pieces.some((p) => p.type === "beam")));
  assert.ok(LEVELS[0].pieces.some((p) => p.type === "army"));
  assert.ok(LEVELS[1].pieces.some((p) => p.type === "star"));
});

test("campaign has more red boards than green and greedy traps", () => {
  let green = 0;
  let red = 0;
  for (const level of LEVELS) {
    for (const p of level.pieces) {
      if (p.type === "gate") {
        if (p.op === "add" || p.op === "mul") green += 1;
        else red += 1;
      } else if (p.type === "dualgate") {
        for (const side of [p.left, p.right]) {
          if (side.op === "add" || side.op === "mul") green += 1;
          else red += 1;
        }
      }
    }
  }
  assert.ok(red > green, `red ${red} should beat green ${green}`);
  assert.ok(LEVELS.some((l) => l.pieces.some((p) => p.type === "leech")));
  assert.ok(LEVELS.some((l) => l.pieces.some((p) => p.type === "snare")));
  assert.ok(LEVELS.some((l) => l.pieces.some((p) => p.type === "chaser")));
});

test("campaign mixes unique layouts and beast fights", () => {
  const signatures = new Set(
    LEVELS.map((l) =>
      l.pieces.map((p) => `${p.type}:${p.op || p.left?.op || ""}:${Math.round((p.x || 0) * 10)}:${p.value || p.count || p.hp || 0}`).join("|")
    )
  );
  assert.ok(signatures.size >= 48, `only ${signatures.size} unique layouts`);
  assert.ok(LEVELS.some((l) => l.pieces.some((p) => p.type === "beast")), "need mid-run beasts");
  assert.ok(LEVELS.some((l) => l.pieces.at(-1).beast), "need at least one beast finale");
  assert.ok(LEVELS[3].pieces.some((p) => p.type === "beast"));
});

test("slam hammer collider follows the head while down", () => {
  assert.equal(slamDownAmount(0.2), 0);
  assert.ok(slamDownAmount(0.72) > 0.99);
  assert.ok(slamDownAmount(0.7) > 0.18);
  const rest = slamHeadLocalX(0);
  const down = slamHeadLocalX(1);
  assert.ok(Math.abs(down) < 1.4);
  assert.ok(Math.abs(down - rest) > 0.6);
  assert.ok(slamArmAngle(1) > slamArmAngle(0));
  const floorY = slamHeadWorldY(1);
  const restY = slamHeadWorldY(0);
  assert.ok(restY > 1.8);
  assert.ok(floorY < 0.7);
  assert.ok(floorY - SLAM_HEAD.sy * 0.5 < 0.12);
  const box = slamHitbox(1, 0, 40);
  assert.equal(box.x, down);
  assert.equal(box.z, 40);
  assert.equal(box.width, SLAM_HEAD.sx);
  assert.equal(box.depth, SLAM_HEAD.sz);
  assert.equal(slamHitHalf(0), SLAM_HEAD.sx * 0.5);
});

test("leech coins in the campaign are labeled -10, -20, or -30", () => {
  const leeches = LEVELS.flatMap((l) => l.pieces.filter((p) => p.type === "leech"));
  assert.ok(leeches.length >= 2);
  for (const p of leeches) {
    assert.ok(p.amount === 10 || p.amount === 20 || p.amount === 30, `leech amount ${p.amount}`);
    assert.equal(leechLabel(p.amount), `-${leechAmount(p.amount)}`);
  }
});
