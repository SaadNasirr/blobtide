import * as THREE from "three";
import { isSharedGeo, sharedGeos } from "./gpu.js";

export const MAX_CLOUDS = 50;
export const MAX_RAIN = 180;
export const MAX_DUST = 80;
export const WEATHER_BLEND = 2.5;
export const DRIFT_SCALE = 42;

export const CLOUD_TYPES = {
  cumulus: { id: "cumulus", sx: 2.6, sy: 1.15, sz: 1.4, opacity: 0.88 },
  stratus: { id: "stratus", sx: 3.8, sy: 0.42, sz: 1.6, opacity: 0.55 },
  cumulonimbus: { id: "cumulonimbus", sx: 3.1, sy: 2.35, sz: 1.8, opacity: 0.92 },
  cirrus: { id: "cirrus", sx: 4.2, sy: 0.28, sz: 1.1, opacity: 0.42 },
};

export const WEATHER_AUDIO = {
  sunny: { windDb: -10, rain: false },
  cloudy: { windDb: -5, rain: false },
  storm: { windDb: 0, rain: true },
  rain: { windDb: 0, rain: true },
};

export const LAYER_SPEED = [0.5, 1, 1.5];

export const WEATHER_PROFILES = {
  meadow: {
    type: "cumulus",
    speed: 0.01,
    color: 0xf4f8fc,
    tint: 0xd8dee8,
    coverage: 30,
    count: 50,
    weather: "sunny",
  },
  dunes: {
    type: "cirrus",
    speed: 0.03,
    color: 0xffcc99,
    tint: 0xffcc99,
    coverage: 10,
    count: 8,
    weather: "sunny",
    dust: true,
    haze: true,
  },
  frost: {
    type: "cirrus",
    speed: 0.005,
    color: 0xe8f4ff,
    tint: 0xc8e0f8,
    coverage: 40,
    count: 28,
    weather: "cloudy",
    sparkle: true,
  },
  grove: {
    type: "stratus",
    speed: 0.015,
    color: 0xe4e8ee,
    tint: 0xb8c0c8,
    coverage: 60,
    count: 40,
    weather: "cloudy",
    mist: true,
  },
  ember: {
    type: "stratus",
    speed: 0.02,
    color: 0xff6b35,
    tint: 0xff8844,
    coverage: 50,
    count: 32,
    weather: "cloudy",
    emissive: 0xff6b35,
    ash: true,
    smoke: true,
  },
  amber: {
    type: "cumulus",
    speed: 0.01,
    color: 0xffb347,
    tint: 0xffc8a0,
    coverage: 40,
    count: 28,
    weather: "cloudy",
    emissive: 0xffb347,
  },
  lagoon: {
    type: "cumulus",
    speed: 0.025,
    color: 0xffffff,
    tint: 0xc8d8e8,
    coverage: 50,
    count: 32,
    weather: "cloudy",
    spray: true,
  },
  prism: {
    type: "cirrus",
    speed: 0.008,
    color: 0xffc8ff,
    tint: 0xa8f0ff,
    coverage: 40,
    count: 28,
    weather: "cloudy",
    rainbow: true,
    emissive: 0x88a0ff,
    shimmer: true,
  },
  nightfen: {
    type: "stratus",
    speed: 0.01,
    color: 0x4a0082,
    tint: 0x1a0030,
    coverage: 80,
    count: 42,
    weather: "storm",
    emissive: 0x2ee8c8,
    glowEdge: true,
  },
  highwake: {
    type: "cumulus",
    speed: 0.02,
    color: 0xffffff,
    tint: 0x8898a8,
    coverage: 20,
    count: 14,
    weather: "sunny",
  },
  crown: {
    type: "cumulonimbus",
    speed: 0.05,
    color: 0x1a1a1a,
    tint: 0x2a2a32,
    coverage: 90,
    count: 48,
    weather: "storm",
    lightning: true,
    rain: true,
    thunder: true,
  },
};

const Z_WRAP = [-18, 72];
const X_SPAN = 44;

let _puff = null;

export function weatherProfile(id) {
  return WEATHER_PROFILES[id] || WEATHER_PROFILES.meadow;
}

export function weatherKindFromCoverage(coverage, rain) {
  if (rain || coverage >= 75) return coverage >= 85 || rain ? (rain ? "storm" : "cloudy") : "cloudy";
  if (coverage >= 35) return "cloudy";
  return "sunny";
}

