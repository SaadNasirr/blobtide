import * as THREE from "three";
import { getSkin } from "../content/skins.js";
import { makeCountBadge } from "./look.js";

const MAX_VISIBLE = 56;

function makeSlot(i) {
  return {
    tx: 0,
    tz: 0,
    x: 0,
    y: 0.28,
    z: 0,
    vx: 0,
    vz: 0,
    phase: i * 1.17,
    freq: 9.2 + (i % 5) * 0.55,
    appear: 1,
    knock: 0,
    sink: false,
    sinkX: 0,
    sinkZ: 0,
  };
}

export class Crowd {
  constructor(scene) {
    this.scene = scene;
    this.count = 1;
    this.x = 0;
    this.z = 0;
    this.targetX = 0;
    this.squash = 1;
    this.flash = 0;
    this.lean = 0;
    this.compress = 1;
    this.celebrate = 0;
    this.runTime = 0;
    this.group = new THREE.Group();
    scene.add(this.group);

    const geo = new THREE.SphereGeometry(0.24, 12, 10);
    const mat = new THREE.MeshStandardMaterial({
      color: 0xc6ff4a,
      emissive: 0x6bff1a,
      emissiveIntensity: 1.05,
      roughness: 0.22,
      metalness: 0.12,
    });
    this.mesh = new THREE.InstancedMesh(geo, mat, MAX_VISIBLE);
    this.mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    this.mesh.instanceColor = new THREE.InstancedBufferAttribute(new Float32Array(MAX_VISIBLE * 3), 3);
    this.mesh.frustumCulled = false;
    this.group.add(this.mesh);

    this.banner = new THREE.Mesh(
      new THREE.PlaneGeometry(1.2, 0.56),
      new THREE.MeshBasicMaterial({ transparent: true, depthWrite: false })
    );
    this.banner.position.set(0, 1.5, 0);
    this.banner.visible = false;

    this.aura = new THREE.Mesh(
      new THREE.SphereGeometry(0.95, 10, 8),
      new THREE.MeshBasicMaterial({
        color: 0x66f0ff,
        transparent: true,
        opacity: 0,
        depthWrite: false,
      })
    );
    this.group.add(this.aura);

    this.trailDummy = new THREE.Object3D();
    this.trailMesh = new THREE.InstancedMesh(
      new THREE.SphereGeometry(0.1, 6, 6),
      new THREE.MeshBasicMaterial({ color: 0xc6ff4a, transparent: true, opacity: 0.32, depthWrite: false }),
      12
    );
    this.trailMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    this.trailMesh.count = 0;
    this.trailMesh.frustumCulled = false;
    scene.add(this.trailMesh);
    this.trail = [];

    this.shadow = new THREE.Mesh(
      new THREE.CircleGeometry(0.55, 16),
      new THREE.MeshBasicMaterial({ color: 0x0a0618, transparent: true, opacity: 0.36, depthWrite: false })
    );
    this.shadow.rotation.x = -Math.PI / 2;
    this.shadow.position.y = 0.03;
    this.shadow.renderOrder = 1;
    this.group.add(this.shadow);

    this.dummy = new THREE.Object3D();
    this._color = new THREE.Color();
    this.slots = Array.from({ length: MAX_VISIBLE }, (_, i) => makeSlot(i));
    this._baseEmissive = 1.05;
    this._rebuildTargets(8);
  }

  applySkin(skinId, time = 0) {
    const skin = getSkin(skinId);
    this.mesh.material.color.setHex(skin.color);
    if (skin.id === "rainbow") {
      const h = (time * 0.12) % 1;
      this.mesh.material.color.setHSL(h, 0.85, 0.6);
      this.mesh.material.emissive.setHSL((h + 0.15) % 1, 0.9, 0.4);
    } else {
      this.mesh.material.emissive.setHex(skin.emissive);
    }
    this.mesh.material.emissiveIntensity = this._baseEmissive + this.flash + (this.shielded ? 0.55 : 0);
    if (this.aura) {
      this.aura.material.color.setHex(this.shielded ? 0x66f0ff : skin.color);
      this.aura.material.opacity = this.shielded ? 0.26 : this.flash > 0.2 ? 0.14 : 0.04;
    }
    if (this.shielded && skin.id !== "rainbow") {
      this.mesh.material.emissive.lerp(this._color.setHex(0x66f0ff), 0.45);
    }
    if (this._lastTint !== skin.id) {
      this._lastTint = skin.id;
      this._tintInstances(skin);
    }
  }

  _tintInstances(skin) {
    const base = this._color.setHex(skin.color);
    for (let i = 0; i < MAX_VISIBLE; i++) {
      const wobble = ((i * 17) % 9) / 40;
      this.mesh.setColorAt(
        i,
        this._color.setRGB(
          Math.min(1, base.r + wobble * 0.14),
          Math.min(1, base.g + wobble * 0.06),
          Math.min(1, base.b + (1 - wobble) * 0.1)
        )
      );
    }
    if (this.mesh.instanceColor) this.mesh.instanceColor.needsUpdate = true;
  }

