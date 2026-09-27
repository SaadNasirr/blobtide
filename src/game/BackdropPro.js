import * as THREE from "three";

/** Ideal spec radius. The play camera far plane is 120–160, so the live dome uses SKY_RADIUS. */
export const SKY_IDEAL_RADIUS = 500;
export const SKY_RADIUS = 90;
export const SKY_MAP_SIZE = 512;
export const STAR_COUNT = 1800;
export const ASH_COUNT = 96;

export const SKY_PROFILES = {
  meadow: {
    base: "#87ceeb",
    top: "#4aa4e0",
    mid: "#87ceeb",
    horizon: "#ffb56a",
    sun: "#ffd54a",
    sunGlow: "#fff3c0",
    cloud: "#ffffff",
    cloudTint: 0xffffff,
    cloudCount: 7,
    cloudOpacity: 0.92,
    weather: 0.18,
    night: false,
    moon: false,
    stars: false,
    aurora: null,
    ash: false,
    mist: false,
    lightning: false,
    vibe: "peaceful morning/day",
  },
  dunes: {
    base: "#ffb347",
    top: "#ffd27a",
    mid: "#ff9a3a",
    horizon: "#e04520",
    sun: "#ff9a18",
    sunGlow: "#ffee88",
    cloud: "#f4d2a8",
    cloudTint: 0xf4d2a8,
    cloudCount: 3,
    cloudOpacity: 0.55,
    weather: 0.08,
    night: false,
    moon: false,
    stars: false,
    aurora: null,
    ash: false,
    mist: false,
    lightning: false,
    vibe: "hot desert, harsh light",
  },
  frost: {
    base: "#b0e0e6",
    top: "#7ad8ff",
    mid: "#c8f0f8",
    horizon: "#f4ffff",
    sun: "#f4fbff",
    sunGlow: "#d8f4ff",
    cloud: "#e8f8ff",
    cloudTint: 0xe8f8ff,
    cloudCount: 4,
    cloudOpacity: 0.7,
    weather: 0.12,
    night: false,
    moon: false,
    stars: false,
    aurora: "#7cffb0",
    ash: false,
    mist: false,
    lightning: false,
    vibe: "cold, pristine, ethereal",
  },
  grove: {
    base: "#90ee90",
    top: "#3a8a48",
    mid: "#6bb86a",
    horizon: "#c8f0a8",
    sun: "#ffe08a",
    sunGlow: "#d8f0a0",
    cloud: "#d8f0d0",
    cloudTint: 0xd8f0d0,
    cloudCount: 8,
    cloudOpacity: 0.88,
    weather: 0.42,
    night: false,
    moon: false,
    stars: false,
    aurora: null,
    ash: false,
    mist: true,
    lightning: false,
    vibe: "lush, misty, romantic",
  },
  ember: {
    base: "#ff6b35",
    top: "#6a1020",
    mid: "#c42818",
    horizon: "#ffb347",
    sun: "#ff4a18",
    sunGlow: "#ff8844",
    cloud: "#ff6b35",
    cloudTint: 0xff6b35,
    cloudCount: 6,
    cloudOpacity: 0.78,
    weather: 0.55,
    night: false,
    moon: false,
    stars: false,
    aurora: null,
    ash: true,
    mist: false,
    lightning: false,
    vibe: "fiery, intense, dangerous",
  },
  amber: {
    base: "#ffa500",
    top: "#ffc45a",
    mid: "#e08a40",
    horizon: "#e87878",
    sun: "#ffb040",
    sunGlow: "#ffd8a0",
    cloud: "#ffd0c8",
    cloudTint: 0xffd0c8,
    cloudCount: 5,
    cloudOpacity: 0.8,
    weather: 0.22,
    night: false,
    moon: false,
    stars: false,
    aurora: null,
    ash: false,
    mist: false,
    lightning: false,
    vibe: "golden hour, romantic, timeless",
  },
  lagoon: {
    base: "#00d9ff",
    top: "#14b8e8",
    mid: "#2ec8d4",
    horizon: "#f0ffff",
    sun: "#fff6c8",
    sunGlow: "#c8ffff",
    cloud: "#f0ffff",
    cloudTint: 0xf0ffff,
    cloudCount: 6,
    cloudOpacity: 0.86,
    weather: 0.2,
    night: false,
    moon: false,
    stars: false,
    aurora: null,
    ash: false,
    mist: false,
    lightning: false,
    vibe: "tropical paradise, breezy",
  },
  prism: {
    base: "#a366ff",
    top: "#6a28c8",
    mid: "#c45ae0",
    horizon: "#ff66aa",
    sun: "#ff88ee",
    sunGlow: "#c8a0ff",
    cloud: "#e8c8ff",
    cloudTint: 0xe8c8ff,
    cloudCount: 5,
    cloudOpacity: 0.74,
    weather: 0.28,
    night: false,
    moon: false,
    stars: false,
    aurora: "rainbow",
    ash: false,
    mist: false,
    lightning: false,
    vibe: "magical, otherworldly, dreamlike",
  },
  nightfen: {
    base: "#1a0033",
    top: "#0a0018",
    mid: "#1a0033",
    horizon: "#2a1048",
    sun: "#c8d8ff",
    sunGlow: "#88a0ff",
    cloud: "#2a1848",
    cloudTint: 0x3a2868,
    cloudCount: 4,
    cloudOpacity: 0.55,
    weather: 0.35,
    night: true,
    moon: true,
    stars: true,
    aurora: "#44ffaa",
    ash: false,
    mist: false,
    lightning: false,
    vibe: "dark, moody, mysterious",
  },
  highwake: {
    base: "#0099ff",
    top: "#0077ee",
    mid: "#66ccff",
    horizon: "#ffe8a0",
    sun: "#ffffff",
    sunGlow: "#e8f4ff",
    cloud: "#f4fbff",
    cloudTint: 0xf4fbff,
    cloudCount: 2,
    cloudOpacity: 0.5,
    weather: 0.06,
    night: false,
    moon: false,
    stars: false,
    aurora: null,
    ash: false,
    mist: false,
    lightning: false,
    vibe: "sky realm, majestic, airy",
  },
  crown: {
    base: "#2a1f3d",
    top: "#120814",
    mid: "#2a1f3d",
    horizon: "#1a0a18",
    sun: "#ff7722",
    sunGlow: "#4a2030",
    cloud: "#2a2438",
    cloudTint: 0x3a3048,
    cloudCount: 8,
    cloudOpacity: 0.9,
    weather: 0.92,
    night: true,
    moon: false,
    stars: true,
    aurora: null,
    ash: false,
    mist: false,
    lightning: true,
    vibe: "epic, threatening, climactic",
  },
};

