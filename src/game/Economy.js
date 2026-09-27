import { SKINS, starSkinsDue, getSkin } from "../content/skins.js";
import { CONFIG } from "../config.js";
import { mergeLevelStat, sanitizeStats, starRating, readLevelStars, writeLevelStars, writeCampaignProgress, readCampaignProgress } from "./progress.js";
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
    bestCombo: clampInt(data.bestCombo, 0, 999),
    playMs: clampInt(data.playMs, 0, 1e12),
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
  bestCombo: 0,
  playMs: 0,

  load() {
    const parsed = readJson(PREFIX + "save", null);
    if (parsed && typeof parsed === "object") Object.assign(this, sanitizeSave(parsed));
    this._syncLevelStars();
    this._syncCampaignFile();
    this.grantStarCosmetics();
    return this;
  },

  _syncLevelStars() {
    for (let i = 0; i <= LAST_LEVEL_INDEX; i++) {
      const saved = readLevelStars(i + 1);
      if (saved <= 0) continue;
      this.stats[i] = mergeLevelStat(this.stats[i], { completed: true, stars: saved });
    }
  },

  _syncCampaignFile() {
    const file = readCampaignProgress();
    if (!file || typeof file !== "object") return;
    this.bestCombo = Math.max(this.bestCombo | 0, file.bestCombo | 0);
    this.bestStreak = Math.max(this.bestStreak | 0, file.bestStreak | 0);
    this.playMs = Math.max(this.playMs | 0, file.playMs | 0);
    if (file.maxUnlocked != null) this.maxUnlocked = Math.max(this.maxUnlocked | 0, file.maxUnlocked | 0);
    const by = file.byLevel && typeof file.byLevel === "object" ? file.byLevel : {};
    for (let id = 1; id <= LAST_LEVEL_INDEX + 1; id++) {
      const n = Math.max(0, Math.min(3, by[id] | by[String(id)] | 0));
      if (n <= 0) continue;
      this.stats[id - 1] = mergeLevelStat(this.stats[id - 1], { completed: true, stars: n });
      writeLevelStars(id, n);
    }
  },

  save() {
    const clean = sanitizeSave(this);
    Object.assign(this, clean);
    writeJson(PREFIX + "save", clean);
    writeCampaignProgress(this);
  },

  addCoins(n) {
    const delta = Math.floor(Number(n) || 0);
    this.coins = Math.min(CONFIG.maxCoins, Math.max(0, this.coins + delta));
    this.save();
  },

  buySkin(id, price) {
    const skin = SKINS.find((s) => s.id === id);
    if (!skin || skin.iap || skin.starLock) return false;
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

  recordLevelWin(levelIndex, { coins = 0, crowd = 0, leftover = 0, doorHp = 1, stars, levelId } = {}) {
    const key = Math.max(0, Math.floor(levelIndex));
    const id = Math.max(1, Math.floor(Number(levelId) || key + 1));
    const earned = Math.max(0, Math.min(3, stars != null ? stars | 0 : starRating({ won: true, hazardHitCount: 0, maxCombo: 0 })));
    const best = writeLevelStars(id, earned);
    this.stats[key] = mergeLevelStat(this.stats[key], {
      completed: true,
      stars: best,
      bestCoins: Math.max(0, Math.floor(coins)),
      bestCrowd: Math.max(0, Math.floor(crowd)),
    });
    this.save();
    const cosmetics = this.grantStarCosmetics();
    return { stars: earned, best: this.stats[key], cosmetics };
  },

  grantStarCosmetics() {
    const due = starSkinsDue(this.stats);
    const fresh = [];
    for (const id of due) {
      if (!SKIN_IDS.has(id) || this.ownedSkins.includes(id)) continue;
      this.ownedSkins.push(id);
      fresh.push(getSkin(id));
    }
    if (fresh.length) this.save();
    return fresh;
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

  noteCombo(n) {
    const v = Math.max(0, n | 0);
    if (v > (this.bestCombo | 0)) {
      this.bestCombo = v;
      this.save();
    }
  },

  addPlayTime(seconds) {
    const ms = Math.max(0, Math.floor((Number(seconds) || 0) * 1000));
    if (!ms) return;
    this.playMs = Math.min(1e12, (this.playMs | 0) + ms);
    this.save();
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
