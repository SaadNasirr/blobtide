/** Cinematic camera helpers. Tweens live in Game via TweenPool (tween.js-style). */

export const CAM = {
  fov: 50,
  bossFov: 45,
  comboFov: 55,
  comboPulse: 0.4,
  swayDeg: 3,
  swerveDeg: 3,
  swerveReturn: 0.2,
  introZoom: 1.2,
  introDur: 1,
  victoryOrbit: 2,
  victoryPitch: (30 * Math.PI) / 180,
  lossSlow: 0.5,
  lossDur: 0.5,
  followLerp: 6.2,
  steerLag: 0.1,
  followDist: 9.15,
  followHeight: 6.35,
  lookAhead: 8.15,
};

const DEG = Math.PI / 180;

export function expEase(dt, lag = CAM.steerLag) {
  return 1 - Math.exp(-Math.max(0, dt) / Math.max(1e-4, lag));
}

export function camMode({ win = false, loss = false, bossFight = false, intro = false } = {}) {
  if (win) return "victory";
  if (loss) return "loss";
  if (bossFight) return "boss";
  if (intro) return "intro";
  return "normal";
}

export function degToRad(d) {
  return d * DEG;
}

export function swayFromSteer(steerNorm, aggressive) {
  const n = Math.max(-1, Math.min(1, steerNorm || 0));
  return n * degToRad(aggressive ? CAM.swerveDeg : CAM.swayDeg);
}

/** Triangle pulse 50 → 55 → 50 over 400ms. */
export function comboPulseFov(t, base = CAM.fov, peak = CAM.comboFov, dur = CAM.comboPulse) {
  if (t < 0 || t >= dur) return base;
  const u = t / dur;
  const k = u < 0.5 ? u / 0.5 : 1 - (u - 0.5) / 0.5;
  return base + (peak - base) * k;
}

/** Map CSS pixels of shake onto world units using the current viewport height. */
export function pxToWorld(px, heightPx = 720) {
  return (px / Math.max(1, heightPx)) * 8;
}

export function cameraShot({
  mode = "normal",
  crowdX = 0,
  crowdZ = 0,
  camX = 0,
  sway = 0,
  introZoom = 1,
  pull = 0,
  tiltUp = 0,
  orbit = 0,
  aspect = 9 / 16,
  bob = 0,
  shake = { x: 0, y: 0 },
  lookX = null,
  lookY = null,
  lookZ = null,
} = {}) {
  const wide = aspect > 1 ? 1.12 : 1;
  const lx = lookX == null ? camX * 0.28 + sway * 7.2 : lookX;
  const lz = lookZ == null ? crowdZ + CAM.lookAhead + pull * 2.7 : lookZ;

  if (mode === "victory") {
    const yaw = orbit * Math.PI * 2;
    const radius = (11.2 + orbit * 3.4) * wide;
    return {
      fov: CAM.fov,
      x: crowdX + Math.sin(yaw) * radius * 0.62,
      y: 8.4 + orbit * 4.6,
      z: crowdZ - Math.cos(yaw) * radius,
      lx: crowdX,
      ly: 1.15 + Math.sin(CAM.victoryPitch) * 5.5 * Math.min(1, orbit * 1.4),
      lz: crowdZ,
      roll: 0,
    };
  }

  if (mode === "loss") {
    return {
      fov: CAM.fov - 2,
      x: (lookX == null ? camX * 0.18 : lookX * 0.35) + shake.x,
      y: 5.35 + shake.y,
      z: (lookZ == null ? crowdZ : lookZ) - 6.2,
      lx: lookX == null ? crowdX : lookX,
      ly: lookY == null ? 0.52 : lookY,
      lz: lookZ == null ? crowdZ + 0.35 : lookZ,
      roll: 0,
    };
  }

  const boss = mode === "boss";
  const intro = mode === "intro";
  const zoom = intro || introZoom > 1.001 ? introZoom : 1;
  const dist = (CAM.followDist * zoom + pull * 2.35) * wide;
  const height = CAM.followHeight + (boss ? 0.82 : intro ? 0.28 : 0) + pull * 1.35 + tiltUp * 1.55 + bob;
  const ly = (lookY == null ? 0.58 : lookY) + tiltUp * 2.35 + pull * 1.05 + (boss ? 0.38 : 0);
  return {
    fov: boss ? CAM.bossFov : CAM.fov,
    x: camX * 0.42 + shake.x,
    y: height + shake.y,
    z: crowdZ - dist,
    lx,
    ly,
    lz,
    roll: sway,
  };
}
