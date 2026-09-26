import { SKINS } from "../content/skins.js";
import { CONFIG } from "../config.js";
import { mergeLevelStat, sanitizeStats, starRating } from "./progress.js";
import { readJson, writeJson } from "./storage.js";
import { advanceDaily, applyMission, MISSIONS, nextSkinGoal, streakBonus } from "./hook.js";

const PREFIX = "blobtide_";
export const LAST_LEVEL_INDEX = 55;
const SKIN_IDS = new Set(SKINS.map((s) => s.id));

export function progressAfterWin(levelIndex, lastIndex = LAST_LEVEL_INDEX) {
  const i = Math.max(0, Math.floor(levelIndex));
  if (i >= lastIndex) {
    return { levelIndex: lastIndex, campaignComplete: true };
  }
  return { levelIndex: i + 1, campaignComplete: false };
}

function clampInt(value, min, max) {
  const n = Math.floor(Number(value));
  if (!Number.isFinite(n)) return min;
  return Math.min(max, Math.max(min, n));
}

/** Drop unknown keys, fake skins, NaN coins, and out-of-range progress. */
export function sanitizeSave(raw, lastIndex = LAST_LEVEL_INDEX) {
  const data = raw && typeof raw === "object" ? raw : {};
  let owned = Array.isArray(data.ownedSkins)
    ? data.ownedSkins.filter((id) => typeof id === "string" && SKIN_IDS.has(id))
    : [];
  if (!owned.includes("lime")) owned = ["lime", ...owned];
  owned = [...new Set(owned)];
  const equipped =
    typeof data.equipped === "string" && owned.includes(data.equipped) ? data.equipped : "lime";
  return {
    v: CONFIG.saveVersion,
    coins: clampInt(data.coins, 0, CONFIG.maxCoins),
    ownedSkins: owned,
    equipped,
    removeAds: data.removeAds === true,
    levelIndex: clampInt(data.levelIndex, 0, lastIndex),
    maxUnlocked: clampInt(data.maxUnlocked, 0, lastIndex),
    winsSinceAd: clampInt(data.winsSinceAd, 0, 30),
    campaignComplete: data.campaignComplete === true,
    stats: sanitizeStats(data.stats, lastIndex),
    winStreak: clampInt(data.winStreak, 0, 99),
    bestStreak: clampInt(data.bestStreak, 0, 99),
    dailyStreak: clampInt(data.dailyStreak, 0, 99),
    lastPlayDay: /^\d{4}-\d{2}-\d{2}$/.test(data.lastPlayDay) ? data.lastPlayDay : "",
    missionIndex: clampInt(data.missionIndex, 0, MISSIONS.length - 1),
    missionProgress: clampInt(data.missionProgress, 0, 9999),
  };
}

export const Economy = {
  coins: 0,
  ownedSkins: ["lime"],
  equipped: "lime",
  removeAds: false,
  levelIndex: 0,
  maxUnlocked: 0,
  winsSinceAd: 0,
  campaignComplete: false,
  stats: {},
  winStreak: 0,
  bestStreak: 0,
  dailyStreak: 0,
  lastPlayDay: "",
  missionIndex: 0,
  missionProgress: 0,

  load() {
    const parsed = readJson(PREFIX + "save", null);
    if (!parsed || typeof parsed !== "object") return this;
    Object.assign(this, sanitizeSave(parsed));
    return this;
  },

  save() {
    const clean = sanitizeSave(this);
    Object.assign(this, clean);
    writeJson(PREFIX + "save", clean);
  },

  addCoins(n) {
    this.coins = Math.min(CONFIG.maxCoins, this.coins + Math.max(0, Math.floor(n)));
    this.save();
  },

  buySkin(id, price) {
    if (!SKIN_IDS.has(id) || id === "rainbow") return false;
    if (this.ownedSkins.includes(id)) return true;
    if (this.coins < price) return false;
    this.coins -= price;
    this.ownedSkins.push(id);
    this.equipped = id;
    this.save();
    return true;
  },

  equip(id) {
    if (!this.ownedSkins.includes(id)) return false;
    this.equipped = id;
    this.save();
    return true;
  },

  recordLevelWin(levelIndex, { coins = 0, crowd = 0, leftover = 0, doorHp = 1 } = {}) {
    const stars = starRating({ leftover, doorHp });
    const key = Math.max(0, Math.floor(levelIndex));
    this.stats[key] = mergeLevelStat(this.stats[key], {
      completed: true,
      stars,
      bestCoins: Math.max(0, Math.floor(coins)),
      bestCrowd: Math.max(0, Math.floor(crowd)),
    });
    this.save();
    return { stars, best: this.stats[key] };
  },

  isUnlocked(index) {
    return index <= this.maxUnlocked;
  },

  onWin(levelIndex) {
    const next = progressAfterWin(levelIndex, LAST_LEVEL_INDEX);
    this.levelIndex = next.levelIndex;
    this.campaignComplete = next.campaignComplete;
    this.maxUnlocked = Math.max(this.maxUnlocked, this.levelIndex);
    this.winsSinceAd += 1;
    this.save();
    return next;
  },

  beginNewRun() {
    this.campaignComplete = false;
    this.levelIndex = 0;
    this.save();
  },

  grantRemoveAds() {
    this.removeAds = true;
    this.save();
  },

  claimDaily() {
    const next = advanceDaily(this.lastPlayDay, this.dailyStreak);
    this.lastPlayDay = next.day;
    this.dailyStreak = next.streak;
    if (next.claim > 0) this.addCoins(next.claim);
    else this.save();
    return next;
  },

  noteWin(stars = 1) {
    this.winStreak += 1;
    this.bestStreak = Math.max(this.bestStreak, this.winStreak);
    this.pushMission("wins", 1);
    if (stars >= 3) this.pushMission("stars", 1);
    this.save();
    return streakBonus(this.winStreak);
  },

  noteFail() {
    this.winStreak = 0;
    this.save();
  },

  pushMission(kind, amount = 1) {
    const result = applyMission(this.missionIndex, this.missionProgress, kind, amount);
    this.missionIndex = result.missionIndex;
    this.missionProgress = result.progress;
    if (result.completed && result.reward) this.addCoins(result.reward);
    else this.save();
    return result;
  },

  hookView() {
    const mission = MISSIONS[this.missionIndex % MISSIONS.length];
    return {
      winStreak: this.winStreak,
      bestStreak: this.bestStreak,
      dailyStreak: this.dailyStreak,
      mission: `${mission.label} · ${this.missionProgress}/${mission.target}`,
      nextSkin: nextSkinGoal(this.ownedSkins, this.coins),
    };
  },
};
