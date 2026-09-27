# Blobtide — project brief (for humans and other AIs)

Share this file with Claude (or any coding agent) so it understands **what Blobtide is now**, how it is built, how it looks, how audio and portals work, and how the rules work **before changing code**.

**Do not rewrite the game from scratch.** Extend the existing Vite + Three.js runner. Keep the blob identity. Do not clone Count Masters (or any other crowd runner) in look, names, or copy.

**Do not commit unless the user asks.** Do not silently change gate math or win conditions without updating tests and this brief.

Live web: https://saadnasirr.github.io/blobtide/  
Package ID: `com.blobtide.game`  
Privacy: https://saadnasirr.github.io/blobtide/privacy-policy.html  
Support: saad.nasirr.23@gmail.com

---

## Current state (September 2026)

Blobtide is a **shippable one-thumb 3D crowd runner** aimed at **CrazyGames** (HTML5 iframe) and GitHub Pages. Campaign is **56 levels** across **11 reusable worlds**. Graphics are low-poly, palette-driven, instanced, and GPU-capped for phones.

Recent polish that must stay:

- **Slam hammer** collider follows the hammer **head** while down (not the post). Hot window is the downswing. Wider Z/X hit so blobs under the visible head get hit. Math helpers: `slamDownAmount`, `slamArmAngle`, `slamHeadLocalX` in `LevelWorld.js`.
- **Leech** is a **red B coin** with a billboard **`-20 B` or `-30 B`** (not a cracked dark disc). Toast and float text use the same label. Amounts snap via `leechAmount` / `leechLabel` in `look.js`.
- **Music** is a Web Audio bed (no Tone.js, no MP3). It starts on first gesture / loading and **keeps playing** on menu CONTINUE, pause, COMPLETE / AGAIN, and Home. Do not `stopMusic()` on those screens. Music is ~10 dB quieter than SFX (`MUSIC_GAIN = 0.3162`).
- **Background** must not glitch: no transparent mountain fades on world swap, no extra near-ground overlay z-fighting the track, no sky-dome texture pops from animating time-of-day, clouds wrap Z without teleporting X, floor grid does not wobble sideways.
- **CrazyGames:** SDK v3 optional. `loadingStart` at boot, `loadingStop` after init, `gameplayStart` on play, `gameplayStop` on pause/menu/win/fail, `happytime` on win. `?muteAudio=true`. Rewarded CTAs **hidden** on CrazyGames host. Production zip **strips** the SDK `<script>` because the portal injects it.
- **Perf (live):** shadows **off**, god-rays **off**, antialias off on mobile, DPR caps, `DT_MAX = 0.033`, camera far **100 mobile / 140 desktop**, particle pool **500**, audio oneshots capped at **8**. Unique gate boards still dominate draw calls; do not turn shadows back on for “cinematic.”

Tests: `npm test` — **97** cases in `src/tests/*.test.mjs`.

---

## What the player is doing

Portrait **one-thumb** runner. Steer a pack of glowing slime blobs down a valley track.

- The pack is **one number**. Gates apply to the **whole crowd once**: `+` `-` `x` `/`.
- **Swerve** to take the better board, dodge traps, grab pickups, fight rivals.
- **Win** by beating the finish fight (cutter army or Warden) with leftover blobs ≥ door HP.
- **Fail** if crowd hits 0, or you lose the finish fight.

There is **no jump**. The track has **no gaps**. Input is drag / A-D. Nitro is W / Space / tap.

Fantasy: you are a **tide of teal slime**, not a human army. Rivals are original **armored sepoys with tulwars**, not stickmen. The boss is the **Warden**, not a giant numbered ball from another game.

HUD screens: splash → home (CONTINUE / Levels / Shop / Settings) → play HUD → pause → result (NEXT / Replay / Home, optional rewarded). Campaign **map** shows 11 worlds, star bars, next star-skin goal.

---

## Tech stack

