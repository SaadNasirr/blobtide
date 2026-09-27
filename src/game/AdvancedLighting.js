import * as THREE from "three";
import { sunPosition } from "../content/themes.js";
import { deviceProfile } from "./gpu.js";

export const SHADOW_MAP_IDEAL = 2048;
export const MAX_POINT_LIGHTS = 3;
export const HEMI_FILL = 0.5;

export const LIGHT_PROFILES = {
  meadow: {
    dir: 0xffff99,
    dirInt: 0.9,
    hemiSky: 0xfff6c8,
    hemiGround: 0x4a7a38,
    hemiInt: 0.6,
    bloom: 0.55,
    grade: 0xc8f0ff,
    gradeOp: 0.08,
    vignette: 0.22,
    rays: 0.45,
    exposure: 1.05,
    vibe: "cheerful",
  },
  dunes: {
    dir: 0xffcc66,
    dirInt: 1,
    hemiSky: 0xffe0a0,
    hemiGround: 0xb88848,
    hemiInt: 0.5,
    bloom: 0.7,
    grade: 0xffc070,
    gradeOp: 0.12,
    vignette: 0.2,
    rays: 0.62,
    exposure: 1.18,
    vibe: "harsh",
  },
  frost: {
    dir: 0xe8f4f8,
    dirInt: 0.7,
    hemiSky: 0xd0e8f8,
    hemiGround: 0x6a8898,
    hemiInt: 0.6,
    bloom: 0.48,
    grade: 0xb8e0f0,
    gradeOp: 0.1,
    vignette: 0.18,
    rays: 0.35,
    exposure: 1.02,
    vibe: "cold",
  },
  grove: {
    dir: 0xffdd99,
    dirInt: 0.6,
    hemiSky: 0xe8ffd8,
    hemiGround: 0x2a6830,
    hemiInt: 0.5,
    bloom: 0.5,
    grade: 0xc8e8a8,
    gradeOp: 0.09,
    vignette: 0.24,
    rays: 0.32,
    exposure: 0.98,
    vibe: "dappled",
  },
  ember: {
    dir: 0xff6b35,
    dirInt: 0.9,
    hemiSky: 0xffc080,
    hemiGround: 0x2a1010,
    hemiInt: 0.4,
    bloom: 0.9,
    grade: 0xff6b35,
    gradeOp: 0.14,
    vignette: 0.32,
    rays: 0.28,
    exposure: 1.08,
    points: [{ color: 0xff4a12, int: 1.6, dist: 16, y: 2.4, z: 10 }],
    vibe: "fiery",
  },
  amber: {
    dir: 0xffb366,
    dirInt: 0.7,
    hemiSky: 0xffd0a0,
    hemiGround: 0x7a4030,
    hemiInt: 0.5,
    bloom: 0.62,
    grade: 0xffb347,
    gradeOp: 0.12,
    vignette: 0.26,
    rays: 0.5,
    exposure: 1.04,
    vibe: "golden",
  },
  lagoon: {
    dir: 0x66ffff,
    dirInt: 0.85,
    hemiSky: 0xe8fff8,
    hemiGround: 0x2a8870,
    hemiInt: 0.6,
    bloom: 0.58,
    grade: 0x66e8ff,
    gradeOp: 0.1,
    vignette: 0.15,
    rays: 0.48,
    exposure: 1.1,
    vibe: "tropical",
  },
  prism: {
    dir: 0xff66ff,
    dirInt: 0.7,
    hemiSky: 0xe8e8ff,
    hemiGround: 0x4860a0,
    hemiInt: 0.5,
    bloom: 1,
    grade: 0xc77dff,
    gradeOp: 0.16,
    vignette: 0.28,
    rays: 0.4,
    chromatic: 0.04,
    exposure: 1.06,
    rainbow: true,
    points: [{ color: 0xff66ff, int: 1.2, dist: 14, y: 3, z: 8 }],
    vibe: "surreal",
  },
  nightfen: {
    dir: 0x6699ff,
    dirInt: 0.3,
    hemiSky: 0x2a1848,
    hemiGround: 0x081018,
    hemiInt: 0.2,
    bloom: 0.4,
    grade: 0x304878,
    gradeOp: 0.18,
    vignette: 0.38,
    rays: 0,
    moon: true,
    exposure: 0.78,
    points: [
      { color: 0x2ee8c8, int: 1.1, dist: 12, y: 1.6, z: 6, x: -4 },
      { color: 0x7fff00, int: 0.7, dist: 10, y: 1.2, z: 14, x: 5 },
    ],
    vibe: "mysterious",
  },
  highwake: {
    dir: 0xffffff,
    dirInt: 0.95,
    hemiSky: 0xffffff,
    hemiGround: 0x88a8b8,
    hemiInt: 0.7,
    bloom: 0.52,
    grade: 0xd8f0ff,
    gradeOp: 0.07,
    vignette: 0.16,
    rays: 0.55,
    exposure: 1.16,
    vibe: "sky",
  },
  crown: {
    dir: 0x999999,
    dirInt: 0.4,
    hemiSky: 0x4a3048,
    hemiGround: 0x1a0c10,
    hemiInt: 0.3,
    bloom: 0.35,
    grade: 0x4a2030,
    gradeOp: 0.16,
    vignette: 0.5,
    rays: 0,
    storm: true,
    exposure: 0.82,
    points: [
      { color: 0xff7722, int: 0.9, dist: 11, y: 2.2, z: 8, x: -5 },
      { color: 0xffaa44, int: 0.7, dist: 10, y: 2, z: 16, x: 4 },
    ],
    vibe: "ominous",
  },
};

