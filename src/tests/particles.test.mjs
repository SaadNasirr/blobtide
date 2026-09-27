import assert from "node:assert/strict";
import test from "node:test";
import { BURST_BAD, BURST_GOOD, MAX_PARTICLES, PICKUP_BURST_MAX, PIT_PARTICLE_CAP, burstCount, burstSpeed, hemiVel } from "../game/Particles.js";

test("good and bad gate bursts stay in spec", () => {
  assert.equal(BURST_GOOD.min, 8);
  assert.equal(BURST_GOOD.max, 12);
  assert.equal(BURST_GOOD.life, 0.6);
  assert.equal(BURST_BAD.min, 6);
  assert.equal(BURST_BAD.max, 8);
  assert.equal(BURST_BAD.life, 0.4);
  assert.equal(MAX_PARTICLES, 500);
  for (let i = 0; i < 40; i++) {
    const n = burstCount(BURST_GOOD);
    assert.ok(n >= 8 && n <= 12);
    const s = burstSpeed(BURST_GOOD);
    assert.ok(s >= 8 && s <= 12);
    const bad = burstCount(BURST_BAD);
    assert.ok(bad >= 6 && bad <= 8);
  }
  const up = hemiVel(true, 10);
  const down = hemiVel(false, 10);
  assert.ok(up.vy > 0);
  assert.ok(down.vy < 0);
});

test("pickup bursts stay at or under 10 particles", () => {
  assert.equal(PICKUP_BURST_MAX, 10);
});

test("pit and geyser particles cap at 300 per source", () => {
  assert.equal(PIT_PARTICLE_CAP, 300);
});
