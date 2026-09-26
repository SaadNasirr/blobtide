import * as THREE from "three";

function candy(color, emissive = 0x000000, ei = 0.22) {
  return new THREE.MeshPhongMaterial({
    color,
    emissive,
    emissiveIntensity: ei,
    shininess: 18,
    specular: 0x334466,
    toneMapped: false,
    flatShading: true,
  });
}

function addPeak(parent, geo, mat, snow, x, y, z, s) {
  const m = new THREE.Mesh(geo, mat);
  m.scale.set(s * 0.72, s, s * 0.72);
  m.position.set(x, y, z);
  parent.add(m);
  const cap = new THREE.Mesh(geo, snow);
  cap.scale.set(s * 0.26, s * 0.16, s * 0.26);
  cap.position.set(x, y + s * 0.4, z);
  parent.add(cap);
}

export class Backdrop {
  constructor(scene) {
    this.group = new THREE.Group();
    scene.add(this.group);

    this.far = new THREE.Group();
    this.mid = new THREE.Group();
    this.group.add(this.far, this.mid);

    const farMat = candy(0x3a2a78, 0x1a1048, 0.28);
    const midMat = candy(0x4a3488, 0x24145a, 0.2);
    const snow = candy(0xd8d0f0, 0x8890c8, 0.12);
    const cone = new THREE.ConeGeometry(1, 1, 5);

    const farXs = [-22, -16.5, -11.5, 11.5, 16.5, 22];
    for (let i = 0; i < farXs.length; i++) {
      const s = 7.2 + (i % 3) * 1.6;
      addPeak(this.far, cone, farMat, snow, farXs[i], s * 0.28, 62 + (i % 3) * 5, s);
    }

    const midXs = [-15.5, -12.2, 12.2, 15.5];
    for (let i = 0; i < midXs.length; i++) {
      const s = 4.4 + (i % 2) * 1.1;
      addPeak(this.mid, cone, midMat, snow, midXs[i], s * 0.22, 34 + (i % 2) * 4, s);
    }

    const starCount = 80;
    const positions = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 48;
      positions[i * 3 + 1] = 8 + Math.random() * 18;
      positions[i * 3 + 2] = 20 + Math.random() * 50;
    }
    const starGeo = new THREE.BufferGeometry();
    starGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    this.stars = new THREE.Points(
      starGeo,
      new THREE.PointsMaterial({
        color: 0xffffff,
        size: 0.11,
        transparent: true,
        opacity: 0.7,
        depthWrite: false,
      })
    );
    this.group.add(this.stars);
  }

  tick(dt, crowdZ, reduceMotion) {
    this.far.position.z = crowdZ;
    this.mid.position.z = crowdZ;
    this.stars.position.z = crowdZ;
    if (!reduceMotion) {
      this.far.position.x = Math.sin(crowdZ * 0.004) * 0.35;
      this.mid.position.x = Math.sin(crowdZ * 0.01) * 0.55;
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
