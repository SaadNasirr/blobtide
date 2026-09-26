import * as THREE from "three";

const MAX = 96;

export class Particles {
  constructor(scene) {
    this.dummy = new THREE.Object3D();
    this.items = [];
    this._pool = [];
    const geo = new THREE.SphereGeometry(0.07, 6, 6);
    const mat = new THREE.MeshBasicMaterial({ color: 0xc6ff4a });
    this.mesh = new THREE.InstancedMesh(geo, mat, MAX);
    this.mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    this.mesh.count = 0;
    this.mesh.frustumCulled = false;
    scene.add(this.mesh);
  }

  burst(x, y, z, hex, count = 14, speed = 4) {
    this.mesh.material.color.setHex(hex);
    for (let i = 0; i < count; i++) {
      const p = this._pool.pop() || {};
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
      if (this.items.length >= MAX) this._pool.push(this.items.shift());
      this.items.push(p);
    }
  }

  update(dt, reduceMotion) {
    if (reduceMotion) {
      this.items.length = 0;
      this.mesh.count = 0;
      return;
    }
    for (let i = this.items.length - 1; i >= 0; i--) {
      const p = this.items[i];
      p.age += dt;
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.z += p.vz * dt;
      p.vy -= 9 * dt;
      if (p.age >= p.life) {
        this.items.splice(i, 1);
        this._pool.push(p);
      }
    }
    const n = this.items.length;
    for (let i = 0; i < n; i++) {
      const p = this.items[i];
      const s = Math.max(0.05, 1 - p.age / p.life);
      this.dummy.position.set(p.x, p.y, p.z);
      this.dummy.scale.setScalar(s);
      this.dummy.updateMatrix();
      this.mesh.setMatrixAt(i, this.dummy.matrix);
    }
    this.mesh.count = n;
    this.mesh.instanceMatrix.needsUpdate = true;
  }

  dispose() {
    this.items.length = 0;
    this.mesh.geometry?.dispose?.();
    this.mesh.material?.dispose?.();
    this.mesh.removeFromParent();
  }
}
