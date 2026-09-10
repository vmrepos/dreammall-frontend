import { readFileSync } from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"
import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import tailwindcss from "@tailwindcss/vite"
import { VitePWA } from "vite-plugin-pwa"

const root = path.dirname(fileURLToPath(import.meta.url))
const buildNumber = (
  process.env.VITE_BUILD_NUMBER ?? readFileSync(path.join(root, "BUILD_NUMBER"), "utf8")
).trim()
process.env.VITE_BUILD_NUMBER = buildNumber

const brand = "#0c6b3d"
const splash = "#0a2f22"

export default defineConfig({
  define: {
    "import.meta.env.VITE_BUILD_NUMBER": JSON.stringify(buildNumber),
  },
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: "autoUpdate",
      injectRegister: false,
      scope: "/r/",
      manifest: {
        name: "Pedi2 · Comercio",
        short_name: "Pedi2",
        description: "Panel de comercio Pedi2 para menú, pedidos y entregas.",
        lang: "es",
        theme_color: brand,
        background_color: splash,
        display: "standalone",
        orientation: "any",
        start_url: "/r/",
        scope: "/r/",
        categories: ["business", "food"],
        share_target: {
          action: "/r/pos/import-location",
          method: "GET",
          enctype: "application/x-www-form-urlencoded",
          params: {
            title: "title",
            text: "text",
            url: "url",
          },
        },
        icons: [
          {
            src: "pwa-192.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "any",
          },
          {
            src: "pwa-512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any",
          },
          {
            src: "pwa-maskable-192.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "maskable",
          },
          {
            src: "pwa-maskable-512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
        ],
      },
      workbox: {
        navigateFallback: "/index.html",
        navigateFallbackAllowlist: [/^\/r($|\/)/],
        navigateFallbackDenylist: [/^\/api\//],
        globPatterns: ["**/*.{js,css,html,ico,png,svg,webmanifest,woff2}"],
        importScripts: ["sw-push.js"],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: "StaleWhileRevalidate",
            options: { cacheName: "google-fonts-stylesheets" },
          },
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
            handler: "CacheFirst",
            options: {
              cacheName: "google-fonts-webfonts",
              expiration: {
                maxEntries: 16,
                maxAgeSeconds: 60 * 60 * 24 * 365,
              },
            },
          },
        ],
      },
    }),
  ],
  server: {
    host: true,
    port: 5173,
    watch: {
      usePolling: true,
    },
  },
})
