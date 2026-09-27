import assert from "node:assert/strict";
import test from "node:test";
import { BOSS_FIGHT, COMBO_SFX, FEEL, GATE_SFX, HAZARD_SFX, MAX_AUDIO_SOURCES, MUSIC_BOSS_MUL, MUSIC_GAIN, SHAKE, WORLD_BOSS_DUCK, PIT_HAZARD, Sfx, geyserLoss, hazardPitch, holeLoss, nearestHazards, trackForWorld } from "../game/Juice.js";
test("world ambient tracks match bpm and meadow/dunes/crown", () => {
  assert.equal(trackForWorld("meadow").bpm, 90);
  assert.equal(trackForWorld("dunes").bpm, 100);
  assert.equal(trackForWorld("frost").bpm, 100);
  assert.equal(trackForWorld("grove").bpm, 105);
  assert.equal(trackForWorld("ember").bpm, 110);
  assert.equal(trackForWorld("crown").bpm, 80);
  assert.ok(Math.abs(MUSIC_GAIN - 0.3162) < 0.001);
  assert.ok(Math.abs(WORLD_BOSS_DUCK - 0.7079) < 0.001);
  assert.ok(MUSIC_BOSS_MUL > 1);
});

test("warden fight bed is faster and louder than world ambient", () => {
  assert.ok(BOSS_FIGHT.bpm >= 110 && BOSS_FIGHT.bpm <= 120);
  assert.equal(BOSS_FIGHT.slow, 0.5);
  assert.ok(MUSIC_BOSS_MUL > 1);
});

test("feel table maps slam and sepoy hits without extra shake keys breaking specs", () => {
  assert.deepEqual(SHAKE.hazard, { px: 5, hz: 8, dur: 0.18 });
  assert.equal(FEEL.slam.shake, SHAKE.slam);
  assert.equal(FEEL.warden.shake, SHAKE.warden);
  assert.ok(FEEL.sepoy.n <= 10);
  assert.ok(FEEL.saw.n <= 12);
});

test("warden spin and slam have dedicated whoosh and boom cues", () => {
  assert.equal(typeof Sfx.prototype.wardenSpin, "function");
  assert.equal(typeof Sfx.prototype.wardenSlam, "function");
  assert.equal(typeof Sfx.prototype.growl, "function");
  assert.equal(typeof Sfx.prototype.sandStart, "function");
  assert.equal(typeof Sfx.prototype.sandStop, "function");
  assert.equal(typeof Sfx.prototype.sandBite, "function");
  assert.equal(typeof Sfx.prototype.relief, "function");
});

test("gate tones match add/mul/sub/div specs", () => {
  assert.equal(GATE_SFX.add.from, 440);
  assert.equal(GATE_SFX.add.to, 554);
  assert.equal(GATE_SFX.add.dur, 0.3);
  assert.equal(GATE_SFX.mul.freq, 880);
  assert.equal(GATE_SFX.mul.dur, 0.25);
  assert.equal(GATE_SFX.sub.from, 440);
  assert.equal(GATE_SFX.sub.to, 220);
  assert.equal(GATE_SFX.sub.dur, 0.4);
  assert.equal(GATE_SFX.div.dur, 0.4);
  assert.ok(GATE_SFX.add.gain > GATE_SFX.mul.gain);
  assert.ok(GATE_SFX.mul.gain > GATE_SFX.sub.gain);
});

test("combo milestone notes are C then C+E then C-E-G", () => {
  assert.deepEqual(COMBO_SFX[5].notes, [440]);
  assert.equal(COMBO_SFX[5].dur, 0.1);
  assert.deepEqual(COMBO_SFX[10].notes, [440, 554]);
  assert.equal(COMBO_SFX[10].dur, 0.2);
  assert.deepEqual(COMBO_SFX[20].notes, [440, 554, 659]);
  assert.equal(COMBO_SFX[20].dur, 0.3);
});

test("rotating hazards cap at six voices and pitch up with speed", () => {
  assert.equal(HAZARD_SFX.maxVoices, 6);
  assert.equal(MAX_AUDIO_SOURCES, 8);
  assert.ok(Math.abs(HAZARD_SFX.sawGain - 0.0708) < 0.002);
  assert.ok(HAZARD_SFX.spinnerGain > HAZARD_SFX.sawGain);
  assert.ok(hazardPitch("saw", 12) > hazardPitch("saw", 6));
  assert.ok(hazardPitch("spinner", 8) < hazardPitch("saw", 8));
  const far = Array.from({ length: 10 }, (_, i) => ({ id: i, dist: 20 - i, alive: true }));
  const pick = nearestHazards(far, 6);
  assert.equal(pick.length, 6);
  assert.ok(pick[0].dist < pick[5].dist);
  assert.equal(typeof Sfx.prototype.syncHazards, "function");
});

test("pit rumble is 80Hz and drops as the crowd nears", () => {
  assert.equal(HAZARD_SFX.holeHz, 80);
  assert.equal(PIT_HAZARD.rumbleHz, 80);
  assert.ok(hazardPitch("hole", 8, 1) < hazardPitch("hole", 8, 12));
  assert.ok(Math.abs(HAZARD_SFX.geyserColdGain - 0.05) < 0.002);
  assert.equal(holeLoss(20), 6);
  assert.equal(geyserLoss(20), 2);
  assert.equal(PIT_HAZARD.geyserPeriod, 3);
  assert.equal(typeof Sfx.prototype.pitCrack, "function");
  assert.equal(typeof Sfx.prototype.geyserErupt, "function");
});