  impact(kind) {
    if (kind === "good") this.squash = 1.42;
    else if (kind === "bad") this.squash = 0.58;
    else if (kind === "land") this.squash = 0.76;
    this.flash = kind === "bad" ? 1.6 : 0.95;
  }

  _rebuildTargets(n) {
    const shown = Math.min(MAX_VISIBLE, Math.max(1, n));
    for (let i = 0; i < shown; i++) {
      const a = i * 2.399963 + 0.31 * Math.sin(i * 1.7);
      const r = 0.2 * Math.sqrt(i) * (1 + 0.08 * Math.sin(i * 2.2));
      const rear = i > 4 ? -(r * 0.42) - Math.sqrt(i) * 0.045 : -r * 0.22;
      this.slots[i].tx = Math.cos(a) * r * 1.05;
      this.slots[i].tz = Math.sin(a) * r * 0.72 + rear;
    }
  }

  setCount(n, opts = {}) {
    const next = Math.max(0, Math.floor(n));
    const prev = this.count;
    const shownPrev = Math.min(MAX_VISIBLE, Math.max(1, prev));
    const shownNext = Math.min(MAX_VISIBLE, Math.max(1, next));
    this._rebuildTargets(next || 1);
    if (next > prev) {
      const from = opts.spawnFrom || { x: 0, z: 0.8 };
      for (let i = shownPrev; i < shownNext; i++) {
        const s = this.slots[i];
        s.x = from.x + (Math.random() - 0.5) * 0.35;
        s.z = from.z + Math.random() * 0.25;
        s.y = 0.45;
        s.appear = 0;
        s.knock = 0;
        s.vx = (s.tx - s.x) * 2.4;
        s.vz = (s.tz - s.z) * 2.4;
      }
    } else if (next < prev && (opts.knock || opts.sink)) {
      const lost = Math.min(MAX_VISIBLE, shownPrev) - shownNext;
      const toward = opts.sinkToward || { x: 0, z: 0 };
      for (let k = 0; k < lost; k++) {
        const s = this.slots[shownNext + k];
        if (!s) continue;
        s.sink = !!opts.sink;
        s.sinkX = toward.x;
        s.sinkZ = toward.z;
        s.knock = opts.sink ? 0.85 + Math.random() * 0.15 : 0.55 + Math.random() * 0.25;
        s.vx = opts.sink ? toward.x * 3.2 + (Math.random() - 0.5) * 1.2 : (Math.random() - 0.5) * 6;
        s.vz = opts.sink ? toward.z * 3.2 + (Math.random() - 0.5) * 0.8 : -2 - Math.random() * 3;
      }
    }
    this.count = next;
    this._refreshBanner();
  }

  _refreshBanner() {
    if (!this.banner) return;
    this._badgeMap?.dispose?.();
    this._badgeMap = makeCountBadge(this.count, "#141414", "#d8ff4a");
    this.banner.material.map = this._badgeMap;
    this.banner.material.needsUpdate = true;
  }

  reset(count) {
    this.x = 0;
    this.z = 0;
    this.targetX = 0;
    this.squash = 1;
    this.flash = 0;
    this.lean = 0;
    this.compress = 1;
    this.celebrate = 0;
    this.runTime = 0;
    this.shielded = false;
    this.trail.length = 0;
    for (const s of this.slots) {
      s.x = s.tx;
      s.z = s.tz;
      s.y = 0.28;
      s.vx = 0;
      s.vz = 0;
      s.appear = 1;
      s.knock = 0;
      s.sink = false;
    }
    this.setCount(count);
    this._rebuildTargets(count);
    for (let i = 0; i < Math.min(MAX_VISIBLE, Math.max(1, count)); i++) {
      this.slots[i].x = this.slots[i].tx;
      this.slots[i].z = this.slots[i].tz;
    }
  }

  radius() {
    return 0.48 + Math.min(1.6, Math.sqrt(this.count) * 0.1);
  }

