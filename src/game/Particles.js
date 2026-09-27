import * as THREE from "three";
import { sharedGeos, isSharedGeo } from "./gpu.js";

export const MAX_PARTICLES = 500;
export const PICKUP_BURST_MAX = 10;
export const PIT_PARTICLE_CAP = 300;
export const BURST_GOOD = { min: 8, max: 12, speedMin: 8, speedMax: 12, life: 0.6 };
export const BURST_BAD = { min: 6, max: 8, speedMin: 5, speedMax: 8, life: 0.4 };
const PICKUP_RAINBOW = [0xff4d6d, 0xffe566, 0x00ff00, 0x2ec8d4, 0xc77dff, 0xff6ad5];

export function burstCount(spec) {
  return spec.min + Math.floor(Math.random() * (spec.max - spec.min + 1));
}

export function burstSpeed(spec) {
  return spec.speedMin + Math.random() * (spec.speedMax - spec.speedMin);
}

/** Hemispherical velocity. up=true sprays up+out; false sprays down+out. */
export function hemiVel(up, speed) {
  const theta = Math.random() * Math.PI * 2;
  const phi = Math.random() * (Math.PI * 0.5);
  const outward = Math.sin(phi) * speed;
  return {
    vx: Math.cos(theta) * outward,
    vy: (up ? 1 : -1) * (Math.cos(phi) * speed + 1.2),
    vz: Math.sin(theta) * outward,
  };
}

export class Particles {
  constructor(scene) {
    this.dummy = new THREE.Object3D();
    this._tint = new THREE.Color();
    this.items = [];
    this._pool = [];
    this._srcCounts = new Map();
    const geo = sharedGeos().spark;
    const mat = new THREE.MeshBasicMaterial({ color: 0xffffff, toneMapped: false });
    this.mesh = new THREE.InstancedMesh(geo, mat, MAX_PARTICLES);
    this.mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    this.mesh.instanceColor = new THREE.InstancedBufferAttribute(new Float32Array(MAX_PARTICLES * 3), 3);
    this.mesh.count = 0;
    this.mesh.frustumCulled = false;
    scene.add(this.mesh);
  }

  _take() {
    const p = this._pool.pop() || {};
    p.src = null;
    p.kind = null;
    p.ox = 0;
    p.oz = 0;
    return p;
  }

  _push(p) {
    if (this.items.length >= MAX_PARTICLES) {
      const old = this.items.shift();
      if (old?.src) this._decSrc(old.src);
      this._pool.push(old);
    }
    if (p.src) this._srcCounts.set(p.src, (this._srcCounts.get(p.src) || 0) + 1);
    this.items.push(p);
  }

  _decSrc(src) {
    const n = (this._srcCounts.get(src) || 1) - 1;
    if (n <= 0) this._srcCounts.delete(src);
    else this._srcCounts.set(src, n);
  }

  canSrc(src, cap = PIT_PARTICLE_CAP) {
    return (this._srcCounts.get(src) || 0) < cap;
  }

  _paint(p, hex) {
    this._tint.setHex(hex);
    p.r = this._tint.r;
    p.g = this._tint.g;
    p.b = this._tint.b;
  }

  streak(x, y, z, hex = 0xfff0b0, count = 6) {
    for (let i = 0; i < count; i++) {
      const p = this._take();
      const a = -0.8 + Math.random() * 1.6;
      p.x = x;
      p.y = y;
      p.z = z;
      p.vx = Math.cos(a) * 5.5;
      p.vy = 1.4 + Math.random() * 2;
      p.vz = -1.8 - Math.random();
      p.life = 0.2 + Math.random() * 0.12;
      p.age = 0;
      p.grav = 9;
      p.streak = true;
      p.coin = false;
      p.kind = "streak";
      this._paint(p, hex);
      this._push(p);
    }
  }

  orbitWarn(x, y, z, radius = 0.75) {
    const p = this._take();
    const a = Math.random() * Math.PI * 2;
    p.x = x + Math.cos(a) * radius;
    p.y = y + (Math.random() - 0.4) * 0.2;
    p.z = z + Math.sin(a) * radius * 0.35;
    p.vx = -Math.sin(a) * 1.6;
    p.vy = 0.15;
    p.vz = Math.cos(a) * 0.8;
    p.life = 0.28;
    p.age = 0;
    p.grav = 0.4;
    p.streak = false;
    p.coin = false;
    p.kind = "orbit";
    this._paint(p, 0xff3a4a);
    this._push(p);
  }

