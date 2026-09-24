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

Assign the plugins to `window.BlobtideNativeAds` / `window.BlobtideNativeIap` (see `native/admob.js`).

iOS still needs a Mac for `npx cap add ios` + Xcode.
