/**
 * Store builds should import `src/platform/capacitorBridge.js` from main.js
 * after Capacitor plugins load. This file is the QA mock only.
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