  fadeTrail(x, y, z) {
    const p = this._take();
    p.x = x;
    p.y = y;
    p.z = z;
    p.vx = (Math.random() - 0.5) * 0.3;
    p.vy = 0.05;
    p.vz = -0.4;
    p.life = 0.35;
    p.age = 0;
    p.grav = 0.2;
    p.streak = true;
    p.coin = false;
    p.kind = "trail";
    this._paint(p, 0xc8d0d8);
    this._push(p);
  }

  vortex(x, y, z, radius = 0.8, src = "hole") {
    if (!this.canSrc(src)) return;
    const p = this._take();
    const a = Math.random() * Math.PI * 2;
    const r = radius * (0.25 + Math.random() * 0.75);
    p.x = x + Math.cos(a) * r;
    p.y = y + 0.04 + Math.random() * 0.2;
    p.z = z + Math.sin(a) * r;
    p.vx = -Math.sin(a) * 1.8;
    p.vy = 0.55 + Math.random() * 0.7;
    p.vz = Math.cos(a) * 1.8;
    p.life = 0.55;
    p.age = 0;
    p.grav = 1.1;
    p.streak = false;
    p.coin = false;
    p.kind = "vortex";
    p.src = src;
    p.ox = x;
    p.oz = z;
    this._paint(p, Math.random() > 0.5 ? 0x1a0818 : 0x3a1030);
    this._push(p);
  }

  geyserSpray(x, y, z, hot, src = "geyser") {
    if (!this.canSrc(src)) return;
    const p = this._take();
    const a = Math.random() * Math.PI * 2;
    const up = hot ? 4.8 + Math.random() * 5 : 0.6 + Math.random() * 0.7;
    p.x = x + Math.cos(a) * (hot ? 0.12 : 0.22);
    p.y = y + 0.2;
    p.z = z + Math.sin(a) * (hot ? 0.12 : 0.22);
    p.vx = Math.cos(a) * (hot ? 0.9 : 0.25);
    p.vy = up;
    p.vz = Math.sin(a) * (hot ? 0.9 : 0.25);
    p.life = hot ? 0.45 : 0.32;
    p.age = 0;
    p.grav = hot ? 11 : 4;
    p.streak = hot && Math.random() > 0.6;
    p.coin = false;
    p.kind = "geyser";
    p.src = src;
    this._paint(p, hot ? (Math.random() > 0.5 ? 0x7af7ff : 0x2ec8d4) : 0x4a88c8);
    this._push(p);
  }

  pitBurst(x, y, z) {
    for (let i = 0; i < 12; i++) {
      const p = this._take();
      const a = (i / 12) * Math.PI * 2;
      p.x = x;
      p.y = y - 0.4;
      p.z = z;
      p.vx = Math.cos(a) * 1.2;
      p.vy = 0.8 + Math.random();
      p.vz = Math.sin(a) * 1.2;
      p.life = 0.32;
      p.age = 0;
      p.grav = 8;
      p.streak = false;
      p.coin = false;
      p.kind = "pitburst";
      this._paint(p, i % 2 ? 0x4a1848 : 0x120814);
      this._push(p);
    }
  }

  slamHit(x, y, z) {
    this.burst(x, y + 0.05, z, 0x8a9098, 12, 4.2);
    this.burst(x, y + 0.16, z, 0x6a4a28, 8, 2.8);
    this.burst(x, y, z, 0x2ec8d4, 6, 2.4);
    this.pitBurst?.(x, 0.02, z);
  }

  burst(x, y, z, hex, count = 14, speed = 4) {
    for (let i = 0; i < count; i++) {
      const p = this._take();
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;
      p.x = x;
      p.y = y;
      p.z = z;
      p.vx = Math.cos(theta) * Math.sin(phi) * speed;
      p.vy = Math.abs(Math.cos(phi)) * speed + 1.2;
      p.vz = Math.sin(theta) * Math.sin(phi) * speed * 0.4;
      p.life = 0.42 + Math.random() * 0.22;
      p.age = 0;
      p.grav = 9;
      p.streak = false;
      p.coin = false;
      p.kind = "burst";
      this._paint(p, hex);
      this._push(p);
    }
  }

