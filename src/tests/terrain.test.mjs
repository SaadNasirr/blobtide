import assert from "node:assert/strict";
import test from "node:test";
import {
  LAYER_LIGHT,
  PARALLAX,
  PEAK_SCALE,
  TERRAIN_PROFILES,
  TerrainSystem,
  grayColor,
  peakGeometry,
  terrainProfile,
} from "../game/TerrainSystem.js";

test("eleven terrain profiles have peaks, near maps, and layer anims", () => {
  const ids = ["meadow", "dunes", "frost", "grove", "ember", "amber", "lagoon", "prism", "nightfen", "highwake", "crown"];
  for (const id of ids) {
    const p = terrainProfile(id);
    assert.ok(PEAK_SCALE[p.peak], `${id} peak`);
    assert.ok(p.near);
    assert.equal(p.anim.length, 4);
    assert.ok(p.farN >= 1 && p.farN <= 8);
  }
  assert.equal(TERRAIN_PROFILES.meadow.peak, "round");
  assert.equal(TERRAIN_PROFILES.dunes.peak, "dune");
  assert.equal(TERRAIN_PROFILES.frost.peak, "spike");
  assert.equal(TERRAIN_PROFILES.ember.near, "lava");
  assert.equal(TERRAIN_PROFILES.lagoon.near, "water");
  assert.equal(TERRAIN_PROFILES.crown.peak, "jagged");
  assert.equal(LAYER_LIGHT.far.castShadow, false);
  assert.equal(LAYER_LIGHT.mid.castShadow, true);
  assert.equal(LAYER_LIGHT.near.receiveShadow, true);
});

test("far mountains desaturate and extruded peaks reuse one geometry", () => {
  const g = grayColor(0x6a8a5a);
  assert.ok(Math.abs(g.r - g.g) < 1e-6);
  assert.ok(Math.abs(g.g - g.b) < 1e-6);
  const a = peakGeometry("round");
  const b = peakGeometry("round");
  assert.equal(a, b);
  assert.ok(peakGeometry("jagged") !== a);
});

test("TerrainSystem parallax, world swap, and layer animations", () => {
  const t = new TerrainSystem(null);
  t.setWorldTerrain("meadow");
  assert.equal(t.farMesh.castShadow, false);
  assert.equal(t.midMesh.castShadow, true);
  assert.equal(t.nearMesh.receiveShadow, true);
  const off = t.updateParallax(40, 3);
  assert.ok(Math.abs(off.far) < Math.abs(off.mid) + 0.2 || Math.abs(PARALLAX.far.x) < PARALLAX.mid.x);
  assert.ok(Math.abs(t.far.position.x) <= Math.abs(3 * PARALLAX.far.x) + PARALLAX.far.zAmp + 0.01);
  assert.equal(t.addAnimationToTerrain(1, "sway"), "sway");
  t.transitionTerrain("meadow", "dunes");
  assert.equal(t._fadeTo, null);
  assert.equal(t.worldId, "dunes");
  t.tick(1, true, 10, 0);
  assert.equal(t.worldId, "dunes");
  assert.equal(t.profile.peak, "dune");
  t.setWorldTerrain("crown");
  assert.equal(t.worldId, "crown");
  t.dispose();
});
