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
    this._bpm = 128;
    this._noise = null;
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
      this._musicGain.gain.value = this.muted ? 0.0001 : Math.max(0.0001, this.musicLevel);
    }
    if (this.muted) this.stopMusic();
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

  tone(freq, dur, type = "sine", gain = 0.08) {
    if (this.muted) return;
    const ctx = this.ensure();
    if (!ctx || !this.master) return;
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = type;
    o.frequency.value = freq;
    g.gain.value = Math.max(0.0008, gain * this.sfxLevel);
    g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + dur);
    o.connect(g);
    g.connect(this.master);
    o.start();
    o.stop(ctx.currentTime + dur);
  }

  ui() {
    this.tone(640, 0.05, "sine", 0.04);
  }

  coin() {
    this.tone(880, 0.07, "sine", 0.05);
    setTimeout(() => this.tone(1180, 0.09, "sine", 0.04), 50);
  }

  gate(op) {
    if (op === "mul") this.tone(520, 0.12, "square", 0.06);
    else if (op === "add") this.tone(380, 0.1, "sine", 0.07);
    else if (op === "sub" || op === "div") this.tone(180, 0.14, "sawtooth", 0.05);
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
    this.tone(140, 0.28, "triangle", 0.08);
  }

  hit() {
    this.tone(90, 0.12, "square", 0.05);
  }

  startMusic() {
    if (this.muted) return;
    const ctx = this.ensure();
    if (!ctx || !this.master || this._musicOn) return;
    this._musicGain = ctx.createGain();
    this._musicGain.gain.value = 0.0001;
    this._musicGain.connect(this.master);
    this._musicGain.gain.exponentialRampToValueAtTime(Math.max(0.12, this.musicLevel), ctx.currentTime + 0.18);
    this._musicOn = true;
    this._step = 0;
    this._nextNote = ctx.currentTime + 0.05;
    this._musicTick();
    this._musicTimer = window.setInterval(() => this._musicTick(), 25);
  }

  stopMusic() {
    this._musicOn = false;
    if (this._musicTimer) {
      clearInterval(this._musicTimer);
      this._musicTimer = 0;
    }
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
      this._step = (this._step + 1) % 32;
    }
  }

  _scheduleStep(step, t) {
    const bar = step % 16;
    if (bar % 4 === 0) this._kick(t);
    if (bar % 4 === 2) this._snare(t);
    if (bar % 2 === 1) this._hat(t, 0.03);
    if (bar % 2 === 0) this._hat(t, 0.018);

    const bass = [98, 98, 130.81, 98, 87.31, 87.31, 110, 98];
    if (bar % 2 === 0) this._buzz(bass[(bar / 2) % 8], t, 0.22, "triangle", 0.045);

    const arp = [523.25, 659.25, 783.99, 659.25, 523.25, 392.0, 440.0, 523.25];
    this._buzz(arp[bar % 8], t, 0.09, "sine", step % 16 < 8 ? 0.028 : 0.02);

    const lead = [null, 784, null, 659, 784, null, 880, 784, null, 659, 523, null, 587, 659, 523, null];
    if (lead[bar] && step % 32 < 16) this._buzz(lead[bar], t, 0.16, "triangle", 0.032);
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
  }
  punch(amount = 0.18) {
    this.mag = Math.max(this.mag, amount);
  }
  offset(reduceMotion) {
    if (reduceMotion || this.mag < 0.002) {
      this.mag *= 0.5;
      return { x: 0, y: 0 };
    }
    this.mag *= 0.82;
    return {
      x: (Math.random() - 0.5) * this.mag,
      y: (Math.random() - 0.5) * this.mag * 0.7,
    };
  }
}
