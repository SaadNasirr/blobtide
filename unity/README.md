# Unity drop-in

This folder is source, not a full Library cache.

1. Unity 6 LTS → new 3D (URP) project
2. Copy `Assets/` over the new project’s `Assets/`
3. Merge `Packages/manifest.json` dependencies
4. `Blobtide/Create Game Scene`
5. Put `levels.json` in `Assets/StreamingAssets/` (or `npm run generate-levels` from repo root)

IL2CPP + ARM64 + portrait are applied via **Blobtide/Apply Mobile Player Settings**.
