import { FULL_STEPS, REFRESHER_STEP } from "../game/Tutorial.js";

export class Hud {
  constructor(root) {
    this.root = root;
    this.capture = new URLSearchParams(location.search).has("capture");
    this.tutorialMode = "none";
    this.stepIndex = 0;
    this.onRestartRequest = null;
    this.onTutorialProgress = null;
    this.root.innerHTML = `
      <div class="safe ${this.capture ? "capture" : ""}" id="shell">
        <div id="splash" class="splash">
          <div class="splash-mark"></div>
          <p>BLOBTIDE</p>
        </div>

        <div class="wallet" id="wallet">
          <span class="coin-ico" aria-hidden="true"></span>
          <span id="coins">0</span>
        </div>

        <header class="play-hud hidden" id="play-hud">
          <button type="button" id="pause-btn" class="icon-btn" aria-label="Pause">
            <span class="pause-bars"></span>
          </button>
          <div class="hud-center">
            <div class="level-pill" id="level-badge">LEVEL 1</div>
            <div class="crowd-hero">
              <span class="lbl">CROWD</span>
              <span id="count">0</span>
            </div>
            <div class="combo hidden" id="combo">COMBO x2</div>
            <div class="buffs">
              <span id="boost-pip" class="pip hidden">BOOST</span>
              <span id="shield-pip" class="pip hidden">SHIELD</span>
            </div>
          </div>
          <div class="hud-spacer"></div>
        </header>

        <div id="float" class="float"></div>
        <div id="coin-fx" class="coin-fx" aria-hidden="true"></div>
        <div id="toast" class="toast hidden"></div>

        <div id="hint" class="hint-card hidden">
          <div class="arrows" aria-hidden="true"><span>←</span><span class="blob-dot"></span><span>→</span></div>
          <h3 id="hint-title"></h3>
          <p id="hint-body"></p>
          <div class="hint-actions">
            <button type="button" id="hint-next" class="cta sm">GOT IT</button>
            <button type="button" id="hint-skip" class="ghost sm">Skip</button>
            <button type="button" id="hint-hide" class="text-btn">Hide tips</button>
          </div>
        </div>

        <section id="menu" class="home">
          <div class="brand">
            <div class="logo-blobs" aria-hidden="true">
              <i></i><i></i><i></i>
            </div>
            <h1>BLOBTIDE</h1>
            <p class="tag">SWERVE · MULTIPLY · SMASH</p>
          </div>
          <button type="button" id="play" class="cta play-cta">TAP TO PLAY</button>
          <nav class="dock">
            <button type="button" id="skins" class="dock-btn" aria-label="Skins">
              <span class="dock-ico shop"></span>
              <small>Shop</small>
            </button>
            <button type="button" id="how" class="dock-btn" aria-label="Settings">
              <span class="dock-ico gear"></span>
              <small>Settings</small>
            </button>
            <button type="button" id="iap" class="dock-btn" aria-label="Remove ads">
              <span class="dock-ico ads"></span>
              <small>No Ads</small>
            </button>
          </nav>
        </section>

        <section id="shop" class="sheet hidden">
          <div class="sheet-head">
            <h2>SHOP</h2>
            <button type="button" id="shop-back" class="icon-btn x" aria-label="Close">✕</button>
          </div>
          <div id="skin-grid" class="skin-grid"></div>
          <div class="packs">
            <button type="button" data-pack="small"><b>+200</b><span>0.99</span></button>
            <button type="button" data-pack="medium"><b>+1000</b><span>3.99</span></button>
            <button type="button" data-pack="prism"><b>PRISM</b><span>IAP</span></button>
          </div>
        </section>

        <section id="help" class="sheet hidden">
          <div class="sheet-head">
            <h2>SETTINGS</h2>
            <button type="button" id="help-back" class="icon-btn x" aria-label="Close">✕</button>
          </div>
          <ul class="help-list">
            <li><strong>Steer</strong> Swipe the path, or hold A / D or ← →</li>
            <li><strong>Gates</strong> Green grows you. Red shrinks you. Pick a side on split gates.</li>
            <li><strong>Nitro</strong> Tap the path or press W / Space for a short boost.</li>
            <li><strong>Pickups</strong> Gold coins, cyan boost arrows, ice shields. Steer into them.</li>
            <li><strong>Door</strong> Gold says SMASH. Run straight into it if your crowd is big enough.</li>
            <li><strong>Walls</strong> Red blocks sit on one side. Swipe into the open lane — do not stop.</li>
            <li><strong>Pause</strong> Top-left, or P / Esc. Restart with R from pause or results.</li>
          </ul>
          <label class="switch"><input type="checkbox" id="mute-toggle" /><span></span> Mute music & SFX</label>
          <label class="switch"><input type="checkbox" id="hide-toggle" /><span></span> Hide tips</label>
          <button type="button" id="replay-tutorial" class="ghost">Replay tutorial</button>
        </section>

        <section id="pause" class="overlay-card hidden">
          <h2>PAUSED</h2>
          <button type="button" id="resume" class="cta">RESUME</button>
          <button type="button" id="pause-retry" class="ghost">RESTART</button>
          <button type="button" id="pause-help" class="ghost">SETTINGS</button>
          <button type="button" id="pause-menu" class="text-btn">Home</button>
        </section>

        <section id="result" class="overlay-card hidden">
          <div class="result-badge" id="result-badge"></div>
          <h2 id="result-title"></h2>
          <p id="result-sub"></p>
          <button type="button" id="result-primary" class="cta"></button>
          <button type="button" id="result-secondary" class="ghost ad-btn"></button>
          <button type="button" id="result-menu" class="text-btn">Home</button>
        </section>

        <div id="ad" class="ad hidden">
          <p id="ad-kicker">Ad break</p>
          <h3 id="ad-title"></h3>
          <p id="ad-body"></p>
          <div class="ad-bar"><i></i></div>
        </div>
      </div>
    `;
    this.els = {
      shell: this.root.querySelector("#shell"),
      splash: this.root.querySelector("#splash"),
      count: this.root.querySelector("#count"),
      coins: this.root.querySelector("#coins"),
      playHud: this.root.querySelector("#play-hud"),
      combo: this.root.querySelector("#combo"),
      boostPip: this.root.querySelector("#boost-pip"),
      shieldPip: this.root.querySelector("#shield-pip"),
      levelBadge: this.root.querySelector("#level-badge"),
      float: this.root.querySelector("#float"),
      coinFx: this.root.querySelector("#coin-fx"),
      toast: this.root.querySelector("#toast"),
      menu: this.root.querySelector("#menu"),
      shop: this.root.querySelector("#shop"),
      help: this.root.querySelector("#help"),
      pause: this.root.querySelector("#pause"),
      result: this.root.querySelector("#result"),
      resultBadge: this.root.querySelector("#result-badge"),
      resultTitle: this.root.querySelector("#result-title"),
      resultSub: this.root.querySelector("#result-sub"),
      resultPrimary: this.root.querySelector("#result-primary"),
      resultSecondary: this.root.querySelector("#result-secondary"),
      resultMenu: this.root.querySelector("#result-menu"),
      play: this.root.querySelector("#play"),
      skins: this.root.querySelector("#skins"),
      how: this.root.querySelector("#how"),
      iap: this.root.querySelector("#iap"),
      shopBack: this.root.querySelector("#shop-back"),
      helpBack: this.root.querySelector("#help-back"),
      skinGrid: this.root.querySelector("#skin-grid"),
      ad: this.root.querySelector("#ad"),
      adTitle: this.root.querySelector("#ad-title"),
      adBody: this.root.querySelector("#ad-body"),
      pauseBtn: this.root.querySelector("#pause-btn"),
      resume: this.root.querySelector("#resume"),
      pauseHelp: this.root.querySelector("#pause-help"),
      pauseRetry: this.root.querySelector("#pause-retry"),
      pauseMenu: this.root.querySelector("#pause-menu"),
      hint: this.root.querySelector("#hint"),
      hintTitle: this.root.querySelector("#hint-title"),
      hintBody: this.root.querySelector("#hint-body"),
      hintNext: this.root.querySelector("#hint-next"),
      hintSkip: this.root.querySelector("#hint-skip"),
      hintHide: this.root.querySelector("#hint-hide"),
      muteToggle: this.root.querySelector("#mute-toggle"),
      hideToggle: this.root.querySelector("#hide-toggle"),
      replayTutorial: this.root.querySelector("#replay-tutorial"),
    };
    setTimeout(() => this.els.splash?.classList.add("gone"), 700);
  }