export function windGain(db, ref = 0.1) {
  return ref * Math.pow(10, db / 20);
}

function puffMap() {
  if (_puff) return _puff;
  if (typeof document === "undefined") return null;
  const c = document.createElement("canvas");
  c.width = 128;
  c.height = 64;
  const g = c.getContext("2d");
  g.clearRect(0, 0, 128, 64);
  const blobs = [
    [64, 38, 28],
    [42, 34, 22],
    [86, 34, 22],
    [30, 40, 16],
    [98, 40, 16],
    [64, 24, 18],
  ];
  for (const [x, y, r] of blobs) {
    const grd = g.createRadialGradient(x, y, 2, x, y, r);
    grd.addColorStop(0, "rgba(255,255,255,0.95)");
    grd.addColorStop(0.55, "rgba(255,255,255,0.55)");
    grd.addColorStop(1, "rgba(255,255,255,0)");
    g.fillStyle = grd;
    g.beginPath();
    g.arc(x, y, r, 0, Math.PI * 2);
    g.fill();
  }
  _puff = new THREE.CanvasTexture(c);
  _puff.colorSpace = THREE.SRGBColorSpace;
  _puff.wrapS = THREE.RepeatWrapping;
  _puff.wrapT = THREE.RepeatWrapping;
  _puff.needsUpdate = true;
  return _puff;
}

function hueColor(i, n) {
  const h = i / Math.max(1, n);
  return new THREE.Color().setHSL(h, 0.55, 0.72);
}

