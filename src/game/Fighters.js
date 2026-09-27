import * as THREE from "three";
import { mergeGeometries } from "three/addons/utils/BufferGeometryUtils.js";

export const SEPOY_HEIGHT = 1.28;
export const SEPOY_HEAD_Y = 1.06;
export const SEPOY_RANK_COLS = 4;
export const SEPOY_ANIM = {
  breathAmp: 0.02,
  breathPeriod: 2,
  walkPeriod: 1,
  walkAggressive: 0.72,
  slashWind: 0.2,
  slashHit: 0.15,
  slashFollow: 0.2,
  stagger: 0.3,
  death: 0.5,
  stanceWidth: 0.16,
};

function merge(parts) {
  const clean = parts.filter(Boolean);
  const g = mergeGeometries(clean, false);
  g?.computeVertexNormals();
  return g || clean[0];
}

function std(color, extra = {}) {
  return new THREE.MeshStandardMaterial({
    color,
    emissive: extra.emissive ?? 0x000000,
    emissiveIntensity: extra.ei ?? 0,
    metalness: extra.metal ?? 0.08,
    roughness: extra.rough ?? 0.48,
  });
}

export function sepoyOffset(i) {
  const cols = SEPOY_RANK_COLS;
  const row = Math.floor(i / cols);
  const col = i % cols;
  const stagger = (row % 2) * 0.18;
  return {
    x: (col - (cols - 1) / 2) * 0.5 + stagger,
    z: -row * 0.46,
    phase: i * 0.73,
    freq: 6.6 + (i % 5) * 0.4,
  };
}

function clamp(n, a, b) {
  return Math.max(a, Math.min(b, n));
}

function lerp(a, b, t) {
  return a + (b - a) * t;
}

