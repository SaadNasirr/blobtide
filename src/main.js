import { allowMockPurchases, isNativeApp } from "./config.js";
import { LEVELS, simulatePlay } from "./content/levels.js";
import { SKINS } from "./content/skins.js";
import { Economy } from "./game/Economy.js";
import { AdsService, IapService, Analytics, Consent } from "./game/Services.js";
import { Game } from "./game/Game.js";
import { Hud } from "./ui/Hud.js";
import {
  TutorialStore,
  beginPlaySession,
  applyTutorialEvent,
} from "./game/Tutorial.js";
import { SettingsStore } from "./game/Settings.js";
import { Platform } from "./platform/adapter.js";
import { crazyGamesLoadingStart, crazyGamesLoadingStop, installCrazyGamesPlatform, isCrazyGamesHost, muteAudioFromSearch } from "./platform/crazygames.js";
import { worldForLevel } from "./content/themes.js";

crazyGamesLoadingStart();

function showBootError(err) {
  const msg = String(err?.message || err || "unknown error");
  const bootLine = document.querySelector("#boot-home p");
  if (bootLine) bootLine.textContent = msg;
  if (document.getElementById("boot-err")) return;
  const p = document.createElement("p");
  p.id = "boot-err";
  p.setAttribute(
    "style",
    "position:absolute;left:16px;right:16px;bottom:24px;z-index:99;color:#fff;font-family:sans-serif;background:#4a1840ee;padding:14px;border-radius:12px"
  );
  p.textContent = `Blobtide failed to start: ${msg}`;
  (document.body || document.documentElement).appendChild(p);
}

