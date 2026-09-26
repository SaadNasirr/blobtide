import { allowMockPurchases, isNativeApp } from "./config.js";
import { LEVELS } from "./content/levels.js";
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
import { installCrazyGamesPlatform } from "./platform/crazygames.js";

const canvas = document.querySelector("#game");
const hud = new Hud(document.querySelector("#hud"));

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
let replayTutorial = false;

hud.setCoins(economy.coins);
hud.els.muteToggle.checked = settings.muted;
if (hud.els.musicVol) hud.els.musicVol.value = String(Math.round(settings.music * 100));
if (hud.els.sfxVol) hud.els.sfxVol.value = String(Math.round(settings.sfx * 100));
game.applyAudio(settings);

game.onCoin = (n) => {
  economy.addCoins(n);
  hud.setCoins(economy.coins);
  Analytics.event("coins_collected", { amount: n });
  const done = economy.pushMission("coins", n);
  if (done.completed) hud.toast(`${done.mission.label} · +${done.reward}`);
  refreshHook();
};

if (!isNativeApp() && hud.els.iap) {
  hud.els.iap.classList.add("hidden");
  hud.root.querySelector(".packs")?.classList.add("hidden");
  hud.root.querySelector(".shop-legal")?.classList.add("hidden");
}

if (economy.maxUnlocked > 0 && hud.els.play) hud.els.play.textContent = "CONTINUE";
hud.els.hideToggle.checked = tutorial.hideInstructions;

function refreshHook() {
  const view = economy.hookView();
  hud.setHook(view);
  if (view.winStreak >= 2 && hud.els.play) hud.els.play.textContent = "KEEP GOING";
  else if (economy.maxUnlocked > 0 && hud.els.play) hud.els.play.textContent = "CONTINUE";
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
  if (game.state === "menu") game.sfx.startMusic();
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
  hud.renderLevels(LEVELS.length, economy, (index) => {
    economy.levelIndex = index;
    economy.save();
    hud.showMenu();
    play({ countSession: false });
  });
  hud.showLevels();
};
hud.els.levelsBack.onclick = () => {
  clickSound();
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
    hud.els.pause.classList.remove("hidden");
  } else hud.showMenu();
};
function storeOnlyToast() {
  hud.toast("Buy this in the Play Store or App Store app");
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
hud.els.pauseHelp.onclick = () => {
  clickSound();
  hud.els.pause.classList.add("hidden");
  hud.showHelp();
};
hud.els.pauseRetry.onclick = () => {
  clickSound();
  restartLevel();
};
hud.els.pauseMenu.onclick = () => {
  clickSound();
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

hud.els.muteToggle.onchange = () => {
  settings.muted = hud.els.muteToggle.checked;
  SettingsStore.save(settings);
  game.applyAudio(settings);
};
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

function settleWinReward() {
  if (game.rewardSettled) return;
  game.rewardSettled = true;
  economy.addCoins(game.lastReward || 0);
  if (game.lastWin) economy.recordLevelWin(game.levelIndex, game.lastWin);
  economy.noteWin(game.lastWin?.stars || 1);
  hud.setCoins(economy.coins);
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
}

installCrazyGamesPlatform().catch(() => {});
game.tick();

if (new URLSearchParams(location.search).has("capture")) {
  play();
}

window.Blobtide = { game, economy, LEVELS, play, tutorial: () => tutorial };