| Layer | Choice |
| --- | --- |
| Language | Vanilla ES modules. **No React, Vue, or gameplay framework.** |
| Build | Vite 6, `base: "./"`. Dev: ES modules. Production: IIFE `dist/game.js` (+ `dist/assets/game.js`) for HTML5 portals |
| 3D | Three.js `^0.170` — WebGLRenderer, InstancedMesh, canvas textures, `BufferGeometryUtils.mergeGeometries` for fighters |
| UI | DOM HUD `src/ui/Hud.js` + `src/styles.css` over a full-viewport canvas |
| Audio | Custom Web Audio in `Juice.js` (`Sfx`). Procedural pads + sequenced notes. No Tone.js, no audio files |
| Saves | `localStorage` via `src/game/storage.js`, sanitized in `Economy.js` |
| Tests | `node --test src/tests/*.test.mjs` (jsdom-free; Three classes used where needed) |
| Portals | CrazyGames SDK v3 optional (`src/platform/crazygames.js` + `adapter.js`) |
| Native | Capacitor / AdMob stubs under `native/` and `src/platform/capacitorBridge.js` — **web is source of truth** |
| Unity | `unity/` is a **port of the same levels**, not the playable web game |
| Store kit | `store/covers/` images + preview video; `store/blobtide-crazygames.zip` |

Runtime constants (`src/game/gpu.js` and friends):

| Cap | Value |
| --- | --- |
| `DT_MAX` | 0.033 |
| DPR | iOS 1.0, Android/mobile 1.15, desktop 1.35; low-RAM mobile ≤ 4 GB → 1.0 |
| Shader precision | mediump mobile, highp desktop |
| Camera far | 100 mobile / 140 desktop |
| `MAX_DRAW_CALLS` | 80 (budget; live unique boards can exceed — do not add more unique mats) |
| `MAX_VRAM_MB` | 50 (guidance) |
| `MAX_PARTICLES` | 500, pickup burst ≤ 10, pit/geyser source cap 300 |
| `MAX_AUDIO_SOURCES` | 8 oneshots |
| `MAX_CLOUDS` | 50 |
| `MAX_FAR_PEAKS` / mid / props | 8 / 6 / 8 |
| Life | 16 trees, 12 birds, 8 wildlife, 240 life particles |
| Sky dome | radius 90, map 512, 1800 stars when night |

Renderer: `powerPreference: "high-performance"`, `alpha: false`, `shadowMap.enabled = false`, `outputColorSpace = SRGBColorSpace`. Fog is `THREE.Fog` retinted per world.

---

## How to run

```bash
npm install
npm test
npm run dev
```

Vite binds `--host`. If 5173 is taken it walks ports. Open the URL Vite prints.

```bash
npm run build      # dist/ for CrazyGames / GitHub Pages
npm run preview
```

Query flags:

| Flag | Effect |
| --- | --- |
| `?qa=1` | Dev-only hopper: Prev / Next / Scan 1–56 (`import.meta.env.DEV` only) |
| `?capture=1` | HUD-off recording |
| `?record=1` | With capture: MediaRecorder → POST `/clip` in Vite serve |
| `?muteAudio=true` | CrazyGames tester mute |

---

## Architecture (where things live)

```
src/main.js                 Boot, economy, ads/IAP, QA hopper, play/restart, CrazyGames loading
src/config.js               App id, live URL, ad/IAP product ids, mock-purchase host check
src/styles.css              HUD, overlays, campaign map, safe-area
index.html                  Canvas + HUD root, boot splash, CrazyGames loadingStart

src/game/Game.js            Loop: steer, collide, fights, chaser, win/fail, theme, camera, lighting tick
src/game/Crowd.js           Instanced slime pack, squash, trails, eyes, skins
src/game/LevelWorld.js      Track, gates, hazards, pickups, sepoys, Warden, slam/leech, tick anim
src/game/Fighters.js        Sepoy / tulwar / Warden meshes and pose clips
src/game/look.js            Canvas textures: grass, coins, leech, ASCII gate labels, pits
src/game/Input.js           Pointer + keys
src/game/Juice.js           SFX, world music beds, shake, hazard loops, weather ambience
src/game/Particles.js       Instanced spark pool
src/game/tween.js           TweenPool for camera / UI motion
src/game/CameraRig.js       FOV, steer lag, intro/victory/loss/boss modes
src/game/gpu.js             Device profile, shared geos, perf constants
src/game/Economy.js         Coins, skins, level index, streaks, save sanitize
src/game/progress.js        Stars 0–3, campaign map snapshot, coin reward
src/game/Tutorial.js        First/second session overlays
src/game/hook.js            Daily streak, missions, near-miss copy
src/game/Settings.js        Mute, music/SFX sliders
src/game/adsPolicy.js       Interstitial gates
src/game/storage.js         localStorage JSON
src/game/controls.js        Restart only from pause/result
src/game/Services.js        Analytics, consent, ads, IAP facades

src/game/Backdrop.js        Orchestrates sky + weather + terrain + life; hides unused old hills/birds
src/game/BackdropPro.js     AdvancedSkySystem: gradient dome, sun/moon, stars, aurora, mist
src/game/CloudSystem.js     WeatherSystem: instanced clouds, rain/dust, lightning flash
src/game/TerrainSystem.js   Far/mid peaks + props (instanced), parallax; near ground overlay hidden
src/game/EnvironmentalLife.js  Trees, wildlife, pollen/snow, water (many meshes hidden if unused)
src/game/AdvancedLighting.js   Hemi/dir/points, grade/vignette/bloom pulses; rays/shadows off live

src/content/levels.js       56 levels + simulatePlay / sealLevel / retuneEncounters
src/content/themes.js       11 WORLDS palettes, fog, sunT, decor flags
src/content/skins.js        Cosmetics + star-lock skins (no pay-to-win gates)

src/platform/adapter.js     Platform.has / commercialBreak / gameplayStart
src/platform/crazygames.js  SDK v3 bridge
src/platform/capacitorBridge.js

src/ui/Hud.js               All DOM screens
src/tests/*.test.mjs        Contract tests (keep green)
```