/** Shared clip for InstancedMesh sepoys. One pose function, phase-offset per rank. */
export function sepoyPose({
  mode = "idle",
  t = 0,
  phase = 0,
  lookYaw = 0,
  stagger = 0,
} = {}) {
  const A = SEPOY_ANIM;
  const yaw = clamp(lookYaw, -0.45, 0.45);
  const breath = Math.sin((t / A.breathPeriod) * Math.PI * 2 + phase) * A.breathAmp;
  const hip = A.stanceWidth * 0.5;
  const pose = {
    x: 0,
    y: breath,
    z: 0,
    rx: 0.02,
    ry: Math.PI + yaw * 0.35,
    rz: 0,
    chest: 1 + breath * 4,
    headYaw: yaw,
    headPitch: -0.04,
    legL: { x: -hip, y: 0.2, z: 0, rx: 0.04, ry: Math.PI, rz: 0 },
    legR: { x: hip, y: 0.2, z: 0, rx: 0.04, ry: Math.PI, rz: 0 },
    sword: { x: 0.26, y: 0.72 + breath, z: 0.12, rx: 0.12, ry: Math.PI + 0.28, rz: -0.55 },
    scale: 1,
  };

  if (mode === "walk" || mode === "retreat" || mode === "charge") {
    const period = mode === "charge" ? A.walkAggressive : A.walkPeriod;
    const dir = mode === "retreat" ? -1 : 1;
    const cycle = ((t / period + phase * 0.08) % 1 + 1) % 1;
    const gait = cycle * Math.PI * 2 * dir;
    const left = Math.sin(gait);
    const right = Math.sin(gait + Math.PI);
    pose.y = 0.03 + Math.abs(Math.sin(gait * 2)) * 0.04 + breath;
    pose.ry = Math.PI + yaw * 0.45 - left * 0.1;
    pose.rz = -left * 0.04;
    pose.legL.z = left * 0.09 * dir;
    pose.legR.z = right * 0.09 * dir;
    pose.legL.rx = left * 0.62;
    pose.legR.rx = right * 0.62;
    pose.legL.y = 0.2 + Math.max(0, left) * 0.06;
    pose.legR.y = 0.2 + Math.max(0, right) * 0.06;
    pose.sword.rx = 0.1 + Math.max(0, -left) * 0.35;
    pose.sword.rz = -0.5 + left * 0.25;
    pose.sword.z = 0.12 + left * 0.04;
  } else if (mode === "slash") {
    const dur = A.slashWind + A.slashHit + A.slashFollow;
    const u = ((t + phase * 0.17) % dur) / dur;
    const w0 = A.slashWind / dur;
    const w1 = (A.slashWind + A.slashHit) / dur;
    let k;
    if (u < w0) {
      k = u / w0;
      pose.sword.rx = lerp(0.1, -1.35, k);
      pose.sword.rz = lerp(-0.5, -0.15, k);
      pose.sword.y = 0.78 + k * 0.22;
      pose.rx = -0.06 + k * -0.12;
      pose.ry = Math.PI + yaw * 0.2 - k * 0.18;
    } else if (u < w1) {
      k = (u - w0) / (w1 - w0);
      pose.sword.rx = lerp(-1.35, 1.22, k);
      pose.sword.rz = lerp(-0.15, 1.72, k);
      pose.sword.y = 0.9 - k * 0.34;
      pose.z = k * 0.18;
      pose.rx = -0.18 + k * 0.42;
      pose.ry = Math.PI - 0.18 + k * 0.55;
      pose.legL.z = k * 0.1;
      pose.legR.z = -k * 0.04;
      pose.legL.rx = 0.15;
    } else {
      k = (u - w1) / (1 - w1);
      pose.sword.rx = lerp(1.22, 0.12, k);
      pose.sword.rz = lerp(1.72, -0.55, k);
      pose.sword.y = 0.62 + k * 0.1;
      pose.z = (1 - k) * 0.12;
      pose.rx = lerp(0.24, 0.04, k);
      pose.ry = Math.PI + yaw * 0.3;
    }
  } else if (mode === "death") {
    const k = clamp(t / A.death, 0, 1);
    pose.y = lerp(0.18, 0.04, k);
    pose.rx = k * 1.05;
    pose.rz = k * 0.18;
    pose.legL.rx = 0.2 + k * 1.15;
    pose.legR.rx = 0.15 + k * 1.05;
    pose.legL.y = 0.12 * (1 - k);
    pose.legR.y = 0.1 * (1 - k);
    pose.sword.y = 0.35 * (1 - k);
    pose.sword.rx = 0.8;
    pose.scale = lerp(1, 0.08, k);
  }

  if (stagger > 0 && mode !== "death") {
    const k = clamp(stagger / A.stagger, 0, 1);
    pose.rx -= k * 0.35;
    pose.z -= k * 0.08;
    pose.ry += k * 0.08;
    pose.sword.rx -= k * 0.4;
    pose.sword.x = lerp(0.26, -0.02, k);
    pose.sword.z = lerp(0.12, 0.18, k);
  }
  return pose;
}

export const WARDEN_ANIM = {
  breathAmp: 0.05,
  breathPeriod: 3,
  walkPeriod: 1.2,
  cleave: 0.75,
  spin: 1.0,
  slam: 0.65,
  stagger: 0.2,
  victory: 2,
  defeat: 1,
};

export function wardenClipDuration(mode) {
  const A = WARDEN_ANIM;
  if (mode === "cleave") return A.cleave;
  if (mode === "spin") return A.spin;
  if (mode === "slam") return A.slam;
  if (mode === "stagger") return A.stagger;
  if (mode === "victory") return A.victory;
  if (mode === "defeat") return A.defeat;
  return A.walkPeriod;
}

