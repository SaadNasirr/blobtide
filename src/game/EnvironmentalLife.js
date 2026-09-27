import * as THREE from "three";
import { mergeGeometries } from "three/addons/utils/BufferGeometryUtils.js";
import { isSharedGeo, sharedGeos } from "./gpu.js";

export const MAX_TREES = 16;
export const MAX_BIRDS = 12;
export const MAX_WILDLIFE = 8;
export const MAX_LIFE_PARTICLES = 240;
export const MAX_CREATURES_ONSCREEN = 8;
export const ROADSIDE_BEHIND = 18;
export const ROADSIDE_AHEAD = 54;

export function wrapAlongTrack(z, crowdZ, behind = ROADSIDE_BEHIND, ahead = ROADSIDE_AHEAD) {
  const span = behind + ahead;
  let out = Number(z) || 0;
  const origin = Number(crowdZ) || 0;
  while (out < origin - behind) out += span;
  while (out > origin + ahead) out -= span;
  return out;
}

export const LIFE_PROFILES = {
  meadow: {
    tree: "meadow",
    trees: 14,
    swayDeg: 2,
    swaySec: 3,
    birds: "flock",
    birdN: 8,
    wildlife: "rabbit",
    wildN: 3,
    particles: "pollen",
    partN: 40,
    water: null,
    wind: 0.28,
  },
  dunes: {
    tree: "palm",
    trees: 10,
    swayDeg: 5,
    swaySec: 2,
    birds: null,
    birdN: 0,
    wildlife: "lizard",
    wildN: 2,
    particles: "dust",
    partN: 70,
    water: null,
    wind: 0.72,
  },
  frost: {
    tree: "pine",
    trees: 12,
    swayDeg: 1.2,
    swaySec: 4.2,
    birds: "flock",
    birdN: 5,
    wildlife: null,
    wildN: 0,
    particles: "snow",
    partN: 50,
    water: null,
    wind: 0.22,
  },
  grove: {
    tree: "grove",
    trees: 16,
    swayDeg: 3,
    swaySec: 2.5,
    birds: "flock",
    birdN: 6,
    wildlife: "deer",
    wildN: 2,
    particles: "leaves",
    partN: 32,
    water: "stream",
    wind: 0.4,
  },
  ember: {
    tree: "dead",
    trees: 10,
    swayDeg: 3.5,
    swaySec: 3.4,
    birds: null,
    birdN: 0,
    wildlife: null,
    wildN: 0,
    particles: "embers",
    partN: 48,
    water: null,
    wind: 0.5,
  },
  amber: {
    tree: "meadow",
    trees: 12,
    swayDeg: 2.4,
    swaySec: 2.8,
    birds: "flock",
    birdN: 5,
    wildlife: "deer",
    wildN: 1,
    particles: "pollen",
    partN: 28,
    water: null,
    wind: 0.32,
  },
  lagoon: {
    tree: "palm",
    trees: 12,
    swayDeg: 4,
    swaySec: 2.2,
    birds: "tropical",
    birdN: 4,
    wildlife: "monkey",
    wildN: 3,
    particles: "bubbles",
    partN: 16,
    water: "lagoon",
    wind: 0.55,
  },
  prism: {
    tree: "crystal",
    trees: 10,
    swayDeg: 0,
    swaySec: 4,
    birds: null,
    birdN: 0,
    wildlife: null,
    wildN: 0,
    particles: "pollen",
    partN: 24,
    water: null,
    wind: 0.18,
    shimmer: true,
  },
  nightfen: {
    tree: "twisted",
    trees: 12,
    swayDeg: 2.6,
    swaySec: 4,
    birds: "bats",
    birdN: 10,
    wildlife: null,
    wildN: 0,
    particles: "fireflies",
    partN: 24,
    water: "swamp",
    wind: 0.35,
  },
  highwake: {
    tree: "pine",
    trees: 6,
    swayDeg: 3.2,
    swaySec: 2.4,
    birds: "flock",
    birdN: 6,
    wildlife: null,
    wildN: 0,
    particles: "pollen",
    partN: 18,
    water: null,
    wind: 0.48,
  },
  crown: {
    tree: "dead",
    trees: 8,
    swayDeg: 4.5,
    swaySec: 1.8,
    birds: null,
    birdN: 0,
    wildlife: null,
    wildN: 0,
    particles: "embers",
    partN: 20,
    water: null,
    wind: 1,
  },
};

