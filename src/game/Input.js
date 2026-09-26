const GAME_KEYS = new Set([
  "ArrowLeft",
  "ArrowRight",
  "ArrowUp",
  "ArrowDown",
  "a",
  "A",
  "d",
  "D",
  "w",
  "W",
  " ",
  "p",
  "P",
  "Escape",
  "r",
  "R",
]);

export class Input {
  constructor() {
    this.keys = new Set();
    this.pointerX = 0;
    this.dragging = false;
    this._handlers = [];
    this.onPause = null;
    this.onRestart = null;
    this.onNudge = null;
    this.onGrab = null;
    this.onNitro = null;
  }

  _isUi(el) {
    if (!el?.closest) return false;
    if (el.isContentEditable) return true;
    const tag = el.tagName;
    if (tag === "INPUT" || tag === "TEXTAREA" || tag === "BUTTON" || tag === "A" || tag === "LABEL") return true;
    return !!el.closest("button, input, label, a, .sheet, .overlay-card, .hint-card, .ad, .wallet, .home, .splash");
  }

  bind(canvas) {
    this.unbind();
    const stage = canvas.parentElement || canvas;
    const down = (e) => {
      if (e.button != null && e.button !== 0) return;
      if (this._isUi(e.target)) return;
      this.dragging = true;
      this.pointerX = e.clientX;
      this._downAt = performance.now();
      this._downX = e.clientX;
      this.onGrab?.();
      try {
        canvas.setPointerCapture(e.pointerId);
      } catch {
        /* ignore */
      }
    };
    const move = (e) => {
      this.pointerX = e.clientX;
    };
    const up = (e) => {
      const held = performance.now() - (this._downAt || 0);
      const dx = Math.abs((e?.clientX ?? this.pointerX) - (this._downX || 0));
      this.dragging = false;
      if (this._downAt && held < 160 && dx < 12) {
        /* Count-masters style: drag only steers; nitro is W / Space. */
      }
      this._downAt = 0;
    };
    const keydown = (e) => {
      if (this._isUi(e.target) && (e.target.tagName === "INPUT" || e.target.isContentEditable)) return;
      if (!GAME_KEYS.has(e.key)) return;
      if (e.repeat && (e.key === "p" || e.key === "P" || e.key === "Escape" || e.key === "r" || e.key === "R")) {
        e.preventDefault();
        return;
      }
      e.preventDefault();
      this.keys.add(e.key);
      if (e.key === "p" || e.key === "P" || e.key === "Escape") this.onPause?.();
      if (e.key === "r" || e.key === "R") this.onRestart?.();
      if (e.key === "ArrowLeft" || e.key === "a" || e.key === "A") this.onNudge?.(-1);
      if (e.key === "ArrowRight" || e.key === "d" || e.key === "D") this.onNudge?.(1);
      if (e.key === " " || e.key === "w" || e.key === "W" || e.key === "ArrowUp") this.onNitro?.();
    };
    const keyup = (e) => {
      this.keys.delete(e.key);
    };
    const preventScroll = (e) => e.preventDefault();

    stage.addEventListener("pointerdown", down);
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    window.addEventListener("pointercancel", up);
    window.addEventListener("keydown", keydown);
    window.addEventListener("keyup", keyup);
    stage.addEventListener("touchmove", preventScroll, { passive: false });

    this._handlers = [
      () => stage.removeEventListener("pointerdown", down),
      () => window.removeEventListener("pointermove", move),
      () => window.removeEventListener("pointerup", up),
      () => window.removeEventListener("pointercancel", up),
      () => window.removeEventListener("keydown", keydown),
      () => window.removeEventListener("keyup", keyup),
      () => stage.removeEventListener("touchmove", preventScroll),
    ];
  }

  unbind() {
    for (const off of this._handlers) off();
    this._handlers = [];
    this.keys.clear();
    this.dragging = false;
  }

  steerAxis() {
    const left = this.keys.has("ArrowLeft") || this.keys.has("a") || this.keys.has("A");
    const right = this.keys.has("ArrowRight") || this.keys.has("d") || this.keys.has("D");
    if (left && !right) return -1;
    if (right && !left) return 1;
    return 0;
  }

  keyboardLane(limit) {
    const axis = this.steerAxis();
    if (axis === 0) return null;
    return axis * limit;
  }
}