**Data flow:** `LEVELS` is built at import time. `Hud` CONTINUE → `Game.startLevel(level, index, skin)` → `applyWorld` + `LevelWorld.build` → each frame: `world.tick` (anim + slam/orbit x) then `_collide` in Z order.

---

## Visual design language

Keep this look. Do not slide back into generic purple “AI slop” or a Count Masters clone.

### Player

- Glossy teal/cyan blobs (`#2ec8d4` default skin Tide), emissive core, squash on hits, celebrate on good gates.
- Crowd is **one InstancedMesh** of spheres, not unique meshes per blob.
- Skins recolor the pack only (`src/content/skins.js`).

### Track

- Checker grass/sand/etc. **canvas** floor (`makeGridTexture` per **world id**, not per level).
- Dirt path, wooden rails, side berms (`MeshLambert` + side texture).
- Floor is `MeshBasic` + polygonOffset so it does not z-fight scenery.
- Arches, pits, steel, swirl textures from `look.js`.

### Gates and pickups

- Boards: big **ASCII** labels only (`+5`, `-2`, `x2`, `/3`). Never Unicode `×` `÷`.
- Good gold **B** coin vs **red B** leech with **`-20 B` / `-30 B`** sprite.
- Boost / magnet / shield / star / grow / snare are distinct 3D icons (snare is a purple horseshoe magnet, not a coin).

### Fighters

- **Sepoys:** cloth, bronze armor, helm, tulwar. Split torso + legs L/R + sword. Idle breath, walk, slash, stagger, death.
- **Warden:** unique larger fighter, cleaver, idle plant, cleave / spin / slam clips, intro cinematic, boss FOV 45°.
- Not stickmen. Not toddler-scale; they read taller than the blob pack.

### Worlds (11 palettes, not 56 maps)

`worldForLevel(id)` + `attachWorld(level)` set `worldId`, `worldName`, `laneLimit`. `Game.applyWorld` retints fog, clear color, lighting profile, backdrop. `LevelWorld` retints floor and instanced decor.

| Levels | World id | Name | Feel |
| --- | --- | --- | --- |
| 1–5 | meadow | Tide Meadow | Morning teal sky, green checker, trees, cumulus, pollen |
| 6–10 | dunes | Sandwake | Hot orange, sand, cacti, cirrus, dust |
| 11–15 | frost | Frostcap | Ice sky, pines, aurora hint, snow motes |
| 16–20 | grove | Fern Run | Deep green, vines, denser cloud |
| 21–25 | ember | Ember Bowl | Lava/ash path, jagged peaks, glow |
| 26–30 | amber | Amber Rim | Sunset canyon, gold grade |
| 31–35 | lagoon | Lagoon Run | Tropical water tints, palms |
| 36–40 | prism | Prism Hollow | Crystal / rainbow, shimmer |
| 41–45 | nightfen | Nightfen | Night dome, moon, stars, bog |
| 46–50 | highwake | Highwake | High mountain, cliffs, thin cloud |
| 51–56 | crown | Crown Peak | Dark finale, storm, ash, thick fog |

Decor flags include `trees`, `cacti`, `pines`, `grove`, `rocks`, `palms`, `crystals`. Lane width varies slightly per world (~3.05–3.35).