const TREE_TINT = {
  meadow: 0x3a7d3f,
  palm: 0x4a9a48,
  pine: 0xe8f4ff,
  grove: 0x2a6a32,
  dead: 0x3a2420,
  crystal: 0xb8e8ff,
  twisted: 0x1a3a32,
};

const PART_COLOR = {
  pollen: 0xffd27a,
  dust: 0xffcc99,
  leaves: 0xc45a28,
  embers: 0xff6b35,
  fireflies: 0x7fff00,
  bubbles: 0xc8f0ff,
  snow: 0xf4f8ff,
  rain: 0xa8c8e8,
};

const _treeGeos = {};
let _waterMap = null;
const _pt = new THREE.Vector3();

export function lifeProfile(id) {
  return LIFE_PROFILES[id] || LIFE_PROFILES.meadow;
}

function treeGeo(kind) {
  if (_treeGeos[kind]) return _treeGeos[kind];
  const trunkH = kind === "palm" ? 1.4 : kind === "pine" ? 0.55 : 0.7;
  const trunkR = kind === "dead" || kind === "twisted" ? 0.09 : 0.11;
  const trunk = new THREE.CylinderGeometry(trunkR * 0.7, trunkR, trunkH, 5);
  trunk.translate(0, trunkH * 0.5, 0);
  const canopy = new THREE.ConeGeometry(
    kind === "palm" ? 0.72 : kind === "pine" ? 0.42 : kind === "crystal" ? 0.38 : 0.55,
    kind === "pine" ? 1.6 : kind === "palm" ? 0.7 : 1.15,
    kind === "crystal" ? 5 : 6
  );
  canopy.translate(0, trunkH + (kind === "pine" ? 0.75 : 0.5), 0);
  if (kind === "twisted" || kind === "dead") canopy.rotateZ(kind === "twisted" ? 0.28 : -0.18);
  const geo = mergeGeometries([trunk, canopy], false);
  _treeGeos[kind] = geo;
  return geo;
}

function waterMap() {
  if (_waterMap) return _waterMap;
  if (typeof document === "undefined") return null;
  const c = document.createElement("canvas");
  c.width = 64;
  c.height = 64;
  const g = c.getContext("2d");
  g.fillStyle = "#2a8aaa";
  g.fillRect(0, 0, 64, 64);
  g.strokeStyle = "rgba(255,255,255,0.35)";
  g.lineWidth = 2;
  for (let y = 6; y < 64; y += 10) {
    g.beginPath();
    g.moveTo(0, y);
    for (let x = 0; x <= 64; x += 8) g.lineTo(x, y + Math.sin(x * 0.4) * 3);
    g.stroke();
  }
  _waterMap = new THREE.CanvasTexture(c);
  _waterMap.wrapS = THREE.RepeatWrapping;
  _waterMap.wrapT = THREE.RepeatWrapping;
  _waterMap.repeat.set(6, 2);
  _waterMap.needsUpdate = true;
  return _waterMap;
}

function birdCurve() {
  return new THREE.CatmullRomCurve3(
    [
      new THREE.Vector3(-18, 10, 2),
      new THREE.Vector3(-8, 12.5, 14),
      new THREE.Vector3(6, 11, 22),
      new THREE.Vector3(16, 13, 10),
      new THREE.Vector3(4, 10.5, -2),
      new THREE.Vector3(-10, 11.5, 6),
    ],
    true,
    "catmullrom",
    0.35
  );
}

