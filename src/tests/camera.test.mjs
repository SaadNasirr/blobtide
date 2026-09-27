import assert from "node:assert/strict";
import test from "node:test";
import { CAM, cameraShot, camMode, comboPulseFov, expEase, pxToWorld, swayFromSteer } from "../game/CameraRig.js";
import { SHAKE, Shake } from "../game/Juice.js";

test("default fov is 50 and boss fight is tighter at 45", () => {
  assert.equal(CAM.fov, 50);
  assert.equal(CAM.bossFov, 45);
  const n = cameraShot({ mode: "normal" });
  const b = cameraShot({ mode: "boss" });
  assert.equal(n.fov, 50);
  assert.equal(b.fov, 45);
  assert.ok(b.y > n.y);
});

test("steer sway is ±3° with 100ms exponential lag", () => {
  assert.ok(Math.abs(swayFromSteer(1, false) - (3 * Math.PI) / 180) < 1e-9);
  assert.ok(Math.abs(swayFromSteer(-1, true) + (3 * Math.PI) / 180) < 1e-9);
  assert.equal(CAM.swerveDeg, 3);
  assert.equal(CAM.steerLag, 0.1);
  const k = expEase(0.1, 0.1);
  assert.ok(k > 0.6 && k < 0.65);
});

test("combo 20 pulse is 50-55-50 over 400ms", () => {
  assert.equal(comboPulseFov(-0.01), 50);
  assert.equal(comboPulseFov(0.4), 50);
  assert.ok(Math.abs(comboPulseFov(0.2) - 55) < 0.001);
  assert.ok(comboPulseFov(0.1) > 50 && comboPulseFov(0.1) < 55);
});

test("warden intro zoom is 20% out over 1s and victory orbits 360° in 2s", () => {
  assert.equal(CAM.introZoom, 1.2);
  assert.equal(CAM.introDur, 1);
  const a = cameraShot({ mode: "intro", introZoom: 1.2, crowdZ: 10 });
  const b = cameraShot({ mode: "normal", introZoom: 1, crowdZ: 10 });
  assert.ok(a.z < b.z);
  const v0 = cameraShot({ mode: "victory", orbit: 0, crowdX: 0, crowdZ: 20 });
  const v1 = cameraShot({ mode: "victory", orbit: 0.25, crowdX: 0, crowdZ: 20 });
  assert.ok(Math.abs(v1.x) > 2);
  assert.ok(v1.y > v0.y);
  assert.ok(v1.ly > v0.ly);
});

test("loss shot locks low and modes map win/boss/intro", () => {
  assert.equal(camMode({ win: true }), "victory");
  assert.equal(camMode({ loss: true }), "loss");
  assert.equal(camMode({ bossFight: true }), "boss");
  assert.equal(camMode({ intro: true }), "intro");
  const L = cameraShot({ mode: "loss", lookX: 1, lookY: 1.2, lookZ: 40, crowdZ: 38 });
  assert.ok(L.ly > 0.5);
  assert.ok(L.z < 38);
});

test("shake hits last 0.1s at 5Hz then fade, and px scales with viewport", () => {
  assert.ok(pxToWorld(2, 800) < pxToWorld(4, 800));
  assert.deepEqual(SHAKE.hazard, { px: 5, hz: 8, dur: 0.18 });
  assert.deepEqual(SHAKE.combo10, { px: 4, hz: 7, dur: 0.22 });
  assert.deepEqual(SHAKE.warden, { px: 7, hz: 10, dur: 0.28 });
  assert.deepEqual(SHAKE.victory, { px: 6, hz: 5, dur: 0.5 });
  const s = new Shake();
  s.hit({ dur: 0.1, hz: 5, px: 2 });
  const a = s.offset(false, 0.02, 800);
  assert.ok(Math.abs(a.x) + Math.abs(a.y) > 0);
  for (let i = 0; i < 8; i++) s.offset(false, 0.02, 800);
  const done = s.offset(false, 0.02, 800);
  assert.equal(s._hits.length, 0);
  assert.equal(done.x, 0);
});

test("wide aspect pulls the follow camera farther than portrait", () => {
  const phone = cameraShot({ mode: "normal", aspect: 9 / 16, crowdZ: 0 });
  const desk = cameraShot({ mode: "normal", aspect: 16 / 9, crowdZ: 0 });
  assert.ok(desk.z < phone.z);
});
