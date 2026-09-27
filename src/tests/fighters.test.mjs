import assert from "node:assert/strict";
import test from "node:test";
import { SEPOY_ANIM, SEPOY_HEAD_Y, SEPOY_HEIGHT, SEPOY_RANK_COLS, sepoyOffset, sepoyPose, WARDEN_ANIM, wardenClipDuration, wardenPose } from "../game/Fighters.js";
test("sepoy idle breathes two centimeters on a two-second cycle", () => {
  const a = sepoyPose({ mode: "idle", t: 0 });
  const b = sepoyPose({ mode: "idle", t: 0.5 });
  assert.equal(SEPOY_ANIM.breathAmp, 0.02);
  assert.equal(SEPOY_ANIM.breathPeriod, 2);
  assert.ok(Math.abs(a.legL.x) >= 0.07);
  assert.ok(b.y > a.y);
});

test("sepoy walk legs step opposite and slash lunges forward", () => {
  const w = sepoyPose({ mode: "walk", t: 0.25 });
  assert.ok(w.legL.rx * w.legR.rx <= 0.0001 || Math.abs(w.legL.z - w.legR.z) > 0.01);
  const s0 = sepoyPose({ mode: "slash", t: 0.05 });
  const s1 = sepoyPose({ mode: "slash", t: 0.28 });
  assert.ok(s0.sword.y > s1.sword.y - 0.05);
  assert.ok(s1.z > 0.02);
});

test("sepoy stagger leans back and death collapses forward", () => {
  const idle = sepoyPose({ mode: "idle", stagger: 0 });
  const hit = sepoyPose({ mode: "idle", stagger: 0.3 });
  assert.ok(hit.rx < idle.rx);
  const dead = sepoyPose({ mode: "death", t: 0.5 });
  assert.ok(dead.rx > 0.6);
  assert.ok(dead.scale < 0.2);
});

test("sepoys stand in ranks and are taller than the old toddler silhouette", () => {
  assert.equal(SEPOY_RANK_COLS, 4);
  assert.ok(SEPOY_HEIGHT >= 1.2);
  assert.ok(SEPOY_HEAD_Y >= 1);
  const a = sepoyOffset(0);
  const b = sepoyOffset(1);
  const c = sepoyOffset(4);
  assert.ok(b.x > a.x);
  assert.ok(c.z < a.z);
  assert.ok(Math.abs(a.z) < 0.05);
});

test("warden idle plants the sword and breathes five centimeters on a three-second cycle", () => {
  assert.equal(WARDEN_ANIM.breathAmp, 0.05);
  assert.equal(WARDEN_ANIM.breathPeriod, 3);
  const a = wardenPose({ mode: "idle", t: 0.75 });
  const b = wardenPose({ mode: "idle", t: 2.25 });
  assert.ok(a.chest > 0.04);
  assert.ok(b.chest < -0.04);
  assert.ok(a.armRx > 0.9);
  assert.ok(a.torsoRx < 0);
});

test("warden walk is slow with opposite legs and high guard", () => {
  assert.ok(WARDEN_ANIM.walkPeriod >= 1.2);
  const w = wardenPose({ mode: "walk", t: 0.3 });
  assert.ok(w.legL * w.legR <= 0);
  assert.ok(w.cleaverRz < -0.4);
  const step = wardenPose({ mode: "walk", t: 0.02 });
  assert.equal(step.step, true);
});

test("warden cleave spin slam match wind-up hit recovery", () => {
  assert.equal(wardenClipDuration("cleave"), 0.75);
  const wind = wardenPose({ mode: "cleave", t: 0.2 });
  const hit = wardenPose({ mode: "cleave", t: 0.42 });
  const rec = wardenPose({ mode: "cleave", t: 0.68 });
  assert.ok(wind.armRx < -0.8);
  assert.ok(hit.trail);
  assert.ok(hit.armRx > wind.armRx);
  assert.equal(rec.trail, false);
  assert.ok(rec.cleaverRz < hit.cleaverRz);
  const spin = wardenPose({ mode: "spin", t: 0.6 });
  assert.ok(Math.abs(spin.torsoRy - Math.PI) < 0.05);
  const spinHit = wardenPose({ mode: "spin", t: 0.85 });
  assert.equal(spinHit.trail, true);
  assert.equal(wardenClipDuration("spin"), 1);
  const slamUp = wardenPose({ mode: "slam", t: 0.3 });
  const slamHit = wardenPose({ mode: "slam", t: 0.52 });
  assert.ok(slamUp.armRx < -1);
  assert.equal(slamHit.shock, true);
  assert.equal(wardenClipDuration("slam"), 0.65);
});

test("warden stagger twists, victory raises the arm, defeat kneels and fades", () => {
  assert.equal(wardenClipDuration("stagger"), 0.2);
  const s = wardenPose({ mode: "stagger", t: 0.1 });
  assert.ok(Math.abs(s.torsoRy) > 0.1);
  const v = wardenPose({ mode: "victory", t: 0.4 });
  assert.ok(v.armRx < -1);
  assert.equal(wardenClipDuration("victory"), 2);
  const d = wardenPose({ mode: "defeat", t: 1 });
  assert.ok(d.legL > 0.7);
  assert.ok(d.fade < 0.05);
  assert.equal(wardenClipDuration("defeat"), 1);
});

