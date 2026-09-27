import * as THREE from "three";

export const DT_MAX = 0.033;
export const MAX_DRAW_CALLS = 80;
export const MAX_VRAM_MB = 50;
export const TOUCH_BUDGET_MS = 100;
export const MAX_AUDIO_SOURCES = 8;

let geos = null;

export function deviceProfile(nav = typeof navigator !== "undefined" ? navigator : {}) {
  const ua = nav.userAgent || "";
  const ios = /iP(hone|ad|od)/.test(ua);
  const android = /Android/i.test(ua);
  const mobile = ios || android || /Mobi/i.test(ua);
  const mem = Number(nav.deviceMemory) || 0;
  let cap = 1.35;
  if (ios) cap = 1;
  else if (android || mobile) cap = 1.15;
  if (mobile && mem > 0 && mem <= 4) cap = Math.min(cap, 1);
  const dpr = Number(typeof window !== "undefined" ? window.devicePixelRatio : 1) || 1;
  return {
    ios,
    android,
    mobile,
    pixelRatio: Math.min(dpr, cap),
    cap,
    precision: mobile ? "mediump" : "highp",
      far: mobile ? 100 : 140,
  };
}

export function sharedGeos() {
  if (geos) return geos;
  geos = {
    sphere: new THREE.SphereGeometry(1, 8, 6),
    blob: organicBlob(0.24, 16, 14),
    spark: new THREE.SphereGeometry(0.07, 6, 6),
    box: new THREE.BoxGeometry(1, 1, 1),
    cone: new THREE.ConeGeometry(1, 1.2, 5),
    plane: new THREE.PlaneGeometry(1, 1),
    sky: new THREE.SphereGeometry(92, 16, 10),
    sun: new THREE.CircleGeometry(3.4, 20),
    haze: new THREE.PlaneGeometry(90, 18),
    flash: new THREE.PlaneGeometry(160, 90),
    bolt: new THREE.BoxGeometry(0.18, 28, 0.18),
    bird: new THREE.ConeGeometry(0.18, 0.55, 4),
    wing: new THREE.BoxGeometry(0.7, 0.04, 0.18),
    critter: new THREE.SphereGeometry(0.22, 8, 6),
  };
  return geos;
}

export function organicBlob(r, wSeg, hSeg) {
  const g = new THREE.SphereGeometry(r, wSeg, hSeg);
  const pos = g.attributes.position;
  const v = new THREE.Vector3();
  for (let i = 0; i < pos.count; i++) {
    v.fromBufferAttribute(pos, i);
    const n =
      1 +
      Math.sin(v.x * 17.3 + v.y * 11.1) * 0.042 +
      Math.cos(v.z * 13.7 + v.y * 9.4) * 0.024 +
      Math.sin(v.x * 9.1 + v.z * 15.2) * 0.016;
    v.normalize().multiplyScalar(r * n);
    pos.setXYZ(i, v.x, v.y, v.z);
  }
  pos.needsUpdate = true;
  g.computeVertexNormals();
  return g;
}

export function isSharedGeo(geo) {
  return !!geo && Object.values(sharedGeos()).includes(geo);
}

export function lambert(color, emissive = 0x000000, ei = 0.08) {
  return new THREE.MeshLambertMaterial({ color, emissive, emissiveIntensity: ei });
}