  hideSplash() {
    this.els.splash?.classList.add("gone");
  }

  setCoins(n) {
    this.els.coins.textContent = String(n);
  }

  setLevel(n) {
    if (this.els.levelBadge) this.els.levelBadge.textContent = `LEVEL ${n}`;
  }

  setCombo(n) {
    if (!this.els.combo) return;
    if (n >= 2) {
      this.els.combo.textContent = `COMBO x${n}`;
      this.els.combo.classList.remove("hidden");
    } else this.els.combo.classList.add("hidden");
  }

  setBuffs({ shield = false, boost = false } = {}) {
    this.els.shieldPip?.classList.toggle("hidden", !shield);
    this.els.boostPip?.classList.toggle("hidden", !boost);
  }

  setCount(n) {
    this.els.count.textContent = String(Math.max(0, n));
    this.els.count.classList.remove("pop");
    void this.els.count.offsetWidth;
    this.els.count.classList.add("pop");
  }

  setPlaying(on) {
    this.els.menu.classList.toggle("hidden", on);
    this.els.shop.classList.add("hidden");
    this.els.help.classList.add("hidden");
    if (on) this.els.result.classList.add("hidden");
    this.els.playHud.classList.toggle("hidden", !on);
    this.els.pauseBtn.classList.toggle("hidden", !on);
    this.els.shell.classList.toggle("in-play", on);
  }

