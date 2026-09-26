import { allowMockAds, allowMockPurchases, CONFIG, isNativeApp } from "../config.js";
import { shouldShowInterstitial } from "./adsPolicy.js";
import { Platform } from "../platform/adapter.js";

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

export class AdsService {
  constructor(economy, overlay) {
    this.economy = economy;
    this.overlay = overlay;
    this.lastInterstitialAt = 0;
    this.rewardedBusy = false;
  }

  adsEnabled() {
    return !this.economy.removeAds;
  }

  canShowInterstitial(tutorialActive = false) {
    return shouldShowInterstitial({
      adsRemoved: !this.adsEnabled(),
      winsSinceAd: this.economy.winsSinceAd,
      levelIndex: this.economy.levelIndex,
      lastShownAt: this.lastInterstitialAt,
      now: Date.now(),
      tutorialActive,
    });
  }

  async showRewarded(reason) {
    if (this.rewardedBusy) return false;
    this.rewardedBusy = true;
    try {
      if (Platform.has("rewardedBreak")) {
        return Boolean(await Platform.rewardedBreak());
      }
      if (globalThis.window?.BlobtideNativeAds?.showRewarded) {
        return Boolean(await globalThis.window.BlobtideNativeAds.showRewarded(reason));
      }
      if (!allowMockAds()) return false;
      this.overlay.showAd("Rewarded", `Unlock ${reason}`, 1800);
      await sleep(1800);
      this.overlay.hideAd();
      return true;
    } catch {
      return false;
    } finally {
      this.rewardedBusy = false;
    }
  }

  async maybeInterstitial(tutorialActive = false) {
    if (!this.canShowInterstitial(tutorialActive)) return false;
    try {
      if (Platform.has("commercialBreak")) {
        await Platform.commercialBreak();
        this.lastInterstitialAt = Date.now();
        this.economy.winsSinceAd = 0;
        this.economy.save();
        return true;
      }
      if (globalThis.window?.BlobtideNativeAds?.showInterstitial) {
        const shown = await globalThis.window.BlobtideNativeAds.showInterstitial();
        if (shown) {
          this.lastInterstitialAt = Date.now();
          this.economy.winsSinceAd = 0;
          this.economy.save();
        }
        return Boolean(shown);
      }
      if (!allowMockAds()) return false;
      this.overlay.showAd("Break", "A short ad keeps Blobtide free.", 1600);
      await sleep(1600);
      this.overlay.hideAd();
      this.lastInterstitialAt = Date.now();
      this.economy.winsSinceAd = 0;
      this.economy.save();
      return true;
    } catch {
      return false;
    }
  }
}

const SKU_COINS = {
  [CONFIG.iap.coins200]: 200,
  [CONFIG.iap.coins1000]: 1000,
};

export class IapService {
  constructor(economy) {
    this.economy = economy;
  }

  async buyRemoveAds() {
    return this.fulfill(CONFIG.iap.removeAds, () => this.economy.grantRemoveAds());
  }

  async buyCoins(amount, sku) {
    const expected = SKU_COINS[sku];
    if (expected == null || expected !== amount) return false;
    return this.fulfill(sku, () => this.economy.addCoins(expected));
  }

  async buyPrism() {
    return this.fulfill(CONFIG.iap.skinPrism, () => {
      if (!this.economy.ownedSkins.includes("rainbow")) {
        this.economy.ownedSkins.push("rainbow");
      }
      this.economy.equipped = "rainbow";
      this.economy.save();
    });
  }

  async restore() {
    if (!globalThis.window?.BlobtideNativeIap?.restore) return false;
    try {
      const owned = await globalThis.window.BlobtideNativeIap.restore();
      const skus = Array.isArray(owned) ? owned : [];
      if (skus.includes(CONFIG.iap.removeAds)) this.economy.grantRemoveAds();
      if (skus.includes(CONFIG.iap.skinPrism) && !this.economy.ownedSkins.includes("rainbow")) {
        this.economy.ownedSkins.push("rainbow");
        this.economy.save();
      }
      return true;
    } catch {
      return false;
    }
  }

  async fulfill(sku, apply) {
    if (globalThis.window?.BlobtideNativeIap?.buy) {
      const ok = await globalThis.window.BlobtideNativeIap.buy(sku);
      if (ok) apply();
      return Boolean(ok);
    }
    if (allowMockPurchases()) {
      apply();
      return true;
    }
    return false;
  }
}

export const Analytics = {
  event(name, props = {}) {
    if (typeof name !== "string" || !/^[a-z][a-z0-9_]{0,39}$/.test(name)) return;
    const safe = {};
    const blocked = /^(email|name|phone|user|password|idfa|gaid|ip)$/;
    for (const [k, v] of Object.entries(props)) {
      if (!/^[a-z][a-z0-9_]{0,39}$/.test(k) || blocked.test(k)) continue;
      if (typeof v === "number" && Number.isFinite(v)) safe[k] = v;
      else if (typeof v === "string") safe[k] = v.slice(0, 80);
      else if (typeof v === "boolean") safe[k] = v;
    }
    if (globalThis.window?.BlobtideAnalytics?.event) {
      globalThis.window.BlobtideAnalytics.event(name, safe);
      return;
    }
    if (typeof globalThis.gtag === "function") {
      globalThis.gtag("event", name, safe);
    }
  },
};

export const Consent = {
  async request() {
    if (globalThis.window?.BlobtideConsent?.request) {
      return globalThis.window.BlobtideConsent.request();
    }
    return { att: false, ump: false, native: isNativeApp() };
  },
};
