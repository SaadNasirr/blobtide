import * as THREE from "three";
import { isSharedGeo, sharedGeos } from "./gpu.js";

export const MAX_FAR_PEAKS = 8;
export const MAX_MID_PEAKS = 6;
export const MAX_PROPS = 8;
export const TERRAIN_FADE = 0.7;

export const PARALLAX = {
  far: { x: 0.045, zWave: 0.0035, zAmp: 0.32 },
  mid: { x: 0.13, zWave: 0.009, zAmp: 0.55 },
  near: { x: 0.28, zWave: 0.016, zAmp: 0.22 },
};

export const LAYER_LIGHT = {
  far: { castShadow: false, receiveShadow: false },
  mid: { castShadow: true, receiveShadow: false, soft: true },
  near: { castShadow: true, receiveShadow: true },
};

export const PEAK_SCALE = {
  round: { sx: 8.4, sy: 6.6, sz: 5.4 },
  dune: { sx: 10.5, sy: 3.1, sz: 7.2 },
  spike: { sx: 4.6, sy: 10.8, sz: 4.4 },
  jagged: { sx: 6.8, sy: 9.2, sz: 4.8 },
  crystal: { sx: 4.2, sy: 9.6, sz: 4.2 },
  cliff: { sx: 7.6, sy: 7.4, sz: 3.2 },
};

export const TERRAIN_PROFILES = {
  meadow: { peak: "round", near: "grass", farN: 8, midN: 6, props: "tree", anim: ["none", "sway", "none", "sway"] },
  dunes: { peak: "dune", near: "sand", farN: 6, midN: 4, props: "rock", anim: ["none", "none", "haze", "none"] },
  frost: { peak: "spike", near: "ice", farN: 8, midN: 6, props: "crystal", anim: ["none", "sparkle", "none", "sparkle"] },
  grove: { peak: "round", near: "moss", farN: 8, midN: 6, props: "vine", anim: ["none", "sway", "none", "pendulum"] },
  ember: { peak: "jagged", near: "lava", farN: 7, midN: 5, props: "rock", anim: ["none", "none", "lava", "none"], glow: 0xff4a18 },
  amber: { peak: "round", near: "gold", farN: 7, midN: 5, props: "tree", anim: ["none", "float", "none", "sway"], glow: 0xffb347 },
  lagoon: { peak: "round", near: "water", farN: 6, midN: 5, props: "rock", anim: ["none", "none", "ripple", "bob"] },
  prism: { peak: "crystal", near: "crystal", farN: 7, midN: 5, props: "crystal", anim: ["none", "sparkle", "shimmer", "bob"], glow: 0xc77dff },
  nightfen: { peak: "round", near: "bog", farN: 8, midN: 6, props: "vine", anim: ["none", "glow", "none", "pendulum"], glow: 0x2ee8c8 },
  highwake: { peak: "cliff", near: "stone", farN: 5, midN: 3, props: "rock", anim: ["none", "none", "none", "bob"] },
  crown: { peak: "jagged", near: "ash", farN: 8, midN: 6, props: "rock", anim: ["none", "none", "none", "none"], glow: 0xff3310 },
};

const _peaks = {};
const _maps = new Map();

export function terrainProfile(id) {
  return TERRAIN_PROFILES[id] || TERRAIN_PROFILES.meadow;
}

export function grayColor(hex) {
  const c = new THREE.Color(hex);
  const g = c.r * 0.3 + c.g * 0.54 + c.b * 0.16;
  return new THREE.Color(g, g, g);
}

function peakPath(kind) {
  if (kind === "dune") {
    return [
      [-1, 0],
      [-0.55, 0.22],
      [-0.1, 0.58],
      [0.35, 0.5],
      [0.8, 0.18],
      [1, 0],
    ];
  }
  if (kind === "spike" || kind === "crystal") {
    return [
      [-1, 0],
      [-0.62, 0.12],
      [-0.28, 0.78],
      [0, 1],
      [0.22, 0.7],
      [0.55, 0.2],
      [1, 0],
    ];
  }
  if (kind === "jagged" || kind === "cliff") {
    return [
      [-1, 0],
      [-0.72, 0.28],
      [-0.5, 0.18],
      [-0.22, 0.92],
      [0.05, 0.55],
      [0.28, 0.84],
      [0.58, 0.22],
      [0.82, 0.4],
      [1, 0],
    ];
  }
  return [
    [-1, 0],
    [-0.7, 0.16],
    [-0.42, 0.58],
    [-0.08, 0.92],
    [0.3, 0.62],
    [0.68, 0.22],
    [1, 0],
  ];
}

