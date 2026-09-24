# Web production deploy

The playable game is a static Vite build. Hosting does **not** need a Node server.

```
npm install
npm test
npm run build
```

Output is `dist/` (`index.html` + hashed assets, `base: "./"` so it works in a subfolder).

## Netlify (drag-and-drop or Git)

1. Site settings → build command `npm run build`, publish directory `dist`
2. Or drop the `dist` folder on [app.netlify.com/drop](https://app.netlify.com/drop)

SPA redirects are not required (no client router).

## GitHub Pages

```
npm run build
```

Upload `dist` to the `gh-pages` branch, or use the Pages “GitHub Actions” template for static Vite. Because `base` is `./`, project pages like `username.github.io/insta-game/` work.

## itch.io

Upload `dist` as an HTML5 zip. Set viewport to portrait 9:16 if itch embeds it.

## After deploy

Open the **https** URL on a phone. Confirm Play, drag, A/D, pause, mute, and that refresh does not reset coins (localStorage is origin-specific).

This does **not** publish Android/iOS. Those still need Play Console / App Store Connect accounts.
