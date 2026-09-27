import fs from "node:fs";
import path from "node:path";
import { defineConfig } from "vite";

const csp = [
  "default-src 'self' https: data: blob:",
  "script-src 'self' 'unsafe-inline' https://sdk.crazygames.com",
  "style-src 'self' 'unsafe-inline'",
  "font-src 'self' data:",
  "img-src 'self' data: https:",
  "connect-src 'self' https: wss: http://127.0.0.1:7879",
  "media-src 'self'",
  "base-uri 'self'",
].join("; ");

const securityHeaders = {
  "Content-Security-Policy": csp,
  "X-Content-Type-Options": "nosniff",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
};

const portalLoader = `
    <script>
      (function () {
        function note(text) {
          var line = document.querySelector("#boot-home p");
          if (line) line.textContent = text;
        }
        function attach(src, onFail) {
          var el = document.createElement("script");
          el.src = src;
          el.async = false;
          el.onload = function () {
            setTimeout(function () {
              if (!window.__blobtideStarted) note("Game file loaded, starting…");
            }, 1200);
          };
          el.onerror = onFail;
          (document.body || document.head).appendChild(el);
        }
        function start() {
          if (window.__blobtideJsRan || window.__blobtideStarted) return;
          attach("assets/game.js", function () {
            attach("./assets/game.js", function () {
              note("Could not load game.js. Re-upload the zip with game.js next to index.html.");
            });
          });
        }
        if (document.body) start();
        else document.addEventListener("DOMContentLoaded", start);
        setTimeout(function () {
          if (!window.__blobtideStarted) {
            if (window.__blobtideJsRan) note("Game started late — wait or relaunch.");
            else note("Still waiting for game.js…");
          }
        }, 6000);
      })();
    </script>
`;

export default defineConfig({
  base: "./",
  plugins: [
    {
      name: "clip-save",
      apply: "serve",
      configureServer(server) {
        server.middlewares.use("/clip", (req, res, next) => {
          if (req.method !== "POST") {
            next();
            return;
          }
          const chunks = [];
          req.on("data", (c) => chunks.push(c));
          req.on("end", () => {
            const dest = path.resolve("store/covers/blobtide-preview-raw.webm");
            fs.mkdirSync(path.dirname(dest), { recursive: true });
            fs.writeFileSync(dest, Buffer.concat(chunks));
            res.statusCode = 200;
            res.end("ok");
          });
        });
      },
    },
    {
      name: "portal-html",
      apply: "build",
      transformIndexHtml: {
        order: "post",
        handler(html) {
          html = html.replace(/\s+crossorigin(="[^"]*")?/g, "");
          html = html.replace(/<script[^>]*src="https:\/\/sdk\.crazygames\.com[^"]*"[^>]*><\/script>\s*/g, "");
          html = html.replace(/<script[^>]*src="[^"]*game\.js"[^>]*><\/script>\s*/g, "");
          html = html.replace(/<script type="module"[^>]*src="[^"]+"[^>]*><\/script>\s*/g, "");
          if (!html.includes('src="game.js"')) {
            html = html.replace(
              "</body>",
              `    <script src="game.js"></script>\n${portalLoader}  </body>`
            );
          }
          return html;
        },
      },
      closeBundle() {
        const dist = path.resolve("dist");
        const fromAsset = path.join(dist, "assets", "game.js");
        const rootJs = path.join(dist, "game.js");
        if (fs.existsSync(fromAsset)) {
          let js = fs.readFileSync(fromAsset, "utf8");
          js = js.replace(
            "document.head.appendChild",
            "(document.head||document.documentElement).appendChild"
          );
          if (!js.startsWith("window.__blobtideJsRan")) {
            js =
              'window.__blobtideJsRan=1;try{' +
              js +
              '}catch(e){window.__blobtideBootErr=String((e&&e.message)||e);var n=document.querySelector("#boot-home p");if(n)n.textContent=window.__blobtideBootErr;console.error(e);}';
          }
          fs.writeFileSync(fromAsset, js);
          fs.writeFileSync(rootJs, js);
        }
      },
    },
  ],
  server: {
    port: 5173,
    host: true,
    headers: securityHeaders,
  },
  preview: {
    host: true,
    headers: securityHeaders,
  },
  build: {
    target: "es2019",
    assetsInlineLimit: 0,
    modulePreload: false,
    rollupOptions: {
      output: {
        format: "iife",
        name: "BlobtideApp",
        inlineDynamicImports: true,
        entryFileNames: "assets/game.js",
        chunkFileNames: "assets/[name].js",
        assetFileNames: "assets/[name][extname]",
      },
    },
  },
});
