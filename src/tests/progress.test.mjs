import assert from "node:assert/strict";
import test from "node:test";
import { starRating, starFlags, sanitizeStats, mergeLevelStat, comboCoinMult, runCoinReward, levelStarsKey, campaignSnapshot, barFill, STAR_MAX, starsKeyV2, difficultyRating, difficultyMultiplier, difficultyTitle, difficultyLabel } from "../game/progress.js";
import { Platform } from "../platform/adapter.js";
import { sanitizeSave } from "../game/Economy.js";
import { installCrazyGamesPlatform, muteAudioFromSearch } from "../platform/crazygames.js";
import { LEVELS } from "../content/levels.js";
import { starSkinsDue, STAR_UNLOCKS } from "../content/skins.js";

test("combo 20+ coins pay 1.25x and scale with difficulty", () => {
  assert.equal(comboCoinMult(19), 1);
  assert.equal(comboCoinMult(20), 1.25);
  const base = Math.max(8, 10 + 10 + 0) + 20 * 5 + 1 * 4;
  assert.equal(difficultyRating(1), 1);
  assert.equal(difficultyMultiplier(1), 1.2);
  assert.equal(runCoinReward({ leftover: 10, levelIndex: 0, combo: 20, streak: 1, coinMultiplier: 1 }), Math.round(base * 1.25 * 1.2));
  const easy19 = Math.max(8, 20) + 95 + 4;
  assert.equal(runCoinReward({ leftover: 10, levelIndex: 0, combo: 19, streak: 1, coinMultiplier: 1 }), Math.round(easy19 * 1.2));
});

test("difficulty bands label the campaign and pay more on later worlds", () => {
  assert.equal(difficultyRating(5), 1);
  assert.equal(difficultyRating(6), 2);
  assert.equal(difficultyRating(15), 2);
  assert.equal(difficultyRating(16), 3);
  assert.equal(difficultyRating(25), 3);
  assert.equal(difficultyRating(26), 4);
  assert.equal(difficultyRating(41), 5);
  assert.equal(difficultyRating(56), 5);
  assert.equal(difficultyTitle(25), "Level 25: ★★★ Hard");
  assert.equal(difficultyLabel(1), "Easy");
  const easy = runCoinReward({ leftover: 10, levelIndex: 0, combo: 0, streak: 1 });
  const extreme = runCoinReward({ leftover: 10, levelIndex: 55, combo: 0, streak: 1 });
  assert.ok(extreme > easy);
});

test("star rating is 1 for a clear, 2 if clean, 3 with combo 15x", () => {
  assert.equal(starRating({ won: false }), 0);
  assert.equal(starRating({ won: true, hazardHitCount: 2, maxCombo: 4 }), 1);
  assert.equal(starRating({ won: true, hazardHitCount: 0, maxCombo: 4 }), 2);
  assert.equal(starRating({ won: true, hazardHitCount: 1, maxCombo: 15 }), 2);
  assert.equal(starRating({ won: true, hazardHitCount: 0, maxCombo: 15 }), 3);
  const flags = starFlags({ won: true, hazardHitCount: 0, maxCombo: 16 });
  assert.equal(flags.clear, true);
  assert.equal(flags.clean, true);
  assert.equal(flags.combo, true);
  assert.equal(levelStarsKey(7), "blobtide_level_7_stars");
});

test("clean 20-combo clear of level 15 is 3 stars and star skins stay locked until earned", () => {
  assert.equal(LEVELS[14].id, 15);
  assert.equal(starRating({ won: true, hazardHitCount: 0, maxCombo: 20 }), 3);
  const flags = starFlags({ won: true, hazardHitCount: 0, maxCombo: 20 });
  assert.equal(flags.clear && flags.clean && flags.combo, true);
  assert.deepEqual(starSkinsDue({}), []);
  assert.deepEqual(starSkinsDue({ 4: { stars: 1 } }), ["reef"]);
  assert.ok(starSkinsDue({ 4: { stars: 1 }, 7: { stars: 2 } }).includes("dusk"));
  const sweep = {};
  for (let i = 0; i < 10; i++) sweep[i] = { stars: 3, completed: true };
  assert.ok(starSkinsDue(sweep).includes("prestige"));
  assert.equal(STAR_UNLOCKS.dusk.levelId, 8);
  const save = sanitizeSave({ ownedSkins: ["lime", "reef", "hacked"] });
  assert.ok(save.ownedSkins.includes("reef"));
  assert.ok(!save.ownedSkins.includes("hacked"));
});

test("campaign map counts 20 clears and world star bars", () => {
  const stats = {};
  for (let i = 0; i < 20; i++) stats[i] = { completed: true, stars: 2 };
  const snap = campaignSnapshot({ stats, maxUnlocked: 20, bestCombo: 20, bestStreak: 4, playMs: 125000, ownedSkins: ["lime"] });
  assert.equal(snap.completed, 20);
  assert.equal(snap.stars, 40);
  assert.equal(snap.starMax, STAR_MAX);
  assert.equal(STAR_MAX, 168);
  assert.equal(snap.nextLevel, 21);
  const meadow = snap.worlds.find((w) => w.id === "meadow");
  const dunes = snap.worlds.find((w) => w.id === "dunes");
  const grove = snap.worlds.find((w) => w.id === "grove");
  const ember = snap.worlds.find((w) => w.id === "ember");
  assert.equal(meadow.stars, 10);
  assert.equal(meadow.starMax, 15);
  assert.equal(meadow.bar, barFill(10, 15));
  assert.equal(dunes.tint, "#ffa500");
  assert.equal(grove.cleared, 5);
  assert.equal(ember.dim, false);
  assert.equal(ember.current, true);
  const amber = snap.worlds.find((w) => w.id === "amber");
  assert.equal(amber.dim, true);
  assert.equal(starsKeyV2(15), "blobtide_stars_level15");
});

test("stats sanitizer drops junk keys", () => {
  const stats = sanitizeStats({ 0: { stars: 9, bestCoins: 12, completed: true, hack: 1 }, foo: {} });
  assert.equal(stats[0].stars, 3);
  assert.equal(stats[0].bestCoins, 12);
  assert.equal(stats[0].completed, true);
  assert.equal(stats.foo, undefined);
});

test("merge keeps the best run", () => {
  const merged = mergeLevelStat({ stars: 1, bestCoins: 10, bestCrowd: 8, completed: true }, {
    stars: 3,
    bestCoins: 4,
    bestCrowd: 20,
    completed: true,
  });
  assert.equal(merged.stars, 3);
  assert.equal(merged.bestCoins, 10);
  assert.equal(merged.bestCrowd, 20);
});

test("save round-trip keeps stats", () => {
  const clean = sanitizeSave({ coins: 20, stats: { 0: { stars: 2, bestCoins: 9, bestCrowd: 11, completed: true } } });
  assert.equal(clean.stats[0].stars, 2);
  assert.equal(clean.stats[0].bestCoins, 9);
});

test("platform adapter is a no-op without an SDK", async () => {
  assert.equal(Platform.has("commercialBreak"), false);
  assert.equal(await Platform.commercialBreak(), false);
  assert.equal(await Platform.rewardedBreak(), false);
});

test("CrazyGames install fails closed without the SDK script", async () => {
  assert.equal(await installCrazyGamesPlatform(), false);
});

test("CrazyGames muteAudio query forces silence", () => {
  assert.equal(muteAudioFromSearch("?muteAudio=true"), true);
  assert.equal(muteAudioFromSearch(""), false);
  assert.equal(muteAudioFromSearch("capture=1"), false);
});
