# Publishing checklist (honest)

## Web (ready when `npm run build` succeeds)

- [x] `npm test` passes (local)
- [x] `npm run build` produces `dist/`
- [x] Host `dist/` on GitHub Pages (https://saadnasirr.github.io/blobtide/)
- [x] Privacy policy HTTPS URL
- [ ] Play on a real phone over HTTPS (audio unlock after first tap)
- [x] Save sanitizer + store-only IAP on the public web build

## Android (not submitted from this machine)

- [ ] Google Play developer account ($25, one-time)
- [ ] Unity 6 LTS **or** Capacitor path (`store/CAPACITOR_ANDROID.md`)
- [ ] Package `com.blobtide.game`, portrait, keystore backed up
- [ ] Replace AdMob **test** IDs with real units after closed testing
- [ ] Data safety + content rating + 512 icon (see PLAY_CONSOLE.md)
- [ ] Upload AAB — **not done unless you complete Play Console yourself**

## iOS (needs a Mac)

- [ ] Apple Developer ($99/year)
- [ ] Mac / cloud Mac + Xcode or Unity Cloud Build
- [ ] ATT copy + privacy nutrition labels (APP_STORE.md)
- [ ] TestFlight then App Review — **not done from Windows**

Do not treat this repo as “live on the stores.” Accounts, signing, and review are still on you.
