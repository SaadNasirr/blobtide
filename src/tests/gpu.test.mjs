import assert from "node:assert/strict";
import test from "node:test";
import { DT_MAX, MAX_AUDIO_SOURCES, MAX_DRAW_CALLS, MAX_VRAM_MB, TOUCH_BUDGET_MS, deviceProfile, sharedGeos } from "../game/gpu.js";
import { MAX_PARTICLES } from "../game/Particles.js";

test("device pixel caps match iOS 1.0, Android 1.15, desktop 1.35", () => {
  const iphone = deviceProfile({ userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)", deviceMemory: 4 });
  assert.equal(iphone.ios, true);
  assert.equal(iphone.cap, 1);
  const galaxy = deviceProfile({ userAgent: "Mozilla/5.0 (Linux; Android 12; SM-G991B) AppleWebKit/537.36 Mobile", deviceMemory: 8 });
  assert.equal(galaxy.android, true);
  assert.equal(galaxy.cap, 1.15);
  const desk = deviceProfile({ userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64)", deviceMemory: 16 });
  assert.equal(desk.mobile, false);
  assert.equal(desk.cap, 1.35);
  assert.equal(DT_MAX, 0.033);
  assert.equal(TOUCH_BUDGET_MS, 100);
  assert.equal(MAX_DRAW_CALLS, 80);
  assert.equal(MAX_VRAM_MB, 50);
  assert.equal(MAX_AUDIO_SOURCES, 8);
  assert.equal(MAX_PARTICLES, 500);
});

test("shared geos reuse one sphere, box, and cone", () => {
  const a = sharedGeos();
  const b = sharedGeos();
  assert.equal(a.sphere, b.sphere);
  assert.equal(a.box, b.box);
  assert.equal(a.cone, b.cone);
  assert.equal(a.blob, b.blob);
});