const _texCache = new Map();
const _col = new THREE.Color();

export function skyProfile(worldId) {
  return SKY_PROFILES[worldId] || SKY_PROFILES.meadow;
}

/** timeOfDay 0 sunrise, 0.5 noon, 1 sunset. */
export function skyArcPosition(timeOfDay = 0.5, radius = SKY_RADIUS * 0.72) {
  const t = Math.max(0, Math.min(1, Number(timeOfDay) || 0));
  const a = (0.12 + t * 0.76) * Math.PI;
  return {
    x: Math.cos(a) * radius,
    y: Math.sin(a) * radius * 0.62 + 8,
    z: radius * 0.42,
  };
}

function paintSkyCanvas(profile, timeOfDay = 0.5) {
  const c = document.createElement("canvas");
  c.width = SKY_MAP_SIZE;
  c.height = SKY_MAP_SIZE;
  const g = c.getContext("2d");
  const dusk = Math.abs((timeOfDay || 0.5) - 0.5) * 2;
  const grd = g.createLinearGradient(0, 0, 0, SKY_MAP_SIZE);
  grd.addColorStop(0, profile.top);
  grd.addColorStop(0.42, profile.mid);
  grd.addColorStop(0.78, profile.horizon);
  grd.addColorStop(1, dusk > 0.7 && !profile.night ? "#3a1848" : profile.horizon);
  g.fillStyle = grd;
  g.fillRect(0, 0, SKY_MAP_SIZE, SKY_MAP_SIZE);
  if (profile.aurora === "rainbow") {
    g.globalAlpha = 0.18;
    const rain = g.createLinearGradient(0, 80, SKY_MAP_SIZE, SKY_MAP_SIZE - 80);
    rain.addColorStop(0, "#ff66aa");
    rain.addColorStop(0.33, "#c45ae0");
    rain.addColorStop(0.66, "#66f0ff");
    rain.addColorStop(1, "#ffe566");
    g.fillStyle = rain;
    g.fillRect(0, 0, SKY_MAP_SIZE, SKY_MAP_SIZE);
    g.globalAlpha = 1;
  }
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 1;
  t.needsUpdate = true;
  return t;
}

