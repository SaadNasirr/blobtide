function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

export class AdsService {
  constructor(economy, overlay) {
    this.economy = economy;
    this.overlay = overlay;
  }

  adsEnabled() {
    return !this.economy.removeAds;
  }

  async showRewarded(reason) {
    if (window.BlobtideNativeAds?.showRewarded) {
      return window.BlobtideNativeAds.showRewarded(reason);
    }
    this.overlay.showAd("Rewarded", `Unlock ${reason}`, 1800);
    await sleep(1800);
    this.overlay.hideAd();
    return true;
  }

  async maybeInterstitial() {
    if (!this.adsEnabled()) return false;
    if (this.economy.winsSinceAd < 3) return false;
    if (window.BlobtideNativeAds?.showInterstitial) {
      const shown = await window.BlobtideNativeAds.showInterstitial();
      if (shown) {
        this.economy.winsSinceAd = 0;
        this.economy.save();
      }
      return shown;
    }
    this.overlay.showAd("Break", "A short ad keeps Blobtide free.", 1600);
    await sleep(1600);
    this.overlay.hideAd();
    this.economy.winsSinceAd = 0;
    this.economy.save();
    return true;
  }
}

export class IapService {
  constructor(economy) {
    this.economy = economy;
  }

  async buyRemoveAds() {
    if (window.BlobtideNativeIap?.buy) {
      const ok = await window.BlobtideNativeIap.buy("remove_ads");
      if (ok) this.economy.grantRemoveAds();
      return ok;
    }
    this.economy.grantRemoveAds();
    return true;
  }

  async buyCoins(amount, sku) {
    if (window.BlobtideNativeIap?.buy) {
      const ok = await window.BlobtideNativeIap.buy(sku);
      if (ok) this.economy.addCoins(amount);
      return ok;
    }
    this.economy.addCoins(amount);
    return true;
  }

  async buyPrism() {
    if (window.BlobtideNativeIap?.buy) {
      const ok = await window.BlobtideNativeIap.buy("skin_prism");
      if (ok) {
        if (!this.economy.ownedSkins.includes("rainbow")) {
          this.economy.ownedSkins.push("rainbow");
        }
        this.economy.equipped = "rainbow";
        this.economy.save();
      }
      return ok;
    }
    if (!this.economy.ownedSkins.includes("rainbow")) {
      this.economy.ownedSkins.push("rainbow");
    }
    this.economy.equipped = "rainbow";
    this.economy.save();
    return true;
  }
}

export const Analytics = {
  event(name, props = {}) {
    if (window.BlobtideAnalytics?.event) {
      window.BlobtideAnalytics.event(name, props);
      return;
    }
    if (typeof gtag === "function") {
      gtag("event", name, props);
    }
  },
};

export const Consent = {
  async request() {
    if (window.BlobtideConsent?.request) {
      return window.BlobtideConsent.request();
    }
    return { att: true, ump: true };
  },
};
