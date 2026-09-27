import * as THREE from "three";
import { Crowd } from "./Crowd.js";
import { LevelWorld, slamHitHalf, SLAM_HEAD } from "./LevelWorld.js";
import { applyOp, LEVELS, opLabel } from "../content/levels.js";
import { Sfx, Shake, SHAKE, FEEL, holeLoss, geyserLoss } from "./Juice.js";
import { Analytics } from "./Services.js";
import { Input } from "./Input.js";
import { Particles, MAX_PARTICLES } from "./Particles.js";
import { canRestart } from "./controls.js";
import { Backdrop } from "./Backdrop.js";
import { makeGridTexture, leechLabel, leechAmount } from "./look.js";
import { worldForLevel, levelFog } from "../content/themes.js";
import { Platform } from "../platform/adapter.js";
import { starRating, starFlags, runCoinReward, comboCoinMult, writeLevelStars } from "./progress.js";
import { nearMiss, chaserMul, chaserCanBite, chaserEmergeZ, CHASER } from "./hook.js";
import { TweenPool, Ease } from "./tween.js";
import { CAM, cameraShot, comboPulseFov, swayFromSteer, camMode, expEase } from "./CameraRig.js";
import { DT_MAX, deviceProfile, sharedGeos } from "./gpu.js";
import { LightingSystem } from "./AdvancedLighting.js";

const LANE_HAZ = new Set(["wall", "saw", "hole", "spinner", "crusher", "geyser", "pendulum", "orbit", "slam", "beam"]);
const HIT_HAZ = new Set(["wall", "saw", "spinner", "crusher", "geyser", "pendulum", "orbit", "slam", "beam"]);

export { canRestart, DT_MAX };

export class Game {
  constructor(canvas, hud) {
    this.canvas = canvas;
    this.hud = hud;
    this.state = "menu";
    this.level = null;
    this.levelIndex = 0;
    this.ended = false;
    this.paused = false;
    this.pendingContinue = false;
    this.coinMultiplier = 1;
    this.failReason = null;
    this.movedEnough = false;
    this.boostT = 0;
    this.magnetT = 0;
    this.starT = 0;
    this.snareT = 0;
    this.chaserBite = 0;
    this._houndOn = false;
    this.geyserHitCd = 0;
    this.runTime = 0;
    this.runScore = 0;
    this._shownScore = -1;
    this.shield = false;
    this.shieldHits = 0;
    this.combo = 0;
    this.maxCombo = 0;
    this.maxComboAchieved = 0;
    this.hazardHitCount = 0;
    this._comboBoostLeft = 0;
    this.nitroCd = 0;
    this.fight = null;
    this.onCoin = null;
    this.reduceMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;
    this._alive = true;
    this._ndc = new THREE.Vector3();

    this.gpu = deviceProfile();
    const glOpts = {
      canvas,
      antialias: !this.gpu.mobile,
      powerPreference: "high-performance",
      failIfMajorPerformanceCaveat: false,
      alpha: false,
      precision: this.gpu.precision,
    };
    let renderer;
    try {
      renderer = new THREE.WebGLRenderer(glOpts);
    } catch {
      const next = canvas.cloneNode(true);
      canvas.replaceWith(next);
      this.canvas = next;
      renderer = new THREE.WebGLRenderer({
        canvas: next,
        antialias: !this.gpu.mobile,
        failIfMajorPerformanceCaveat: false,
        precision: this.gpu.precision,
      });
    }
    this.renderer = renderer;
    this.renderer.setPixelRatio(this.gpu.pixelRatio);
    this.renderer.shadowMap.enabled = false;
    this.renderer.setClearColor(0x87c8ee, 1);
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.canvas.addEventListener(
      "webglcontextlost",
      (e) => {
        e.preventDefault();
      },
      false
    );
    this.canvas.addEventListener("webglcontextrestored", () => this._resize(), false);

    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.Fog(0xb8dce8, 45, 118);
    this.scene.background = new THREE.Color(0x87c8ee);

    this.camera = new THREE.PerspectiveCamera(CAM.fov, 9 / 16, 0.1, this.gpu.far);
    this.scene.add(this.camera);
    this.baseFov = CAM.fov;
    this.camTweens = new TweenPool();
    this._resetCamRig();
    this._bloomPulse = 0;
    this._gradeMat = new THREE.MeshBasicMaterial({
      color: 0xc8f0ff,
      transparent: true,
      opacity: 0,
      depthTest: false,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      fog: false,
      toneMapped: false,
    });
    this._grade = new THREE.Mesh(new THREE.PlaneGeometry(2.4, 2.4), this._gradeMat);
    this._grade.position.z = -0.42;
    this._grade.frustumCulled = false;
    this._grade.renderOrder = 1000;
    this.camera.add(this._grade);
    this.shake = new Shake();
    this.sfx = new Sfx();
    this.sfx.boot?.();
    this.sfx.startMusic();
    this.particles = new Particles(this.scene);
    this.backdrop = new Backdrop(this.scene);
    this.input = new Input();

    this.hemi = new THREE.HemisphereLight(0xfff4dc, 0x4a7a38, 1.15);
    this.scene.add(this.hemi);
    this.key = new THREE.DirectionalLight(0xfff8e8, 1.05);
    this.key.position.set(-3, 14, 6);
    this.scene.add(this.key);
    this.rim = new THREE.PointLight(0xffffff, this.gpu.mobile ? 5.5 : 8, this.gpu.mobile ? 18 : 28);
    this.rim.position.set(0, 4, 4);
    this.scene.add(this.rim);
    this.back = new THREE.DirectionalLight(0xc8b0ff, 0);
    this.back.position.set(0, 10, 18);
    this.scene.add(this.back);
    this.scene.add(this.back.target);
    this.lighting = new LightingSystem({
      renderer: this.renderer,
      scene: this.scene,
      camera: this.camera,
      hemi: this.hemi,
      key: this.key,
      rim: this.rim,
      back: this.back,
      gradeMat: this._gradeMat,
      mobile: this.gpu.mobile,
    });
    this._camPull = 0;
    this._camPunch = 0;
    this._camTiltUp = 0;
    this._wardenSeen = false;
    this._wardenCine = false;
    this._bossSlow = 0;
    this.worldTheme = worldForLevel(1);

    this.crowd = new Crowd(this.scene);
    this.world = new LevelWorld(this.scene);
    this.crowd.reset(22);
    const geo = sharedGeos();
    this._previewGrid = makeGridTexture();
    this._previewGrid.repeat.set(2, 9);
    this.preview = new THREE.Mesh(
      geo.plane,
      new THREE.MeshBasicMaterial({ map: this._previewGrid, color: 0xffffff })
    );
    this.preview.scale.set(9.4, 40, 1);
    this.preview.rotation.x = -Math.PI / 2;
    this.preview.position.z = 10;
    this.preview.name = "menuFloor";
    this.scene.add(this.preview);
    this.applyWorld(worldForLevel(1));
    this.previewSides = [];
    this._bermMat = new THREE.MeshLambertMaterial({ color: 0x4f9a38 });
    for (const side of [-1, 1]) {
      const berm = new THREE.Mesh(geo.plane, this._bermMat);
      berm.scale.set(16, 40, 1);
      berm.rotation.x = -Math.PI / 2;
      berm.position.set(side * 12.4, -0.04, 10);
      this.scene.add(berm);
      this.previewSides.push(berm);
    }

    this.laneLimit = 3.15;
    this.grabPointerX = 0;
    this.grabLane = 0;
    this.camX = 0;
    this.camTilt = 0;
    this._steerX = 0;
    this._finishSlow = 0;
    this.last = performance.now();
    this.capture = new URLSearchParams(location.search).has("capture");
    this.raf = 0;
    this._onResize = () => this._resize();
    this._onVis = () => {
      if (document.hidden && this.state === "playing" && !this.ended && !this.paused) {
        this.togglePause();
      }
    };

    this.input.bind(this.canvas);
    this.input.onPause = () => this.togglePause();
    this.input.onRestart = () => this.requestRestart();
    this.input.onGrab = () => {
      this.grabPointerX = this.input.pointerX;
      this.grabLane = this.crowd.x;
      this.sfx.ensure();
    };
    this.input.onNitro = () => this.tryNitro();

    window.addEventListener("resize", this._onResize);
    document.addEventListener("visibilitychange", this._onVis);
    this._ro = typeof ResizeObserver === "function" ? new ResizeObserver(() => this._resize()) : null;
    this._ro?.observe(this.canvas);
    if (this.canvas.parentElement) this._ro?.observe(this.canvas.parentElement);
    this._resize();
    requestAnimationFrame(() => this._resize());
    setTimeout(() => this._resize(), 100);
    setTimeout(() => this._resize(), 500);
  }

  dispose() {
    this._alive = false;
    cancelAnimationFrame(this.raf);
    this.raf = 0;
    this._ro?.disconnect();
    window.removeEventListener("resize", this._onResize);
    document.removeEventListener("visibilitychange", this._onVis);
    this.input.unbind();
    this.sfx.stopHazards?.();
    this.sfx.stopMusic();
    this.particles?.dispose();
    this.lighting?.dispose?.();
    this.backdrop?.dispose();
    this.world?.clear();
    try {
      this.renderer?.forceContextLoss?.();
    } catch {
      /* some contexts already lost */
    }
    this.renderer?.dispose();
    if (this.canvas?.parentNode) {
      const next = this.canvas.cloneNode(false);
      next.id = "game";
      this.canvas.replaceWith(next);
      this.canvas = next;
    }
  }

