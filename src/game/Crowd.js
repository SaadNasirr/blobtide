import * as THREE from "three";
import { getSkin } from "../content/skins.js";
import { makeCountBadge, createLeaderEyeMap, blobSkinMap, createBlobGlowUniforms, patchBlobGlowMaterial, blobBreathGlow } from "./look.js";
import { TweenPool, Ease, comboSquashAmount } from "./tween.js";
import { sharedGeos, organicBlob } from "./gpu.js";

export { comboSquashAmount };

const MAX_VISIBLE = 56;
const TWEEN_CAP = 50;
const _camDir = new THREE.Vector3();
const _fwd = new THREE.Vector3();
const _up = new THREE.Vector3();
const _right = new THREE.Vector3();
const _world = new THREE.Vector3();

function makeSlot(i) {
  return {
    tx: 0,
    tz: 0,
    x: 0,
    y: 0.28,
    z: 0,
    vx: 0,
    vz: 0,
    phase: i * 1.17,
    freq: 9.2 + (i % 5) * 0.55,
    appear: 1,
    knock: 0,
    sink: false,
    sinkX: 0,
    sinkZ: 0,
  };
}

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
    this.compress = 1;
    this.tumbleT = 0;
    this.celebrate = 0;
    this.runTime = 0;
    this.group = new THREE.Group();
    scene.add(this.group);

    const geo = sharedGeos().blob;
    const gel = blobSkinMap("gel");
    const mat = new THREE.MeshStandardMaterial({
      color: 0x2ec8d4,
      map: gel,
      emissive: 0x148a98,
      emissiveIntensity: 0.34,
      roughness: 0.32,
      metalness: 0.2,
    });
    this.glowU = createBlobGlowUniforms();
    patchBlobGlowMaterial(mat, this.glowU);
    this.mesh = new THREE.InstancedMesh(geo, mat, MAX_VISIBLE);
    this.mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    this.mesh.instanceColor = new THREE.InstancedBufferAttribute(new Float32Array(MAX_VISIBLE * 3), 3);
    this.mesh.frustumCulled = false;
    this.group.add(this.mesh);

    this.banner = new THREE.Mesh(
      new THREE.PlaneGeometry(1.2, 0.56),
      new THREE.MeshBasicMaterial({ transparent: true, depthWrite: false })
    );
    this.banner.position.set(0, 1.5, 0);
    this.banner.visible = false;

    this.aura = new THREE.Mesh(
      new THREE.SphereGeometry(0.95, 14, 10),
      new THREE.MeshBasicMaterial({
        color: 0x66f0ff,
        transparent: true,
        opacity: 0,
        depthWrite: false,
      })
    );
    this.group.add(this.aura);

    this.trailDummy = new THREE.Object3D();
    this.trailMesh = new THREE.InstancedMesh(
      sharedGeos().spark,
      new THREE.MeshBasicMaterial({ color: 0x6ce0e8, transparent: true, opacity: 0.28, depthWrite: false }),
      18
    );
    this.trailMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    this.trailMesh.count = 0;
    this.trailMesh.frustumCulled = false;
    scene.add(this.trailMesh);
    this.trail = [];

    this.shadow = new THREE.Mesh(
      new THREE.CircleGeometry(0.55, 16),
      new THREE.MeshBasicMaterial({ color: 0x0a0618, transparent: true, opacity: 0.36, depthWrite: false })
    );
    this.shadow.rotation.x = -Math.PI / 2;
    this.shadow.position.y = 0.03;
    this.shadow.renderOrder = 1;
    this.group.add(this.shadow);

    this.dummy = new THREE.Object3D();
    this._color = new THREE.Color();
    this.slots = Array.from({ length: MAX_VISIBLE }, (_, i) => makeSlot(i));
    this._baseEmissive = 0.32;
    this.comboHeat = 0;
    this.tweens = new TweenPool(TWEEN_CAP);
    this.feelY = 1;
    this.feelXZ = 1;
    this.feelBoost = 1;
    this.joyHop = 0;
    this.jiggleT = 0;
    this.jiggleAmp = 0;
    this.eyeMood = "rest";
    this.eyeMoodT = 0;
    this._lid = 0;
    this._blinkT = 0;
    this._blinkWait = 4 + Math.random() * 2;
    this._eyeLookX = 0;
    this._eyeLookY = -0.16;
    this._eye = createLeaderEyeMap();
    const leaderGeo = organicBlob(0.26, 22, 16);
    leaderGeo.rotateY(Math.PI / 2);
    this.leader = new THREE.Mesh(
      leaderGeo,
      new THREE.MeshStandardMaterial({
        color: 0x2ec8d4,
        emissive: 0x148a98,
        emissiveIntensity: 0.36,
        roughness: 0.32,
        metalness: 0.18,
        map: this._eye.texture,
      })
    );
    patchBlobGlowMaterial(this.leader.material, this.glowU);
    this.leader.frustumCulled = false;
    this.group.add(this.leader);
    this._hatRoot = new THREE.Group();
    this._hatRoot.position.set(0, 0.22, 0);
    this.leader.add(this._hatRoot);
    this._hats = this._makeHats();
    this.glowFlashT = 0;
    this.glowFlickerT = 0;
    this.poisonAge = 0;
    this.poisoning = false;
    this.boosted = false;
    this._paintEyes(true);
    this._rebuildTargets(8);
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
    this.mesh.material.emissiveIntensity = skin.prestige ? 0.55 : skin.hat ? 0.38 : 0.3;
    this.mesh.material.metalness = skin.metal ?? 0.2;
    this.mesh.material.roughness = skin.rough ?? 0.32;
    this.mesh.material.map = blobSkinMap(skin.pattern);
    if (this.leader) {
      this.leader.material.color.copy(this.mesh.material.color);
      this.leader.material.emissive.copy(this.mesh.material.emissive);
      this.leader.material.emissiveIntensity = this.mesh.material.emissiveIntensity;
      this.leader.material.metalness = this.mesh.material.metalness;
      this.leader.material.roughness = this.mesh.material.roughness;
      this.leader.material.map = this._eye.texture;
    }
    if (this.aura) {
      this.aura.material.color.setHex(this.shielded ? 0xffd166 : this.boosted ? 0x66f0ff : skin.color);
      this.aura.material.opacity = this.shielded ? 0.34 : this.boosted ? 0.2 : this.flash > 0.2 ? 0.14 : 0.05;
    }
    if (this.shielded && skin.id !== "rainbow") {
      this.mesh.material.emissive.lerp(this._color.setHex(0xffd166), 0.55);
    }
    if (this._lastTint !== skin.id) {
      this._lastTint = skin.id;
      this._tintInstances(skin);
      this._showHat(skin.hat);
    }
  }

  _makeHats() {
    const hats = {};
    const add = (id, mesh) => {
      mesh.visible = false;
      this._hatRoot.add(mesh);
      hats[id] = mesh;
      return mesh;
    };
    const hornMat = new THREE.MeshStandardMaterial({ color: 0xffd166, emissive: 0xc87810, emissiveIntensity: 0.35, roughness: 0.4 });
    const horns = new THREE.Group();
    const hL = new THREE.Mesh(new THREE.ConeGeometry(0.07, 0.22, 8), hornMat);
    const hR = hL.clone();
    hL.position.set(-0.12, 0.1, 0.02);
    hR.position.set(0.12, 0.1, 0.02);
    hL.rotation.z = 0.45;
    hR.rotation.z = -0.45;
    horns.add(hL, hR);
    add("horns", horns);
    const crown = new THREE.Mesh(
      new THREE.CylinderGeometry(0.16, 0.18, 0.1, 8),
      new THREE.MeshStandardMaterial({ color: 0xffd166, emissive: 0xffaa20, emissiveIntensity: 0.45, metalness: 0.7, roughness: 0.25 })
    );
    crown.position.y = 0.12;
    add("crown", crown);
    const bow = new THREE.Mesh(
      new THREE.TorusGeometry(0.08, 0.03, 8, 12),
      new THREE.MeshStandardMaterial({ color: 0xff5a8a, emissive: 0xc02050, emissiveIntensity: 0.3 })
    );
    bow.position.set(0.16, 0.08, 0.08);
    bow.rotation.y = 0.6;
    add("bow", bow);
    const ears = new THREE.Group();
    const earMat = new THREE.MeshStandardMaterial({ color: 0xffb07a, emissive: 0xc86838, emissiveIntensity: 0.2 });
    const eL = new THREE.Mesh(new THREE.ConeGeometry(0.08, 0.16, 8), earMat);
    const eR = eL.clone();
    eL.position.set(-0.12, 0.12, 0);
    eR.position.set(0.12, 0.12, 0);
    ears.add(eL, eR);
    add("ears", ears);
    const antenna = new THREE.Group();
    const rod = new THREE.Mesh(
      new THREE.CylinderGeometry(0.015, 0.015, 0.22, 6),
      new THREE.MeshStandardMaterial({ color: 0x8899aa, metalness: 0.7, roughness: 0.3 })
    );
    rod.position.y = 0.16;
    const bulb = new THREE.Mesh(
      new THREE.SphereGeometry(0.045, 8, 8),
      new THREE.MeshStandardMaterial({ color: 0x66f0ff, emissive: 0x2ad0ff, emissiveIntensity: 0.7 })
    );
    bulb.position.y = 0.28;
    antenna.add(rod, bulb);
    add("antenna", antenna);
    const halo = new THREE.Mesh(
      new THREE.TorusGeometry(0.16, 0.018, 8, 16),
      new THREE.MeshStandardMaterial({ color: 0xfff4d2, emissive: 0xffe08a, emissiveIntensity: 0.7 })
    );
    halo.position.y = 0.22;
    halo.rotation.x = Math.PI / 2;
    add("halo", halo);
    return hats;
  }

  _showHat(kind) {
    if (!this._hats) return;
    for (const [id, mesh] of Object.entries(this._hats)) mesh.visible = id === kind;
  }

  _tintInstances(skin) {
    const base = this._color.setHex(skin.color);
    const stripe = skin.stripe != null ? new THREE.Color(skin.stripe) : null;
    for (let i = 0; i < MAX_VISIBLE; i++) {
      const wobble = ((i * 17) % 9) / 40;
      if (stripe && i % 3 === 0) {
        this.mesh.setColorAt(i, stripe);
      } else {
        this.mesh.setColorAt(
          i,
          this._color.setRGB(
            Math.min(1, base.r + wobble * 0.14),
            Math.min(1, base.g + wobble * 0.06),
            Math.min(1, base.b + (1 - wobble) * 0.1)
          )
        );
      }
    }
    if (this.mesh.instanceColor) this.mesh.instanceColor.needsUpdate = true;
  }

  setEyes(mood, dur = 0.5) {
    this.eyeMood = mood || "rest";
    this.eyeMoodT = dur;
    this._paintEyes(true);
  }

  _moodPose() {
    const mood = this.eyeMood;
    if (mood === "joy") return { pupil: 1.35, brow: 0.72, sparkle: 0 };
    if (mood === "fear") return { pupil: 0.52, brow: -0.82, sparkle: 0 };
    if (mood === "stare") return { pupil: 1.58, brow: -0.18, sparkle: 0 };
    if (mood === "happy") return { pupil: 1.48, brow: 0.88, sparkle: 1 };
    if (mood === "rage") return { pupil: 0.72, brow: -0.95, sparkle: 0 };
    return { pupil: 1, brow: 0, sparkle: 0 };
  }

  _paintEyes(force = false) {
    if (!this._eye) return;
    const pose = this._moodPose();
    const key = `${this.eyeMood}|${this._lid.toFixed(2)}|${this._eyeLookX.toFixed(2)}|${this._eyeLookY.toFixed(2)}`;
    if (!force && key === this._eyeKey) return;
    this._eyeKey = key;
    this._eye.paint({
      pupil: pose.pupil,
      brow: pose.brow,
      sparkle: pose.sparkle,
      lid: this._lid,
      lookX: this._eyeLookX,
      lookY: this._eyeLookY,
    });
  }

  feel(kind, extra = 0) {
    if (kind === "good") {
      this.tweens.kill(this, "feelY");
      this.tweens.kill(this, "joyHop");
      this.feelY = 0.9;
      this.joyHop = 0.22;
      this.tweens.to(this, "feelY", 1, 0.3, Ease.spring);
      this.tweens.to(this, "joyHop", 0, 0.3, Ease.quadOut);
      this.setEyes("joy", 0.48);
      this.flash = Math.max(this.flash, 0.95);
      this.glowFlashT = 0.05;
      return;
    }
    if (kind === "bad") {
      this.tweens.kill(this, "feelY");
      this.feelY = 0.75;
      this.joyHop = 0;
      this.tweens.to(this, "feelY", 1, 0.2, Ease.quadOut);
      this.setEyes("fear", 0.5);
      this.flash = 1.6;
      this.glowFlickerT = 0.55;
      return;
    }
    if (kind === "pickup") {
      this.tweens.kill(this, "feelBoost");
      this.feelBoost = 1.15;
      this.tweens.to(this, "feelBoost", 1, 0.2, Ease.quadOut);
      return;
    }
    if (kind === "bossHit") {
      this.jiggleT = 0.4;
      this.jiggleAmp = 0.08;
      this.flash = Math.max(this.flash, 1.1);
      return;
    }
    if (kind === "fight") {
      this.tweens.kill(this, "feelY");
      this.tweens.kill(this, "joyHop");
      this.feelY = 0.78;
      this.joyHop = 0.2;
      this.tweens.to(this, "feelY", 1, 0.16, Ease.spring);
      this.tweens.to(this, "joyHop", 0, 0.18, Ease.quadOut);
      this.setEyes("rage", 0.32);
      this.flash = Math.max(this.flash, 1.25);
      this.jiggleT = Math.max(this.jiggleT, 0.18);
      this.jiggleAmp = 0.07;
      return;
    }
    if (kind === "combo") {
      const amt = comboSquashAmount(extra);
      if (!amt) return;
      this.tweens.kill(this, "feelY");
      this.feelY = 1 - amt;
      this.tweens.to(this, "feelY", 1, 0.32, Ease.spring);
      this.celebrate = Math.max(this.celebrate, 0.6);
    }
  }

  poison() {
    this.poisoning = true;
    this.poisonAge = 0;
  }

  comboSquash(n) {
    this.feel("combo", n);
  }

  impact(kind) {
    if (kind === "good") this.feel("good");
    else if (kind === "bad") this.feel("bad");
    else if (kind === "pickup") this.feel("pickup");
    else if (kind === "bossHit") this.feel("bossHit");
    else if (kind === "fight") this.feel("fight");
    else if (kind === "land") {
      this.squash = 0.52;
      this.flash = 1.25;
      this.jiggleT = Math.max(this.jiggleT, 0.22);
      this.jiggleAmp = 0.09;
    }
  }

  _rebuildTargets(n) {
    const shown = Math.min(MAX_VISIBLE, Math.max(1, n));
    for (let i = 0; i < shown; i++) {
      const a = i * 2.399963 + 0.31 * Math.sin(i * 1.7);
      const r = 0.2 * Math.sqrt(i) * (1 + 0.08 * Math.sin(i * 2.2));
      const rear = i > 4 ? -(r * 0.42) - Math.sqrt(i) * 0.045 : -r * 0.22;
      this.slots[i].tx = Math.cos(a) * r * 1.05;
      this.slots[i].tz = Math.sin(a) * r * 0.72 + rear;
    }
  }

  setCount(n, opts = {}) {
    const next = Math.max(0, Math.floor(n));
    const prev = this.count;
    const shownPrev = Math.min(MAX_VISIBLE, Math.max(1, prev));
    const shownNext = Math.min(MAX_VISIBLE, Math.max(1, next));
    this._rebuildTargets(next || 1);
    if (next > prev) {
      const from = opts.spawnFrom || { x: 0, z: 0.8 };
      for (let i = shownPrev; i < shownNext; i++) {
        const s = this.slots[i];
        s.x = from.x + (Math.random() - 0.5) * 0.35;
        s.z = from.z + Math.random() * 0.25;
        s.y = 0.92;
        s.appear = 0;
        s.knock = 0;
        s.vx = (s.tx - s.x) * 3.2;
        s.vz = (s.tz - s.z) * 3.2;
      }
    } else if (next < prev && (opts.knock || opts.sink)) {
      const lost = Math.min(MAX_VISIBLE, shownPrev) - shownNext;
      const toward = opts.sinkToward || { x: 0, z: 0 };
      for (let k = 0; k < lost; k++) {
        const s = this.slots[shownNext + k];
        if (!s) continue;
        s.sink = !!opts.sink;
        s.sinkX = toward.x;
        s.sinkZ = toward.z;
        s.knock = opts.sink ? 0.85 + Math.random() * 0.15 : opts.cut ? 0.78 + Math.random() * 0.18 : 0.55 + Math.random() * 0.25;
        s.vx = opts.sink
          ? toward.x * 3.2 + (Math.random() - 0.5) * 1.2
          : opts.cut
            ? (k % 2 ? 1 : -1) * (5.5 + Math.random() * 4)
            : (Math.random() - 0.5) * 6;
        s.vz = opts.sink ? toward.z * 3.2 + (Math.random() - 0.5) * 0.8 : opts.cut ? -1.2 - Math.random() * 2 : -2 - Math.random() * 3;
        if (opts.cut) s.y = 0.45 + Math.random() * 0.2;
      }
    }
    if (opts.tumble) this.tumbleT = 0.62;
    this.count = next;
    this._refreshBanner();
  }

  _refreshBanner() {
    if (!this.banner) return;
    this._badgeMap?.dispose?.();
    this._badgeMap = makeCountBadge(this.count, "#146878", "#ffffff");
    this.banner.material.map = this._badgeMap;
    this.banner.material.needsUpdate = true;
  }

  reset(count) {
    this.x = 0;
    this.z = 0;
    this.targetX = 0;
    this.squash = 1;
    this.flash = 0;
    this.lean = 0;
    this.compress = 1;
    this.tumbleT = 0;
    this.celebrate = 0;
    this.runTime = 0;
    this.comboHeat = 0;
    this.tweens.killAll();
    this.feelY = 1;
    this.feelXZ = 1;
    this.feelBoost = 1;
    this.joyHop = 0;
    this.jiggleT = 0;
    this.jiggleAmp = 0;
    this.glowFlashT = 0;
    this.glowFlickerT = 0;
    this.poisonAge = 0;
    this.poisoning = false;
    this.boosted = false;
    this.setEyes("rest", 0);
    this._lid = 0;
    this._blinkT = 0;
    this._blinkWait = 4 + Math.random() * 2;
    this._eyeLookX = 0;
    this._eyeLookY = -0.16;
    this.shielded = false;
    this.trail.length = 0;
    for (const s of this.slots) {
      s.x = s.tx;
      s.z = s.tz;
      s.y = 0.28;
      s.vx = 0;
      s.vz = 0;
      s.appear = 1;
      s.knock = 0;
      s.sink = false;
    }
    this.setCount(count);
    this._rebuildTargets(count);
    for (let i = 0; i < Math.min(MAX_VISIBLE, Math.max(1, count)); i++) {
      this.slots[i].x = this.slots[i].tx;
      this.slots[i].z = this.slots[i].tz;
    }
    this._paintEyes(true);
  }

  radius() {
    return 0.48 + Math.min(1.6, Math.sqrt(this.count) * 0.1);
  }

  _applyGlow(time, dt, reduceMotion) {
    this.glowFlashT = Math.max(0, this.glowFlashT - dt);
    this.glowFlickerT = Math.max(0, this.glowFlickerT - dt);
    if (this.poisoning) {
      this.poisonAge += dt;
      if (this.poisonAge >= 1) {
        this.poisoning = false;
        this.poisonAge = 0;
      }
    }
    const arr = this.glowU?.uGlowArr?.value;
    if (this.glowU?.uTime) this.glowU.uTime.value = time;
    if (!arr) return;
    let glow = reduceMotion ? 0.3 : blobBreathGlow(time);
    let rim = 0.48;
    let poison = 0;
    let distort = 0;
    let flicker = 0;
    let danger = 0;
    let shield = this.shielded ? 1 : 0;
    let boost = this.boosted ? 1 : 0;
    if (this.glowFlashT > 0) glow = 0.8;
    if (this.glowFlickerT > 0) {
      flicker = 0.35 + 0.65 * (0.5 + 0.5 * Math.sin(time * 32));
      glow = 0.22 + 0.38 * flicker;
    }
    if (this.poisoning) {
      poison = this.poisonAge < 0.5 ? this.poisonAge / 0.5 : 1 - (this.poisonAge - 0.5) / 0.5;
      glow = 0.1;
    }
    if (this.shielded) {
      glow = Math.max(glow, 0.58);
      rim = 0.92;
    }
    if (this.boosted) {
      glow = Math.max(glow, 0.52) + 0.14;
      rim = Math.max(rim, 0.7);
    }
    if (this.comboHeat >= 10 && !reduceMotion) {
      const beat = 0.5 + 0.5 * Math.sin(time * (2.4 + Math.min(8, this.comboHeat) * 0.18) * Math.PI);
      glow = Math.max(glow, 0.48 + 0.32 * beat);
      rim = Math.max(rim, 0.55 + 0.25 * beat);
    }
    if (this.count > 0 && this.count < 10) {
      danger = this.count === 1 ? 0.75 + 0.25 * Math.sin(time * 7.2) : 0.4 + 0.6 * (0.5 + 0.5 * Math.sin(time * 11));
      glow = Math.max(glow, 0.35 + danger * 0.25);
    }
    if (this.count === 1 && !reduceMotion) distort = 0.85 + 0.15 * Math.sin(time * 8.5);
    arr[0] = glow;
    arr[1] = rim;
    arr[2] = poison;
    arr[3] = distort;
    arr[4] = this.glowFlickerT > 0 ? flicker : 0;
    arr[5] = danger;
    arr[6] = shield;
    arr[7] = boost;
    this.mesh.material.emissiveIntensity = glow;
    if (this.leader) {
      this.leader.material.emissiveIntensity = glow + 0.06;
      if (this.shielded) this.leader.material.emissive.lerp(this._color.setHex(0xffd166), 0.4);
      else if (this.boosted) this.leader.material.emissive.lerp(this._color.setHex(0x66f0ff), 0.35);
    }
    if (this.aura) {
      this.aura.material.color.setHex(this.shielded ? 0xffd166 : this.boosted ? 0x66f0ff : this.count === 1 ? 0xff4455 : 0x66f0ff);
      this.aura.material.opacity = this.shielded ? 0.36 : this.count === 1 ? 0.22 + 0.12 * Math.sin(time * 7) : this.boosted ? 0.2 : glow > 0.55 ? 0.12 : 0.05;
    }
  }

  update(dt, laneLimit, opts = {}) {
    const { moving = true, reduceMotion = false, fighting = false } = opts;
    this.comboHeat = opts.combo || 0;
    const prevX = this.x;
    this.x += (this.targetX - this.x) * Math.min(1, dt * 16.5);
    this.x = THREE.MathUtils.clamp(this.x, -laneLimit, laneLimit);
    if (moving) this.z += (opts.speed ?? 6.8) * dt;
    if (moving) this.runTime += dt;
    this.celebrate = Math.max(0, this.celebrate - dt);
    this.eyeMoodT = Math.max(0, this.eyeMoodT - dt);
    if (this.eyeMoodT <= 0 && this.eyeMood !== "rest") this.eyeMood = "rest";

    if (reduceMotion) {
      this._blinkT = 0;
      this._lid = 0;
      this.tweens.killAll();
      this.feelY = 1;
      this.feelBoost = 1;
      this.joyHop = 0;
      this.jiggleT = 0;
    } else {
      this.tweens.update(dt);
      this._blinkWait -= dt;
      if (this._blinkT > 0) {
        this._blinkT = Math.max(0, this._blinkT - dt);
        const u = 1 - this._blinkT / 0.15;
        this._lid = u < 0.5 ? u * 2 : (1 - u) * 2;
      } else {
        this._lid = 0;
        if (this._blinkWait <= 0) {
          this._blinkT = 0.15;
          this._blinkWait = 4 + Math.random() * 2;
        }
      }
      if (this.jiggleT > 0) {
        this.jiggleT = Math.max(0, this.jiggleT - dt);
        if (this.jiggleT <= 0) this.jiggleAmp = 0;
      }
    }

    this.tumbleT = Math.max(0, this.tumbleT - dt);
    this.squash += (1 - this.squash) * Math.min(1, dt * 9);
    this.flash += (0 - this.flash) * Math.min(1, dt * 8);
    const dx = this.x - prevX;
    const leanTarget = THREE.MathUtils.clamp(-dx * 16, -0.34, 0.34);
    this.lean += (leanTarget - this.lean) * Math.min(1, dt * 10);
    this.group.rotation.z = reduceMotion ? 0 : this.lean;
    this.group.position.set(this.x, 0, this.z);
    const pack = (0.82 + Math.min(0.5, Math.sqrt(Math.max(this.count, 1)) * 0.045)) * this.compress;
    if (this.aura) this.aura.scale.setScalar(0.85 + pack * 0.55);

    if (moving && !reduceMotion) {
      this.trail.push({ x: this.x, y: 0.22, z: this.z - 0.45, life: 0.32 });
      if (this.trail.length > 18) this.trail.shift();
    }
    for (let i = this.trail.length - 1; i >= 0; i--) {
      this.trail[i].life -= dt;
      if (this.trail[i].life <= 0) this.trail.splice(i, 1);
    }
    if (this.trailMesh) {
      const n = reduceMotion ? 0 : this.trail.length;
      for (let i = 0; i < n; i++) {
        const tr = this.trail[i];
        this.trailDummy.position.set(tr.x, tr.y, tr.z);
        this.trailDummy.scale.setScalar(Math.max(0.12, tr.life / 0.32) * (0.1 / 0.07));
        this.trailDummy.updateMatrix();
        this.trailMesh.setMatrixAt(i, this.trailDummy.matrix);
      }
      this.trailMesh.count = n;
      this.trailMesh.instanceMatrix.needsUpdate = true;
    }

    this.shadow.scale.setScalar(0.65 + pack * 0.7);
    this.shadow.material.opacity = this.count <= 0 ? 0 : 0.32;

    const shown = this.count <= 0 ? 0 : Math.min(MAX_VISIBLE, Math.max(1, this.count));
    const t = performance.now() * 0.001;
    this._applyGlow(t, dt, reduceMotion);
    if (this.leader && shown <= 0) this.leader.visible = false;
    const globalSquash = reduceMotion ? 1 : this.squash;
    const jiggle = !reduceMotion && this.jiggleT > 0 ? this.jiggleAmp * Math.sin(this.jiggleT * Math.PI * 2 * 10) : 0;
    const feelAmp = 1 - this.feelY;
    let drawN = shown;
    for (let i = shown; i < MAX_VISIBLE; i++) {
      if (this.slots[i].knock > 0) drawN = i + 1;
    }
    for (let i = 0; i < drawN; i++) {
      const s = this.slots[i];
      const live = i < shown;
      if (live) {
        s.appear = Math.min(1, s.appear + dt * 7.5);
        const overshoot = 1.12 - s.appear * 0.12;
        s.vx += (s.tx * pack * overshoot - s.x) * 28 * dt;
        s.vz += (s.tz * pack * overshoot - s.z) * 28 * dt;
        if (fighting) {
          s.vx += Math.sin(this.runTime * 28 + s.phase) * 28 * dt;
          s.vz += 18 * dt + Math.cos(this.runTime * 22 + i) * 16 * dt;
        }
        s.vx *= Math.max(0, 1 - dt * 9);
        s.vz *= Math.max(0, 1 - dt * 9);
        s.x += s.vx * dt;
        s.z += s.vz * dt;
        const hopAmp = i === 0 ? 0.26 : 0.16;
        const hop = reduceMotion ? 0 : hopAmp * Math.abs(Math.sin(this.runTime * s.freq + s.phase));
        const celeb = this.celebrate > 0 ? 0.28 * Math.abs(Math.sin(this.runTime * 16 + i)) : 0;
        const fightHop = fighting ? 0.22 * Math.abs(Math.sin(this.runTime * 32 + s.phase)) : 0;
        const jump = this.joyHop * (i === 0 ? 1.2 : 1);
        s.y += (0.26 + hop + celeb + fightHop + jump - s.y) * Math.min(1, dt * 18);
        const stretch = reduceMotion ? 1 : 1 + Math.sin(this.runTime * s.freq + s.phase) * (i === 0 ? 0.28 : 0.16);
        const localFeelY = 1 - feelAmp * (i === 0 ? 1.2 : 1);
        const yMul = localFeelY * this.feelBoost * (1 + jiggle);
        const xzMul = (2 - localFeelY) * this.feelBoost * (1 - jiggle * 0.4);
        const sy = globalSquash * stretch * yMul * (0.72 + s.appear * 0.28);
        const sxz = (2.05 - globalSquash) * xzMul * (0.82 + s.appear * 0.18);
        const tumble = this.tumbleT > 0 ? Math.sin(this.tumbleT * 22 + s.phase) * this.tumbleT * 2.2 : 0;
        this.dummy.position.set(s.x, s.y + Math.abs(tumble) * 0.12, s.z);
        this.dummy.rotation.set(hop * 0.45 + tumble, dx * 5, this.lean * 0.32 + tumble * 0.7);
        this.dummy.scale.set(sxz, sy, sxz);
        if (i === 0 && this.leader) {
          this.leader.visible = true;
          this.leader.position.copy(this.dummy.position);
          this.leader.scale.copy(this.dummy.scale);
          if (opts.camera) {
            this.leader.getWorldPosition(_world);
            this.leader.lookAt(opts.camera.position);
            opts.camera.getWorldDirection(_camDir);
            _fwd.set(0, 0, 1);
            _up.set(0, 1, 0);
            _right.crossVectors(_up, _camDir).normalize();
            this._eyeLookX = THREE.MathUtils.clamp(_fwd.dot(_right) * 0.15 - this.lean * 0.35, -0.45, 0.45);
            this._eyeLookY = THREE.MathUtils.clamp(-0.22 - _camDir.y * 0.2, -0.45, 0.15);
          } else {
            this.leader.rotation.copy(this.dummy.rotation);
            this._eyeLookX = THREE.MathUtils.clamp(-this.lean * 0.35, -0.45, 0.45);
            this._eyeLookY = -0.18;
          }
          this._paintEyes();
          this.dummy.scale.setScalar(0.001);
          this.dummy.position.set(0, -4, 0);
        }
      } else if (s.knock > 0) {
        s.knock -= dt;
        if (s.sink) {
          s.vx += (s.sinkX - s.x) * 14 * dt;
          s.vz += (s.sinkZ - s.z) * 14 * dt;
          s.vx += -s.z * 16 * dt;
          s.vz += s.x * 16 * dt;
          s.vx *= Math.max(0, 1 - dt * 3);
          s.vz *= Math.max(0, 1 - dt * 3);
          s.x += s.vx * dt;
          s.z += s.vz * dt;
          s.y -= dt * 5.4;
          this.dummy.position.set(s.x, s.y, s.z);
          this.dummy.scale.setScalar(Math.max(0.02, s.knock * s.knock * 1.35));
          this.dummy.rotation.set(s.knock * 9, s.knock * 14, s.knock * 6);
        } else {
          s.x += s.vx * dt;
          s.z += s.vz * dt;
          s.y += dt * 3.4;
          s.vx *= 0.97;
          this.dummy.position.set(s.x, s.y, s.z);
          this.dummy.scale.setScalar(Math.max(0.05, s.knock * 1.8));
          this.dummy.rotation.set(s.knock * 8, s.knock * 5, s.knock * 6);
        }
      } else {
        this.dummy.scale.setScalar(0.001);
        this.dummy.position.set(0, -4, 0);
      }
      this.dummy.updateMatrix();
      this.mesh.setMatrixAt(i, this.dummy.matrix);
    }
    this.mesh.count = drawN;
    this.mesh.instanceMatrix.needsUpdate = true;
    if (this.banner) this.banner.position.y = 1.28 + Math.min(0.65, Math.sqrt(this.count) * 0.07);
  }
}
