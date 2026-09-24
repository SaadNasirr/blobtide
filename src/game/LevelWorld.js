import * as THREE from "three";
import { opLabel } from "../content/levels.js";

function makeTextTexture(text, bg, fg) {
  const c = document.createElement("canvas");
  c.width = 256;
  c.height = 128;
  const g = c.getContext("2d");
  g.fillStyle = bg;
  g.fillRect(0, 0, 256, 128);
  g.strokeStyle = "#0b0830";
  g.lineWidth = 10;
  g.strokeRect(8, 8, 240, 112);
  g.fillStyle = fg;
  g.font = "bold 72px Trebuchet MS, sans-serif";
  g.textAlign = "center";
  g.textBaseline = "middle";
  g.fillText(text, 128, 70);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.needsUpdate = true;
  return tex;
}

function makeDoorTexture(hp) {
  const c = document.createElement("canvas");
  c.width = 512;
  c.height = 256;
  const g = c.getContext("2d");
  g.fillStyle = "#5a2e00";
  g.fillRect(0, 0, 512, 256);
  g.strokeStyle = "#fff3c4";
  g.lineWidth = 14;
  g.strokeRect(12, 12, 488, 232);
  g.fillStyle = "#ffe08a";
  g.font = "bold 56px Trebuchet MS, sans-serif";
  g.textAlign = "center";
  g.textBaseline = "middle";
  g.fillText("SMASH", 256, 72);
  g.fillStyle = "#fffdf4";
  g.font = "bold 110px Trebuchet MS, sans-serif";
  g.fillText(String(hp), 256, 168);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function makeGridTexture() {
  const c = document.createElement("canvas");
  c.width = 512;
  c.height = 512;
  const g = c.getContext("2d");
  g.fillStyle = "#241a72";
  g.fillRect(0, 0, 512, 512);

  g.fillStyle = "#2f2488";
  for (let y = 0; y < 8; y++) {
    for (let x = 0; x < 8; x++) {
      if ((x + y) % 2 === 0) g.fillRect(x * 64, y * 64, 64, 64);
    }
  }

  g.strokeStyle = "rgba(120, 250, 255, 0.72)";
  g.lineWidth = 5;
  for (let i = 0; i <= 8; i++) {
    const p = (i / 8) * 512;
    g.beginPath();
    g.moveTo(p, 0);
    g.lineTo(p, 512);
    g.stroke();
    g.beginPath();
    g.moveTo(0, p);
    g.lineTo(512, p);
    g.stroke();
  }

  g.fillStyle = "rgba(255, 236, 90, 0.9)";
  g.fillRect(240, 0, 32, 512);
  g.fillStyle = "rgba(20, 16, 70, 0.55)";
  for (let y = 18; y < 512; y += 56) g.fillRect(246, y, 20, 22);

  g.fillStyle = "rgba(70, 230, 255, 0.7)";
  for (let y = 24; y < 512; y += 96) {
    g.beginPath();
    g.moveTo(256, y);
    g.lineTo(210, y + 36);
    g.lineTo(226, y + 36);
    g.lineTo(256, y + 12);
    g.lineTo(286, y + 36);
    g.lineTo(302, y + 36);
    g.closePath();
    g.fill();
  }

  const tex = new THREE.CanvasTexture(c);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.anisotropy = 4;
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function disposeObject(o, skipMaterials = null) {
  o.geometry?.dispose?.();
  const mats = Array.isArray(o.material) ? o.material : o.material ? [o.material] : [];
  for (const m of mats) {
    if (skipMaterials?.has(m)) continue;
    if (m.map && skipMaterials?.has(m.map)) {
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
    this._floor = null;
  }

  clear() {
    const skip = new Set();
    if (this._grid) skip.add(this._grid);
    this.root.traverse((o) => {
      if (o !== this.root) disposeObject(o, skip);
    });
    this.root.clear();
    this.colliders = [];
    this.animated = [];
    this.doorPieces = [];
    this._floor = null;
  }

  build(level) {
    this.clear();
    const last = level.pieces[level.pieces.length - 1];
    this.finishZ = last.z;
    const trackLen = last.z + 18;

    this._grid.repeat.set(2, Math.max(6, trackLen / 5));
    this._grid.offset.set(0, 0);
    const floor = new THREE.Mesh(
      new THREE.PlaneGeometry(9, trackLen, 1, 24),
      new THREE.MeshStandardMaterial({
        map: this._grid,
        color: 0xffffff,
        roughness: 0.42,
        metalness: 0.12,
        emissive: 0x2a1c88,
        emissiveIntensity: 0.42,
      })
    );
    floor.rotation.x = -Math.PI / 2;
    floor.position.set(0, 0, trackLen / 2 - 6);
    this._floor = floor;
    this.root.add(floor);

    for (const side of [-4.2, 4.2]) {
      const rail = new THREE.Mesh(
        new THREE.BoxGeometry(0.28, 0.55, trackLen),
        new THREE.MeshStandardMaterial({
          color: 0x7af7ff,
          emissive: 0x1ad0ff,
          emissiveIntensity: 0.85,
        })
      );
      rail.position.set(side, 0.28, trackLen / 2 - 6);
      rail.userData.rail = true;
      this.root.add(rail);
      this.animated.push(rail);
    }

    for (const p of level.pieces) {
      if (p.type === "gate") this._addGate(p.z, p.x, p.op, p.value, p);
      else if (p.type === "dualgate") {
        this._addGate(p.z, -1.1, p.left.op, p.left.value, { ...p, side: "left" });
        this._addGate(p.z, 1.1, p.right.op, p.right.value, { ...p, side: "right" });
      } else if (p.type === "saw") this._addSaw(p);
      else if (p.type === "hole") this._addHole(p);
      else if (p.type === "wall") this._addWall(p);
      else if (p.type === "coin") this._addCoin(p);
      else if (p.type === "boost") this._addBoost(p);
      else if (p.type === "shield") this._addShield(p);
      else if (p.type === "finish") this._addFinish(p);
    }
  }

  _addGate(z, x, op, value, extra) {
    const good = op === "add" || op === "mul";
    const bg = good ? "#14532d" : "#7f1d3a";
    const fg = good ? "#d9ff6a" : "#ff8ab8";
    const tex = makeTextTexture(opLabel(op, value), bg, fg);
    const mat = new THREE.MeshStandardMaterial({
      map: tex,
      emissive: new THREE.Color(fg),
      emissiveIntensity: 0.55,
      roughness: 0.35,
    });
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(2.2, 1.6, 0.28), mat);
    mesh.position.set(x, 0.85, z);
    mesh.userData.pulse = true;
    mesh.userData.baseY = 0.85;
    this.root.add(mesh);
    this.animated.push(mesh);
    this.colliders.push({
      kind: "gate",
      z,
      x,
      width: 2.2,
      op,
      value,
      extra,
      used: false,
      mesh,
      good,
    });
  }

  _addSaw(p) {
    const mat = new THREE.MeshStandardMaterial({
      color: 0xff5d7a,
      emissive: 0xff2244,
      metalness: 0.45,
      roughness: 0.28,
    });
    const mesh = new THREE.Mesh(new THREE.CylinderGeometry(p.width * 0.55, p.width * 0.55, 0.18, 20), mat);
    mesh.rotation.z = Math.PI / 2;
    mesh.position.set(p.x, 0.55, p.z);
    mesh.userData.spin = true;
    if (p.move) {
      mesh.userData.patrol = { base: p.x, amp: p.amp ?? 1.55, speed: 2.4 };
    }
    this.root.add(mesh);
    this.animated.push(mesh);
    const col = {
      kind: "saw",
      z: p.z,
      x: p.x,
      width: p.width,
      damage: p.damage,
      used: false,
      mesh,
    };
    if (mesh.userData.patrol) mesh.userData.patrol.collider = col;
    this.colliders.push(col);
  }

  _addHole(p) {
    const mesh = new THREE.Mesh(
      new THREE.CircleGeometry(p.width * 0.55, 20),
      new THREE.MeshBasicMaterial({ color: 0x0a0618 })
    );
    mesh.rotation.x = -Math.PI / 2;
    mesh.position.set(p.x, 0.03, p.z);
    this.root.add(mesh);
    const glow = new THREE.Mesh(
      new THREE.RingGeometry(p.width * 0.45, p.width * 0.62, 20),
      new THREE.MeshBasicMaterial({ color: 0x7a5cff, transparent: true, opacity: 0.7, side: THREE.DoubleSide })
    );
    glow.rotation.x = -Math.PI / 2;
    glow.position.set(p.x, 0.04, p.z);
    this.root.add(glow);
    this.colliders.push({
      kind: "hole",
      z: p.z,
      x: p.x,
      width: p.width,
      used: false,
      mesh,
    });
  }

  _addWall(p) {
    const mesh = new THREE.Mesh(
      new THREE.BoxGeometry(p.width, 1.35, 0.55),
      new THREE.MeshStandardMaterial({
        color: 0xff4d6d,
        emissive: 0xff2244,
        emissiveIntensity: 0.7,
        roughness: 0.35,
      })
    );
    mesh.position.set(p.x, 0.68, p.z);
    this.root.add(mesh);
    const stripe = new THREE.Mesh(
      new THREE.BoxGeometry(p.width * 0.92, 0.18, 0.58),
      new THREE.MeshBasicMaterial({ color: 0xffe08a })
    );
    stripe.position.set(p.x, 0.68, p.z);
    this.root.add(stripe);
    this.colliders.push({
      kind: "wall",
      z: p.z,
      x: p.x,
      width: p.width,
      damage: p.damage,
      used: false,
      mesh,
    });
  }

  _addCoin(p) {
    const mesh = new THREE.Mesh(
      new THREE.SphereGeometry(0.32, 12, 10),
      new THREE.MeshStandardMaterial({
        color: 0xffd166,
        emissive: 0xffaa00,
        emissiveIntensity: 0.95,
        metalness: 0.4,
        roughness: 0.25,
      })
    );
    mesh.position.set(p.x, 0.55, p.z);
    mesh.userData.pulse = true;
    mesh.userData.baseY = 0.55;
    this.root.add(mesh);
    this.animated.push(mesh);
    this.colliders.push({ kind: "coin", z: p.z, x: p.x, width: 0.9, amount: p.amount || 6, used: false, mesh });
  }

  _addBoost(p) {
    const mesh = new THREE.Mesh(
      new THREE.ConeGeometry(0.45, 0.7, 8),
      new THREE.MeshStandardMaterial({
        color: 0x7af7ff,
        emissive: 0x2ad0ff,
        emissiveIntensity: 1.1,
      })
    );
    mesh.position.set(p.x, 0.45, p.z);
    mesh.rotation.x = Math.PI / 2;
    mesh.userData.pulse = true;
    mesh.userData.baseY = 0.45;
    this.root.add(mesh);
    this.animated.push(mesh);
    this.colliders.push({ kind: "boost", z: p.z, x: p.x, width: 1.1, used: false, mesh });
  }

  _addShield(p) {
    const mesh = new THREE.Mesh(
      new THREE.IcosahedronGeometry(0.42, 0),
      new THREE.MeshStandardMaterial({
        color: 0xb8f4ff,
        emissive: 0x66f0ff,
        emissiveIntensity: 1.05,
        transparent: true,
        opacity: 0.9,
      })
    );
    mesh.position.set(p.x, 0.7, p.z);
    mesh.userData.pulse = true;
    mesh.userData.baseY = 0.7;
    this.root.add(mesh);
    this.animated.push(mesh);
    this.colliders.push({ kind: "shield", z: p.z, x: p.x, width: 1.1, used: false, mesh });
  }

  _addFinish(p) {
    const geo = new THREE.BoxGeometry(7.6, 2.4, 0.45);
    const mat = new THREE.MeshStandardMaterial({
      color: 0xffe08a,
      emissive: 0xffaa22,
      emissiveIntensity: 0.7,
    });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(0, 1.2, p.z);
    this.root.add(mesh);
    const tex = makeDoorTexture(p.hp);
    const label = new THREE.Mesh(
      new THREE.PlaneGeometry(3.6, 1.8),
      new THREE.MeshBasicMaterial({ map: tex, transparent: true })
    );
    label.position.set(0, 1.4, p.z + 0.3);
    this.root.add(label);
    this.doorPieces = [mesh, label];
    this.colliders.push({
      kind: "finish",
      z: p.z,
      hp: p.hp,
      used: false,
      mesh,
      label,
    });
  }

  smashDoor() {
    for (const p of this.doorPieces) p.userData.smash = true;
  }

  tick(dt, reduceMotion, crowdZ = 0) {
    const t = performance.now() * 0.001;
    if (this._grid) {
      this._grid.offset.y = -crowdZ * 0.07;
      if (!reduceMotion) this._grid.offset.x = Math.sin(t * 0.35) * 0.012;
    }
    for (const o of this.animated) {
      if (o.userData.spin) o.rotation.x += dt * (reduceMotion ? 2 : 10);
      if (o.userData.pulse && !reduceMotion) {
        const s = 1 + Math.sin(t * 3.4 + o.position.z) * 0.045;
        o.scale.set(s, s, 1);
        o.position.y = o.userData.baseY + Math.sin(t * 2.4 + o.position.x) * 0.06;
      }
      if (o.userData.patrol) {
        const u = o.userData.patrol;
        o.position.x = u.base + Math.sin(t * u.speed) * u.amp;
        if (u.collider) u.collider.x = o.position.x;
      }
      if (o.userData.rail && o.material) {
        o.material.emissiveIntensity = 0.85 + (reduceMotion ? 0 : 0.4 * Math.sin(t * 5));
      }
    }
    for (const p of this.doorPieces) {
      if (!p.userData.smash) continue;
      p.position.y += dt * 4;
      p.rotation.z += dt * 3;
      p.scale.multiplyScalar(Math.max(0.2, 1 - dt * 3));
      if (p.material && "transparent" in p.material) p.material.transparent = true;
    }
  }
}