  applyAudio(settings) {
    this.sfx.setMix(settings);
    this.sfx.boot?.();
    if (settings?.muted) return;
    this.sfx.startMusic();
  }

  _hudPoint(x, y, z) {
    this._ndc.set(x, y, z).project(this.camera);
    return {
      x: (this._ndc.x * 0.5 + 0.5) * window.innerWidth,
      y: (-this._ndc.y * 0.5 + 0.5) * window.innerHeight,
    };
  }

  _collectFx(c, kind = "suck") {
    if (!c?.mesh) return;
    c.mesh.userData.collectT = kind === "punch" ? 0.34 : kind === "fade" ? 0.22 : kind === "pop" ? 0.28 : 0.42;
    c.mesh.userData.collectKind = kind;
  }

  _gateHitFx(c, good) {
    if (!c?.mesh) return;
    c.mesh.userData.hitT = 0.3;
    c.mesh.userData.hitGood = !!good;
    c.mesh.userData.spent = false;
  }

  _gateMissFx() {
    const z = this.crowd.z;
    const x = this.crowd.x;
    for (const c of this.world.colliders) {
      if (c.kind !== "gate" || c.used || c.missed || !c.mesh) continue;
      if (z <= c.z + 0.15 || z > c.z + 1.05) continue;
      const reach = (c.width || 2.2) * 0.5 + 0.2;
      if (Math.abs(x - c.x) <= reach) continue;
      c.missed = true;
      c.mesh.userData.dimT = 0.2;
      this.particles.burst(c.x, 0.9, c.z, 0xb8c4cc, 8, 2.2);
    }
  }

  setMuted(muted) {
    this.applyAudio({ muted, music: this.sfx.musicLevel, sfx: this.sfx.sfxLevel });
  }

  _resize() {
    const box = this.canvas.parentElement || this.canvas;
    const vv = window.visualViewport;
    const w = Math.max(
      2,
      Math.floor(
        this.canvas.clientWidth ||
          box.clientWidth ||
          vv?.width ||
          window.innerWidth ||
          document.documentElement.clientWidth ||
          360
      )
    );
    const h = Math.max(
      2,
      Math.floor(
        this.canvas.clientHeight ||
          box.clientHeight ||
          vv?.height ||
          window.innerHeight ||
          document.documentElement.clientHeight ||
          640
      )
    );
    this.gpu = deviceProfile();
    this.renderer.setPixelRatio(this.gpu.pixelRatio);
    this.renderer.setSize(w, h, false);
    this.canvas.style.width = "100%";
    this.canvas.style.height = "100%";
    this.camera.aspect = w / h;
    this.camera.far = this.gpu.far;
    this.camera.updateProjectionMatrix();
  }

  _resetCamRig() {
    this.camTweens?.killAll?.();
    this.cam = {
      mode: "normal",
      introZoom: 1,
      sway: 0,
      orbit: 0,
      vignette: 0,
      pulseT: -1,
    };
    this._camLock = null;
    this._swerveCool = 0;
    this._prevSteerX = 0;
    this._camPull = 0;
    this._camPunch = 0;
    this._camTiltUp = 0;
    this.camTilt = 0;
  }

  applyWorld(world, levelId) {
    const w = world || worldForLevel(1);
    const fog = levelFog(w, levelId || w.from);
    this.renderer.setClearColor(w.bg, 1);
    this.scene.fog.color.setHex(w.fog);
    this.scene.fog.near = fog.near;
    this.scene.fog.far = fog.far;
    this.scene.background.setHex(w.bg);
    this.lighting?.updateLightingForWorld?.(w.id, w);
    if (this.reduceMotion) this.lighting?.enableEffect?.("bloom", 0);
    for (const s of this.previewSides || []) {
      if (s.material?.color) s.material.color.setHex(w.berm);
    }
    this.worldTheme = w;
    this.sfx.setWorldTrack?.(w.id);
    this.backdrop.applyWorld(w);
    this.world?.applyDecor?.(w);
    const wx = this.backdrop.weather;
    this.sfx.setWeatherAmbience?.(wx?.audioKind || "sunny", { rain: !!wx?.rainOn });
    this.backdrop.life?.playWeatherSounds?.(wx?.audioKind || (w.storm ? "storm" : "sunny"));
  }

  startLevel(level, index, skinId) {
    this.level = level;
    this.levelIndex = index;
    this.ended = true;
    this.paused = true;
    this.pendingContinue = false;
    this.coinMultiplier = 1;
    this.failReason = null;
    this.movedEnough = false;
    this._smashHint = false;
    this._dodgeHint = false;
    this._mulHint = false;
    this.last = performance.now();
    this.input.dragging = false;
    this.preview.visible = false;
    for (const s of this.previewSides) s.visible = false;
    this.applyWorld(worldForLevel(level.id), level.id);
    this.laneLimit = level.laneLimit || worldForLevel(level.id).lane;
    this.world.build(level);
    this.lighting?.bindReceivers?.(this.world._floor, this.crowd.mesh);
    this.crowd.reset(this.capture ? Math.max(28, level.startCount) : level.startCount);
    this.crowd.group.visible = true;
    this.crowd.applySkin(skinId);
    this.skinId = skinId;
    this.ended = false;
    this.paused = false;
    this.state = "playing";
    this.sfx.stopHazards?.();
    this.sfx.ensure();
    this.sfx.startMusic();
    Analytics.event("level_start", { level: index + 1 });
    this.hud.setPlaying(true);
    this.hud.setPaused(false);
    this.hud.setCount(this.crowd.count);
    this.hud._countShown = this.crowd.count;
    this.hud._countGoal = this.crowd.count;
    this.hud.setLevel?.(index + 1, level.worldName);
    this.hud.hideToast?.();
    this.boostT = 0;
    this.magnetT = 0;
    this.starT = 0;
    this.snareT = 0;
    this.chaserBite = 0;
    this._houndOn = false;
    this.geyserHitCd = 0;
    this.runTime = 0;
    this.runScore = 0;
    this._shownScore = -1;
    this.shield = false;
    this.shieldHits = 0;
    this.combo = 0;
    this.maxCombo = 0;
    this.maxComboAchieved = 0;
    this.hazardHitCount = 0;
    this._comboBoostLeft = 0;
    this.nitroCd = 0;
    this.fight = null;
    this._lossCine = null;
    this.camX = 0;
    this.camTilt = 0;
    this._steerX = 0;
    this._finishSlow = 0;
    this._camPull = 0;
    this._camPunch = 0;
    this._camTiltUp = 0;
    this._wardenSeen = false;
    this._wardenCine = false;
    this._bossSlow = 0;
    this.streakAtStart = this.streakAtStart || 0;
    this.rewardSettled = false;
    this.lastWin = null;
    this.lastFail = null;
    this.camera.fov = this.baseFov;
    this.camera.updateProjectionMatrix();
    this._resetCamRig();
    this.hud.setVignette?.(0);
    this.hud.setCombo?.(0);
    this._syncLiveStars();
    this.hud.setScore?.(0);
    this.hud.setProgress?.(0);
    this.hud.setSpeedFx?.(false, false);
    this._syncBuffs();
    this.hud.setStreak?.(this.streakAtStart);
    this.hud.setFight?.(0, null);
    Platform.gameplayStart();
  }

  goMenu() {
    this.state = "menu";
    this.paused = false;
    this.ended = true;
    this.fight = null;
    this.boostT = 0;
    this.magnetT = 0;
    this.starT = 0;
    this.snareT = 0;
    this.shield = false;
    this.shieldHits = 0;
    this.world.clear();
    this.applyWorld(worldForLevel(1));
    this.laneLimit = 3.15;
    this.crowd.reset(18);
    this.crowd.group.visible = false;
    this._lossCine = null;
    this.camX = 0;
    this._steerX = 0;
    this._resetCamRig();
    this.hud.setVignette?.(0);
    this.preview.visible = true;
    for (const s of this.previewSides) s.visible = true;
    this.hud.showMenu();
    this.hud.setPaused(false);
    this.hud.setFight?.(0, null);
    this._syncBuffs();
    this.sfx.stopHazards?.();
    this.sfx.sandStop?.();
    this.sfx.cutBossLoop?.();
    this.sfx.stormAmbience = false;
    this.sfx.startMusic();
    Platform.gameplayStop();
  }

  togglePause() {
    if (this.state !== "playing" || this.ended) return;
    if (this.hud?.els?.help && !this.hud.els.help.classList.contains("hidden")) {
      this.hud.els.help.classList.add("hidden");
      if (this.paused) {
        this.paused = false;
        this.hud.setPaused(false);
        this.sfx.startMusic();
      } else {
        this.hud.setPaused(true);
        this.paused = true;
        this.sfx.startMusic();
      }
      return;
    }
    this.paused = !this.paused;
    this.hud.setPaused(this.paused);
    this.sfx.startMusic();
    if (this.paused) Platform.gameplayStop();
    else Platform.gameplayStart();
  }