function skyMap(profile, timeBand) {
  const key = `${profile.base}:${timeBand}:${profile.horizon}`;
  if (!_texCache.has(key)) _texCache.set(key, paintSkyCanvas(profile, timeBand));
  return _texCache.get(key);
}

function auroraMap(kind) {
  const key = "aurora:" + kind;
  if (_texCache.has(key)) return _texCache.get(key);
  const c = document.createElement("canvas");
  c.width = 256;
  c.height = 128;
  const g = c.getContext("2d");
  const grd = g.createLinearGradient(0, 0, 256, 0);
  if (kind === "rainbow") {
    grd.addColorStop(0, "#ff66aa");
    grd.addColorStop(0.25, "#c45ae0");
    grd.addColorStop(0.5, "#66f0ff");
    grd.addColorStop(0.75, "#7cffb0");
    grd.addColorStop(1, "#ffe566");
  } else {
    grd.addColorStop(0, "rgba(80,255,160,0)");
    grd.addColorStop(0.5, kind || "#7cffb0");
    grd.addColorStop(1, "rgba(80,255,160,0)");
  }
  g.fillStyle = grd;
  g.fillRect(0, 0, 256, 128);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.wrapS = THREE.RepeatWrapping;
  t.needsUpdate = true;
  _texCache.set(key, t);
  return t;
}

export class AdvancedSkySystem {
  constructor(scene, worldId = "meadow", timeOfDay = 0.5) {
    this.group = new THREE.Group();
    this.group.name = "advanced-sky";
    scene?.add?.(this.group);
    this.worldId = worldId;
    this.timeOfDay = timeOfDay;
    this.weather = 0.2;
    this.night = false;
    this.flash = 0;
    this.struck = false;
    this._stormWait = 3;
    this._clock = 0;
    this._dummy = new THREE.Object3D();

    const segsW = 32;
    const segsH = 16;
    this.domeGeo = new THREE.SphereGeometry(SKY_RADIUS, segsW, segsH);
    this.domeMat = new THREE.MeshBasicMaterial({
      side: THREE.BackSide,
      depthWrite: false,
      fog: false,
      toneMapped: false,
    });
    this.dome = new THREE.Mesh(this.domeGeo, this.domeMat);
    this.dome.frustumCulled = false;
    this.dome.renderOrder = -20;
    this.group.add(this.dome);

    this.sunGeo = new THREE.SphereGeometry(3.6, 16, 12);
    this.sunMat = new THREE.MeshStandardMaterial({
      color: 0xffd54a,
      emissive: 0xffd54a,
      emissiveIntensity: 2.8,
      metalness: 1,
      roughness: 0.2,
      fog: false,
      toneMapped: false,
    });
    this.sun = new THREE.Mesh(this.sunGeo, this.sunMat);
    this.sun.renderOrder = -18;
    this.group.add(this.sun);

    this.glowMat = new THREE.MeshBasicMaterial({
      color: 0xfff3c0,
      transparent: true,
      opacity: 0.28,
      depthWrite: false,
      fog: false,
      side: THREE.DoubleSide,
    });
    this.glow = new THREE.Mesh(new THREE.CircleGeometry(7.2, 24), this.glowMat);
    this.glow.rotation.y = Math.PI;
    this.group.add(this.glow);

    this.moonGeo = new THREE.SphereGeometry(2.8, 14, 10);
    this.moonMat = new THREE.MeshPhongMaterial({
      color: 0xccccff,
      emissive: 0xa8b8ff,
      emissiveIntensity: 1.4,
      fog: false,
      toneMapped: false,
    });
    this.moon = new THREE.Mesh(this.moonGeo, this.moonMat);
    this.moon.visible = false;
    this.group.add(this.moon);

    this._makeStars();
    this._makeWisps();
    this._makeAsh();
    this._makeMist();
    this._makeAurora();

    this.flashMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(220, 110),
      new THREE.MeshBasicMaterial({
        color: 0xd8eeff,
        transparent: true,
        opacity: 0,
        depthWrite: false,
        fog: false,
      })
    );
    this.flashMesh.position.set(0, 18, 12);
    this.flashMesh.visible = false;
    this.group.add(this.flashMesh);