export function peakGeometry(kind) {
  const key = PEAK_SCALE[kind] ? kind : "round";
  if (_peaks[key]) return _peaks[key];
  const s = new THREE.Shape();
  const pts = peakPath(key);
  s.moveTo(pts[0][0], pts[0][1]);
  for (let i = 1; i < pts.length; i++) s.lineTo(pts[i][0], pts[i][1]);
  s.closePath();
  const geo = new THREE.ExtrudeGeometry(s, { depth: 0.4, bevelEnabled: false, curveSegments: 1, steps: 1 });
  geo.translate(0, 0, -0.2);
  _peaks[key] = geo;
  return geo;
}

function terrainMap(kind, a, b) {
  const key = `${kind}:${a}:${b}`;
  if (_maps.has(key)) return _maps.get(key);
  if (typeof document === "undefined") return null;
  const c = document.createElement("canvas");
  c.width = 128;
  c.height = 128;
  const g = c.getContext("2d");
  g.fillStyle = a;
  g.fillRect(0, 0, 128, 128);
  for (let i = 0; i < 48; i++) {
    g.fillStyle = i % 2 ? b : a;
    g.globalAlpha = 0.35 + (i % 5) * 0.08;
    g.beginPath();
    g.arc((i * 37) % 128, (i * 53) % 128, 6 + (i % 6) * 4, 0, Math.PI * 2);
    g.fill();
  }
  g.globalAlpha = 1;
  if (kind === "water" || kind === "lava") {
    g.strokeStyle = kind === "lava" ? "#ff8844" : "#a8e8ff";
    g.lineWidth = 3;
    for (let y = 8; y < 128; y += 14) {
      g.beginPath();
      g.moveTo(0, y);
      for (let x = 0; x <= 128; x += 16) g.lineTo(x, y + Math.sin(x * 0.12 + y) * 5);
      g.stroke();
    }
  }
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.wrapS = THREE.RepeatWrapping;
  t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(4, 2);
  t.needsUpdate = true;
  _maps.set(key, t);
  return t;
}

function cssHex(n) {
  return "#" + (n >>> 0).toString(16).padStart(6, "0");
}

export class TerrainSystem {
  constructor(parent) {
    this.group = new THREE.Group();
    this.group.name = "terrain";
    parent?.add(this.group);
    this.far = new THREE.Group();
    this.mid = new THREE.Group();
    this.near = new THREE.Group();
    this.group.add(this.far, this.mid, this.near);
    this._dummy = new THREE.Object3D();
    this.worldId = "meadow";
    this.profile = terrainProfile("meadow");
    this.layerAnims = ["none", "sway", "none", "sway"];
    this._clock = 0;
    this._fade = 1;
    this._fadeTo = null;
    this._playerZ = 0;
    this._playerX = 0;
    this._slotsFar = [];
    this._slotsMid = [];
    this._slotsProp = [];

    this.farMat = new THREE.MeshBasicMaterial({ color: 0x888888, fog: true });
    this.midMat = new THREE.MeshPhongMaterial({
      color: 0x5a7a4a,
      shininess: 12,
      specular: 0x334433,
      fog: true,
    });
    this.nearMat = new THREE.MeshBasicMaterial({
      color: 0x6db84a,
      fog: true,
      polygonOffset: true,
      polygonOffsetFactor: 1,
      polygonOffsetUnits: 1,
    });
    this.propMat = new THREE.MeshPhongMaterial({ color: 0x3a7d3f, shininess: 18, fog: true });

    const geo = sharedGeos();
    this._peakKind = "round";
    this.farMesh = new THREE.InstancedMesh(peakGeometry("round"), this.farMat, MAX_FAR_PEAKS);
    this.midMesh = new THREE.InstancedMesh(peakGeometry("round"), this.midMat, MAX_MID_PEAKS);
    this.propMesh = new THREE.InstancedMesh(geo.cone, this.propMat, MAX_PROPS);
    this.nearMesh = new THREE.Mesh(geo.haze, this.nearMat);
    this.nearMesh.rotation.x = -Math.PI / 2;
    this.nearMesh.position.set(0, -0.16, 38);
    this.nearMesh.scale.set(1.05, 1.4, 1);
    this.nearMesh.visible = false;

    this.farMesh.frustumCulled = false;
    this.midMesh.frustumCulled = false;
    this.propMesh.frustumCulled = false;
    this.farMesh.castShadow = LAYER_LIGHT.far.castShadow;
    this.farMesh.receiveShadow = LAYER_LIGHT.far.receiveShadow;
    this.midMesh.castShadow = LAYER_LIGHT.mid.castShadow;
    this.midMesh.receiveShadow = LAYER_LIGHT.mid.receiveShadow;
    this.nearMesh.castShadow = LAYER_LIGHT.near.castShadow;
    this.nearMesh.receiveShadow = LAYER_LIGHT.near.receiveShadow;

    this.far.add(this.farMesh);
    this.mid.add(this.midMesh, this.propMesh);
    this.near.add(this.nearMesh);

    this.setWorldTerrain("meadow");
  }