  requestRestart() {
    if (!canRestart(this.state, this.ended, this.paused)) return;
    this.hud.onRestartRequest?.();
  }

  _laneFromInput(dt) {
    const axis = this.input.steerAxis();
    let want = this._steerX;
    if (axis !== 0) {
      this.movedEnough = true;
      want = THREE.MathUtils.clamp(this._steerX + axis * 26 * dt, -this.laneLimit, this.laneLimit);
    } else if (this.input.dragging) {
      const rect = this.canvas.getBoundingClientRect();
      const u = (this.input.pointerX - rect.left) / Math.max(1, rect.width);
      this.movedEnough = true;
      want = THREE.MathUtils.clamp((u - 0.5) * 2 * this.laneLimit, -this.laneLimit, this.laneLimit);
    } else {
      return this._steerX;
    }
    this._steerX += (want - this._steerX) * expEase(dt, CAM.steerLag);
    return this._steerX;
  }

  _buzz(ms) {
    try {
      navigator.vibrate?.(ms);
    } catch {
      /* no haptic */
    }
  }

  _feelShake(spec) {
    if (this.reduceMotion || !spec) return;
    this.shake.hit(spec);
  }

  _bloom(hex, amount = 0.22) {
    if (this.reduceMotion || !this._gradeMat) return;
    this._bloomPulse = Math.max(this._bloomPulse || 0, amount);
    if (hex) this._gradeMat.color.setHex(hex);
  }

  _comboFanfare(n) {
    this.onComboMilestone(n);
  }

  onComboMilestone(n) {
    this.hud.onComboMilestone?.(n);
    this.sfx.onComboMilestone?.(n);
    const x = this.crowd.x;
    const y = 1.15;
    const z = this.crowd.z;
    if (n >= 20) {
      this._feelShake(SHAKE.combo10);
      this.cam.pulseT = 0;
      this._buzz(28);
      this.crowd.flash = Math.max(this.crowd.flash, 2.1);
      this.crowd.celebrate = Math.max(this.crowd.celebrate, 0.95);
      this.crowd.comboSquash?.(n);
      this.particles.confetti(x, y, z, 28, [0x2ec8d4, 0xff2244, 0xffe566, 0x00ff00]);
      this.particles.burstGood(x, y, z);
      this._bloom(0xffe566, 0.28);
      this._comboBoostLeft = 2;
    } else if (n >= 10) {
      this._feelShake(SHAKE.combo10);
      this._buzz(16);
      this.crowd.flash = Math.max(this.crowd.flash, 1.6);
      this.crowd.celebrate = Math.max(this.crowd.celebrate, 0.8);
      this.crowd.comboSquash?.(n);
      this.particles.confetti(x, y, z, 22);
      this._bloom(0x7af7ff, 0.2);
    } else {
      this._feelShake({ px: 2, hz: 5, dur: 0.12 });
      this.crowd.comboSquash?.(n);
      this.particles.ring(x, y, z);
    }
  }

  _comboResetFx() {
    if (this.combo > 0) {
      this.sfx.comboReset?.();
      this.particles.drain(this.crowd.x, 1.0, this.crowd.z);
      this.hud.comboDeflate?.();
    }
    this._comboBoostLeft = 0;
  }

  tick() {
    if (!this._alive) return;
    const now = performance.now();
    const dt = Math.min(DT_MAX, (now - this.last) / 1000);
    this.last = now;

    const playing = this.state === "playing" && !this.ended && !this.paused;
    const worldDt = playing ? dt : this.state === "win" || this.state === "menu" ? dt * 0.18 : 0;
    const visualSpeed = playing ? this._runSpeed() : 7;
    this.world.tick(worldDt, this.reduceMotion, this.crowd.z, this.camera, this.crowd.x, visualSpeed);
    if (playing) this._tickHazards(dt);
    else this.sfx.stopHazards?.();
    this.crowd.applySkin(this.skinId || "lime", now / 1000);

    if (playing) {
      this.boostT = Math.max(0, this.boostT - dt);
      this.magnetT = Math.max(0, this.magnetT - dt);
      this.starT = Math.max(0, this.starT - dt);
      this.snareT = Math.max(0, this.snareT - dt);
      this.chaserBite = Math.max(0, this.chaserBite - dt);
      this.nitroCd = Math.max(0, this.nitroCd - dt);
      this.runTime += dt;
      this.crowd.shielded = this.shield;
      this.crowd.boosted = this.boostT > 0.05;
      this._syncBuffs();
      const laneRaw = this.capture
        ? (this._steerX = Math.sin(this.runTime * 1.28) * this.laneLimit * 0.7)
        : this._laneFromInput(dt);
      const lane = this.snareT > 0 ? laneRaw * 0.36 : laneRaw;
      if (this.snareT > 0) this._steerX = lane;
      if (this.capture) this.movedEnough = true;
      this.crowd.targetX = lane;
      this.crowd.compress += (this._compressTarget() - this.crowd.compress) * Math.min(1, dt * 7);
      const fighting = !!this.fight;
      this._finishSlow = Math.max(0, this._finishSlow - dt);
      this._bossSlow = Math.max(0, (this._bossSlow || 0) - dt);
      const speed =
        (fighting ? (this.fight.col?.beast ? 0.62 : 1.12) : this._runSpeed()) *
        (this._finishSlow > 0 ? 0.58 : 1) *
        (this._bossSlow > 0 ? 0.22 : 1) *
        (this._lossCine && this._lossCine.slow > 0 ? CAM.lossSlow : 1);
      this.runScore += dt * speed * (this.starT > 0 ? 2 : 1) * (1 + this.combo * 0.08);
      const shown = this.runScore | 0;
      if (shown !== this._shownScore) {
        this._shownScore = shown;
        this.hud.setScore?.(shown);
      }
      this.crowd.update(dt, this.laneLimit, {
        moving: true,
        reduceMotion: this.reduceMotion,
        speed,
        fighting,
        combo: this.combo,
        camera: this.camera,
        boss: !!this.fight?.col?.beast,
      });
      this._tickChasers(dt, speed);
      this._pullMagnet(dt);
      this.hud.tickCount?.(dt);
      this.hud.tickCoins?.(dt);
      this._scanWardenReveal();
      this._drainWardenCues();
      if (this._lossCine) {
        this._lossCine.t -= dt;
        this._lossCine.slow = Math.max(0, (this._lossCine.slow || 0) - dt);
        if (this.cam) this.cam.vignette = Math.min(1, (this.cam.vignette || 0) + dt / CAM.lossDur);
        this.hud.setVignette?.(this.cam.vignette);
        if (this._lossCine.t <= 0) {
          const reason = this._lossCine.reason;
          this._lossCine = null;
          this._fail(reason);
        }
      } else if (this.fight) this._tickFight(dt);
      else {
        this._coachAhead();
        this._collide();
        this._gateMissFx();
        const beast = this.world.colliders.find(
          (c) => !c.used && c.beast && c.z - this.crowd.z < 14 && c.z - this.crowd.z > 1.4
        );
        if (beast) this.crowd.setEyes("stare", 0.4);
      }
      const finZ = this.world.finishZ || 1;
      this.hud.setProgress?.(this.crowd.z / finZ);
      this._syncLiveStars();
      this.hud.setSpeedFx?.(this.boostT > 0.05, this.combo >= 4);
    } else {
      const winRun = this.state === "win";
      this.crowd.update(dt, this.laneLimit, {
        moving: winRun,
        reduceMotion: this.reduceMotion,
        speed: winRun ? 1.15 : 0,
        combo: this.combo,
        camera: this.camera,
      });
      this.hud.setSpeedFx?.(false, false);
      this.hud.tickCount?.(dt);
      this.hud.tickCoins?.(dt);
    }

    this.backdrop.tick(dt, this.crowd.z, this.reduceMotion, this.crowd.x);
    const theme = this.worldTheme;
    const wx = this.backdrop.weather;
    this.sfx.setWeatherAmbience?.(wx?.audioKind || "sunny", { rain: !!wx?.rainOn });
    this.sfx.setAmbiencePan?.(this.crowd.x / 10);
    this._lifeChirp = (this._lifeChirp || 3.5) - dt;
    if (this._lifeChirp <= 0 && this.backdrop.life?.birds?.length) {
      this._lifeChirp = 3.2 + Math.random() * 2.5;
      this.sfx.lifeChirp?.(this.backdrop.life.birdPan || 0);
    }
    this._lifeRustle = (this._lifeRustle || 5) - dt;
    if (this._lifeRustle <= 0 && (this.backdrop.life?.wind || 0) > 0.45) {
      this._lifeRustle = 5.5 + Math.random() * 4;
      this.sfx.lifeRustle?.();
    }
    if (this.backdrop.consumeStrike?.()) {
      this.hud.stormFlash?.();
      this.world.flareWarden?.();
      if (theme?.id === "crown") this.shake.punch(this.reduceMotion ? 0.04 : 0.14);
    }
    if (this.backdrop.consumeThunder?.()) this.sfx.thunder?.();
    const strike = this.backdrop.flash || 0;
    this.lighting?.tick?.(dt, {
      timeOfDay: this.backdrop.skyPro?.timeOfDay ?? theme?.sunT ?? 0.5,
      flash: strike,
      crowdZ: this.crowd.z,
      crowdX: this.crowd.x,
      reduceMotion: this.reduceMotion,
      pulse: this._bloomPulse || 0,
    });
    if (theme?.storm) {
      this.renderer.setClearColor(strike > 0.2 ? 0xd8eeff : theme.bg, 1);
    }
    this.particles.update(dt, this.reduceMotion);
    this._bloomPulse = Math.max(0, (this._bloomPulse || 0) - dt * 1.8);
    this.rim.position.set(this.crowd.x, 4, this.crowd.z + 4);
    this._updateCamera(dt, playing);

    this.crowd.banner?.lookAt(this.camera.position);
    this.renderer.render(this.scene, this.camera);
    this._drawCalls = this.renderer.info?.render?.calls || 0;
    if (!this._alive) return;
    this.raf = requestAnimationFrame(() => this.tick());
  }

