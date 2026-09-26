/** Store + ads + save limits. Real AdMob units replace TEST ids after closed testing. */
export const CONFIG = {
  appName: "Blobtide",
  packageId: "com.blobtide.game",
  liveUrl: "https://saadnasirr.github.io/blobtide/",
  privacyUrl: "https://saadnasirr.github.io/blobtide/privacy-policy.html",
  supportEmail: "saad.nasirr.23@gmail.com",
  saveVersion: 1,
  maxCoins: 500000,
  ads: {
    interstitialEveryWins: 3,
    minLevelForInterstitial: 3,
    minMsBetweenInterstitials: 90_000,
    rewardedTimeoutMs: 30_000,
    testUnits: {
      androidRewarded: "ca-app-pub-3940256099942544/5224354917",
      androidInterstitial: "ca-app-pub-3940256099942544/1033173712",
      iosRewarded: "ca-app-pub-3940256099942544/1712485313",
      iosInterstitial: "ca-app-pub-3940256099942544/4411468910",
    },
  },
  iap: {
    removeAds: "remove_ads",
    coins200: "coins_200",
    coins1000: "coins_1000",
    skinPrism: "skin_prism",
  },
};

export function isNativeApp() {
  try {
    const w = globalThis.window;
    return Boolean(w?.Capacitor?.isNativePlatform?.() || w?.BlobtideNativeIap?.isNative);
  } catch {
    return false;
  }
}

/** Fake IAP is only for local QA. Live web and store binaries must not grant coins for free. */
export function allowMockPurchases() {
  if (isNativeApp()) return false;
  try {
    const host = globalThis.location?.hostname;
    return host === "localhost" || host === "127.0.0.1";
  } catch {
    return false;
  }
}

export function allowMockAds() {
  if (isNativeApp()) return false;
  try {
    const host = globalThis.location?.hostname;
    return host === "localhost" || host === "127.0.0.1";
  } catch {
    return false;
  }
}