export class AnimatedElements {
  constructor(parent) {
    this.group = new THREE.Group();
    this.group.name = "life";
    parent?.add(this.group);
    const geo = sharedGeos();
    this._dummy = new THREE.Object3D();
    this.worldId = "meadow";
    this.profile = lifeProfile("meadow");
    this.wind = 0.28;
    this._clock = 0;
    this._tickDt = 0.016;
    this.weatherSound = "sunny";
    this.birdPan = 0;
    this._curve = birdCurve();
    this.trees = [];
    this.birds = [];
    this.wildlife = [];

    this.treeMat = new THREE.MeshLambertMaterial({ color: 0x3a7d3f });
    this.treeMesh = new THREE.InstancedMesh(treeGeo("meadow"), this.treeMat, MAX_TREES);
    this.treeMesh.frustumCulled = false;
    this.treeMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    this.group.add(this.treeMesh);

    this.birdMat = new THREE.MeshLambertMaterial({ color: 0x243040 });
    this.wingMat = new THREE.MeshLambertMaterial({ color: 0xf4f0e8 });
    this.birdMesh = new THREE.InstancedMesh(geo.bird, this.birdMat, MAX_BIRDS);
    this.wingMesh = new THREE.InstancedMesh(geo.wing, this.wingMat, MAX_BIRDS);
    this.birdMesh.frustumCulled = false;
    this.wingMesh.frustumCulled = false;
    this.group.add(this.birdMesh, this.wingMesh);

    this.wildMat = new THREE.MeshLambertMaterial({ color: 0xc8a070 });
    this.wildMesh = new THREE.InstancedMesh(geo.critter, this.wildMat, MAX_WILDLIFE);
    this.wildMesh.frustumCulled = false;
    this.group.add(this.wildMesh);

    const pos = new Float32Array(MAX_LIFE_PARTICLES * 3);
    this._partKind = new Uint8Array(MAX_LIFE_PARTICLES);
    this._partLife = new Float32Array(MAX_LIFE_PARTICLES);
    this._partGeo = new THREE.BufferGeometry();
    this._partGeo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    this.partMat = new THREE.PointsMaterial({
      color: 0xffd27a,
      size: 0.14,
      sizeAttenuation: true,
      transparent: true,
      opacity: 0.65,
      depthWrite: false,
      fog: true,
    });
    this.partMesh = new THREE.Points(this._partGeo, this.partMat);
    this.partMesh.frustumCulled = false;
    this.group.add(this.partMesh);

    this.waterMat = new THREE.MeshBasicMaterial({
      color: 0x2ec8d4,
      map: waterMap(),
      transparent: true,
      opacity: 0.42,
      depthWrite: false,
    });
    this.water = new THREE.Mesh(geo.haze, this.waterMat);
    this.water.rotation.x = -Math.PI / 2;
    this.water.position.set(0, 0.04, 26);
    this.water.scale.set(0.55, 1.1, 1);
    this.water.visible = false;
    this.group.add(this.water);

    this._treeKind = "meadow";
    this.setWorld("meadow");
  }

