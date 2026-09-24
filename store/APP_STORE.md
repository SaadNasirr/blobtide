# Blobtide — App Store Connect (iOS)

Bundle ID: `com.blobtide.game`  
SKU: blobtide  
Primary category: Games → Arcade  
Age rating: 4+ if no realistic violence (complete the questionnaire honestly).

Windows cannot produce a signed IPA. Use one of:

1. Cheap Mac Mini + Xcode
2. MacinCloud / MacStadium
3. Unity Cloud Build or Codemagic: repo → IPA → TestFlight

## TestFlight path

1. Apple Developer ($99/year) — wait for enrollment
2. Identifiers → App ID `com.blobtide.game` with Game Center off, In-App Purchase on, Ads optional
3. Certificates + Distribution profile (or automatic signing)
4. Archive in Xcode → Distribute → App Store Connect
5. Internal testers first, then External (Beta App Review)
6. Submit for App Review with the same screenshots as Android

## Listing

**Name:** Blobtide  
**Subtitle:** Multiply the slime. Smash the gate.  
**Description:** same as Play listing.  
**Keywords:** crowd,runner,slime,gate,multiply,casual,hyper,swipe  
**Support URL:** your site or GitHub README  
**Privacy policy URL:** hosted `legal/privacy-policy.html`

## App Privacy (nutrition labels)

- Data used to track you: Advertising Data (if ATT allowed)
- Data linked to user: Purchases
- Data not linked: Crash data, Product Interaction (level events)
- Tracking: only after ATT authorize

## ATT prompt copy

“We use this to show ads that are more relevant. You can still play if you tap Ask App Not to Track.”

## IAP (App Store Connect)

Same product IDs as Android: `remove_ads`, `coins_200`, `coins_1000`, `skin_prism`.  
Review screenshot: a capture of the shop panel.

## Capabilities

- No Sign in with Apple required (no accounts)
- Export compliance: HTTPS only, standard encryption — typically the ITSAppUsesNonExemptEncryption = NO plist flag
