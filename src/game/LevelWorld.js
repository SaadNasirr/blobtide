import * as THREE from "three";
import { opLabel } from "../content/levels.js";
import { makeBeastBadge, makeCoinTexture, makeCountBadge, makeGateLabelTexture, gateFaceColor, makeGridTexture, makePitTexture, makeRivalBadge, makeSideTexture, makeSteelTexture, makeStripeTexture, makeSwirlTexture, makeLeechCoinTexture, leechAmount } from "./look.js";
import { worldForLevel } from "../content/themes.js";
import { mergeGeometries } from "three/addons/utils/BufferGeometryUtils.js";
import { Ease } from "./tween.js";
import { applyWardenPose, buildWarden, makeSepoyArmorGeo, makeSepoyClothGeo, makeSepoyHeadGeo, makeSepoyHelmGeo, makeSepoyLegGeo, makeSepoyMaterials, makeTulwarGeo, sepoyOffset, sepoyPose, SEPOY_ANIM, wardenClipDuration, wardenPose } from "./Fighters.js";

function decorMat(color, extra = {}) {
  return new THREE.MeshStandardMaterial({
    color,
    emissive: extra.emissive ?? 0x000000,
    emissiveIntensity: extra.ei ?? 0,
    metalness: extra.metal ?? 0.08,
    roughness: extra.rough ?? 0.72,
  });
}

function candy(color, emissive = 0x000000, extra = {}) {
  const opacity = extra.opacity ?? 1;
  return new THREE.MeshStandardMaterial({
    color,
    emissive,
    emissiveIntensity: extra.ei ?? 0.08,
    metalness: extra.metal ?? 0.14,
    roughness: extra.rough ?? 0.64,
    transparent: opacity < 1,
    opacity,
    depthWrite: opacity >= 1,
  });
}

export const SLAM_HEAD = { sx: 1.22, sy: 0.82, sz: 1.22 };
export const SLAM_PIVOT = { x: 1.85, y: 2.15 };
export const SLAM_HEAD_LOCAL = { x: -2.08, y: -0.18, z: 0 };

export function slamDownAmount(cycle) {
  const c = ((Number(cycle) % 1) + 1) % 1;
  if (c > 0.48 && c < 0.6) return (c - 0.48) / 0.12;
  if (c >= 0.6 && c < 0.86) return 1;
  if (c >= 0.86 && c < 0.98) return 1 - (c - 0.86) / 0.12;
  return 0;
}

/** Rest is cocked over the lane; positive Z swings the head onto the floor. */
export function slamArmAngle(down) {
  return -0.22 + Math.max(0, Math.min(1, Number(down) || 0)) * 1.12;
}

export function slamHeadLocalPos(down) {
  const ang = slamArmAngle(down);
  const p = SLAM_HEAD_LOCAL;
  const c = Math.cos(ang);
  const s = Math.sin(ang);
  return {
    x: SLAM_PIVOT.x + c * p.x - s * p.y,
    y: SLAM_PIVOT.y + s * p.x + c * p.y,
    z: p.z,
  };
}

export function slamHeadLocalX(down) {
  return slamHeadLocalPos(down).x;
}

export function slamHeadWorldY(down) {
  return slamHeadLocalPos(down).y;
}

export function slamHitbox(down, groupX = 0, groupZ = 0) {
  return {
    x: groupX + slamHeadLocalX(down),
    z: groupZ,
    width: SLAM_HEAD.sx,
    depth: SLAM_HEAD.sz,
    height: SLAM_HEAD.sy,
  };
}

export function slamHitHalf(crowdRadius = 0) {
  return SLAM_HEAD.sx * 0.5 + Math.max(0, Number(crowdRadius) || 0) * 0.35;
}

export function slamQaDebug() {
  try {
    return !!(import.meta.env?.DEV && /(?:\?|&)qa(?:=|&|$)/.test(String(globalThis.location?.search || "")));
  } catch {
    return false;
  }
}

function makeSawTeethGeo() {
  const parts = [];
  const n = 24;
  for (let i = 0; i < n; i++) {
    const g = new THREE.ConeGeometry(0.078, 0.3, 6);
    const a = (i / n) * Math.PI * 2;
    g.rotateZ(a - Math.PI / 2);
    g.translate(Math.cos(a) * 1.02, Math.sin(a) * 1.02, 0);
    parts.push(g);
  }
  return mergeGeometries(parts, false);
}

function makeSpinnerBladesGeo() {
  const parts = [];
  for (let i = 0; i < 3; i++) {
    const blade = new THREE.BoxGeometry(1.72, 0.05, 0.22);
    blade.translate(0.7, 0, 0);
    blade.rotateY((i / 3) * Math.PI * 2);
    parts.push(blade);
  }
  return mergeGeometries(parts, false);
}

function makeSpinnerEdgesGeo() {
  const parts = [];
  for (let i = 0; i < 3; i++) {
    const edge = new THREE.BoxGeometry(1.76, 0.02, 0.28);
    edge.translate(0.72, 0.04, 0);
    edge.rotateY((i / 3) * Math.PI * 2);
    parts.push(edge);
  }
  return mergeGeometries(parts, false);
}

function colorInstanced(mesh, max) {
  mesh.instanceColor = new THREE.InstancedBufferAttribute(new Float32Array(max * 3), 3);
  mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
  mesh.frustumCulled = false;
  mesh.count = 0;
}

function disposeObject(o, skip = null) {
  if (o.geometry && !skip?.has(o.geometry)) o.geometry.dispose?.();
  const mats = Array.isArray(o.material) ? o.material : o.material ? [o.material] : [];
  for (const m of mats) {
    if (skip?.has(m)) continue;
    if (m.map && skip?.has(m.map)) {
      m.dispose?.();
      continue;
    }
    m.map?.dispose?.();
    m.dispose?.();
  }
}

export class LevelWorld {
  constructor(scene) {
    this.scene = scene;
    this.root = new THREE.Group();
    scene.add(this.root);
    this.colliders = [];
    this.animated = [];
    this.finishZ = 40;
    this.doorPieces = [];
    this._grid = makeGridTexture();
    this._side = makeSideTexture();
    this._stripe = makeStripeTexture();
    this._coin = makeCoinTexture();
    this._swirl = makeSwirlTexture();
    this._floor = null;
    this._dummy = new THREE.Object3D();
    this._blobGeo = new THREE.SphereGeometry(0.22, 10, 8);
    this._rockGeo = new THREE.DodecahedronGeometry(0.55, 0);
    this._pineGeo = new THREE.ConeGeometry(0.42, 1.15, 6);
    this._trunkGeo = new THREE.CylinderGeometry(0.08, 0.11, 0.32, 6);
    this._grassGeo = new THREE.ConeGeometry(0.12, 0.28, 5);
    this._cutterBodyGeo = makeSepoyClothGeo();
    this._cutterArmorGeo = makeSepoyArmorGeo();
    this._cutterHeadGeo = makeSepoyHeadGeo();
    this._cutterHelmGeo = makeSepoyHelmGeo();
    this._cutterSwordGeo = makeTulwarGeo(1);
    this._cutterLegGeo = makeSepoyLegGeo();
    const cutter = makeSepoyMaterials();
    this._rivalMat = cutter.cloth;
    this._rivalBossMat = cutter.clothBoss;
    this._armorMat = cutter.armor;
    this._armorBossMat = cutter.armorBoss;
    this._headMat = cutter.skin;
    this._helmMat = cutter.helm;
    this._swordMat = cutter.blade;
    this._rockMat = decorMat(0x8a8a78, { emissive: 0x3a3a30, ei: 0.04 });
    this._pineMat = decorMat(0x3a7d3f, { emissive: 0x145820, ei: 0.08 });
    this._trunkMat = decorMat(0x8a5a38, { emissive: 0x4a2810, ei: 0.06 });
    this._grassMat = decorMat(0x6ee08a, { emissive: 0x2a8848, ei: 0.12 });
    this.armies = [];
    this.cutFx = [];
    this._cutSpawn = 0;
    this._sawMax = 48;
    this._spinMax = 32;
    this._pitMax = 48;
    this._pitCount = 0;
    this._pit = makePitTexture();
    this._tint = new THREE.Color();
  }

  clear() {
    const skip = new Set();
    if (this._grid) skip.add(this._grid);
    if (this._side) skip.add(this._side);
    if (this._stripe) skip.add(this._stripe);
    if (this._coin) skip.add(this._coin);
    if (this._swirl) skip.add(this._swirl);
    if (this._pit) skip.add(this._pit);
    if (this._pitMap) skip.add(this._pitMap);
    if (this._pitMat) skip.add(this._pitMat);
    if (this._blobGeo) skip.add(this._blobGeo);
    if (this._rockGeo) skip.add(this._rockGeo);
    if (this._pineGeo) skip.add(this._pineGeo);
    if (this._trunkGeo) skip.add(this._trunkGeo);
    if (this._grassGeo) skip.add(this._grassGeo);
    if (this._cutterBodyGeo) skip.add(this._cutterBodyGeo);
    if (this._cutterArmorGeo) skip.add(this._cutterArmorGeo);
    if (this._cutterHeadGeo) skip.add(this._cutterHeadGeo);
    if (this._cutterHelmGeo) skip.add(this._cutterHelmGeo);
    if (this._cutterSwordGeo) skip.add(this._cutterSwordGeo);
    if (this._cutterLegGeo) skip.add(this._cutterLegGeo);
    if (this._rivalMat) skip.add(this._rivalMat);
    if (this._rivalBossMat) skip.add(this._rivalBossMat);
    if (this._armorMat) skip.add(this._armorMat);
    if (this._armorBossMat) skip.add(this._armorBossMat);
    if (this._headMat) skip.add(this._headMat);
    if (this._helmMat) skip.add(this._helmMat);
    if (this._swordMat) skip.add(this._swordMat);
    if (this._rockMat) skip.add(this._rockMat);
    if (this._pineMat) skip.add(this._pineMat);
    if (this._trunkMat) skip.add(this._trunkMat);
    if (this._grassMat) skip.add(this._grassMat);
    if (this._sawSteel) skip.add(this._sawSteel);
    if (this._sawToothMat) skip.add(this._sawToothMat);
    if (this._sawHubMat) skip.add(this._sawHubMat);
    if (this._sawRimMat) skip.add(this._sawRimMat);
    if (this._spinBladeMat) skip.add(this._spinBladeMat);
    if (this._spinEdgeMat) skip.add(this._spinEdgeMat);
    if (this._spinHubMat) skip.add(this._spinHubMat);
    if (this._pitDiscGeo) skip.add(this._pitDiscGeo);
    if (this._pitDisc) skip.add(this._pitDisc);
    for (const geo of [
      this._sawDiscGeo,
      this._sawTeethGeo,
      this._sawHubGeo,
      this._sawRimGeo,
      this._spinBladeGeo,
      this._spinEdgeGeo,
      this._spinHubGeo,
      this._pitDiscGeo,
    ]) {
      if (geo) skip.add(geo);
    }
    if (this._steelMap) skip.add(this._steelMap);
    this.root.traverse((o) => {
      if (o !== this.root) disposeObject(o, skip);
    });
    this.root.clear();
    this.colliders = [];
    this.animated = [];
    this.doorPieces = [];
    this.armies = [];
    this._floor = null;
    this.cutFx = [];
    this._cutSpawn = 0;
    this._valleyRocks = null;
    this._valleyPines = null;
    this._valleyTrunks = null;
    this._valleyGrass = null;
    this._sawCount = 0;
    this._spinCount = 0;
    this._pitCount = 0;
  }