  _updateCamera(dt, playing) {
    if (!this.cam) this._resetCamRig();
    this.camTweens.update(dt);
    const theme = this.worldTheme;
    const strike = this.backdrop.flash || 0;
    const finish = this.world?.colliders?.find?.((c) => c.kind === "finish");
    const crown = theme?.id === "crown";
    const beasts = this.world?.colliders?.filter?.((c) => c.beast && !c.used) || [];
    const nearestBeast = beasts.reduce((best, c) => {
      const gap = c.z - this.crowd.z;
      if (gap < -2 || gap > 36) return best;
      if (!best || gap < best.z - this.crowd.z) return c;
      return best;
    }, null);
    const focus = nearestBeast || finish;
    const gap = focus ? focus.z - this.crowd.z : 99;
    const introOn = this.cam.introZoom > 1.02 && !this.fight;
    const mode = camMode({
      win: this.state === "win",
      loss: !!this._lossCine || this.state === "fail",
      bossFight: !!this.fight?.col?.beast,
      intro: introOn,
    });
    this.cam.mode = mode;

    const wantPull =
      !!focus?.beast &&
      !this.fight?.col?.beast &&
      this.state !== "win" &&
      (introOn || (gap < (crown ? 32 : 20) && gap > -1.6)) &&
      this.state === "playing"
        ? 1
        : 0;
    this._camPull += (wantPull - this._camPull) * Math.min(1, dt * (crown ? 1.05 : 1.8));
    let hazardPunch = 0;
    if (playing && !this.reduceMotion) {
      for (const c of this.world.colliders) {
        if (c.used) continue;
        const dz = c.z - this.crowd.z;
        if (c.kind === "slam" && c.hot && dz < 3.4 && dz > -1.1) {
          hazardPunch = Math.max(hazardPunch, 0.28);
        } else if ((c.kind === "saw" || c.kind === "spinner") && dz < 2.8 && dz > -0.6 && Math.abs(this.crowd.x - c.x) < (c.width || 1.4)) {
          hazardPunch = Math.max(hazardPunch, 0.12);
        }
      }
      if (this.fight) hazardPunch = Math.max(hazardPunch, 0.18);
    }
    this._camPunch = (this._camPunch || 0) + (hazardPunch - (this._camPunch || 0)) * Math.min(1, dt * 7);
    const tiltWant = crown && gap < 42 && gap > -2 ? 1 - Math.max(0, Math.min(1, gap / 38)) : 0;
    this._camTiltUp += (tiltWant - (this._camTiltUp || 0)) * Math.min(1, dt * 1.15);
    if (playing && focus?.beast && !this._wardenSeen && gap < (crown ? 26 : 16) && gap > 2) {
      this._wardenSeen = true;
    }

    const pull = this._camPull || 0;
    const tilt = this._camTiltUp || 0;
    if (this.back) {
      if (crown) {
        const fx = finish?.x || 0;
        const fz = finish?.z || this.crowd.z + 40;
        this.back.position.set(fx, 6.4, fz + 8);
        this.back.target.position.set(this.crowd.x, 1.2, this.crowd.z);
        this.back.target.updateMatrixWorld();
        this.back.intensity = 0.5 + pull * 0.9 + strike * 0.8;
        this.key.intensity = (theme?.keyInt || 1) * (1 - pull * 0.25);
      } else if (focus?.beast && pull > 0.02) {
        this.back.position.set(focus.x || 0, 9.2, focus.z + 6.8);
        this.back.target.position.set(this.crowd.x, 1.15, this.crowd.z);
        this.back.target.updateMatrixWorld();
        this.back.intensity = pull * 1.75;
        this.key.intensity = (theme?.keyInt || 1) * (1 - pull * 0.8);
      } else {
        this.back.intensity = 0;
        if (theme) this.key.intensity = theme.keyInt;
      }
    }

    const steerN = this.laneLimit ? this._steerX / this.laneLimit : 0;
    this._prevSteerX = this._steerX;
    const swayWant = !this.reduceMotion && playing && mode === "normal" ? swayFromSteer(steerN, false) : 0;
    this.cam.sway += (swayWant - this.cam.sway) * expEase(dt, CAM.steerLag);

    if (this.cam.pulseT >= 0) {
      this.cam.pulseT += dt;
      if (this.cam.pulseT >= CAM.comboPulse) this.cam.pulseT = -1;
    }

    this.camX += (this.crowd.x - this.camX) * expEase(dt, CAM.steerLag);
    const hPx = this.canvas.clientHeight || 720;
    const off = this.shake.offset(this.reduceMotion, dt, hPx);
    const bob = this.reduceMotion || !(playing || this.state === "win") ? 0 : Math.sin(this.runTime * 8) * 0.03;
    let lookX = null;
    let lookY = null;
    let lookZ = null;
    if (mode === "loss" && this._camLock) {
      lookX = this._camLock.x;
      lookY = this._camLock.y;
      lookZ = this._camLock.z;
    } else if (mode === "intro" && nearestBeast) {
      lookX = nearestBeast.x || 0;
      lookY = 1.35;
      lookZ = nearestBeast.z;
    }

    const shot = cameraShot({
      mode,
      crowdX: this.crowd.x,
      crowdZ: this.crowd.z,
      camX: this.camX,
      sway: this.reduceMotion ? 0 : this.cam.sway,
      introZoom: this.reduceMotion ? 1 : this.cam.introZoom,
      pull: this.reduceMotion ? pull * 0.35 : pull + (this._camPunch || 0),
      tiltUp: tilt,
      orbit: this.reduceMotion ? 0 : this.cam.orbit,
      aspect: this.camera.aspect,
      bob,
      shake: off,
      lookX,
      lookY,
      lookZ,
    });

    let fov = shot.fov;
    if (this.cam.pulseT >= 0 && !this.reduceMotion) {
      fov = comboPulseFov(this.cam.pulseT, mode === "boss" ? CAM.bossFov : CAM.fov);
    }
    this.camera.fov += (fov - this.camera.fov) * Math.min(1, dt * 8);
    this.camera.updateProjectionMatrix();
    this.camera.position.set(shot.x, shot.y, shot.z);
    this.camera.up.set(Math.sin(shot.roll), Math.cos(shot.roll), 0);
    this.camera.lookAt(shot.lx, shot.ly, shot.lz);
    if (this.state === "menu") this.hud.setVignette?.(0);
    else this.hud.setVignette?.(Math.max(this.cam.vignette || 0, (this.lighting?.vignette || 0) * 0.45));
  }

  _tickHazards(dt) {
    const list = [];
    const cols = this.world?.colliders;
    if (!cols) {
      this.sfx.syncHazards?.([]);
      return;
    }
    this.geyserHitCd = Math.max(0, this.geyserHitCd - dt);
    for (const c of cols) {
      if (c.kind !== "saw" && c.kind !== "spinner" && c.kind !== "hole" && c.kind !== "geyser") continue;
      const dz = c.z - this.crowd.z;
      const dist = Math.hypot((c.x || 0) - this.crowd.x, dz);
      const near = dz > -5 && dz < 22;
      if (c.kind === "saw" || c.kind === "spinner") {
        const hot = !c.used && dz < 10 && dz > 0.35;
        c.hot = hot;
        const speed = c.spinSpeed || c.mesh?.userData?.spinSpeed || 8;
        if (!c.used) {
          list.push({
            id: `${c.kind}:${c.sawIndex ?? c.spinIndex}:${c.z}`,
            kind: c.kind,
            speed,
            hot,
            dist,
            moving: !!c.mesh?.userData?.patrol,
            phase: c.mesh?.userData?.rotorY || c.mesh?.rotation.z || 0,
            alive: true,
          });
        }
        if (this.reduceMotion || !near || c.used) continue;
        if (hot) c._nearDodge = true;
        else if (c._nearDodge && dz < -0.15) {
          c._nearDodge = false;
          this._hazardDodge(c);
        }
        if (this.particles.items.length < MAX_PARTICLES && hot) {
          this.particles.orbitWarn?.(c.x, c.kind === "spinner" ? 1.12 : 0.62, c.z, c.kind === "saw" ? 0.72 : 0.95);
        }
        if (c.mesh?.userData?.patrol) {
          const px = c.mesh.userData.prevX ?? c.x;
          if (Math.abs(c.x - px) > 0.015 && this.particles.items.length < MAX_PARTICLES) this.particles.fadeTrail?.(px, 0.62, c.z);
          c.mesh.userData.prevX = c.x;
        }
        continue;
      }
      if (c.kind === "hole" && !c.used) {
        list.push({
          id: `hole:${c.z}:${c.x}`,
          kind: "hole",
          speed: 8,
          hot: dz < 8 && dz > -1,
          dist,
          moving: false,
          phase: 0,
          alive: true,
        });
        if (!this.reduceMotion && near) {
          this.particles.vortex?.(c.x, 0.06, c.z, (c.width || 2) * 0.42, `hole:${c.z}`);
        }
        if (near && dist < 14 && Math.random() < dt * 0.48) this.sfx.pitCrack?.();
        continue;
      }
      if (c.kind === "geyser") {
        list.push({
          id: `geyser:${c.z}:${c.x}`,
          kind: "geyser",
          speed: 8,
          hot: !!c.hot,
          dist,
          moving: false,
          phase: 0,
          alive: true,
        });
        if (c.justHot) {
          this.sfx.geyserErupt?.();
          c.justHot = false;
        }
        if (!this.reduceMotion && near) {
          const src = `geyser:${c.z}`;
          const n = c.hot ? 4 : 1;
          for (let i = 0; i < n; i++) this.particles.geyserSpray?.(c.x, 0.18, c.z, !!c.hot, src);
        }
      }
    }
    this.sfx.syncHazards?.(list);
  }

