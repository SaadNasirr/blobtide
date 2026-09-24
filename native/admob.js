/**
 * Optional Capacitor / native bridge.
 * Store builds should assign these on window after AdMob + Billing plugins load.
 */
export function installNativeMocks() {
  window.BlobtideNativeAds = window.BlobtideNativeAds || {
    async showRewarded() {
      return true;
    },
    async showInterstitial() {
      return true;
    },
  };
  window.BlobtideNativeIap = window.BlobtideNativeIap || {
    async buy() {
      return true;
    },
  };
  window.BlobtideConsent = window.BlobtideConsent || {
    async request() {
      return { att: true, ump: true };
    },
  };
  window.BlobtideAnalytics = window.BlobtideAnalytics || {
    event() {},
  };
}