  build(level) {
    this.clear();
    this._mountHazardInstances();
    const world = worldForLevel(level.id);
    this._world = world;
    this._levelId = level.id;
    this._grid = makeGridTexture(world);
    this._side = makeSideTexture(world);
    this.applyDecor(world);
    const last = level.pieces[level.pieces.length - 1];
    this.finishZ = last.z;
    const trackLen = last.z + 22;
    const trackW = 8.8 + (world.lane - 3.0) * 0.55;

    this._grid.repeat.set(2, Math.max(8, trackLen / 4.6));
    this._grid.offset.set(0, 0);
    this._side.repeat.set(5, Math.max(8, trackLen / 6));
    const floor = new THREE.Mesh(
      new THREE.PlaneGeometry(trackW, trackLen, 1, 1),
      new THREE.MeshBasicMaterial({
        map: this._grid,
        color: 0xffffff,
        polygonOffset: true,
        polygonOffsetFactor: 1,
        polygonOffsetUnits: 1,
        depthWrite: true,
      })
    );
    floor.rotation.x = -Math.PI / 2;
    floor.position.set(0, 0, trackLen / 2 - 6);
    this._floor = floor;
    this.root.add(floor);

    for (const side of [-1, 1]) {
      const berm = new THREE.Mesh(
        new THREE.PlaneGeometry(18, trackLen, 1, 1),
        new THREE.MeshLambertMaterial({ map: this._side, color: world.berm })
      );
      berm.rotation.x = -Math.PI / 2;
      berm.position.set(side * 13.4, -0.05, trackLen / 2 - 6);
      this.root.add(berm);
    }

    const railX = trackW * 0.475;
    for (const side of [-railX + 0.22, railX - 0.22]) {
      const glow = new THREE.Mesh(
        new THREE.BoxGeometry(0.09, 0.035, trackLen),
        candy(world.paint, world.paint, { ei: 0.12, shine: 30 })
      );
      glow.position.set(side, 0.03, trackLen / 2 - 6);
      this.root.add(glow);
    }

    for (const side of [-railX - 0.22, railX + 0.22]) {
      const railGeo = new THREE.CylinderGeometry(0.17, 0.17, trackLen, 10);
      railGeo.rotateX(Math.PI / 2);
      const rail = new THREE.Mesh(railGeo, candy(world.rail, world.rail, { ei: 0.08, shine: 28 }));
      rail.position.set(side, 0.36, trackLen / 2 - 6);
      this.root.add(rail);
      const lipGeo = new THREE.CylinderGeometry(0.24, 0.24, trackLen, 10);
      lipGeo.rotateX(Math.PI / 2);
      const lip = new THREE.Mesh(lipGeo, candy(world.lip, world.lip, { ei: 0.06, shine: 16 }));
      lip.position.set(side, 0.09, trackLen / 2 - 6);
      this.root.add(lip);
    }

    const archGap = world.id === "crown" ? 16 : world.id === "nightfen" ? 26 : 22;
    for (let z = 10; z < last.z; z += archGap) this._addArch(z, world);
    this._addValley(trackLen, world);

    for (const p of level.pieces) {
      if (p.type === "gate") this._addGate(p.z, p.x, p.op, p.value, p);
      else if (p.type === "dualgate") {
        this._addGate(p.z, -1.12, p.left.op, p.left.value, { ...p, side: "left" });
        this._addGate(p.z, 1.12, p.right.op, p.right.value, { ...p, side: "right" });
      } else if (p.type === "saw") this._addSaw(p);
      else if (p.type === "spinner") this._addSpinner(p);
      else if (p.type === "crusher") this._addCrusher(p);
      else if (p.type === "hole") this._addHole(p);
      else if (p.type === "wall") this._addWall(p);
      else if (p.type === "coin") this._addCoin(p);
      else if (p.type === "boost") this._addBoost(p);
      else if (p.type === "shield") this._addShield(p);
      else if (p.type === "magnet") this._addMagnet(p);
      else if (p.type === "star") this._addToken(p, "star", 0xffe566, 0xffcc00);
      else if (p.type === "grow") this._addToken(p, "grow", 0x3ec8a0, 0x1a8a68);
      else if (p.type === "army") this._addArmy(p);
      else if (p.type === "beast") this._addBeast(p);
      else if (p.type === "geyser") this._addGeyser(p);
      else if (p.type === "pendulum") this._addPendulum(p);
      else if (p.type === "orbit") this._addOrbit(p);
      else if (p.type === "slam") this._addSlam(p);
      else if (p.type === "beam") this._addBeam(p);
      else if (p.type === "leech") this._addLeech(p);
      else if (p.type === "snare") this._addSnare(p);
      else if (p.type === "chaser") this._addChaser(p);
      else if (p.type === "finish") this._addFinish(p);
    }
    this._layoutRotors(false);
  }

  _addArch(z, world) {
    const tint = world?.arch ?? 0xd8c8a0;
    const mat = candy(tint, tint, { ei: 0.08, shine: 24 });
    const arch = new THREE.Mesh(new THREE.TorusGeometry(4.08, 0.14, 8, 28, Math.PI), mat);
    arch.position.set(0, 0.02, z);
    this.root.add(arch);
  }

  _groundMark(r = 0.4) {
    const m = new THREE.Mesh(
      new THREE.CircleGeometry(r, 18),
      new THREE.MeshBasicMaterial({ color: 0x08061a, transparent: true, opacity: 0.34, depthWrite: false })
    );
    m.rotation.x = -Math.PI / 2;
    m.position.y = 0.02;
    return m;
  }

  _pedestal() {
    return new THREE.Mesh(
      new THREE.CylinderGeometry(0.14, 0.2, 0.1, 12),
      candy(0x5a8a38, 0x2a4a18, { ei: 0.08, shine: 18 })
    );
  }