Fog **thickens** along a world band (`levelFog`). `sunT` is a **static** time-of-day per world (sunrise → sunset across the campaign). **Do not animate `timeOfDay` every frame** — that swapped sky canvas maps and popped the dome.

### Sky / weather / terrain / life / light (live pipeline)

`Backdrop` owns:

1. **BackdropPro (AdvancedSkySystem)** — inward sphere radius 90, painted gradient canvas (top/mid/horizon), sun or moon disc, optional stars (nightfen), optional aurora. Old wisps/ash/flash meshes are **hidden**.
2. **CloudSystem (WeatherSystem)** — instanced puff clouds (cumulus/stratus/cumulonimbus/cirrus), coverage/speed per world, rain/dust when profile says so. Morph UV scroll is **off** (it swam). Wrap only on Z.
3. **TerrainSystem** — instanced far mountains (desaturated), mid peaks, cone props. Parallax vs player X/Z. World swap is **instant** (no 0.7s opacity fade). `nearMesh` ground strip is **hidden** (z-fought the track). `propMesh` often hidden if it clipped the lane; keep props **off the track** (x ≳ 10.8).
4. **EnvironmentalLife** — instanced trees/wildlife/particles/water. Unused world types stay hidden so we do not pay for 0-count draws.
5. **AdvancedLighting** — hemisphere + directional + up to 3 point lights (ember). Color grade / vignette / bloom **pulses** as camera-parented planes. **Shadow maps off. God-rays off.** Chromatic off on mobile.

Old Backdrop hills/clouds/birds groups still exist for compatibility but should stay **invisible** if the new systems are on.

### Camera and juice

- Default FOV **50**. Combo 20 pulses 50→55→50 over 400ms. Boss **45**. Steer lag **100ms**, sway ±3°.
- Intro zoom, victory 360° orbit, loss slow-mo lock.
- Shake presets: hazard / combo10 / warden / victory (`Juice.js` `SHAKE`).
- Particles: good gate more sparks than bad; confetti on big combo / win.

### HUD art direction

- Rounded overlays, teal CTA, gold wallet pill, star row on results (Clear / No hits / Combo 15x).
- Safe-area insets for notches. Portrait-first; canvas fills the iframe.

---

## Audio design

All synthesized in `Sfx` (`Juice.js`).

- **World beds** (`WORLD_TRACKS`): meadow 90 BPM, dunes 100, frost 100, grove 105, ember 110, amber→ember style, lagoon→grove, prism→frost, nightfen→grove, highwake→dunes, crown 80 + storm noise. Pads + sequenced notes. Crossfade 0.5s on world change.
- **Boss:** 116 BPM, duck world −3 dB (`WORLD_BOSS_DUCK`). Dedicated spin / slam / growl / fanfare.
- **Gates:** add slide up, mul ping, sub/div down.
- **Combo:** 5 / 10 / 20 note stacks.
- **Hazards:** capped 6 looping voices, pitch vs speed/distance.
- **Weather:** wind −10 / −5 / 0 dB sunny/cloudy/storm; rain flag. Skip redundant `setWeatherAmbience` if kind+rain unchanged.
- **Mute:** settings + CrazyGames `muteAudio`. `setMix` zeros master.

Keep music on **loading, CONTINUE (home), pause, play-again / complete**. Resume AudioContext on pointer/touch.

---

## Core rules (the number)

```js
applyOp(op, count, value)
  add → count + v
  sub → max(0, count - v)
  mul → count * v
  div → floor(count / v)
  cap 99999
```

Labels: `opLabel` is ASCII only.

**Crowd is atomic.** A gate hits everyone at once. Dual gates: you only take **one** side (left x ≈ −1.12, right ≈ +1.12).

### Dual gates = the skill check

`trapSplit(z, seed)` places **one good** (`add` / `mul`) and **one bad** (`sub` / `div`) on opposite sides. Extra **narrow red boards** sit on the **center** of the lane (`width ≈ 1.02`). After a split, a skilled player is already offset and **misses** the skinny red. A greedy center line eats it.

There are **more red boards than green** across the campaign. That is intentional.

`simulatePlay(level)` is the “skilled thumb” model: pick the better dual, dodge off-center / pulsing / moving hazards, fight only if bigger.  
`simulatePlay(level, { worst: true })` takes the trap dual. That path must **not** beat the door.

