import * as THREE from "three";
import { opLabel } from "../content/levels.js";
import { makeCoinTexture, makeCountBadge, makeGateTexture, makeGridTexture, makeRivalBadge, makeStripeTexture, makeSwirlTexture } from "./look.js";

function candy(color, emissive = 0x000000, extra = {}) {
  const opacity = extra.opacity ?? 1;
  return new THREE.MeshPhongMaterial({
    color,
    emissive,
    emissiveIntensity: extra.ei ?? 0.38,
    shininess: extra.shine ?? 78,
    specular: extra.spec ?? 0xb8d4ff,
    transparent: opacity < 1,
    opacity,
    depthWrite: opacity >= 1,
    toneMapped: false,
  });
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
    this._rivalMat = candy(0xff5a7a, 0xff2048, { ei: 0.55, shine: 70 });
    this._rivalBossMat = candy(0xff3b4d, 0xcc1238, { ei: 0.62, shine: 80 });
    this._rockMat = candy(0x5a4a78, 0x2a2048, { ei: 0.18, shine: 22 });
    this._pineMat = candy(0x3dcc88, 0x148848, { ei: 0.28, shine: 30 });
    this._trunkMat = candy(0x8a5a38, 0x4a2810, { ei: 0.12, shine: 18 });
    this._grassMat = candy(0x6ee08a, 0x2a8848, { ei: 0.2, shine: 16 });
    this.armies = [];
  }

  clear() {
    const skip = new Set();
    if (this._grid) skip.add(this._grid);
    if (this._stripe) skip.add(this._stripe);
    if (this._coin) skip.add(this._coin);
    if (this._swirl) skip.add(this._swirl);
    if (this._blobGeo) skip.add(this._blobGeo);
    if (this._rockGeo) skip.add(this._rockGeo);
    if (this._pineGeo) skip.add(this._pineGeo);
    if (this._trunkGeo) skip.add(this._trunkGeo);
    if (this._grassGeo) skip.add(this._grassGeo);
    if (this._rivalMat) skip.add(this._rivalMat);
    if (this._rivalBossMat) skip.add(this._rivalBossMat);
    if (this._rockMat) skip.add(this._rockMat);
    if (this._pineMat) skip.add(this._pineMat);
    if (this._trunkMat) skip.add(this._trunkMat);
    if (this._grassMat) skip.add(this._grassMat);
    this.root.traverse((o) => {
      if (o !== this.root) disposeObject(o, skip);
    });
    this.root.clear();
    this.colliders = [];
    this.animated = [];
    this.doorPieces = [];
    this.armies = [];
    this._floor = null;
  }

  build(level) {
    this.clear();
    const last = level.pieces[level.pieces.length - 1];
    this.finishZ = last.z;
    const trackLen = last.z + 22;

    this._grid.repeat.set(2, Math.max(8, trackLen / 4.6));
    this._grid.offset.set(0, 0);
    const floor = new THREE.Mesh(
      new THREE.PlaneGeometry(9.4, trackLen, 1, 1),
      new THREE.MeshBasicMaterial({
        map: this._grid,
        color: 0xffffff,
      })
    );
    floor.rotation.x = -Math.PI / 2;
    floor.position.set(0, 0, trackLen / 2 - 6);
    this._floor = floor;
    this.root.add(floor);

    for (const side of [-4.42, 4.42]) {
      const railGeo = new THREE.CylinderGeometry(0.16, 0.16, trackLen, 10);
      railGeo.rotateX(Math.PI / 2);
      const rail = new THREE.Mesh(railGeo, candy(0x7af7ff, 0x1ad0ff, { ei: 0.55, shine: 90 }));
      rail.position.set(side, 0.34, trackLen / 2 - 6);
      this.root.add(rail);
      const lipGeo = new THREE.CylinderGeometry(0.22, 0.22, trackLen, 10);
      lipGeo.rotateX(Math.PI / 2);
      const lip = new THREE.Mesh(lipGeo, candy(0x3a2a88, 0x221866, { ei: 0.2, shine: 30 }));
      lip.position.set(side, 0.08, trackLen / 2 - 6);
      this.root.add(lip);
    }

    for (let z = 10; z < last.z; z += 22) this._addArch(z);
    this._addValley(trackLen);

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
      else if (p.type === "grow") this._addToken(p, "grow", 0xff6ad5, 0xff2ea6);
      else if (p.type === "army") this._addArmy(p);
      else if (p.type === "finish") this._addFinish(p);
    }
  }

  _addArch(z) {
    const mat = candy(0x9b8cff, 0x5a42ff, { ei: 0.42, shine: 70 });
    const arch = new THREE.Mesh(new THREE.TorusGeometry(4.08, 0.11, 8, 28, Math.PI), mat);
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
      candy(0x2a2068, 0x151040, { ei: 0.25, shine: 40 })
    );
  }

  _addGate(z, x, op, value, extra) {
    const good = op === "add" || op === "mul";
    const label = opLabel(op, value);
    const tex = makeGateTexture(label, good);
    const group = new THREE.Group();
    group.position.set(x, 0, z);
    const frame = good ? candy(0xb8ffd4, 0x2dff7a, { ei: 0.35, shine: 90 }) : candy(0xffc0d0, 0xff3b6e, { ei: 0.35, shine: 90 });
    const postL = new THREE.Mesh(new THREE.CapsuleGeometry(0.07, 1.38, 4, 8), frame);
    postL.position.set(-1.08, 0.86, 0);
    const postR = new THREE.Mesh(new THREE.CapsuleGeometry(0.07, 1.38, 4, 8), frame);
    postR.position.set(1.08, 0.86, 0);
    const bar = new THREE.Mesh(new THREE.CapsuleGeometry(0.07, 2.12, 4, 8), frame);
    bar.rotation.z = Math.PI / 2;
    bar.position.set(0, 1.62, 0);
    const footL = new THREE.Mesh(new THREE.SphereGeometry(0.11, 10, 8), frame);
    footL.position.set(-1.08, 0.1, 0);
    const footR = new THREE.Mesh(new THREE.SphereGeometry(0.11, 10, 8), frame);
    footR.position.set(1.08, 0.1, 0);
    const plate = new THREE.Mesh(
      new THREE.PlaneGeometry(1.95, 1.32),
      new THREE.MeshBasicMaterial({
        map: tex,
        transparent: true,
        depthWrite: false,
        side: THREE.DoubleSide,
        toneMapped: false,
      })
    );
    plate.position.set(0, 0.9, 0);
    plate.rotation.y = Math.PI;
    group.add(postL, postR, bar, footL, footR, plate);
    this.root.add(group);
    this.animated.push(group);
    this.colliders.push({
      kind: "gate",
      z,
      x,
      width: 2.2,
      op,
      value,
      extra,
      used: false,
      mesh: group,
      good,
    });
  }

  _addSaw(p) {
    const group = new THREE.Group();
    group.position.set(p.x, 0.62, p.z);
    const r = Math.max(0.55, p.width * 0.52);
    const bladeGeo = new THREE.CylinderGeometry(r, r, 0.05, 32);
    bladeGeo.rotateX(Math.PI / 2);
    const blade = new THREE.Mesh(bladeGeo, candy(0xff5a73, 0xff1838, { ei: 0.55, shine: 110, spec: 0xffffff }));
    const hub = new THREE.Mesh(new THREE.SphereGeometry(r * 0.22, 12, 10), candy(0xffe08a, 0xffaa22, { ei: 0.5, shine: 120 }));
    const ring = new THREE.Mesh(new THREE.TorusGeometry(r * 0.9, 0.035, 8, 28), candy(0xffd978, 0xffaa22, { ei: 0.4, shine: 100 }));
    const teeth = new THREE.Group();
    const toothMat = candy(0xffe6a0, 0xffcc66, { ei: 0.3, shine: 90 });
    for (let i = 0; i < 12; i++) {
      const tooth = new THREE.Mesh(new THREE.ConeGeometry(0.07, 0.16, 6), toothMat);
      const a = (i / 12) * Math.PI * 2;
      tooth.position.set(Math.cos(a) * r, Math.sin(a) * r, 0);
      tooth.rotation.z = a - Math.PI / 2;
      teeth.add(tooth);
    }
    group.add(blade, ring, hub, teeth);
    group.userData.spinZ = true;
    group.userData.warnMat = blade.material;
    group.userData.warnBase = 0.55;
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
    };
    if (group.userData.patrol) group.userData.patrol.collider = col;
    this.colliders.push(col);
  }

  _addHole(p) {
    const group = new THREE.Group();
    group.position.set(p.x, 0, p.z);
    const r = Math.max(0.72, p.width * 0.55);
    const well = new THREE.Mesh(
      new THREE.CylinderGeometry(r * 0.96, r * 0.42, 0.95, 22, 1, true),
      candy(0x080414, 0x2a1460, { ei: 0.18, shine: 12 })
    );
    well.position.y = -0.42;
    const pit = new THREE.Mesh(
      new THREE.CircleGeometry(r * 0.4, 22),
      new THREE.MeshBasicMaterial({ color: 0x000000 })
    );
    pit.rotation.x = -Math.PI / 2;
    pit.position.y = -0.88;
    const swirlMat = new THREE.MeshBasicMaterial({
      map: this._swirl,
      transparent: true,
      depthWrite: false,
      toneMapped: false,
    });
    const swirl = new THREE.Mesh(new THREE.CircleGeometry(r * 0.92, 28), swirlMat);
    swirl.rotation.x = -Math.PI / 2;
    swirl.position.y = 0.03;
    const swirl2 = new THREE.Mesh(new THREE.CircleGeometry(r * 0.62, 24), swirlMat);
    swirl2.rotation.x = -Math.PI / 2;
    swirl2.position.y = 0.05;
    const rim = new THREE.Mesh(
      new THREE.TorusGeometry(r, 0.07, 8, 28),
      candy(0x9b8cff, 0x6a4cff, { ei: 0.62, shine: 90 })
    );
    rim.rotation.x = Math.PI / 2;
    rim.position.y = 0.05;
    const glow = new THREE.Mesh(
      new THREE.TorusGeometry(r * 0.72, 0.035, 8, 24),
      candy(0x66f0ff, 0x2ad0ff, { ei: 0.7, shine: 100 })
    );
    glow.rotation.x = Math.PI / 2;
    glow.position.y = 0.02;
    const debris = new THREE.Group();
    const speckMat = candy(0xb8a0ff, 0x7a5cff, { ei: 0.5, shine: 80 });
    for (let i = 0; i < 6; i++) {
      const speck = new THREE.Mesh(new THREE.SphereGeometry(0.045, 6, 5), speckMat);
      const a = (i / 6) * Math.PI * 2;
      speck.position.set(Math.cos(a) * r * 0.58, 0.12, Math.sin(a) * r * 0.58);
      debris.add(speck);
    }
    group.add(well, pit, swirl, swirl2, rim, glow, debris);
    group.userData.blackHole = true;
    group.userData.swirl = swirl;
    group.userData.swirl2 = swirl2;
    group.userData.debris = debris;
    group.userData.suckT = 0;
    this.root.add(group);
    this.animated.push(group);
    this.colliders.push({ kind: "hole", z: p.z, x: p.x, width: p.width, used: false, mesh: group });
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
    const group = new THREE.Group();
    group.position.set(p.x, 0, p.z);
    const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.1, 1.15, 8), candy(0xffe08a, 0xffaa22, { ei: 0.4, shine: 90 }));
    pole.position.y = 0.58;
    const hub = new THREE.Mesh(new THREE.SphereGeometry(0.16, 10, 8), candy(0xffd978, 0xffaa22, { ei: 0.5, shine: 100 }));
    hub.position.y = 1.12;
    const barMat = candy(0xff6b7a, 0xff2848, { ei: 0.42, shine: 85 });
    const len = Math.max(1.6, p.width * 1.15);
    const bar = new THREE.Mesh(new THREE.BoxGeometry(len, 0.12, 0.12), barMat);
    bar.position.y = 1.12;
    const capL = new THREE.Mesh(new THREE.SphereGeometry(0.1, 8, 6), barMat);
    capL.position.set(-len * 0.5, 1.12, 0);
    const capR = new THREE.Mesh(new THREE.SphereGeometry(0.1, 8, 6), barMat);
    capR.position.set(len * 0.5, 1.12, 0);
    const rotor = new THREE.Group();
    rotor.add(bar, capL, capR);
    rotor.position.y = 0;
    group.add(pole, hub, rotor);
    group.userData.rotor = rotor;
    group.userData.warnMat = barMat;
    group.userData.warnBase = 0.42;
    this.root.add(group);
    this.animated.push(group);
    const col = { kind: "spinner", z: p.z, x: p.x, width: p.width || 1.7, damage: p.damage, used: false, mesh: group };
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

  _addValley(trackLen) {
    const nRock = 44;
    const nPine = 28;
    const nGrass = 50;
    const rocks = new THREE.InstancedMesh(this._rockGeo, this._rockMat, nRock);
    const pines = new THREE.InstancedMesh(this._pineGeo, this._pineMat, nPine);
    const trunks = new THREE.InstancedMesh(this._trunkGeo, this._trunkMat, nPine);
    const grass = new THREE.InstancedMesh(this._grassGeo, this._grassMat, nGrass);
    rocks.frustumCulled = false;
    pines.frustumCulled = false;
    trunks.frustumCulled = false;
    grass.frustumCulled = false;
    for (let i = 0; i < nRock; i++) {
      const side = i % 2 === 0 ? -1 : 1;
      const x = side * (6.55 + (i % 5) * 0.55);
      const z = 2 + (i / nRock) * (trackLen + 8);
      this._dummy.position.set(x, 0.28 + (i % 3) * 0.08, z);
      this._dummy.rotation.set(0.2 * (i % 3), i * 0.7, 0.15);
      this._dummy.scale.setScalar(0.7 + (i % 4) * 0.22);
      this._dummy.updateMatrix();
      rocks.setMatrixAt(i, this._dummy.matrix);
    }
    for (let i = 0; i < nPine; i++) {
      const side = i % 2 === 0 ? 1 : -1;
      const x = side * (7.05 + (i % 4) * 0.48);
      const z = 6 + (i / nPine) * (trackLen + 4);
      this._dummy.position.set(x, 0.92, z);
      this._dummy.rotation.set(0, i * 0.4, 0.04 * (i % 3));
      this._dummy.scale.set(1 + (i % 3) * 0.12, 1.05 + (i % 4) * 0.15, 1);
      this._dummy.updateMatrix();
      pines.setMatrixAt(i, this._dummy.matrix);
      this._dummy.position.y = 0.16;
      this._dummy.scale.set(1, 1, 1);
      this._dummy.updateMatrix();
      trunks.setMatrixAt(i, this._dummy.matrix);
    }
    for (let i = 0; i < nGrass; i++) {
      const side = i % 2 === 0 ? -1 : 1;
      const x = side * (4.95 + (i % 6) * 0.18);
      const z = 1 + (i / nGrass) * trackLen;
      this._dummy.position.set(x, 0.12, z);
      this._dummy.rotation.set(0, i, 0.2);
      this._dummy.scale.setScalar(0.7 + (i % 3) * 0.2);
      this._dummy.updateMatrix();
      grass.setMatrixAt(i, this._dummy.matrix);
    }
    this._dummy.scale.setScalar(1);
    this._dummy.rotation.set(0, 0, 0);
    this.root.add(rocks, pines, trunks, grass);
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
      const glass = candy(0xb8f4ff, 0x66f0ff, { ei: 0.45, shine: 120, opacity: 0.55 });
      const core = candy(0x7adfff, 0x2ad0ff, { ei: 0.5, shine: 90 });
      icon.add(new THREE.Mesh(new THREE.SphereGeometry(0.34, 14, 12), glass));
      icon.add(new THREE.Mesh(new THREE.SphereGeometry(0.2, 12, 10), core));
      const ring = new THREE.Mesh(new THREE.TorusGeometry(0.38, 0.03, 8, 20), core);
      ring.rotation.x = Math.PI / 2;
      icon.add(ring);
    });
  }

  _addMagnet(p) {
    this._addPickup(p, "magnet", 1.2, (icon) => {
      const steel = candy(0xd8dee8, 0x8899aa, { ei: 0.22, shine: 130, spec: 0xffffff });
      const paint = candy(0xe23b3b, 0x8a1018, { ei: 0.18, shine: 55 });
      const north = candy(0xff3b3b, 0xaa1010, { ei: 0.28, shine: 80 });
      const south = candy(0x3b6ae8, 0x102878, { ei: 0.28, shine: 80 });
      const arcGeo = new THREE.TorusGeometry(0.2, 0.075, 10, 22, Math.PI);
      const arc = new THREE.Mesh(arcGeo, paint);
      arc.rotation.z = Math.PI;
      const inner = new THREE.Mesh(new THREE.TorusGeometry(0.2, 0.04, 8, 20, Math.PI), steel);
      inner.rotation.z = Math.PI;
      inner.position.z = 0.01;
      const legL = new THREE.Mesh(new THREE.CylinderGeometry(0.075, 0.075, 0.26, 10), paint);
      const legR = new THREE.Mesh(new THREE.CylinderGeometry(0.075, 0.075, 0.26, 10), paint);
      legL.position.set(-0.2, -0.13, 0);
      legR.position.set(0.2, -0.13, 0);
      const tipL = new THREE.Mesh(new THREE.BoxGeometry(0.17, 0.12, 0.17), north);
      const tipR = new THREE.Mesh(new THREE.BoxGeometry(0.17, 0.12, 0.17), south);
      tipL.position.set(-0.2, -0.3, 0);
      tipR.position.set(0.2, -0.3, 0);
      const bolt = new THREE.Mesh(new THREE.SphereGeometry(0.05, 8, 6), steel);
      bolt.position.y = 0.2;
      icon.scale.setScalar(1.55);
      icon.rotation.x = -0.18;
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
    const max = 40;
    const blobs = new THREE.InstancedMesh(this._blobGeo, finish ? this._rivalBossMat : this._rivalMat, max);
    blobs.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    blobs.frustumCulled = false;
    const shown = Math.min(max, Math.max(1, count));
    const offsets = [];
    for (let i = 0; i < max; i++) {
      const a = i * 2.399963 + 0.21 * Math.sin(i * 1.3);
      const r = 0.42 * Math.sqrt(i) * (1 + 0.07 * Math.sin(i * 2.1));
      offsets.push({
        x: Math.cos(a) * r,
        z: Math.sin(a) * r * 0.7 - Math.min(0.38, Math.sqrt(i) * 0.05),
        phase: i * 0.91,
        freq: 7.6 + (i % 7) * 0.62,
      });
    }
    this._layoutRivalBlobs(blobs, offsets, shown, 0, false);
    group.add(blobs);
    const badge = makeRivalBadge(count, finish);
    const label = new THREE.Mesh(
      new THREE.PlaneGeometry(1.7, 0.85),
      new THREE.MeshBasicMaterial({ map: badge, transparent: true, depthWrite: false })
    );
    label.position.set(0, 1.55, 0.2);
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
      units: blobs,
      label,
      badge,
      offsets,
      finish,
      charging: false,
      fighting: false,
    };
    this.colliders.push(col);
    this.armies.push(col);
    group.userData.col = col;
    if (finish) this.doorPieces = [group];
    return col;
  }

  _layoutRivalBlobs(blobs, offsets, shown, t, fighting) {
    const vis = Math.min(40, Math.max(0, shown));
    for (let i = 0; i < vis; i++) {
      const o = offsets[i];
      const hop = 0.055 * Math.abs(Math.sin(t * o.freq + o.phase));
      const jig = fighting ? Math.sin(t * 22 + o.phase) * 0.14 : 0;
      const jigZ = fighting ? Math.cos(t * 18 + i) * 0.1 : 0;
      const stretch = 1 + Math.sin(t * o.freq + o.phase) * 0.1;
      this._dummy.position.set(o.x + jig, 0.26 + hop, o.z + jigZ);
      this._dummy.rotation.set(hop * 0.45, jig * 0.8, hop * 0.2);
      this._dummy.scale.set(1.05 / stretch, 1.05 * stretch, 1.05 / stretch);
      this._dummy.updateMatrix();
      blobs.setMatrixAt(i, this._dummy.matrix);
    }
    blobs.count = vis;
    blobs.instanceMatrix.needsUpdate = true;
  }

  setArmyCount(col, n) {
    if (!col) return;
    col.count = Math.max(0, n | 0);
    const vis = Math.min(40, col.count);
    if (col.units) {
      col.units.count = vis;
      if (col.offsets) this._layoutRivalBlobs(col.units, col.offsets, vis, performance.now() * 0.001, !!col.fighting);
    }
    if (col.label) {
      col.badge?.dispose?.();
      col.badge = makeRivalBadge(col.count, !!col.finish);
      col.label.material.map = col.badge;
      col.label.material.needsUpdate = true;
    }
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
    this._addArmy(p, true);
  }

  smashDoor() {
    for (const p of this.doorPieces) p.userData.smash = true;
  }

  tick(dt, reduceMotion, crowdZ = 0, camera = null, crowdX = 0) {
    const t = performance.now() * 0.001;
    if (this._grid) {
      this._grid.offset.y = -crowdZ * 0.12;
      if (!reduceMotion) this._grid.offset.x = Math.sin(t * 0.4) * 0.01;
    }
    for (const o of this.animated) {
      const dz = o.position.z - crowdZ;
      const near = dz > -6 && dz < 24;
      const warn = dz < 10 && dz > 0.4;
      if (o.userData.warnMat) {
        o.userData.warnMat.emissiveIntensity = (o.userData.warnBase || 0.4) + (warn ? 0.55 : 0);
      }
      if (o.userData.spinZ && near) {
        o.rotation.z += dt * (reduceMotion ? 2.4 : warn ? 16 : 8);
      }
      if (o.userData.spin && near) {
        o.rotation.x += dt * (reduceMotion ? 2.4 : warn ? 16 : 10);
      }
      if (o.userData.rotor && near) {
        o.userData.rotor.rotation.y += dt * (reduceMotion ? 1.6 : warn ? 7.4 : 2.2);
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
        if (col?.units && col.offsets) {
          this._layoutRivalBlobs(col.units, col.offsets, col.units.count, reduceMotion ? 0 : t, !!col.fighting);
        }
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
      if (o.userData.hitT > 0) {
        o.userData.hitT -= dt;
        const pop = 1 + o.userData.hitT * 1.35;
        o.scale.set(pop, pop, pop);
      } else if (o.userData.pulse && !reduceMotion && near) {
        const s = 1 + Math.sin(t * 4.2 + o.position.z) * 0.07;
        o.scale.setScalar(s);
        if (o.userData.baseY != null) o.position.y = o.userData.baseY + Math.sin(t * 3.1 + o.position.x) * 0.08;
      }
      if (o.userData.patrol) {
        const u = o.userData.patrol;
        const cycle = ((t * u.speed) / Math.PI) % 2;
        const moving = cycle > 0.35;
        o.position.x = u.base + Math.sin(t * u.speed) * u.amp * (moving ? 1 : 0.15);
        if (u.collider) u.collider.x = o.position.x;
      }
    }
    for (const p of this.doorPieces) {
      if (!p.userData.smash) continue;
      p.position.y += dt * 5;
      p.rotation.z += dt * 4;
      p.scale.multiplyScalar(Math.max(0.15, 1 - dt * 3.4));
      if (p.material && "transparent" in p.material) p.material.transparent = true;
    }
  }
}
