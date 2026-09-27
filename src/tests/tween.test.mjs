import assert from "node:assert/strict";
import test from "node:test";
import { Ease } from "../game/tween.js";

test("spawn overshoot peaks about 10% then settles to 1", () => {
  assert.equal(Ease.overshoot(0), 0);
  assert.equal(Ease.overshoot(1), 1);
  const peak = Ease.overshoot(0.62);
  assert.ok(peak > 1.09 && peak < 1.11, `peak ${peak}`);
  assert.ok(Ease.overshoot(0.3) > 0.4 && Ease.overshoot(0.3) < 1.1);
});