Gates in simulation **respect lane**: if `|x - gate.x| > reach`, the board is skipped. Never apply every gate in Z order blindly.

### Sealing a level (fair but tight)

1. Build pieces (handcrafted 1–8, generated 9–56).
2. `retuneEncounters` — scale army/beast HP off a skilled walk so fights take a real bite but remain winnable.
3. `sealLevel` — set finish HP from skilled leftover vs worst leftover. Door is close to skilled `n`. Worst path fails.
4. `attachWorld`.

If you add pieces, **you must keep**:

- skilled `simulatePlay` → `ok` for all 56
- worst dual path cannot clear
- pieces monotonic in `z`
- one `finish` at the end

---

## Piece catalog

Colliders live on `LevelWorld.colliders`. `Game._collide` walks them by player `z`.

### Boards

| type | Meaning |
| --- | --- |
| `gate` | `{ op, value, x, width? }` — width default 2.2; trap reds use ~1.02 at x=0 |
| `dualgate` | `{ left, right }` each `{ op, value }` |

### Hazards (swerve or take damage)

| type | Feel |
| --- | --- |
| `saw` | Spinning disc. `move: true` = patrol (`mover`) |
| `wall` | Static spike wall |
| `spinner` | Horizontal rotor |
| `crusher` | Two slabs pulse; collider width changes |
| `hole` | Black-hole pit, ~30% crowd (`holeLoss`) |
| `geyser` | Pulse blast (`hot` when erupting); ~10% crowd (`geyserLoss`) |
| `pendulum` | Swinging blade (`collider.x` follows) |
| `orbit` | Two orbs; `hot` when an orb is in the lane |
| `slam` | Overhead hammer; `hot` when down; **x follows head** |
| `beam` | Sweeping bolt between pylons |

`HIT_HAZ` in `Game.js` treats `hot === false` as harmless that frame. Slam uses a longer Z window (~1.75 ahead, ~2.25 behind). Moving/pulse pieces are dodged in `simulatePlay`.

### Fights

| type | Meaning |
| --- | --- |
| `army` | Sepoy pack, `count` HP. Whole-crowd fight; leftover blobs stay |
| `beast` | Warden, `hp` |
| `finish` | Gold line + army or beast (`beast: true` for Warden door) |

Fight tick eats 1 vs 1 over time. Speed drops while fighting — that is when the **hound** can catch you.

### Pickups (good)

| type | Effect |
| --- | --- |
| `coin` | Wallet coins (x2 during `star`) |
| `boost` | Brief speed |
| `magnet` | Pulls coins |
| `shield` | Eat one hit |
| `star` | Coin multiplier |
| `grow` | Add people (not a gate) |

### Greedy / pressure

| type | Effect |
| --- | --- |
| `leech` | Red labeled coin **−20 B / −30 B** — subtracts **wallet coins** (`onCoin(-n)`), not crowd count |
| `snare` | Fake magnet — `snareT` pulls steer toward **center** |
| `chaser` | Hound behind the pack. Arms when you near its z. Bites if you stall in fights |

Design intent: **greed vs survival**. Coins on the center, reds on the center, leeches that look like coins until you read the minus label, snares that look like magnets. Correct play is the offset after a green split, then keep moving.

---

## Loop logic (Game.js)

1. Steer → optional snare shrink toward x=0 → crowd `targetX`.
2. Speed ramps with `levelIndex`, run time, boost, combo. Fights crawl. Finish slowdown exists.
3. Magnet pulls coins in range.
4. `_tickChasers` then `_collide` (no collide during fight except fight tick).
5. Combo increments on good gates, resets on reds/hits.
6. Win coins ≈ `10 + leftover + levelIndex + combo*5 + streak*4`, then ×1.25 if combo ≥ 20, then optional rewarded 2x.
7. Fail reasons: `wiped`, `hazard`, `hole`, `door`. Near-miss copy if you almost had door HP.
8. Backdrop + lighting tick every frame (menu uses slowed `worldDt` so the valley still breathes).

Pause **must not** keep simulating gameplay. Restart from pause/result only (`canRestart`). Pause **does** keep music.

---

## Progression and meta

- **56 linear levels**, unlock next on win. Last win sets `campaignComplete` (no wrap).
- **Stars 0–3** per level (`STAR_MAX = 168`):
  - 1★ clear (win)
  - 2★ no hazard hits (`hazardHitCount === 0`)
  - 3★ also combo ≥ 15 (`STAR_COMBO`)