  setWorld(id) {
    const p = lifeProfile(id);
    this.worldId = LIFE_PROFILES[id] ? id : "meadow";
    this.profile = p;
    this.wind = p.wind;
    this._clock = 0;
    if (p.tree !== this._treeKind) {
      this.treeMesh.geometry = treeGeo(p.tree);
      this._treeKind = p.tree;
    }
    this.treeMat.color.setHex(TREE_TINT[p.tree] || TREE_TINT.meadow);
    this.treeMat.emissive = new THREE.Color(p.tree === "crystal" ? 0x88a0ff : p.tree === "twisted" ? 0x2ee8c8 : p.tree === "dead" ? 0xff4a18 : 0x000000);
    this.treeMat.emissiveIntensity = p.tree === "crystal" || p.tree === "twisted" ? 0.28 : p.tree === "dead" ? 0.12 : 0;
    this.createAnimatedTrees(p.trees);
    if (p.birds) this._spawnBirds(p.birds, p.birdN);
    else {
      this.birds = [];
      this.birdMesh.count = 0;
      this.wingMesh.count = 0;
      this.birdMesh.visible = false;
      this.wingMesh.visible = false;
    }
    if (p.wildlife) this.createWildlife(p.wildlife, p.wildN);
    else {
      this.wildlife = [];
      this.wildMesh.count = 0;
      this.wildMesh.visible = false;
    }
    this._fillParticles(p.particles, p.partN);
    this._tintWater(p.water);
    this.birdMat.color.setHex(p.birds === "bats" ? 0x1a1028 : p.birds === "tropical" ? 0xe85a3a : 0x243040);
    this.wingMat.color.setHex(p.birds === "tropical" ? 0xffc14a : p.birds === "bats" ? 0x2a1838 : 0xf4f0e8);
    this.wildMat.color.setHex(p.wildlife === "lizard" ? 0x6a9a48 : p.wildlife === "deer" ? 0x8a6038 : p.wildlife === "monkey" ? 0x6a4a32 : 0xc8a070);
    return p;
  }

  createAnimatedTrees(count, positions) {
    const n = Math.max(0, Math.min(MAX_TREES, count | 0));
    this.trees = [];
    const pts = positions && positions.length ? positions : null;
    for (let i = 0; i < n; i++) {
      const side = i % 2 ? 1 : -1;
      const pos = pts?.[i] || {
        x: side * (7.8 + (i % 5) * 1.35 + (i % 3) * 0.2),
        y: 0,
        z: 8 + (i / Math.max(1, n)) * (ROADSIDE_BEHIND + ROADSIDE_AHEAD),
      };
      this.trees.push({
        x: pos.x,
        y: pos.y || 0,
        z: pos.z,
        phase: i * 0.73,
        sx: 0.85 + (i % 4) * 0.12,
        sy: 0.9 + (i % 3) * 0.15,
      });
    }
    this.treeMesh.count = n;
    this.treeMesh.visible = n > 0;
    this._writeTrees(0);
    return n;
  }

  createWildlife(type, count, positions) {
    const n = Math.max(0, Math.min(MAX_WILDLIFE, Math.min(MAX_CREATURES_ONSCREEN, count | 0)));
    this.wildlife = [];
    const pts = positions && positions.length ? positions : null;
    for (let i = 0; i < n; i++) {
      const side = i % 2 ? 1 : -1;
      const pos = pts?.[i] || { x: side * (8.2 + (i % 3) * 0.9), z: 10 + i * ((ROADSIDE_BEHIND + ROADSIDE_AHEAD) / Math.max(1, n)) };
      this.wildlife.push({
        type: type || "rabbit",
        x: pos.x,
        y: 0.22,
        z: pos.z,
        phase: i * 1.17,
        wait: (i % 3) * 0.4,
        heading: side > 0 ? 0.2 : 3,
      });
    }
    this.wildMesh.count = n;
    this.wildMesh.visible = n > 0;
    return n;
  }

  addParticleEffect(type, position, count) {
    const extra = Math.max(1, Math.min(40, count | 0));
    const arr = this._partGeo.attributes.position.array;
    let used = 0;
    for (let i = 0; i < MAX_LIFE_PARTICLES; i++) if (this._partLife[i] > 0) used++;
    let added = 0;
    for (let i = 0; i < MAX_LIFE_PARTICLES && added < extra && used + added < MAX_LIFE_PARTICLES; i++) {
      if (this._partLife[i] > 0) continue;
      arr[i * 3] = (position?.x || 0) + (Math.random() - 0.5) * 2;
      arr[i * 3 + 1] = (position?.y || 1.2) + Math.random();
      arr[i * 3 + 2] = (position?.z || 0) + (Math.random() - 0.5) * 2;
      this._partKind[i] = this._kindId(type);
      this._partLife[i] = 1.2 + Math.random();
      added++;
    }
    this._partGeo.attributes.position.needsUpdate = true;
    this.partMesh.visible = true;
    return added;
  }

