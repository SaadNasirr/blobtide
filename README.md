# Blobtide

One-thumb crowd runner: swerve glowing slime, hit `+` / `x` gates, smash the door.

The **playable game is Vite + Three.js** (vanilla JS). `unity/` is a native port of the same levels. Jumping is **not** in the design — tracks have no gaps.

Honest ads only. Capture HUD-off clips with `/?capture=1`.

## Play locally

```
npm install
npm test
npm run dev
```

Open http://localhost:5173/

## Live web

HTTPS playable build: https://saadnasirr.github.io/blobtide/

Privacy: https://saadnasirr.github.io/blobtide/privacy-policy.html

## Production web build

```
npm run build
npm run preview
```

Deploy the `dist/` folder. Steps: [store/WEB_DEPLOY.md](store/WEB_DEPLOY.md). Checklist: [store/PUBLISHING_CHECKLIST.md](store/PUBLISHING_CHECKLIST.md).

## Controls

| Action | Desktop | Phone |
|---|---|---|
| Swerve | A / D or Left / Right | Drag |
| Pause | P or Esc | II button |
| Restart | R, or Pause → Restart | Retry |
| How to play / mute | How to play | same |

| Nitro | W / Space / tap | Tap |

## Tutorial

- First **menu Play**: full overlay.
- Second menu Play: short reminder.
- After that: none, unless **Replay tutorial**.
- Skip and Hide instructions persist in `localStorage` (`blobtide_tutorial`). A refresh does not wipe that.

## Content

56 levels (`src/content/levels.js`), 10 skins. `npm run generate-levels` copies JSON into `public/`, `content/`, and Unity StreamingAssets.

## Unity (Android / iOS)

Install Unity 6 LTS, copy `unity/Assets`, use **Blobtide → Create Game Scene**. iOS needs a Mac. See `store/PLAY_CONSOLE.md` and `store/APP_STORE.md`. This repo does **not** upload to the stores for you.

## Money

Rewarded continue / 2x coins, interstitial every 3 wins, IAP `remove_ads`, `coins_200`, `coins_1000`, `skin_prism`. Web ads are mocked until AdMob is wired.

Package ID: `com.blobtide.game`
