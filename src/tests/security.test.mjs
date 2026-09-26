import assert from "node:assert/strict";
import test from "node:test";
import { CONFIG } from "../config.js";
import { sanitizeSave } from "../game/Economy.js";
import { shouldShowInterstitial } from "../game/adsPolicy.js";
import { Analytics, IapService } from "../game/Services.js";

test("save sanitizer rejects prototype junk, fake skins, and coin overflow", () => {
  const clean = sanitizeSave({
    coins: 9e12,
    ownedSkins: ["lime", "hacked", "void", 12, "__proto__"],
    equipped: "hacked",
    removeAds: "yes",
    levelIndex: 900,
    maxUnlocked: -4,
    winsSinceAd: 99,
    extra: "<script>",
    campaignComplete: 1,
  });
  assert.equal(clean.coins, CONFIG.maxCoins);
  assert.deepEqual(clean.ownedSkins, ["lime", "void"]);
  assert.equal(clean.equipped, "lime");
  assert.equal(clean.removeAds, false);
  assert.equal(clean.levelIndex, 55);
  assert.equal(clean.maxUnlocked, 0);
  assert.equal(clean.winsSinceAd, 30);
  assert.equal(clean.campaignComplete, false);
  assert.equal("extra" in clean, false);
});

test("interstitials wait for wins, later levels, and a 90s cooldown", () => {
  assert.equal(shouldShowInterstitial({ adsRemoved: true, winsSinceAd: 9, levelIndex: 10 }), false);
  assert.equal(shouldShowInterstitial({ winsSinceAd: 2, levelIndex: 10 }), false);
  assert.equal(shouldShowInterstitial({ winsSinceAd: 3, levelIndex: 1 }), false);
  assert.equal(shouldShowInterstitial({ winsSinceAd: 3, levelIndex: 5, tutorialActive: true }), false);
  assert.equal(
    shouldShowInterstitial({ winsSinceAd: 3, levelIndex: 5, lastShownAt: 1_000, now: 50_000 }),
    false
  );
  assert.equal(shouldShowInterstitial({ winsSinceAd: 3, levelIndex: 5, lastShownAt: 0, now: 200_000 }), true);
});

test("web IAP does not grant without native billing or localhost mock", async () => {
  const economy = {
    grantRemoveAds() {
      this.removeAds = true;
    },
    removeAds: false,
  };
  const iap = new IapService(economy);
  const ok = await iap.buyRemoveAds();
  assert.equal(ok, false);
  assert.equal(economy.removeAds, false);
});

test("analytics ignores unsafe event names", () => {
  let captured = null;
  globalThis.window = {
    BlobtideAnalytics: {
      event(name, props) {
        captured = { name, props };
      },
    },
  };
  Analytics.event("level_win;alert(1)", { level: 3 });
  assert.equal(captured, null);
  Analytics.event("level_win", { level: 3, email: "a@b.c", ok: true });
  assert.equal(captured.name, "level_win");
  assert.equal(captured.props.level, 3);
  assert.equal(captured.props.email, undefined);
  assert.equal(captured.props.ok, true);
});
