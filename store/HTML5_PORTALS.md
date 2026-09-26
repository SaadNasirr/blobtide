# HTML5 portals (CrazyGames / Poki)

Do **not** put AdMob or Google ads in a Poki/CrazyGames build. Those sites sell their own ads and pay you a revenue share. External ad SDKs get the game rejected.

## How you get paid

1. Submit the Vite `dist/` (or a zip of it) through their developer dashboards.
2. If they accept, they wrap the game and show **their** mid-rolls / rewardeds.
3. You get paid when their dashboard threshold is met (varies; often monthly, not AdMob’s $100 rule).

Blobtide talks to them only through `window.BlobtidePlatform` (`src/platform/adapter.js`):

- `gameplayStart` / `gameplayStop` — pause their ads during play
- `commercialBreak` — interstitial **between** levels (already gated: after wins, not in tutorial)
- `rewardedBreak` — optional 2x coins / +15 continue
- `happyTime` — win moment

The game runs if that object is missing.

## Will people play it?

Honest: crowd runners are familiar, so the loop is understandable in 30 seconds. Discovery on Poki/CrazyGames depends on **first-level clarity, mobile controls, and 16:9 desktop**. Organic GitHub Pages traffic will not pay. Portal featuring is the realistic web path; Play/App Store is a separate later path.

## CrazyGames launch (do this in their dashboard)

1. Build zip: `dist/` contents with `index.html` at the **zip root** (`store/blobtide-crazygames.zip` after `npm run build`).
2. Sign in at [developer.crazygames.com](https://developer.crazygames.com/).
3. Create **Blobtide**, upload the zip, add English description/controls, cover art, and a short trailer.
4. Use **Preview** in the portal, then submit for QA.
5. First go-live is usually **Basic Launch** (their ads off until they pick you for Full Launch).

The CrazyGames SDK loads from `sdk.crazygames.com` and maps to `window.BlobtidePlatform`. Do not add AdMob or other ad tags to this zip.

## Submit checklist

- 16:9 on landscape desktop (CSS), portrait still works on phones
- No Google Fonts requirement (Nunito falls back to system)
- No third-party ad tags
- localStorage saves; game still plays if storage is blocked
- Fast `npm run build`
- Do not ship Capacitor/AdMob in the portal zip