- Best stars persist (`blobtide_level_N_stars` and `blobtide_stars_levelN`).
- **Campaign map** (`campaignSnapshot`): per-world star bars, cleared counts, next skin goal, mission line.
- **Skins** (`src/content/skins.js`): coin shop colors; **Reef** 1★ on level 5; **Dusk Tide** 2★ on level 8; **Prestige** 3★ on levels 1–10; **Prism** IAP-flagged. No pay-to-win gates.
- **Tutorial:** first Play = full, second = refresher, then off. Skip/hide persist (`blobtide_tutorial`).
- **Missions / daily streak** in `hook.js`.
- Save key prefix `blobtide_`. `sanitizeSave` drops prototype junk, fake skins, coin overflow (`maxCoins` 500000).
- Settings: mute, music volume, SFX volume.

### Ads / CrazyGames (do not break testers)

- Interstitial: not during play, not on fail, not tutorial, not first two real levels (min level index 3), every 3 wins, 90s cooldown (`adsPolicy.js` + `CONFIG.ads`).
- CrazyGames: `muteAudio=true`, `loadingStart/Stop`, `gameplayStart` on play not menu, ad wait timeout ~8s, hide dead rewarded CTAs on Basic Launch, `commercialBreak` only counts if an ad actually started.
- Mock IAP/ads **only** on localhost.
- CSP in Vite allows `https://sdk.crazygames.com`. Portal build removes the SDK tag and module scripts, injects `game.js` + a loader that retries `assets/game.js`.

CrazyGames zip: `index.html` + `game.js` next to each other, relative paths, no `crossorigin` on scripts.

---

## Tests you must not skip

```bash
npm test
```

They encode the contract:

- skilled clear of all 56
- trap dual cannot clear
- ASCII labels
- 11 worlds, unique layouts
- more red boards than green
- leech / snare / chaser exist; leech amounts 20 or 30; slam head tracking
- last level completes instead of wrapping
- stars / campaign map
- save sanitizer / ads policy / tutorial persistence
- gpu DPR caps, particle/audio caps
- weather / terrain / lighting / life / sky / camera / juice / fighters

If you add a piece type: wire `LevelWorld.build`, `Game` collide/tick, `simulatePlay` + `simulateBest` + `retuneEncounters`, then tests.

Dev QA: `npm run dev` → `/?qa=1` → **Scan 1–56**. Expect `OK 56 levels, 11 worlds`.

---

## How we design new content

1. **Identity first** — teal blobs, valley palettes, sepoys, ASCII boards, labeled red leech coins.
2. **Reusable assets** — new hazards share geos/mats; new worlds are palettes + weather/terrain/life/light profile keys.
3. **Begin / mid / end** per level — teach, pressure, finish fight. Later levels longer (`z` grows with id).
4. **Readable skill** — the good dual is the real plus; center is bait.
5. **Stuck, not random** — unfair RNG layouts are banned. Seal from simulation.
6. **Mobile/CrazyGames** — instancing, texture cache, dt/DPR caps, no 56 unique maps, no shadow maps, no extra full-screen additive haze.
7. **No silent gameplay rewrite** — don’t change gate math or win conditions without updating tests and this brief.
8. **Fair hazards** — if the player can see a slam/pendulum in their lane, the collider must match the mesh.

---

## What not to do

- Don’t copy Count Masters / other crowd-runner art, names, or UI chrome.
- Don’t use Unicode `×` `÷` on boards.
- Don’t treat dual gates as applying both sides.
- Don’t make every level the same meadow.
- Don’t spawn 56 unique high-poly environments.
- Don’t turn shadow maps or god-rays back on “for quality” (phones drop).
- Don’t fade terrain to transparent on world change.
- Don’t animate sky `timeOfDay` in a way that swaps canvas maps every band.
- Don’t `stopMusic()` on menu, pause, or result screens.
- Don’t make leech an unlabeled dark disc.
- Don’t leave slam hitboxes on the post origin.
- Don’t grant live-web IAP without native billing.
- Don’t show rewarded buttons that never resolve on CrazyGames Basic Launch.
- Don’t commit unless the user asks.

---

## Unity / stores

Web Three.js is canonical. `unity/` consumes the same level JSON for a native port. Publishing assets live under `store/` (covers 800×800, 800×1200, 1920×1080, portrait/landscape preview). This repo does not upload to stores by itself.