export function wardenPose({ mode = "idle", t = 0 } = {}) {
  const A = WARDEN_ANIM;
  const breath = Math.sin((t / A.breathPeriod) * Math.PI * 2) * A.breathAmp;
  const pose = {
    y: 0,
    chest: breath,
    torsoRx: 0.02,
    torsoRy: 0,
    torsoRz: 0,
    armRx: 0.55,
    armRy: 0,
    armRz: 0.35,
    cleaverRz: -0.35,
    cleaverRx: 0.55,
    legL: 0.04,
    legR: 0.04,
    cape: 0.22,
    trail: false,
    shock: false,
    step: false,
    sfx: null,
    fade: 1,
  };

  if (mode === "idle") {
    pose.armRx = 1.15;
    pose.armRz = 0.55;
    pose.cleaverRz = 0.15;
    pose.cleaverRx = 1.05;
    pose.torsoRx = -0.04;
    pose.y = breath * 0.15;
  } else if (mode === "walk") {
    const cycle = ((t / A.walkPeriod) % 1 + 1) % 1;
    const gait = cycle * Math.PI * 2;
    const left = Math.sin(gait);
    pose.y = Math.abs(Math.sin(gait * 2)) * 0.035;
    pose.torsoRx = -0.06;
    pose.torsoRy = -left * 0.06;
    pose.legL = left * 0.42;
    pose.legR = -left * 0.42;
    pose.armRx = 0.15;
    pose.armRz = 0.22;
    pose.cleaverRz = -0.85;
    pose.cape = 0.18 + Math.abs(left) * 0.08;
    pose.step = cycle < 0.08 || (cycle > 0.5 && cycle < 0.58);
  } else if (mode === "cleave") {
    const u = clamp(t / A.cleave, 0, 1);
    if (u < 0.3 / 0.75) {
      const k = u / (0.3 / 0.75);
      pose.armRx = lerp(0.1, -1.55, k);
      pose.armRz = lerp(0.2, 0.05, k);
      pose.torsoRx = lerp(0.04, -0.22, k);
      pose.cleaverRz = lerp(-0.7, -0.2, k);
    } else if (u < 0.55 / 0.75) {
      const k = (u - 0.3 / 0.75) / (0.25 / 0.75);
      pose.armRx = lerp(-1.55, 1.15, k);
      pose.armRz = lerp(0.05, 0.55, k);
      pose.torsoRx = lerp(-0.22, 0.38, k);
      pose.cleaverRz = lerp(-0.2, 0.85, k);
      pose.trail = k > 0.15 && k < 0.92;
      pose.sfx = k < 0.2 ? "cleave" : null;
    } else {
      const k = (u - 0.55 / 0.75) / (0.2 / 0.75);
      pose.armRx = lerp(1.15, 0.25, k);
      pose.torsoRx = lerp(0.38, 0.06, k);
      pose.cleaverRz = lerp(0.85, -0.7, k);
    }
  } else if (mode === "spin") {
    const u = clamp(t / A.spin, 0, 1);
    if (u < 0.6) {
      const k = u / 0.6;
      pose.torsoRy = k * Math.PI;
      pose.armRx = -0.2;
      pose.armRz = 0.4 + k * 0.3;
      pose.sfx = k < 0.08 ? "spin" : null;
    } else {
      const k = (u - 0.6) / 0.4;
      pose.torsoRy = Math.PI + k * 0.4;
      pose.armRz = 0.7 + k * 0.85;
      pose.armRx = -0.15 + k * 0.4;
      pose.cleaverRz = -1.1;
      pose.trail = true;
    }
  } else if (mode === "slam") {
    const u = clamp(t / A.slam, 0, 1);
    if (u < 0.4 / 0.65) {
      const k = u / (0.4 / 0.65);
      pose.armRx = lerp(0.1, -1.65, k);
      pose.torsoRx = lerp(0, -0.28, k);
      pose.y = k * 0.08;
    } else {
      const k = (u - 0.4 / 0.65) / (0.25 / 0.65);
      pose.armRx = lerp(-1.65, 1.25, k);
      pose.torsoRx = lerp(-0.28, 0.42, k);
      pose.y = lerp(0.08, 0, k);
      pose.shock = k > 0.35 && k < 0.7;
      pose.sfx = k > 0.35 && k < 0.55 ? "slam" : null;
      pose.cleaverRz = 0.4;
    }
  } else if (mode === "stagger") {
    const k = clamp(t / A.stagger, 0, 1);
    pose.torsoRx = 0.22 * (1 - k);
    pose.torsoRy = -0.28 * Math.sin(k * Math.PI);
    pose.torsoRz = 0.12 * (1 - k);
    pose.armRx = 0.4;
    pose.y = 0.04 * (1 - k);
  } else if (mode === "victory") {
    const k = clamp(t / A.victory, 0, 1);
    pose.armRx = -1.35;
    pose.armRz = 0.1;
    pose.torsoRx = -0.08 + Math.sin(k * Math.PI * 4) * 0.06;
    pose.chest = breath + Math.abs(Math.sin(k * Math.PI * 6)) * 0.04;
    pose.y = 0.04;
  } else if (mode === "defeat") {
    const k = clamp(t / A.defeat, 0, 1);
    pose.y = lerp(0, -0.12, k);
    pose.torsoRx = k * 0.55;
    pose.legL = 0.9 * k;
    pose.legR = 0.35 * k;
    pose.armRx = 0.85;
    pose.cleaverRz = 1.2;
    pose.cleaverRx = 0.2;
    pose.fade = 1 - k;
  }
  return pose;
}

