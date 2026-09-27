import assert from "node:assert/strict";
import test from "node:test";
import { SKY_PROFILES, SKY_RADIUS, SKY_IDEAL_RADIUS, STAR_COUNT, skyArcPosition, skyProfile } from "../game/BackdropPro.js";

const IDS = ["meadow", "dunes", "frost", "grove", "ember", "amber", "lagoon", "prism", "nightfen", "highwake", "crown"];

test("advanced sky profiles cover all eleven worlds", () => {
  assert.deepEqual(Object.keys(SKY_PROFILES).sort(), [...IDS].sort());
  assert.equal(SKY_PROFILES.meadow.base, "#87ceeb");
  assert.equal(SKY_PROFILES.dunes.base, "#ffb347");
  assert.equal(SKY_PROFILES.frost.base, "#b0e0e6");
  assert.equal(SKY_PROFILES.grove.base, "#90ee90");
  assert.equal(SKY_PROFILES.ember.base, "#ff6b35");
  assert.equal(SKY_PROFILES.amber.base, "#ffa500");
  assert.equal(SKY_PROFILES.lagoon.base, "#00d9ff");
  assert.equal(SKY_PROFILES.prism.base, "#a366ff");
  assert.equal(SKY_PROFILES.nightfen.base, "#1a0033");
  assert.equal(SKY_PROFILES.highwake.base, "#0099ff");
  assert.equal(SKY_PROFILES.crown.base, "#2a1f3d");
  assert.equal(SKY_PROFILES.nightfen.moon, true);
  assert.equal(SKY_PROFILES.nightfen.stars, true);
  assert.equal(SKY_PROFILES.crown.lightning, true);
  assert.equal(SKY_PROFILES.crown.stars, true);
  assert.equal(SKY_PROFILES.frost.aurora, "#7cffb0");
  assert.equal(SKY_PROFILES.prism.aurora, "rainbow");
  assert.equal(SKY_PROFILES.ember.ash, true);
  assert.equal(SKY_PROFILES.grove.mist, true);
});

test("sun arc rises from sunrise to noon then sets", () => {
  const dawn = skyArcPosition(0);
  const noon = skyArcPosition(0.5);
  const dusk = skyArcPosition(1);
  assert.ok(noon.y > dawn.y);
  assert.ok(noon.y > dusk.y);
  assert.ok(dawn.x > noon.x);
  assert.equal(skyProfile("missing").base, SKY_PROFILES.meadow.base);
  assert.ok(SKY_RADIUS < SKY_IDEAL_RADIUS);
  assert.ok(SKY_RADIUS <= 110);
  assert.ok(STAR_COUNT >= 1000);
});
