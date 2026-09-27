import { WEATHER_AUDIO, windGain } from "./CloudSystem.js";

export const MUSIC_GAIN = 0.3162; // world bed −10 dB vs SFX
export const WORLD_BOSS_DUCK = 0.7079; // world music −3 dB while boss bed plays
export const MUSIC_BOSS_MUL = 1 / WORLD_BOSS_DUCK; // boss bed stays unducked vs world

export const SHAKE = {
  hazard: { px: 5, hz: 8, dur: 0.18 },
  combo10: { px: 4, hz: 7, dur: 0.22 },
  warden: { px: 7, hz: 10, dur: 0.28 },
  victory: { px: 6, hz: 5, dur: 0.5 },
  slam: { px: 9, hz: 12, dur: 0.26 },
};

/** Per-event camera / debris. Particle counts stay under MAX_PARTICLES. */
export const FEEL = {
  gateGood: { shake: null, hex: 0x2ec8d4, n: 10 },
  gateBad: { shake: SHAKE.hazard, hex: 0xd1262e, n: 8 },
  saw: { shake: SHAKE.hazard, hex: 0xb8c4cc, n: 12 },
  slam: { shake: SHAKE.slam, hex: 0x8a9098, n: 14, wood: 0x6a4a28 },
  sepoy: { shake: { px: 4, hz: 9, dur: 0.14 }, hex: 0xe0b86a, n: 8, slime: 0x2ec8d4 },
  warden: { shake: SHAKE.warden, hex: 0xf0c878, n: 10, slime: 0x2ec8d4 },
};
export const BOSS_FIGHT = { bpm: 116, introMs: 2500, slow: 0.5, fanfare: 4.2 };

export const WORLD_TRACKS = {
  meadow: { id: "meadow", bpm: 90, style: "meadow" },
  dunes: { id: "dunes", bpm: 100, style: "dunes" },
  frost: { id: "frost", bpm: 100, style: "frost" },
  grove: { id: "grove", bpm: 105, style: "grove" },
  ember: { id: "ember", bpm: 110, style: "ember" },
  amber: { id: "amber", bpm: 108, style: "ember" },
  lagoon: { id: "lagoon", bpm: 100, style: "grove" },
  prism: { id: "prism", bpm: 102, style: "frost" },
  nightfen: { id: "nightfen", bpm: 88, style: "grove" },
  highwake: { id: "highwake", bpm: 102, style: "dunes" },
  crown: { id: "crown", bpm: 80, style: "crown" },
};

export function trackForWorld(id) {
  return WORLD_TRACKS[id] || WORLD_TRACKS.meadow;
}

export const GATE_SFX = {
  add: { from: 440, to: 554, dur: 0.3, gain: 0.12 },
  mul: { freq: 880, dur: 0.25, gain: 0.095 },
  sub: { from: 440, to: 220, dur: 0.4, gain: 0.06 },
  div: { from: 440, to: 220, dur: 0.4, gain: 0.055 },
};

export const COMBO_SFX = {
  5: { notes: [440], dur: 0.1 },
  10: { notes: [440, 554], dur: 0.2 },
  20: { notes: [440, 554, 659], step: 0.1, dur: 0.3 },
};

export const MAX_AUDIO_SOURCES = 8;

/** Linear gains vs a 0.1 reference. −3 dB saw, −2 dB spinner, ±3 dB hot/cool. */
export const HAZARD_SFX = {
  maxVoices: 6,
  sawGain: 0.0708,
  spinnerGain: 0.0794,
  slideGain: 0.018,
  hotMul: 1.4125,
  coolMul: 0.7079,
  holeHz: 80,
  holeGain: 0.09,
  geyserColdGain: 0.05,
  geyserHotGain: 0.12,
};

export const PIT_HAZARD = {
  holeLoss: 0.3,
  geyserLoss: 0.1,
  rumbleHz: 80,
  geyserPeriod: 3,
};

export function holeLoss(n) {
  return Math.max(2, Math.floor(Math.max(0, n | 0) * PIT_HAZARD.holeLoss));
}

export function geyserLoss(n) {
  return Math.max(1, Math.ceil(Math.max(0, n | 0) * PIT_HAZARD.geyserLoss));
}

export function hazardPitch(kind, speed = 8, dist = 10) {
  const s = Math.max(0.4, Number(speed) || 8);
  if (kind === "hole") return Math.max(48, HAZARD_SFX.holeHz - Math.max(0, 12 - dist) * 2.4);
  if (kind === "geyser") return 280;
  if (kind === "spinner") return 150 + s * 22;
  return 300 + s * 48;
}

export function nearestHazards(items, max = HAZARD_SFX.maxVoices) {
  return (items || [])
    .filter((h) => h && h.alive !== false && h.dist < 22)
    .sort((a, b) => a.dist - b.dist)
    .slice(0, max);
}

export class Sfx {
  constructor() {
    this.ctx = null;
    this.master = null;
    this.muted = false;
    this.musicLevel = 0.7;
    this.sfxLevel = 1;
    this._musicOn = false;
    this._musicGain = null;
    this._musicTimer = 0;
    this._nextNote = 0;
    this._step = 0;
    this._bpm = 90;
    this._noise = null;
    this.stormAmbience = false;
    this._worldTrack = "meadow";
    this._style = "meadow";
    this._padNodes = [];
    this._fadeTimer = 0;
    this._bossLoop = false;
    this._bossBus = null;
    this._bossPads = [];
    this._hazVoices = new Map();
    this._oneshot = 0;
    this._preloaded = false;
  }

  setMuted(muted) {
    this.setMix({ muted });
  }

  setMix({ muted = this.muted, music = this.musicLevel, sfx = this.sfxLevel } = {}) {
    this.muted = !!muted;
    this.musicLevel = Math.min(1, Math.max(0, Number(music) || 0));
    this.sfxLevel = Math.min(1, Math.max(0, Number(sfx) || 0));
    if (this.master) this.master.gain.value = this.muted ? 0 : 1;
    if (this._musicGain) {
      const mul = this._bossLoop ? WORLD_BOSS_DUCK : 1;
      this._musicGain.gain.value = this.muted ? 0.0001 : Math.max(0.0001, this.musicLevel * MUSIC_GAIN * mul);
    }
    if (this._bossBus) {
      this._bossBus.gain.value = this.muted ? 0.0001 : Math.max(0.0001, this.musicLevel * MUSIC_GAIN);
    }
    if (this.muted) {
      this.stopMusic();
      this.stopHazards();
      this.stopWeatherAmbience();
    } else if (this._wxKind) this.setWeatherAmbience(this._wxKind, { rain: this._wxRain });
  }