  setWindIntensity(intensity) {
    this.wind = Math.max(0, Math.min(1, Number(intensity) || 0));
    return this.wind;
  }

  playWeatherSounds(weatherType) {
    this.weatherSound = weatherType === "rain" || weatherType === "storm" || weatherType === "snow" ? weatherType : weatherType || "sunny";
    return this.weatherSound;
  }

  _kindId(type) {
    return { pollen: 1, dust: 2, leaves: 3, embers: 4, fireflies: 5, bubbles: 6, snow: 7, rain: 8 }[type] || 1;
  }

  _fillParticles(type, count) {
    const n = Math.max(0, Math.min(MAX_LIFE_PARTICLES, count | 0));
    const arr = this._partGeo.attributes.position.array;
    this._partLife.fill(0);
    this._partKind.fill(0);
    const id = this._kindId(type);
    for (let i = 0; i < n; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 28;
      arr[i * 3 + 1] = 0.4 + Math.random() * 10;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 40;
      this._partKind[i] = id;
      this._partLife[i] = 0.5 + Math.random();
    }
    for (let i = n; i < MAX_LIFE_PARTICLES; i++) arr[i * 3 + 1] = -8;
    this.partMesh.visible = n > 0;
    this.partMat.color.setHex(PART_COLOR[type] || PART_COLOR.pollen);
    this.partMat.size = type === "dust" ? 0.2 : type === "fireflies" ? 0.18 : type === "bubbles" ? 0.22 : 0.12;
    this._partGeo.attributes.position.needsUpdate = true;
    this._partType = type;
    this._partCount = n;
  }

  _tintWater(kind) {
    this.water.visible = !!kind;
    if (!kind) return;
    this.waterMat.color.setHex(kind === "swamp" ? 0x1a4a38 : kind === "stream" ? 0x4ab4c8 : 0x2ec8d4);
    this.waterMat.opacity = kind === "swamp" ? 0.5 : 0.4;
    this.water.position.y = kind === "stream" ? 0.03 : 0.02;
  }

  _spawnBirds(kind, count) {
    const n = Math.max(0, Math.min(MAX_BIRDS, count | 0));
    this.birds = [];
    for (let i = 0; i < n; i++) {
      this.birds.push({
        kind,
        u: i / Math.max(1, n),
        phase: i * 0.41,
        flap: kind === "bats" ? 18 : kind === "tropical" ? 7 : 12,
      });
    }
    this.birdMesh.count = n;
    this.wingMesh.count = n;
    this.birdMesh.visible = n > 0;
    this.wingMesh.visible = n > 0;
  }

  _writeTrees(t) {
    const p = this.profile;
    const amp = ((p.swayDeg * Math.PI) / 180) * (0.35 + this.wind);
    const w = (Math.PI * 2) / Math.max(0.4, p.swaySec);
    const n = this.trees.length;
    const shimmer = !!p.shimmer;
    for (let i = 0; i < n; i++) {
      const s = this.trees[i];
      const sway = shimmer ? 0 : Math.sin(t * w + s.phase) * amp;
      const flutter = shimmer ? 1 + Math.sin(t * 3.2 + s.phase) * 0.04 : 1;
      this._dummy.position.set(s.x, s.y, s.z);
      this._dummy.rotation.set(sway * 0.25, 0, sway);
      this._dummy.scale.set(s.sx * flutter, s.sy * flutter, s.sx);
      this._dummy.updateMatrix();
      this.treeMesh.setMatrixAt(i, this._dummy.matrix);
    }
    this.treeMesh.instanceMatrix.needsUpdate = true;
    if (p.tree === "crystal" || p.tree === "twisted") {
      this.treeMat.emissiveIntensity = 0.2 + Math.sin(t * 2.1) * 0.1;
    }
  }

