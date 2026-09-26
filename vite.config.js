import { defineConfig } from "vite";

const csp = [
  "default-src 'self' https: data: blob:",
  "script-src 'self' 'unsafe-inline' https://sdk.crazygames.com",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' https://fonts.gstatic.com data:",
  "img-src 'self' data: https:",
  "connect-src 'self' https: wss:",
  "media-src 'self'",
  "base-uri 'self'",
].join("; ");

const securityHeaders = {
  "Content-Security-Policy": csp,
  "X-Content-Type-Options": "nosniff",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
};

export default defineConfig({
  base: "./",
  plugins: [
    {
      name: "portal-html",
      transformIndexHtml: {
        order: "post",
        handler(html) {
          return html.replace(/\s+crossorigin(="[^"]*")?/g, "");
        },
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
    target: "es2020",
    assetsInlineLimit: 0,
  },
});