  _addGate(z, x, op, value, extra) {
    const good = op === "add" || op === "mul";
    const boardW = extra?.width || 2.2;
    const trap = boardW < 2;
    const dualSide = extra?.side;
    const tex = makeGateLabelTexture(op, value, { trap, side: dualSide, text: opLabel(op, value) });
    const faceHex = parseInt(String(gateFaceColor(op, trap)).slice(1), 16);
    const group = new THREE.Group();
    group.position.set(x, 0, z);
    const face = new THREE.MeshBasicMaterial({ map: tex, toneMapped: false, polygonOffset: true, polygonOffsetFactor: -1, polygonOffsetUnits: -1 });
    const glow = new THREE.MeshStandardMaterial({
      color: faceHex,
      emissive: faceHex,
      emissiveIntensity: trap ? 0.38 : good ? 0.22 : 0.28,
      metalness: 0.08,
      roughness: 0.72,
      toneMapped: false,
    });
    const slab = new THREE.Mesh(new THREE.BoxGeometry(2.72, 1.82, 0.18), glow);
    slab.position.set(0, 1.16, 0);
    const plate = new THREE.Mesh(new THREE.PlaneGeometry(2.58, 1.68), face);
    plate.position.set(0, 1.16, -0.11);
    plate.rotation.y = Math.PI;
    const postMat = new THREE.MeshStandardMaterial({
      color: trap ? 0x4a0000 : good ? 0x0b5a32 : 0x5a1018,
      emissive: trap ? 0x7a0000 : good ? 0x063a20 : 0x3a0810,
      emissiveIntensity: 0.35,
      metalness: 0.22,
      roughness: 0.55,
      toneMapped: false,
    });
    const postL = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.1, 1.72, 8), postMat);
    postL.position.set(-1.22, 0.86, 0);
    const postR = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.1, 1.72, 8), postMat);
    postR.position.set(1.22, 0.86, 0);
    const rim = new THREE.Mesh(
      new THREE.BoxGeometry(2.52, 1.72, 0.05),
      new THREE.MeshStandardMaterial({
        color: 0xffffff,
        emissive: faceHex,
        emissiveIntensity: 0.8,
        metalness: 0.5,
        roughness: 0.22,
        toneMapped: false,
      })
    );
    rim.position.set(0, 1.08, 0.12);
    group.add(postL, postR, slab, plate, rim);
    group.userData.glowRim = rim.material;
    group.userData.slabMat = glow;
    if (trap) {
      const ring = new THREE.Mesh(
        new THREE.RingGeometry(0.55, 0.82, 20),
        new THREE.MeshBasicMaterial({ color: 0xffd54a, toneMapped: false })
      );
      ring.rotation.x = -Math.PI / 2;
      ring.position.y = 0.03;
      group.add(ring);
      group.userData.trapFlash = ring.material;
    }
    group.userData.gateBob = true;
    group.userData.gateKind = trap ? "trap" : good ? "good" : "bad";
    group.userData.spawnT = 0;
    group.userData.hitT = 0;
    group.userData.dimT = 0;
    group.userData.baseScaleX = trap ? 0.78 : 1;
    group.userData.baseEi = 1;
    group.scale.set(group.userData.baseScaleX * 0.84, 0.84, 0.84);
    this.root.add(group);
    this.animated.push(group);
    this.colliders.push({
      kind: "gate",
      z,
      x,
      width: boardW,
      op,
      value,
      extra,
      used: false,
      mesh: group,
      good,
    });
  }

  _initHazardMeshes() {
    if (this._sawDisc) {
      if (!this._pitDisc) {
        this._pitMap = this._pit || makePitTexture();
        this._pitMat = new THREE.MeshBasicMaterial({ map: this._pitMap, color: 0xffffff, toneMapped: false });
        this._pitDiscGeo = new THREE.CircleGeometry(1, 28);
        this._pitDisc = new THREE.InstancedMesh(this._pitDiscGeo, this._pitMat, this._pitMax);
        colorInstanced(this._pitDisc, this._pitMax);
      }
      return;
    }
    const steel = makeSteelTexture();
    this._steelMap = steel;
    this._sawSteel = new THREE.MeshStandardMaterial({
      map: steel,
      color: 0xc8d0d6,
      metalness: 0.88,
      roughness: 0.28,
      emissive: 0x2a0608,
      emissiveIntensity: 0.16,
    });
    this._sawToothMat = new THREE.MeshStandardMaterial({
      color: 0xf3f6fa,
      metalness: 0.62,
      roughness: 0.22,
      emissive: 0x8890a0,
      emissiveIntensity: 0.12,
    });
    this._sawHubMat = new THREE.MeshStandardMaterial({
      color: 0x16181c,
      metalness: 0.7,
      roughness: 0.4,
      emissive: 0x000000,
      emissiveIntensity: 0,
    });
    this._sawRimMat = new THREE.MeshStandardMaterial({
      color: 0xff2a3a,
      metalness: 0.35,
      roughness: 0.35,
      emissive: 0xff1830,
      emissiveIntensity: 0.72,
    });
    this._spinBladeMat = new THREE.MeshStandardMaterial({
      color: 0xb8c0c8,
      metalness: 0.8,
      roughness: 0.3,
      emissive: 0x4a0810,
      emissiveIntensity: 0.22,
      map: steel,
    });
    this._spinEdgeMat = new THREE.MeshStandardMaterial({
      color: 0xff4a5a,
      metalness: 0.25,
      roughness: 0.4,
      emissive: 0xff2030,
      emissiveIntensity: 0.7,
    });
    this._spinHubMat = this._sawHubMat;
    const disc = new THREE.CylinderGeometry(1, 1, 0.12, 28);
    disc.rotateX(Math.PI / 2);
    this._sawDiscGeo = disc;
    this._sawTeethGeo = makeSawTeethGeo();
    this._sawHubGeo = new THREE.SphereGeometry(0.22, 12, 10);
    this._sawRimGeo = new THREE.TorusGeometry(0.98, 0.06, 8, 28);
    this._spinBladeGeo = makeSpinnerBladesGeo();
    this._spinEdgeGeo = makeSpinnerEdgesGeo();
    this._spinHubGeo = new THREE.SphereGeometry(0.16, 10, 8);
    this._sawDisc = new THREE.InstancedMesh(this._sawDiscGeo, this._sawSteel, this._sawMax);
    this._sawTeeth = new THREE.InstancedMesh(this._sawTeethGeo, this._sawToothMat, this._sawMax);
    this._sawHubs = new THREE.InstancedMesh(this._sawHubGeo, this._sawHubMat, this._sawMax);
    this._sawRims = new THREE.InstancedMesh(this._sawRimGeo, this._sawRimMat, this._sawMax);
    this._spinBlades = new THREE.InstancedMesh(this._spinBladeGeo, this._spinBladeMat, this._spinMax);
    this._spinEdges = new THREE.InstancedMesh(this._spinEdgeGeo, this._spinEdgeMat, this._spinMax);
    this._spinHubs = new THREE.InstancedMesh(this._spinHubGeo, this._spinHubMat, this._spinMax);
    this._pitMap = this._pit || makePitTexture();
    this._pitMat = new THREE.MeshBasicMaterial({ map: this._pitMap, color: 0xffffff, toneMapped: false });
    this._pitDiscGeo = new THREE.CircleGeometry(1, 28);
    this._pitDisc = new THREE.InstancedMesh(this._pitDiscGeo, this._pitMat, this._pitMax);
    for (const m of [this._sawDisc, this._sawTeeth, this._sawHubs, this._sawRims]) colorInstanced(m, this._sawMax);
    for (const m of [this._spinBlades, this._spinEdges, this._spinHubs]) colorInstanced(m, this._spinMax);
    colorInstanced(this._pitDisc, this._pitMax);
  }

  _mountHazardInstances() {
    this._initHazardMeshes();
    this._sawCount = 0;
    this._spinCount = 0;
    this._pitCount = 0;
    for (const m of [this._sawDisc, this._sawTeeth, this._sawHubs, this._sawRims, this._spinBlades, this._spinEdges, this._spinHubs, this._pitDisc]) {
      m.count = 0;
      this.root.add(m);
    }
  }

  _layoutRotors(reduceMotion) {
    if (!this._sawDisc) return;
    const dummy = this._dummy;
    const tint = this._tint;
    const nSaw = this._sawCount;
    this._sawDisc.count = nSaw;
    this._sawTeeth.count = nSaw;
    this._sawHubs.count = nSaw;
    this._sawRims.count = nSaw;
    const nSpin = this._spinCount;
    this._spinBlades.count = nSpin;
    this._spinEdges.count = nSpin;
    this._spinHubs.count = nSpin;
    const nPit = this._pitCount;
    if (this._pitDisc) this._pitDisc.count = nPit;
    for (const col of this.colliders) {
      if (col.kind === "saw" && col.sawIndex != null) {
        const o = col.mesh;
        const i = col.sawIndex;
        const live = o.visible && !col.used;
        const r = o.userData.radius || 0.7;
        dummy.position.copy(o.position);
        dummy.rotation.copy(o.rotation);
        dummy.scale.setScalar(live ? r : 0.0001);
        dummy.updateMatrix();
        this._sawDisc.setMatrixAt(i, dummy.matrix);
        this._sawTeeth.setMatrixAt(i, dummy.matrix);
        this._sawHubs.setMatrixAt(i, dummy.matrix);
        this._sawRims.setMatrixAt(i, dummy.matrix);
        const glow = col.used ? 0.08 : col.hot ? 1 : o.userData.warn ? 0.5 : 0.2;
        tint.setRGB(0.22 + glow * 0.55, 0.24 + glow * 0.12, 0.26);
        this._sawDisc.setColorAt(i, tint);
        tint.setRGB(0.92, 0.94, 0.97);
        this._sawTeeth.setColorAt(i, tint);
        tint.setRGB(0.12, 0.12, 0.14);
        this._sawHubs.setColorAt(i, tint);
        tint.setRGB(glow, 0.08 * glow, 0.1 * glow);
        this._sawRims.setColorAt(i, tint);
      } else if (col.kind === "spinner" && col.spinIndex != null) {
        const o = col.mesh;
        const i = col.spinIndex;
        const live = o.visible && !col.used;
        const s = live ? Math.max(0.75, (col.width || 1.7) / 1.7) : 0.0001;
        dummy.position.set(o.position.x, 1.12, o.position.z);
        dummy.rotation.set(0, o.userData.rotorY || 0, 0);
        dummy.scale.setScalar(s);
        dummy.updateMatrix();
        this._spinBlades.setMatrixAt(i, dummy.matrix);
        this._spinEdges.setMatrixAt(i, dummy.matrix);
        dummy.rotation.set(0, 0, 0);
        dummy.updateMatrix();
        this._spinHubs.setMatrixAt(i, dummy.matrix);
        const glow = col.used ? 0.08 : col.hot ? 1 : o.userData.warn ? 0.5 : 0.2;
        tint.setRGB(0.55 + glow * 0.2, 0.28, 0.3);
        this._spinBlades.setColorAt(i, tint);
        tint.setRGB(glow, 0.12 * glow, 0.14 * glow);
        this._spinEdges.setColorAt(i, tint);
        tint.setRGB(0.12, 0.12, 0.14);
        this._spinHubs.setColorAt(i, tint);
      } else if (col.kind === "hole" && col.pitIndex != null && this._pitDisc) {
        const o = col.mesh;
        const i = col.pitIndex;
        const live = o.visible;
        const r = o.userData.radius || 0.8;
        dummy.position.set(o.position.x, 0.014, o.position.z);
        dummy.rotation.set(-Math.PI / 2, 0, 0);
        dummy.scale.setScalar(live ? r : 0.0001);
        dummy.updateMatrix();
        this._pitDisc.setMatrixAt(i, dummy.matrix);
        const suck = o.userData.suckT || 0;
        tint.setRGB(0.12 + suck * 0.25, 0.03, 0.08 + suck * 0.18);
        this._pitDisc.setColorAt(i, tint);
      }
    }
    for (const m of [this._sawDisc, this._sawTeeth, this._sawHubs, this._sawRims, this._spinBlades, this._spinEdges, this._spinHubs, this._pitDisc]) {
      if (!m) continue;
      m.instanceMatrix.needsUpdate = true;
      if (m.instanceColor) m.instanceColor.needsUpdate = true;
    }
    this._sawRimMat.emissiveIntensity = reduceMotion ? 0.25 : 0.45;
    this._spinEdgeMat.emissiveIntensity = reduceMotion ? 0.28 : 0.72;
  }

  _addSaw(p) {
    this._initHazardMeshes();
    const group = new THREE.Group();
    group.position.set(p.x, 0.62, p.z);
    const r = Math.max(0.55, p.width * 0.52);
    const spinSpeed = p.spin ?? (p.move ? (p.speed ?? 3.05) * 3.2 : 8);
    group.userData.spinZ = true;
    group.userData.spinSpeed = spinSpeed;
    group.userData.radius = r;
    group.userData.prevX = p.x;
    if (p.move) {
      group.userData.patrol = { base: p.x, amp: p.amp ?? 1.55, speed: p.speed ?? 3.05 };
    }
    this.root.add(group);
    this.animated.push(group);
    const col = {
      kind: "saw",
      z: p.z,
      x: p.x,
      width: p.width,
      damage: p.damage,
      used: false,
      mesh: group,
      spinSpeed,
      sawIndex: this._sawCount++,
      hot: false,
    };
    if (group.userData.patrol) group.userData.patrol.collider = col;
    this.colliders.push(col);
  }

  _addHole(p) {
    this._initHazardMeshes();
    const group = new THREE.Group();
    group.position.set(p.x, 0, p.z);
    const r = Math.max(0.72, p.width * 0.55);
    const well = new THREE.Mesh(
      new THREE.CylinderGeometry(r * 0.96, r * 0.36, 1.08, 22, 1, true),
      candy(0x050208, 0x160814, { ei: 0.14, shine: 8 })
    );
    well.position.y = -0.5;
    const abyss = new THREE.Mesh(
      new THREE.CircleGeometry(r * 0.34, 22),
      new THREE.MeshBasicMaterial({ color: 0x000000 })
    );
    abyss.rotation.x = -Math.PI / 2;
    abyss.position.y = -1.02;
    const shade = new THREE.Mesh(
      new THREE.CircleGeometry(r * 0.68, 22),
      new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.58, depthWrite: false })
    );
    shade.rotation.x = -Math.PI / 2;
    shade.position.y = -0.58;
    const swirlMat = new THREE.MeshBasicMaterial({
      map: this._swirl,
      color: 0x3a1028,
      transparent: true,
      opacity: 0.5,
      depthWrite: false,
      toneMapped: false,
    });
    const swirl = new THREE.Mesh(new THREE.CircleGeometry(r * 0.9, 28), swirlMat);
    swirl.rotation.x = -Math.PI / 2;
    swirl.position.y = 0.04;
    const swirl2 = new THREE.Mesh(new THREE.CircleGeometry(r * 0.58, 24), swirlMat);
    swirl2.rotation.x = -Math.PI / 2;
    swirl2.position.y = 0.055;
    const rim = new THREE.Mesh(
      new THREE.TorusGeometry(r, 0.075, 8, 28),
      candy(0xd41838, 0x8a1028, { ei: 0.78, shine: 90 })
    );
    rim.rotation.x = Math.PI / 2;
    rim.position.y = 0.05;
    const glow = new THREE.Mesh(
      new THREE.TorusGeometry(r * 0.74, 0.038, 8, 24),
      candy(0x5a1868, 0x3a0848, { ei: 0.62, shine: 100 })
    );
    glow.rotation.x = Math.PI / 2;
    glow.position.y = 0.025;
    group.add(well, abyss, shade, swirl, swirl2, rim, glow);
    group.userData.blackHole = true;
    group.userData.swirl = swirl;
    group.userData.swirl2 = swirl2;
    group.userData.rim = rim;
    group.userData.glow = glow;
    group.userData.radius = r;
    group.userData.suckT = 0;
    this.root.add(group);
    this.animated.push(group);
    this.colliders.push({
      kind: "hole",
      z: p.z,
      x: p.x,
      width: p.width,
      used: false,
      mesh: group,
      pitIndex: this._pitCount < this._pitMax ? this._pitCount++ : null,
    });
  }

  _addWall(p) {
    const group = new THREE.Group();
    group.position.set(p.x, 0, p.z);
    const w = p.width;
    const body = new THREE.Mesh(new THREE.BoxGeometry(w * 0.92, 1.22, 0.42), candy(0x2a1420, 0x4a0810, { ei: 0.15, shine: 28 }));
    body.position.y = 0.64;
    const face = new THREE.Mesh(
      new THREE.PlaneGeometry(w * 0.9, 1.12),
      new THREE.MeshPhongMaterial({
        map: this._stripe,
        color: 0xffffff,
        emissive: 0x331008,
        emissiveIntensity: 0.2,
        shininess: 40,
        specular: 0x886644,
        toneMapped: false,
      })
    );
    face.position.set(0, 0.64, 0.22);
    const capGeo = new THREE.CylinderGeometry(0.09, 0.09, w * 1.02, 10);
    capGeo.rotateZ(Math.PI / 2);
    const cap = new THREE.Mesh(capGeo, candy(0xffe08a, 0xffaa00, { ei: 0.55, shine: 100 }));
    cap.position.y = 1.28;
    group.add(body, face, cap);
    this.root.add(group);
    this.colliders.push({ kind: "wall", z: p.z, x: p.x, width: p.width, damage: p.damage, used: false, mesh: group });
  }

  _addSpinner(p) {
    this._initHazardMeshes();
    const group = new THREE.Group();
    group.position.set(p.x, 0, p.z);
    const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.1, 1.15, 8), candy(0x2a2e34, 0x111418, { ei: 0.08, shine: 50, spec: 0x8899aa }));
    pole.position.y = 0.58;
    group.add(pole);
    const spinSpeed = p.speed ?? 5.4;
    group.userData.rotorY = 0;
    group.userData.spinSpeed = spinSpeed;
    this.root.add(group);
    this.animated.push(group);
    const col = {
      kind: "spinner",
      z: p.z,
      x: p.x,
      width: p.width || 1.7,
      damage: p.damage,
      used: false,
      mesh: group,
      spinSpeed,
      spinIndex: this._spinCount++,
      hot: false,
    };
    this.colliders.push(col);
  }

  _addCrusher(p) {
    const group = new THREE.Group();
    group.position.set(p.x, 0, p.z);
    const slabMat = candy(0x4a3868, 0x2a1838, { ei: 0.22, shine: 40 });
    const stripeMat = candy(0xffd978, 0xffaa22, { ei: 0.45, shine: 80 });
    const left = new THREE.Mesh(new THREE.BoxGeometry(1.05, 1.05, 0.46), slabMat);
    const right = new THREE.Mesh(new THREE.BoxGeometry(1.05, 1.05, 0.46), slabMat);
    left.position.set(-1.35, 0.58, 0);
    right.position.set(1.35, 0.58, 0);
    const lipL = new THREE.Mesh(new THREE.BoxGeometry(0.12, 1.05, 0.5), stripeMat);
    const lipR = new THREE.Mesh(new THREE.BoxGeometry(0.12, 1.05, 0.5), stripeMat);
    lipL.position.set(-0.82, 0.58, 0);
    lipR.position.set(0.82, 0.58, 0);
    group.add(left, right, lipL, lipR);
    group.userData.crush = { left, right, lipL, lipR, period: 2.6, phase: p.z * 0.17 };
    group.userData.warnMat = stripeMat;
    group.userData.warnBase = 0.45;
    this.root.add(group);
    this.animated.push(group);
    const col = { kind: "crusher", z: p.z, x: p.x, width: 2.4, damage: p.damage || 4, used: false, mesh: group };
    group.userData.crush.collider = col;
    this.colliders.push(col);
  }

  _addGeyser(p) {
    const group = new THREE.Group();
    group.position.set(p.x, 0, p.z);
    const rim = new THREE.Mesh(new THREE.TorusGeometry(0.58, 0.075, 8, 20), candy(0x3a88b8, 0x1a6098, { ei: 0.42, shine: 70 }));
    rim.rotation.x = Math.PI / 2;
    rim.position.y = 0.06;
    const tell = new THREE.Mesh(new THREE.TorusGeometry(0.46, 0.04, 8, 18), candy(0x7af7ff, 0x2ec8d4, { ei: 0.28, shine: 90 }));
    tell.rotation.x = Math.PI / 2;
    tell.position.y = 0.09;
    const jet = new THREE.Mesh(new THREE.ConeGeometry(0.32, 1.9, 8), candy(0x7af7ff, 0x2ec8d4, { ei: 0.55, shine: 90, opacity: 0.7 }));
    jet.position.y = 0.9;
    const spray = new THREE.Mesh(new THREE.SphereGeometry(0.26, 8, 6), candy(0xd8f8ff, 0x88e8f8, { ei: 0.72, shine: 100, opacity: 0.62 }));
    spray.position.y = 1.7;
    const steam = new THREE.Mesh(
      new THREE.PlaneGeometry(1.05, 1.85),
      new THREE.MeshBasicMaterial({
        color: 0xaef8ff,
        transparent: true,
        opacity: 0.18,
        depthWrite: false,
        toneMapped: false,
        side: THREE.DoubleSide,
      })
    );
    steam.position.y = 1.05;
    group.add(this._groundMark(0.7), rim, tell, jet, spray, steam);
    group.userData.geyser = { jet, spray, steam, tell, phase: p.z * 0.13, period: p.period || 3, wasHot: false };
    group.userData.warnMat = jet.material;
    group.userData.warnBase = 0.28;
    this.root.add(group);
    this.animated.push(group);
    const col = { kind: "geyser", z: p.z, x: p.x, width: p.width || 1.55, damage: p.damage || 6, pulse: true, hot: false, used: false, mesh: group };
    group.userData.geyser.collider = col;
    this.colliders.push(col);
  }

  _addPendulum(p) {
    const group = new THREE.Group();
    group.position.set(p.x, 0, p.z);
    const bar = new THREE.Mesh(new THREE.BoxGeometry(3.4, 0.12, 0.12), candy(0xc4a06a, 0x8a6030, { ei: 0.12, shine: 40 }));
    bar.position.y = 2.35;
    const pivot = new THREE.Group();
    pivot.position.set(0, 2.32, 0);
    const rod = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.045, 1.7, 8), candy(0xd8dee8, 0x8899aa, { ei: 0.2, shine: 80, spec: 0xffffff }));
    rod.position.y = -0.85;
    const blade = new THREE.Mesh(new THREE.ConeGeometry(0.32, 0.7, 8), candy(0xeef2f6, 0x6688aa, { ei: 0.18, shine: 110, spec: 0xffffff }));
    blade.rotation.x = Math.PI;
    blade.position.y = -1.78;
    const ring = new THREE.Mesh(new THREE.TorusGeometry(0.22, 0.04, 8, 14), candy(0xffd978, 0xffaa22, { ei: 0.45, shine: 90 }));
    ring.position.y = -1.42;
    pivot.add(rod, blade, ring);
    group.add(bar, pivot);
    group.userData.pendulum = { pivot, amp: p.amp || 1.05, speed: p.speed || 2.15 };
    group.userData.warnMat = blade.material;
    group.userData.warnBase = 0.18;
    this.root.add(group);
    this.animated.push(group);
    const col = { kind: "pendulum", z: p.z, x: p.x, width: p.width || 1.35, damage: p.damage || 7, move: true, used: false, mesh: group };
    group.userData.pendulum.collider = col;
    this.colliders.push(col);
  }

  _addOrbit(p) {
    const group = new THREE.Group();
    group.position.set(p.x, 0, p.z);
    const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.12, 1.35, 8), candy(0x4a3868, 0x2a1838, { ei: 0.2, shine: 40 }));
    pole.position.y = 0.68;
    const hub = new THREE.Mesh(new THREE.SphereGeometry(0.18, 10, 8), candy(0xffd978, 0xffaa22, { ei: 0.5, shine: 100 }));
    hub.position.y = 1.28;
    const rotor = new THREE.Group();
    rotor.position.y = 0.72;
    const orbMat = candy(0xff5a73, 0xff1838, { ei: 0.62, shine: 90 });
    const a = new THREE.Mesh(new THREE.IcosahedronGeometry(0.28, 0), orbMat);
    const b = new THREE.Mesh(new THREE.IcosahedronGeometry(0.28, 0), orbMat);
    a.position.set(1.55, 0, 0);
    b.position.set(-1.55, 0, 0);
    rotor.add(a, b);
    group.add(pole, hub, rotor);
    group.userData.orbit = { rotor, orbs: [a, b], amp: 1.55 };
    group.userData.warnMat = orbMat;
    group.userData.warnBase = 0.5;
    this.root.add(group);
    this.animated.push(group);
    const col = { kind: "orbit", z: p.z, x: p.x, width: 1.2, damage: p.damage || 6, pulse: true, hot: true, used: false, mesh: group };
    group.userData.orbit.collider = col;
    this.colliders.push(col);
  }

  _addSlam(p) {
    const group = new THREE.Group();
    group.position.set(p.x, 0, p.z);
    const post = new THREE.Mesh(new THREE.BoxGeometry(0.28, 2.4, 0.28), candy(0x5a3a22, 0x2a1808, { ei: 0.04, metal: 0.04, rough: 0.82 }));
    post.position.set(SLAM_PIVOT.x, 1.2, 0);
    const hinge = new THREE.Mesh(new THREE.SphereGeometry(0.16, 10, 8), candy(0x8a8e94, 0x33363c, { ei: 0.08, metal: 0.72, rough: 0.32 }));
    hinge.position.set(SLAM_PIVOT.x, SLAM_PIVOT.y, 0);
    const arm = new THREE.Group();
    arm.position.set(SLAM_PIVOT.x, SLAM_PIVOT.y, 0);
    const beam = new THREE.Mesh(new THREE.BoxGeometry(2.16, 0.16, 0.16), candy(0x6a4a28, 0x3a2410, { ei: 0.05, metal: 0.06, rough: 0.78 }));
    beam.position.set(-1.08, 0, 0);
    const wrap = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.22, 0.22), candy(0x3a2414, 0x180c06, { ei: 0.03, metal: 0.04, rough: 0.86 }));
    wrap.position.set(-0.55, 0, 0);
    const head = new THREE.Mesh(
      new THREE.CylinderGeometry(SLAM_HEAD.sx * 0.48, SLAM_HEAD.sx * 0.52, SLAM_HEAD.sy, 12),
      candy(0x9aa2aa, 0x2a3038, { ei: 0.12, metal: 0.78, rough: 0.28 })
    );
    head.position.set(SLAM_HEAD_LOCAL.x, SLAM_HEAD_LOCAL.y, SLAM_HEAD_LOCAL.z);
    const face = new THREE.Mesh(
      new THREE.CylinderGeometry(SLAM_HEAD.sx * 0.36, SLAM_HEAD.sx * 0.4, 0.1, 10),
      candy(0xffc84a, 0xaa6010, { ei: 0.28, metal: 0.35, rough: 0.42 })
    );
    face.position.y = -SLAM_HEAD.sy * 0.5 + 0.05;
    const stud = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.28, 0.2, 8), candy(0x6a7078, 0x22262c, { ei: 0.1, metal: 0.82, rough: 0.22 }));
    stud.position.y = -SLAM_HEAD.sy * 0.5 - 0.08;
    head.add(face, stud);
    if (slamQaDebug()) {
      const hitVis = new THREE.Mesh(
        new THREE.BoxGeometry(SLAM_HEAD.sx, SLAM_HEAD.sy, SLAM_HEAD.sz),
        new THREE.MeshBasicMaterial({ color: 0x44ff88, wireframe: true, depthTest: false, toneMapped: false })
      );
      head.add(hitVis);
    }
    arm.add(beam, wrap, head);
    const shock = new THREE.Mesh(
      new THREE.RingGeometry(0.22, 0.92, 20),
      new THREE.MeshBasicMaterial({
        color: 0xffc070,
        transparent: true,
        opacity: 0,
        depthWrite: false,
        side: THREE.DoubleSide,
        toneMapped: false,
      })
    );
    shock.rotation.x = -Math.PI / 2;
    shock.position.y = 0.04;
    group.add(post, hinge, arm, shock);
    group.userData.slam = { arm, head, shock, phase: p.z * 0.11, period: p.period || 1.45, wasPlant: false };
    group.userData.warnMat = head.material;
    group.userData.warnBase = 0.45;
    this.root.add(group);
    this.animated.push(group);
    const box = slamHitbox(0, p.x, p.z);
    const col = {
      kind: "slam",
      z: box.z,
      x: box.x,
      width: box.width,
      depth: box.depth,
      damage: p.damage || 8,
      pulse: true,
      hot: false,
      used: false,
      mesh: group,
    };
    group.userData.slam.collider = col;
    this.colliders.push(col);
  }

  _addBeam(p) {
    const group = new THREE.Group();
    group.position.set(0, 0, p.z);
    const postMat = candy(0x2a1420, 0x4a0810, { ei: 0.16, shine: 28 });
    const left = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.12, 1.5, 8), postMat);
    const right = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.12, 1.5, 8), postMat);
    left.position.set(-2.35, 0.75, 0);
    right.position.set(2.35, 0.75, 0);
    const capL = new THREE.Mesh(new THREE.SphereGeometry(0.16, 8, 6), candy(0x66f0ff, 0x2ad0ff, { ei: 0.7, shine: 100 }));
    const capR = capL.clone();
    capL.position.set(-2.35, 1.52, 0);
    capR.position.set(2.35, 1.52, 0);
    const bolt = new THREE.Mesh(new THREE.BoxGeometry(1.15, 0.12, 0.12), candy(0x7af7ff, 0x2ad0ff, { ei: 0.85, shine: 120 }));
    bolt.position.set(p.x || 0, 1.05, 0);
    group.add(left, right, capL, capR, bolt);
    group.userData.beam = { bolt, amp: p.amp || 1.7, speed: p.speed || 2.4 };
    group.userData.warnMat = bolt.material;
    group.userData.warnBase = 0.7;
    this.root.add(group);
    this.animated.push(group);
    const col = { kind: "beam", z: p.z, x: p.x || 0, width: p.width || 1.25, damage: p.damage || 7, move: true, used: false, mesh: group };
    group.userData.beam.collider = col;
    this.colliders.push(col);
  }

  _addLeech(p) {
    const amt = leechAmount(p.amount || 20);
    const group = new THREE.Group();
    group.position.set(p.x, 0.72, p.z);
    const face = new THREE.MeshBasicMaterial({
      map: makeLeechCoinTexture(amt),
      color: 0xffffff,
      toneMapped: false,
    });
    const rim = new THREE.MeshBasicMaterial({ color: 0x8a0818, toneMapped: false });
    const discGeo = new THREE.CylinderGeometry(0.52, 0.52, 0.1, 24);
    discGeo.rotateX(Math.PI / 2);
    const disc = new THREE.Mesh(discGeo, [rim, face, face]);
    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(0.54, 0.045, 8, 24),
      candy(0xff4d6d, 0xff1838, { ei: 0.55, shine: 110 })
    );
    group.add(disc, ring);
    group.userData.coinSpin = true;
    group.userData.baseY = 0.72;
    this.root.add(group);
    this.animated.push(group);
    this.colliders.push({ kind: "leech", z: p.z, x: p.x, width: 1.2, amount: amt, used: false, mesh: group });
  }

  _addSnare(p) {
    this._addPickup(p, "snare", 1.2, (icon) => {
      const paint = candy(0x6a20a0, 0x3a0860, { ei: 0.35, shine: 70 });
      const tip = candy(0xff4d6d, 0xaa1028, { ei: 0.4, shine: 80 });
      const arc = new THREE.Mesh(new THREE.TorusGeometry(0.2, 0.075, 10, 22, Math.PI), paint);
      arc.rotation.z = Math.PI;
      const legL = new THREE.Mesh(new THREE.CylinderGeometry(0.075, 0.075, 0.26, 10), paint);
      const legR = legL.clone();
      legL.position.set(-0.2, -0.13, 0);
      legR.position.set(0.2, -0.13, 0);
      const tipL = new THREE.Mesh(new THREE.BoxGeometry(0.17, 0.12, 0.17), tip);
      const tipR = tipL.clone();
      tipL.position.set(-0.2, -0.3, 0);
      tipR.position.set(0.2, -0.3, 0);
      icon.add(arc, legL, legR, tipL, tipR);
      icon.scale.setScalar(1.5);
      icon.rotation.x = -0.18;
    });
  }

  _addChaser(p) {
    const group = new THREE.Group();
    group.position.set(p.x || 0, 0, p.z);
    const sand = candy(0xc48a48, 0x8a4a18, { ei: 0.2, shine: 28 });
    const dark = candy(0x5a3010, 0x2a1408, { ei: 0.1, shine: 18 });
    const gum = candy(0xb01828, 0x6a0810, { ei: 0.28, shine: 40 });
    const ivory = candy(0xf4e8c8, 0xc8b888, { ei: 0.12, shine: 50 });
    const segs = [];
    for (let i = 0; i < 7; i++) {
      const r = 0.32 - i * 0.03;
      const seg = new THREE.Mesh(new THREE.SphereGeometry(r, 10, 8), i % 2 ? dark : sand);
      seg.position.set(0, 0.28, -i * 0.38);
      seg.scale.set(1.05, 0.78, 1.15);
      group.add(seg);
      segs.push(seg);
      const ridge = new THREE.Mesh(new THREE.TorusGeometry(r * 0.92, 0.035, 6, 12), dark);
      ridge.rotation.x = Math.PI / 2;
      ridge.position.copy(seg.position);
      group.add(ridge);
    }
    const head = new THREE.Mesh(new THREE.SphereGeometry(0.34, 12, 10), sand);
    head.position.set(0, 0.34, 0.42);
    head.scale.set(1.05, 0.88, 1.25);
    const snout = new THREE.Mesh(new THREE.ConeGeometry(0.22, 0.32, 10), sand);
    snout.rotation.x = Math.PI / 2;
    snout.position.set(0, 0.28, 0.72);
    const mouth = new THREE.Mesh(new THREE.TorusGeometry(0.14, 0.04, 8, 14), gum);
    mouth.position.set(0, 0.26, 0.86);
    const teeth = [];
    for (let i = 0; i < 8; i++) {
      const a = (i / 8) * Math.PI * 2;
      const tooth = new THREE.Mesh(new THREE.ConeGeometry(0.025, 0.09, 5), ivory);
      tooth.position.set(Math.cos(a) * 0.12, 0.26 + Math.sin(a) * 0.12, 0.88);
      tooth.rotation.x = Math.PI / 2;
      group.add(tooth);
      teeth.push(tooth);
    }
    const eyeL = new THREE.Mesh(
      new THREE.SphereGeometry(0.055, 8, 6),
      new THREE.MeshBasicMaterial({ color: 0xffe566, toneMapped: false })
    );
    const eyeR = eyeL.clone();
    eyeL.position.set(-0.14, 0.48, 0.62);
    eyeR.position.set(0.14, 0.48, 0.62);
    const lid = candy(0x3a1c08, 0x1a0c04, { ei: 0.08, shine: 16 });
    const browL = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.03, 0.06), lid);
    const browR = browL.clone();
    browL.position.set(-0.14, 0.55, 0.6);
    browR.position.set(0.14, 0.55, 0.6);
    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(0.72, 0.07, 8, 22),
      new THREE.MeshBasicMaterial({ color: 0xc4a06a, transparent: true, opacity: 0.5, depthWrite: false, toneMapped: false })
    );
    ring.rotation.x = Math.PI / 2;
    ring.position.y = 0.04;
    const glow = new THREE.Mesh(
      new THREE.SphereGeometry(0.55, 10, 8),
      new THREE.MeshBasicMaterial({
        color: 0xff6a28,
        transparent: true,
        opacity: 0.12,
        depthWrite: false,
        toneMapped: false,
      })
    );
    glow.position.set(0, 0.32, 0.35);
    group.add(head, snout, mouth, eyeL, eyeR, browL, browR, ring, glow);
    group.userData.chaserPack = true;
    group.userData.chaserSegs = segs;
    group.userData.chaserRing = ring;
    group.userData.chaserGlow = glow;
    group.userData.chaserMouth = mouth;
    group.visible = false;
    this.root.add(group);
    this.animated.push(group);
    const col = {
      kind: "chaser",
      z: p.z,
      x: p.x || 0,
      width: 1.5,
      damage: p.damage || 4,
      used: false,
      armed: false,
      mesh: group,
    };
    group.userData.col = col;
    this.colliders.push(col);
  }

  _addValley(trackLen, world) {
    const decor = world?.decor || "trees";
    const dead = decor === "dead";
    const nRock = dead ? 72 : decor === "rocks" || decor === "cacti" ? 64 : 48;
    const nPine = dead ? 26 : decor === "grove" || decor === "pines" ? 44 : decor === "rocks" ? 12 : 32;
    const nGrass = dead ? 0 : decor === "reeds" || decor === "trees" ? 62 : 40;
    const rocks = new THREE.InstancedMesh(this._rockGeo, this._rockMat, nRock);
    const pines = new THREE.InstancedMesh(this._pineGeo, this._pineMat, nPine);
    const trunks = new THREE.InstancedMesh(this._trunkGeo, this._trunkMat, nPine);
    const grass = nGrass > 0 ? new THREE.InstancedMesh(this._grassGeo, this._grassMat, nGrass) : null;
    rocks.frustumCulled = false;
    pines.frustumCulled = false;
    trunks.frustumCulled = false;
    if (grass) grass.frustumCulled = false;
    const spread = decor === "lagoon" ? 0.9 : 0.72;
    for (let i = 0; i < nRock; i++) {
      const side = i % 2 === 0 ? -1 : 1;
      const x = side * (6.85 + (i % 5) * spread);
      const z = 2 + (i / nRock) * (trackLen + 8);
      this._dummy.position.set(x, 0.28 + (i % 3) * 0.08, z);
      this._dummy.rotation.set(0.2 * (i % 3), i * 0.7, 0.15);
      this._dummy.scale.setScalar((dead ? 0.95 : decor === "crystals" ? 0.55 : 0.7) + (i % 4) * 0.22);
      this._dummy.updateMatrix();
      rocks.setMatrixAt(i, this._dummy.matrix);
    }
    for (let i = 0; i < nPine; i++) {
      const side = i % 2 === 0 ? 1 : -1;
      const x = side * (7.35 + (i % 4) * 0.62);
      const z = 6 + (i / nPine) * (trackLen + 4);
      const cactus = decor === "cacti";
      const crystal = decor === "crystals";
      const palm = decor === "palms";
      this._dummy.position.set(x, cactus ? 1.45 : crystal ? 0.95 : dead ? 1.05 : 1.18, z);
      this._dummy.rotation.set(dead ? 0.35 : 0, i * 0.4, dead ? 0.42 + (i % 3) * 0.14 : crystal ? 0.2 : 0.04 * (i % 3));
      if (cactus) this._dummy.scale.set(0.45, 2.1 + (i % 3) * 0.25, 0.45);
      else if (crystal) this._dummy.scale.set(0.55, 1.8 + (i % 4) * 0.3, 0.55);
      else if (palm) this._dummy.scale.set(1.6, 0.85, 1.6);
      else if (dead) this._dummy.scale.set(0.48, 1.55 + (i % 3) * 0.45, 0.42);
      else this._dummy.scale.set(1.2 + (i % 3) * 0.18, 1.4 + (i % 4) * 0.22, 1.15);
      this._dummy.updateMatrix();
      pines.setMatrixAt(i, this._dummy.matrix);
      this._dummy.position.y = 0.16;
      this._dummy.scale.set(cactus ? 0.7 : 1, cactus ? 1.4 : 1, cactus ? 0.7 : 1);
      this._dummy.updateMatrix();
      trunks.setMatrixAt(i, this._dummy.matrix);
    }
    for (let i = 0; i < nGrass; i++) {
      const side = i % 2 === 0 ? -1 : 1;
      const x = side * (4.95 + (i % 6) * 0.18);
      const z = 1 + (i / nGrass) * trackLen;
      this._dummy.position.set(x, 0.12, z);
      this._dummy.rotation.set(0, i, 0.2);
      this._dummy.scale.setScalar((decor === "reeds" ? 1.1 : 0.7) + (i % 3) * 0.2);
      this._dummy.updateMatrix();
      grass.setMatrixAt(i, this._dummy.matrix);
    }
    this._dummy.scale.setScalar(1);
    this._dummy.rotation.set(0, 0, 0);
    this.root.add(rocks, pines, trunks);
    if (nGrass > 0) this.root.add(grass);
    this._valleyRocks = rocks;
    this._valleyPines = pines;
    this._valleyTrunks = trunks;
    this._valleyGrass = grass;
    pines.userData.spinCrystals = decor === "crystals";
  }

  _addCoin(p) {
    const group = new THREE.Group();
    group.position.set(p.x, 0.72, p.z);
    const face = new THREE.MeshBasicMaterial({
      map: this._coin,
      color: 0xffe566,
      toneMapped: false,
    });
    const rim = new THREE.MeshBasicMaterial({
      color: 0xffc107,
      toneMapped: false,
    });
    const discGeo = new THREE.CylinderGeometry(0.48, 0.48, 0.07, 20);
    discGeo.rotateX(Math.PI / 2);
    const disc = new THREE.Mesh(discGeo, [rim, face, face]);
    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(0.48, 0.03, 8, 22),
      candy(0xffe566, 0xffc107, { ei: 0.45, shine: 120 })
    );
    group.add(disc, ring);
    group.userData.coinSpin = true;
    group.userData.spinT = 0;
    group.userData.baseY = 0.72;
    this.root.add(group);
    this.animated.push(group);
    this.colliders.push({ kind: "coin", z: p.z, x: p.x, width: 1.05, amount: p.amount || 6, used: false, mesh: group });
  }

  _addBoost(p) {
    this._addPickup(p, "boost", 1.15, (icon) => {
      const mat = candy(0x7af7ff, 0x2ad0ff, { ei: 0.7, shine: 110 });
      const body = new THREE.Mesh(new THREE.CapsuleGeometry(0.13, 0.22, 4, 10), mat);
      const nose = new THREE.Mesh(new THREE.ConeGeometry(0.15, 0.26, 10), mat);
      nose.position.y = 0.32;
      const ring = new THREE.Mesh(new THREE.TorusGeometry(0.2, 0.035, 8, 16), mat);
      ring.rotation.x = Math.PI / 2;
      ring.position.y = -0.12;
      const finL = new THREE.Mesh(new THREE.ConeGeometry(0.07, 0.16, 6), mat);
      finL.rotation.z = 0.9;
      finL.position.set(-0.12, -0.16, 0);
      const finR = new THREE.Mesh(new THREE.ConeGeometry(0.07, 0.16, 6), mat);
      finR.rotation.z = -0.9;
      finR.position.set(0.12, -0.16, 0);
      icon.add(body, nose, ring, finL, finR);
    });
  }

  _addShield(p) {
    this._addPickup(p, "shield", 1.15, (icon) => {
      const paint = candy(0x3ad0e8, 0x1488a8, { ei: 0.4, shine: 95, metal: 0.35, rough: 0.32 });
      const rim = candy(0xffe08a, 0xc89020, { ei: 0.45, shine: 110, metal: 0.55, rough: 0.28 });
      const boss = candy(0xf4f8ff, 0x8ad4e8, { ei: 0.55, shine: 120 });
      const sh = new THREE.Shape();
      sh.moveTo(0, 0.36);
      sh.quadraticCurveTo(0.3, 0.3, 0.27, 0.04);
      sh.quadraticCurveTo(0.2, -0.2, 0, -0.36);
      sh.quadraticCurveTo(-0.2, -0.2, -0.27, 0.04);
      sh.quadraticCurveTo(-0.3, 0.3, 0, 0.36);
      const plate = new THREE.Mesh(
        new THREE.ExtrudeGeometry(sh, {
          depth: 0.07,
          bevelEnabled: true,
          bevelThickness: 0.018,
          bevelSize: 0.016,
          bevelSegments: 2,
          curveSegments: 12,
        }),
        paint
      );
      plate.geometry.center();
      plate.position.z = -0.035;
      const edge = new THREE.Mesh(new THREE.TorusGeometry(0.3, 0.028, 8, 24), rim);
      edge.scale.set(1, 1.18, 1);
      const gem = new THREE.Mesh(new THREE.SphereGeometry(0.08, 10, 8), boss);
      gem.position.z = 0.06;
      const barH = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.045, 0.04), rim);
      const barV = new THREE.Mesh(new THREE.BoxGeometry(0.045, 0.26, 0.04), rim);
      barH.position.z = 0.05;
      barV.position.z = 0.05;
      icon.add(plate, edge, gem, barH, barV);
      icon.scale.setScalar(1.15);
    });
  }

  _addMagnet(p) {
    this._addPickup(p, "magnet", 1.2, (icon) => {
      const red = candy(0xe01828, 0x8a0810, { ei: 0.28, shine: 62, metal: 0.22, rough: 0.42 });
      const silver = candy(0xe8eef4, 0x6a7a88, { ei: 0.18, shine: 120, metal: 0.78, rough: 0.22 });
      const arc = new THREE.Mesh(new THREE.TorusGeometry(0.17, 0.055, 10, 18, Math.PI), red);
      arc.rotation.z = Math.PI;
      const legL = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.055, 0.16, 10), red);
      const legR = legL.clone();
      legL.position.set(-0.17, -0.08, 0);
      legR.position.set(0.17, -0.08, 0);
      const capL = new THREE.Mesh(new THREE.CylinderGeometry(0.062, 0.062, 0.09, 10), silver);
      const capR = capL.clone();
      capL.position.set(-0.17, -0.2, 0);
      capR.position.set(0.17, -0.2, 0);
      icon.add(arc, legL, legR, capL, capR);
      icon.scale.setScalar(1.22);
      icon.rotation.x = -0.12;
    });
  }

  _addToken(p, kind, color, emissive) {
    this._addPickup(p, kind, 1.2, (icon) => {
      const mat = candy(color, emissive, { ei: 0.62, shine: 100 });
      if (kind === "star") {
        const gem = new THREE.Mesh(new THREE.OctahedronGeometry(0.34), mat);
        gem.rotation.z = Math.PI / 4;
        const ring = new THREE.Mesh(new THREE.TorusGeometry(0.3, 0.03, 8, 18), mat);
        ring.rotation.x = Math.PI / 2;
        icon.add(gem, ring);
      } else {
        const core = new THREE.Mesh(new THREE.SphereGeometry(0.28, 14, 12), mat);
        const orbA = new THREE.Mesh(new THREE.SphereGeometry(0.12, 10, 8), mat);
        const orbB = new THREE.Mesh(new THREE.SphereGeometry(0.1, 10, 8), mat);
        orbA.position.set(0.26, 0.1, 0.08);
        orbB.position.set(-0.22, -0.08, 0.1);
        icon.add(core, orbA, orbB);
      }
    }, p.amount || 8);
  }

  _addPickup(p, kind, width, buildIcon, amount) {
    const group = new THREE.Group();
    group.position.set(p.x, 0, p.z);
    const stand = this._pedestal();
    stand.position.y = 0.06;
    const icon = new THREE.Group();
    icon.position.y = 0.68;
    buildIcon(icon);
    group.userData.bobIcon = icon;
    group.add(this._groundMark(0.4), stand, icon);
    this.root.add(group);
    this.animated.push(group);
    this.colliders.push({ kind, z: p.z, x: p.x, width, amount, used: false, mesh: group });
  }

  _addArmy(p, finish = false) {
    const count = finish ? p.hp : p.count;
    const group = new THREE.Group();
    group.position.set(p.x || 0, 0, p.z);
    const max = 32;
    const cloth = finish ? this._rivalBossMat : this._rivalMat;
    const plate = finish ? this._armorBossMat : this._armorMat;
    const bodies = new THREE.InstancedMesh(this._cutterBodyGeo, cloth, max);
    const armors = new THREE.InstancedMesh(this._cutterArmorGeo, plate, max);
    const heads = new THREE.InstancedMesh(this._cutterHeadGeo, this._headMat, max);
    const helms = new THREE.InstancedMesh(this._cutterHelmGeo, this._helmMat, max);
    const swords = new THREE.InstancedMesh(this._cutterSwordGeo, this._swordMat, max);
    const legsL = new THREE.InstancedMesh(this._cutterLegGeo, cloth, max);
    const legsR = new THREE.InstancedMesh(this._cutterLegGeo, cloth, max);
    for (const mesh of [bodies, armors, heads, helms, swords, legsL, legsR]) {
      mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
      mesh.frustumCulled = false;
    }
    const shown = Math.min(max, Math.max(1, count));
    const offsets = [];
    for (let i = 0; i < max; i++) offsets.push(sepoyOffset(i));
    this._layoutCutters({ bodies, armors, heads, helms, swords, legsL, legsR }, offsets, shown, 0, false, false);
    group.add(bodies, armors, heads, helms, swords, legsL, legsR);
    const badge = makeRivalBadge(count, finish);
    const label = new THREE.Mesh(
      new THREE.PlaneGeometry(1.7, 0.85),
      new THREE.MeshBasicMaterial({ map: badge, transparent: true, depthWrite: false })
    );
    label.position.set(0, 2.15, 0.22);
    group.add(label);
    group.userData.armyPack = true;
    this.root.add(group);
    this.animated.push(group);
    const col = {
      kind: finish ? "finish" : "army",
      z: p.z,
      x: p.x || 0,
      homeX: p.x || 0,
      homeZ: p.z,
      width: 2.8,
      count,
      hp: p.hp,
      used: false,
      mesh: group,
      units: bodies,
      armors,
      heads,
      helms,
      swords,
      legsL,
      legsR,
      label,
      badge,
      offsets,
      finish,
      charging: false,
      fighting: false,
      staggerT: 0,
      dying: [],
    };
    this.colliders.push(col);
    this.armies.push(col);
    group.userData.col = col;
    if (finish) this.doorPieces = [group];
    return col;
  }

  _addBeast(p, finish = false) {
    const hp = Math.max(1, (p.hp || p.count || 8) | 0);
    const group = new THREE.Group();
    group.position.set(p.x || 0, 0, p.z);
    const cursed = this._world?.id === "crown";
    const body = buildWarden({ cursed });
    const epic = this._levelId === 56;
    const baseScale = finish && epic ? 1.88 : finish ? 1.4 : 1.22;
    body.userData.baseScale = baseScale;
    body.userData.hpMul = 1;
    body.scale.setScalar(baseScale);
    group.add(body);
    if (cursed) {
      const shadow = new THREE.Mesh(
        new THREE.CircleGeometry(finish ? 4.6 : 2.8, 22),
        new THREE.MeshBasicMaterial({ color: 0x050208, transparent: true, opacity: 0.62, depthWrite: false })
      );
      shadow.rotation.x = -Math.PI / 2;
      shadow.position.set(0.15, 0.03, 0.35);
      shadow.scale.set(finish && epic ? 1.55 : finish ? 1.25 : 1, 1, 0.72);
      group.add(shadow);
    }
    const badge = makeBeastBadge(hp);
    const label = new THREE.Mesh(
      new THREE.PlaneGeometry(1.7, 0.85),
      new THREE.MeshBasicMaterial({ map: badge, transparent: true, depthWrite: false })
    );
    label.position.set(0, finish && epic ? 3.2 : 2.35, 0.35);
    group.add(label);
    group.userData.armyPack = true;
    this.root.add(group);
    this.animated.push(group);
    const col = {
      kind: finish ? "finish" : "beast",
      z: p.z,
      x: p.x || 0,
      homeX: p.x || 0,
      homeZ: p.z,
      width: 2.6,
      count: hp,
      hp,
      used: false,
      mesh: group,
      beast: true,
      beastBody: body,
      wardenArm: body.userData.wardenArm,
      wardenCleaver: body.userData.wardenCleaver,
      wardenLegs: body.userData.wardenLegs,
      wardenCape: body.userData.wardenCape,
      wardenTorso: body.userData.wardenTorso,
      label,
      badge,
      finish,
      charging: false,
      fighting: false,
      wardenT: 0,
      wardenSeq: 0,
      wardenAtk: null,
      wardenClip: null,
      wardenCue: null,
    };
    this.colliders.push(col);
    this.armies.push(col);
    group.userData.col = col;
    if (finish) this.doorPieces = [group];
    return col;
  }

  _layoutCutters(parts, offsets, shown, t, opts = {}) {
    const { bodies, armors, heads, helms, swords, legsL, legsR } = parts;
    const fighting = typeof opts === "boolean" ? opts : !!opts.fighting;
    const charging = typeof opts === "boolean" ? !!arguments[5] : !!opts.charging;
    const regroup = !!opts.regroup;
    const reduceMotion = !!opts.reduceMotion;
    const lookX = opts.lookX || 0;
    const lookZ = opts.lookZ || -2;
    const stagger = opts.stagger || 0;
    const dying = opts.dying || [];
    const live = Math.min(32, Math.max(0, shown));
    const deathN = Math.min(dying.length, 32 - live);
    const vis = live + deathN;
    const mode = fighting ? "slash" : regroup ? "retreat" : charging ? "charge" : "idle";
    const frozen = reduceMotion ? 0 : t;
    for (let i = 0; i < vis; i++) {
      const dead = i >= live;
      const slot = dead ? dying[i - live] : offsets[i];
      if (!slot) continue;
      const lookYaw = dead ? 0 : Math.atan2(lookX - slot.x, Math.max(0.4, -(lookZ - slot.z)));
      const pose = sepoyPose({
        mode: dead ? "death" : mode,
        t: dead ? slot.age : frozen,
        phase: slot.phase || i * 0.73,
        lookYaw,
        stagger: dead ? 0 : stagger,
      });
      const x = slot.x + pose.x;
      const y = pose.y;
      const z = slot.z + pose.z;
      this._dummy.position.set(x, y, z);
      this._dummy.rotation.set(pose.rx, pose.ry, pose.rz);
      this._dummy.scale.set(pose.scale, pose.scale * pose.chest, pose.scale);
      this._dummy.updateMatrix();
      bodies.setMatrixAt(i, this._dummy.matrix);
      armors.setMatrixAt(i, this._dummy.matrix);
      this._dummy.scale.setScalar(pose.scale);
      this._dummy.rotation.set(pose.rx + pose.headPitch, pose.ry + pose.headYaw * 0.65, pose.rz);
      this._dummy.updateMatrix();
      heads.setMatrixAt(i, this._dummy.matrix);
      helms.setMatrixAt(i, this._dummy.matrix);
      const lg = pose.legL;
      this._dummy.position.set(x + lg.x, lg.y + y * 0.2, z + lg.z);
      this._dummy.rotation.set(lg.rx, lg.ry, lg.rz);
      this._dummy.updateMatrix();
      legsL.setMatrixAt(i, this._dummy.matrix);
      const rg = pose.legR;
      this._dummy.position.set(x + rg.x, rg.y + y * 0.2, z + rg.z);
      this._dummy.rotation.set(rg.rx, rg.ry, rg.rz);
      this._dummy.updateMatrix();
      legsR.setMatrixAt(i, this._dummy.matrix);
      const sw = pose.sword;
      this._dummy.position.set(x + sw.x, sw.y, z + sw.z);
      this._dummy.rotation.set(sw.rx, sw.ry, sw.rz);
      this._dummy.updateMatrix();
      swords.setMatrixAt(i, this._dummy.matrix);
    }
    for (const mesh of [bodies, armors, heads, helms, swords, legsL, legsR]) {
      if (!mesh) continue;
      mesh.count = vis;
      mesh.instanceMatrix.needsUpdate = true;
    }
  }

  _cutterOpts(col, t, extra = {}) {
    return {
      fighting: !!col.fighting,
      charging: !!col.charging,
      regroup: (col.regroupT || 0) > 0,
      stagger: col.staggerT || 0,
      dying: col.dying || [],
      lookX: extra.lookX || 0,
      lookZ: extra.lookZ || -2,
      reduceMotion: !!extra.reduceMotion,
    };
  }

  setArmyCount(col, n) {
    if (!col) return;
    const prev = col.count | 0;
    col.count = Math.max(0, n | 0);
    const vis = Math.min(32, col.count);
    if (col.beast && col.beastBody) {
      const max = Math.max(1, col.hp || 1);
      col.beastBody.userData.hpMul = col.count / max;
    }
    if (!col.beast && col.offsets && col.count < prev) {
      col.staggerT = SEPOY_ANIM.stagger;
      col.dying = col.dying || [];
      const died = Math.min(4, prev - col.count);
      for (let k = 0; k < died; k++) {
        const o = col.offsets[Math.min(31, col.count + k)] || sepoyOffset(col.count + k);
        col.dying.push({ x: o.x, z: o.z, phase: o.phase, age: 0 });
        this.playDust((col.x || 0) + o.x, (col.z || 0) + o.z);
      }
    }
    if (col.units && col.armors && col.helms && col.swords && col.legsL && col.offsets) {
      this._layoutCutters(
        { bodies: col.units, armors: col.armors, heads: col.heads, helms: col.helms, swords: col.swords, legsL: col.legsL, legsR: col.legsR },
        col.offsets,
        vis,
        performance.now() * 0.001,
        this._cutterOpts(col, 0)
      );
    }
    if (col.label && !col.fighting) {
      col.badge?.dispose?.();
      col.badge = col.beast ? makeBeastBadge(col.count) : makeRivalBadge(col.count, !!col.finish);
      col.label.material.map = col.badge;
      col.label.material.needsUpdate = true;
    } else if (col.fighting && col.beast) {
      // #region agent log
      if (!col._badgeSkipLog) {
        col._badgeSkipLog = true;
        fetch("http://127.0.0.1:7879/ingest/57d34612-807f-4bf9-bc3c-727e6fc79cef", {
          method: "POST",
          headers: { "Content-Type": "application/json", "X-Debug-Session-Id": "07c109" },
          body: JSON.stringify({
            sessionId: "07c109",
            runId: "warden",
            hypothesisId: "W3",
            location: "LevelWorld.js:setArmyCount",
            message: "skip beast badge rebuild in fight",
            data: { count: col.count, hp: col.hp || 0 },
            timestamp: Date.now(),
          }),
        }).catch(() => {});
      }
      // #endregion
    }
  }

  _trimCutFx(max = 8) {
    while (this.cutFx.length >= max) {
      const fx = this.cutFx.shift();
      fx.geometry?.dispose?.();
      fx.material?.dispose?.();
      fx.removeFromParent();
    }
  }

  playShock(x, z) {
    this._trimCutFx();
    const ring = new THREE.Mesh(
      new THREE.RingGeometry(0.22, 0.55, 28),
      new THREE.MeshBasicMaterial({
        color: 0xffe18a,
        transparent: true,
        opacity: 0.88,
        toneMapped: false,
        side: THREE.DoubleSide,
        depthWrite: false,
      })
    );
    ring.rotation.x = -Math.PI / 2;
    ring.position.set(x, 0.05, z);
    ring.userData.life = 0.45;
    ring.userData.shock = true;
    this.root.add(ring);
    this.cutFx.push(ring);
  }

  playCut(x, y, z, big = false) {
    this._trimCutFx();
    const spin = big === "spin";
    const r = spin ? 1.35 : big ? 0.85 : 0.42;
    const tube = spin ? 0.055 : big ? 0.045 : 0.028;
    const arc = new THREE.Mesh(
      new THREE.TorusGeometry(r, tube, 6, 18, Math.PI * 0.85),
      new THREE.MeshBasicMaterial({ color: 0xfff0b0, transparent: true, opacity: 0.95, toneMapped: false, side: THREE.DoubleSide })
    );
    arc.position.set(x, y, z);
    arc.rotation.set(0.2, 0, -0.4 + Math.random() * 0.5);
    arc.userData.life = 0.22;
    this.root.add(arc);
    this.cutFx.push(arc);
    this._cutSpawn = (this._cutSpawn || 0) + 1;
    // #region agent log
    if (this._cutSpawn % 12 === 1) {
      fetch("http://127.0.0.1:7879/ingest/57d34612-807f-4bf9-bc3c-727e6fc79cef", {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-Debug-Session-Id": "07c109" },
        body: JSON.stringify({
          sessionId: "07c109",
          runId: "warden",
          hypothesisId: "W2",
          location: "LevelWorld.js:playCut",
          message: "cut fx spawn",
          data: { cutFx: this.cutFx.length, cutSpawn: this._cutSpawn, big: !!big },
          timestamp: Date.now(),
        }),
      }).catch(() => {});
    }
    // #endregion
  }

  playPunch(x, y, z) {
    this._trimCutFx();
    const blob = new THREE.Mesh(
      new THREE.SphereGeometry(0.16, 8, 8),
      new THREE.MeshBasicMaterial({ color: 0x2ec8d4, transparent: true, opacity: 0.85, toneMapped: false })
    );
    blob.position.set(x, y, z);
    blob.userData.life = 0.18;
    blob.userData.punch = true;
    this.root.add(blob);
    this.cutFx.push(blob);
  }

  playDust(x, z) {
    this._trimCutFx();
    const puff = new THREE.Mesh(
      new THREE.SphereGeometry(0.18, 8, 6),
      new THREE.MeshBasicMaterial({ color: 0xc4b48a, transparent: true, opacity: 0.7, toneMapped: false })
    );
    puff.position.set(x, 0.08, z);
    puff.userData.life = 0.4;
    puff.userData.punch = true;
    this.root.add(puff);
    this.cutFx.push(puff);
  }

  _addFinish(p) {
    const lineGeo = new THREE.CylinderGeometry(0.07, 0.07, 8.2, 10);
    lineGeo.rotateZ(Math.PI / 2);
    const line = new THREE.Mesh(lineGeo, candy(0xffe566, 0xffaa00, { ei: 0.65, shine: 100 }));
    line.position.set(0, 0.08, p.z + 1.2);
    const pylonMat = candy(0xffe08a, 0xffaa00, { ei: 0.4, shine: 80 });
    const left = new THREE.Mesh(new THREE.CapsuleGeometry(0.09, 0.7, 4, 8), pylonMat);
    left.position.set(-4.05, 0.45, p.z + 1.2);
    const right = new THREE.Mesh(new THREE.CapsuleGeometry(0.09, 0.7, 4, 8), pylonMat);
    right.position.set(4.05, 0.45, p.z + 1.2);
    this.root.add(line, left, right);
    if (p.beast) this._addBeast(p, true);
    else this._addArmy(p, true);
  }

  applyDecor(world) {
    if (!world || !this._pineMat) return;
    const crystal = world.decor === "crystals";
    this._pineMat.color.setHex(world.pine);
    this._pineMat.emissive.setHex(world.pineEm || 0x000000);
    this._pineEi = world.pineEi ?? 0.08;
    this._pineMat.emissiveIntensity = this._pineEi;
    this._pineMat.metalness = crystal ? 0.9 : 0.08;
    this._pineMat.roughness = crystal ? 0.2 : 0.68;
    this._rockMat.color.setHex(world.rock);
    this._rockMat.emissive.setHex(world.rockEm || 0x000000);
    this._rockEi = world.rockEi ?? 0.04;
    this._rockMat.emissiveIntensity = this._rockEi;
    this._rockMat.metalness = crystal ? 0.55 : world.id === "lagoon" ? 0.22 : 0.1;
    this._rockMat.roughness = crystal ? 0.28 : world.id === "lagoon" ? 0.42 : 0.78;
    this._trunkMat.color.setHex(world.trunk);
    this._grassMat.color.setHex(world.tuft);
    this._grassMat.emissive.setHex(world.pineEm || 0x145820);
    this._grassMat.emissiveIntensity = Math.min(0.22, (world.pineEi || 0.08) * 0.45);
    this._glowPulse = (this._pineEi > 0.14 || this._rockEi > 0.14) && world.id !== "meadow";
    if (this._valleyPines) this._valleyPines.userData.spinCrystals = crystal;
  }

  smashDoor() {
    for (const p of this.doorPieces) p.userData.smash = true;
  }

  flareWarden() {
    this._wardenFlash = 1;
  }

  _tickWarden(col, dt, t, reduceMotion) {
    const body = col.beastBody;
    if (!body) return;
    col.wardenT = (col.wardenT || 0) + dt;
    let mode = "idle";
    let clipT = col.wardenT;
    if (col.wardenClip) {
      col.wardenClip.t += dt;
      mode = col.wardenClip.mode;
      clipT = col.wardenClip.t;
      const dur = wardenClipDuration(mode);
      if (clipT >= dur) {
        if (mode === "victory" || mode === "defeat") clipT = dur;
        else {
          col.wardenClip = null;
          if (col.fighting) {
            const names = ["cleave", "spin", "slam"];
            col.wardenSeq = (col.wardenSeq || 0) + 1;
            col.wardenAtk = { mode: names[col.wardenSeq % 3], t: 0 };
          }
        }
      }
    }
    if (!col.wardenClip) {
      if (col.fighting) {
        const names = ["cleave", "spin", "slam"];
        if (!col.wardenAtk) {
          col.wardenAtk = { mode: names[col.wardenSeq % 3], t: 0 };
        }
        col.wardenAtk.t += dt;
        const hold = 0.12;
        if (col.wardenAtk.t >= wardenClipDuration(col.wardenAtk.mode) + hold) {
          col.wardenSeq = (col.wardenSeq || 0) + 1;
          col.wardenAtk = { mode: names[col.wardenSeq % 3], t: 0 };
        }
        mode = col.wardenAtk.mode;
        clipT = col.wardenAtk.t;
      } else if (col.charging) {
        mode = "walk";
        clipT = col.wardenT;
      } else {
        mode = "idle";
        clipT = col.wardenT;
      }
    }
    if (reduceMotion) {
      applyWardenPose(body, wardenPose({ mode: "idle", t: 0 }), 1);
      return;
    }
    const pose = wardenPose({ mode, t: clipT });
    const snap = mode === "defeat" || mode === "victory" || mode === "stagger";
    applyWardenPose(body, pose, snap ? 1 : mode === "idle" ? 0.12 : 0.32);
    if (pose.sfx && col._sfxLatched !== pose.sfx) {
      col._sfxLatched = pose.sfx;
      col.wardenCue = pose.sfx;
    } else if (!pose.sfx) col._sfxLatched = null;
    if (pose.step && !col._stepLatched) {
      col._stepLatched = true;
      if (!col.wardenCue) col.wardenCue = "step";
    } else if (!pose.step) col._stepLatched = false;
    col._trailWait = Math.max(0, (col._trailWait || 0) - dt);
    if (pose.trail && col._trailWait <= 0) {
      col._trailWait = 0.18;
      this.playCut(col.x || 0, 1.05, (col.z || 0) + 0.15, mode === "spin" ? "spin" : true);
    }
    if (pose.shock && !col._shockLatched) {
      col._shockLatched = true;
      this.playShock(col.x || 0, col.z || 0);
      col.wardenCue = "slam";
    } else if (!pose.shock) col._shockLatched = false;
  }

  tick(dt, reduceMotion, crowdZ = 0, camera = null, crowdX = 0, speed = 7) {
    const t = performance.now() * 0.001;
    if (this._grid) {
      this._grid.offset.y = -crowdZ * 0.12;
      this._grid.offset.x = 0;
    }
    if (this._valleyPines?.userData.spinCrystals && !reduceMotion) {
      this._valleyPines.rotation.y += dt * 0.22;
    }
    if (this._glowPulse && !reduceMotion) {
      const pulse = 0.72 + 0.28 * (0.5 + 0.5 * Math.sin(t * 2.15));
      this._pineMat.emissiveIntensity = this._pineEi * pulse;
      this._rockMat.emissiveIntensity = this._rockEi * pulse;
    }
    for (const o of this.animated) {
      if (o.userData.collectT > 0) {
        o.userData.collectT -= dt;
        const u = Math.max(0, o.userData.collectT);
        const kind = o.userData.collectKind || "suck";
        if (kind === "suck") {
          o.position.x += (crowdX - o.position.x) * Math.min(1, dt * 16);
          o.position.z += (crowdZ + 0.2 - o.position.z) * Math.min(1, dt * 16);
          o.position.y += dt * 3.4;
          const s = Math.max(0.04, u * 2.6);
          o.scale.set(s, s * (1.15 + (0.42 - u)), s);
          o.rotation.y += dt * 22;
        } else if (kind === "pop") {
          o.position.y += dt * 2.2;
          o.rotation.y += dt * 10;
          const s = Math.max(0.05, u * 2.4);
          o.scale.setScalar(s);
        } else if (kind === "punch") {
          const k = 1 - u / 0.34;
          o.scale.set(1 + k * 0.55, Math.max(0.06, 1 - k * 1.15), 1 + k * 0.55);
          o.position.y += dt * 2.4;
          o.rotation.z += dt * 8 * k;
        } else {
          o.scale.multiplyScalar(Math.max(0.15, 1 - dt * 7));
          o.position.y += dt * 0.8;
        }
        if (u <= 0) o.visible = false;
        continue;
      }
      const dz = o.position.z - crowdZ;
      const near = dz > -6 && dz < 24;
      const warn = dz < 10 && dz > 0.4;
      if (o.userData.warnMat) {
        o.userData.warnMat.emissiveIntensity = (o.userData.warnBase || 0.4) + (warn ? 0.55 : 0);
      }
      o.userData.warn = warn;
      if (o.userData.spinZ && near) {
        o.rotation.z += dt * (o.userData.spinSpeed || 8) * (reduceMotion ? 0.28 : warn ? 1.15 : 1);
      }
      if (o.userData.spin && near) {
        o.rotation.x += dt * (reduceMotion ? 2.4 : warn ? 16 : 10);
      }
      if (o.userData.spinSpeed && o.userData.rotorY != null && near) {
        o.userData.rotorY += dt * (o.userData.spinSpeed || 5.4) * (reduceMotion ? 0.3 : warn ? 1.2 : 1);
      }
      if (o.userData.blackHole && near) {
        o.userData.suckT = Math.max(0, (o.userData.suckT || 0) - dt);
        const spin = reduceMotion ? 1.2 : 2.4 + (o.userData.suckT > 0 ? 7 : warn ? 2.2 : 0);
        o.userData.swirl.rotation.z += dt * spin;
        o.userData.swirl2.rotation.z -= dt * spin * 0.72;
        if (o.userData.debris) o.userData.debris.rotation.y += dt * (reduceMotion ? 1 : 3.4 + o.userData.suckT * 6);
        const gulp = 1 + Math.sin(t * 7 + o.position.z) * 0.04 + o.userData.suckT * 0.18;
        o.userData.swirl.scale.setScalar(gulp);
        o.userData.swirl2.scale.setScalar(0.92 + o.userData.suckT * 0.2);
        const pulse = 0.55 + Math.sin(t * 5.5 + o.position.z) * 0.18 + o.userData.suckT * 0.4;
        if (o.userData.rim?.material) o.userData.rim.material.emissiveIntensity = pulse;
        if (o.userData.glow?.material) o.userData.glow.material.emissiveIntensity = 0.4 + pulse * 0.35;
      }
      if (o.userData.gateBob) {
        const kind = o.userData.gateKind;
        const bx = o.userData.baseScaleX || 1;
        if (o.userData.dimT > 0) {
          o.userData.dimT = Math.max(0, o.userData.dimT - dt);
        }
        const dim = o.userData.dimT > 0 ? 0.5 : 1;
        if (o.userData.hitT > 0) {
          o.userData.hitT = Math.max(0, o.userData.hitT - dt);
          const elapsed = 0.3 - o.userData.hitT;
          const hitS = elapsed < 0.1 ? 1.2 : 1.2 + (1 - 1.2) * Math.min(1, (elapsed - 0.1) / 0.2);
          if (o.userData.hitGood) {
            o.scale.set(bx * hitS, hitS * 1.08, hitS);
            o.position.y = 0.14 * Math.max(0, 1 - elapsed / 0.3);
          } else {
            o.scale.set(bx * hitS * 1.08, hitS * 0.78, hitS * 1.1);
            o.position.y = -0.05;
          }
          if (o.userData.hitT <= 0) {
            o.userData.spent = true;
            o.scale.set(bx, 1, 1);
            o.position.y = 0;
          }
        } else if (reduceMotion) {
          o.scale.set(bx, 1, 1);
          o.position.y = 0;
          o.rotation.y = 0;
        } else if (o.userData.spent) {
          o.scale.set(bx, 1, 1);
          o.position.y = 0;
          o.rotation.y = 0;
        } else if (near) {
          o.userData.spawnT = Math.min(0.22, (o.userData.spawnT || 0) + dt);
          const born = 0.84 + 0.16 * Ease.quadOut(o.userData.spawnT / 0.22);
          o.rotation.y = 0;
          let pulse = 1;
          if (kind === "trap") {
            const eta = dz / Math.max(2.2, speed);
            const period = eta < 1 ? 0.4 : 0.8;
            pulse = 0.98 + 0.04 * (0.5 + 0.5 * Math.sin((t * Math.PI * 2) / period + o.position.z));
            if (o.userData.trapFlash) {
              const flare = 1 - Math.max(0, Math.min(1, dz / 14));
              o.userData.trapFlash.color.setHex(flare > 0.55 ? 0xffee66 : 0xffd54a);
            }
            if (o.userData.glowRim) {
              o.userData.glowRim.emissiveIntensity = (kind === "bad" ? 0.5 : 0.72) + 0.3 * Math.sin(t * 3.8 + o.position.z);
            }
          }
          const sx = bx * born * pulse;
          o.scale.set(sx, born * pulse, born * pulse);
          o.position.y = 0;
        } else {
          o.scale.set(bx * 0.84, 0.84, 0.84);
          o.rotation.y = 0;
        }
      }
      if (o.userData.bobIcon && near && !reduceMotion) {
        const icon = o.userData.bobIcon;
        icon.position.y = 0.68 + Math.sin(t * 3.2 + o.position.z) * 0.08;
        icon.rotation.y += dt * 1.6;
      }
      if (o.userData.coinSpin && near) {
        o.userData.spinT = (o.userData.spinT || 0) + dt * (reduceMotion ? 1.2 : 4.2);
        if (o.userData.baseY != null) o.position.y = o.userData.baseY + Math.sin(t * 3.2 + o.position.z) * 0.08;
        if (camera) {
          o.lookAt(camera.position);
          o.rotateY(Math.PI);
          o.rotateZ(o.userData.spinT);
        } else if (!reduceMotion) o.rotation.y += dt * 3.6;
      }
      if (o.userData.crush) {
        const u = o.userData.crush;
        const cycle = ((t * (1 / u.period) + u.phase) % 1 + 1) % 1;
        let close = 0.08;
        if (cycle > 0.42 && cycle < 0.55) close = 0.2 + (cycle - 0.42) * 4;
        else if (cycle >= 0.55 && cycle < 0.78) close = 0.85;
        else if (cycle >= 0.78 && cycle < 0.9) close = 0.85 - (cycle - 0.78) * 5;
        const gap = 1.38 - close * 0.95;
        u.left.position.x = -gap;
        u.right.position.x = gap;
        u.lipL.position.x = -gap + 0.48;
        u.lipR.position.x = gap - 0.48;
        if (u.collider) u.collider.width = 2.7 - gap * 1.15;
      }
      if (o.userData.armyPack && dz > -5 && dz < 16) {
        const col = o.userData.col;
        if (col && !col.used && !col.fighting) {
          if (dz < 11 && dz > 2.1) {
            col.charging = true;
            o.position.x += (crowdX - o.position.x) * Math.min(1, dt * 4.4);
            o.position.z -= dt * 3.6;
            col.x = o.position.x;
            col.z = o.position.z;
          }
        }
        if (col?.units && col.armors && col.helms && col.swords && col.legsL && col.offsets) {
          col.staggerT = Math.max(0, (col.staggerT || 0) - dt);
          if (col.dying?.length) {
            for (const d of col.dying) d.age += dt;
            col.dying = col.dying.filter((d) => d.age < SEPOY_ANIM.death);
          }
          this._layoutCutters(
            { bodies: col.units, armors: col.armors, heads: col.heads, helms: col.helms, swords: col.swords, legsL: col.legsL, legsR: col.legsR },
            col.offsets,
            Math.min(32, col.count),
            reduceMotion ? 0 : t,
            this._cutterOpts(col, t, { lookX: crowdX - (col.x || 0), lookZ: crowdZ - (col.z || 0), reduceMotion })
          );
        }
        if (col?.beast && col.beastBody) this._tickWarden(col, dt, t, reduceMotion);
        if (camera && col?.label) col.label.quaternion.copy(camera.quaternion);
        if (col?.regroupT > 0) {
          col.regroupT -= dt;
          o.position.z += dt * 5.5;
          o.position.x += (col.homeX - o.position.x) * Math.min(1, dt * 6);
          col.x = o.position.x;
          col.z = o.position.z;
          if (col.regroupT <= 0) o.visible = false;
        }
      }
      if (o.userData.hitT > 0 && !o.userData.gateBob) {
        o.userData.hitT -= dt;
        const pop = 1 + o.userData.hitT * 1.35;
        o.scale.set(pop, pop, pop);
      } else if (o.userData.pulse && !reduceMotion && near && !o.userData.gateBob) {
        const s = 1 + Math.sin(t * 4.2 + o.position.z) * 0.07;
        o.scale.setScalar(s);
        if (o.userData.baseY != null) o.position.y = o.userData.baseY + Math.sin(t * 3.1 + o.position.x) * 0.08;
      }
      if (o.userData.geyser) {
        const u = o.userData.geyser;
        const cycle = ((t / u.period + u.phase) % 1 + 1) % 1;
        const tellWin = cycle > 0.38 && cycle < 0.55;
        const blast = cycle >= 0.55 && cycle < 0.82;
        const rise = blast ? Math.sin(((cycle - 0.55) / 0.27) * Math.PI) : tellWin ? 0.12 + Math.sin(((cycle - 0.38) / 0.17) * Math.PI) * 0.1 : 0.06;
        u.jet.scale.set(0.5 + rise * 0.75, 0.22 + rise * 1.4, 0.5 + rise * 0.75);
        u.jet.position.y = 0.32 + rise * 0.92;
        u.spray.scale.setScalar(0.18 + rise * 1.15);
        u.spray.position.y = 0.65 + rise * 1.4;
        u.spray.visible = rise > 0.14;
        if (u.tell) {
          const pulse = tellWin ? 1.06 + Math.sin(t * 18) * 0.14 : blast ? 1.04 : 0.9;
          u.tell.scale.setScalar(pulse);
          if (u.tell.material) u.tell.material.emissiveIntensity = tellWin ? 0.95 : blast ? 0.5 : 0.2;
        }
        if (u.steam) {
          u.steam.scale.set(0.65 + rise * 0.85, 0.4 + rise * 1.45, 1);
          u.steam.position.y = 0.5 + rise * 1.15;
          u.steam.material.opacity = blast ? 0.44 : tellWin ? 0.22 : 0.1;
          if (camera) u.steam.quaternion.copy(camera.quaternion);
        }
        const justHot = blast && !u.wasHot;
        u.wasHot = blast;
        if (u.collider) {
          u.collider.hot = rise > 0.45;
          u.collider.justHot = justHot || u.collider.justHot;
        }
      }
      if (o.userData.pendulum) {
        const u = o.userData.pendulum;
        const ang = Math.sin(t * u.speed) * u.amp;
        u.pivot.rotation.z = ang;
        if (u.collider) u.collider.x = o.position.x + Math.sin(ang) * 1.7;
      }
      if (o.userData.orbit) {
        const u = o.userData.orbit;
        u.rotor.rotation.y += dt * (reduceMotion ? 1.1 : 2.35);
        const a = u.rotor.rotation.y;
        const x0 = Math.cos(a) * u.amp;
        const x1 = Math.cos(a + Math.PI) * u.amp;
        const lane = Math.min(Math.abs(x0), Math.abs(x1));
        if (u.collider) {
          u.collider.hot = lane < 1.15;
          u.collider.x = Math.abs(x0) < Math.abs(x1) ? o.position.x + x0 : o.position.x + x1;
        }
      }
      if (o.userData.slam) {
        const u = o.userData.slam;
        const cycle = ((t / u.period + u.phase) % 1 + 1) % 1;
        const down = slamDownAmount(cycle);
        u.arm.rotation.z = slamArmAngle(down);
        const plant = Math.max(0, (down - 0.72) / 0.28);
        if (u.head) {
          u.head.scale.set(1 + plant * 0.28, 1 - plant * 0.42, 1 + plant * 0.28);
          if (u.head.material) u.head.material.emissiveIntensity = 0.45 + plant * 1.15;
        }
        if (u.shock) {
          const boom = plant * plant;
          u.shock.scale.setScalar(0.35 + boom * 1.85);
          u.shock.material.opacity = boom * 0.72;
          const pos = slamHeadLocalPos(down);
          u.shock.position.x = pos.x;
        }
        const planted = down > 0.92;
        if (u.collider) {
          const box = slamHitbox(down, o.position.x, o.position.z);
          u.collider.hot = down > 0.18;
          u.collider.x = box.x;
          u.collider.z = box.z;
          u.collider.width = box.width;
          u.collider.depth = box.depth;
          u.collider.justPlant = planted && !u.wasPlant;
        }
        u.wasPlant = planted;
      }
      if (o.userData.beam) {
        const u = o.userData.beam;
        const x = Math.sin(t * u.speed) * u.amp;
        u.bolt.position.x = x;
        if (u.collider) u.collider.x = x;
      }
      if (o.userData.chaserPack) {
        const hunt = o.userData.col?.hunting;
        const segs = o.userData.chaserSegs;
        if (segs && !reduceMotion) {
          for (let i = 0; i < segs.length; i++) {
            segs[i].position.y = 0.34 + Math.sin(t * (hunt ? 14 : 8) + i * 0.9) * (hunt ? 0.12 : 0.07);
          }
        }
        if (o.userData.chaserJaw) o.userData.chaserJaw.rotation.x = hunt ? Math.sin(t * 16) * 0.35 : 0.08;
        if (o.userData.chaserMouth) o.userData.chaserMouth.scale.setScalar(hunt ? 1.12 + Math.sin(t * 14) * 0.08 : 1);
        const glow = o.userData.chaserGlow;
        if (glow?.material) glow.material.opacity = hunt ? 0.42 : 0.1;
        const ring = o.userData.chaserRing;
        if (ring) {
          const pulse = hunt ? 1.15 + Math.sin(t * 10) * 0.12 : 1;
          ring.scale.setScalar(pulse);
          if (ring.material) ring.material.opacity = hunt ? 0.7 : 0.4;
        }
      }
      if (o.userData.patrol) {
        const u = o.userData.patrol;
        const period = Math.max(0.4, 2 / Math.max(0.2, u.speed));
        const cycle = ((t / period) % 2 + 2) % 2;
        const k = cycle < 1 ? cycle : 2 - cycle;
        o.position.x = u.base + (k * 2 - 1) * u.amp;
        if (u.collider) u.collider.x = o.position.x;
      }
    }
    this._layoutRotors(reduceMotion);
    for (const p of this.doorPieces) {
      if (!p.userData.smash) continue;
      p.position.y += dt * 5;
      p.rotation.z += dt * 4;
      p.scale.multiplyScalar(Math.max(0.15, 1 - dt * 3.4));
      if (p.material && "transparent" in p.material) p.material.transparent = true;
    }
    for (let i = this.cutFx.length - 1; i >= 0; i--) {
      const fx = this.cutFx[i];
      fx.userData.life -= dt;
      if (fx.userData.shock) {
        fx.scale.multiplyScalar(1 + dt * 7.2);
        fx.material.opacity = Math.max(0, fx.userData.life / 0.45);
      } else if (fx.userData.punch) {
        fx.position.z += dt * 4.5;
        fx.scale.multiplyScalar(1 + dt * 10);
        fx.material.opacity = Math.max(0, fx.userData.life / 0.18);
      } else {
        fx.rotation.z += dt * 14;
        fx.scale.multiplyScalar(1 + dt * 6);
        fx.material.opacity = Math.max(0, fx.userData.life / 0.22);
      }
      if (fx.userData.life <= 0) {
        fx.geometry?.dispose?.();
        fx.material?.dispose?.();
        fx.removeFromParent();
        this.cutFx.splice(i, 1);
      }
    }
    if (this._wardenFlash > 0) {
      this._wardenFlash = Math.max(0, this._wardenFlash - dt * 5);
      for (const col of this.armies) {
        const mats = col.beastBody?.userData?.wardenGlow;
        if (!mats) continue;
        const base = col.beastBody.userData.wardenGlowBase || 0.08;
        for (const m of mats) m.emissiveIntensity = base + this._wardenFlash * 1.7;
      }
    }
  }
}