const DAWN = new THREE.Color(0xffc878);
const NOON = new THREE.Color(0xfff6e8);
const DUSK = new THREE.Color(0xff6a32);
const NIGHT = new THREE.Color(0x1a2238);

export function lightProfile(id) {
  return LIGHT_PROFILES[id] || LIGHT_PROFILES.meadow;
}

/** Dawn/sunset 0.3, noon 1.0. Nightfen uses moon path separately. */
export function sunDayIntensity(timeOfDay) {
  const t = Math.max(0, Math.min(1, Number(timeOfDay) || 0));
  const noon = 1 - Math.abs(t - 0.5) * 2;
  return 0.3 + noon * 0.7;
}

export function sunDayColor(timeOfDay, out = new THREE.Color()) {
  const t = Math.max(0, Math.min(1, Number(timeOfDay) || 0));
  if (t < 0.28) return out.copy(DAWN).lerp(NOON, t / 0.28);
  if (t < 0.62) return out.copy(NOON);
  if (t < 0.88) return out.copy(NOON).lerp(DUSK, (t - 0.62) / 0.26);
  return out.copy(DUSK).lerp(NIGHT, (t - 0.88) / 0.12);
}

export function shadowMapSize(gpu = deviceProfile()) {
  if (gpu.mobile) return 0;
  return SHADOW_MAP_IDEAL;
}

export class LightingSystem {
  constructor({ renderer, scene, camera, hemi, key, rim, back, gradeMat, mobile } = {}) {
    this.renderer = renderer;
    this.scene = scene;
    this.camera = camera;
    this.hemi = hemi;
    this.key = key;
    this.rim = rim;
    this.back = back;
    this.gradeMat = gradeMat;
    this.gpu = { mobile: !!mobile };
    this.worldId = "meadow";
    this.profile = lightProfile("meadow");
    this.timeOfDay = 0.5;
    this.bloom = 0.55;
    this.gradeOp = 0.08;
    this.vignette = 0.22;
    this.chromatic = 0;
    this.raysAmt = 0.45;
    this.fx = { bloom: true, grade: true, vignette: true, chromatic: false, rays: true, grain: false, dof: false, motion: false };
    this._clock = 0;
    this._dayCol = new THREE.Color();
    this._tint = new THREE.Color();
    this._flash = 0;

    if (renderer) {
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.05;
      renderer.shadowMap.enabled = false;
    }
    if (key) key.castShadow = false;

    this.points = [];
    for (let i = 0; i < MAX_POINT_LIGHTS; i++) {
      const p = new THREE.PointLight(0xff6b35, 0, 12, 2);
      p.visible = false;
      scene?.add(p);
      this.points.push(p);
    }

    this.rayGroup = new THREE.Group();
    this.rayGroup.name = "godrays";
    this.rayMat = new THREE.MeshBasicMaterial({
      color: 0xffe8b0,
      transparent: true,
      opacity: 0,
      depthWrite: false,
      depthTest: true,
      blending: THREE.AdditiveBlending,
      fog: false,
      side: THREE.DoubleSide,
    });
    const rayGeo = new THREE.PlaneGeometry(10, 32);
    const m = new THREE.Mesh(rayGeo, this.rayMat);
    m.position.set(-8, 18, 36);
    m.rotation.set(0.32, 0.38, 0.12);
    this.rayGroup.add(m);
    this.rayGroup.visible = false;
    scene?.add(this.rayGroup);

    this.chromaR = null;
    this.chromaB = null;
    if (camera && !this.gpu.mobile) {
      const chromaGeo = new THREE.PlaneGeometry(2.4, 2.4);
      const mk = (color, x) => {
        const mat = new THREE.MeshBasicMaterial({
          color,
          transparent: true,
          opacity: 0,
          depthTest: false,
          depthWrite: false,
          blending: THREE.AdditiveBlending,
          fog: false,
          toneMapped: false,
        });
        const mesh = new THREE.Mesh(chromaGeo, mat);
        mesh.position.set(x, 0, -0.41);
        mesh.frustumCulled = false;
        mesh.renderOrder = 999;
        camera.add(mesh);
        return mesh;
      };
      this.chromaR = mk(0xff2244, 0.012);
      this.chromaB = mk(0x2266ff, -0.012);
    }

    this.updateLightingForWorld("meadow");
  }

