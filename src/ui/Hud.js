import { FULL_STEPS, REFRESHER_STEP } from "../game/Tutorial.js";
import { STAR_UNLOCKS, SKIN_GROUPS, skinPreviewStyle } from "../content/skins.js";
import { campaignSnapshot, difficultyLabel, difficultyStars, difficultyTitle } from "../game/progress.js";

export class Hud {
  constructor(root) {
    this.root = root;
    this.capture = new URLSearchParams(location.search).has("capture");
    this.tutorialMode = "none";
    this.stepIndex = 0;
    this.onRestartRequest = null;
    this.onTutorialProgress = null;
    this._mapWorld = null;
    this.root.innerHTML = `
      <div class="safe ${this.capture ? "capture" : ""}" id="shell">
        <div id="splash" class="splash">
          <div class="splash-mark"></div>
          <h1 class="splash-title">BLOBTIDE</h1>
          <div class="splash-bar" aria-hidden="true"><i></i></div>
          <p class="splash-load">Loading…</p>
          <p class="splash-copy">Steer. Grow. Smash.</p>
        </div>

        <div id="scrim" class="scrim hidden"></div>
        <div id="cine-vignette" class="cine-vignette" aria-hidden="true"></div>

        <div class="hud-right" id="hud-right">
          <span class="score-pill hidden" id="score-pill">0</span>
          <div class="wallet" id="wallet">
            <span class="coin-ico" aria-hidden="true"></span>
            <span id="coins">0</span>
          </div>
        </div>

        <button type="button" id="mute-btn" class="icon-btn mute-btn" aria-label="Mute sound" aria-pressed="false">
          <span class="mute-ico" aria-hidden="true"></span>
        </button>

        <header class="play-hud hidden" id="play-hud">
          <button type="button" id="pause-btn" class="icon-btn" aria-label="Pause">
            <span class="pause-bars"></span>
          </button>
          <div class="hud-center">
            <div class="hud-rail">
              <div class="live-stars" id="live-stars" aria-label="Star progress">
                <b id="live-star-glyphs">★★☆</b>
              </div>
              <span class="level-pill" id="level-badge">Level 1</span>
            </div>
            <div class="combo-box hidden" id="combo-box">
              <span class="combo-kicker">Combo</span>
              <div class="combo" id="combo" data-tier="0">×2</div>
              <span class="combo-goal" id="combo-goal"></span>
            </div>
            <div class="crowd-hero">
              <span class="lbl hidden" id="crowd-lbl">BLOBS</span>
              <span id="count">0</span>
            </div>
            <div class="fight-hud hidden" id="fight-hud">
              <div class="fight-side blobs">
                <small>BLOBS</small>
                <b id="fight-blobs">0</b>
              </div>
              <span class="fight-vs">VS</span>
              <div class="fight-side rivals">
                <small id="fight-rivals-lbl">Sepoys</small>
                <b id="fight-rivals">0</b>
              </div>
            </div>
            <div class="run-wrap">
              <div class="run-bar" aria-hidden="true"><i id="run-fill"></i></div>
            </div>
            <div class="streak-pill hidden" id="streak-pill"></div>
            <div class="buffs">
              <span id="boost-pip" class="pip hidden">BOOST</span>
              <span id="magnet-pip" class="pip hidden">MAGNET</span>
              <span id="star-pip" class="pip hidden">x2</span>
              <span id="shield-pip" class="pip hidden">SHIELD</span>
              <span id="snare-pip" class="pip hidden">SNARE</span>
              <span id="hound-pip" class="pip hidden">HOUND</span>
            </div>
          </div>
        </header>

        <div id="speedlines" class="speedlines hidden" aria-hidden="true"></div>
        <div id="combo-flash" class="combo-flash" aria-hidden="true"></div>
        <div id="storm-flash" class="storm-flash" aria-hidden="true"></div>
        <div id="star-flash" class="star-flash" aria-hidden="true"></div>
        <div id="coin-flash" class="coin-flash" aria-hidden="true"></div>
        <div id="float" class="float"></div>
        <div id="coin-fx" class="coin-fx" aria-hidden="true"></div>
        <div id="toast" class="toast hidden"></div>

        <div id="hint" class="hint-card hidden">
          <div class="arrows" aria-hidden="true"><span>←</span><span class="blob-dot"></span><span>→</span></div>
          <h3 id="hint-title"></h3>
          <p id="hint-body"></p>
          <div class="hint-actions">
            <button type="button" id="hint-next" class="cta sm">Got it</button>
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
            <p class="tag">Steer slime. Pick gates. Smash the door.</p>
            <div class="hook" id="hook">
              <span class="chip" id="hook-streak">STREAK 0</span>
              <span class="chip" id="hook-mission">Win 3 levels</span>
              <span class="chip dim" id="hook-skin"></span>
            </div>
          </div>
          <button type="button" id="play" class="cta play-cta">Play</button>
          <nav class="dock">
            <button type="button" id="levels" class="dock-btn" aria-label="Levels">
              <span class="dock-ico map"></span>
              <small>Levels</small>
            </button>
            <button type="button" id="skins" class="dock-btn" aria-label="Skins">
              <span class="dock-ico bag"></span>
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

        <section id="levels-sheet" class="sheet hidden">
          <div class="sheet-head">
            <h2 id="map-title">Map</h2>
            <p class="star-total" id="star-total"></p>
            <button type="button" id="levels-back" class="icon-btn x" aria-label="Close">✕</button>
          </div>
          <div class="map-stats" id="map-stats"></div>
          <div class="map-goals" id="map-goals"></div>
          <div id="world-map" class="world-map"></div>
          <div id="level-grid" class="level-grid hidden"></div>
        </section>

        <section id="shop" class="sheet shop-sheet hidden">
          <div class="sheet-head">
            <h2>Blob Shop</h2>
            <button type="button" id="shop-back" class="icon-btn x" aria-label="Close">✕</button>
          </div>
          <p class="shop-kicker">Looks, paints, and star drops. Equip a skin and the whole pack wears it.</p>
          <div id="skin-grid" class="skin-grid"></div>
          <div class="packs">
            <button type="button" data-pack="small"><b>+200</b><span>0.99</span></button>
            <button type="button" data-pack="medium"><b>+1000</b><span>3.99</span></button>
            <button type="button" data-pack="prism"><b>PRISM</b><span>IAP</span></button>
          </div>
          <p class="shop-legal">Star looks: Reef (1★ on 5), Dusk Tide (2★ on 8), Prestige (3★ on 1–10). Coins buy paints and looks.</p>
        </section>

        <section id="help" class="sheet hidden">
          <div class="sheet-head">
            <h2>Settings</h2>
            <button type="button" id="help-back" class="icon-btn x" aria-label="Close">✕</button>
          </div>
          <ul class="help-list">
            <li><strong>Steer</strong> Drag, or use arrows / A D.</li>
            <li><strong>Gates</strong> Green + and x grow you. Red − and / shrink you.</li>
            <li><strong>Fight</strong> Sepoys and the warden. Bigger number wins. Leftover blobs stay.</li>
            <li><strong>Stars</strong> Clear 1. No hits 2. Combo 15x 3.</li>
            <li><strong>Traps</strong> Red boards, red −10/−20/−30 coins, snares, and a sand hound. Pull ahead with green gates or a boost — stall a fight and it bites.</li>
            <li><strong>Pause</strong> Top-left, or P / Esc. R restarts from pause or results.</li>
          </ul>
          <label class="switch"><input type="checkbox" id="mute-toggle" /><span></span> Mute music & SFX</label>
          <label class="vol">Music <input type="range" id="music-vol" min="0" max="100" value="70" /></label>
          <label class="vol">SFX <input type="range" id="sfx-vol" min="0" max="100" value="100" /></label>
          <label class="switch"><input type="checkbox" id="hide-toggle" /><span></span> Hide tips</label>
          <button type="button" id="replay-tutorial" class="ghost">Replay tutorial</button>
        </section>

        <section id="pause" class="overlay-card hidden">
          <p class="pause-ico" aria-hidden="true">⏸</p>
          <h2>Paused</h2>
          <p class="pause-meta" id="pause-meta"></p>
          <button type="button" id="resume" class="cta">Resume</button>
          <button type="button" id="pause-mute" class="ghost">Mute</button>
          <button type="button" id="pause-retry" class="ghost">Restart</button>
          <button type="button" id="pause-menu" class="text-btn">Home</button>
        </section>

        <section id="result" class="overlay-card hidden">
          <div class="confetti" aria-hidden="true"></div>
          <div class="result-badge" id="result-badge"></div>
          <h2 id="result-title"></h2>
          <p id="result-sub"></p>
          <div id="result-star-row" class="star-row hidden" hidden>
            <div class="star-slot" data-star="1"><span class="star-glyph">★</span><small>Clear</small></div>
            <div class="star-slot" data-star="2"><span class="star-glyph">★</span><small>No hits</small></div>
            <div class="star-slot" data-star="3"><span class="star-glyph">★</span><small>Combo 15x</small></div>
          </div>
          <p id="result-stars" class="stars" hidden></p>
          <p id="result-best" class="best-line" hidden></p>
          <button type="button" id="result-primary" class="cta"></button>
          <button type="button" id="result-secondary" class="ghost ad-btn"></button>
          <button type="button" id="result-replay" class="ghost">Replay</button>
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
      scrim: this.root.querySelector("#scrim"),
      cineVignette: this.root.querySelector("#cine-vignette"),
      count: this.root.querySelector("#count"),
      crowdLbl: this.root.querySelector("#crowd-lbl"),
      fightHud: this.root.querySelector("#fight-hud"),
      fightBlobs: this.root.querySelector("#fight-blobs"),
      fightRivals: this.root.querySelector("#fight-rivals"),
      fightRivalsLbl: this.root.querySelector("#fight-rivals-lbl"),
      coins: this.root.querySelector("#coins"),
      playHud: this.root.querySelector("#play-hud"),
      combo: this.root.querySelector("#combo"),
      comboBox: this.root.querySelector("#combo-box"),
      comboGoal: this.root.querySelector("#combo-goal"),
      pauseMeta: this.root.querySelector("#pause-meta"),
      liveStars: this.root.querySelector("#live-stars"),
      liveStarGlyphs: this.root.querySelector("#live-star-glyphs"),
      boostPip: this.root.querySelector("#boost-pip"),
      magnetPip: this.root.querySelector("#magnet-pip"),
      starPip: this.root.querySelector("#star-pip"),
      shieldPip: this.root.querySelector("#shield-pip"),
      snarePip: this.root.querySelector("#snare-pip"),
      houndPip: this.root.querySelector("#hound-pip"),
      scorePill: this.root.querySelector("#score-pill"),
      runFill: this.root.querySelector("#run-fill"),
      speedlines: this.root.querySelector("#speedlines"),
      comboFlash: this.root.querySelector("#combo-flash"),
      stormFlash: this.root.querySelector("#storm-flash"),
      starFlash: this.root.querySelector("#star-flash"),
      coinFlash: this.root.querySelector("#coin-flash"),
      wallet: this.root.querySelector("#wallet"),
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
      resultStarRow: this.root.querySelector("#result-star-row"),
      resultStars: this.root.querySelector("#result-stars"),
      resultBest: this.root.querySelector("#result-best"),
      resultPrimary: this.root.querySelector("#result-primary"),
      resultSecondary: this.root.querySelector("#result-secondary"),
      resultReplay: this.root.querySelector("#result-replay"),
      resultMenu: this.root.querySelector("#result-menu"),
      play: this.root.querySelector("#play"),
      hook: this.root.querySelector("#hook"),
      hookStreak: this.root.querySelector("#hook-streak"),
      hookMission: this.root.querySelector("#hook-mission"),
      hookSkin: this.root.querySelector("#hook-skin"),
      streakPill: this.root.querySelector("#streak-pill"),
      skins: this.root.querySelector("#skins"),
      levels: this.root.querySelector("#levels"),
      levelsSheet: this.root.querySelector("#levels-sheet"),
      levelsBack: this.root.querySelector("#levels-back"),
      mapTitle: this.root.querySelector("#map-title"),
      mapStats: this.root.querySelector("#map-stats"),
      mapGoals: this.root.querySelector("#map-goals"),
      worldMap: this.root.querySelector("#world-map"),
      levelGrid: this.root.querySelector("#level-grid"),
      starTotal: this.root.querySelector("#star-total"),
      how: this.root.querySelector("#how"),
      iap: this.root.querySelector("#iap"),
      shopBack: this.root.querySelector("#shop-back"),
      helpBack: this.root.querySelector("#help-back"),
      skinGrid: this.root.querySelector("#skin-grid"),
      ad: this.root.querySelector("#ad"),
      adTitle: this.root.querySelector("#ad-title"),
      adBody: this.root.querySelector("#ad-body"),
      pauseBtn: this.root.querySelector("#pause-btn"),
      muteBtn: this.root.querySelector("#mute-btn"),
      pauseMute: this.root.querySelector("#pause-mute"),
      resume: this.root.querySelector("#resume"),
      pauseRetry: this.root.querySelector("#pause-retry"),
      pauseMenu: this.root.querySelector("#pause-menu"),
      hint: this.root.querySelector("#hint"),
      hintTitle: this.root.querySelector("#hint-title"),
      hintBody: this.root.querySelector("#hint-body"),
      hintNext: this.root.querySelector("#hint-next"),
      hintSkip: this.root.querySelector("#hint-skip"),
      hintHide: this.root.querySelector("#hint-hide"),
      muteToggle: this.root.querySelector("#mute-toggle"),
      musicVol: this.root.querySelector("#music-vol"),
      sfxVol: this.root.querySelector("#sfx-vol"),
      hideToggle: this.root.querySelector("#hide-toggle"),
      replayTutorial: this.root.querySelector("#replay-tutorial"),
    };
    this.allowRewarded = false;
    setTimeout(() => {
      this.els.splash?.classList.add("gone");
      this.els.splash?.setAttribute("aria-hidden", "true");
    }, 180);
    setTimeout(() => this.els.splash?.classList.add("hidden"), 700);
  }

  hideSplash() {
    this.els.splash?.classList.add("gone");
    this.els.splash?.classList.add("hidden");
    this.els.splash?.setAttribute("aria-hidden", "true");
  }

  setVignette(k = 0, { pain } = {}) {
    const el = this.els.cineVignette;
    if (!el) return;
    el.style.opacity = String(Math.max(0, Math.min(1, k)));
    if (pain === true) el.classList.add("pain");
    else if (pain === false || k <= 0.02) el.classList.remove("pain");
  }

  painFlash() {
    const el = this.els.stormFlash;
    if (!el) return;
    el.classList.remove("pop", "pain");
    void el.offsetWidth;
    el.classList.add("pain", "pop");
  }

  setMuted(on) {
    const muted = !!on;
    this.els.muteBtn?.classList.toggle("is-muted", muted);
    this.els.muteBtn?.setAttribute("aria-pressed", muted ? "true" : "false");
    this.els.muteBtn?.setAttribute("aria-label", muted ? "Unmute sound" : "Mute sound");
    if (this.els.muteToggle) this.els.muteToggle.checked = muted;
    if (this.els.pauseMute) this.els.pauseMute.textContent = muted ? "Unmute" : "Mute";
  }

  setCoins(n) {
    const next = Math.max(0, n | 0);
    if (this._coinShown == null) {
      this._coinShown = next;
      this._coinGoal = next;
      this.els.coins.textContent = String(next);
      return;
    }
    this._coinFrom = this._coinShown;
    this._coinGoal = next;
    this._coinAnim = 0.2;
    this.els.wallet?.classList.remove("gold-flash", "pop");
    void this.els.wallet?.offsetWidth;
    this.els.wallet?.classList.add("gold-flash", "pop");
  }

  tickCoins(dt = 0.016) {
    if (this._coinAnim == null || this._coinAnim <= 0) return;
    this._coinAnim = Math.max(0, this._coinAnim - dt);
    const u = 1 - this._coinAnim / 0.2;
    this._coinShown = Math.round(this._coinFrom + (this._coinGoal - this._coinFrom) * u);
    if (this._coinAnim <= 0) this._coinShown = this._coinGoal;
    this.els.coins.textContent = String(this._coinShown);
  }

  setHook(view) {
    if (!view) return;
    if (this.els.hookStreak) this.els.hookStreak.textContent = `Streak ${view.winStreak}`;
    if (this.els.hookMission) this.els.hookMission.textContent = view.mission;
    if (this.els.hookSkin) {
      const s = view.nextSkin;
      this.els.hookSkin.textContent = s ? `${s.name} ${Math.min(s.have, s.price)}/${s.price}` : "All skins owned";
    }
    this.setStreak(view.winStreak);
  }

  setStreak(n) {
    if (!this.els.streakPill) return;
    const v = Math.max(0, n | 0);
    this.els.streakPill.textContent = `Streak ${v}`;
    this.els.streakPill.classList.toggle("hidden", v < 2);
    this.els.streakPill.classList.toggle("hot", v >= 5);
  }

  setLevel(n, worldName) {
    if (this.els.levelBadge) this.els.levelBadge.textContent = worldName ? `${worldName} · ${n}` : `Level ${n}`;
  }

  setCombo(n) {
    if (!this.els.combo) return;
    const v = Math.max(0, n | 0);
    const tier = v >= 20 ? 20 : v >= 10 ? 10 : v >= 5 ? 5 : v >= 2 ? 2 : 0;
    this.els.combo.dataset.tier = String(tier);
    this.els.combo.classList.toggle("hot", v >= 20);
    if (v >= 2) {
      this.els.combo.textContent = `×${v}`;
      this.els.combo.classList.remove("hidden");
      this.els.comboBox?.classList.remove("hidden");
      if (this.els.comboGoal) {
        const next = v < 5 ? 5 : v < 10 ? 10 : v < 15 ? 15 : v < 20 ? 20 : 0;
        this.els.comboGoal.textContent = next ? `Next ×${next}` : "Peak";
      }
    } else {
      this.els.combo.classList.add("hidden");
      this.els.comboBox?.classList.add("hidden");
    }
  }

  setLiveStars({ hits = 0, combo = 0, playing = false } = {}) {
    const el = this.els.liveStarGlyphs || this.els.liveStars;
    if (!el) return;
    const clean = (hits | 0) <= 0;
    const comboOk = (combo | 0) >= 15;
    const glyphs = `${playing ? "★" : "☆"}${clean && playing ? "★" : "☆"}${comboOk && playing ? "★" : "☆"}`;
    if (this.els.liveStarGlyphs) this.els.liveStarGlyphs.textContent = glyphs;
    else this.els.liveStars.textContent = `Stars: ${glyphs}`;
    this.els.liveStars?.classList.toggle("hot", comboOk && clean && playing);
  }

  comboBounce() {
    const el = this.els.combo;
    if (!el) return;
    el.classList.remove("bounce", "deflate");
    void el.offsetWidth;
    el.classList.add("bounce");
  }

  comboGold() {
    const el = this.els.combo;
    if (!el) return;
    el.classList.remove("gold-glow");
    void el.offsetWidth;
    el.classList.add("gold-glow");
    setTimeout(() => el.classList.remove("gold-glow"), 500);
  }

  comboDeflate() {
    const el = this.els.combo;
    if (!el) return;
    el.classList.remove("bounce", "gold-glow");
    el.classList.add("deflate");
    setTimeout(() => {
      el.classList.add("hidden");
      el.classList.remove("deflate");
      this.els.comboBox?.classList.add("hidden");
    }, 280);
  }

  countCelebrate() {
    const el = this.els.count;
    if (!el) return;
    el.classList.remove("celebrate");
    void el.offsetWidth;
    el.classList.add("celebrate");
  }

  onComboMilestone(n) {
    this.comboFanfare(n);
    if (n >= 20) {
      this.comboBounce();
      this.comboGold();
      this.countCelebrate();
    } else if (n >= 10) {
      this.comboBounce();
      this.comboGold();
    } else this.comboBounce();
  }

  comboFanfare(n) {
    const el = this.els.comboFlash;
    if (!el) return;
    el.className = "combo-flash";
    void el.offsetWidth;
    el.classList.add("pop", n >= 20 ? "tier-20" : n >= 10 ? "tier-10" : "tier-5");
  }

  stormFlash() {
    const el = this.els.stormFlash;
    if (!el) return;
    el.classList.remove("pop");
    void el.offsetWidth;
    el.classList.add("pop");
  }

  setScore(n) {
    if (!this.els.scorePill) return;
    this.els.scorePill.textContent = `${Math.max(0, n | 0)}`;
    this.els.scorePill.classList.add("hidden");
  }

  setProgress(p) {
    if (this.els.runFill) this.els.runFill.style.width = `${Math.max(0, Math.min(1, p)) * 100}%`;
  }

  setSpeedFx(on, fever = false) {
    this.els.speedlines?.classList.toggle("hidden", !on);
    this.els.shell?.classList.toggle("boosting", !!on);
    this.els.shell?.classList.toggle("fever", !!fever);
  }

  setBuffs({ shield = false, shieldHits = 0, boost = false, magnet = false, star = false, snare = false, hound = false } = {}) {
    this.els.shieldPip?.classList.toggle("hidden", !shield);
    if (this.els.shieldPip && shield) this.els.shieldPip.textContent = `SHIELD ${Math.max(1, shieldHits | 0)}`;
    this.els.boostPip?.classList.toggle("hidden", !boost);
    this.els.magnetPip?.classList.toggle("hidden", !magnet);
    this.els.starPip?.classList.toggle("hidden", !star);
    this.els.starPip?.classList.toggle("hot", !!star);
    this.els.snarePip?.classList.toggle("hidden", !snare);
    this.els.houndPip?.classList.toggle("hidden", !hound);
    this.els.houndPip?.classList.toggle("hot", !!hound);
  }

  flashPip(kind) {
    const el = kind === "boost" ? this.els.boostPip : kind === "star" ? this.els.starPip : this.els.magnetPip;
    if (!el) return;
    el.classList.remove("flash");
    void el.offsetWidth;
    el.classList.add("flash");
    setTimeout(() => el.classList.remove("flash"), 700);
  }

  whiteFlash() {
    const el = this.els.starFlash || this.els.stormFlash;
    if (!el) return;
    el.classList.remove("pop", "white");
    void el.offsetWidth;
    el.classList.add("white", "pop");
  }

  setCount(n) {
    this._countGoal = Math.max(0, n | 0);
    const fighting = this.els.shell?.classList.contains("in-fight");
    if (!fighting) {
      this.els.count.classList.remove("pop");
      void this.els.count.offsetWidth;
      this.els.count.classList.add("pop");
    }
    if (this._countShown == null) {
      this._countShown = this._countGoal;
      this.els.count.textContent = String(this._countGoal);
    }
    if (this.els.fightBlobs && !this.els.fightHud?.classList.contains("hidden")) {
      this.els.fightBlobs.textContent = String(this._countGoal);
    }
  }

  setFight(blobs, rivals, { beast = false } = {}) {
    const on = rivals != null && rivals >= 0;
    this.els.fightHud?.classList.toggle("hidden", !on);
    this.els.shell?.classList.toggle("in-fight", on);
    this.els.fightHud?.classList.toggle("beast", !!beast);
    if (!on) return;
    if (this.els.fightBlobs) this.els.fightBlobs.textContent = String(Math.max(0, blobs | 0));
    if (this.els.fightRivals) this.els.fightRivals.textContent = String(Math.max(0, rivals | 0));
    if (this.els.fightRivalsLbl) this.els.fightRivalsLbl.textContent = beast ? "Warden" : "Sepoys";
  }

  tickCount(dt = 0.016) {
    if (this._countShown == null || this._countShown === this._countGoal) return;
    const d = this._countGoal - this._countShown;
    this._countShown += Math.sign(d) * Math.min(Math.abs(d), Math.max(1, Math.abs(d) * dt * 16));
    if (Math.abs(this._countGoal - this._countShown) < 0.51) this._countShown = this._countGoal;
    this.els.count.textContent = String(Math.round(this._countShown));
  }

  _setScrim(on) {
    this.els.scrim?.classList.toggle("hidden", !on);
    this._syncChrome();
  }

  _syncChrome() {
    const overlay =
      !this.els.result.classList.contains("hidden") ||
      !this.els.pause.classList.contains("hidden") ||
      !this.els.shop.classList.contains("hidden") ||
      !this.els.help.classList.contains("hidden") ||
      !this.els.levelsSheet?.classList.contains("hidden");
    this.els.shell?.classList.toggle("overlay-up", overlay);
  }

  setPlaying(on) {
    this.els.menu.classList.toggle("hidden", on);
    this.els.shop.classList.add("hidden");
    this.els.help.classList.add("hidden");
    this.els.levelsSheet?.classList.add("hidden");
    if (on) this.els.result.classList.add("hidden");
    this.els.playHud.classList.toggle("hidden", !on);
    this.els.pauseBtn.classList.toggle("hidden", !on);
    this.els.scorePill?.classList.add("hidden");
    this.els.shell.classList.toggle("in-play", on);
    this._setScrim(false);
    if (!on) this.setFight(0, null);
  }

  showMenu() {
    this.els.menu.classList.remove("hidden");
    this.els.shop.classList.add("hidden");
    this.els.help.classList.add("hidden");
    this.els.levelsSheet?.classList.add("hidden");
    this.els.result.classList.add("hidden");
    this.els.pause.classList.add("hidden");
    this.els.playHud.classList.add("hidden");
    this.els.pauseBtn.classList.add("hidden");
    this.els.scorePill?.classList.add("hidden");
    this.els.shell.classList.remove("in-play");
    this._setScrim(false);
    this.setFight(0, null);
    this.hideHint();
  }

  showLevels() {
    this.els.menu.classList.add("hidden");
    this.els.shop.classList.add("hidden");
    this.els.help.classList.add("hidden");
    this.els.result.classList.add("hidden");
    this.els.levelsSheet.classList.remove("hidden");
    this._setScrim(true);
  }

  mapBack() {
    if (this._mapWorld) {
      this._mapWorld = null;
      if (this._mapRender) this._mapRender();
      return true;
    }
    return false;
  }

  showShop() {
    this._showOnly("shop");
  }

  showHelp() {
    this.els.menu.classList.add("hidden");
    this.els.shop.classList.add("hidden");
    this.els.levelsSheet?.classList.add("hidden");
    this.els.help.classList.remove("hidden");
    this.els.result.classList.add("hidden");
    this._setScrim(true);
  }

  _showOnly(id) {
    for (const key of ["menu", "shop", "help", "result"]) {
      this.els[key].classList.toggle("hidden", key !== id);
    }
    this._setScrim(id === "shop" || id === "help");
  }

  setPaused(on) {
    this.els.pause.classList.toggle("hidden", !on);
    this.els.pauseBtn.classList.toggle("hidden", on || !this.els.shell.classList.contains("in-play"));
    if (!this.els.result.classList.contains("hidden")) {
      this.els.pause.classList.add("hidden");
      return;
    }
    if (on && this.els.pauseMeta) {
      const crowd = this.els.count?.textContent || "0";
      const combo = this.els.combo?.classList.contains("hidden") ? "—" : this.els.combo.textContent;
      const coins = this.els.coins?.textContent || "0";
      const level = this.els.levelBadge?.textContent || "";
      this.els.pauseMeta.textContent = [level, crowd, combo, coins].filter(Boolean).join("  ·  ");
    }
    if (this.els.shell.classList.contains("in-play")) this._setScrim(on);
  }

  showResult({ title, subtitle, primary, secondary, mode, stars = 0, best = null, leftover, crowd, flags = null, bestStars = 0 }) {
    this.els.result.classList.remove("hidden");
    this.els.result.classList.remove("pop-in");
    void this.els.result.offsetWidth;
    this.els.result.classList.add("pop-in");
    this.els.pause.classList.add("hidden");
    this.els.pauseBtn.classList.add("hidden");
    this.els.playHud.classList.add("hidden");
    this.els.scorePill?.classList.add("hidden");
    this.setFight(0, null);
    this._setScrim(true);
    this.els.resultTitle.textContent = title;
    this.els.resultSub.textContent = subtitle;
    this.els.resultPrimary.textContent = primary;
    this.els.resultSecondary.textContent = secondary;
    this.els.resultSecondary.classList.toggle("hidden", !this.allowRewarded);
    if (this.els.resultReplay) this.els.resultReplay.classList.toggle("hidden", mode === "fail");
    this.els.result.dataset.mode = mode;
    this.els.result.classList.toggle("win", mode === "win");
    this.els.result.classList.toggle("fail", mode === "fail");
    this.els.resultBadge.textContent = mode === "win" ? "★" : "!";
    this.els.resultSecondary.disabled = false;
    this.els.resultPrimary.disabled = false;
    if (this.els.resultReplay) this.els.resultReplay.disabled = false;
    this._paintResultStars(mode, stars, flags, bestStars || best?.stars || 0);
    if (this.els.resultBest) {
      if (mode === "win" && crowd != null) {
        this.els.resultBest.hidden = false;
        const kept = Math.max(stars, bestStars || 0, best?.stars || 0);
        const bestTxt = kept ? ` · BEST ${"★".repeat(kept)}` : "";
        this.els.resultBest.textContent = `Crowd ${crowd} · leftover ${leftover ?? 0}${bestTxt}`;
      } else this.els.resultBest.hidden = true;
    }
  }

  _paintResultStars(mode, stars, flags, bestStars) {
    clearTimeout(this._starAnim);
    const row = this.els.resultStarRow;
    const text = this.els.resultStars;
    if (mode !== "win" || stars <= 0 && !flags?.clear) {
      if (row) {
        row.hidden = true;
        row.classList.add("hidden");
      }
      if (text) text.hidden = true;
      return;
    }
    const earned = flags
      ? [!!flags.clear, !!flags.clean, !!flags.combo]
      : [stars >= 1, stars >= 2, stars >= 3];
    if (text) {
      text.hidden = true;
      text.textContent = `${"★".repeat(stars)}${"☆".repeat(Math.max(0, 3 - stars))}`;
    }
    if (!row) {
      if (text) text.hidden = false;
      return;
    }
    row.hidden = false;
    row.classList.remove("hidden");
    const slots = [...row.querySelectorAll(".star-slot")];
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
    slots.forEach((slot, i) => {
      slot.classList.toggle("on", earned[i]);
      slot.classList.remove("pop");
    });
    const pop = (i) => {
      const slot = slots[i];
      if (slot && earned[i]) slot.classList.add("pop");
    };
    if (reduce) {
      earned.forEach((_, i) => pop(i));
      return;
    }
    let step = 0;
    const tick = () => {
      while (step < 3 && !earned[step]) step += 1;
      if (step >= 3) return;
      pop(step);
      step += 1;
      this._starAnim = setTimeout(tick, 220);
    };
    this._starAnim = setTimeout(tick, 120);
  }

  disableSecondary() {
    if (this.els.resultSecondary) this.els.resultSecondary.disabled = true;
  }

  setResultSubtitle(text) {
    this.els.resultSub.textContent = text;
  }

  hideResult() {
    clearTimeout(this._starAnim);
    this.els.result.classList.add("hidden");
    this.els.resultPrimary.disabled = false;
    this.els.resultSecondary.disabled = false;
    this._setScrim(false);
    if (this.els.shell.classList.contains("in-play")) {
      this.els.playHud.classList.remove("hidden");
      this.els.pauseBtn.classList.remove("hidden");
      this.els.scorePill?.classList.add("hidden");
    }
  }

  toast(text) {
    const next = String(text || "");
    if (!next) return;
    this.els.toast.textContent = next;
    this.els.toast.classList.remove("hidden");
    clearTimeout(this._toast);
    this._toast = setTimeout(() => this.els.toast.classList.add("hidden"), 1400);
  }

  hideToast() {
    clearTimeout(this._toast);
    this.els.toast?.classList.add("hidden");
  }

  floatText(text, color, extraClass) {
    const host = this.els.float;
    if (!host) return;
    host.replaceChildren();
    const n = document.createElement("div");
    n.className = extraClass ? `floater ${extraClass}` : "floater";
    n.textContent = text;
    n.style.color = color;
    host.appendChild(n);
    setTimeout(() => n.remove(), 720);
  }

  burstCoins(amount, from) {
    const flash = this.els.coinFlash;
    if (flash) {
      flash.classList.remove("pop");
      void flash.offsetWidth;
      flash.classList.add("pop");
    }
    this.els.wallet?.classList.remove("gold-flash", "pop");
    void this.els.wallet?.offsetWidth;
    this.els.wallet?.classList.add("gold-flash", "pop");
    const host = this.els.coinFx;
    const wallet = this.els.wallet?.getBoundingClientRect();
    const origin = host?.getBoundingClientRect();
    if (!host || !wallet || !origin) return;
    const n = Math.min(8, Math.max(1, 1 + Math.floor(amount / 12)));
    const ox = origin.left;
    const oy = origin.top;
    const sx = (from?.x ?? ox) - ox;
    const sy = (from?.y ?? oy) - oy;
    const tx = wallet.left + wallet.width * 0.35 - ox;
    const ty = wallet.top + wallet.height * 0.45 - oy;
    for (let i = 0; i < n; i++) {
      const d = document.createElement("span");
      d.className = "coin-bit";
      d.style.setProperty("--sx", `${sx + (Math.random() - 0.5) * 18}px`);
      d.style.setProperty("--sy", `${sy + (Math.random() - 0.5) * 14}px`);
      d.style.setProperty("--tx", `${tx + (Math.random() - 0.5) * 10}px`);
      d.style.setProperty("--ty", `${ty}px`);
      d.style.animationDelay = `${i * 28}ms`;
      host.appendChild(d);
      setTimeout(() => d.remove(), 450);
    }
  }

  flyMark(text, from, toEl) {
    const host = this.els.coinFx;
    const origin = host?.getBoundingClientRect();
    const dest = toEl?.getBoundingClientRect();
    if (!host || !origin || !dest) return;
    const d = document.createElement("span");
    d.className = "plus-bit";
    d.textContent = text;
    d.style.setProperty("--sx", `${(from?.x ?? origin.left) - origin.left}px`);
    d.style.setProperty("--sy", `${(from?.y ?? origin.top) - origin.top}px`);
    d.style.setProperty("--tx", `${dest.left + dest.width * 0.5 - origin.left}px`);
    d.style.setProperty("--ty", `${dest.top + dest.height * 0.4 - origin.top}px`);
    host.appendChild(d);
    setTimeout(() => d.remove(), 450);
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
    this.els.shell?.classList.add("has-hint");
    this.els.hintTitle.textContent = step.title;
    this.els.hintBody.textContent = step.body;
    this.els.hint.dataset.step = step.id;
    this.els.hint.classList.toggle("move-step", step.id === "move");
  }

  hideHint() {
    this.els.hint.classList.add("hidden");
    this.els.shell?.classList.remove("has-hint");
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
    for (const group of SKIN_GROUPS) {
      const rows = skins.filter((s) => (s.group || "paint") === group.id);
      if (!rows.length) continue;
      const h = document.createElement("p");
      h.className = "shop-group";
      h.textContent = group.title;
      this.els.skinGrid.appendChild(h);
      for (const s of rows) {
        const owned = economy.ownedSkins.includes(s.id);
        const on = economy.equipped === s.id;
        const lock = s.starLock ? STAR_UNLOCKS[s.starLock] : null;
        const b = document.createElement("button");
        b.type = "button";
        b.className = "skin-card" + (on ? " on" : "") + (owned ? " owned" : "") + (lock && !owned ? " star-lock" : "");
        const meta = on ? "EQUIPPED" : owned ? "OWNED" : lock ? lock.hint : s.iap ? "IAP" : `${s.price}`;
        b.innerHTML = `
          <span class="skin-orb" style="background:${skinPreviewStyle(s)}"></span>
          <span class="skin-name">${s.name}</span>
          <span class="skin-meta">${meta}</span>`;
        b.onclick = () => onSelect(s);
        this.els.skinGrid.appendChild(b);
      }
    }
  }

  renderLevels(total, economy, onPick, onLocked) {
    this._mapOnPick = onPick;
    this._mapOnLocked = onLocked;
    this._mapEconomy = economy;
    this._mapTotal = total;
    this._mapRender = () => this.renderLevels(total, economy, onPick, onLocked);
    const snap = campaignSnapshot(economy, Math.max(0, (total | 0) - 1));
    if (this.els.starTotal) this.els.starTotal.textContent = `${snap.stars} / ${snap.starMax} ★`;
    if (this.els.mapStats) {
      this.els.mapStats.innerHTML = `
        <span><b>${snap.completed}</b> / ${snap.totalLevels} cleared</span>
        <span><b>${snap.stars}</b> / ${snap.starMax} ★</span>
        <span>Best combo <b>${snap.bestCombo}x</b></span>
        <span>Streak <b>${snap.bestStreak}</b></span>
        <span>Time <b>${snap.playLabel}</b></span>`;
    }
    if (this.els.mapGoals) {
      const skin = snap.nextSkin;
      const skinLine = skin
        ? `${skin.name}: ${skin.need > 0 ? `${skin.need} more ★` : skin.hint}`
        : "All star skins unlocked";
      this.els.mapGoals.innerHTML = `
        <p>Next level <b>${snap.nextLevel}</b></p>
        <p>${skinLine}</p>
        <p>${snap.mission || ""}</p>`;
    }
    const world = snap.worlds.find((w) => w.id === this._mapWorld);
    if (this.els.mapTitle) this.els.mapTitle.textContent = world ? world.name : "MAP";
    if (this.els.worldMap) {
      this.els.worldMap.classList.toggle("hidden", !!world);
      if (!world) {
        this.els.worldMap.innerHTML = "";
        for (const w of snap.worlds) {
          const card = document.createElement("button");
          card.type = "button";
          card.className = "world-card" + (w.complete ? " complete" : "") + (w.current ? " now" : "") + (w.dim ? " dim" : "");
          card.style.setProperty("--tint", w.tint);
          card.innerHTML = `
            <span class="world-head"><b>${w.name}</b><small>${w.from}–${w.to}</small></span>
            <code>${w.bar} ${w.stars}/${w.starMax}</code>
            <span class="world-bar" aria-hidden="true"><i style="width:${w.pct}%"></i></span>`;
          card.onclick = () => {
            this._mapWorld = w.id;
            this.renderLevels(total, economy, onPick, onLocked);
          };
          this.els.worldMap.appendChild(card);
        }
      }
    }
    if (!this.els.levelGrid) return;
    this.els.levelGrid.classList.toggle("hidden", !world);
    if (!world) {
      this.els.levelGrid.innerHTML = "";
      return;
    }
    this.els.levelGrid.innerHTML = "";
    for (let id = world.from; id <= world.to; id++) {
      const i = id - 1;
      const open = economy.isUnlocked(i);
      const stat = economy.stats?.[i];
      const n = Math.max(0, Math.min(3, stat?.stars | 0));
      const b = document.createElement("button");
      b.type = "button";
      b.className = "lvl-btn" + (open ? "" : " locked") + (stat?.completed ? " done" : "") + (n >= 3 ? " perfect" : "") + (open && i === economy.levelIndex ? " now" : "");
      b.setAttribute("aria-label", difficultyTitle(id));
      const idEl = document.createElement("span");
      idEl.className = "lvl-id";
      idEl.textContent = String(id);
      const d = document.createElement("small");
      d.className = "lvl-diff";
      d.textContent = `${difficultyStars(id)} ${difficultyLabel(id)}`;
      const s = document.createElement("small");
      s.className = "lvl-stars";
      s.textContent = `${"★".repeat(n)}${"☆".repeat(3 - n)}`;
      b.append(idEl, d, s);
      b.onclick = () => {
        if (open) onPick?.(i);
        else onLocked?.(id);
      };
      this.els.levelGrid.appendChild(b);
    }
  }
}
