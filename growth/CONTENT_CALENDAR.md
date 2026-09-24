# Reels / TikTok / Shorts pipeline

Blobtide is designed so the **game is the ad**. Do not film fake playable ads.

## Capture mode

Run the web game:

```
npm run dev
```

Open `http://localhost:5173/?capture=1` — HUD chrome is hidden.

Recommended framing:

- Phone emulator or the desktop 9:16 frame
- 1080×1920, 30–60 fps
- First 2 seconds: a readable `x10` or door smash, no logo bumper
- Mute-readable: giant gate numbers already in-world

Windows Game Bar (`Win + G`) or OBS:

- Canvas 1080×1920
- No webcam, no watermark

## Clip recipes (rotate these)

1. Fail-funny: walk into ÷2 then a saw
2. Greed: skip +8, take x3, barely smash the door
3. Stampede: x2 → x2 → x3, crowd fills the screen
4. Near-miss: door HP 1 above crowd, then retry with the right gate
5. Skin flex: Prism/Ember run on a later level

Post 4–7 times per week. Caption is gameplay, not a story. Link in bio = store or this web build.

## Weekly live-ops

Drop 5 new level objects into `src/content/levels.js` (`generated()` already has 56). Re-run:

```
npm run generate-levels
```

Keep Unity `StreamingAssets/levels.json` in sync (the script writes both).

## Calendar (first 4 weeks after store listing)

| Week | Goal |
|---|---|
| 1 | Tutorial clips + store live on Android |
| 2 | Fail compilations, first IAP screenshot post |
| 3 | “Help me pick a gate” poll stickers |
| 4 | iOS TestFlight public link + same winning Android creative |

Paid UA only after a creative gets organic replays. Test $50 on that one clip, not on five untested edits.
