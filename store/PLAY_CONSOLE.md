# Blobtide — Play Console (Android)

Package: `com.blobtide.game`  
Default language: English (US)  
Category: Game → Arcade (or Casual)  
Tags: runner, hypercasual, one-thumb, puzzle  
Content rating: questionnaire as **Everyone** / PEGI 3 if no violence beyond abstract blobs. Do **not** check “designed for children” (COPPA).

## Store listing copy

**Title (30):** Blobtide

**Short (80):** Swerve a glowing slime crowd through x2 gates and smash the golden door.

**Full:**
Blobtide is a one-thumb crowd runner. Drag to swerve. Hit + and x gates to grow. Dodge saws and holes. Smash the door if your crowd is big enough.

Honest gameplay: every Instagram clip is the real game, not a fake playable ad.

- 50+ short levels
- Cosmetic slime skins
- Rewarded extra life and 2x coins (optional)
- Remove ads anytime

## Assets to upload

| Asset | Spec |
|---|---|
| Icon | 512×512 PNG |
| Feature graphic | 1024×500 |
| Phone screenshots | at least 2, 9:16, 1080×1920 |
| Promo video | 9:16, 15–30s of **real** gameplay |

Capture screenshots from the web build: `http://localhost:5173/?capture=1`

## Data safety (paste answers)

- Collects: Analytics (optional), Advertising ID (if ads), Purchase history (if IAP)
- Encrypted in transit: Yes (HTTPS to Google)
- Users can request deletion: Yes — uninstall + reset advertising ID; no account server
- Data used for ads: Yes if AdMob enabled
- Data sold: No
- Targeted advertising: Yes if personalized ads consented
- Account: No

## Closed test

1. Create app → Play App Signing (Google managed)
2. Upload AAB from Unity `Blobtide/Build Android AAB` **or** Capacitor Android bundle
3. Internal testing (yourself) → closed testing (12 testers, 14 days if you need production access as a new personal developer)
4. Production after policy + content rating + Data safety complete

## Privacy policy URL

Host `legal/privacy-policy.html` and paste the HTTPS URL here.

## IAP products (Play Console → Monetize)

| Product ID | Type | Price suggestion |
|---|---|---|
| remove_ads | managed | $2.99 |
| coins_200 | managed | $0.99 |
| coins_1000 | managed | $3.99 |
| skin_prism | managed | $1.99 |

Replace AdMob test IDs in `AdsService` / `native/admob.js` with your real units **after** a closed test, never before.

## Signing

Create a keystore you will never lose:

```
keytool -genkey -v -keystore blobtide-upload.keystore -alias blobtide -keyalg RSA -keysize 2048 -validity 10000
```

Do not commit the keystore. Prefer Play App Signing.
