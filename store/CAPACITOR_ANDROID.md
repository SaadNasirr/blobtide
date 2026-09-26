# Capacitor Android (Windows) — alternative to Unity

If Unity 6 is not installed yet, you can still ship the **same playable game** (this web client) as an Android app.

```
npm install
npm run build
npm install @capacitor/core @capacitor/cli @capacitor/android
npx cap init Blobtide com.blobtide.game --web-dir dist
npx cap add android
npx cap sync
```

Then in Android Studio: Generate App Bundle.

AdMob: `@capacitor-community/admob`  
IAP: `@capgo/native-purchases` or Google Play Billing via a Capacitor plugin  

`src/platform/capacitorBridge.js` assigns `window.BlobtideNativeAds` / `window.BlobtideNativeIap` and restores purchases on boot. Keep Google **test** ad units until closed testing. Then paste real units into `src/config.js`.

Do not enable mock IAP on the live site — only localhost still grants test purchases.

iOS still needs a Mac for `npx cap add ios` + Xcode.