  _writeBirds(t, reduce, crowdZ = 0, crowdX = 0) {
    const n = this.birds.length;
    const step = Math.max(0.008, this._tickDt);
    for (let i = 0; i < n; i++) {
      const b = this.birds[i];
      b.u = (b.u + step * (b.kind === "bats" ? 0.08 : 0.035)) % 1;
      this._curve.getPoint(b.u, _pt);
      if (b.kind === "bats") {
        _pt.x += Math.sin(t * 7 + b.phase) * 1.6;
        _pt.y += Math.sin(t * 9 + i) * 0.8;
      }
      const yaw = b.kind === "bats" ? t * 2 + i : b.u * Math.PI * 2;
      this._dummy.position.set(_pt.x + crowdX * 0.2, _pt.y, _pt.z + crowdZ);
      this._dummy.rotation.set(0.12, yaw, 0);
      this._dummy.scale.setScalar(b.kind === "tropical" ? 1.35 : 1);
      this._dummy.updateMatrix();
      this.birdMesh.setMatrixAt(i, this._dummy.matrix);
      if (i === 0) this.birdPan = Math.max(-1, Math.min(1, _pt.x / 16));
      const flap = 1 + Math.sin(t * b.flap + b.phase) * (reduce ? 0.06 : 0.55);
      this._dummy.scale.set(flap * (b.kind === "tropical" ? 1.35 : 1), 1, 1);
      this._dummy.updateMatrix();
      this.wingMesh.setMatrixAt(i, this._dummy.matrix);
    }
    this.birdMesh.instanceMatrix.needsUpdate = true;
    this.wingMesh.instanceMatrix.needsUpdate = true;
  }

  _writeWild(t) {
    const n = this.wildlife.length;
    const wind = this.wind;
    for (let i = 0; i < n; i++) {
      const c = this.wildlife[i];
      let y = c.y;
      let x = c.x;
      let pitch = 0;
      if (c.type === "rabbit") {
        const hop = Math.max(0, Math.sin(t * 5.2 + c.phase));
        y = 0.2 + hop * hop * 0.42;
        if (hop < 0.05) c.z += 0.004;
      } else if (c.type === "lizard") {
        x += Math.sin(t * (2 + wind * 4) + c.phase) * 0.01;
        c.z += 0.012 + wind * 0.01;
        pitch = Math.sin(t * 8 + i) * 0.2;
      } else if (c.type === "deer") {
        pitch = Math.sin(t * 0.7 + c.phase) > 0.85 ? -0.25 : 0.05;
      } else if (c.type === "monkey") {
        const swing = Math.sin(t * 2.2 + c.phase);
        y = 1.4 + Math.abs(swing) * 0.35;
        x = c.x + swing * 0.8;
        pitch = swing * 0.4;
      }
      c.z = wrapAlongTrack(c.z, this._crowdZ || 0);
      this._dummy.position.set(x, y, c.z);
      this._dummy.rotation.set(pitch, c.heading, 0);
      this._dummy.scale.set(c.type === "deer" ? 1.6 : c.type === "monkey" ? 1.15 : 1, c.type === "deer" ? 1.8 : 1, c.type === "deer" ? 1.4 : 1.2);
      this._dummy.updateMatrix();
      this.wildMesh.setMatrixAt(i, this._dummy.matrix);
    }
    this.wildMesh.instanceMatrix.needsUpdate = true;
  }