  _swapPeakGeo(kind) {
    const key = PEAK_SCALE[kind] ? kind : "round";
    if (this._peakKind === key) return;
    const geo = peakGeometry(key);
    this.farMesh.geometry = geo;
    this.midMesh.geometry = geo;
    this._peakKind = key;
  }

  setWorldTerrain(worldId) {
    const id = TERRAIN_PROFILES[worldId] ? worldId : "meadow";
    const p = terrainProfile(id);
    this.worldId = id;
    this.profile = p;
    this.layerAnims = p.anim.slice();
    this._swapPeakGeo(p.peak);
    this._layout(p);
    this._tint(id, p);
    this._fade = 1;
    this._fadeTo = null;
    this.group.visible = true;
    return p;
  }

  transitionTerrain(fromWorldId, toWorldId) {
    this.setWorldTerrain(toWorldId || fromWorldId);
    this._fadeTo = null;
    this._fade = 1;
    this._rising = false;
    return this.profile;
  }

  addAnimationToTerrain(layerIndex, animation) {
    const i = Math.max(0, Math.min(3, layerIndex | 0));
    this.layerAnims[i] = String(animation || "none");
    return this.layerAnims[i];
  }

  updateParallax(playerZ, playerX = 0) {
    this._playerZ = playerZ;
    this._playerX = playerX;
    this.group.position.z = 0;
    this.far.position.z = playerZ;
    this.far.position.x = playerX * PARALLAX.far.x + Math.sin(playerZ * PARALLAX.far.zWave) * PARALLAX.far.zAmp;
    this.mid.position.x = playerX * PARALLAX.mid.x * 0.35 + Math.sin(playerZ * PARALLAX.mid.zWave) * PARALLAX.mid.zAmp * 0.35;
    this.near.position.x = playerX * PARALLAX.near.x + Math.sin(playerZ * PARALLAX.near.zWave) * PARALLAX.near.zAmp;
    this.mid.position.z = 0;
    this.near.position.z = playerZ;
    this._recycleSlots(this._slotsMid, playerZ, 24, 72);
    this._recycleSlots(this._slotsProp, playerZ, 16, 52);
    return { far: this.far.position.x, mid: this.mid.position.x, near: this.near.position.x };
  }

  _recycleSlots(slots, playerZ, behind, ahead) {
    const span = behind + ahead;
    for (const s of slots) {
      while (s.z < playerZ - behind) s.z += span;
      while (s.z > playerZ + ahead) s.z -= span;
    }
  }

  _layout(p) {
    const scale = PEAK_SCALE[p.peak] || PEAK_SCALE.round;
    const farN = Math.max(1, Math.min(MAX_FAR_PEAKS, p.farN));
    const midN = Math.max(1, Math.min(MAX_MID_PEAKS, p.midN));
    const propN = p.props === "none" ? 0 : MAX_PROPS;
    this.farMesh.count = farN;
    this.midMesh.count = midN;
    this.propMesh.count = propN;
    this._slotsFar = [];
    this._slotsMid = [];
    this._slotsProp = [];
    const xs = [-28, -22, -16, -10, 10, 16, 22, 28];
    for (let i = 0; i < farN; i++) {
      const side = i < farN / 2 ? -1 : 1;
      const slot = {
        x: xs[i] ?? side * (12 + i * 4),
        y: 0,
        z: 50 + (i % 3) * 5,
        sx: scale.sx * (0.85 + (i % 4) * 0.08),
        sy: scale.sy * (0.9 + (i % 3) * 0.12),
        sz: scale.sz,
        yaw: (i % 2 ? -0.08 : 0.08),
      };
      this._slotsFar.push(slot);
    }
    for (let i = 0; i < midN; i++) {
      const side = i % 2 ? 1 : -1;
      const slot = {
        x: side * (11.5 + (i % 3) * 2.4),
        y: 0,
        z: 18 + (i / Math.max(1, midN)) * 48,
        sx: scale.sx * 0.42 * (0.8 + (i % 3) * 0.1),
        sy: scale.sy * 0.48 * (0.85 + (i % 2) * 0.15),
        sz: scale.sz * 0.55,
        yaw: side * 0.12,
      };
      this._slotsMid.push(slot);
    }
    for (let i = 0; i < propN; i++) {
      const side = i % 2 ? 1 : -1;
      const tree = p.props === "tree" || p.props === "vine";
      this._slotsProp.push({
        x: side * (10.8 + (i % 4) * 1.15),
        y: tree ? 1.1 : 0.45,
        z: 10 + (i / Math.max(1, propN)) * 44,
        sx: tree ? 0.55 + (i % 3) * 0.12 : 0.7,
        sy: tree ? 1.4 + (i % 3) * 0.25 : 0.45,
        sz: tree ? 0.55 : 0.7,
        yaw: 0,
      });
    }
    this._write(this.farMesh, this._slotsFar, 0);
    this._write(this.midMesh, this._slotsMid, 0);
    this._write(this.propMesh, this._slotsProp, 0);
  }

