import { readJson, writeJson } from "./storage.js";
import { WORLDS, WORLD_MAP_TINT } from "../content/themes.js";
import { nextStarSkinGoal } from "../content/skins.js";
import { MISSIONS } from "./hook.js";

export const LEVEL_COUNT = 56;
export const STAR_MAX = LEVEL_COUNT * 3;
export const PROGRESS_KEY = "blobtide_levelProgress";

/** Coin payout scale: 1.25x once a run holds a 20+ gate combo. */
export function comboCoinMult(combo = 0) {
  return combo >= 20 ? 1.25 : 1;
}

export const STAR_COMBO = 15;

export const DIFFICULTY = [
  { to: 5, rating: 1, label: "Easy" },
  { to: 15, rating: 2, label: "Medium" },
  { to: 25, rating: 3, label: "Hard" },
  { to: 40, rating: 4, label: "Very Hard" },
  { to: 56, rating: 5, label: "Extreme" },
];

export function difficultyRating(levelId) {
  const id = Math.max(1, Math.floor(Number(levelId) || 1));
  for (const band of DIFFICULTY) {
    if (id <= band.to) return band.rating;
  }
  return 5;
}

export function difficultyLabel(levelId) {
  const r = difficultyRating(levelId);
  return DIFFICULTY.find((b) => b.rating === r)?.label || "Extreme";
}

export function difficultyStars(levelId) {
  return "★".repeat(difficultyRating(levelId));
}

export function difficultyTitle(levelId) {
  const id = Math.max(1, Math.floor(Number(levelId) || 1));
  return `Level ${id}: ${difficultyStars(id)} ${difficultyLabel(id)}`;
}

/** 1→1.2x … 5→2.0x on the coin payout. */
export function difficultyMultiplier(levelId) {
  return 1 + difficultyRating(levelId) * 0.2;
}

export function levelStarsKey(id) {
  return `blobtide_level_${Math.max(1, Math.floor(Number(id) || 1))}_stars`;
}

export function starsKeyV2(id) {
  return `blobtide_stars_level${Math.max(1, Math.floor(Number(id) || 1))}`;
}

function clampStars(n) {
  return Math.max(0, Math.min(3, Math.floor(Number(n) || 0)));
}

export function readLevelStars(id) {
  const a = clampStars(readJson(levelStarsKey(id), 0));
  const b = clampStars(readJson(starsKeyV2(id), 0));
  return Math.max(a, b);
}

export function writeLevelStars(id, stars) {
  const next = clampStars(stars);
  const best = Math.max(readLevelStars(id), next);
  writeJson(levelStarsKey(id), best);
  writeJson(starsKeyV2(id), best);
  return best;
}

export function barFill(have, max, width = 8) {
  const cap = Math.max(1, max | 0);
  const n = Math.max(0, Math.min(width, Math.round(((have | 0) / cap) * width)));
  return `[${"=".repeat(n)}${"░".repeat(width - n)}]`;
}

export function formatPlayTime(ms) {
  const sec = Math.max(0, Math.floor((Number(ms) || 0) / 1000));
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  if (h > 0) return `${h}h ${String(m).padStart(2, "0")}m`;
  if (m > 0) return `${m}m`;
  return `${sec}s`;
}

