import { isCustomerHost } from "./host"

const RELOAD_KEY = "pedi2-customer-pwa-cleared"

const stripInstallHints = () => {
  document.querySelectorAll('link[rel="manifest"]').forEach((el) => el.remove())
  document
    .querySelectorAll(
      'meta[name="mobile-web-app-capable"], meta[name="apple-mobile-web-app-capable"], meta[name="apple-mobile-web-app-title"]',
    )
    .forEach((el) => el.remove())
}

/** Drop the comercio PWA on the customer hostname (manifest, SW, workbox caches). */
export const disableCustomerHostPwa = () => {
  if (!isCustomerHost()) return

  stripInstallHints()

  if (!("serviceWorker" in navigator)) return

  void (async () => {
    const registrations = await navigator.serviceWorker.getRegistrations()
    await Promise.all(registrations.map((registration) => registration.unregister()))
    if ("caches" in window) {
      const keys = await caches.keys()
      await Promise.all(keys.map((key) => caches.delete(key)))
    }
    const controlled = Boolean(navigator.serviceWorker.controller)
    if (controlled && sessionStorage.getItem(RELOAD_KEY) !== "1") {
      sessionStorage.setItem(RELOAD_KEY, "1")
      window.location.reload()
    }
  })()
}