function damp(cur, next, k) {
  return cur + (next - cur) * k;
}

export function applyWardenPose(body, pose, blend = 1) {
  if (!body || !pose) return;
  const k = clamp(blend, 0.08, 1);
  body.position.y = damp(body.position.y, pose.y, k);
  const torso = body.userData.wardenTorso;
  if (torso) {
    torso.rotation.x = damp(torso.rotation.x, pose.torsoRx, k);
    torso.rotation.y = damp(torso.rotation.y, pose.torsoRy, k);
    torso.rotation.z = damp(torso.rotation.z, pose.torsoRz, k);
  }
  const chest = body.userData.wardenChest;
  if (chest) chest.position.y = 0.86 + pose.chest;
  const arm = body.userData.wardenArm;
  if (arm) {
    arm.rotation.x = damp(arm.rotation.x, pose.armRx, k);
    arm.rotation.y = damp(arm.rotation.y, pose.armRy, k);
    arm.rotation.z = damp(arm.rotation.z, pose.armRz, k);
  }
  const cleaver = body.userData.wardenCleaver;
  if (cleaver) {
    cleaver.rotation.z = damp(cleaver.rotation.z, pose.cleaverRz, k);
    cleaver.rotation.x = damp(cleaver.rotation.x, pose.cleaverRx, k);
  }
  const legs = body.userData.wardenLegs;
  if (legs) {
    legs[0].rotation.x = damp(legs[0].rotation.x, pose.legL, k);
    legs[1].rotation.x = damp(legs[1].rotation.x, pose.legR, k);
  }
  const cape = body.userData.wardenCape;
  if (cape) cape.rotation.x = damp(cape.rotation.x, pose.cape, k);
  const base = body.userData.baseScale || 1;
  const hpMul = body.userData.hpMul ?? 1;
  const want = (pose.shock ? 1.08 : 1) * base * (0.72 + 0.28 * hpMul);
  body.scale.setScalar(damp(body.scale.x, want, k));
  if (pose.fade < 0.999) {
    body.traverse((o) => {
      const mats = Array.isArray(o.material) ? o.material : o.material ? [o.material] : [];
      for (const m of mats) {
        m.transparent = true;
        m.opacity = pose.fade;
        m.depthWrite = pose.fade > 0.4;
      }
    });
  }
}

