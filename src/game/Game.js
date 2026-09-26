import * as THREE from "three";
import { Crowd } from "./Crowd.js";
import { LevelWorld } from "./LevelWorld.js";
import { applyOp, LEVELS, opLabel } from "../content/levels.js";
import { Sfx, Shake } from "./Juice.js";
import { Analytics } from "./Services.js";
import { Input } from "./Input.js";
import { Particles } from "./Particles.js";
import { canRestart } from "./controls.js";
import { Backdrop } from "./Backdrop.js";
import { Platform } from "../platform/adapter.js";
import { starRating } from "./progress.js";
import { nearMiss } from "./hook.js";

export { canRestart };

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
    this.runTime = 0;
    this.runScore = 0;
    this._shownScore = -1;
    this.shield = false;
    this.combo = 0;
    this.nitroCd = 0;
    this.fight = null;
    this.onCoin = null;
    this.reduceMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;
    this._alive = true;

    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: false,
        powerPreference: "high-performance",
        failIfMajorPerformanceCaveat: false,
        alpha: false,
      });
    } catch {
      const next = canvas.cloneNode(true);
      canvas.replaceWith(next);
      this.canvas = next;
      renderer = new THREE.WebGLRenderer({
        canvas: next,
        antialias: false,
        failIfMajorPerformanceCaveat: false,
      });
    }
    this.renderer = renderer;
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.15));
    this.renderer.setClearColor(0x2b1f78, 1);
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;

    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.Fog(0x241868, 22, 92);
    this.scene.background = new THREE.Color(0x22165e);

    this.camera = new THREE.PerspectiveCamera(54, 9 / 16, 0.1, 160);
    this.baseFov = 54;
    this.shake = new Shake();
    this.sfx = new Sfx();
    this.particles = new Particles(this.scene);
    this.backdrop = new Backdrop(this.scene);
    this.input = new Input();

    this.scene.add(new THREE.HemisphereLight(0xffe6ff, 0x3a2a88, 1.15));
    const key = new THREE.DirectionalLight(0xffffff, 1.15);
    key.position.set(-3, 12, 6);
    this.scene.add(key);
    this.rim = new THREE.PointLight(0x66f0ff, 14, 28);
    this.rim.position.set(0, 4, 4);
    this.scene.add(this.rim);

    this.crowd = new Crowd(this.scene);
    this.world = new LevelWorld(this.scene);
    this.crowd.reset(22);
    this.preview = new THREE.Mesh(
      new THREE.PlaneGeometry(9, 40),
      new THREE.MeshPhongMaterial({
        color: 0x3a2a88,
        emissive: 0x221866,
        emissiveIntensity: 0.35,
        shininess: 18,
      })
    );
    this.preview.rotation.x = -Math.PI / 2;
    this.preview.position.z = 10;
    this.preview.name = "menuFloor";
    this.scene.add(this.preview);

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
    this._resize();
  }

  dispose() {
    this._alive = false;
    cancelAnimationFrame(this.raf);
    this.raf = 0;
    window.removeEventListener("resize", this._onResize);
    document.removeEventListener("visibilitychange", this._onVis);
    this.input.unbind();
    this.sfx.stopMusic();
    this.particles?.dispose();
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
    if (!settings?.muted && this.state === "playing" && !this.ended && !this.paused) {
      this.sfx.startMusic();
    }
  }

  setMuted(muted) {
    this.applyAudio({ muted, music: this.sfx.musicLevel, sfx: this.sfx.sfxLevel });
  }

  _resize() {
    const w = Math.max(1, this.canvas.clientWidth);
    const h = Math.max(1, this.canvas.clientHeight);
    this.renderer.setSize(w, h, false);
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
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
    this.world.build(level);
    this.crowd.reset(level.startCount);
    this.crowd.applySkin(skinId);
    this.skinId = skinId;
    this.ended = false;
    this.paused = false;
    this.state = "playing";
    this.sfx.ensure();
    this.sfx.startMusic();
    Analytics.event("level_start", { level: index + 1 });
    this.hud.setPlaying(true);
    this.hud.setPaused(false);
    this.hud.setCount(this.crowd.count);
    this.hud._countShown = this.crowd.count;
    this.hud._countGoal = this.crowd.count;
    this.hud.setLevel?.(index + 1);
    this.hud.hideToast?.();
    this.boostT = 0;
    this.magnetT = 0;
    this.starT = 0;
    this.runTime = 0;
    this.runScore = 0;
    this._shownScore = -1;
    this.shield = false;
    this.combo = 0;
    this.nitroCd = 0;
    this.fight = null;
    this.camX = 0;
    this.camTilt = 0;
    this._steerX = 0;
    this._finishSlow = 0;
    this.streakAtStart = this.streakAtStart || 0;
    this.rewardSettled = false;
    this.lastWin = null;
    this.lastFail = null;
    this.camera.fov = this.baseFov;
    this.camera.updateProjectionMatrix();
    this.hud.setCombo?.(0);
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
    this.preview.visible = true;
    this.hud.showMenu();
    this.hud.setPaused(false);
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
        this.sfx.stopMusic();
      }
      return;
    }
    this.paused = !this.paused;
    this.hud.setPaused(this.paused);
    if (this.paused) {
      this.sfx.stopMusic();
      Platform.gameplayStop();
    } else {
      this.sfx.startMusic();
      Platform.gameplayStart();
    }
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
    this._steerX += (want - this._steerX) * Math.min(1, dt * 22);
    return this._steerX;
  }

  _buzz(ms) {
    try {
      navigator.vibrate?.(ms);
    } catch {
      /* no haptic */
    }
  }

  tick() {
    if (!this._alive) return;
    const now = performance.now();
    const dt = Math.min(0.033, (now - this.last) / 1000);
    this.last = now;

    const playing = this.state === "playing" && !this.ended && !this.paused;
    this.world.tick(playing ? dt : dt * 0.15, this.reduceMotion, this.crowd.z, this.camera, this.crowd.x);
    this.crowd.applySkin(this.skinId || "lime", now / 1000);

    if (playing) {
      this.boostT = Math.max(0, this.boostT - dt);
      this.magnetT = Math.max(0, this.magnetT - dt);
      this.starT = Math.max(0, this.starT - dt);
      this.nitroCd = Math.max(0, this.nitroCd - dt);
      this.runTime += dt;
      this.crowd.shielded = this.shield;
      this._syncBuffs();
      const lane = this._laneFromInput(dt);
      this.crowd.targetX = lane;
      this.crowd.compress += (this._compressTarget() - this.crowd.compress) * Math.min(1, dt * 7);
      const fighting = !!this.fight;
      this._finishSlow = Math.max(0, this._finishSlow - dt);
      const speed = (fighting ? 1.35 : this._runSpeed()) * (this._finishSlow > 0 ? 0.58 : 1);
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
      });
      this._pullMagnet(dt);
      this.hud.tickCount?.(dt);
      if (this.fight) this._tickFight(dt);
      else {
        this._coachAhead();
        this._collide();
      }
      const finZ = this.world.finishZ || 1;
      this.hud.setProgress?.(this.crowd.z / finZ);
      this.hud.setSpeedFx?.(this.boostT > 0.05, this.combo >= 4);
    } else {
      const winRun = this.state === "win";
      this.crowd.update(dt, this.laneLimit, {
        moving: winRun,
        reduceMotion: this.reduceMotion,
        speed: winRun ? 1.15 : 0,
      });
      this.hud.setSpeedFx?.(false, false);
      this.hud.tickCount?.(dt);
    }

    this.backdrop.tick(dt, this.crowd.z, this.reduceMotion);
    this.particles.update(dt, this.reduceMotion);
    this.rim.position.set(this.crowd.x, 4, this.crowd.z + 4);

    const wantFov = this.baseFov + (this.boostT > 0.05 ? 9 : this.fight ? 4 : Math.min(5, this.runTime * 0.28));
    this.camera.fov += (wantFov - this.camera.fov) * Math.min(1, dt * 7);
    this.camera.updateProjectionMatrix();

    this.camX += (this.crowd.x - this.camX) * Math.min(1, dt * 6.2);
    this.camTilt += (this.crowd.lean * 0.38 - this.camTilt) * Math.min(1, dt * 8);
    const off = this.shake.offset(this.reduceMotion);
    const bob = this.reduceMotion || !(playing || this.state === "win") ? 0 : Math.sin(this.runTime * 8) * 0.03;
    this.camera.position.set(this.camX * 0.38 + off.x, 6.15 + off.y + bob, this.crowd.z - 9.15);
    this.camera.up.set(0, 1, 0);
    this.camera.lookAt(this.camX * 0.22 + this.camTilt * 1.1, 0.62, this.crowd.z + 8.4);
    this.crowd.banner?.lookAt(this.camera.position);
    this.renderer.render(this.scene, this.camera);
    if (!this._alive) return;
    this.raf = requestAnimationFrame(() => this.tick());
  }

  _runSpeed() {
    const fever = 1 + Math.min(0.18, this.combo * 0.04);
    return (8.15 + Math.min(2.2, this.levelIndex * 0.07) + Math.min(1.6, this.runTime * 0.09)) * (this.boostT > 0 ? 1.28 : 1) * fever;
  }

  _compressTarget() {
    const z = this.crowd.z;
    const x = this.crowd.x;
    const tight = this.world.colliders.find(
      (c) =>
        (c.kind === "wall" || c.kind === "saw" || c.kind === "hole" || c.kind === "spinner" || c.kind === "crusher") &&
        !c.used &&
        c.z - z < 5.5 &&
        c.z - z > 0.4 &&
        Math.abs(x - c.x) < (c.width || 1.4) * 0.85
    );
    return tight ? 0.7 : 1;
  }

  _syncBuffs() {
    this.hud.setBuffs?.({
      shield: this.shield,
      boost: this.boostT > 0,
      magnet: this.magnetT > 0,
      star: this.starT > 0,
    });
  }

  _pullMagnet(dt) {
    const z = this.crowd.z;
    const x = this.crowd.x;
    const mag = this.magnetT > 0;
    for (const c of this.world.colliders) {
      if (c.used || c.kind !== "coin") continue;
      const dz = c.z - z;
      if (dz > (mag ? 11 : 2.6) || dz < -1.2) continue;
      if (!mag && Math.abs(c.x - x) > 1.8) continue;
      const k = mag ? 7.5 : 5.2;
      c.x += (x - c.x) * Math.min(1, dt * k);
      c.z += (z + 0.35 - c.z) * Math.min(1, dt * (mag ? 2.4 : 3.2));
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
    this.sfx.gate("mul");
    this.crowd.impact("good");
    this.hud.toast("NITRO");
    this._syncBuffs();
  }

  _absorbOrHit(apply) {
    if (this.shield) {
      this.shield = false;
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

  _beginFight(col, isFinish) {
    if (this.fight || col.used) return;
    col.fighting = true;
    col.charging = false;
    this.fight = {
      col,
      left: Math.max(1, (col.count || col.hp || 1) | 0),
      isFinish: !!isFinish,
      acc: 0,
    };
    this.hud.toast(isFinish ? "FINAL FIGHT" : "FIGHT!");
    this.hud.setFight(this.crowd.count, this.fight.left);
    this.sfx.hit();
    this.shake.punch(this.reduceMotion ? 0.08 : 0.22);
    this._buzz(24);
    this.particles.burst(this.crowd.x, 0.7, this.crowd.z + 0.4, 0xff4d6d, 10, 3.4);
  }

  _tickFight(dt) {
    if (!this.fight || this.ended) return;
    const rate = 9 + this.levelIndex * 0.45;
    this.fight.acc += rate * dt;
    const n = Math.floor(this.fight.acc);
    if (n >= 1) {
      this.fight.acc -= n;
      const take = Math.min(1, this.fight.left, this.crowd.count);
      this.fight.left -= take;
      this.crowd.setCount(this.crowd.count - take, { knock: true });
      this.hud.setCount(this.crowd.count);
      this.world.setArmyCount(this.fight.col, this.fight.left);
      this.hud.setFight(this.crowd.count, this.fight.left);
      this.particles.burst(this.crowd.x + (Math.random() - 0.5) * 0.6, 0.55, this.crowd.z + 0.45, 0xff4d6d, 5, 2.6);
      this.crowd.impact("land");
      this.shake.punch(this.reduceMotion ? 0.03 : 0.11);
    }
    if (this.crowd.count <= 0) {
      const finishFail = this.fight.isFinish;
      this.fight.col.fighting = false;
      this.fight = null;
      this.hud.setFight(0, null);
      this._fail(finishFail ? "door" : "wiped");
      return;
    }
    if (this.fight.left <= 0) {
      const col = this.fight.col;
      const wasFinish = this.fight.isFinish;
      const hp = col.hp || col.count || 1;
      col.used = true;
      col.fighting = false;
      col.regroupT = 0.55;
      this.fight = null;
      this.hud.setFight(0, null);
      this.sfx.gate("mul");
      this.crowd.celebrate = 1.15;
      this.crowd.impact("good");
      this.particles.burst(this.crowd.x, 0.8, this.crowd.z + 0.5, 0xc6ff4a, 12, 4);
      if (wasFinish) this._win(hp);
      else this.hud.toast("WIN");
    }
  }

  isLastLevel() {
    return this.levelIndex >= LEVELS.length - 1;
  }

  _coachAhead() {
    const z = this.crowd.z;
    const hazard = this.world.colliders.find(
      (c) => (c.kind === "wall" || c.kind === "saw" || c.kind === "spinner" || c.kind === "crusher") && !c.used && c.z - z < 9 && c.z - z > 2.2
    );
    if (hazard && !this._dodgeHint) {
      this._dodgeHint = true;
      this.hud.toast(hazard.x >= 0 ? "Swipe LEFT around it" : "Swipe RIGHT around it");
    }
    const finish = this.world.colliders.find((c) => c.kind === "finish");
    if (finish && !this._smashHint && finish.z - z < 11 && finish.z - z > 2 && z > 5) {
      this._smashHint = true;
      this.hud.toast(this.crowd.count >= finish.hp ? "FIGHT — you are bigger" : "Need a bigger army");
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
      if (c.used || c.kind === "finish") continue;
      const zPad =
        c.kind === "coin" || c.kind === "magnet" || c.kind === "star" || c.kind === "grow"
          ? 1.35
          : c.kind === "army"
            ? 2.6
            : 0.7;
      if (z < c.z - zPad || z > c.z + 1.05) continue;

      if (c.kind === "gate") {
        const reach = (c.width || 2.2) * 0.5 + 0.2;
        if (Math.abs(x - c.x) > reach) continue;
        c.used = true;
        for (const other of this.world.colliders) {
          if (other.kind === "gate" && other !== c && Math.abs(other.z - c.z) < 0.05) other.used = true;
        }
        this.crowd.setCount(applyOp(c.op, this.crowd.count, c.value), {
          spawnFrom: { x: c.x - this.crowd.x, z: 0.85 },
          knock: c.op === "sub" || c.op === "div",
        });
        this.hud.setCount(this.crowd.count);
        this.hud.floatText(opLabel(c.op, c.value), c.op === "sub" || c.op === "div" ? "#ff6b9a" : "#c6ff4a");
        this.sfx.gate(c.op);
        const good = c.op === "add" || c.op === "mul";
        this.crowd.impact(good ? "good" : "bad");
        this.shake.punch(this.reduceMotion ? 0.05 : c.op === "mul" ? 0.22 : 0.12);
        this._buzz(good ? 12 : 22);
        this.particles.burst(c.x, 1.1, c.z, good ? 0xc6ff4a : 0xff6b9a, good ? 14 : 9, 4.5);
        if (c.mesh) c.mesh.userData.hitT = 0.28;
        this.hud.onTutorialProgress?.("gate");
        if (good) {
          this.combo += 1;
          this.hud.setCombo?.(this.combo);
          if (this.combo >= 2) this.hud.floatText(`COMBO x${this.combo}`, "#7af7ff");
          if (this.combo === 3) this.onCombo?.();
        } else {
          this.combo = 0;
          this.hud.setCombo?.(0);
        }
        if (c.op === "mul" && !this._mulHint) {
          this._mulHint = true;
          this.hud.toast("Pick the bigger number — then fight");
        }
        if (this.crowd.count <= 0) this._fail("wiped");
      } else if (c.kind === "coin") {
        const reach = this.magnetT > 0 ? 2.35 : 1.5;
        if (Math.abs(x - c.x) > reach) continue;
        c.used = true;
        if (c.mesh) c.mesh.visible = false;
        const amt = Math.floor((c.amount || 6) * (this.starT > 0 ? 2 : 1));
        this.onCoin?.(amt);
        this.hud.burstCoins(amt);
        this.hud.floatText(`+${amt}`, "#ffd166");
        this.particles.burst(c.x, 0.55, c.z, 0xffd166, 12, 3.6);
        this.crowd.squash = Math.max(this.crowd.squash, 1.16);
        this.sfx.coin();
      } else if (c.kind === "boost") {
        if (Math.abs(x - c.x) > 1.45) continue;
        c.used = true;
        if (c.mesh) c.mesh.visible = false;
        this.boostT = Math.max(this.boostT, 1.2);
        this.hud.toast("BOOST");
        this.sfx.gate("mul");
        this.crowd.impact("good");
        this.particles.burst(c.x, 0.6, c.z, 0x7af7ff, 12, 5);
        this._syncBuffs();
      } else if (c.kind === "magnet") {
        if (Math.abs(x - c.x) > 1.5) continue;
        c.used = true;
        if (c.mesh) c.mesh.visible = false;
        this.magnetT = Math.max(this.magnetT, 7.2);
        this.hud.toast("MAGNET");
        this.sfx.gate("mul");
        this.crowd.impact("good");
        this.particles.burst(c.x, 0.7, c.z, 0xc77dff, 14, 5);
        this._syncBuffs();
      } else if (c.kind === "star") {
        if (Math.abs(x - c.x) > 1.5) continue;
        c.used = true;
        if (c.mesh) c.mesh.visible = false;
        this.starT = Math.max(this.starT, 8);
        this.hud.toast("x2 COINS");
        this.sfx.win();
        this.crowd.impact("good");
        this.particles.burst(c.x, 0.7, c.z, 0xffe566, 14, 5);
        this._syncBuffs();
      } else if (c.kind === "grow") {
        if (Math.abs(x - c.x) > 1.5) continue;
        c.used = true;
        if (c.mesh) c.mesh.visible = false;
        const amt = c.amount || 8;
        this.crowd.setCount(this.crowd.count + amt, { spawnFrom: { x: c.x - this.crowd.x, z: 0.4 } });
        this.hud.setCount(this.crowd.count);
        this.hud.toast("GROW");
        this.hud.floatText(`+${amt}`, "#ff6ad5");
        this.sfx.gate("add");
        this.crowd.impact("good");
        this.particles.burst(c.x, 0.7, c.z, 0xff6ad5, 14, 5);
      } else if (c.kind === "shield") {
        if (Math.abs(x - c.x) > 1.45) continue;
        c.used = true;
        if (c.mesh) c.mesh.visible = false;
        this.shield = true;
        this.hud.toast("SHIELD");
        this.sfx.win();
        this.crowd.impact("good");
        this.particles.burst(c.x, 0.8, c.z, 0x66f0ff, 12, 4);
        this._syncBuffs();
      } else if (c.kind === "army") {
        if (Math.abs(x - c.x) > 2.5) continue;
        this._beginFight(c, false);
        return;
      } else if (c.kind === "saw" || c.kind === "wall" || c.kind === "spinner" || c.kind === "crusher") {
        if (Math.abs(x - c.x) > c.width * 0.62 + this.crowd.radius() * 0.38) continue;
        c.used = true;
        if (c.mesh) c.mesh.userData.hitT = 0.22;
        this.combo = 0;
        this.hud.setCombo?.(0);
        this._absorbOrHit(() => {
          this.crowd.setCount(this.crowd.count - (c.damage || 3), { knock: true });
          this.hud.setCount(this.crowd.count);
          this.hud.floatText(`-${c.damage || 3}`, "#ff6b9a");
          this.sfx.hit();
          this.crowd.impact("bad");
          this.shake.punch(this.reduceMotion ? 0.08 : 0.26);
          this._buzz(30);
          this.particles.burst(c.x, 0.8, c.z, 0xff4d6d, 12, 4);
          this.hud.onTutorialProgress?.("hazard");
          if (this.crowd.count <= 0) this._fail("hazard");
        });
      } else if (c.kind === "hole") {
        if (Math.abs(x - c.x) > c.width * 0.52) continue;
        c.used = true;
        this.combo = 0;
        this.hud.setCombo?.(0);
        this._absorbOrHit(() => {
          const lost = Math.max(2, Math.floor(this.crowd.count * 0.3));
          this.crowd.setCount(this.crowd.count - lost, {
            sink: true,
            sinkToward: { x: c.x - this.crowd.x, z: c.z - this.crowd.z },
          });
          this.hud.setCount(this.crowd.count);
          this.hud.floatText(`-${lost}`, "#ff6b9a");
          this.sfx.hit();
          this.crowd.impact("bad");
          this.shake.punch(this.reduceMotion ? 0.08 : 0.22);
          this._buzz(26);
          this.particles.burst(c.x, 0.15, c.z, 0x4a2a88, 14, 2.2);
          if (c.mesh) c.mesh.userData.suckT = 0.7;
          this.hud.onTutorialProgress?.("hazard");
          if (this.crowd.count <= 0) this._fail("hole");
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
    const coins = (Math.max(8, 10 + leftover + this.levelIndex) + comboBonus + streak * 4) * this.coinMultiplier;
    this.lastReward = coins;
    this.rewardSettled = false;
    this.lastWin = {
      coins,
      leftover,
      crowd: this.crowd.count,
      doorHp: hp,
      stars: starRating({ leftover, doorHp: hp }),
    };
    this.sfx.smash();
    this.sfx.win();
    this.sfx.coin();
    this.world.smashDoor();
    this.crowd.impact("good");
    this.crowd.celebrate = 1.7;
    this._finishSlow = 0.85;
    this.shake.punch(this.reduceMotion ? 0.1 : 0.4);
    this._buzz(40);
    this.particles.burst(this.crowd.x, 1.4, this.crowd.z + 1, 0xffd166, 28, 6);
    this.hud.burstCoins(coins);
    Analytics.event("level_win", { level: this.levelIndex + 1, coins });
    this.hud.onTutorialProgress?.("win");
    const last = this.isLastLevel();
    Platform.happyTime();
    Platform.gameplayStop();
    const payload = {
      title: last ? "ALL CLEAR!" : "COMPLETE!",
      subtitle: `+${coins} coins · streak ${streak}${comboBonus ? ` · combo x${this.combo}` : ""}`,
      primary: last ? "Finish" : "Next",
      secondary: "Watch · 2x coins",
      mode: "win",
      stars: this.lastWin.stars,
      leftover,
      crowd: this.crowd.count,
    };
    window.setTimeout(() => {
      if (this.state === "win") this.hud.showResult(payload);
    }, 620);
  }

  _fail(reason) {
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
    this.sfx.fail();
    this.crowd.impact(reason === "hole" ? "bad" : "land");
    if (miss.close) this.shake.punch(this.reduceMotion ? 0.08 : 0.22);
    Analytics.event("level_fail", { level: this.levelIndex + 1, reason });
    Platform.gameplayStop();
    this.hud.showResult({
      title: miss.close ? "SO CLOSE" : reason === "door" ? "TOO SMALL" : "FAIL",
      subtitle: `${miss.line} · AGAIN`,
      primary: "Again",
      secondary: "Watch · +15 crowd",
      mode: "fail",
    });
  }

  continueWithBurst() {
    this.fight = null;
    this.ended = false;
    this.state = "playing";
    this.paused = false;
    this.crowd.setCount(Math.max(this.crowd.count, 0) + 15, { spawnFrom: { x: 0, z: 0.6 } });
    this.crowd.impact("good");
    const finish = this.world.colliders.find((c) => c.kind === "finish");
    if (finish) {
      finish.used = false;
      if (finish.mesh) finish.mesh.visible = true;
      this.world.setArmyCount(finish, finish.hp || finish.count || 1);
      this.crowd.z = Math.min(this.crowd.z, finish.z - 1.25);
    }
    this.hud.setCount(this.crowd.count);
    this.hud.hideResult();
    this.hud.setPaused(false);
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
