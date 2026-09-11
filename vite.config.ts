// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - TanStack devtools (dev-only, first), tanstackStart, viteReact, tailwindcss, tsConfigPaths,
//     nitro (build-only using cloudflare as a default target), VITE_* env injection, @ path alias,
//     React/TanStack dedupe, error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    // nitro/vite builds from this
    server: { entry: "server" },
  },
  vite: {
    plugins: [
      VitePWA({
        strategies: "generateSW",
        registerType: "autoUpdate",
        injectRegister: null,
        filename: "sw.js",
        manifest: false,
        devOptions: { enabled: false },
        workbox: {
          globPatterns: ["**/*.{js,css,woff,woff2,png,svg,ico,webmanifest}"],
          navigateFallback: null,
          cleanupOutdatedCaches: true,
          clientsClaim: true,
          skipWaiting: true,
          runtimeCaching: [
            {
              // HTML navigations: always try the network first.
              urlPattern: ({ request, url }) =>
                request.mode === "navigate" && !url.pathname.startsWith("/~oauth"),
              handler: "NetworkFirst",
              options: {
                cacheName: "zerocross-pages",
                networkTimeoutSeconds: 4,
                expiration: { maxEntries: 40, maxAgeSeconds: 60 * 60 * 24 },
              },
            },
            {
              // Supabase / API data: fresh when online, cached fallback offline.
              urlPattern: ({ url }) =>
                url.pathname.startsWith("/api/") ||
                url.hostname.endsWith(".supabase.co") ||
                url.hostname.endsWith(".supabase.in"),
              handler: "NetworkFirst",
              options: {
                cacheName: "zerocross-api",
                networkTimeoutSeconds: 6,
                expiration: { maxEntries: 200, maxAgeSeconds: 60 * 60 * 24 },
                cacheableResponse: { statuses: [0, 200] },
              },
            },
            {
              // Same-origin static assets.
              urlPattern: ({ request, sameOrigin }) =>
                sameOrigin &&
                ["style", "script", "worker", "image", "font"].includes(request.destination),
              handler: "CacheFirst",
              options: {
                cacheName: "zerocross-assets",
                expiration: { maxEntries: 200, maxAgeSeconds: 60 * 60 * 24 * 30 },
                cacheableResponse: { statuses: [0, 200] },
              },
            },
            {
              // Google Fonts.
              urlPattern: ({ url }) =>
                url.hostname === "fonts.googleapis.com" || url.hostname === "fonts.gstatic.com",
              handler: "CacheFirst",
              options: {
                cacheName: "zerocross-fonts",
                expiration: { maxEntries: 30, maxAgeSeconds: 60 * 60 * 24 * 365 },
                cacheableResponse: { statuses: [0, 200] },
              },
            },
          ],
        },
      }),
    ],
  },
});