export function makeTulwarGeo(scale = 1.12) {
  const s = scale;
  const grip = new THREE.CylinderGeometry(0.016 * s, 0.02 * s, 0.22 * s, 10);
  grip.translate(0, 0.11 * s, 0);
  const wrap = new THREE.TorusGeometry(0.02 * s, 0.007 * s, 6, 10);
  wrap.rotateX(Math.PI / 2);
  wrap.translate(0, 0.08 * s, 0);
  const pommel = new THREE.SphereGeometry(0.026 * s, 10, 8);
  pommel.translate(0, 0.008 * s, 0);
  const guard = new THREE.TorusGeometry(0.055 * s, 0.011 * s, 8, 16);
  guard.rotateX(Math.PI / 2);
  guard.translate(0, 0.22 * s, 0);
  const quillon = new THREE.BoxGeometry(0.12 * s, 0.018 * s, 0.018 * s);
  quillon.translate(0, 0.22 * s, 0);
  const pts = [];
  for (let i = 0; i < 12; i++) {
    const t = i / 11;
    const w = 0.012 * s + Math.sin(t * Math.PI) * 0.034 * s;
    pts.push(new THREE.Vector2(w, 0.24 * s + t * 0.58 * s));
  }
  const blade = new THREE.LatheGeometry(pts, 12);
  blade.scale(1, 1, 0.22);
  blade.rotateZ(-0.38);
  blade.translate(0.07 * s, 0, 0);
  return merge([grip, wrap, pommel, guard, quillon, blade]);
}

export function makeSepoyLegGeo() {
  const thigh = new THREE.CapsuleGeometry(0.05, 0.22, 5, 10);
  thigh.translate(0, 0.08, 0);
  const boot = new THREE.CylinderGeometry(0.048, 0.056, 0.1, 10);
  boot.translate(0, -0.08, 0.012);
  return merge([thigh, boot]);
}

export function makeSepoyClothGeo() {
  const hip = new THREE.CylinderGeometry(0.12, 0.145, 0.18, 12);
  hip.translate(0, 0.38, 0);
  const tunic = new THREE.CylinderGeometry(0.15, 0.118, 0.38, 12);
  tunic.translate(0, 0.64, 0);
  const skirt = new THREE.CylinderGeometry(0.16, 0.15, 0.12, 12);
  skirt.translate(0, 0.32, 0);
  const sash = new THREE.TorusGeometry(0.125, 0.02, 8, 18);
  sash.rotateX(Math.PI / 2);
  sash.translate(0, 0.48, 0.01);
  const collar = new THREE.TorusGeometry(0.09, 0.016, 8, 14);
  collar.rotateX(Math.PI / 2);
  collar.translate(0, 0.84, 0.02);
  const armL = new THREE.CapsuleGeometry(0.036, 0.22, 5, 10);
  const armR = armL.clone();
  armL.rotateZ(0.38);
  armR.rotateZ(-0.48);
  armL.translate(-0.18, 0.72, 0.03);
  armR.translate(0.2, 0.7, 0.04);
  const cuffL = new THREE.TorusGeometry(0.038, 0.01, 6, 10);
  const cuffR = cuffL.clone();
  cuffL.rotateZ(0.38);
  cuffR.rotateZ(-0.48);
  cuffL.translate(-0.26, 0.6, 0.04);
  cuffR.translate(0.28, 0.58, 0.05);
  return merge([hip, tunic, skirt, sash, collar, armL, armR, cuffL, cuffR]);
}