  burstPickup(x, y, z, hex, count = 8) {
    const n = Math.min(PICKUP_BURST_MAX, Math.max(1, count | 0));
    for (let i = 0; i < n; i++) {
      const p = this._take();
      const theta = (i / n) * Math.PI * 2 + Math.random() * 0.2;
      const phi = 0.35 + Math.random() * 0.9;
      const speed = 3.2 + Math.random() * 2.2;
      p.x = x;
      p.y = y;
      p.z = z;
      p.vx = Math.cos(theta) * Math.sin(phi) * speed;
      p.vy = Math.cos(phi) * speed + 1.4;
      p.vz = Math.sin(theta) * Math.sin(phi) * speed;
      p.life = 0.38;
      p.age = 0;
      p.grav = 6;
      p.streak = false;
      p.coin = false;
      p.kind = "pickup";
      this._paint(p, hex);
      this._push(p);
    }
  }

  burstRainbow(x, y, z, count = 10) {
    const n = Math.min(PICKUP_BURST_MAX, Math.max(1, count | 0));
    for (let i = 0; i < n; i++) {
      const p = this._take();
      const theta = (i / n) * Math.PI * 2;
      const speed = 3.6 + (i % 3) * 0.8;
      p.x = x;
      p.y = y;
      p.z = z;
      p.vx = Math.cos(theta) * speed;
      p.vy = 2.2 + (i % 2) * 1.4;
      p.vz = Math.sin(theta) * speed * 0.7;
      p.life = 0.4;
      p.age = 0;
      p.grav = 5;
      p.streak = i % 2 === 0;
      p.coin = false;
      p.kind = "rainbow";
      this._paint(p, PICKUP_RAINBOW[i % PICKUP_RAINBOW.length]);
      this._push(p);
    }
  }

  burstGood(x, y, z) {
    const n = burstCount(BURST_GOOD);
    for (let i = 0; i < n; i++) {
      const p = this._take();
      const speed = burstSpeed(BURST_GOOD);
      const v = hemiVel(true, speed);
      p.x = x;
      p.y = y;
      p.z = z;
      p.vx = v.vx;
      p.vy = v.vy;
      p.vz = v.vz;
      p.life = BURST_GOOD.life;
      p.age = 0;
      p.grav = 2.2;
      p.streak = false;
      p.coin = false;
      p.kind = "good";
      this._paint(p, i % 2 ? 0x2ec8d4 : 0x00ff00);
      this._push(p);
    }
  }

  burstBad(x, y, z) {
    const n = burstCount(BURST_BAD);
    for (let i = 0; i < n; i++) {
      const p = this._take();
      const speed = burstSpeed(BURST_BAD);
      const v = hemiVel(false, speed);
      p.x = x;
      p.y = y;
      p.z = z;
      p.vx = v.vx;
      p.vy = v.vy;
      p.vz = v.vz;
      p.life = BURST_BAD.life;
      p.age = 0;
      p.grav = 14;
      p.streak = false;
      p.coin = false;
      p.kind = "bad";
      this._paint(p, 0xcc3333);
      this._push(p);
    }
    this.smoke(x, y, z, 7);
  }

  smoke(x, y, z, count = 7) {
    for (let i = 0; i < count; i++) {
      const p = this._take();
      p.x = x + (Math.random() - 0.5) * 0.4;
      p.y = y;
      p.z = z + (Math.random() - 0.5) * 0.2;
      p.vx = (Math.random() - 0.5) * 1.4;
      p.vy = 0.6 + Math.random() * 1.1;
      p.vz = (Math.random() - 0.5) * 1.1;
      p.life = 0.45 + Math.random() * 0.2;
      p.age = 0;
      p.grav = -1.2;
      p.streak = false;
      p.coin = false;
      p.kind = "smoke";
      this._paint(p, i % 2 ? 0x6a4038 : 0x4a3030);
      this._push(p);
    }
  }

  coinFly(x, y, z, count = 5) {
    for (let i = 0; i < count; i++) {
      const p = this._take();
      p.x = x;
      p.y = y;
      p.z = z;
      p.vx = 2 + Math.random() * 2;
      p.vy = 6 + Math.random() * 3;
      p.vz = -1 - Math.random();
      p.tx = x + 7;
      p.ty = y + 10;
      p.tz = z - 3;
      p.life = 0.55;
      p.age = 0;
      p.grav = 0;
      p.streak = false;
      p.coin = true;
      p.kind = "coin";
      this._paint(p, 0xffd166);
      this._push(p);
    }
  }

  ring(x, y, z, hex = 0x7af7ff, count = 14) {
    for (let i = 0; i < count; i++) {
      const p = this._take();
      const a = (i / count) * Math.PI * 2;
      p.x = x;
      p.y = y;
      p.z = z;
      p.vx = Math.cos(a) * 5.5;
      p.vy = 2.4;
      p.vz = Math.sin(a) * 5.5;
      p.life = 0.42;
      p.age = 0;
      p.grav = 4;
      p.streak = false;
      p.coin = false;
      p.kind = "ring";
      this._paint(p, hex);
      this._push(p);
    }
  }