  updateLightingForWorld(worldId, world) {
    const p = lightProfile(worldId);
    this.worldId = LIGHT_PROFILES[worldId] ? worldId : "meadow";
    this.profile = p;
    this.bloom = p.bloom;
    this.gradeOp = p.gradeOp;
    this.vignette = p.vignette;
    this.chromatic = this.gpu.mobile ? 0 : p.chromatic || 0;
    this.raysAmt = 0;
    this.fx.chromatic = this.chromatic > 0;
    this.fx.rays = false;
    if (this.renderer) this.renderer.toneMappingExposure = p.exposure;
    if (this.hemi) {
      this.hemi.color.setHex(world?.hemiSky ?? p.hemiSky);
      this.hemi.groundColor.setHex(world?.hemiGround ?? p.hemiGround);
      this.hemi.intensity = p.hemiInt;
    }
    const t = world?.sunT ?? this.timeOfDay;
    this.updateLightingForTimeOfDay(t);
    this._placePoints(p);
    if (this.back) {
      if (p.storm) {
        this.back.color.setHex(0xff7722);
        this.back.intensity = 0.45;
        this.back.position.set(0, 6, 40);
      } else if (p.moon) {
        this.back.color.setHex(0x00d9cc);
        this.back.intensity = 0.28;
      } else if (this.worldId === "ember") {
        this.back.color.setHex(0xff6b35);
        this.back.intensity = 0.22;
      } else {
        this.back.color.setHex(p.dir);
        this.back.intensity = 0.08;
      }
    }
    if (this.rim) this.rim.color.setHex(p.moon ? 0x2ee8c8 : p.dir);
    this._applyGrade();
    this.rayGroup.visible = this.fx.rays && this.raysAmt > 0.05;
    return p;
  }

  updateLightingForTimeOfDay(time) {
    const t = Math.max(0, Math.min(1, Number(time) || 0));
    this.timeOfDay = t;
    const p = this.profile;
    sunDayColor(t, this._dayCol);
    this._tint.setHex(p.dir);
    if (p.moon) {
      this._tint.setHex(0x6699ff);
    } else if (p.storm) {
      this._tint.setHex(0x999999);
    } else {
      this._tint.lerp(this._dayCol, 0.45);
    }
    const day = p.moon || p.storm ? 1 : sunDayIntensity(t);
    let intensity = p.dirInt * day;
    if (p.moon) intensity = 0.3;
    if (p.storm) intensity = 0.4 + this._flash * 2.4;
    if (this.key) {
      this.key.color.copy(this._tint);
      this.key.intensity = intensity;
      const pos = sunPosition(p.moon ? 0.18 : t);
      this.key.position.set(pos.x, p.storm ? 6.2 : pos.y, pos.z);
      this.key.visible = !(p.moon && intensity < 0.05);
    }
    if (this.hemi && !this._flash) this.hemi.intensity = p.hemiInt;
    if (this.rayMat) {
      this.rayMat.color.copy(this._tint);
      this.rayMat.opacity = this.fx.rays ? this.raysAmt * (p.moon || p.storm ? 0 : 0.06 + day * 0.05) : 0;
    }
    return { intensity, time: t };
  }

  enableEffect(effectName, intensity) {
    const name = String(effectName || "");
    const on = intensity == null ? true : Number(intensity) > 0;
    if (name in this.fx) this.fx[name] = on;
    if (name === "bloom") this.bloom = on ? (Number(intensity) || this.profile.bloom) : 0;
    if (name === "grade") this.gradeOp = on ? (Number(intensity) || this.profile.gradeOp) : 0;
    if (name === "vignette") this.vignette = on ? (Number(intensity) || this.profile.vignette) : 0;
    if (name === "chromatic") this.chromatic = this.gpu.mobile ? 0 : on ? Number(intensity) || 0.03 : 0;
    if (name === "rays") {
      this.raysAmt = on ? Number(intensity) || this.profile.rays : 0;
      this.rayGroup.visible = this.raysAmt > 0.05 && !this.gpu.mobile;
    }
    this._applyGrade();
    return this.fx[name];
  }