  _hazardDodge(c) {
    if (this.reduceMotion) return;
    this.particles.fadeTrail?.(c.x, 0.7, c.z);
    this.particles.orbitWarn?.(c.x, 0.55, c.z, 0.4);
    this.sfx.relief?.();
  }

  _camImpact(lost, prevCount) {
    const prev = Math.max(1, prevCount | 0);
    const n = Math.max(0, lost | 0);
    const pct = Math.min(1, n / prev);
    const major = pct >= 0.25 || n >= 6;
    this._feelShake(major ? SHAKE.warden : SHAKE.hazard);
  }

  _runSpeed() {
    const fever = 1 + Math.min(0.18, this.combo * 0.04);
    return (8.05 + Math.min(3.4, this.levelIndex * 0.1) + Math.min(1.8, this.runTime * 0.1)) * (this.boostT > 0 ? 1.28 : 1) * fever;
  }

  _syncLiveStars() {
    this.hud.setLiveStars?.({
      hits: this.hazardHitCount,
      combo: Math.max(this.maxCombo || 0, this.maxComboAchieved || 0),
      playing: this.state === "playing" && !this.ended,
    });
  }

  _compressTarget() {
    const z = this.crowd.z;
    const x = this.crowd.x;
    const tight = this.world.colliders.find(
      (c) =>
        LANE_HAZ.has(c.kind) &&
        !c.used &&
        c.hot !== false &&
        c.z - z < 5.5 &&
        c.z - z > 0.4 &&
        Math.abs(x - c.x) < (c.width || 1.4) * 0.85
    );
    return tight ? 0.7 : 1;
  }

  _tickChasers(dt, speed) {
    if (this.ended) return;
    const z = this.crowd.z;
    const x = this.crowd.x;
    const base = this._runSpeed();
    let houndOn = false;
    for (const c of this.world.colliders) {
      if (c.kind !== "chaser" || c.used) continue;
      if (!c.armed && z >= c.z - 2) {
        c.armed = true;
        c.z = chaserEmergeZ(z);
        c.x = x;
        if (c.mesh) {
          c.mesh.visible = true;
          c.mesh.position.set(c.x, 0, c.z);
        }
        this.particles.slamHit?.(c.x, 0.04, c.z);
        this.hud.toast("Hound! Pull ahead");
        this.sfx.sandStart?.();
        this.sfx.sandBite?.(true);
        this._feelShake(SHAKE.hazard);
      }
      if (!c.armed) continue;
      houndOn = true;
      const mul = this.fight ? 0.15 : chaserMul(c.z, z);
      c.hunting = !this.fight && mul >= CHASER.huntMul;
      if (c.mesh) c.mesh.userData.col = c;
      if (mul <= 0) {
        c.used = true;
        houndOn = false;
        if (c.mesh) c.mesh.visible = false;
        this.particles.pitBurst?.(c.x, 0.02, c.z);
        this.hud.toast("Hound lost");
        this.sfx.sandStop?.();
        this.sfx.whoosh?.();
        continue;
      }
      const chase = this.fight ? base * 0.12 : base * mul;
      c.z += chase * dt;
      c.x += (x - c.x) * Math.min(1, dt * (this.fight ? 0.8 : 2.8));
      if (c.mesh) {
        c.mesh.position.x = c.x;
        c.mesh.position.z = c.z;
      }
      if (c.hunting) {
        c.huntSfx = (c.huntSfx || 0) - dt;
        if (c.huntSfx <= 0) {
          c.huntSfx = 0.9;
          this.sfx.sandBite?.(true);
        }
        c.sandFx = (c.sandFx || 0) - dt;
        if (c.sandFx <= 0) {
          c.sandFx = 0.22;
          this.particles.burst(c.x, 0.08, c.z - 0.4, 0xc4a06a, 4, 2.2);
        }
      }
      if (!this.fight && chaserCanBite(c.z, z, c.x, x) && this.chaserBite <= 0) {
        this.chaserBite = 0.38;
        this.hud.painFlash?.();
        this.sfx.sandBite?.(true);
        this.particles.slamHit?.(c.x, 0.05, c.z);
        this._hazardStrike(() => {
          const prev = this.crowd.count;
          const dmg = c.damage || 4;
          this.crowd.setCount(this.crowd.count - dmg, { knock: true });
          this.hud.setCount(this.crowd.count);
          this.hud.floatText(`-${dmg}`, "#ff6b9a");
          this.sfx.hit();
          this.crowd.impact("bad");
          this._camImpact(dmg, prev);
          this._comboResetFx();
          this.combo = 0;
          this.hud.setCombo?.(0);
          if (this.crowd.count <= 0) this._queueFail("hazard");
        });
      }
    }
    this._houndOn = houndOn;
    this._syncBuffs();
  }

  _syncBuffs() {
    this.hud.setBuffs?.({
      shield: this.shield,
      shieldHits: this.shieldHits,
      boost: this.boostT > 0,
      magnet: this.magnetT > 0,
      star: this.starT > 0,
      snare: this.snareT > 0,
      hound: !!this._houndOn,
    });
  }

  _pullMagnet(dt) {
    if (this.magnetT <= 0) return;
    const z = this.crowd.z;
    const x = this.crowd.x;
    for (const c of this.world.colliders) {
      if (c.used || c.kind !== "coin") continue;
      const dz = c.z - z;
      if (dz > 11 || dz < -1.2) continue;
      c.x += (x - c.x) * Math.min(1, dt * 7.5);
      c.z += (z + 0.35 - c.z) * Math.min(1, dt * 2.4);
      if (c.mesh) {
        c.mesh.position.x = c.x;
        c.mesh.position.z = c.z;
        c.mesh.rotation.y += dt * 10;
      }
    }
  }

  tryNitro() {
    if (this.state !== "playing" || this.ended || this.paused) return;
    if (this.nitroCd > 0) return;
    this.nitroCd = 1.05;
    this.boostT = Math.max(this.boostT, 0.92);
    this.sfx.pickupBoost?.();
    this.crowd.impact("good");
    this.hud.toast("NITRO");
    this._syncBuffs();
  }

  _hazardStrike(apply) {
    return this._absorbOrHit(() => {
      this.hazardHitCount += 1;
      this._syncLiveStars();
      apply();
    });
  }

  _absorbOrHit(apply) {
    if (this.shield) {
      this.shield = false;
      this.shieldHits = 0;
      this.hud.toast("SHIELD BROKE");
      this.crowd.impact("land");
      this.sfx.ui();
      this._syncBuffs();
      this.shake.punch(this.reduceMotion ? 0.05 : 0.18);
      return true;
    }
    apply();
    return false;
  }

  _scanWardenReveal() {
    if (this.ended || !this.world?.colliders) return;
    const z = this.crowd.z;
    for (const c of this.world.colliders) {
      if (!c.beast || c.used || c.introSeen) continue;
      const gap = c.z - z;
      if (gap < 16 && gap > 1.6) this._playWardenIntro(c);
    }
  }

  _playWardenIntro(col) {
    if (!col || col.introSeen) return;
    col.introSeen = true;
    this.hud.toast(this.level?.id === 56 ? "THE WARDEN" : "WARDEN");
    this.crowd.setEyes("stare", 1.4);
    if (this._wardenCine) return;
    this._wardenCine = true;
    this.sfx.bossIntro?.();
    this.hud.whiteFlash?.();
    this.world.flareWarden?.();
    this._bossSlow = 0.5;
    this.camTweens.to(this.cam, "introZoom", CAM.introZoom, CAM.introDur, Ease.quadOut);
    this._feelShake(SHAKE.warden);
    // #region agent log
    fetch("http://127.0.0.1:7879/ingest/57d34612-807f-4bf9-bc3c-727e6fc79cef", {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Debug-Session-Id": "07c109" },
      body: JSON.stringify({
        sessionId: "07c109",
        runId: "warden",
        hypothesisId: "W1",
        location: "Game.js:_playWardenIntro",
        message: "warden intro",
        data: {
          level: (this.levelIndex | 0) + 1,
          cutFx: this.world?.cutFx?.length || 0,
          particles: this.particles?.items?.length || 0,
        },
        timestamp: Date.now(),
      }),
    }).catch(() => {});
    // #endregion
  }