  confetti(x, y, z, count = 22, palette = [0x2ec8d4, 0xffe566, 0xff6ad5, 0x00ff00]) {
    for (let i = 0; i < count; i++) {
      const p = this._take();
      const v = hemiVel(true, 6 + Math.random() * 6);
      p.x = x;
      p.y = y;
      p.z = z;
      p.vx = v.vx;
      p.vy = v.vy + 2;
      p.vz = v.vz;
      p.life = 0.55 + Math.random() * 0.2;
      p.age = 0;
      p.grav = 7;
      p.streak = i % 3 === 0;
      p.coin = false;
      p.kind = "confetti";
      this._paint(p, palette[i % palette.length]);
      this._push(p);
    }
  }

  drain(x, y, z, count = 12) {
    for (let i = 0; i < count; i++) {
      const p = this._take();
      p.x = x + (Math.random() - 0.5) * 1.2;
      p.y = y + Math.random() * 0.8;
      p.z = z + (Math.random() - 0.5) * 0.6;
      p.vx = (Math.random() - 0.5) * 1.6;
      p.vy = 0.4 + Math.random();
      p.vz = (Math.random() - 0.5);
      p.life = 0.38;
      p.age = 0;
      p.grav = 3;
      p.streak = false;
      p.coin = false;
      p.kind = "drain";
      this._paint(p, 0x8a9098);
      this._push(p);
    }
  }

  update(dt, reduceMotion) {
    if (reduceMotion) {
      for (const p of this.items) {
        if (p.src) this._decSrc(p.src);
        p.src = null;
        this._pool.push(p);
      }
      this.items.length = 0;
      this._srcCounts.clear();
      this.mesh.count = 0;
      return;
    }
    for (let i = this.items.length - 1; i >= 0; i--) {
      const p = this.items[i];
      p.age += dt;
      if (p.coin) {
        const k = Math.min(1, dt * 5.5);
        p.x += (p.tx - p.x) * k;
        p.y += (p.ty - p.y) * k;
        p.z += (p.tz - p.z) * k;
      } else if (p.kind === "vortex") {
        p.x += p.vx * dt;
        p.z += p.vz * dt;
        p.y += p.vy * dt;
        p.vx += (p.ox - p.x) * 6 * dt;
        p.vz += (p.oz - p.z) * 6 * dt;
        const tx = p.vx;
        p.vx += -p.vz * 5 * dt;
        p.vz += tx * 5 * dt;
        p.vy -= 2.2 * dt;
      } else {
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.z += p.vz * dt;
        p.vy -= (p.grav ?? 9) * dt;
      }
      if (p.age >= p.life) {
        if (p.src) this._decSrc(p.src);
        p.src = null;
        this.items.splice(i, 1);
        this._pool.push(p);
      }
    }
    const n = Math.min(MAX_PARTICLES, this.items.length);
    for (let i = 0; i < n; i++) {
      const p = this.items[i];
      const fade = Math.max(0.04, 1 - p.age / p.life);
      this.dummy.position.set(p.x, p.y, p.z);
      if (p.kind === "smoke") this.dummy.scale.setScalar(fade * (1.6 + p.age * 2.4));
      else if (p.streak) this.dummy.scale.set(fade * 3.2, fade * 0.22, fade * 0.4);
      else this.dummy.scale.setScalar(fade);
      this.dummy.updateMatrix();
      this.mesh.setMatrixAt(i, this.dummy.matrix);
      if (p.kind === "drain") {
        const g = 0.35 + fade * 0.3;
        this.mesh.setColorAt(i, this._tint.setRGB(g, g, g + 0.05));
      } else {
        this.mesh.setColorAt(i, this._tint.setRGB(p.r * fade + (1 - fade) * 0.15, p.g * fade + (1 - fade) * 0.15, p.b * fade));
      }
    }
    this.mesh.count = n;
    this.mesh.instanceMatrix.needsUpdate = true;
    if (this.mesh.instanceColor) this.mesh.instanceColor.needsUpdate = true;
  }

  dispose() {
    this.items.length = 0;
    if (!isSharedGeo(this.mesh.geometry)) this.mesh.geometry?.dispose?.();
    this.mesh.material?.dispose?.();
    this.mesh.removeFromParent();
  }
}