    this.updateForWorld(worldId);
    this.updateTimeOfDay(timeOfDay);
  }

  _makeStars() {
    const n = STAR_COUNT;
    const pos = new Float32Array(n * 3);
    this._starPhase = new Float32Array(n);
    for (let i = 0; i < n; i++) {
      const u = Math.random();
      const v = Math.random();
      const theta = u * Math.PI * 2;
      const phi = Math.acos(2 * v - 1) * 0.52;
      const r = SKY_RADIUS * 0.92;
      pos[i * 3] = Math.sin(phi) * Math.cos(theta) * r;
      pos[i * 3 + 1] = Math.abs(Math.cos(phi)) * r * 0.85 + 6;
      pos[i * 3 + 2] = Math.sin(phi) * Math.sin(theta) * r;
      this._starPhase[i] = Math.random() * Math.PI * 2;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    this._starOp = new Float32Array(n);
    geo.setAttribute("opacity", new THREE.BufferAttribute(this._starOp, 1));
    this.starMat = new THREE.PointsMaterial({
      color: 0xe8f0ff,
      size: 0.5,
      sizeAttenuation: true,
      transparent: true,
      opacity: 0.85,
      depthWrite: false,
      fog: false,
    });
    this.stars = new THREE.Points(geo, this.starMat);
    this.stars.visible = false;
    this.stars.frustumCulled = false;
    this.group.add(this.stars);
  }

  _makeWisps() {
    const geo = new THREE.SphereGeometry(1, 8, 6);
    this.wispMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.78,
      depthWrite: false,
      fog: false,
    });
    this.wisps = new THREE.InstancedMesh(geo, this.wispMat, 8);
    this.wisps.frustumCulled = false;
    this.wisps.count = 0;
    this.group.add(this.wisps);
  }

  _placeWisps(profile) {
    const n = Math.max(0, Math.min(8, profile.cloudCount | 0));
    this.wisps.count = n;
    this.wispMat.color.set(profile.cloudTint);
    this.wispMat.opacity = profile.cloudOpacity * (0.55 + this.weather * 0.45);
    for (let i = 0; i < n; i++) {
      const y = 22 + (i % 3) * 6;
      const x = (i - (n - 1) / 2) * 14;
      const z = 28 + (i % 4) * 8;
      const s = 4.2 + (i % 3) * 1.8;
      this._dummy.position.set(x, y, z);
      this._dummy.rotation.set(0, i * 0.4, 0);
      this._dummy.scale.set(s * 1.8, s * 0.42, s);
      this._dummy.updateMatrix();
      this.wisps.setMatrixAt(i, this._dummy.matrix);
    }
    this.wisps.instanceMatrix.needsUpdate = true;
    this.wisps.visible = n > 0;
  }

  _makeAsh() {
    const n = ASH_COUNT;
    const pos = new Float32Array(n * 3);
    this._ashV = new Float32Array(n);
    for (let i = 0; i < n; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 40;
      pos[i * 3 + 1] = 4 + Math.random() * 28;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 36;
      this._ashV[i] = 1.2 + Math.random() * 2.4;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    this.ashMat = new THREE.PointsMaterial({
      color: 0xff8844,
      size: 0.22,
      sizeAttenuation: true,
      transparent: true,
      opacity: 0.55,
      depthWrite: false,
      fog: false,
    });
    this.ash = new THREE.Points(geo, this.ashMat);
    this.ash.visible = false;
    this.group.add(this.ash);
  }

  _makeMist() {
    this.mistMat = new THREE.MeshBasicMaterial({
      color: 0xc8e8c0,
      transparent: true,
      opacity: 0.16,
      depthWrite: false,
      fog: false,
    });
    this.mist = new THREE.Mesh(new THREE.PlaneGeometry(70, 10), this.mistMat);
    this.mist.position.set(0, 1.4, 22);
    this.mist.visible = false;
    this.group.add(this.mist);
  }

  _makeAurora() {
    this.auroraMat = new THREE.MeshBasicMaterial({
      map: auroraMap("#7cffb0"),
      transparent: true,
      opacity: 0,
      depthWrite: false,
      fog: false,
      side: THREE.DoubleSide,
    });
    this.aurora = new THREE.Mesh(new THREE.PlaneGeometry(80, 14), this.auroraMat);
    this.aurora.position.set(0, 18, 40);
    this.aurora.visible = false;
    this.group.add(this.aurora);
  }

  updateForWorld(worldId) {
    const id = SKY_PROFILES[worldId] ? worldId : "meadow";
    this.worldId = id;
    const p = skyProfile(id);
    this._profile = p;
    this.weather = p.weather;
    this.night = !!p.night;
    const band = Math.round(this.timeOfDay * 4) / 4;
    this.domeMat.map = skyMap(p, band);
    this.domeMat.color.set(0xffffff);
    this.domeMat.needsUpdate = true;
    this.sunMat.color.set(p.sun);
    this.sunMat.emissive.set(p.sun);
    this.glowMat.color.set(p.sunGlow);
    this.moon.visible = !!p.moon;
    this.sun.visible = !p.moon && !(p.lightning && this.weather > 0.8);
    this.glow.visible = this.sun.visible;
    this.stars.visible = !!p.stars;
    this.ash.visible = !!p.ash;
    this.mist.visible = !!p.mist;
    this.mistMat.color.set(p.horizon);
    this._placeWisps(p);
    if (p.aurora) {
      this.aurora.visible = true;
      this.auroraMat.map = auroraMap(p.aurora);
      this.auroraMat.opacity = p.aurora === "rainbow" ? 0.28 : 0.18;
      this.auroraMat.needsUpdate = true;
    } else {
      this.aurora.visible = false;
      this.auroraMat.opacity = 0;
    }
    this.flash = 0;
    this.struck = false;
    this._stormWait = p.lightning ? 1.1 : 5;
    this.updateTimeOfDay(this.timeOfDay);
    return p;
  }

  updateTimeOfDay(timeElapsed) {
    const t =
      typeof timeElapsed === "number" && timeElapsed >= 0 && timeElapsed <= 1
        ? timeElapsed
        : ((this.timeOfDay || 0.5) + Math.max(0, timeElapsed || 0) * 0.004) % 1;
    this.timeOfDay = t;
    const p = this._profile || skyProfile(this.worldId);
    const pos = skyArcPosition(p.moon ? 0.18 : t);
    this.sun.position.set(pos.x, pos.y, pos.z);
    this.glow.position.copy(this.sun.position);
    this.glow.lookAt(0, 8, 0);
    if (p.moon) {
      this.moon.position.set(-pos.x * 0.7, pos.y + 4, pos.z * 0.85);
      this.sun.visible = false;
      this.glow.visible = false;
    } else if (p.lightning && this.weather > 0.75) {
      this.sun.visible = false;
      this.glow.visible = true;
      this.glow.position.set(0, 10, 48);
      this.glowMat.opacity = 0.08 + this.flash * 0.5;
    } else {
      this.sun.visible = true;
      this.glow.visible = true;
      this.glowMat.opacity = 0.22 + (1 - Math.abs(t - 0.5) * 1.2) * 0.12;
    }
    const band = Math.round(t * 4) / 4;
    const map = skyMap(p, band);
    if (this.domeMat.map !== map) {
      this.domeMat.map = map;
      this.domeMat.needsUpdate = true;
    }
    return t;
  }

  setWeatherIntensity(intensity) {
    this.weather = Math.max(0, Math.min(1, Number(intensity) || 0));
    const p = this._profile || skyProfile(this.worldId);
    this.wispMat.opacity = p.cloudOpacity * (0.4 + this.weather * 0.6);
    this.mistMat.opacity = p.mist ? 0.1 + this.weather * 0.18 : 0;
    if (p.lightning && this.weather > 0.55) this.sun.visible = false;
    return this.weather;
  }

  enableNight() {
    this.night = true;
    this.stars.visible = true;
    this.moon.visible = true;
    this.sun.visible = false;
    this.glow.visible = false;
    const p = this._profile || skyProfile("nightfen");
    this.domeMat.map = skyMap({ ...p, night: true, top: "#0a0018", mid: "#1a0033", horizon: "#2a1048" }, 0.9);
    this.domeMat.needsUpdate = true;
  }

  consumeStrike() {
    if (!this.struck) return false;
    this.struck = false;
    return true;
  }

  tick(dt, reduceMotion = false) {
    this._clock += dt;
    const p = this._profile || skyProfile(this.worldId);

    if (this.wisps.visible && !reduceMotion) {
      this.wisps.position.x = Math.sin(this._clock * 0.07) * (2.4 + this.weather);
      this.wisps.position.z = Math.sin(this._clock * 0.045) * 1.2;
    }

    if (this.stars.visible && !reduceMotion) {
      const flicker = 0.55 + Math.sin(this._clock * 2.4) * 0.2;
      this.starMat.opacity = flicker;
    }

    if (this.aurora.visible) {
      this.aurora.position.x = Math.sin(this._clock * 0.15) * 6;
      this.auroraMat.opacity = (p.aurora === "rainbow" ? 0.22 : 0.14) + Math.sin(this._clock * 1.1) * 0.08;
      if (this.auroraMat.map) this.auroraMat.map.offset.x = (this._clock * 0.04) % 1;
    }

    if (this.mist.visible && !reduceMotion) {
      this.mist.position.y = 1.2 + Math.sin(this._clock * 0.35) * 0.35;
      this.mistMat.opacity = 0.12 + Math.sin(this._clock * 0.5) * 0.05;
    }

    if (this.ash.visible && !reduceMotion) {
      const arr = this.ash.geometry.attributes.position.array;
      for (let i = 0; i < ASH_COUNT; i++) {
        arr[i * 3 + 1] -= this._ashV[i] * dt;
        arr[i * 3] += Math.sin(this._clock + i) * dt * 0.4;
        if (arr[i * 3 + 1] < 0.4) {
          arr[i * 3 + 1] = 26 + Math.random() * 8;
          arr[i * 3] = (Math.random() - 0.5) * 40;
        }
      }
      this.ash.geometry.attributes.position.needsUpdate = true;
    }

    if (p.lightning && !this.skipStorm) {
      this._stormWait -= dt;
      if (this._stormWait <= 0) {
        this._stormWait = 3.2 + Math.random() * 2.4;
        if (Math.random() < 0.45 * this.weather) {
          this.flash = 1;
          this.struck = true;
        }
      }
      this.flash = Math.max(0, this.flash - dt / 0.12);
      this.flashMesh.material.opacity = this.flash * 0.7;
      this.flashMesh.visible = this.flash > 0.03;
    } else {
      this.flash = Math.max(0, this.flash - dt * 4);
      this.flashMesh.visible = false;
    }
  }

  follow(x, z) {
    this.group.position.x = x * 0.12;
    this.group.position.z = z;
  }

  dispose() {
    const cached = new Set(_texCache.values());
    this.group.traverse((o) => {
      o.geometry?.dispose?.();
      const mats = Array.isArray(o.material) ? o.material : o.material ? [o.material] : [];
      for (const m of mats) {
        if (m.map && !cached.has(m.map)) m.map.dispose?.();
        m.dispose?.();
      }
    });
    this.group.removeFromParent();
  }
}