  _endBossAudio({ fanfare = false } = {}) {
    if (fanfare) this.sfx.stopBossLoop?.({ fanfare: true });
    else this.sfx.cutBossLoop?.();
    this.sfx.sandStop?.();
  }

  _drainWardenCues() {
    const armies = this.world?.armies;
    if (!armies) return;
    for (const col of armies) {
      const cue = col.wardenCue;
      if (!cue) continue;
      col.wardenCue = null;
      if (cue === "cleave") this.sfx.wardenSlash?.();
      else if (cue === "spin") this.sfx.wardenSpin?.();
      else if (cue === "slam") {
        this.sfx.wardenSlam?.();
        this._feelShake(SHAKE.warden);
      } else if (cue === "step") this._feelShake(SHAKE.hazard);
    }
  }

  _beginFight(col, isFinish) {
    if (this.fight || col.used) return;
    col.fighting = true;
    col.charging = false;
    if (col.beast) {
      col.wardenSeq = 0;
      col.wardenAtk = { mode: "cleave", t: 0 };
      col.wardenClip = null;
    }
    this.fight = {
      col,
      left: Math.max(1, (col.count || col.hp || 1) | 0),
      isFinish: !!isFinish,
      acc: 0,
    };
    this.hud.setFight(this.crowd.count, this.fight.left, { beast: !!col.beast });
    this.crowd.setEyes(col.beast ? "stare" : "rage", 1.2);
    this.crowd.feel?.("fight");
    this._finishSlow = Math.max(this._finishSlow, col.beast ? 0.55 : 0.28);
    this.sfx.fightStart?.(!!col.beast);
    if (col.beast) this.camTweens.to(this.cam, "introZoom", 1, 0.35, Ease.quadOut);
    this.shake.punch(this.reduceMotion ? 0.08 : 0.22);
    this._buzz(24);
    const feel = col.beast ? FEEL.warden : FEEL.sepoy;
    this.particles.burst(this.crowd.x, 0.7, this.crowd.z + 0.4, feel.hex, feel.n, 3.2);
    this._feelShake(feel.shake);
  }

  _tickFight(dt) {
    if (!this.fight || this.ended) return;
    const rate = this.fight.col?.beast ? 5.1 + this.levelIndex * 0.28 : 9 + this.levelIndex * 0.45;
    this.fight.acc += rate * dt;
    const n = Math.floor(this.fight.acc);
    if (n >= 1) {
      this.fight.acc -= n;
      const take = Math.min(1, this.fight.left, this.crowd.count);
      this.fight.left -= take;
      this.crowd.setCount(this.crowd.count - take, { knock: true, cut: true });
      this.hud.setCount(this.crowd.count);
      this.world.setArmyCount(this.fight.col, this.fight.left);
      this.hud.setFight(this.crowd.count, this.fight.left, { beast: !!this.fight.col.beast });
      const cutX = this.crowd.x + (Math.random() - 0.5) * 0.7;
      const cutZ = this.crowd.z + 0.35;
      const beast = !!this.fight.col.beast;
      this.world.playCut(cutX, beast ? 0.9 : 0.52, cutZ, beast);
      if (!beast) this.world.playPunch?.(cutX + (Math.random() - 0.5) * 0.35, 0.42, cutZ + 0.12);
      const feel = beast ? FEEL.warden : FEEL.sepoy;
      this.particles.burst(cutX, 0.5, cutZ, feel.hex, beast ? 6 : feel.n, 2.4);
      if (!beast) {
        this.particles.streak(cutX, 0.55, cutZ, 0xfff0b0, 6);
        this.particles.burst(cutX, 0.42, cutZ + 0.06, feel.slime, 6, 2.4);
      }
      this.crowd.feel("fight");
      this.crowd.setEyes("rage", 0.28);
      this.sfx.fightClash?.(beast);
      if (beast) {
        this.fight.swing = (this.fight.swing || 0) + 1;
        const playerHit = this.fight.swing % 2;
        if (playerHit) this.fight.col.wardenClip = { mode: "stagger", t: 0 };
        this.crowd.feel("bossHit");
        this._feelShake(FEEL.warden.shake);
        // #region agent log
        if (this.fight.swing % 5 === 1) {
          fetch("http://127.0.0.1:7879/ingest/57d34612-807f-4bf9-bc3c-727e6fc79cef", {
            method: "POST",
            headers: { "Content-Type": "application/json", "X-Debug-Session-Id": "07c109" },
            body: JSON.stringify({
              sessionId: "07c109",
              runId: "warden",
              hypothesisId: "W2",
              location: "Game.js:_tickFight",
              message: "warden fight tick",
              data: {
                swing: this.fight.swing,
                left: this.fight.left,
                crowd: this.crowd.count,
                cutFx: this.world?.cutFx?.length || 0,
                particles: this.particles?.items?.length || 0,
                cutSpawn: this.world?._cutSpawn || 0,
              },
              timestamp: Date.now(),
            }),
          }).catch(() => {});
        }
        // #endregion
      } else this._feelShake(FEEL.sepoy.shake);
    }
    const cleared = this.fight.left <= 0 && (this.fight.isFinish || this.crowd.count > 0);
    if (cleared) {
      const col = this.fight.col;
      const wasFinish = this.fight.isFinish;
      const hp = col.hp || col.count || 1;
      const beast = !!col.beast;
      col.used = true;
      col.fighting = false;
      col.regroupT = beast ? 1.05 : 0.55;
      if (beast) {
        col.wardenClip = { mode: "defeat", t: 0 };
        col.wardenAtk = null;
      }
      this.fight = null;
      this.hud.setFight(0, null);
      if (beast) this._endBossAudio({ fanfare: true });
      else {
        this.sfx.smash();
        this.sfx.blobStrike?.();
      }
      this.crowd.celebrate = 1.15;
      this.crowd.impact("good");
      if (beast) this.crowd.setEyes("happy", 1.6);
      this.particles.burst(this.crowd.x, 0.8, this.crowd.z + 0.5, 0xc6ff4a, 12, 4);
      if (wasFinish) this._win(hp);
      return;
    }
    if (this.crowd.count <= 0) {
      const finishFail = this.fight.isFinish;
      const beast = !!this.fight.col?.beast;
      this.fight.col.fighting = false;
      if (beast && !this.capture) {
        this.fight.col.wardenClip = { mode: "victory", t: 0 };
        this.fight.col.wardenAtk = null;
        this._endBossAudio({ fanfare: false });
        this.fight = null;
        this.hud.setFight(0, null);
        this._queueFail(finishFail ? "door" : "wiped", { wait: 2, lockBeast: true });
        return;
      }
      this.fight = null;
      this.hud.setFight(0, null);
      if (beast) this._endBossAudio({ fanfare: false });
      this._queueFail(finishFail ? "door" : "wiped");
    }
  }

  isLastLevel() {
    return this.levelIndex >= LEVELS.length - 1;
  }

  _coachAhead() {
    if (!this.hud.els.hint?.classList.contains("hidden")) return;
    const z = this.crowd.z;
    const hazard = this.world.colliders.find(
      (c) => HIT_HAZ.has(c.kind) && !c.used && c.hot !== false && c.z - z < 9 && c.z - z > 2.2
    );
    if (hazard && !this._dodgeHint) {
      this._dodgeHint = true;
      this.hud.toast(hazard.x >= 0 ? "Swipe LEFT around it" : "Swipe RIGHT around it");
    }
    const finish = this.world.colliders.find((c) => c.kind === "finish");
    if (finish && !finish.beast && !this._smashHint && finish.z - z < 11 && finish.z - z > 2 && z > 5) {
      this._smashHint = true;
        this.hud.toast(this.crowd.count >= finish.hp ? "You're bigger" : "Need more blobs");
    }
  }

