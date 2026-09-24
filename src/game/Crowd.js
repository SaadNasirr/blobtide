import * as THREE from "three";
import { getSkin } from "../content/skins.js";

const MAX_VISIBLE = 48;

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
    this.group = new THREE.Group();
    scene.add(this.group);

    const geo = new THREE.SphereGeometry(0.26, 12, 10);
    const mat = new THREE.MeshStandardMaterial({
      color: 0xc6ff4a,
      emissive: 0x6bff1a,
      emissiveIntensity: 1.05,
      roughness: 0.22,
      metalness: 0.18,
    });
    this.mesh = new THREE.InstancedMesh(geo, mat, MAX_VISIBLE);
    this.mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    this.mesh.instanceColor = new THREE.InstancedBufferAttribute(new Float32Array(MAX_VISIBLE * 3), 3);
    this.mesh.castShadow = false;
    this.mesh.frustumCulled = false;
    this.group.add(this.mesh);

    const shadowMat = new THREE.MeshBasicMaterial({
      color: 0x0a0618,
      transparent: true,
      opacity: 0.38,
      depthWrite: false,
    });
    this.shadow = new THREE.Mesh(new THREE.CircleGeometry(0.55, 16), shadowMat);
    this.shadow.rotation.x = -Math.PI / 2;
    this.shadow.position.y = 0.035;
    this.shadow.renderOrder = 1;
    this.group.add(this.shadow);

    this.dummy = new THREE.Object3D();
    this._color = new THREE.Color();
    this.offsets = [];
    this._rebuildOffsets(8);
    this._baseEmissive = 1.05;
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
          Math.min(1, base.r + wobble * 0.12),
          Math.min(1, base.g + wobble * 0.05),
          Math.min(1, base.b + (1 - wobble) * 0.08)
        )
      );
    }
    if (this.mesh.instanceColor) this.mesh.instanceColor.needsUpdate = true;
  }

  impact(kind) {
    if (kind === "good") this.squash = 1.38;
    else if (kind === "bad") this.squash = 0.62;
    else if (kind === "land") this.squash = 0.78;
    this.flash = kind === "bad" ? 1.6 : 0.9;
  }

  _rebuildOffsets(n) {
    const shown = Math.min(MAX_VISIBLE, Math.max(1, n));
    this.offsets = [];
    for (let i = 0; i < shown; i++) {
      const a = i * 2.399963;
      const r = 0.22 * Math.sqrt(i);
      this.offsets.push(new THREE.Vector3(Math.cos(a) * r, 0.26, Math.sin(a) * r * 0.82));
    }
  }

  setCount(n) {
    const next = Math.max(0, Math.floor(n));
    if (Math.min(Math.max(next, 1), MAX_VISIBLE) !== this.offsets.length) this._rebuildOffsets(next);
    this.count = next;
  }

  reset(count) {
    this.x = 0;
    this.z = 0;
    this.targetX = 0;
    this.squash = 1;
    this.flash = 0;
    this.lean = 0;
    this.shielded = false;
    this.setCount(count);
  }

  radius() {
    return 0.5 + Math.min(1.5, Math.sqrt(this.count) * 0.09);
  }

  update(dt, laneLimit, opts = {}) {
    const { moving = true, reduceMotion = false } = opts;
    const prevX = this.x;
    this.x += (this.targetX - this.x) * Math.min(1, dt * 20);
    this.x = THREE.MathUtils.clamp(this.x, -laneLimit, laneLimit);
    if (moving) this.z += (opts.speed ?? 6.8) * dt;

    this.squash += (1 - this.squash) * Math.min(1, dt * 10);
    this.flash += (0 - this.flash) * Math.min(1, dt * 8);
    const dx = this.x - prevX;
    const leanTarget = THREE.MathUtils.clamp(-dx * 18, -0.38, 0.38);
    this.lean += (leanTarget - this.lean) * Math.min(1, dt * 10);
    this.group.rotation.z = reduceMotion ? 0 : this.lean;
    this.group.position.set(this.x, 0, this.z);

    const pack = 0.85 + Math.min(0.45, Math.sqrt(Math.max(this.count, 1)) * 0.04);
    this.shadow.scale.setScalar(0.7 + pack * 0.55);
    this.shadow.material.opacity = this.count <= 0 ? 0 : 0.34;

    const shown = this.count <= 0 ? 0 : Math.min(MAX_VISIBLE, Math.max(1, this.count));
    const t = reduceMotion ? 0 : performance.now() * 0.006;
    const squashY = reduceMotion ? 1 : this.squash;
    const squashXZ = reduceMotion ? 1 : 2 - this.squash;
    for (let i = 0; i < shown; i++) {
      const o = this.offsets[i];
      const hop = reduceMotion
        ? 0
        : 0.07 * Math.abs(Math.sin(t * 2.2 + i * 0.55)) + (moving ? 0.04 * Math.abs(Math.sin(t * 5.4 + i * 0.7)) : 0);
      this.dummy.position.set(o.x * squashXZ * pack, o.y * squashY + hop, o.z * squashXZ * pack);
      this.dummy.rotation.y = reduceMotion ? 0 : t * 0.35 + i;
      this.dummy.rotation.x = reduceMotion ? 0 : hop * 0.6;
      const s = 0.95 + (reduceMotion ? 0 : 0.1 * Math.sin(t * 0.9 + i));
      this.dummy.scale.set(s * squashXZ, s * squashY, s * squashXZ);
      this.dummy.updateMatrix();
      this.mesh.setMatrixAt(i, this.dummy.matrix);
    }
    this.mesh.count = shown;
    this.mesh.instanceMatrix.needsUpdate = true;
  }
}
