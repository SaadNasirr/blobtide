import { defineConfig } from "vite";

const csp = [
  "default-src 'self'",
  "script-src 'self' https://sdk.crazygames.com",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' https://fonts.gstatic.com",
  "img-src 'self' data:",
  "connect-src 'self' https://sdk.crazygames.com https://www.crazygames.com https://api.crazygames.com",
  "media-src 'self'",
  "frame-ancestors 'self' https://www.crazygames.com https://crazygames.com https://www.poki.com https://poki.com",
  "base-uri 'self'",
  "form-action 'none'",
].join("; ");

const securityHeaders = {
  "Content-Security-Policy": csp,
  "X-Content-Type-Options": "nosniff",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
};

export default defineConfig({
  base: "./",
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