  update(dt, laneLimit, opts = {}) {
    const { moving = true, reduceMotion = false, fighting = false } = opts;
    const prevX = this.x;
    this.x += (this.targetX - this.x) * Math.min(1, dt * 16.5);
    this.x = THREE.MathUtils.clamp(this.x, -laneLimit, laneLimit);
    if (moving) this.z += (opts.speed ?? 6.8) * dt;
    if (moving) this.runTime += dt;
    this.celebrate = Math.max(0, this.celebrate - dt);

    this.squash += (1 - this.squash) * Math.min(1, dt * 9);
    this.flash += (0 - this.flash) * Math.min(1, dt * 8);
    const dx = this.x - prevX;
    const leanTarget = THREE.MathUtils.clamp(-dx * 16, -0.34, 0.34);
    this.lean += (leanTarget - this.lean) * Math.min(1, dt * 10);
    this.group.rotation.z = reduceMotion ? 0 : this.lean;
    this.group.position.set(this.x, 0, this.z);
    const pack = (0.82 + Math.min(0.5, Math.sqrt(Math.max(this.count, 1)) * 0.045)) * this.compress;
    if (this.aura) this.aura.scale.setScalar(0.85 + pack * 0.55);

    if (moving && !reduceMotion) {
      this.trail.push({ x: this.x, y: 0.22, z: this.z - 0.45, life: 0.22 });
      if (this.trail.length > 12) this.trail.shift();
    }
    for (let i = this.trail.length - 1; i >= 0; i--) {
      this.trail[i].life -= dt;
      if (this.trail[i].life <= 0) this.trail.splice(i, 1);
    }
    if (this.trailMesh) {
      const n = reduceMotion ? 0 : this.trail.length;
      for (let i = 0; i < n; i++) {
        const tr = this.trail[i];
        this.trailDummy.position.set(tr.x, tr.y, tr.z);
        this.trailDummy.scale.setScalar(Math.max(0.12, tr.life / 0.22));
        this.trailDummy.updateMatrix();
        this.trailMesh.setMatrixAt(i, this.trailDummy.matrix);
      }
      this.trailMesh.count = n;
      this.trailMesh.instanceMatrix.needsUpdate = true;
    }

    this.shadow.scale.setScalar(0.65 + pack * 0.7);
    this.shadow.material.opacity = this.count <= 0 ? 0 : 0.32;

    const shown = this.count <= 0 ? 0 : Math.min(MAX_VISIBLE, Math.max(1, this.count));
    const t = this.runTime;
    const globalSquash = reduceMotion ? 1 : this.squash;
    let drawN = shown;
    for (let i = shown; i < MAX_VISIBLE; i++) {
      if (this.slots[i].knock > 0) drawN = i + 1;
    }
    for (let i = 0; i < drawN; i++) {
      const s = this.slots[i];
      const live = i < shown;
      if (live) {
        s.appear = Math.min(1, s.appear + dt * 5.5);
        const overshoot = 1.12 - s.appear * 0.12;
        s.vx += (s.tx * pack * overshoot - s.x) * 28 * dt;
        s.vz += (s.tz * pack * overshoot - s.z) * 28 * dt;
        if (fighting) {
          s.vx += Math.sin(t * 21 + s.phase) * 16 * dt;
          s.vz += Math.cos(t * 17 + i) * 12 * dt;
        }
        s.vx *= Math.max(0, 1 - dt * 9);
        s.vz *= Math.max(0, 1 - dt * 9);
        s.x += s.vx * dt;
        s.z += s.vz * dt;
        const hopAmp = i === 0 ? 0.13 : 0.08;
        const hop = reduceMotion ? 0 : hopAmp * Math.abs(Math.sin(t * s.freq + s.phase));
        const celeb = this.celebrate > 0 ? 0.12 * Math.abs(Math.sin(t * 14 + i)) : 0;
        const fightHop = fighting ? 0.1 * Math.abs(Math.sin(t * 24 + s.phase)) : 0;
        s.y += (0.26 + hop + celeb + fightHop - s.y) * Math.min(1, dt * 18);
        const stretch = reduceMotion ? 1 : 1 + Math.sin(t * s.freq + s.phase) * (i === 0 ? 0.16 : 0.09);
        const sy = globalSquash * stretch * (0.72 + s.appear * 0.28);
        const sxz = (2 - globalSquash) * (0.82 + s.appear * 0.18);
        this.dummy.position.set(s.x, s.y, s.z);
        this.dummy.rotation.set(hop * 0.35, dx * 4, this.lean * 0.25);
        this.dummy.scale.set(sxz, sy, sxz);
      } else if (s.knock > 0) {
        s.knock -= dt;
        if (s.sink) {
          s.vx += (s.sinkX - s.x) * 14 * dt;
          s.vz += (s.sinkZ - s.z) * 14 * dt;
          s.vx += -s.z * 10 * dt;
          s.vz += s.x * 10 * dt;
          s.vx *= Math.max(0, 1 - dt * 3);
          s.vz *= Math.max(0, 1 - dt * 3);
          s.x += s.vx * dt;
          s.z += s.vz * dt;
          s.y -= dt * 3.4;
          this.dummy.position.set(s.x, s.y, s.z);
          this.dummy.scale.setScalar(Math.max(0.04, s.knock * 1.15));
          this.dummy.rotation.set(s.knock * 6, s.knock * 10, s.knock * 4);
        } else {
          s.x += s.vx * dt;
          s.z += s.vz * dt;
          s.y += dt * 2.2;
          s.vx *= 0.98;
          this.dummy.position.set(s.x, s.y, s.z);
          this.dummy.scale.setScalar(Math.max(0.05, s.knock * 1.6));
          this.dummy.rotation.set(s.knock * 4, 0, s.knock * 3);
        }
      } else {
        this.dummy.scale.setScalar(0.001);
        this.dummy.position.set(0, -4, 0);
      }
      this.dummy.updateMatrix();
      this.mesh.setMatrixAt(i, this.dummy.matrix);
    }
    this.mesh.count = drawN;
    this.mesh.instanceMatrix.needsUpdate = true;
    if (this.banner) this.banner.position.y = 1.28 + Math.min(0.65, Math.sqrt(this.count) * 0.07);
  }
}
