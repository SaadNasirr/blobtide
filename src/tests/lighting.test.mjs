import assert from "node:assert/strict";
import test from "node:test";
import {
  LIGHT_PROFILES,
  LightingSystem,
  MAX_POINT_LIGHTS,
  SHADOW_MAP_IDEAL,
  lightProfile,
  shadowMapSize,
  sunDayColor,
  sunDayIntensity,
} from "../game/AdvancedLighting.js";

test("eleven lighting profiles match world mood", () => {
  const ids = ["meadow", "dunes", "frost", "grove", "ember", "amber", "lagoon", "prism", "nightfen", "highwake", "crown"];
  for (const id of ids) assert.ok(LIGHT_PROFILES[id], id);
  assert.equal(lightProfile("meadow").dir, 0xffff99);
  assert.equal(lightProfile("meadow").dirInt, 0.9);
  assert.equal(lightProfile("dunes").dirInt, 1);
  assert.equal(lightProfile("frost").dir, 0xe8f4f8);
  assert.equal(lightProfile("ember").dir, 0xff6b35);
  assert.equal(lightProfile("ember").bloom, 0.9);
  assert.equal(lightProfile("amber").dir, 0xffb366);
  assert.equal(lightProfile("lagoon").dir, 0x66ffff);
  assert.equal(lightProfile("prism").bloom, 1);
  assert.equal(lightProfile("prism").chromatic, 0.04);
  assert.equal(lightProfile("nightfen").dirInt, 0.3);
  assert.equal(lightProfile("nightfen").moon, true);
  assert.equal(lightProfile("highwake").dirInt, 0.95);
  assert.equal(lightProfile("crown").dirInt, 0.4);
  assert.equal(lightProfile("crown").vignette, 0.5);
  assert.equal(lightProfile("lagoon").vignette, 0.15);
  assert.equal(MAX_POINT_LIGHTS, 3);
  assert.equal(SHADOW_MAP_IDEAL, 2048);
});

test("sun intensity is 0.3 at dawn/dusk and 1 at noon", () => {
  assert.ok(Math.abs(sunDayIntensity(0) - 0.3) < 1e-6);
  assert.ok(Math.abs(sunDayIntensity(1) - 0.3) < 1e-6);
  assert.ok(Math.abs(sunDayIntensity(0.5) - 1) < 1e-6);
  const dawn = sunDayColor(0.05);
  const noon = sunDayColor(0.5);
  const dusk = sunDayColor(0.8);
  assert.ok(dawn.r > noon.b);
  assert.ok(dusk.r > dusk.b);
});

test("shadow maps stay off on mobile and 2048 on desktop", () => {
  assert.equal(shadowMapSize({ mobile: true }), 0);
  assert.equal(shadowMapSize({ mobile: false }), 2048);
});

test("LightingSystem world swap, bloom, grade, and time of day", () => {
  const light = new LightingSystem({ mobile: true });
  light.updateLightingForWorld("ember");
  assert.equal(light.worldId, "ember");
  assert.equal(light.points.filter((p) => p.visible).length, 1);
  assert.equal(light.setBloomIntensity(0.9), 0.9);
  assert.equal(light.setColorGrade(0.2), 0.2);
  light.enableEffect("rays", 0);
  assert.equal(light.rayGroup.visible, false);
  const noon = light.updateLightingForTimeOfDay(0.5);
  assert.equal(noon.time, 0.5);
  light.updateLightingForWorld("nightfen");
  assert.equal(light.profile.moon, true);
  light.updateLightingForWorld("prism");
  assert.ok(light.chromatic === 0);
  light.dispose();
});