  _tint(id, p) {
    const worldFar = {
      meadow: 0x6a8a5a,
      dunes: 0xc4a068,
      frost: 0xb8d8e8,
      grove: 0x3a6a3a,
      ember: 0x6a3020,
      amber: 0xc48840,
      lagoon: 0x4a8a78,
      prism: 0x8878b0,
      nightfen: 0x1a1430,
      highwake: 0x6a8898,
      crown: 0x120e18,
    }[id] || 0x6a8a5a;
    const worldMid = {
      meadow: 0x5a7a4a,
      dunes: 0xb89058,
      frost: 0x8ab8d0,
      grove: 0x2a5a32,
      ember: 0x8a3820,
      amber: 0xd4a050,
      lagoon: 0x3a9a88,
      prism: 0xa88ad0,
      nightfen: 0x2a1850,
      highwake: 0x5a7a88,
      crown: 0x1a141c,
    }[id] || 0x5a7a4a;
    this.farMat.color.copy(grayColor(worldFar));
    this.midMat.color.setHex(worldMid);
    if (p.glow) {
      this.midMat.emissive = new THREE.Color(p.glow);
      this.midMat.emissiveIntensity = 0.18;
      this.propMat.emissive = new THREE.Color(p.glow);
      this.propMat.emissiveIntensity = 0.12;
    } else {
      this.midMat.emissive = new THREE.Color(0x000000);
      this.midMat.emissiveIntensity = 0;
      this.propMat.emissive = new THREE.Color(0x000000);
      this.propMat.emissiveIntensity = 0;
    }
    const nearCol = {
      grass: 0x6db84a,
      sand: 0xe0c080,
      ice: 0xc8e8f8,
      moss: 0x3a8a48,
      lava: 0xff6b35,
      gold: 0xe09a16,
      water: 0x2ec8d4,
      crystal: 0xc77dff,
      bog: 0x2a4a38,
      stone: 0x8aa8b8,
      ash: 0x3a3238,
    }[p.near] || 0x6db84a;
    this.nearMat.color.setHex(nearCol);
    const map = terrainMap(p.near, cssHex(nearCol), cssHex(worldMid));
    if (map) this.nearMat.map = map;
    this.propMat.color.setHex(p.props === "tree" || p.props === "vine" ? 0x3a7d3f : p.props === "crystal" ? 0xb8e8ff : 0x8a8a78);
    this.propMesh.visible = this.propMesh.count > 0;
  }

  _write(mesh, slots, t) {
    const layer = mesh === this.farMesh ? 0 : mesh === this.midMesh ? 1 : 3;
    const anim = this.layerAnims[layer] || "none";
    for (let i = 0; i < slots.length; i++) {
      const s = slots[i];
      let y = s.y;
      let yaw = s.yaw;
      let sy = s.sy;
      let roll = 0;
      if (anim === "sway") yaw += Math.sin(t * 1.1 + i) * 0.045;
      else if (anim === "float" || anim === "bob") y += Math.sin(t * 1.4 + i) * 0.22;
      else if (anim === "pendulum") roll = Math.sin(t * 1.6 + i) * 0.12;
      else if (anim === "sparkle" || anim === "glow") sy *= 1 + Math.sin(t * 2.4 + i) * 0.03;
      this._dummy.position.set(s.x, y, s.z);
      this._dummy.rotation.set(0, yaw, roll);
      this._dummy.scale.set(s.sx, sy, s.sz);
      this._dummy.updateMatrix();
      mesh.setMatrixAt(i, this._dummy.matrix);
    }
    mesh.instanceMatrix.needsUpdate = true;
  }

  tick(dt, reduceMotion = false, playerZ, playerX = 0) {
    this._clock += dt;
    if (playerZ != null) this.updateParallax(playerZ, playerX);
    this._fade = 1;
    this._fadeTo = null;
    if (!reduceMotion) {
      this._write(this.farMesh, this._slotsFar, this._clock);
      this._write(this.midMesh, this._slotsMid, this._clock);
      this._write(this.propMesh, this._slotsProp, this._clock);
    }
  }

  dispose() {
    this.group.removeFromParent();
    for (const m of [this.farMat, this.midMat, this.nearMat, this.propMat]) m.dispose?.();
  }
}