  ensure() {
    if (!this.ctx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      this.ctx = new AC();
      this.master = this.ctx.createGain();
      this.master.gain.value = this.muted ? 0 : 1;
      this.master.connect(this.ctx.destination);
      this._noise = this.ctx.createBuffer(1, this.ctx.sampleRate * 0.4, this.ctx.sampleRate);
      const data = this._noise.getChannelData(0);
      for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
    }
    if (this.ctx.state === "suspended") this.ctx.resume();
    return this.ctx;
  }

  _sfxBusy() {
    return this._oneshot + (this._hazVoices?.size || 0) >= MAX_AUDIO_SOURCES;
  }

  _holdOne(dur) {
    this._oneshot += 1;
    const ms = Math.max(30, (Number(dur) || 0.12) * 1000 + 20);
    setTimeout(() => {
      this._oneshot = Math.max(0, this._oneshot - 1);
    }, ms);
  }

  tone(freq, dur, type = "sine", gain = 0.08, extra = {}) {
    if (this.muted) return;
    if (this._sfxBusy()) return;
    const ctx = this.ensure();
    if (!ctx || !this.master) return;
    this._holdOne(dur);
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = type;
    o.frequency.value = freq;
    g.gain.value = Math.max(0.0008, gain * this.sfxLevel);
    g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + dur);
    o.connect(g);
    const panAmt = extra.pan;
    if (typeof panAmt === "number" && ctx.createStereoPanner) {
      const pan = ctx.createStereoPanner();
      pan.pan.value = Math.max(-1, Math.min(1, panAmt));
      g.connect(pan);
      pan.connect(this.master);
    } else g.connect(this.master);
    o.start();
    o.stop(ctx.currentTime + dur);
  }

  boot() {
    const ctx = this.ensure();
    if (!ctx || this._preloaded) return;
    this._preloaded = true;
    const freqs = [80, 150, 220, 440, 554, 659, 880];
    const now = ctx.currentTime;
    for (const f of freqs) {
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      g.gain.value = 0.0001;
      o.frequency.value = f;
      o.connect(g);
      g.connect(this.master);
      o.start(now);
      o.stop(now + 0.03);
    }
  }

  _slide(from, to, dur, type = "sine", gain = 0.08, extra = {}) {
    if (this.muted) return;
    if (this._sfxBusy()) return;
    const ctx = this.ensure();
    if (!ctx || !this.master) return;
    this._holdOne(dur);
    const now = ctx.currentTime;
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = type;
    o.frequency.setValueAtTime(Math.max(20, from), now);
    o.frequency.exponentialRampToValueAtTime(Math.max(20, to), now + dur);
    const amp = Math.max(0.0008, gain * this.sfxLevel);
    g.gain.setValueAtTime(amp, now);
    g.gain.exponentialRampToValueAtTime(0.001, now + dur);
    let node = o;
    if (extra.lowpass) {
      const f = ctx.createBiquadFilter();
      f.type = "lowpass";
      f.frequency.value = extra.lowpass;
      o.connect(f);
      node = f;
    }
    if (extra.wobble) {
      const lfo = ctx.createOscillator();
      const lg = ctx.createGain();
      lfo.frequency.value = 14;
      lg.gain.value = 55;
      lfo.connect(lg);
      lg.connect(o.frequency);
      lfo.start(now);
      lfo.stop(now + dur);
    }
    node.connect(g);
    g.connect(this.master);
    if (extra.delay) {
      const d = ctx.createDelay();
      d.delayTime.value = 0.08;
      const fb = ctx.createGain();
      fb.gain.value = 0.32;
      g.connect(d);
      d.connect(fb);
      fb.connect(d);
      d.connect(this.master);
    }
    o.start(now);
    o.stop(now + dur);
  }

  ui() {
    this.tone(640, 0.05, "sine", 0.04);
  }

  coin(hot = false) {
    const a = hot ? 1174 : 880;
    const b = hot ? 1480 : 1174;
    this.tone(a, 0.08, "sine", 0.055);
    setTimeout(() => this.tone(b, 0.1, "sine", 0.045), 45);
  }

  pickupBoost() {
    this.whoosh();
    this.tone(980, 0.1, "sine", 0.07);
  }

  relief() {
    this.tone(523, 0.08, "sine", 0.04);
    setTimeout(() => this.tone(784, 0.1, "triangle", 0.03), 40);
  }

  growl(intense = false) {
    this.sandBite(!!intense);
  }

  sandStart() {
    if (this.muted || this._sandOn) {
      if (!this.muted && this._sandGain && this.ctx) {
        const now = this.ctx.currentTime;
        this._sandGain.gain.cancelScheduledValues(now);
        this._sandGain.gain.setValueAtTime(Math.max(0.0001, this._sandGain.gain.value), now);
        this._sandGain.gain.exponentialRampToValueAtTime(0.11 * this.sfxLevel, now + 0.08);
      }
      return;
    }
    const ctx = this.ensure();
    if (!ctx || !this.master) return;
    this._sandOn = true;
    const osc = ctx.createOscillator();
    osc.type = "sawtooth";
    osc.frequency.value = 42;
    const lfo = ctx.createOscillator();
    lfo.type = "sine";
    lfo.frequency.value = 7;
    const lfoGain = ctx.createGain();
    lfoGain.gain.value = 8;
    lfo.connect(lfoGain);
    lfoGain.connect(osc.frequency);
    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 220;
    filter.Q.value = 0.7;
    const noise = ctx.createBufferSource();
    if (this._noise) {
      noise.buffer = this._noise;
      noise.loop = true;
    }
    const nf = ctx.createBiquadFilter();
    nf.type = "lowpass";
    nf.frequency.value = 280;
    const gain = ctx.createGain();
    gain.gain.value = 0.0001;
    osc.connect(filter);
    filter.connect(gain);
    if (this._noise) {
      noise.connect(nf);
      nf.connect(gain);
    }
    gain.connect(this.master);
    osc.start();
    lfo.start();
    try {
      noise.start();
    } catch {
      /* no buffer */
    }
    gain.gain.exponentialRampToValueAtTime(0.12 * this.sfxLevel, ctx.currentTime + 0.12);
    this._sandOsc = osc;
    this._sandLfo = lfo;
    this._sandNoise = noise;
    this._sandGain = gain;
  }

  sandStop() {
    if (!this._sandOn) return;
    this._sandOn = false;
    const ctx = this.ctx;
    const gain = this._sandGain;
    const stopAt = (ctx?.currentTime || 0) + 0.18;
    if (gain && ctx) {
      gain.gain.cancelScheduledValues(ctx.currentTime);
      gain.gain.setValueAtTime(Math.max(0.0001, gain.gain.value), ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, stopAt);
    }
    const kill = () => {
      try {
        this._sandOsc?.stop();
      } catch {
        /* already */
      }
      try {
        this._sandLfo?.stop();
      } catch {
        /* already */
      }
      try {
        this._sandNoise?.stop();
      } catch {
        /* already */
      }
      this._sandOsc = null;
      this._sandLfo = null;
      this._sandNoise = null;
      this._sandGain = null;
    };
    setTimeout(kill, 220);
  }

  sandBite(hot = false) {
    if (this.muted) return;
    const ctx = this.ensure();
    if (!ctx || !this.master) return;
    const now = ctx.currentTime;
    const o = ctx.createOscillator();
    o.type = "sawtooth";
    o.frequency.value = hot ? 68 : 52;
    const g = ctx.createGain();
    g.gain.value = (hot ? 0.16 : 0.11) * this.sfxLevel;
    g.gain.exponentialRampToValueAtTime(0.001, now + (hot ? 0.28 : 0.2));
    o.connect(g);
    g.connect(this.master);
    o.start(now);
    o.stop(now + 0.3);
    this._noiseBurst("lowpass", hot ? 320 : 200, hot ? 0.22 : 0.16, hot ? 0.14 : 0.1, 0.015);
  }

  pickupGrow() {
    this._slide(392, 784, 0.24, "sine", 0.07);
  }

  pickupMagnet() {
    this.tone(168, 0.42, "sine", 0.05);
    this.tone(252, 0.42, "triangle", 0.032);
    this._noiseBurst("lowpass", 90, 0.35, 0.06, 0.04);
  }

  pickupShield() {
    this.tone(523, 0.12, "sine", 0.06);
    setTimeout(() => this.tone(659, 0.12, "sine", 0.05), 55);
    setTimeout(() => this.tone(784, 0.16, "triangle", 0.045), 110);
  }

  pickupStar() {
    this.tone(523, 0.1, "sine", 0.07);
    setTimeout(() => this.tone(659, 0.1, "sine", 0.06), 70);
    setTimeout(() => this.tone(784, 0.12, "triangle", 0.06), 140);
    setTimeout(() => this.tone(1046, 0.18, "sine", 0.05), 210);
  }

  trap() {
    this._noiseBurst("bandpass", 380, 0.16, 0.09, 0.006, 2.2);
    this.tone(72, 0.22, "sine", 0.07);
    this.tone(186, 0.09, "triangle", 0.035);
  }

  combo(n = 5) {
    if (n >= 20) {
      this.tone(440, 0.1, "sine", 0.07);
      setTimeout(() => this.tone(554, 0.1, "sine", 0.065), 100);
      setTimeout(() => this.tone(659, 0.12, "sine", 0.07), 200);
      return;
    }
    if (n >= 10) {
      this.tone(440, 0.2, "sine", 0.065);
      this.tone(554, 0.2, "sine", 0.06);
      return;
    }
    this.tone(440, 0.1, "sine", 0.07);
  }

  onComboMilestone(n) {
    this.combo(n);
  }

  comboReset() {
    this.tone(330, 0.12, "triangle", 0.055);
    setTimeout(() => this.tone(247, 0.14, "sine", 0.05), 70);
    setTimeout(() => this.tone(196, 0.18, "sine", 0.045), 150);
  }

  whoosh() {
    this._noiseBurst("highpass", 900, 0.22, 0.12, 0.03);
  }

  pitCrack() {
    this.tone(140 + Math.random() * 90, 0.08, "square", 0.035);
    this._noiseBurst("bandpass", 210, 0.14, 0.07, 0.004, 5);
  }

  geyserErupt() {
    this.whoosh();
    this._noiseBurst("lowpass", 1500, 0.28, 0.13, 0.01);
    this.tone(1180, 0.1, "sine", 0.055);
    this.tone(620, 0.16, "triangle", 0.045);
  }

  syncHazards(items) {
    const pick = nearestHazards(items, HAZARD_SFX.maxVoices);
    const keep = new Set(pick.map((h) => h.id));
    if (!this._hazVoices) this._hazVoices = new Map();
    for (const [id, voice] of this._hazVoices) {
      if (!keep.has(id)) {
        this._stopHazVoice(voice);
        this._hazVoices.delete(id);
      }
    }
    if (this.muted || !pick.length) {
      if (this.muted) {
        for (const voice of this._hazVoices.values()) this._stopHazVoice(voice);
        this._hazVoices.clear();
      }
      return;
    }
    const ctx = this.ensure();
    if (!ctx || !this.master || !this._noise) return;
    for (const h of pick) {
      let voice = this._hazVoices.get(h.id);
      if (!voice) {
        voice = this._startHazVoice(h);
        if (voice) this._hazVoices.set(h.id, voice);
      }
      if (voice) this._tuneHazVoice(voice, h);
    }
  }

  stopHazards() {
    if (!this._hazVoices) return;
    for (const voice of this._hazVoices.values()) this._stopHazVoice(voice);
    this._hazVoices.clear();
  }

  _startHazVoice(h) {
    const ctx = this.ctx;
    if (!ctx || !this.master || !this._noise) return null;
    const now = ctx.currentTime;
    const src = ctx.createBufferSource();
    src.buffer = this._noise;
    src.loop = true;
    const filter = ctx.createBiquadFilter();
    const osc = ctx.createOscillator();
    const slide = ctx.createOscillator();
    slide.type = "sine";
    if (h.kind === "hole") {
      filter.type = "lowpass";
      filter.frequency.value = 140;
      filter.Q.value = 0.5;
      osc.type = "sine";
      osc.frequency.value = HAZARD_SFX.holeHz;
      slide.frequency.value = 40;
    } else if (h.kind === "geyser") {
      filter.type = "highpass";
      filter.frequency.value = 720;
      filter.Q.value = 0.7;
      osc.type = "sine";
      osc.frequency.value = 280;
      slide.frequency.value = 9;
    } else {
      filter.type = h.kind === "spinner" ? "lowpass" : "bandpass";
      filter.Q.value = h.kind === "spinner" ? 0.7 : 4;
      osc.type = h.kind === "spinner" ? "triangle" : "sawtooth";
      slide.frequency.value = 78;
    }
    const g = ctx.createGain();
    g.gain.value = 0.0001;
    const og = ctx.createGain();
    og.gain.value = 0.0001;
    const sg = ctx.createGain();
    sg.gain.value = 0.0001;
    src.connect(filter);
    filter.connect(g);
    osc.connect(og);
    slide.connect(sg);
    g.connect(this.master);
    og.connect(this.master);
    sg.connect(this.master);
    src.start(now);
    osc.start(now);
    slide.start(now);
    return { kind: h.kind, src, filter, osc, slide, g, og, sg };
  }

  _tuneHazVoice(voice, h) {
    const ctx = this.ctx;
    if (!ctx) return;
    const now = ctx.currentTime;
    const dist = 1 / (1 + Math.max(0, h.dist) * 0.14);
    try {
      if (h.kind === "hole") {
        const pitch = hazardPitch("hole", 8, h.dist);
        const amp = Math.max(0.0001, HAZARD_SFX.holeGain * dist * this.sfxLevel);
        voice.filter.frequency.setTargetAtTime(90 + Math.max(0, 14 - h.dist) * 4, now, 0.1);
        voice.osc.frequency.setTargetAtTime(pitch, now, 0.08);
        voice.g.gain.setTargetAtTime(amp, now, 0.08);
        voice.og.gain.setTargetAtTime(amp * 0.85, now, 0.08);
        voice.sg.gain.setTargetAtTime(amp * 0.25, now, 0.1);
        return;
      }
      if (h.kind === "geyser") {
        const bubbling = HAZARD_SFX.geyserColdGain;
        const base = h.hot ? HAZARD_SFX.geyserHotGain : bubbling;
        const amp = Math.max(0.0001, base * dist * this.sfxLevel);
        voice.filter.frequency.setTargetAtTime(h.hot ? 480 : 900, now, 0.05);
        voice.osc.frequency.setTargetAtTime(h.hot ? 980 : 280, now, 0.04);
        voice.g.gain.setTargetAtTime(amp, now, 0.06);
        voice.og.gain.setTargetAtTime(amp * (h.hot ? 0.45 : 0.22), now, 0.06);
        voice.sg.gain.setTargetAtTime(amp * 0.18, now, 0.08);
        return;
      }
      const pitch = hazardPitch(h.kind, h.speed) * (h.kind === "spinner" ? 1 + 0.07 * Math.sin(h.phase || 0) : 1);
      const base = h.kind === "spinner" ? HAZARD_SFX.spinnerGain : HAZARD_SFX.sawGain;
      const heat = h.hot ? HAZARD_SFX.hotMul : HAZARD_SFX.coolMul;
      const amp = Math.max(0.0001, base * heat * dist * this.sfxLevel);
      voice.filter.frequency.setTargetAtTime(h.kind === "spinner" ? 520 : Math.min(4200, 900 + h.speed * 80), now, 0.05);
      voice.osc.frequency.setTargetAtTime(Math.max(40, pitch), now, 0.04);
      voice.g.gain.setTargetAtTime(amp, now, 0.06);
      voice.og.gain.setTargetAtTime(amp * (h.kind === "spinner" ? 0.35 : 0.22), now, 0.06);
      voice.sg.gain.setTargetAtTime(h.moving ? HAZARD_SFX.slideGain * heat * dist * this.sfxLevel : 0.0001, now, 0.08);
    } catch {
      /* audio param closed */
    }
  }

  _stopHazVoice(voice) {
    if (!voice) return;
    try {
      voice.src.stop();
    } catch {
      /* already stopped */
    }
    try {
      voice.osc.stop();
      voice.slide.stop();
    } catch {
      /* already stopped */
    }
    try {
      voice.g.disconnect();
      voice.og.disconnect();
      voice.sg.disconnect();
    } catch {
      /* */
    }
  }

  _noiseBurst(filterType, freq, dur, gain, attack = 0.02, q = 0) {
    if (this.muted) return;
    const ctx = this.ensure();
    if (!ctx || !this.master || !this._noise) return;
    const src = ctx.createBufferSource();
    src.buffer = this._noise;
    const filter = ctx.createBiquadFilter();
    filter.type = filterType;
    filter.frequency.value = freq;
    if (q) filter.Q.value = q;
    const g = ctx.createGain();
    const now = ctx.currentTime;
    const amp = Math.max(0.0008, gain * this.sfxLevel);
    g.gain.setValueAtTime(0.0001, now);
    g.gain.exponentialRampToValueAtTime(amp, now + attack);
    g.gain.exponentialRampToValueAtTime(0.001, now + dur);
    src.connect(filter);
    filter.connect(g);
    g.connect(this.master);
    src.start(now);
    src.stop(now + dur);
  }

  slash() {
    this._noiseBurst("highpass", 2200, 0.11, 0.16, 0.008);
    this._noiseBurst("bandpass", 1600, 0.09, 0.1, 0.01, 4);
    this.tone(1860, 0.05, "square", 0.04);
    this.tone(980, 0.07, "triangle", 0.035);
  }

  smashBlob() {
    this._noiseBurst("lowpass", 240, 0.2, 0.2, 0.012);
    this.tone(68, 0.18, "sawtooth", 0.09);
    this.tone(118, 0.1, "square", 0.05);
    this.tone(42, 0.14, "sine", 0.05);
  }

  blobStrike() {
    this.tone(280, 0.06, "sine", 0.07);
    this.tone(196, 0.08, "triangle", 0.055);
    setTimeout(() => this.tone(392, 0.07, "sine", 0.045), 35);
    setTimeout(() => this.tone(523, 0.05, "triangle", 0.03), 70);
  }

  fightStart(beast = false) {
    this.slash();
    this.tone(90, 0.22, "sawtooth", 0.07);
    setTimeout(() => this.blobStrike(), 50);
    if (beast) this.startBossLoop();
  }

  fightClash(beast = false) {
    if (beast) {
      this._bossSwing = (this._bossSwing || 0) + 1;
      if (this._bossSwing % 2) this.bossImpact();
      return;
    }
    this._noiseBurst("bandpass", 1500, 0.07, 0.09, 0.004, 5);
    this.tone(220, 0.05, "triangle", 0.045);
    this.blobStrike();
  }

  bossIntro() {
    this.tone(55, 0.18, "sawtooth", 0.12);
    this._noiseBurst("lowpass", 90, 0.22, 0.16, 0.02);
    this._slide(110, 48, 2.6, "sawtooth", 0.08);
    this.tone(82.41, 2.4, "sine", 0.055);
    this.tone(130.81, 2.0, "triangle", 0.04);
    this.tone(196, 1.8, "sine", 0.03);
    this._noiseBurst("lowpass", 70, 2.4, 0.1, 0.08);
    setTimeout(() => this.tone(174.61, 0.9, "triangle", 0.07), 380);
    setTimeout(() => this.tone(220, 0.7, "triangle", 0.05), 900);
  }

  startBossLoop() {
    if (this.muted) {
      this._bossLoop = true;
      this._style = "boss";
      this._bpm = BOSS_FIGHT.bpm;
      return;
    }
    const ctx = this.ensure();
    if (!this._musicOn) this.startMusic();
    this._bossLoop = true;
    this._style = "boss";
    this._bpm = BOSS_FIGHT.bpm;
    if (this._musicGain && ctx) {
      const ducked = Math.max(0.0001, this.musicLevel * MUSIC_GAIN * WORLD_BOSS_DUCK);
      this._musicGain.gain.cancelScheduledValues(ctx.currentTime);
      this._musicGain.gain.setValueAtTime(Math.max(0.0001, this._musicGain.gain.value), ctx.currentTime);
      this._musicGain.gain.exponentialRampToValueAtTime(ducked, ctx.currentTime + 0.2);
    }
    if (ctx && this.master) {
      this._killPads(this._bossPads);
      this._bossPads = [];
      if (!this._bossBus) {
        this._bossBus = ctx.createGain();
        this._bossBus.gain.value = Math.max(0.0001, this.musicLevel * MUSIC_GAIN);
        this._bossBus.connect(this.master);
      }
      this._startPads("boss", { bus: this._bossBus, replace: false, into: "_bossPads" });
    }
  }

  stopBossLoop({ fanfare = false } = {}) {
    const was = this._bossLoop || this._style === "boss";
    this._bossLoop = false;
    this._killPads(this._bossPads);
    this._bossPads = [];
    if (this._bossBus) {
      try {
        this._bossBus.disconnect();
      } catch {
        /* ignore */
      }
      this._bossBus = null;
    }
    if (fanfare) this.bossFanfare();
    if (!was && !fanfare) return;
    this.setWorldTrack(this._worldTrack || "meadow", { force: true });
  }

  cutBossLoop() {
    this.stopBossLoop({ fanfare: false });
  }

  bossImpact() {
    this._noiseBurst("lowpass", 160, 0.2, 0.2, 0.01);
    this.tone(52, 0.2, "sine", 0.1);
    this.tone(78, 0.16, "sawtooth", 0.07);
  }

  wardenSlash() {
    this._noiseBurst("highpass", 2400, 0.15, 0.22, 0.006);
    this.tone(1860, 0.08, "square", 0.07);
    this.tone(980, 0.12, "triangle", 0.05);
    this.tone(90, 0.12, "sawtooth", 0.055);
  }

  wardenSpin() {
    this._noiseBurst("bandpass", 720, 0.38, 0.16, 0.01, 3);
    this.tone(1680, 0.28, "sine", 0.055);
    this.tone(2100, 0.18, "triangle", 0.04);
    this.tone(140, 0.22, "sawtooth", 0.035);
  }

  wardenSlam() {
    this._noiseBurst("lowpass", 70, 0.38, 0.26, 0.012);
    this.tone(38, 0.4, "sine", 0.14);
    this.tone(58, 0.28, "sawtooth", 0.09);
    this.tone(90, 0.18, "triangle", 0.05);
  }

  bossFanfare() {
    this.tone(261.63, 0.7, "sine", 0.12);
    this.tone(329.63, 0.7, "triangle", 0.08);
    setTimeout(() => this.tone(392, 0.7, "sine", 0.1), 220);
    setTimeout(() => this.tone(523.25, 0.9, "sine", 0.11), 520);
    setTimeout(() => this.tone(659.25, 0.9, "triangle", 0.08), 720);
    setTimeout(() => {
      this.tone(523.25, 1.6, "sine", 0.12);
      this.tone(659.25, 1.6, "triangle", 0.09);
      this.tone(783.99, 1.6, "sine", 0.08);
    }, 1100);
    setTimeout(() => this.tone(1046.5, 1.2, "sine", 0.06), 1600);
  }

  gateGood() {
    this.gate("add");
  }

  gateBad() {
    this.gate("sub");
  }

  thunder() {
    if (this.muted) return;
    const ctx = this.ensure();
    if (!ctx || !this.master || !this._noise) return;
    const src = ctx.createBufferSource();
    src.buffer = this._noise;
    src.loop = true;
    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 80;
    const g = ctx.createGain();
    const now = ctx.currentTime;
    const amp = Math.max(0.0008, 0.22 * this.sfxLevel);
    g.gain.setValueAtTime(0.0001, now);
    g.gain.exponentialRampToValueAtTime(amp, now + 0.06);
    g.gain.exponentialRampToValueAtTime(amp * 0.35, now + 0.5);
    g.gain.exponentialRampToValueAtTime(0.001, now + 1.7);
    src.connect(filter);
    filter.connect(g);
    g.connect(this.master);
    src.start(now);
    src.stop(now + 1.7);
    this.tone(62, 0.55, "sine", 0.055);
    this.tone(78, 0.48, "sawtooth", 0.04);
    this.tone(96, 0.38, "triangle", 0.03);
  }

  setWeatherAmbience(kind, { rain = false } = {}) {
    const spec = WEATHER_AUDIO[kind] || WEATHER_AUDIO.cloudy;
    const nextRain = !!(rain || spec.rain);
    if (this._wxWind && this._wxKind === kind && this._wxRain === nextRain && !this.muted) return this._wxKind;
    this._wxKind = kind;
    this._wxRain = nextRain;
    if (this.muted) {
      this.stopWeatherAmbience();
      return this._wxKind;
    }
    const ctx = this.ensure();
    if (!ctx || !this.master || !this._noise) return this._wxKind;
    if (!this._wxWind) {
      const src = ctx.createBufferSource();
      src.buffer = this._noise;
      src.loop = true;
      const filter = ctx.createBiquadFilter();
      filter.type = "bandpass";
      filter.frequency.value = 280;
      filter.Q.value = 0.7;
      const g = ctx.createGain();
      g.gain.value = 0.0001;
      src.connect(filter);
      filter.connect(g);
      const pan = ctx.createStereoPanner?.() || ctx.createGain();
      if (pan.pan) pan.pan.value = 0;
      g.connect(pan);
      pan.connect(this.master);
      src.start();
      this._wxWind = { src, g, filter, pan };
      const rainSrc = ctx.createBufferSource();
      rainSrc.buffer = this._noise;
      rainSrc.loop = true;
      const rainF = ctx.createBiquadFilter();
      rainF.type = "highpass";
      rainF.frequency.value = 1800;
      const rainG = ctx.createGain();
      rainG.gain.value = 0.0001;
      rainSrc.connect(rainF);
      rainF.connect(rainG);
      rainG.connect(this.master);
      rainSrc.start();
      this._wxRainNode = { src: rainSrc, g: rainG };
    }
    const wind = Math.max(0.0001, windGain(spec.windDb) * this.sfxLevel);
    const rainGain = this._wxRain ? Math.max(0.0001, 0.085 * this.sfxLevel) : 0.0001;
    const now = ctx.currentTime;
    try {
      this._wxWind.g.gain.cancelScheduledValues(now);
      this._wxWind.g.gain.setTargetAtTime(wind, now, 0.12);
      this._wxRainNode.g.gain.cancelScheduledValues(now);
      this._wxRainNode.g.gain.setTargetAtTime(rainGain, now, 0.18);
    } catch {
      this._wxWind.g.gain.value = wind;
      this._wxRainNode.g.gain.value = rainGain;
    }
    return this._wxKind;
  }

  setAmbiencePan(x = 0) {
    const pan = this._wxWind?.pan;
    if (!pan?.pan) return 0;
    const v = Math.max(-0.65, Math.min(0.65, Number(x) || 0));
    pan.pan.value = v;
    return v;
  }

  stopWeatherAmbience() {
    const now = this.ctx?.currentTime || 0;
    try {
      this._wxWind?.g.gain.setTargetAtTime(0.0001, now, 0.08);
      this._wxRainNode?.g.gain.setTargetAtTime(0.0001, now, 0.08);
    } catch {
      /* */
    }
  }

  lifeChirp(pan = 0) {
    if (this.muted) return;
    this.tone(1480 + Math.random() * 420, 0.07, "sine", 0.018, { pan: Math.max(-0.85, Math.min(0.85, pan)) });
  }

  lifeRustle() {
    this._noiseBurst?.("bandpass", 900, 0.12, 0.03, 0.01, 0.6);
  }

  bossHit() {
    this.tone(80, 0.42, "sawtooth", 0.09);
    setTimeout(() => this.tone(160, 0.36, "triangle", 0.07), 30);
    setTimeout(() => this.tone(240, 0.3, "sine", 0.055), 70);
    setTimeout(() => this.tone(320, 0.24, "square", 0.04), 110);
    this.thunder();
  }

  gate(op) {
    if (op === "add") {
      this._slide(GATE_SFX.add.from, GATE_SFX.add.to, GATE_SFX.add.dur, "sine", GATE_SFX.add.gain);
      this._noiseBurst("highpass", 2200, 0.06, 0.028, 0.004);
    } else if (op === "mul") {
      this.tone(GATE_SFX.mul.freq, GATE_SFX.mul.dur, "sine", GATE_SFX.mul.gain);
      this.tone(1760, 0.18, "triangle", 0.04);
      this.tone(1320, 0.2, "sine", 0.032);
    } else if (op === "sub") {
      this._slide(GATE_SFX.sub.from, GATE_SFX.sub.to, GATE_SFX.sub.dur, "sine", GATE_SFX.sub.gain, { lowpass: 420 });
      this._noiseBurst("lowpass", 280, 0.12, 0.04, 0.01);
    } else if (op === "div") this._slide(GATE_SFX.div.from, GATE_SFX.div.to, GATE_SFX.div.dur, "triangle", GATE_SFX.div.gain, { wobble: true, delay: true });
    else this.tone(300, 0.08);
  }

  win() {
    this.tone(440, 0.1);
    setTimeout(() => this.tone(554, 0.1), 80);
    setTimeout(() => this.tone(659, 0.18), 160);
  }

  smash() {
    this.tone(90, 0.18, "sawtooth", 0.07);
    setTimeout(() => this.tone(240, 0.12, "square", 0.04), 40);
  }

  fail() {
    this.tone(196, 0.22, "sine", 0.05);
    setTimeout(() => this.tone(147, 0.32, "triangle", 0.045), 90);
    setTimeout(() => this.tone(110, 0.4, "sine", 0.04), 200);
  }

  hit() {
    this.tone(90, 0.12, "square", 0.05);
  }

  startMusic() {
    if (this.muted) return;
    const ctx = this.ensure();
    if (!ctx || !this.master) return;
    if (!this._musicOn) {
      this._musicOn = true;
      this._step = 0;
      this._nextNote = ctx.currentTime + 0.05;
      this._musicTick();
      this._musicTimer = window.setInterval(() => this._musicTick(), 25);
    }
    this.setWorldTrack(this._worldTrack || "meadow", { force: !this._musicGain });
  }

  setWorldTrack(id, { force = false } = {}) {
    const spec = trackForWorld(id);
    this._worldTrack = spec.id;
    this._bpm = spec.bpm;
    this.stormAmbience = spec.style === "crown";
    if (this._bossLoop && !force) {
      this._worldTrack = spec.id;
      return;
    }
    this._bossLoop = false;
    if (this.muted) {
      this._style = spec.style;
      return;
    }
    if (!this._musicOn) {
      this._style = spec.style;
      return;
    }
    if (!force && this._style === spec.style && this._musicGain) return;
    this._style = spec.style;
    this._crossfade(0.5);
    this._startPads(spec.style);
  }

  _crossfade(dur = 0.5, gainMul = 1) {
    const ctx = this.ctx;
    if (!ctx || !this.master) return;
    const next = ctx.createGain();
    const level = this.muted ? 0.0001 : Math.max(0.0001, this.musicLevel * MUSIC_GAIN * gainMul);
    next.gain.setValueAtTime(0.0001, ctx.currentTime);
    next.gain.exponentialRampToValueAtTime(level, ctx.currentTime + dur);
    next.connect(this.master);
    const old = this._musicGain;
    const oldPads = this._padNodes;
    this._padNodes = [];
    this._musicGain = next;
    if (old) {
      try {
        old.gain.cancelScheduledValues(ctx.currentTime);
        old.gain.setValueAtTime(Math.max(0.0001, old.gain.value), ctx.currentTime);
        old.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + dur);
      } catch {
        /* ignore */
      }
      window.setTimeout(() => {
        this._killPads(oldPads);
        try {
          old.disconnect();
        } catch {
          /* ignore */
        }
      }, dur * 1000 + 40);
    } else this._killPads(oldPads);
  }

  _killPads(nodes) {
    for (const n of nodes || []) {
      try {
        n.osc?.stop();
        n.src?.stop();
        n.gain?.disconnect();
      } catch {
        /* ignore */
      }
    }
  }

  _startPads(style, { bus = this._musicGain, replace = true, into = "_padNodes" } = {}) {
    if (replace) {
      this._killPads(this._padNodes);
      this._padNodes = [];
    }
    const ctx = this.ctx;
    if (!ctx || !bus) return;
    const bag = into === "_bossPads" ? (this._bossPads || (this._bossPads = [])) : this._padNodes;
    const addOsc = (freq, type, gain) => {
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = type;
      osc.frequency.value = freq;
      g.gain.value = gain;
      osc.connect(g);
      g.connect(bus);
      osc.start();
      bag.push({ osc, gain: g });
    };
    const addNoise = (filterType, freq, gain, q = 0) => {
      if (!this._noise) return;
      const src = ctx.createBufferSource();
      src.buffer = this._noise;
      src.loop = true;
      const f = ctx.createBiquadFilter();
      f.type = filterType;
      f.frequency.value = freq;
      if (q) f.Q.value = q;
      const g = ctx.createGain();
      g.gain.value = gain;
      src.connect(f);
      f.connect(g);
      g.connect(bus);
      src.start();
      bag.push({ src, gain: g });
    };
    if (style === "meadow") {
      addOsc(196, "sine", 0.028);
      addOsc(246.94, "sine", 0.018);
      addOsc(392, "triangle", 0.012);
    } else if (style === "dunes") {
      addNoise("highpass", 420, 0.045);
      addOsc(174.61, "triangle", 0.02);
      addOsc(220, "sine", 0.012);
    } else if (style === "frost") {
      addOsc(523.25, "sine", 0.016);
      addOsc(783.99, "triangle", 0.01);
      addOsc(1046.5, "sine", 0.008);
    } else if (style === "grove") {
      addNoise("bandpass", 1800, 0.03, 0.7);
      addOsc(174.61, "sine", 0.02);
      addOsc(261.63, "triangle", 0.012);
    } else if (style === "ember") {
      addOsc(130.81, "sawtooth", 0.016);
      addOsc(164.81, "sawtooth", 0.01);
      addOsc(196, "triangle", 0.014);
    } else if (style === "boss") {
      addOsc(73.42, "sawtooth", 0.022);
      addOsc(110, "sawtooth", 0.016);
      addOsc(146.83, "triangle", 0.014);
    } else if (style === "crown") {
      addOsc(55, "sawtooth", 0.02);
      addOsc(82.41, "sawtooth", 0.014);
      addOsc(110, "triangle", 0.018);
      addOsc(220, "sine", 0.01);
      addNoise("lowpass", 90, 0.05);
    } else {
      addOsc(196, "sine", 0.02);
    }
  }

  stopMusic() {
    this._musicOn = false;
    if (this._musicTimer) {
      clearInterval(this._musicTimer);
      this._musicTimer = 0;
    }
    this._killPads(this._padNodes);
    this._padNodes = [];
    this._killPads(this._bossPads);
    this._bossPads = [];
    this._bossLoop = false;
    const g = this._musicGain;
    const ctx = this.ctx;
    if (g && ctx) {
      try {
        g.gain.cancelScheduledValues(ctx.currentTime);
        g.gain.setValueAtTime(Math.max(0.0001, g.gain.value), ctx.currentTime);
        g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.12);
      } catch {
        /* ignore */
      }
      setTimeout(() => {
        try {
          g.disconnect();
        } catch {
          /* ignore */
        }
      }, 160);
    }
    this._musicGain = null;
  }

  _musicTick() {
    const ctx = this.ctx;
    if (!this._musicOn || !ctx || !this._musicGain) return;
    const stepDur = 60 / this._bpm / 4;
    while (this._nextNote < ctx.currentTime + 0.22) {
      this._scheduleStep(this._step, this._nextNote);
      this._nextNote += stepDur;
      this._step = (this._step + 1) % 256;
    }
  }

  _scheduleStep(step, t) {
    const style = this._style || "meadow";
    const bar = step % 16;
    const phrase = Math.floor(step / 16) % 8;
    if (style === "meadow") {
      if (bar === 0) this._buzz(196, t, 0.55, "sine", 0.03);
      if (bar === 8) this._buzz(246.94, t, 0.45, "sine", 0.022);
      const piano = [392, null, 493.88, null, 523.25, 440, null, 392];
      if (piano[bar % 8]) this._buzz(piano[bar % 8], t, 0.18, "triangle", 0.02);
      return;
    }
    if (style === "dunes") {
      if (bar % 8 === 0) this._hat(t, 0.022);
      if (bar % 16 === 4) this._hat(t, 0.016);
      const flute = [392, 440, 523.25, 440, 349.23, 392, 440, 349.23];
      if (bar % 2 === 0 && phrase % 2 === 0) this._buzz(flute[(bar / 2) % 8], t, 0.28, "sine", 0.024);
      if (bar === 12) this._buzz(220, t, 0.4, "triangle", 0.016);
      return;
    }
    if (style === "frost") {
      const bells = [1046.5, 1318.5, 1568, 1174.7];
      if (bar % 4 === 0) this._buzz(bells[(bar / 4 + phrase) % 4], t, 0.7, "sine", 0.018);
      if (bar % 8 === 3) this._buzz(783.99, t, 0.5, "triangle", 0.012);
      return;
    }
    if (style === "grove") {
      if (bar % 16 === 2) this._buzz(1400 + (phrase % 3) * 180, t, 0.07, "sine", 0.016);
      if (bar % 16 === 11) this._buzz(1680, t, 0.05, "sine", 0.012);
      const wood = [349.23, 392, 440, 392];
      if (bar % 4 === 0) this._buzz(wood[(bar / 4) % 4], t, 0.32, "triangle", 0.02);
      return;
    }
    if (style === "ember") {
      if (bar % 4 === 0) this._kick(t);
      if (bar % 8 === 4) this._buzz(130.81, t, 0.35, "sawtooth", 0.028);
      const brass = [196, 246.94, 261.63, 220];
      if (bar % 4 === 2) this._buzz(brass[(phrase + bar / 4) % 4], t, 0.28, "sawtooth", 0.018);
      if (bar % 2 === 0) this._buzz(392, t, 0.12, "triangle", 0.012);
      return;
    }
    if (style === "boss") {
      if (bar % 4 === 0) this._kick(t);
      if (bar % 4 === 2) this._snare(t);
      if (bar % 2 === 1) this._hat(t, 0.028);
      const brass = [196, 233.08, 261.63, 196];
      if (bar % 4 === 0) this._buzz(brass[(phrase + bar / 4) % 4], t, 0.28, "sawtooth", 0.026);
      if (bar % 8 === 4) this._buzz(146.83, t, 0.4, "triangle", 0.02);
      return;
    }
    if (style === "crown") {
      if (bar % 16 === 0) this._buzz(55, t, 1.4, "sawtooth", 0.03);
      if (bar % 16 === 8) this._buzz(73.42, t, 1.1, "sine", 0.024);
      if (bar % 16 === 4) this._buzz(110, t, 0.8, "triangle", 0.02);
      if (bar % 16 === 12) this._buzz(164.81, t, 0.7, "sine", 0.016);
      if (bar === 0 && phrase % 4 === 0) this._rumble(t);
      return;
    }
    if (bar % 8 === 0) this._buzz(196, t, 0.4, "sine", 0.02);
  }

  _rumble(t) {
    const ctx = this.ctx;
    const bus = this._musicGain;
    if (!ctx || !bus || !this._noise) return;
    const src = ctx.createBufferSource();
    src.buffer = this._noise;
    src.loop = true;
    const f = ctx.createBiquadFilter();
    f.type = "lowpass";
    f.frequency.value = 70;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(0.07, t + 0.08);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 1.6);
    src.connect(f);
    f.connect(g);
    g.connect(bus);
    src.start(t);
    src.stop(t + 1.65);
    this._buzz(48, t, 1.2, "sine", 0.028);
  }

  _buzz(freq, t, dur, type, gain) {
    const ctx = this.ctx;
    const bus = this._musicGain;
    if (!ctx || !bus || !freq) return;
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = type;
    o.frequency.setValueAtTime(freq, t);
    g.gain.setValueAtTime(gain, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g);
    g.connect(bus);
    o.start(t);
    o.stop(t + dur + 0.02);
  }

  _kick(t) {
    const ctx = this.ctx;
    const bus = this._musicGain;
    if (!ctx || !bus) return;
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = "sine";
    o.frequency.setValueAtTime(140, t);
    o.frequency.exponentialRampToValueAtTime(42, t + 0.14);
    g.gain.setValueAtTime(0.09, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.16);
    o.connect(g);
    g.connect(bus);
    o.start(t);
    o.stop(t + 0.18);
  }

  _hat(t, gain) {
    const ctx = this.ctx;
    const bus = this._musicGain;
    if (!ctx || !bus || !this._noise) return;
    const src = ctx.createBufferSource();
    src.buffer = this._noise;
    const f = ctx.createBiquadFilter();
    f.type = "highpass";
    f.frequency.value = 7000;
    const g = ctx.createGain();
    g.gain.setValueAtTime(gain, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.04);
    src.connect(f);
    f.connect(g);
    g.connect(bus);
    src.start(t);
    src.stop(t + 0.05);
  }

  _snare(t) {
    const ctx = this.ctx;
    const bus = this._musicGain;
    if (!ctx || !bus || !this._noise) return;
    const src = ctx.createBufferSource();
    src.buffer = this._noise;
    const f = ctx.createBiquadFilter();
    f.type = "bandpass";
    f.frequency.value = 1800;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.06, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.1);
    src.connect(f);
    f.connect(g);
    g.connect(bus);
    src.start(t);
    src.stop(t + 0.12);
    this._buzz(220, t, 0.08, "triangle", 0.02);
  }
}

