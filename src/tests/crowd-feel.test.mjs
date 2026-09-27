import assert from "node:assert/strict";
import test from "node:test";
import { TweenPool, Ease, comboSquashAmount } from "../game/tween.js";
import { blobBreathGlow, gateFaceColor, gateLabelSize, leechAmount, leechLabel } from "../game/look.js";

test("combo squash is 5% / 10% / 15% at 5x / 10x / 20x", () => {
  assert.equal(comboSquashAmount(4), 0);
  assert.equal(comboSquashAmount(5), 0.05);
  assert.equal(comboSquashAmount(10), 0.1);
  assert.equal(comboSquashAmount(20), 0.15);
});

test("leader squash amplitude is 20% bigger than the pack", () => {
  const pack = comboSquashAmount(20);
  const leader = pack * 1.2;
  assert.equal(leader, 0.18);
});

test("tween pool caps at 50 and eases to the target", () => {
  const pool = new TweenPool(50);
  const obj = { v: 0 };
  pool.to(obj, "v", 1, 0.2, Ease.quadOut);
  pool.update(0.2);
  assert.equal(obj.v, 1);
  for (let i = 0; i < 60; i++) pool.to({ n: 0 }, "n", 1, 1, Ease.linear);
  assert.ok(pool.active.length <= 50);
});

test("good-gate squash is -10% and red-gate squash is -25%", () => {
  assert.equal(Math.round((1 - 0.9) * 100), 10);
  assert.equal(Math.round((1 - 0.75) * 100), 25);
});

test("blob breath glow is 0.3 + 0.1 * sin(time * 2)", () => {
  assert.equal(blobBreathGlow(0), 0.3);
  assert.ok(Math.abs(blobBreathGlow(Math.PI / 4) - (0.3 + 0.1)) < 1e-10);
});

test("gate labels are operator-colored and stay big and readable", () => {
  assert.equal(gateFaceColor("add"), "#1aa34a");
  assert.equal(gateFaceColor("sub"), "#d1262e");
  assert.equal(gateFaceColor("mul"), "#0f8f8a");
  assert.equal(gateFaceColor("div"), "#c45a12");
  assert.equal(gateFaceColor("add", true), "#b00000");
  assert.ok(gateLabelSize("add", 2) >= 92);
  assert.ok(gateLabelSize("mul", 2) >= 92);
  assert.ok(gateLabelSize("add", 50) <= gateLabelSize("add", 2));
});

test("leech pickups snap to minus 10, 20, or 30", () => {
  assert.equal(leechAmount(10), 10);
  assert.equal(leechAmount(14), 10);
  assert.equal(leechAmount(20), 20);
  assert.equal(leechAmount(25), 20);
  assert.equal(leechAmount(26), 30);
  assert.equal(leechAmount(40), 30);
  assert.equal(leechLabel(20), "-20");
  assert.equal(leechLabel(30), "-30");
  assert.equal(leechLabel(10), "-10");
});