  showMenu() {
    this.els.menu.classList.remove("hidden");
    this.els.shop.classList.add("hidden");
    this.els.help.classList.add("hidden");
    this.els.result.classList.add("hidden");
    this.els.pause.classList.add("hidden");
    this.els.playHud.classList.add("hidden");
    this.els.pauseBtn.classList.add("hidden");
    this.els.shell.classList.remove("in-play");
    this.hideHint();
  }

  showShop() {
    this._showOnly("shop");
  }

  showHelp() {
    this.els.menu.classList.add("hidden");
    this.els.shop.classList.add("hidden");
    this.els.help.classList.remove("hidden");
    this.els.result.classList.add("hidden");
  }

  _showOnly(id) {
    for (const key of ["menu", "shop", "help", "result"]) {
      this.els[key].classList.toggle("hidden", key !== id);
    }
  }

  setPaused(on) {
    this.els.pause.classList.toggle("hidden", !on);
    this.els.pauseBtn.classList.toggle("hidden", on || !this.els.shell.classList.contains("in-play"));
    if (!this.els.result.classList.contains("hidden")) this.els.pause.classList.add("hidden");
  }

  showResult({ title, subtitle, primary, secondary, mode }) {
    this.els.result.classList.remove("hidden");
    this.els.pause.classList.add("hidden");
    this.els.pauseBtn.classList.add("hidden");
    this.els.playHud.classList.add("hidden");
    this.els.resultTitle.textContent = title;
    this.els.resultSub.textContent = subtitle;
    this.els.resultPrimary.textContent = primary.toUpperCase();
    this.els.resultSecondary.textContent = secondary;
    this.els.result.dataset.mode = mode;
    this.els.result.classList.toggle("win", mode === "win");
    this.els.result.classList.toggle("fail", mode === "fail");
    this.els.resultBadge.textContent = mode === "win" ? "★" : "!";
    this.els.resultSecondary.disabled = false;
    this.els.resultPrimary.disabled = false;
  }