  setBloomIntensity(intensity) {
    this.bloom = Math.max(0, Math.min(1.5, Number(intensity) || 0));
    this._applyGrade();
    return this.bloom;
  }

  setColorGrade(intensity) {
    this.gradeOp = Math.max(0, Math.min(0.5, Number(intensity) || 0));
    this._applyGrade();
    return this.gradeOp;
  }

  bindReceivers(floor, crowdMesh) {
    if (!this.renderer?.shadowMap.enabled) return;
    if (floor) {
      floor.receiveShadow = true;
      if (floor.material && floor.material.isMeshBasicMaterial && floor.material.map) {
        const map = floor.material.map;
        const next = new THREE.MeshLambertMaterial({ map, color: 0xffffff });
        floor.material.dispose?.();
        floor.material = next;
      }
    }
    if (crowdMesh) {
      crowdMesh.castShadow = true;
      crowdMesh.receiveShadow = false;
    }
  }

  _placePoints(p) {
    const specs = p.points || [];
    for (let i = 0; i < MAX_POINT_LIGHTS; i++) {
      const light = this.points[i];
      const spec = specs[i];
      if (!spec) {
        light.visible = false;
        light.intensity = 0;
        continue;
      }
      light.visible = true;
      light.color.setHex(spec.color);
      light.intensity = spec.int;
      light.distance = spec.dist;
      light.decay = 2;
      light.position.set(spec.x || 0, spec.y || 2, spec.z || 8);
    }
  }

  _applyGrade() {
    if (!this.gradeMat || !this.fx.grade) {
      if (this.gradeMat && !this.fx.grade) this.gradeMat.opacity = 0;
      return;
    }
    this.gradeMat.color.setHex(this.profile.grade);
    const glow = this.fx.bloom ? this.bloom * 0.05 : 0;
    this.gradeMat.opacity = Math.min(0.42, this.gradeOp + glow);
    const chroma = this.fx.chromatic ? this.chromatic : 0;
    if (this.chromaR) {
      this.chromaR.visible = chroma > 0.002;
      this.chromaR.material.opacity = chroma * 0.35;
    }
    if (this.chromaB) {
      this.chromaB.visible = chroma > 0.002;
      this.chromaB.material.opacity = chroma * 0.28;
    }
  }

  tick(dt, { timeOfDay, flash = 0, crowdZ = 0, crowdX = 0, reduceMotion = false, pulse = 0 } = {}) {
    this._clock += dt;
    this._flash = flash;
    if (timeOfDay != null) this.updateLightingForTimeOfDay(timeOfDay);
    const p = this.profile;
    if (flash > 0.02 && this.hemi) this.hemi.intensity = p.hemiInt + flash * 2.2;
    else if (this.hemi) this.hemi.intensity = p.hemiInt;
    if (p.rainbow && !reduceMotion && this.key) {
      const h = (this._clock * 0.07) % 1;
      this.key.color.setHSL(h, 0.55, 0.62);
      this.points[0].color.setHSL((h + 0.2) % 1, 0.7, 0.55);
      if (this.gradeMat) this.gradeMat.color.setHSL((h + 0.22) % 1, 0.5, 0.52);
    }
    for (let i = 0; i < this.points.length; i++) {
      const light = this.points[i];
      if (!light.visible) continue;
      light.position.z = crowdZ + (p.points?.[i]?.z || 8);
      light.position.x = crowdX * 0.2 + (p.points?.[i]?.x || 0);
      if (p.moon) light.intensity = (p.points[i].int || 0.8) * (0.75 + Math.sin(this._clock * 2.1 + i) * 0.25);
    }
    if (this.rayGroup.visible && !reduceMotion) {
      this.rayGroup.position.z = crowdZ;
      this.rayGroup.position.x = crowdX * 0.05;
      this.rayGroup.rotation.z = Math.sin(this._clock * 0.15) * 0.04;
    }
    if (this.gradeMat && this.fx.bloom) {
      this.gradeMat.opacity = Math.min(0.36, this.gradeOp + this.bloom * 0.05 + pulse * 0.8);
    }
  }

  dispose() {
    for (const p of this.points) {
      p.removeFromParent();
    }
    this.rayGroup.removeFromParent();
    this.chromaR?.removeFromParent();
    this.chromaB?.removeFromParent();
  }
}
