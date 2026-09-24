import * as THREE from "three";

function nebulaTexture() {
  const c = document.createElement("canvas");
  c.width = 256;
  c.height = 256;
  const g = c.getContext("2d");
  const grd = g.createRadialGradient(128, 128, 10, 128, 128, 128);
  grd.addColorStop(0, "rgba(255, 90, 200, 0.55)");
  grd.addColorStop(0.4, "rgba(80, 160, 255, 0.28)");
  grd.addColorStop(1, "rgba(20, 10, 60, 0)");
  g.fillStyle = grd;
  g.fillRect(0, 0, 256, 256);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export class Backdrop {
  constructor(scene) {
    this.group = new THREE.Group();
    scene.add(this.group);

    const starCount = 220;
    const positions = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 36;
      positions[i * 3 + 1] = 2 + Math.random() * 16;
      positions[i * 3 + 2] = Math.random() * 80 - 10;
    }
    const starGeo = new THREE.BufferGeometry();
    starGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    this.stars = new THREE.Points(
      starGeo,
      new THREE.PointsMaterial({
        color: 0xffffff,
        size: 0.12,
        transparent: true,
        opacity: 0.85,
        depthWrite: false,
      })
    );
    this.group.add(this.stars);

    const tex = nebulaTexture();
    const nebMat = new THREE.MeshBasicMaterial({
      map: tex,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
    });
    this.nebulaA = new THREE.Mesh(new THREE.PlaneGeometry(28, 16), nebMat);
    this.nebulaA.position.set(-8, 8, 18);
    this.nebulaB = new THREE.Mesh(new THREE.PlaneGeometry(24, 14), nebMat.clone());
    this.nebulaB.material.color.setHex(0x66ffff);
    this.nebulaB.position.set(10, 7, 26);
    this.group.add(this.nebulaA, this.nebulaB);

    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(7.2, 0.06, 8, 48),
      new THREE.MeshBasicMaterial({
        color: 0x7af0ff,
        transparent: true,
        opacity: 0.45,
        depthWrite: false,
      })
    );
    ring.rotation.x = Math.PI / 2.4;
    ring.position.set(0, 1.2, 12);
    this.ring = ring;
    this.group.add(ring);
  }

  tick(dt, crowdZ, reduceMotion) {
    const z = crowdZ;
    this.stars.position.z = z;
    this.nebulaA.position.z = z + 22;
    this.nebulaB.position.z = z + 30;
    this.ring.position.z = z + 10;
    if (!reduceMotion) {
      this.nebulaA.rotation.z += dt * 0.05;
      this.nebulaB.rotation.z -= dt * 0.04;
      this.ring.rotation.z += dt * 0.35;
    }
  }

  dispose() {
    this.group.traverse((o) => {
      o.geometry?.dispose?.();
      o.material?.map?.dispose?.();
      o.material?.dispose?.();
    });
    this.group.removeFromParent();
  }
}