  disableSecondary() {
    if (this.els.resultSecondary) this.els.resultSecondary.disabled = true;
  }

  setResultSubtitle(text) {
    this.els.resultSub.textContent = text;
  }

  hideResult() {
    this.els.result.classList.add("hidden");
    this.els.resultPrimary.disabled = false;
    this.els.resultSecondary.disabled = false;
    if (this.els.shell.classList.contains("in-play")) {
      this.els.playHud.classList.remove("hidden");
      this.els.pauseBtn.classList.remove("hidden");
    }
  }

  toast(text) {
    this.els.toast.textContent = text;
    this.els.toast.classList.remove("hidden");
    clearTimeout(this._toast);
    this._toast = setTimeout(() => this.els.toast.classList.add("hidden"), 1100);
  }

  hideToast() {
    clearTimeout(this._toast);
    this.els.toast?.classList.add("hidden");
  }

  floatText(text, color) {
    const n = document.createElement("div");
    n.className = "floater";
    n.textContent = text;
    n.style.color = color;
    this.els.float.appendChild(n);
    setTimeout(() => n.remove(), 700);
  }

  burstCoins(amount) {
    const n = Math.min(8, 3 + Math.floor(amount / 12));
    for (let i = 0; i < n; i++) {
      const d = document.createElement("span");
      d.className = "coin-bit";
      d.style.setProperty("--dx", `${(Math.random() - 0.5) * 80}px`);
      d.style.animationDelay = `${i * 40}ms`;
      this.els.coinFx.appendChild(d);
      setTimeout(() => d.remove(), 700);
    }
  }

  showAd(title, body) {
    this.els.ad.classList.remove("hidden");
    this.els.adTitle.textContent = title;
    this.els.adBody.textContent = body;
  }

  hideAd() {
    this.els.ad.classList.add("hidden");
  }

  startTutorial(mode) {
    this.tutorialMode = mode;
    this.stepIndex = 0;
    if (mode === "none") {
      this.hideHint();
      return;
    }
    this.renderHint();
  }

  renderHint() {
    if (this.tutorialMode === "none") {
      this.hideHint();
      return;
    }
    const step = this.tutorialMode === "refresher" ? REFRESHER_STEP : FULL_STEPS[this.stepIndex];
    if (!step) {
      this.hideHint();
      return;
    }
    this.els.hint.classList.remove("hidden");
    this.els.hintTitle.textContent = step.title;
    this.els.hintBody.textContent = step.body;
    this.els.hint.dataset.step = step.id;
    this.els.hint.classList.toggle("move-step", step.id === "move");
  }

  hideHint() {
    this.els.hint.classList.add("hidden");
  }

  advanceTutorial() {
    if (this.tutorialMode === "refresher") {
      this.tutorialMode = "none";
      this.hideHint();
      return "complete-refresher";
    }
    this.stepIndex += 1;
    if (this.stepIndex >= FULL_STEPS.length) {
      this.tutorialMode = "none";
      this.hideHint();
      return "complete-full";
    }
    this.renderHint();
    return null;
  }

  renderSkins(skins, economy, onSelect) {
    this.els.skinGrid.innerHTML = "";
    for (const s of skins) {
      const owned = economy.ownedSkins.includes(s.id);
      const on = economy.equipped === s.id;
      const b = document.createElement("button");
      b.type = "button";
      b.className = "skin-card" + (on ? " on" : "") + (owned ? " owned" : "");
      const hex = `#${s.color.toString(16).padStart(6, "0")}`;
      b.innerHTML = `
        <span class="skin-orb" style="background:${hex}"></span>
        <span class="skin-name">${s.name}</span>
        <span class="skin-meta">${on ? "EQUIPPED" : owned ? "OWNED" : s.iap ? "IAP" : `${s.price}`}</span>`;
      b.onclick = () => onSelect(s);
      this.els.skinGrid.appendChild(b);
    }
  }
}
