import assert from "node:assert/strict";
import test from "node:test";
import {
  AnimatedElements,
  LIFE_PROFILES,
  MAX_CREATURES_ONSCREEN,
  MAX_LIFE_PARTICLES,
  MAX_TREES,
  MAX_WILDLIFE,
  ROADSIDE_AHEAD,
  ROADSIDE_BEHIND,
  lifeProfile,
  wrapAlongTrack,
} from "../game/EnvironmentalLife.js";

test("eleven life profiles cover trees, wildlife, and particle caps", () => {
  const ids = ["meadow", "dunes", "frost", "grove", "ember", "amber", "lagoon", "prism", "nightfen", "highwake", "crown"];
  for (const id of ids) {
    const p = lifeProfile(id);
    assert.ok(p.tree, id);
    assert.ok(p.trees <= MAX_TREES, id);
    assert.ok(p.wildN <= MAX_CREATURES_ONSCREEN, id);
    assert.ok(p.partN <= MAX_LIFE_PARTICLES, id);
  }
  assert.equal(LIFE_PROFILES.meadow.swayDeg, 2);
  assert.equal(LIFE_PROFILES.meadow.swaySec, 3);
  assert.equal(LIFE_PROFILES.dunes.tree, "palm");
  assert.equal(LIFE_PROFILES.dunes.swayDeg, 5);
  assert.equal(LIFE_PROFILES.frost.tree, "pine");
  assert.equal(LIFE_PROFILES.grove.water, "stream");
  assert.equal(LIFE_PROFILES.ember.tree, "dead");
  assert.equal(LIFE_PROFILES.lagoon.wildlife, "monkey");
  assert.equal(LIFE_PROFILES.lagoon.water, "lagoon");
  assert.equal(LIFE_PROFILES.prism.shimmer, true);
  assert.equal(LIFE_PROFILES.nightfen.birds, "bats");
  assert.equal(LIFE_PROFILES.nightfen.particles, "fireflies");
  assert.equal(MAX_WILDLIFE, 8);
});

test("AnimatedElements spawns instanced trees, wind, and capped particles", () => {
  const life = new AnimatedElements(null);
  assert.equal(life.createAnimatedTrees(20), MAX_TREES);
  assert.equal(life.treeMesh.count, MAX_TREES);
  assert.equal(life.createWildlife("rabbit", 40), MAX_WILDLIFE);
  life.setWorld("lagoon");
  assert.equal(life.profile.wildlife, "monkey");
  assert.equal(life.water.visible, true);
  assert.equal(life.setWindIntensity(2), 1);
  assert.equal(life.setWindIntensity(-1), 0);
  assert.equal(life.playWeatherSounds("storm"), "storm");
  const added = life.addParticleEffect("bubbles", { x: 0, y: 1, z: 0 }, 8);
  assert.ok(added >= 1 && added <= 8);
  life.setWorld("prism");
  assert.equal(life.profile.shimmer, true);
  life.tick(0.016, false, 80, 0);
  assert.ok(life.trees.every((t) => t.z > 80 - ROADSIDE_BEHIND && t.z < 80 + ROADSIDE_AHEAD));
  assert.equal(life.group.position.z, 0);
  assert.equal(wrapAlongTrack(0, 80), wrapAlongTrack(ROADSIDE_BEHIND + ROADSIDE_AHEAD, 80));
  life.dispose();
});
