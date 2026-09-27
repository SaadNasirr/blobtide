/** Small Tween.js-style pool. @tweenjs/tween.js is not a project dependency. */
export const Ease = {
  linear: (t) => t,
  quadOut: (t) => 1 - (1 - t) * (1 - t),
  quadInOut: (t) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2),
  spring: (t) => {
    if (t <= 0) return 0;
    if (t >= 1) return 1;
    return 1 - Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * ((2 * Math.PI) / 3));
  },
  /** Scale 0→1 with a 10% overshoot, then settle. */
  overshoot: (t, amount = 0.1) => {
    if (t <= 0) return 0;
    if (t >= 1) return 1;
    const peak = 1 + amount;
    if (t < 0.62) {
      const u = t / 0.62;
      return peak * (1 - Math.pow(1 - u, 3));
    }
    const u = (t - 0.62) / 0.38;
    return peak + (1 - peak) * (1 - Math.pow(1 - u, 2));
  },
};

export class TweenPool {
  constructor(limit = 50) {
    this.limit = limit;
    this.active = [];
  }

  kill(target, key) {
    this.active = this.active.filter((tw) => tw.target !== target || (key && tw.key !== key));
  }

  killAll() {
    this.active.length = 0;
  }

  to(target, key, toValue, duration, ease = Ease.quadOut, onDone = null) {
    if (this.active.length >= this.limit) this.active.shift();
    const from = Number(target[key]) || 0;
    this.kill(target, key);
    this.active.push({
      target,
      key,
      from,
      to: toValue,
      t: 0,
      duration: Math.max(0.001, duration),
      ease,
      onDone,
    });
    return this;
  }

  update(dt) {
    for (let i = this.active.length - 1; i >= 0; i--) {
      const tw = this.active[i];
      tw.t += dt;
      const u = Math.min(1, tw.t / tw.duration);
      tw.target[tw.key] = tw.from + (tw.to - tw.from) * tw.ease(u);
      if (u >= 1) {
        tw.target[tw.key] = tw.to;
        this.active.splice(i, 1);
        tw.onDone?.();
      }
    }
  }
}

export function comboSquashAmount(n) {
  if (n >= 20) return 0.15;
  if (n >= 10) return 0.1;
  if (n >= 5) return 0.05;
  return 0;
}