  _writeParts(dt, crowdZ = 0) {
    const arr = this._partGeo.attributes.position.array;
    const type = this._partType;
    const wind = this.wind;
    for (let i = 0; i < MAX_LIFE_PARTICLES; i++) {
      if (this._partLife[i] <= 0) continue;
      const k = this._partKind[i];
      if (k === 4) {
        arr[i * 3 + 1] += (1.8 + Math.random()) * dt;
        arr[i * 3] += Math.sin(this._clock + i) * dt * 0.4;
        if (arr[i * 3 + 1] > 12) arr[i * 3 + 1] = 0.4;
      } else if (k === 3) {
        arr[i * 3 + 1] -= (1.2 + wind) * dt;
        arr[i * 3] += Math.sin(this._clock * 1.4 + i) * dt * (1.2 + wind * 2);
        if (arr[i * 3 + 1] < 0.1) arr[i * 3 + 1] = 8 + Math.random() * 4;
      } else if (k === 6) {
        arr[i * 3 + 1] += 1.4 * dt;
        if (arr[i * 3 + 1] > 2.4) arr[i * 3 + 1] = 0.12;
      } else if (k === 7) {
        arr[i * 3 + 1] -= 1.1 * dt;
        arr[i * 3] += wind * dt * 0.8;
        if (arr[i * 3 + 1] < 0.08) arr[i * 3 + 1] = 9;
      } else if (k === 5) {
        arr[i * 3] += Math.sin(this._clock * 3 + i) * dt * 1.4;
        arr[i * 3 + 1] += Math.cos(this._clock * 2.2 + i) * dt * 0.6;
        arr[i * 3 + 2] += Math.sin(this._clock + i * 0.3) * dt;
      } else {
        arr[i * 3] += (0.4 + wind * 3.2) * dt * (type === "dust" ? 2.4 : 1);
        arr[i * 3 + 1] += Math.sin(this._clock + i) * dt * 0.15;
        if (arr[i * 3] > 16) arr[i * 3] = -16;
      }
      arr[i * 3 + 2] = wrapAlongTrack(arr[i * 3 + 2], crowdZ);
    }
    this._partGeo.attributes.position.needsUpdate = true;
    if (type === "fireflies") this.partMat.opacity = 0.45 + Math.sin(this._clock * 4) * 0.25;
  }

  tick(dt, reduceMotion = false, crowdZ = 0, crowdX = 0) {
    this._clock += dt;
    this._tickDt = dt;
    this._crowdZ = crowdZ;
    this.group.position.z = 0;
    this.group.position.x = 0;
    for (const s of this.trees) s.z = wrapAlongTrack(s.z, crowdZ);
    if (this.water.visible) this.water.position.z = crowdZ + 22;
    if (!reduceMotion) this._writeTrees(this._clock);
    if (!reduceMotion && this.birds.length) this._writeBirds(this._clock, reduceMotion, crowdZ, crowdX);
    if (!reduceMotion && this.wildlife.length) this._writeWild(this._clock);
    if (!reduceMotion && this.partMesh.visible) this._writeParts(dt, crowdZ);
    if (this.water.visible && this.waterMat.map) {
      const kind = this.profile.water;
      if (kind === "lagoon") this.waterMat.map.offset.x = (this._clock * 0.04) % 1;
      else if (kind === "stream") this.waterMat.map.offset.y = (this._clock * 0.12) % 1;
      else this.waterMat.map.offset.x = Math.sin(this._clock * 0.7) * 0.04;
    }
  }

  dispose() {
    this.group.traverse((o) => {
      if (o.geometry && !isSharedGeo(o.geometry) && !Object.values(_treeGeos).includes(o.geometry) && o.geometry !== this._partGeo) {
        o.geometry.dispose?.();
      }
      const mats = Array.isArray(o.material) ? o.material : o.material ? [o.material] : [];
      for (const m of mats) {
        if (m.map && m.map !== _waterMap) m.map.dispose?.();
        m.dispose?.();
      }
    });
    this._partGeo.dispose?.();
    this.group.removeFromParent();
  }
}