export class Shake {
  constructor() {
    this.mag = 0;
    this._hits = [];
  }
  punch(amount = 0.18) {
    this.mag = Math.max(this.mag, amount);
  }
  /** Timed sine shake. `px` is screen pixels; converted with viewport height. */
  hit({ dur = 0.1, hz = 5, px = 2, scale = 1 } = {}) {
    this._hits.push({ t: 0, dur, hz, px: px * Math.max(0.15, scale) });
    if (this._hits.length > 8) this._hits.shift();
  }
  offset(reduceMotion, dt = 0.016, heightPx = 720) {
    let x = 0;
    let y = 0;
    if (reduceMotion) {
      this.mag *= 0.5;
      this._hits.length = 0;
      return { x: 0, y: 0 };
    }
    if (this.mag < 0.002) this.mag *= 0.5;
    else {
      this.mag *= Math.pow(0.82, dt / 0.016);
      x += (Math.random() - 0.5) * this.mag;
      y += (Math.random() - 0.5) * this.mag * 0.7;
    }
    const world = (px) => (px / Math.max(1, heightPx)) * 8;
    for (let i = this._hits.length - 1; i >= 0; i--) {
      const hit = this._hits[i];
      hit.t += dt;
      if (hit.t >= hit.dur) {
        this._hits.splice(i, 1);
        continue;
      }
      const fade = 1 - hit.t / hit.dur;
      const w = world(hit.px) * fade;
      const a = hit.t * hit.hz * Math.PI * 2;
      x += Math.sin(a) * w;
      y += Math.cos(a * 1.13) * w * 0.72;
    }
    return { x, y };
  }
}
