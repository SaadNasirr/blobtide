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
hud.els.hideToggle.checked = tutorial.hideInstructions;
game.setMuted(settings.muted);

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

function play({ countSession = true } = {}) {
  if (economy.campaignComplete && game.state === "menu") {
    economy.beginNewRun();
    hud.toast("New run · Level 1");
  }
  const { level, index } = currentLevel();
  hud.setCoins(economy.coins);
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
hud.els.iap.onclick = async () => {
  clickSound();
  await iap.buyRemoveAds();
  hud.toast(economy.removeAds ? "Ads removed" : "Purchase failed");
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
  game.setMuted(settings.muted);
  game.onCoin = (n) => {
    economy.addCoins(n);
    hud.setCoins(economy.coins);
  };
};
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
    if (pack === "small") await iap.buyCoins(200, "coins_200");
    if (pack === "medium") await iap.buyCoins(1000, "coins_1000");
    if (pack === "prism") await iap.buyPrism();
    hud.setCoins(economy.coins);
    hud.renderSkins(SKINS, economy, onSkin);
  };
});

function onSkin(skin) {
  clickSound();
  if (economy.ownedSkins.includes(skin.id)) {
    economy.equip(skin.id);
  } else if (skin.iap) {
    iap.buyPrism().then(() => {
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
      economy.addCoins(game.lastReward || 0);
      economy.onWin(game.levelIndex);
      hud.setCoins(economy.coins);
      hud.hideResult();
      if (last) {
        game.goMenu();
        hud.toast("Campaign complete");
        return;
      }
      await ads.maybeInterstitial();
      play({ countSession: false });
    } else {
      hud.hideResult();
      play({ countSession: false });
    }
  } finally {
    advancing = false;
  }
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
    Analytics.event("rewarded_continue");
  }
};

hud.els.resultMenu.onclick = () => {
  clickSound();
  if (hud.els.result.dataset.mode === "win") {
    economy.addCoins(game.lastReward || 0);
    economy.onWin(game.levelIndex);
    hud.setCoins(economy.coins);
  }
  game.goMenu();
};

Consent.request().then(() => Analytics.event("boot"));
game.tick();

if (new URLSearchParams(location.search).has("capture")) {
  play();
}

window.Blobtide = { game, economy, LEVELS, play, tutorial: () => tutorial };
