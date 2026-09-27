import assert from "node:assert/strict";
import test from "node:test";
import { LEVELS, simulatePlay } from "../content/levels.js";
import { WORLDS, worldForLevel, fogRange, levelFog, sunPosition } from "../content/themes.js";

test("eleven reusable worlds cover levels 1-56 without gaps", () => {
  assert.equal(WORLDS.length, 11);
  assert.equal(WORLDS[0].from, 1);
  assert.equal(WORLDS.at(-1).to, 56);
  for (let i = 1; i < WORLDS.length; i++) {
    assert.equal(WORLDS[i].from, WORLDS[i - 1].to + 1);
  }
  for (let id = 1; id <= 56; id++) {
    const w = worldForLevel(id);
    assert.ok(w.id && w.sky.length >= 3);
    assert.ok(w.fog && w.grassA && w.decor);
  }
  const crown = worldForLevel(51);
  assert.equal(crown.id, "crown");
  assert.equal(crown.storm, true);
  assert.equal(crown.sky[1], "#2a1f3d");
  assert.equal(crown.fogNear, 14);
  assert.equal(crown.decor, "dead");
  assert.equal(crown.caps, false);
  assert.equal(crown.stormChance, 0.4);
  assert.equal(worldForLevel(56).id, "crown");
  const meadow = worldForLevel(1);
  assert.equal(meadow.storm, undefined);
  assert.equal(meadow.fogDensity, 0.5);
  assert.equal(meadow.fogNear, 46);
  assert.equal(meadow.pine, 0x3a7d3f);
  assert.equal(meadow.bg, 0x87ceeb);
  const dunes = worldForLevel(10);
  assert.equal(dunes.id, "dunes");
  assert.equal(dunes.bg, 0xffb347);
  assert.equal(dunes.pine, 0xa8c562);
  assert.equal(dunes.key, 0xff9a40);
  const crown55 = worldForLevel(55);
  assert.equal(crown55.id, "crown");
  assert.equal(crown55.fogDensity, 2);
  assert.equal(crown55.rock, 0x4a4a4a);
  assert.ok(crown55.rockEi > 0.15);
  assert.notEqual(worldForLevel(50).id, "crown");
});

test("fog thickens along the campaign and sun rides a sunrise-sunset arc", () => {
  const dens = WORLDS.map((w) => w.fogDensity);
  for (let i = 1; i < dens.length; i++) {
    assert.ok(dens[i] >= dens[i - 1] - 0.001, `${WORLDS[i].id} fog`);
  }
  assert.equal(fogRange(0.5).near, 46);
  assert.equal(fogRange(2).near, 14);
  const early = levelFog(worldForLevel(51), 51);
  const late = levelFog(worldForLevel(56), 56);
  assert.ok(late.near < early.near);
  const dawn = sunPosition(0.12);
  const noon = sunPosition(0.5);
  const dusk = sunPosition(0.88);
  assert.ok(noon.y > dawn.y && noon.y > dusk.y);
  assert.ok(dawn.x > dusk.x);
});

test("every campaign level carries its world palette", () => {
  assert.equal(LEVELS.length, 56);
  const ids = new Set();
  for (const level of LEVELS) {
    const world = worldForLevel(level.id);
    assert.equal(level.worldId, world.id, `level ${level.id}`);
    assert.equal(level.worldName, world.name);
    assert.ok(level.laneLimit >= 2.5 && level.laneLimit <= 3.5);
    ids.add(level.worldId);
  }
  assert.equal(ids.size, 11);
});

test("generated layouts stay unique and fair", () => {
  const sigs = new Set();
  for (const level of LEVELS) {
    const sig = level.pieces.map((p) => `${p.type}:${p.op || ""}:${p.x || 0}:${p.count || p.hp || 0}`).join("|");
    assert.ok(!sigs.has(sig), `duplicate layout at ${level.id}`);
    sigs.add(sig);
    const play = simulatePlay(level);
    assert.ok(play.ok, `level ${level.id} ${play.at || "door"}`);
    const types = level.pieces.map((p) => p.type);
    assert.ok(types.includes("coin"));
    assert.ok(types.includes("finish"));
    const zs = level.pieces.map((p) => p.z);
    assert.ok(zs.at(-1) - zs[0] > 80);
  }
});