  _collide() {
    if (this.ended) return;
    const z = this.crowd.z;
    const x = this.crowd.x;
    const finish = this.world.colliders.find((c) => c.kind === "finish");
    if (finish && !finish.used && z >= finish.z - 0.7) {
      this._beginFight(finish, true);
      return;
    }

    for (const c of this.world.colliders) {
      if (this.ended) return;
      if (c.used || c.kind === "finish" || c.kind === "chaser") continue;
      const zPad =
        c.kind === "coin" || c.kind === "magnet" || c.kind === "star" || c.kind === "grow" || c.kind === "leech" || c.kind === "snare"
          ? 1.35
          : c.kind === "army" || c.kind === "beast"
            ? 2.6
            : c.kind === "slam"
              ? (c.depth || SLAM_HEAD.sz) * 0.5 + 0.45
              : 0.7;
      const zRear = c.kind === "slam" ? (c.depth || SLAM_HEAD.sz) * 0.5 + 0.55 : 1.05;
      if (z < c.z - zPad || z > c.z + zRear) continue;

      if (c.kind === "gate") {
        const reach = (c.width || 2.2) * 0.5 + 0.2;
        if (Math.abs(x - c.x) > reach) continue;
        c.used = true;
        for (const other of this.world.colliders) {
          if (other.kind === "gate" && other !== c && Math.abs(other.z - c.z) < 0.05) {
            other.used = true;
            this._collectFx(other, "fade");
          }
        }
        this.crowd.setCount(applyOp(c.op, this.crowd.count, c.value), {
          spawnFrom: { x: c.x - this.crowd.x, z: 0.85 },
          knock: c.op === "sub" || c.op === "div",
        });
        this.hud.setCount(this.crowd.count);
        this.hud.floatText(opLabel(c.op, c.value), c.op === "sub" || c.op === "div" ? "#ff6b9a" : "#c6ff4a");
        const good = c.op === "add" || c.op === "mul";
        this.sfx.gate(c.op);
        this.crowd.impact(good ? "good" : "bad");
        if (good) this.crowd.celebrate = Math.max(this.crowd.celebrate, 0.55);
        this.shake.punch(this.reduceMotion ? 0.05 : c.op === "mul" ? 0.28 : 0.14);
        this._buzz(good ? 12 : 22);
        if (good) {
          this.particles.burstGood(c.x, 1.1, c.z);
          this._bloom(0xc6ff4a, 0.2);
        } else {
          this.particles.burstBad(c.x, 1.1, c.z);
          this._bloom(0xff4d6d, 0.16);
          this._feelShake(SHAKE.hazard);
        }
        if (good) this.hud.burstCoins(4);
        this._gateHitFx(c, good);
        this.hud.onTutorialProgress?.("gate");
        if (good) {
          if (this._comboBoostLeft > 0) {
            this._comboBoostLeft -= 1;
            this.hud.burstCoins(5);
          }
          this.combo += 1;
          this.maxCombo = Math.max(this.maxCombo || 0, this.combo);
          this.maxComboAchieved = this.maxCombo;
          this.hud.setCombo?.(this.combo);
          this._syncLiveStars();
          this.hud.floatText("+1 combo", "#5edce0", "combo-plus");
          if (this.combo === 3) this.onCombo?.();
          if (this.combo === 5 || this.combo === 10 || this.combo === 20) this.onComboMilestone(this.combo);
        } else {
          this._comboResetFx();
          this.combo = 0;
          this.hud.setCombo?.(0);
        }
        if (c.op === "mul" && !this._mulHint) {
          this._mulHint = true;
          this.hud.toast("Pick the bigger number — then fight");
        }
        if (this.crowd.count <= 0) this._queueFail("wiped");
      } else if (c.kind === "coin") {
        const reach = this.magnetT > 0 ? 2.35 : 0.85;
        if (Math.abs(x - c.x) > reach) continue;
        c.used = true;
        this._collectFx(c, "pop");
        const amt = Math.floor((c.amount || 6) * (this.starT > 0 ? 2 : 1) * Math.max(comboCoinMult(this.combo), this._comboBoostLeft > 0 ? 1.25 : 1));
        this.onCoin?.(amt);
        this.hud.burstCoins(amt, this._hudPoint(c.x, 0.55, c.z));
        this.hud.floatText(`+${amt}`, "#ffd166");
        this.particles.burstPickup(c.x, 0.55, c.z, 0xffd166, 8);
        this.particles.coinFly?.(c.x, 0.55, c.z, 5);
        this._bloom(0xffd166, 0.18);
        this.crowd.impact("pickup");
        this.crowd.celebrate = Math.max(this.crowd.celebrate, 0.28);
        this.sfx.coin(this.combo >= 2);
      } else if (c.kind === "leech") {
        if (Math.abs(x - c.x) > 1.45) continue;
        c.used = true;
        this._collectFx(c, "punch");
        const amt = leechAmount(c.amount || 20);
        this.onCoin?.(-amt);
        this.hud.floatText(leechLabel(amt), "#ff4d6d");
        this.sfx.hit();
        this.crowd.impact("bad");
        this.crowd.poison?.();
        this._comboResetFx();
        this.combo = 0;
        this.hud.setCombo?.(0);
        this.particles.burst(c.x, 0.55, c.z, 0xff4d6d, 12, 3.4);
      } else if (c.kind === "snare") {
        if (Math.abs(x - c.x) > 1.5) continue;
        c.used = true;
        this._collectFx(c, "suck");
        this.snareT = Math.max(this.snareT, 3.4);
        this.hud.toast("SNARE MAGNET");
        this.sfx.hit();
        this.crowd.impact("bad");
        this.particles.burst(c.x, 0.7, c.z, 0x9b4dff, 14, 5);
        this._syncBuffs();
      } else if (c.kind === "boost") {
        if (Math.abs(x - c.x) > 1.45) continue;
        c.used = true;
        this._collectFx(c, "pop");
        this.boostT = Math.max(this.boostT, 1.2);
        this.crowd.glowFlashT = Math.max(this.crowd.glowFlashT, 2);
        this.hud.flashPip?.("boost");
        this.sfx.pickupBoost?.();
        this._bloom(0x7af7ff, 0.24);
        this.crowd.impact("pickup");
        this.crowd.celebrate = Math.max(this.crowd.celebrate, 0.7);
        this.particles.burstPickup(c.x, 0.6, c.z, 0x7af7ff, 10);
        this._syncBuffs();
        this.hud.setSpeedFx?.(true, this.combo >= 4);
      } else if (c.kind === "magnet") {
        if (Math.abs(x - c.x) > 1.5) continue;
        c.used = true;
        this._collectFx(c, "pop");
        this.magnetT = Math.max(this.magnetT, 7.2);
        this.hud.flashPip?.("magnet");
        this.sfx.pickupMagnet?.();
        this.crowd.impact("good");
        this.particles.burstPickup(c.x, 0.7, c.z, 0xc77dff, 10);
        this._syncBuffs();
      } else if (c.kind === "star") {
        if (Math.abs(x - c.x) > 1.5) continue;
        c.used = true;
        this._collectFx(c, "pop");
        this.starT = Math.max(this.starT, 8);
        this.hud.whiteFlash?.();
        this.hud.flashPip?.("star");
        this.sfx.pickupStar?.();
        this.crowd.impact("good");
        this.particles.burstPickup(c.x, 0.7, c.z, 0xffe566, 8);
        this._syncBuffs();
      } else if (c.kind === "grow") {
        if (Math.abs(x - c.x) > 1.5) continue;
        c.used = true;
        this._collectFx(c, "pop");
        const amt = c.amount || 8;
        this.crowd.setCount(this.crowd.count + amt, { spawnFrom: { x: c.x - this.crowd.x, z: 0.4 } });
        this.hud.setCount(this.crowd.count);
        this.sfx.pickupBoost?.();
        this._bloom(0x7cff9a, 0.2);
        this.crowd.impact("pickup");
        this.hud.floatText(`+${amt}`, "#7cff9a");
        this.hud.flyMark?.("+", this._hudPoint(c.x, 0.7, c.z), this.hud.els.count);
        this.sfx.pickupGrow?.();
        this.crowd.celebrate = Math.max(this.crowd.celebrate, 0.8);
        this.crowd.glowFlashT = Math.max(this.crowd.glowFlashT, 0.55);
        this.particles.burstPickup(c.x, 0.7, c.z, 0x3cff6a, 10);
      } else if (c.kind === "shield") {
        if (Math.abs(x - c.x) > 1.45) continue;
        c.used = true;
        this._collectFx(c, "pop");
        this.shield = true;
        this.shieldHits = 1;
        this.sfx.pickupShield?.();
        this.crowd.impact("good");
        this.particles.burstPickup(c.x, 0.8, c.z, 0x9ee8ff, 10);
        this._syncBuffs();
      } else if (c.kind === "army" || c.kind === "beast") {
        if (Math.abs(x - c.x) > 2.5) continue;
        this._beginFight(c, false);
        return;
      } else if (HIT_HAZ.has(c.kind)) {
        if (c.hot === false) continue;
        const spread =
          c.kind === "slam"
            ? slamHitHalf(this.crowd.radius())
            : (c.width || 1.4) * 0.62 + this.crowd.radius() * 0.38;
        if (Math.abs(x - c.x) > spread) continue;
        if (c.kind === "geyser") {
          if (this.geyserHitCd > 0) continue;
          this.geyserHitCd = 0.55;
          this._comboResetFx();
          this.combo = 0;
          this.hud.setCombo?.(0);
          this._hazardStrike(() => {
            const prev = this.crowd.count;
            const dmg = geyserLoss(this.crowd.count);
            this.crowd.setCount(this.crowd.count - dmg, { knock: true, tumble: true });
            this.crowd.z = Math.max(0, this.crowd.z - 0.55);
            this.hud.setCount(this.crowd.count);
            this.hud.floatText(`-${dmg}`, "#7ad8ff");
            this.sfx.geyserErupt?.();
            this.crowd.impact("bad");
            this._camImpact(dmg, prev);
            this._buzz(22);
            this.particles.geyserSpray?.(c.x, 0.4, c.z, true, `geyser:${c.z}`);
            this.hud.onTutorialProgress?.("hazard");
            if (this.crowd.count <= 0) this._queueFail("hazard");
          });
          continue;
        }
        c.used = true;
        this._collectFx(c, "punch");
        this._comboResetFx();
        this.combo = 0;
        this.hud.setCombo?.(0);
        this._hazardStrike(() => {
          const prev = this.crowd.count;
          const dmg = c.damage || 3;
          this.crowd.setCount(this.crowd.count - dmg, { knock: true });
          this.hud.setCount(this.crowd.count);
          this.hud.floatText(`-${dmg}`, "#d1262e");
          if (c.kind === "slam") this.sfx.wardenSlam?.();
          else this.sfx.trap?.();
          this.crowd.impact("bad");
          if (c.kind !== "slam") this._camImpact(dmg, prev);
          this._buzz(30);
          if (c.kind === "slam") {
            this.particles.slamHit?.(c.x, 0.08, c.z);
            this.crowd.impact("land");
            this._feelShake(FEEL.slam.shake);
          } else {
            const steel = c.kind === "saw" || c.kind === "spinner";
            this.particles.burst(c.x, 0.8, c.z, steel ? FEEL.saw.hex : FEEL.gateBad.hex, steel ? FEEL.saw.n : 10, 4);
            this._feelShake(FEEL.saw.shake);
          }
          this.hud.onTutorialProgress?.("hazard");
          if (this.crowd.count <= 0) this._queueFail("hazard");
        });
      } else if (c.kind === "hole") {
        if (Math.abs(x - c.x) > c.width * 0.52) continue;
        c.used = true;
        this._comboResetFx();
        this.combo = 0;
        this.hud.setCombo?.(0);
        this._hazardStrike(() => {
          const prev = this.crowd.count;
          const lost = holeLoss(this.crowd.count);
          this.crowd.setCount(this.crowd.count - lost, {
            sink: true,
            sinkToward: { x: c.x - this.crowd.x, z: c.z - this.crowd.z },
          });
          this.hud.setCount(this.crowd.count);
          this.hud.floatText(`-${lost}`, "#ff6b9a");
          this.sfx.hit();
          this.sfx.pitCrack?.();
          this.crowd.impact("bad");
          this._camImpact(lost, prev);
          this._buzz(26);
          this.particles.pitBurst?.(c.x, 0.05, c.z);
          if (c.mesh) c.mesh.userData.suckT = 0.7;
          this.hud.onTutorialProgress?.("hazard");
          if (this.crowd.count <= 0) this._queueFail("hole");
        });
      }
    }
  }

