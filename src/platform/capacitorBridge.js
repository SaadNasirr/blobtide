import { CONFIG } from "../config.js";

function platform() {
  const p = window.Capacitor?.getPlatform?.();
  return p === "ios" ? "ios" : "android";
}

export async function installNativeBridge() {
  const ads = window.Capacitor?.Plugins?.AdMob;
  const billing = window.Capacitor?.Plugins?.NativePurchases || window.Capacitor?.Plugins?.InAppPurchase;

  window.BlobtideNativeAds = {
    isNative: true,
    async showRewarded() {
      if (!ads?.rewardVideo) return false;
      const units = CONFIG.ads.testUnits;
      const adId = platform() === "ios" ? units.iosRewarded : units.androidRewarded;
      try {
        await ads.prepareRewardVideoAd({ adId });
        const result = await ads.showRewardVideoAd();
        return Boolean(result?.rewarded || result === true);
      } catch {
        return false;
      }
    },
    async showInterstitial() {
      if (!ads?.prepareInterstitial) return false;
      const units = CONFIG.ads.testUnits;
      const adId = platform() === "ios" ? units.iosInterstitial : units.androidInterstitial;
      try {
        await ads.prepareInterstitial({ adId });
        await ads.showInterstitial();
        return true;
      } catch {
        return false;
      }
    },
  };

  window.BlobtideNativeIap = {
    isNative: true,
    async buy(sku) {
      if (!billing) return false;
      try {
        if (billing.purchaseProduct) {
          const result = await billing.purchaseProduct({ productIdentifier: sku, sku });
          return Boolean(result?.purchased || result === true);
        }
        if (billing.buy) return Boolean(await billing.buy({ sku }));
        return false;
      } catch {
        return false;
      }
    },
    async restore() {
      if (!billing?.restorePurchases) return [];
      try {
        const result = await billing.restorePurchases();
        if (Array.isArray(result)) return result;
        if (Array.isArray(result?.purchases)) {
          return result.purchases.map((p) => p.productId || p.sku).filter(Boolean);
        }
        return [];
      } catch {
        return [];
      }
    },
  };
}
