import * as THREE from "three";
import { Crowd } from "./Crowd.js";
import { LevelWorld } from "./LevelWorld.js";
import { applyOp, LEVELS } from "../content/levels.js";
import { Sfx, Shake } from "./Juice.js";
import { Analytics } from "./Services.js";
import { Input } from "./Input.js";
import { Particles } from "./Particles.js";
import { canRestart } from "./controls.js";
import { Backdrop } from "./Backdrop.js";

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
    this.shield = false;
    this.combo = 0;
    this.nitroCd = 0;
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
    this.renderer.setPixelRatio(Math.min(devicePixelRatio, 1.25));
    this.renderer.setClearColor(0x2b1f78, 1);
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;

    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.Fog(0x352888, 24, 58);
    this.scene.background = new THREE.Color(0x2b1f78);

    this.camera = new THREE.PerspectiveCamera(54, 9 / 16, 0.1, 90);
    this.baseFov = 54;
    this.shake = new Shake();
    this.sfx = new Sfx();
    this.particles = new Particles(this.scene);
    this.backdrop = new Backdrop(this.scene);
    this.input = new Input();

    this.scene.add(new THREE.HemisphereLight(0xffe6ff, 0x3a2a88, 1.25));
    const key = new THREE.DirectionalLight(0xffffff, 1.35);
    key.position.set(-3, 12, 6);
    this.scene.add(key);
    this.rim = new THREE.PointLight(0x66f0ff, 22, 32);
    this.rim.position.set(0, 4, 4);
    this.scene.add(this.rim);
    const fill = new THREE.PointLight(0xff66cc, 10, 26);
    fill.position.set(3, 5, 2);
    this.scene.add(fill);

    this.crowd = new Crowd(this.scene);
    this.world = new LevelWorld(this.scene);
    this.crowd.reset(22);
    this.preview = new THREE.Mesh(
      new THREE.PlaneGeometry(9, 40),
      new THREE.MeshStandardMaterial({
        color: 0x4a3ab8,
        emissive: 0x221866,
        emissiveIntensity: 0.4,
        roughness: 0.6,
      })
    );
    this.preview.rotation.x = -Math.PI / 2;
    this.preview.position.z = 10;
    this.preview.name = "menuFloor";
    this.scene.add(this.preview);

    this.laneLimit = 3.15;
    this.grabPointerX = 0;
    this.grabLane = 0;
    this.last = performance.now();
    this.capture = new URLSearchParams(location.search).has("capture");
    this.raf = 0;
    this._onResize = () => this._resize();

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
    this._resize();
  }

  dispose() {
    this._alive = false;
    cancelAnimationFrame(this.raf);
    this.raf = 0;
    window.removeEventListener("resize", this._onResize);
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

  setMuted(muted) {
    this.sfx.setMuted(muted);
    if (!muted && this.state === "playing" && !this.ended && !this.paused) {
      this.sfx.startMusic();
    }
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
    this.hud.setLevel?.(index + 1);
    this.hud.hideToast?.();
    this.boostT = 0;
    this.shield = false;
    this.combo = 0;
    this.nitroCd = 0;
    this.camera.fov = this.baseFov;
    this.camera.updateProjectionMatrix();
    this.hud.setCombo?.(0);
    this.hud.setBuffs?.({ shield: false, boost: false });
  }

  goMenu() {
    this.state = "menu";
    this.paused = false;
    this.ended = true;
    this.preview.visible = true;
    this.hud.showMenu();
    this.hud.setPaused(false);
    this.sfx.startMusic();
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
    if (this.paused) this.sfx.stopMusic();
    else this.sfx.startMusic();
  }

  requestRestart() {
    if (!canRestart(this.state, this.ended, this.paused)) return;
    this.hud.onRestartRequest?.();
  }

  _laneFromInput(dt) {
    const axis = this.input.steerAxis();
    if (axis !== 0) {
      this.movedEnough = true;
      return THREE.MathUtils.clamp(this.crowd.targetX + axis * 18 * dt, -this.laneLimit, this.laneLimit);
    }
    if (this.input.dragging) {
      const rect = this.canvas.getBoundingClientRect();
      const dx = (this.input.pointerX - this.grabPointerX) / Math.max(1, rect.width);
      this.movedEnough = true;
      return THREE.MathUtils.clamp(this.grabLane + dx * this.laneLimit * 3.15, -this.laneLimit, this.laneLimit);
    }
    return null;
  }

  tick() {
    if (!this._alive) return;
    const now = performance.now();
    const dt = Math.min(0.033, (now - this.last) / 1000);
    this.last = now;

    const playing = this.state === "playing" && !this.ended && !this.paused;
    this.world.tick(playing ? dt : dt * 0.15, this.reduceMotion, this.crowd.z);
    this.crowd.applySkin(this.skinId || "lime", now / 1000);

    if (playing) {
      this.boostT = Math.max(0, this.boostT - dt);
      this.nitroCd = Math.max(0, this.nitroCd - dt);
      this.crowd.shielded = this.shield;
      this.hud.setBuffs?.({ shield: this.shield, boost: this.boostT > 0 });
      const lane = this._laneFromInput(dt);
      if (lane != null) this.crowd.targetX = lane;
      this.crowd.update(dt, this.laneLimit, {
        moving: true,
        reduceMotion: this.reduceMotion,
        speed: this._runSpeed(),
      });
      this._coachAhead();
      this._collide();
    } else {
      this.crowd.update(dt, this.laneLimit, { moving: false, reduceMotion: this.reduceMotion, speed: 0 });
    }

    this.backdrop.tick(dt, this.crowd.z, this.reduceMotion);
    this.particles.update(dt, this.reduceMotion);
    this.rim.position.set(this.crowd.x, 4, this.crowd.z + 4);

    const wantFov = this.baseFov + (this.boostT > 0.05 ? 7 : 0);
    this.camera.fov += (wantFov - this.camera.fov) * Math.min(1, dt * 8);
    this.camera.updateProjectionMatrix();

    const off = this.shake.offset(this.reduceMotion);
    this.camera.position.set(this.crowd.x * 0.34 + off.x, 4.85 + off.y, this.crowd.z - 6.85);
    this.camera.lookAt(this.crowd.x * 0.22, 0.55, this.crowd.z + 6.2);
    this.renderer.render(this.scene, this.camera);
    if (!this._alive) return;
    this.raf = requestAnimationFrame(() => this.tick());
  }

  _runSpeed() {
    return (6.9 + Math.min(3.5, this.levelIndex * 0.07)) * (this.boostT > 0 ? 1.58 : 1);
  }

  tryNitro() {
    if (this.state !== "playing" || this.ended || this.paused) return;
    if (this.nitroCd > 0) return;
    this.nitroCd = 0.9;
    this.boostT = Math.max(this.boostT, 0.9);
    this.sfx.gate("mul");
    this.crowd.impact("good");
    this.hud.toast("NITRO");
    this.hud.setBuffs?.({ shield: this.shield, boost: true });
  }

  _absorbOrHit(apply) {
    if (this.shield) {
      this.shield = false;
      this.hud.toast("SHIELD BROKE");
      this.crowd.impact("land");
      this.sfx.ui();
      this.hud.setBuffs?.({ shield: false, boost: this.boostT > 0 });
      this.shake.punch(this.reduceMotion ? 0.05 : 0.18);
      return true;
    }
    apply();
    return false;
  }

  isLastLevel() {
    return this.levelIndex >= LEVELS.length - 1;
  }

  _coachAhead() {
    const z = this.crowd.z;
    const hazard = this.world.colliders.find(
      (c) => (c.kind === "wall" || c.kind === "saw") && !c.used && c.z - z < 9 && c.z - z > 2.2
    );
    if (hazard && !this._dodgeHint) {
      this._dodgeHint = true;
      this.hud.toast(hazard.x >= 0 ? "Swipe LEFT around it" : "Swipe RIGHT around it");
    }
    const finish = this.world.colliders.find((c) => c.kind === "finish");
    if (finish && !this._smashHint && finish.z - z < 11 && finish.z - z > 2 && z > 5) {
      this._smashHint = true;
      this.hud.toast(this.crowd.count >= finish.hp ? "CRASH THE DOOR" : "Need a bigger crowd");
    }
  }

  _collide() {
    if (this.ended) return;
    const z = this.crowd.z;
    const x = this.crowd.x;
    const finish = this.world.colliders.find((c) => c.kind === "finish");
    if (finish && !finish.used && z >= finish.z - 0.45) {
      finish.used = true;
      if (this.crowd.count >= finish.hp) this._win(finish.hp);
      else this._fail("door");
      return;
    }

    for (const c of this.world.colliders) {
      if (this.ended) return;
      if (c.used || c.kind === "finish") continue;
      if (z < c.z - 0.7 || z > c.z + 0.9) continue;

      if (c.kind === "gate") {
        const reach = (c.width || 2.2) * 0.5 + 0.2;
        if (Math.abs(x - c.x) > reach) continue;
        c.used = true;
        for (const other of this.world.colliders) {
          if (other.kind === "gate" && other !== c && Math.abs(other.z - c.z) < 0.05) other.used = true;
        }
        this.crowd.setCount(applyOp(c.op, this.crowd.count, c.value));
        this.hud.setCount(this.crowd.count);
        this.hud.floatText(opLabelSafe(c.op, c.value), c.op === "sub" || c.op === "div" ? "#ff6b9a" : "#c6ff4a");
        this.sfx.gate(c.op);
        const good = c.op === "add" || c.op === "mul";
        this.crowd.impact(good ? "good" : "bad");
        this.shake.punch(this.reduceMotion ? 0.06 : c.op === "mul" ? 0.28 : 0.16);
        this.particles.burst(c.x, 1.1, c.z, good ? 0xc6ff4a : 0xff6b9a, 10, 4);
        if (c.mesh) c.mesh.scale.set(1.2, 1.2, 1.2);
        this.hud.onTutorialProgress?.("gate");
        if (good) {
          this.combo += 1;
          this.hud.setCombo?.(this.combo);
          if (this.combo >= 2) this.hud.floatText(`COMBO x${this.combo}`, "#7af7ff");
        } else {
          this.combo = 0;
          this.hud.setCombo?.(0);
        }
        if (c.op === "mul" && !this._mulHint) {
          this._mulHint = true;
          this.hud.toast("Keep going — crash the gold door");
        }
        if (this.crowd.count <= 0) this._fail("wiped");
      } else if (c.kind === "coin") {
        if (Math.abs(x - c.x) > 1.05) continue;
        c.used = true;
        if (c.mesh) c.mesh.visible = false;
        const amt = c.amount || 6;
        this.onCoin?.(amt);
        this.hud.burstCoins(amt);
        this.hud.floatText(`+${amt}`, "#ffd166");
        this.sfx.coin();
      } else if (c.kind === "boost") {
        if (Math.abs(x - c.x) > 1.15) continue;
        c.used = true;
        if (c.mesh) c.mesh.visible = false;
        this.boostT = Math.max(this.boostT, 1.35);
        this.hud.toast("BOOST");
        this.sfx.gate("mul");
        this.crowd.impact("good");
        this.particles.burst(c.x, 0.6, c.z, 0x7af7ff, 12, 5);
      } else if (c.kind === "shield") {
        if (Math.abs(x - c.x) > 1.15) continue;
        c.used = true;
        if (c.mesh) c.mesh.visible = false;
        this.shield = true;
        this.hud.toast("SHIELD");
        this.sfx.win();
        this.crowd.impact("good");
        this.particles.burst(c.x, 0.8, c.z, 0x66f0ff, 12, 4);
      } else if (c.kind === "saw" || c.kind === "wall") {
        if (Math.abs(x - c.x) > c.width * 0.55 + this.crowd.radius() * 0.35) continue;
        c.used = true;
        this.combo = 0;
        this.hud.setCombo?.(0);
        this._absorbOrHit(() => {
          this.crowd.setCount(this.crowd.count - (c.damage || 3));
          this.hud.setCount(this.crowd.count);
          this.hud.floatText(`-${c.damage || 3}`, "#ff6b9a");
          this.sfx.hit();
          this.crowd.impact("bad");
          this.shake.punch(this.reduceMotion ? 0.08 : 0.3);
          this.particles.burst(c.x, 0.8, c.z, 0xff4d6d, 8, 3.5);
          this.hud.onTutorialProgress?.("hazard");
          if (this.crowd.count <= 0) this._fail("hazard");
        });
      } else if (c.kind === "hole") {
        if (Math.abs(x - c.x) > c.width * 0.5) continue;
        c.used = true;
        this.combo = 0;
        this.hud.setCombo?.(0);
        this._absorbOrHit(() => {
          const lost = Math.max(2, Math.floor(this.crowd.count * 0.3));
          this.crowd.setCount(this.crowd.count - lost);
          this.hud.setCount(this.crowd.count);
          this.hud.floatText(`-${lost}`, "#ff6b9a");
          this.sfx.hit();
          this.crowd.impact("bad");
          this.particles.burst(c.x, 0.2, c.z, 0x3df2ff, 10, 2.5);
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
    const comboBonus = this.combo * 3;
    const coins = (Math.max(8, 10 + leftover + this.levelIndex) + comboBonus) * this.coinMultiplier;
    this.lastReward = coins;
    this.sfx.smash();
    this.sfx.win();
    this.sfx.coin();
    this.world.smashDoor();
    this.crowd.impact("good");
    this.shake.punch(this.reduceMotion ? 0.1 : 0.45);
    this.particles.burst(this.crowd.x, 1.4, this.crowd.z + 1, 0xffd166, 28, 6);
    this.hud.burstCoins(coins);
    Analytics.event("level_win", { level: this.levelIndex + 1, coins });
    this.hud.onTutorialProgress?.("win");
    const last = this.isLastLevel();
    this.hud.showResult({
      title: last ? "ALL CLEAR!" : "COMPLETE!",
      subtitle: comboBonus ? `+${coins} coins · combo x${this.combo}` : `+${coins} coins`,
      primary: last ? "Finish" : "Next",
      secondary: "Watch · 2x coins",
      mode: "win",
    });
  }

  _fail(reason) {
    this.ended = true;
    this.state = "fail";
    this.failReason = reason;
    this.sfx.fail();
    this.crowd.impact(reason === "hole" ? "bad" : "land");
    Analytics.event("level_fail", { level: this.levelIndex + 1, reason });
    this.hud.showResult({
      title: reason === "door" ? "TOO SMALL" : "FAIL",
      subtitle: "Retry or watch for +15 crowd",
      primary: "Retry",
      secondary: "Watch · +15 crowd",
      mode: "fail",
    });
  }

  continueWithBurst() {
    this.ended = false;
    this.state = "playing";
    this.paused = false;
    this.crowd.setCount(Math.max(this.crowd.count, 0) + 15);
    this.crowd.impact("good");
    const finish = this.world.colliders.find((c) => c.kind === "finish");
    if (finish) {
      finish.used = false;
      this.crowd.z = Math.min(this.crowd.z, finish.z - 1.25);
    }
    this.hud.setCount(this.crowd.count);
    this.hud.hideResult();
    this.hud.setPaused(false);
    this.sfx.startMusic();
    this.pendingContinue = false;
  }

  doubleCoins() {
    if (this.coinMultiplier >= 2) return false;
    this.coinMultiplier = 2;
    this.lastReward = (this.lastReward || 0) * 2;
    this.hud.setResultSubtitle(`+${this.lastReward} coins`);
    this.hud.burstCoins(this.lastReward);
    this.hud.disableSecondary?.();
    this.sfx.coin();
    return true;
  }
}

function opLabelSafe(op, value) {
  if (op === "add") return `+${value}`;
  if (op === "sub") return `-${value}`;
  if (op === "mul") return `x${value}`;
  if (op === "div") return `÷${value}`;
  return "";
}