  _win(hp) {
    this.ended = true;
    this.state = "win";
    const leftover = Math.max(0, this.crowd.count - hp);
    const comboBonus = this.combo * 5;
    const streak = (this.streakAtStart || 0) + 1;
    const coins = runCoinReward({
      leftover,
      levelIndex: this.levelIndex,
      combo: this.combo,
      streak,
      coinMultiplier: this.coinMultiplier,
    });
    const flags = starFlags({
      won: true,
      hazardHitCount: this.hazardHitCount,
      maxCombo: Math.max(this.maxCombo || 0, this.maxComboAchieved || 0),
    });
    const stars = starRating({
      won: true,
      hazardHitCount: this.hazardHitCount,
      maxCombo: Math.max(this.maxCombo || 0, this.maxComboAchieved || 0),
    });
    const levelId = this.level?.id || this.levelIndex + 1;
    const bestStars = writeLevelStars(levelId, stars);
    this.lastReward = coins;
    this.rewardSettled = false;
    this.lastWin = {
      coins,
      leftover,
      crowd: this.crowd.count,
      doorHp: hp,
      stars,
      bestStars,
      flags,
      hazardHitCount: this.hazardHitCount,
      maxCombo: Math.max(this.maxCombo || 0, this.maxComboAchieved || 0),
      levelId,
    };
    this.sfx.smash();
    this.sfx.sandStop?.();
    const door = this.world.colliders.find((c) => c.kind === "finish");
    if (!door?.beast) this.sfx.win();
    this.sfx.coin();
    this.world.smashDoor();
    this.crowd.impact("good");
    if (door?.beast) this.crowd.setEyes("happy", 2.2);
    this.crowd.celebrate = 1.7;
    this._finishSlow = 0.85;
    this.cam.orbit = 0;
    this.camTweens.to(this.cam, "orbit", 1, CAM.victoryOrbit, Ease.quadInOut, () => {
      this.camTweens.to(this.cam, "orbit", 0, 0.45, Ease.quadOut);
    });
    this._feelShake(SHAKE.victory);
    this._buzz(40);
    this.particles.confetti(this.crowd.x, 1.4, this.crowd.z + 1, 28);
    this.particles.burst(this.crowd.x, 1.4, this.crowd.z + 1, 0xffd166, 28, 6);
    this._bloom(0xffe566, 0.32);
    this.hud.burstCoins(coins);
    Analytics.event("level_win", { level: this.levelIndex + 1, coins });
    this.hud.onTutorialProgress?.("win");
    const last = this.isLastLevel();
    Platform.happyTime();
    Platform.gameplayStop();
    this.sfx.startMusic();
    const payload = {
      title: last ? "ALL CLEAR!" : "COMPLETE!",
      subtitle: `+${coins} coins · streak ${streak}${comboBonus ? ` · combo x${this.combo}` : ""}${this.combo >= 20 ? " · 1.25x" : ""}`,
      primary: last ? "Finish" : "Next",
      secondary: "Watch · 2x coins",
      mode: "win",
      stars: this.lastWin.stars,
      bestStars: this.lastWin.bestStars,
      flags: this.lastWin.flags,
      leftover,
      crowd: this.crowd.count,
    };
    window.setTimeout(() => {
      if (this.state === "win") this.hud.showResult(payload);
    }, 2000);
  }

  _queueFail(reason, { wait, lockBeast } = {}) {
    if (this.capture) {
      this._fail(reason);
      return;
    }
    if (this._lossCine || this.ended) return;
    const beast = this.world?.colliders?.find?.((c) => c.beast && (c.fighting || lockBeast || c.introSeen));
    if (beast) this._camLock = { x: beast.x || 0, y: 1.2, z: beast.z };
    else this._camLock = { x: this.crowd.x, y: 0.45, z: this.crowd.z };
    this._lossCine = { t: wait == null ? CAM.lossDur : wait, slow: CAM.lossDur, reason };
    this.camTweens.to(this.cam, "vignette", 1, CAM.lossDur, Ease.quadOut);
    this.hud.setVignette?.(0.2, { pain: true });
  }

  _fail(reason) {
    if (this.capture) {
      this.crowd.setCount(Math.max(22, this.crowd.count + 8));
      this.crowd.impact("land");
      return;
    }
    this.ended = true;
    this.state = "fail";
    this.failReason = reason;
    const finish = this.world.colliders.find((c) => c.kind === "finish");
    const miss = nearMiss({
      reason,
      crowd: this.crowd.count,
      doorHp: finish?.hp || 0,
    });
    this.lastFail = miss;
    this._endBossAudio({ fanfare: false });
    this._lossCine = null;
    this.hud.setVignette?.(1, { pain: true });
    this.sfx.fail();
    this.sfx.startMusic();
    this.crowd.impact(reason === "hole" ? "bad" : "land");
    if (miss.close) this._feelShake(SHAKE.hazard);
    Analytics.event("level_fail", { level: this.levelIndex + 1, reason });
    Platform.gameplayStop();
    this.hud.showResult({
      title: miss.close ? "SO CLOSE" : reason === "door" ? "TOO SMALL" : "FAIL",
      subtitle: miss.line,
      primary: "Again",
      secondary: "Watch · +15 crowd",
      mode: "fail",
    });
  }

  continueWithBurst() {
    this.fight = null;
    this._lossCine = null;
    this.ended = false;
    this._resetCamRig();
    this.hud.setVignette?.(0);
    this.state = "playing";
    this.paused = false;
    this.crowd.setCount(Math.max(this.crowd.count, 0) + 15, { spawnFrom: { x: 0, z: 0.6 } });
    this.crowd.impact("good");
    this._steerX = 0;
    this.crowd.targetX = 0;
    for (const c of this.world.colliders) {
      if (c.kind === "army" || c.kind === "beast") c.fighting = false;
    }
    const finish = this.world.colliders.find((c) => c.kind === "finish");
    if (this.failReason === "door" && finish) {
      finish.used = false;
      if (finish.mesh) finish.mesh.visible = true;
      this.world.setArmyCount(finish, finish.hp || finish.count || 1);
      this.crowd.z = Math.min(this.crowd.z, finish.z - 1.6);
    } else {
      this.crowd.z += 2.4;
    }
    this.failReason = null;
    this.hud.setCount(this.crowd.count);
    this.hud.hideResult();
    this.hud.setPaused(false);
    this.sfx.cutBossLoop?.();
    this.sfx.startMusic();
    this.pendingContinue = false;
    Platform.gameplayStart();
  }

  doubleCoins() {
    if (this.coinMultiplier >= 2) return false;
    this.coinMultiplier = 2;
    this.lastReward = (this.lastReward || 0) * 2;
    if (this.lastWin) this.lastWin.coins = this.lastReward;
    this.hud.setResultSubtitle(`+${this.lastReward} coins`);
    this.hud.burstCoins(this.lastReward);
    this.hud.disableSecondary?.();
    this.sfx.coin();
    return true;
  }
}