export function makeSepoyArmorGeo() {
  const plate = new THREE.CylinderGeometry(0.145, 0.16, 0.28, 12);
  plate.translate(0, 0.7, 0.02);
  const pec = new THREE.BoxGeometry(0.26, 0.12, 0.08);
  pec.translate(0, 0.76, 0.08);
  const rim = new THREE.TorusGeometry(0.13, 0.014, 8, 16);
  rim.rotateX(Math.PI / 2);
  rim.translate(0, 0.56, 0.02);
  const buckle = new THREE.BoxGeometry(0.07, 0.05, 0.03);
  buckle.translate(0, 0.48, 0.12);
  const padL = new THREE.SphereGeometry(0.062, 10, 8);
  const padR = padL.clone();
  padL.scale(1.15, 0.62, 0.95);
  padR.scale(1.15, 0.62, 0.95);
  padL.translate(-0.16, 0.82, 0.03);
  padR.translate(0.16, 0.82, 0.03);
  return merge([plate, pec, rim, buckle, padL, padR]);
}

export function makeSepoyHeadGeo() {
  const head = new THREE.SphereGeometry(0.072, 12, 10);
  head.scale(0.92, 1.08, 0.95);
  head.translate(0, SEPOY_HEAD_Y, 0.02);
  const brow = new THREE.BoxGeometry(0.08, 0.012, 0.03);
  brow.translate(0, SEPOY_HEAD_Y + 0.02, 0.062);
  const jaw = new THREE.SphereGeometry(0.04, 8, 8);
  jaw.scale(1.1, 0.55, 0.9);
  jaw.translate(0, SEPOY_HEAD_Y - 0.045, 0.02);
  return merge([head, brow, jaw]);
}

export function makeSepoyHelmGeo() {
  const dome = new THREE.SphereGeometry(0.09, 14, 10, 0, Math.PI * 2, 0, 1.72);
  dome.translate(0, SEPOY_HEAD_Y + 0.04, 0.015);
  const wrap = new THREE.TorusGeometry(0.086, 0.018, 8, 16);
  wrap.rotateX(1.15);
  wrap.translate(0, SEPOY_HEAD_Y + 0.01, 0.01);
  const visor = new THREE.BoxGeometry(0.1, 0.028, 0.04);
  visor.translate(0, SEPOY_HEAD_Y + 0.02, 0.07);
  const cheekL = new THREE.BoxGeometry(0.022, 0.06, 0.05);
  const cheekR = cheekL.clone();
  cheekL.translate(-0.055, SEPOY_HEAD_Y - 0.01, 0.04);
  cheekR.translate(0.055, SEPOY_HEAD_Y - 0.01, 0.04);
  const spike = new THREE.ConeGeometry(0.022, 0.12, 8);
  spike.translate(0, SEPOY_HEAD_Y + 0.16, 0);
  const plume = new THREE.ConeGeometry(0.016, 0.16, 6);
  plume.rotateZ(0.4);
  plume.translate(0.04, SEPOY_HEAD_Y + 0.18, -0.01);
  return merge([dome, wrap, visor, cheekL, cheekR, spike, plume]);
}

export function makeSepoyMaterials() {
  return {
    cloth: std(0x0e4a52, { rough: 0.7 }),
    clothBoss: std(0x0c3844, { rough: 0.66 }),
    armor: std(0xe0b86a, { metal: 0.74, rough: 0.32, emissive: 0x4a3008, ei: 0.16 }),
    armorBoss: std(0xf0c878, { metal: 0.8, rough: 0.26, emissive: 0x6a4008, ei: 0.2 }),
    skin: std(0xc48a58, { rough: 0.62, metal: 0.04 }),
    helm: std(0x8a6a38, { metal: 0.7, rough: 0.3, emissive: 0x2a1a08, ei: 0.1 }),
    blade: std(0xeef2f6, { metal: 0.86, rough: 0.18, emissive: 0x8899aa, ei: 0.14 }),
  };
}