export function campaignSnapshot(economy = {}, lastIndex = LEVEL_COUNT - 1) {
  const stats = economy.stats || {};
  const maxUnlocked = Math.max(0, Math.min(lastIndex, economy.maxUnlocked | 0));
  let completed = 0;
  let stars = 0;
  const starById = {};
  for (let i = 0; i <= lastIndex; i++) {
    const row = stats[i] || {};
    const n = clampStars(row.stars);
    starById[i + 1] = n;
    stars += n;
    if (row.completed || n > 0) completed += 1;
  }
  const nextLevel = Math.min(LEVEL_COUNT, maxUnlocked + 1);
  const worlds = WORLDS.map((w) => {
    let have = 0;
    let done = 0;
    const count = w.to - w.from + 1;
    for (let id = w.from; id <= w.to; id++) {
      have += starById[id] || 0;
      if (stats[id - 1]?.completed || (starById[id] || 0) > 0) done += 1;
    }
    const starMax = count * 3;
    const reached = w.from - 1 <= maxUnlocked;
    const current = nextLevel >= w.from && nextLevel <= w.to;
    return {
      id: w.id,
      name: w.name,
      tint: WORLD_MAP_TINT[w.id] || "#7cc45a",
      from: w.from,
      to: w.to,
      stars: have,
      starMax,
      cleared: done,
      levelCount: count,
      bar: barFill(have, starMax),
      pct: Math.round((have / starMax) * 100),
      complete: have >= starMax && done >= count,
      current,
      dim: !reached,
    };
  });
  const mission = MISSIONS[(economy.missionIndex | 0) % MISSIONS.length];
  return {
    completed,
    totalLevels: lastIndex + 1,
    stars,
    starMax: STAR_MAX,
    bestCombo: Math.max(0, economy.bestCombo | 0),
    bestStreak: Math.max(0, economy.bestStreak | 0),
    playMs: Math.max(0, economy.playMs | 0),
    playLabel: formatPlayTime(economy.playMs),
    nextLevel,
    maxUnlocked,
    worlds,
    nextSkin: nextStarSkinGoal(stats, economy.ownedSkins) || null,
    mission: mission
      ? `${mission.label} · ${Math.max(0, economy.missionProgress | 0)}/${mission.target}`
      : "",
  };
}

export function readCampaignProgress() {
  return readJson(PROGRESS_KEY, null);
}

export function writeCampaignProgress(economy) {
  const snap = campaignSnapshot(economy);
  writeJson(PROGRESS_KEY, {
    v: 1,
    completed: snap.completed,
    stars: snap.stars,
    starMax: snap.starMax,
    maxUnlocked: snap.maxUnlocked,
    bestCombo: snap.bestCombo,
    bestStreak: snap.bestStreak,
    playMs: snap.playMs,
    byLevel: Object.fromEntries(
      Array.from({ length: LEVEL_COUNT }, (_, i) => [i + 1, readLevelStars(i + 1) || economy.stats?.[i]?.stars || 0])
    ),
  });
  return snap;
}

export function starFlags({ won = true, hazardHitCount = 0, maxCombo = 0 } = {}) {
  const clear = !!won;
  return {
    clear,
    clean: clear && (hazardHitCount | 0) <= 0,
    combo: clear && (maxCombo | 0) >= STAR_COMBO,
  };
}

/** 1 for a clear, +1 for no hazard hits, +1 for a 15x combo on the same run. */
export function starRating({ won = true, hazardHitCount = 0, maxCombo = 0 } = {}) {
  const flags = starFlags({ won, hazardHitCount, maxCombo });
  return (flags.clear ? 1 : 0) + (flags.clean ? 1 : 0) + (flags.combo ? 1 : 0);
}

export function runCoinReward({ leftover = 0, levelIndex = 0, combo = 0, streak = 1, coinMultiplier = 1 } = {}) {
  const comboBonus = Math.max(0, combo | 0) * 5;
  const base = Math.max(8, 10 + Math.max(0, leftover | 0) + (levelIndex | 0)) + comboBonus + Math.max(0, streak | 0) * 4;
  const levelId = (levelIndex | 0) + 1;
  return Math.round(base * (Number(coinMultiplier) || 1) * comboCoinMult(combo) * difficultyMultiplier(levelId));
}

export function emptyLevelStat() {
  return { stars: 0, bestCoins: 0, bestCrowd: 0, completed: false };
}

export function mergeLevelStat(prev, next) {
  const a = { ...emptyLevelStat(), ...(prev && typeof prev === "object" ? prev : {}) };
  const b = next && typeof next === "object" ? next : {};
  return {
    completed: !!(a.completed || b.completed),
    stars: Math.max(0, Math.min(3, Math.max(a.stars || 0, b.stars || 0))),
    bestCoins: Math.max(0, a.bestCoins || 0, b.bestCoins || 0),
    bestCrowd: Math.max(0, a.bestCrowd || 0, b.bestCrowd || 0),
  };
}

export function sanitizeStats(raw, lastIndex = 55) {
  const src = raw && typeof raw === "object" ? raw : {};
  const out = {};
  for (let i = 0; i <= lastIndex; i++) {
    const row = src[i] ?? src[String(i)];
    if (!row || typeof row !== "object") continue;
    out[i] = mergeLevelStat(emptyLevelStat(), {
      completed: row.completed === true,
      stars: row.stars,
      bestCoins: row.bestCoins,
      bestCrowd: row.bestCrowd,
    });
  }
  return out;
}