function bootBlobtide() {
  if (window.__blobtideStarted) return true;
  const canvas = document.querySelector("#game");
  const hudRoot = document.querySelector("#hud");
  if (!canvas || !hudRoot) return false;
  let hud;
  try {
    hud = new Hud(hudRoot);
  } catch (err) {
    showBootError(err);
    return false;
  }
  window.__blobtideStarted = true;
  try {
if (window.__blobtideCleanup) window.__blobtideCleanup();

let game;
try {
  game = new Game(document.querySelector("#game") || canvas, hud);
} catch (err) {
  console.error(err);
  hud.toast(String(err.message || err));
  game = {
    state: "menu",
    paused: false,
    ended: true,
    lastReward: 0,
    levelIndex: 0,
    movedEnough: false,
    skinId: "lime",
    sfx: { ui() {}, ensure() {}, setMuted() {}, startMusic() {}, stopMusic() {} },
    applyAudio() {},
    setMuted() {},
    startLevel() {},
    togglePause() {},
    goMenu() {
      hud.showMenu();
    },
    continueWithBurst() {},
    doubleCoins() {},
    tick() {},
    dispose() {},
  };
}

window.__blobtideCleanup = () => {
  game?.dispose?.();
  if (window.__blobtideMoveWatch) {
    cancelAnimationFrame(window.__blobtideMoveWatch);
    window.__blobtideMoveWatch = 0;
  }
};
if (import.meta.hot) import.meta.hot.dispose(() => window.__blobtideCleanup?.());
const economy = Economy.load();
const ads = new AdsService(economy, hud);
const iap = new IapService(economy);
let tutorial = TutorialStore.load();
let settings = SettingsStore.load();
if (muteAudioFromSearch(location.search)) settings.muted = true;
let replayTutorial = false;

hud.setCoins(economy.coins);
if (hud.els.muteToggle) hud.els.muteToggle.checked = settings.muted;
hud.setMuted(settings.muted);
if (hud.els.musicVol) hud.els.musicVol.value = String(Math.round(settings.music * 100));
if (hud.els.sfxVol) hud.els.sfxVol.value = String(Math.round(settings.sfx * 100));
game.applyAudio(settings);

game.onCoin = (n) => {
  economy.addCoins(n);
  hud.setCoins(economy.coins);
  if (n > 0) {
    Analytics.event("coins_collected", { amount: n });
    const done = economy.pushMission("coins", n);
    if (done.completed) hud.toast(`${done.mission.label} · +${done.reward}`);
  }
  refreshHook();
};

if (!isNativeApp() && hud.els.iap) {
  hud.els.iap.classList.add("hidden");
  hud.root.querySelector(".packs")?.classList.add("hidden");
}

if (economy.maxUnlocked > 0 && hud.els.play) hud.els.play.textContent = "Continue";
if (hud.els.hideToggle) hud.els.hideToggle.checked = tutorial.hideInstructions;

function refreshHook() {
  const view = economy.hookView();
  hud.setHook(view);
  if (view.winStreak >= 2 && hud.els.play) hud.els.play.textContent = "Keep going";
  else if (economy.maxUnlocked > 0 && hud.els.play) hud.els.play.textContent = "Continue";
}

const daily = economy.claimDaily();
hud.setCoins(economy.coins);
if (daily.claim > 0) hud.toast(`Day ${daily.streak} bonus · +${daily.claim}`);
refreshHook();

game.onCombo = () => {
  const done = economy.pushMission("combo", 1);
  if (done.completed) hud.toast(`${done.mission.label} · +${done.reward}`);
  refreshHook();
};

function persistTutorial() {
  TutorialStore.save(tutorial);
  hud.els.hideToggle.checked = tutorial.hideInstructions;
}

function clickSound() {
  game.sfx.ui();
  game.sfx.ensure();
  if (!game.sfx.muted) game.sfx.startMusic();
}

function currentLevel() {
  const i = Math.min(economy.levelIndex, LEVELS.length - 1);
  return { level: LEVELS[i], index: i };
}

let sessionLive = false;
function play({ countSession = true } = {}) {
  if (!sessionLive) {
    sessionLive = true;
    Analytics.event("game_started");
  }
  if (economy.campaignComplete && game.state === "menu") {
    economy.beginNewRun();
    hud.toast("New run · Level 1");
  }
  const { level, index } = currentLevel();
  hud.setCoins(economy.coins);
  game.streakAtStart = economy.winStreak;
  refreshHook();
  if (countSession || replayTutorial) {
    const started = beginPlaySession(tutorial, { replay: replayTutorial });
    tutorial = started.state;
    replayTutorial = false;
    persistTutorial();
    hud.startTutorial(started.mode);
    Analytics.event("tutorial_mode", { mode: started.mode });
  }
  game.startLevel(level, index, economy.equipped);
}

function restartLevel() {
  if (game.state === "menu") return;
  hud.hideResult();
  game.streakAtStart = economy.winStreak;
  const { level, index } = currentLevel();
  game.startLevel(level, index, economy.equipped);
}

hud.onRestartRequest = restartLevel;

hud.onTutorialProgress = (kind) => {
  if (hud.tutorialMode === "none") return;
  const step = hud.els.hint.dataset.step;
  if (kind === "gate" && step === "gates") finishHintStep();
  if (kind === "hazard" && step === "hazards") finishHintStep();
  if (kind === "win" && (step === "door" || hud.tutorialMode === "refresher")) finishHintStep();
};

function finishHintStep() {
  const event = hud.advanceTutorial();
  if (event) {
    tutorial = applyTutorialEvent(tutorial, event);
    persistTutorial();
  }
}

function watchMoveHint() {
  if (hud.tutorialMode === "full" && hud.els.hint.dataset.step === "move" && game.movedEnough) {
    finishHintStep();
  }
  window.__blobtideMoveWatch = requestAnimationFrame(watchMoveHint);
}
if (window.__blobtideMoveWatch) cancelAnimationFrame(window.__blobtideMoveWatch);
watchMoveHint();

hud.els.play.onclick = () => {
  clickSound();
  play();
};
hud.els.skins.onclick = () => {
  clickSound();
  hud.renderSkins(SKINS, economy, onSkin);
  hud.showShop();
};
hud.els.levels.onclick = () => {
  clickSound();
  hud._mapWorld = null;
  hud.renderLevels(LEVELS.length, economy, (index) => {
    economy.levelIndex = index;
    economy.save();
    hud.showMenu();
    play({ countSession: false });
  }, (id) => {
    hud.toast(`Level ${id} (locked) · Beat level ${id - 1} to unlock`);
  });
  hud.showLevels();
};
hud.els.levelsBack.onclick = () => {
  clickSound();
  if (hud.mapBack()) return;
  hud.showMenu();
};
hud.els.how.onclick = () => {
  clickSound();
  hud.showHelp();
};
hud.els.shopBack.onclick = () => {
  clickSound();
  hud.showMenu();
};
hud.els.helpBack.onclick = () => {
  clickSound();
  if (game.paused) {
    hud.els.help.classList.add("hidden");
    hud.setPaused(true);
  } else hud.showMenu();
};
function storeOnlyToast() {
  hud.toast("Not available in this version");
}

hud.els.iap.onclick = async () => {
  clickSound();
  const ok = await iap.buyRemoveAds();
  if (ok) hud.toast("Ads removed");
  else if (!allowMockPurchases()) storeOnlyToast();
  else hud.toast("Purchase failed");
};

hud.els.pauseBtn.onclick = () => {
  clickSound();
  game.togglePause();
};
hud.els.resume.onclick = () => {
  clickSound();
  if (game.paused) game.togglePause();
};
hud.els.pauseHelp && (hud.els.pauseHelp.onclick = () => {
  clickSound();
  hud.els.pause.classList.add("hidden");
  hud.showHelp();
});
hud.els.pauseRetry.onclick = () => {
  clickSound();
  restartLevel();
};
hud.els.pauseMenu.onclick = () => {
  clickSound();
  trackRunStats();
  economy.noteFail();
  refreshHook();
  game.goMenu();
};

hud.els.hintNext.onclick = () => {
  clickSound();
  finishHintStep();
};
hud.els.hintSkip.onclick = () => {
  clickSound();
  tutorial = applyTutorialEvent(tutorial, "skip");
  persistTutorial();
  hud.startTutorial("none");
};
hud.els.hintHide.onclick = () => {
  clickSound();
  tutorial = applyTutorialEvent(tutorial, "hide");
  persistTutorial();
  hud.startTutorial("none");
};

function portalMute() {
  return muteAudioFromSearch(location.search) || !!window.BlobtidePlatform?.muteForced;
}

hud.els.muteToggle.onchange = () => applyMute(hud.els.muteToggle.checked);
hud.els.muteBtn?.addEventListener("click", () => {
  applyMute(!settings.muted);
  if (!portalMute() && !settings.muted) game.sfx.ui();
});
hud.els.pauseMute?.addEventListener("click", () => applyMute(!settings.muted));
function applyMute(muted) {
  if (portalMute()) muted = true;
  settings.muted = !!muted;
  SettingsStore.save(settings);
  game.applyAudio({ ...settings, muted: settings.muted || portalMute() });
  hud.setMuted(settings.muted || portalMute());
  if (!settings.muted && !portalMute()) {
    game.sfx.ensure();
    game.sfx.startMusic();
  }
}
hud.els.musicVol?.addEventListener("input", () => {
  settings.music = Number(hud.els.musicVol.value) / 100;
  SettingsStore.save(settings);
  game.applyAudio(settings);
});
hud.els.sfxVol?.addEventListener("input", () => {
  settings.sfx = Number(hud.els.sfxVol.value) / 100;
  SettingsStore.save(settings);
  game.applyAudio(settings);
});
hud.els.hideToggle.onchange = () => {
  tutorial = applyTutorialEvent(tutorial, hud.els.hideToggle.checked ? "hide" : "show");
  persistTutorial();
  if (tutorial.hideInstructions) hud.startTutorial("none");
};
hud.els.replayTutorial.onclick = () => {
  clickSound();
  replayTutorial = true;
  tutorial = applyTutorialEvent(tutorial, "show");
  persistTutorial();
  hud.toast("Tutorial will play on next run");
  if (game.state === "playing") play();
};

hud.root.querySelectorAll("[data-pack]").forEach((btn) => {
  btn.onclick = async () => {
    clickSound();
    const pack = btn.dataset.pack;
    let ok = false;
    if (pack === "small") ok = await iap.buyCoins(200, "coins_200");
    if (pack === "medium") ok = await iap.buyCoins(1000, "coins_1000");
    if (pack === "prism") ok = await iap.buyPrism();
    if (!ok && !allowMockPurchases()) storeOnlyToast();
    hud.setCoins(economy.coins);
    hud.renderSkins(SKINS, economy, onSkin);
  };
});

function onSkin(skin) {
  clickSound();
  if (economy.ownedSkins.includes(skin.id)) {
    economy.equip(skin.id);
    Analytics.event("skin_equipped", { skin: skin.id });
  } else if (skin.starLock) {
    hud.toast(skin.starLock === "prestige" ? "3★ on levels 1–10" : skin.starLock === "dusk" ? "2★ on level 8" : "1★ on level 5");
    return;
  } else if (skin.iap) {
    iap.buyPrism().then((ok) => {
      if (!ok && !allowMockPurchases()) storeOnlyToast();
      hud.setCoins(economy.coins);
      hud.renderSkins(SKINS, economy, onSkin);
    });
    return;
  } else if (!economy.buySkin(skin.id, skin.price)) {
    hud.toast("Need more coins");
    return;
  }
  hud.setCoins(economy.coins);
  hud.renderSkins(SKINS, economy, onSkin);
  game.skinId = economy.equipped;
  Analytics.event("skin_unlocked", { skin: skin.id });
}

function trackRunStats() {
  economy.addPlayTime?.(game.runTime);
  economy.noteCombo?.(Math.max(game.maxCombo || 0, game.maxComboAchieved || 0, game.lastWin?.maxCombo || 0));
}

function settleWinReward() {
  if (game.rewardSettled) return;
  game.rewardSettled = true;
  trackRunStats();
  economy.addCoins(game.lastReward || 0);
  let cosmetics = [];
  if (game.lastWin) {
    const rec = economy.recordLevelWin(game.levelIndex, game.lastWin);
    cosmetics = rec?.cosmetics || [];
  }
  economy.noteWin(game.lastWin?.stars || 1);
  hud.setCoins(economy.coins);
  if (cosmetics.length) {
    hud.toast(cosmetics.map((s) => s.name).join(" · ") + " unlocked");
    hud.renderSkins(SKINS, economy, onSkin);
  }
  refreshHook();
}

let advancing = false;
hud.els.resultPrimary.onclick = async () => {
  if (advancing || hud.els.resultPrimary.disabled) return;
  clickSound();
  const mode = hud.els.result.dataset.mode;
  hud.els.resultPrimary.disabled = true;
  advancing = true;
  try {
    if (mode === "win") {
      const last = game.isLastLevel();
      settleWinReward();
      economy.onWin(game.levelIndex);
      hud.hideResult();
      if (last) {
        game.goMenu();
        hud.toast("Campaign complete");
        return;
      }
      await ads.maybeInterstitial(hud.tutorialMode !== "none");
      play({ countSession: false });
    } else {
      trackRunStats();
      economy.noteFail();
      refreshHook();
      hud.hideResult();
      Analytics.event("replay", { level: game.levelIndex + 1 });
      play({ countSession: false });
    }
  } finally {
    advancing = false;
  }
};

hud.els.resultReplay.onclick = () => {
  if (advancing) return;
  clickSound();
  const mode = hud.els.result.dataset.mode;
  if (mode === "win") settleWinReward();
  else {
    trackRunStats();
    economy.noteFail();
    refreshHook();
  }
  hud.hideResult();
  Analytics.event("replay", { level: game.levelIndex + 1 });
  play({ countSession: false });
};

hud.els.resultSecondary.onclick = async () => {
  if (hud.els.resultSecondary.disabled) return;
  clickSound();
  const mode = hud.els.result.dataset.mode;
  hud.els.resultSecondary.disabled = true;
  const ok = await ads.showRewarded(mode === "win" ? "2x coins" : "crowd burst");
  if (!ok) {
    hud.els.resultSecondary.disabled = false;
    return;
  }
  if (mode === "win") {
    game.doubleCoins();
    Analytics.event("rewarded_double_coins");
  } else {
    game.continueWithBurst();
    Analytics.event("continue_used");
    Analytics.event("rewarded_continue");
  }
};

hud.els.resultMenu.onclick = () => {
  clickSound();
  if (hud.els.result.dataset.mode === "win") {
    settleWinReward();
    economy.onWin(game.levelIndex);
  } else {
    trackRunStats();
    economy.noteFail();
    refreshHook();
  }
  game.goMenu();
};

Consent.request().then(() => Analytics.event("boot"));

if (window.Capacitor?.isNativePlatform?.()) {
  import("./platform/capacitorBridge.js").then(async (mod) => {
    await mod.installNativeBridge();
    await iap.restore();
    hud.setCoins(economy.coins);
  });
} else {
  hud.els.iap?.classList.add("hidden");
  hud.root.querySelector(".packs")?.classList.add("hidden");
}

const sdkReady = installCrazyGamesPlatform().catch(() => false);
sdkReady.finally(() => {
  crazyGamesLoadingStop();
  const p = window.BlobtidePlatform;
  hud.allowRewarded = Platform.has("rewardedBreak") && p?.adsLive === true && !isCrazyGamesHost();
  if (p) {
    p.onMuteAudio = () => applyMute(settings.muted);
    p.onAdStart = () => {
      game._adLock = true;
      game._adWasPaused = game.paused;
      if (game.state === "playing" && !game.ended && !game.paused) game.togglePause();
      game.sfx.setMuted(true);
    };
    p.onAdEnd = () => {
      game._adLock = false;
      applyMute(settings.muted);
      if (!game._adWasPaused && game.paused && game.state === "playing" && !game.ended) game.togglePause();
    };
    if (p.muteForced) applyMute(true);
  }
});

try {
  game.tick();
} catch (err) {
  showBootError(err);
}

    const resumeAudio = () => {
      game.sfx.ensure();
      if (!game.sfx.muted) game.sfx.startMusic();
    };
document.addEventListener("touchend", resumeAudio, { passive: true });
document.addEventListener("pointerdown", resumeAudio, { passive: true });

window.addEventListener("keydown", (e) => {
  if (e.repeat) return;
  if (game.state !== "menu") return;
  if (hud.els.menu?.classList.contains("hidden")) return;
  if (e.key !== "Enter" && e.key !== " ") return;
  if (e.target?.tagName === "INPUT" || e.target?.isContentEditable) return;
  e.preventDefault();
  clickSound();
  play();
});

if (new URLSearchParams(location.search).has("capture")) {
  play();
  if (new URLSearchParams(location.search).has("record")) {
    game.setMuted(true);
    const canvas = document.querySelector("#game");
    const seconds = 16;
    const stream = canvas.captureStream(30);
    const mime = MediaRecorder.isTypeSupported("video/webm;codecs=vp9")
      ? "video/webm;codecs=vp9"
      : "video/webm";
    const rec = new MediaRecorder(stream, { mimeType: mime, videoBitsPerSecond: 6_000_000 });
    const chunks = [];
    rec.ondataavailable = (e) => {
      if (e.data?.size) chunks.push(e.data);
    };
    rec.onstop = async () => {
      const blob = new Blob(chunks, { type: mime });
      try {
        await fetch("/clip", { method: "POST", body: blob });
        window.__blobtideRecorded = blob.size;
      } catch (err) {
        window.__blobtideRecorded = String(err?.message || err);
      }
    };
    rec.start(500);
    window.setTimeout(() => rec.stop(), seconds * 1000);
  }
}

window.Blobtide = { game, economy, LEVELS, play, tutorial: () => tutorial };

  if (import.meta.env.DEV && new URLSearchParams(location.search).get("qa") === "1") {
    const bar = document.createElement("div");
    bar.id = "qa-hopper";
    bar.innerHTML = `<button type="button" id="qa-prev">Prev</button><span id="qa-id">1</span><button type="button" id="qa-next">Next</button><button type="button" id="qa-scan">Scan 1-56</button><div class="qa-log" id="qa-log"></div>`;
    hudRoot.appendChild(bar);
    const log = (msg) => {
      const el = bar.querySelector("#qa-log");
      el.textContent = msg;
      console.info("[qa]", msg);
    };
    const syncQa = () => {
      bar.querySelector("#qa-id").textContent = String((economy.levelIndex || 0) + 1);
    };
    const loadId = (id) => {
      const n = Math.max(1, Math.min(56, id | 0));
      economy.levelIndex = n - 1;
      play({ countSession: false });
      syncQa();
    };
    syncQa();
    bar.querySelector("#qa-prev").onclick = () => loadId((economy.levelIndex || 0));
    bar.querySelector("#qa-next").onclick = () => loadId((economy.levelIndex || 0) + 2);
    bar.querySelector("#qa-scan").onclick = () => {
      const errors = [];
      for (const level of LEVELS) {
        const world = worldForLevel(level.id);
        if (!level.worldId || level.worldId !== world.id) errors.push(`L${level.id} world`);
        if (!level.pieces.length || level.pieces.at(-1).type !== "finish") errors.push(`L${level.id} finish`);
        const run = simulatePlay(level);
        if (!run.ok) errors.push(`L${level.id} play ${run.at || "door"}`);
        try {
          game.applyWorld(world, level.id);
          game.world.build(level);
          game.crowd.reset(level.startCount);
          game.crowd.applySkin("lime");
          game.crowd.update(0.016, level.laneLimit || 3, { moving: false, camera: game.camera });
          const eye = game.crowd.leader?.material?.map;
          if (!game.crowd.leader || !eye) errors.push(`L${level.id} eyes`);
        } catch (err) {
          errors.push(`L${level.id} build ${err.message || err}`);
        }
      }
      log(errors.length ? errors.join(" | ") : `OK ${LEVELS.length} levels, ${new Set(LEVELS.map((l) => l.worldId)).size} worlds`);
      loadId((economy.levelIndex || 0) + 1);
    };
    window.__blobtideQa = { loadId, scan: () => bar.querySelector("#qa-scan").click() };
    log("QA hopper ready");
  }

    return true;
  } catch (err) {
    window.__blobtideStarted = false;
    showBootError(err);
    return false;
  }
}

window.addEventListener("error", (ev) => {
  if (!window.__blobtideStarted) showBootError(ev.error || ev.message);
});

function scheduleBoot() {
  try {
    if (bootBlobtide()) return;
  } catch (err) {
    showBootError(err);
    return;
  }
  const kick = () => {
    try {
      bootBlobtide();
    } catch (err) {
      showBootError(err);
    }
  };
  document.addEventListener("DOMContentLoaded", kick);
  window.addEventListener("load", kick);
  let n = 0;
  const id = setInterval(() => {
    if (bootBlobtide() || ++n > 100) clearInterval(id);
  }, 50);
}
scheduleBoot();