export function buildWarden(opts = {}) {
  const group = new THREE.Group();
  const mats = makeSepoyMaterials();
  const cursed = !!opts.cursed;
  const hide = cursed ? std(0x2a1018, { rough: 0.55, emissive: 0x4a0808, ei: 0.1 }) : mats.clothBoss;
  const plate = cursed
    ? std(0x8a4030, { metal: 0.72, rough: 0.3, emissive: 0xff1a00, ei: 0.28 })
    : mats.armorBoss;
  const helmM = cursed ? std(0x5a2818, { metal: 0.7, rough: 0.32, emissive: 0xff2208, ei: 0.18 }) : mats.helm;
  const bladeM = cursed ? std(0xe8d8d0, { metal: 0.86, rough: 0.18, emissive: 0x441010, ei: 0.12 }) : mats.blade;
  const skin = mats.skin;

  const hip = new THREE.Mesh(new THREE.CylinderGeometry(0.17, 0.2, 0.22, 12), hide);
  hip.position.y = 0.46;
  const tunic = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.16, 0.4, 12), hide);
  tunic.position.y = 0.74;
  const legL = new THREE.Mesh(new THREE.CapsuleGeometry(0.058, 0.3, 6, 10), hide);
  const legR = legL.clone();
  legL.position.set(-0.08, 0.22, 0);
  legR.position.set(0.08, 0.22, 0);
  const chest = new THREE.Mesh(new THREE.CylinderGeometry(0.19, 0.21, 0.32, 12), plate);
  chest.position.set(0, 0.86, 0.03);
  const belt = new THREE.Mesh(new THREE.TorusGeometry(0.17, 0.024, 8, 16), plate);
  belt.rotation.x = Math.PI / 2;
  belt.position.y = 0.58;
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.1, 14, 12), skin);
  head.position.y = 1.16;
  const helm = new THREE.Mesh(new THREE.SphereGeometry(0.12, 14, 10, 0, Math.PI * 2, 0, 1.85), helmM);
  helm.position.y = 1.22;
  const spike = new THREE.Mesh(new THREE.ConeGeometry(0.032, 0.16, 8), plate);
  spike.position.y = 1.4;
  const cape = new THREE.Mesh(new THREE.BoxGeometry(0.46, 0.64, 0.05), hide);
  cape.position.set(0, 0.72, -0.22);
  cape.rotation.x = 0.22;

  const arm = new THREE.Group();
  arm.position.set(0.24, 0.9, 0.04);
  const upper = new THREE.Mesh(new THREE.CapsuleGeometry(0.042, 0.26, 5, 10), hide);
  upper.rotation.z = 0.35;
  upper.position.set(0.06, -0.02, 0);
  const cleaver = new THREE.Mesh(makeTulwarGeo(1.7), bladeM);
  cleaver.position.set(0.16, -0.14, 0.08);
  cleaver.rotation.set(0.15, 0.35, -1.05);
  arm.add(upper, cleaver);

  const off = new THREE.Mesh(new THREE.CapsuleGeometry(0.04, 0.24, 5, 10), hide);
  off.position.set(-0.22, 0.82, 0.02);
  off.rotation.z = 0.45;

  const torso = new THREE.Group();
  torso.add(hip, tunic, chest, belt, head, helm, spike, cape, off);
  group.add(torso, legL, legR, arm);
  group.userData.wardenArm = arm;
  group.userData.wardenCleaver = cleaver;
  group.userData.wardenLegs = [legL, legR];
  group.userData.wardenCape = cape;
  group.userData.wardenTorso = torso;
  group.userData.wardenChest = chest;
  group.userData.wardenGlow = [plate, helmM, bladeM];
  group.userData.wardenGlowBase = cursed ? 0.28 : 0.08;
  return group;
}

/** @deprecated alias for older calls */
export function makeLeafBladeGeo(scale = 1) {
  return makeTulwarGeo(scale);
}
export function makeCutterBodyGeo() {
  return makeSepoyClothGeo();
}
export function makeCutterHelmGeo() {
  return makeSepoyHelmGeo();
}
export function makeCutterMaterials() {
  const m = makeSepoyMaterials();
  return { body: m.cloth, boss: m.clothBoss, helm: m.helm, blade: m.blade };
}