export class WeatherSystem {
  constructor(parent) {
    this.group = new THREE.Group();
    this.group.name = "weather";
    parent?.add(this.group);
    const geo = sharedGeos();
    this._dummy = new THREE.Object3D();
    this.worldId = "meadow";
    this.profile = weatherProfile("meadow");
    this.type = "sunny";
    this.coverage = 30;
    this.coverTarget = 30;
    this.speedMul = 1;
    this.speedTarget = 1;
    this.flash = 0;
    this.struck = false;
    this.thunderReady = false;
    this._thunderIn = 0;
    this._stormWait = 4;
    this._blend = 0;
    this._clock = 0;
    this.morph = false;
    this.rainOn = false;
    this.dustOn = false;
    this.audioKind = "sunny";
    this.audioDb = WEATHER_AUDIO.sunny.windDb;

    const map = puffMap();
    this.cloudMat = new THREE.MeshBasicMaterial({
      color: 0xf4f8fc,
      map,
      transparent: true,
      opacity: 0.82,
      depthWrite: false,
      fog: true,
      side: THREE.DoubleSide,
    });
    this.cloudMesh = new THREE.InstancedMesh(geo.plane, this.cloudMat, MAX_CLOUDS);
    this.cloudMesh.frustumCulled = false;
    this.cloudMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    this.cloudMesh.count = 1;
    this.group.add(this.cloudMesh);

    this._slots = Array.from({ length: MAX_CLOUDS }, () => ({
      x: 0,
      y: 12,
      z: 20,
      sx: 2,
      sy: 1,
      sz: 1,
      layer: 1,
      spin: 0,
    }));

    const rainPos = new Float32Array(MAX_RAIN * 3);
    this._rainV = new Float32Array(MAX_RAIN);
    for (let i = 0; i < MAX_RAIN; i++) this._seedDrop(rainPos, i, 18);
    this._rainGeo = new THREE.BufferGeometry();
    this._rainGeo.setAttribute("position", new THREE.BufferAttribute(rainPos, 3));
    this.rainMat = new THREE.PointsMaterial({
      color: 0xc8e8ff,
      size: 0.12,
      sizeAttenuation: true,
      transparent: true,
      opacity: 0.55,
      depthWrite: false,
      fog: true,
    });
    this.rain = new THREE.Points(this._rainGeo, this.rainMat);
    this.rain.visible = false;
    this.rain.frustumCulled = false;
    this.group.add(this.rain);

    const dustPos = new Float32Array(MAX_DUST * 3);
    this._dustV = new Float32Array(MAX_DUST);
    for (let i = 0; i < MAX_DUST; i++) this._seedDust(dustPos, i);
    this._dustGeo = new THREE.BufferGeometry();
    this._dustGeo.setAttribute("position", new THREE.BufferAttribute(dustPos, 3));
    this.dustMat = new THREE.PointsMaterial({
      color: 0xffcc99,
      size: 0.16,
      sizeAttenuation: true,
      transparent: true,
      opacity: 0.4,
      depthWrite: false,
      fog: true,
    });
    this.dust = new THREE.Points(this._dustGeo, this.dustMat);
    this.dust.visible = false;
    this.dust.frustumCulled = false;
    this.group.add(this.dust);

    this.haze = new THREE.Mesh(
      geo.haze,
      new THREE.MeshBasicMaterial({
        color: 0xffcc99,
        transparent: true,
        opacity: 0,
        depthWrite: false,
        fog: false,
      })
    );
    this.haze.position.set(0, 3.2, 28);
    this.haze.visible = false;
    this.group.add(this.haze);

    this.flashMesh = new THREE.Mesh(
      geo.flash,
      new THREE.MeshBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0,
        depthWrite: false,
        fog: false,
      })
    );
    this.flashMesh.position.set(0, 16, 6);
    this.flashMesh.visible = false;
    this.group.add(this.flashMesh);

    this.setWorld("meadow");
  }

  _seedDrop(arr, i, fall = 16) {
    arr[i * 3] = (Math.random() - 0.5) * 28;
    arr[i * 3 + 1] = 4 + Math.random() * 22;
    arr[i * 3 + 2] = (Math.random() - 0.5) * 40;
    this._rainV[i] = fall + Math.random() * 10;
  }

  _seedDust(arr, i) {
    arr[i * 3] = (Math.random() - 0.5) * 36;
    arr[i * 3 + 1] = 0.4 + Math.random() * 6;
    arr[i * 3 + 2] = (Math.random() - 0.5) * 40;
    this._dustV[i] = 2.4 + Math.random() * 4;
  }

  setWorld(id) {
    const p = weatherProfile(id);
    this.worldId = WEATHER_PROFILES[id] ? id : "meadow";
    this.profile = p;
    this.coverage = p.coverage;
    this.coverTarget = p.coverage;
    this.speedMul = 1;
    this.speedTarget = 1;
    this._blend = 0;
    this.flash = 0;
    this.struck = false;
    this.thunderReady = false;
    this._thunderIn = 0;
    this._stormWait = p.lightning ? 3 + Math.random() * 4 : 8;
    this.setWeatherType(p.weather, { instant: true });
    this._layoutClouds();
    this._tint();
    this.dustOn = !!p.dust;
    this.dust.visible = this.dustOn;
    this.haze.visible = !!p.haze;
    this.haze.material.opacity = p.haze ? 0.12 : 0;
    this.rainOn = !!p.rain && (this.type === "storm" || this.type === "rain");
    this.rain.visible = this.rainOn || !!p.ash || !!p.spray;
    this.rainMat.color.setHex(p.ash ? 0xff8844 : p.spray ? 0xd8f0ff : 0xc8e8ff);
    this._syncAudio();
    return p;
  }

  _layoutClouds() {
    const p = this.profile;
    const kind = CLOUD_TYPES[p.type] || CLOUD_TYPES.cumulus;
    const n = Math.max(1, Math.min(MAX_CLOUDS, p.count | 0));
    this.cloudMesh.count = n;
    const col = new THREE.Color(p.color);
    for (let i = 0; i < n; i++) {
      const layer = i % 3;
      const slot = this._slots[i];
      slot.layer = layer;
      slot.x = (Math.random() - 0.5) * X_SPAN;
      slot.y = 11 + layer * 3.4 + (i % 5) * 0.35;
      slot.z = Z_WRAP[0] + Math.random() * (Z_WRAP[1] - Z_WRAP[0]);
      const puff = 0.72 + (i % 7) * 0.08;
      slot.sx = kind.sx * puff;
      slot.sy = kind.sy * puff;
      slot.sz = kind.sz;
      slot.spin = (i % 5) * 0.2;
      if (this.cloudMesh.setColorAt) {
        if (p.rainbow) this.cloudMesh.setColorAt(i, hueColor(i, n));
        else this.cloudMesh.setColorAt(i, i % 3 ? col : new THREE.Color(p.tint));
      }
    }
    if (this.cloudMesh.instanceColor) this.cloudMesh.instanceColor.needsUpdate = true;
    this._writeMatrices(true);
  }

  _tint() {
    const p = this.profile;
    this.cloudMat.color.setHex(p.color);
    this.cloudMat.opacity = (CLOUD_TYPES[p.type]?.opacity || 0.8) * (0.35 + (this.coverage / 100) * 0.65);
    if (p.emissive) {
      this.cloudMat.color.lerp(new THREE.Color(p.emissive), 0.35);
    }
  }

  _writeMatrices(force) {
    const n = this.cloudMesh.count;
    const sparkle = this.profile.sparkle || this.profile.shimmer;
    const t = this._clock;
    for (let i = 0; i < n; i++) {
      const s = this._slots[i];
      const wob = sparkle && !force ? 1 + Math.sin(t * 2.2 + i) * 0.04 : 1;
      this._dummy.position.set(s.x, s.y, s.z);
      this._dummy.rotation.set(0, Math.PI, s.spin);
      this._dummy.scale.set(s.sx * wob, s.sy * wob, s.sz);
      this._dummy.updateMatrix();
      this.cloudMesh.setMatrixAt(i, this._dummy.matrix);
    }
    this.cloudMesh.instanceMatrix.needsUpdate = true;
  }

  updateCloudCover(coverage0to100) {
    const next = Math.max(0, Math.min(100, Number(coverage0to100) || 0));
    this.coverTarget = next;
    this._blend = WEATHER_BLEND;
    this._syncAudio();
    return this.coverTarget;
  }

  setWeatherType(type, { instant = false } = {}) {
    const kind = WEATHER_AUDIO[type] ? type : "cloudy";
    this.type = kind;
    const p = this.profile;
    if (kind === "sunny") {
      this.coverTarget = Math.min(this.coverTarget, Math.max(8, p.coverage * 0.55));
      this.speedTarget = 1;
      this.rainOn = false;
    } else if (kind === "cloudy") {
      this.coverTarget = Math.max(this.coverTarget, Math.max(p.coverage, 40));
      this.speedTarget = 1.15;
      this.rainOn = !!p.spray;
    } else {
      this.coverTarget = Math.max(p.coverage, 80);
      this.speedTarget = kind === "storm" ? 1.65 : 1.35;
      this.rainOn = !!(p.rain || kind === "rain");
    }
    if (instant) {
      this.coverage = this.coverTarget;
      this.speedMul = this.speedTarget;
      this._blend = 0;
      this._tint();
    } else this._blend = WEATHER_BLEND;
    this.rain.visible = this.rainOn || !!p.ash || !!p.spray;
    this._syncAudio();
    return this.type;
  }

  beginStorm() {
    this.setWeatherType("storm");
    if (this.profile.lightning) this._stormWait = Math.min(this._stormWait, 1.2);
    return this.type;
  }

  endStorm() {
    const calm = this.profile.coverage >= 55 ? "cloudy" : "sunny";
    this.setWeatherType(calm);
    this.coverTarget = this.profile.coverage;
    this.speedTarget = 1;
    this._blend = WEATHER_BLEND;
    this._syncAudio();
    return this.type;
  }

  playLightning() {
    if (!this.profile.lightning && this.type !== "storm") return false;
    this.flash = 1;
    this.struck = true;
    this._thunderIn = 0.28 + Math.random() * 0.5;
    this.flashMesh.visible = true;
    return true;
  }

  consumeStrike() {
    if (!this.struck) return false;
    this.struck = false;
    return true;
  }

  consumeThunder() {
    if (!this.thunderReady) return false;
    this.thunderReady = false;
    return true;
  }

  driftClouds(deltaTime) {
    const dt = Math.max(0, Math.min(0.05, Number(deltaTime) || 0));
    const p = this.profile;
    const n = this.cloudMesh.count;
    const base = p.speed * this.speedMul * DRIFT_SCALE;
    for (let i = 0; i < n; i++) {
      const s = this._slots[i];
      s.z += base * LAYER_SPEED[s.layer] * dt;
      s.x += Math.sin(this._clock * 0.11 + i) * dt * base * 0.08;
      if (s.z > Z_WRAP[1]) {
        s.z = Z_WRAP[0];
      }
    }
  }

  _syncAudio() {
    const rain = this.rainOn && (this.type === "storm" || this.type === "rain" || this.profile.rain);
    const kind = this.type === "storm" || this.type === "rain" || rain ? "storm" : this.coverage >= 45 || this.type === "cloudy" ? "cloudy" : "sunny";
    this.audioKind = kind;
    this.audioDb = WEATHER_AUDIO[kind].windDb;
  }

  tick(dt, reduceMotion = false, crowdZ = 0) {
    this._clock += dt;
    this.group.position.z = crowdZ;
    if (this._blend > 0) {
      const k = Math.min(1, dt / Math.max(0.0001, this._blend));
      this.coverage += (this.coverTarget - this.coverage) * Math.min(1, k * 3);
      this.speedMul += (this.speedTarget - this.speedMul) * Math.min(1, k * 3);
      this._blend = Math.max(0, this._blend - dt);
      this._tint();
      this._syncAudio();
    }
    if (!reduceMotion) this.driftClouds(dt);
    this._writeMatrices(reduceMotion);

    if (this.morph && this.cloudMat.map && !reduceMotion) {
      this.cloudMat.map.offset.x = (this._clock * 0.012) % 1;
      this.cloudMat.map.offset.y = Math.sin(this._clock * 0.08) * 0.04;
    }

    if (this.profile.glowEdge && this.cloudMesh.instanceColor) {
      const pulse = 0.55 + Math.sin(this._clock * 1.6) * 0.2;
      this.cloudMat.opacity = 0.55 + pulse * 0.25 * (this.coverage / 100);
    }

    if (this.profile.lightning && (this.type === "storm" || this.coverage >= 70)) {
      this._stormWait -= dt;
      if (this._stormWait <= 0) {
        this._stormWait = 3 + Math.random() * 4;
        this.playLightning();
      }
    }
    if (this._thunderIn > 0) {
      this._thunderIn -= dt;
      if (this._thunderIn <= 0) this.thunderReady = true;
    }
    this.flash = Math.max(0, this.flash - dt / 0.11);
    this.flashMesh.material.opacity = this.flash * 0.72;
    this.flashMesh.visible = this.flash > 0.02;

    const p = this.profile;
    const drops = this.rain.visible && !reduceMotion;
    if (drops) {
      const arr = this._rainGeo.attributes.position.array;
      const ash = !!p.ash && !this.rainOn;
      const spray = !!p.spray && !this.rainOn;
      const wind = this.speedMul * (p.speed * 18 + (this.rainOn ? 6 : 1));
      for (let i = 0; i < MAX_RAIN; i++) {
        if (ash) {
          arr[i * 3 + 1] -= this._rainV[i] * 0.18 * dt;
          arr[i * 3] += Math.sin(this._clock + i) * dt * 0.5;
        } else if (spray) {
          arr[i * 3 + 1] += Math.sin(this._clock * 3 + i) * dt * 0.8;
          arr[i * 3] += wind * dt * 0.4;
          if (arr[i * 3 + 1] > 4) arr[i * 3 + 1] = 0.2 + Math.random();
        } else {
          arr[i * 3] += wind * dt;
          arr[i * 3 + 1] -= this._rainV[i] * dt;
          arr[i * 3 + 2] += dt * 2;
        }
        if (arr[i * 3 + 1] < 0.15) this._seedDrop(arr, i, this.rainOn ? 18 : 8);
        if (arr[i * 3] > 16) arr[i * 3] = -16;
      }
      this._rainGeo.attributes.position.needsUpdate = true;
      this.rainMat.opacity = this.rainOn ? 0.5 : ash ? 0.42 : 0.28;
    }

    if (this.dust.visible && !reduceMotion) {
      const arr = this._dustGeo.attributes.position.array;
      for (let i = 0; i < MAX_DUST; i++) {
        arr[i * 3] += this._dustV[i] * dt;
        arr[i * 3 + 1] -= dt * 0.18;
        arr[i * 3 + 2] += dt * 0.4;
        if (arr[i * 3] > 18 || arr[i * 3 + 1] < 0.12) this._seedDust(arr, i);
      }
      this._dustGeo.attributes.position.needsUpdate = true;
    }
    if (this.haze.visible) {
      this.haze.material.opacity = 0.1 + Math.sin(this._clock * 1.4) * 0.05;
      this.haze.position.y = 3.1 + Math.sin(this._clock * 0.9) * 0.25;
    }
    return this.flash;
  }

  dispose() {
    this.group.traverse((o) => {
      if (o.geometry && !isSharedGeo(o.geometry)) o.geometry.dispose?.();
      const mats = Array.isArray(o.material) ? o.material : o.material ? [o.material] : [];
      for (const m of mats) {
        if (m.map && m.map !== _puff) m.map.dispose?.();
        m.dispose?.();
      }
    });
    this.group.removeFromParent();
  }
}
