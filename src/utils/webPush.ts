import { apiClient } from "../services/apiClient"

const urlBase64ToUint8Array = (value: string) => {
  const padding = "=".repeat((4 - (value.length % 4)) % 4)
  const base64 = (value + padding).replace(/-/g, "+").replace(/_/g, "/")
  const raw = atob(base64)
  const output = new Uint8Array(raw.length)
  for (let i = 0; i < raw.length; i += 1) output[i] = raw.charCodeAt(i)
  return output
}

export const webPushSupported = () =>
  typeof window !== "undefined" &&
  "Notification" in window &&
  "serviceWorker" in navigator &&
  "PushManager" in window

export const registration = async () => {
  const existing =
    (await navigator.serviceWorker.getRegistration("/r/")) ??
    (await navigator.serviceWorker.getRegistration())
  if (existing) return existing

  return Promise.race([
    navigator.serviceWorker.ready,
    new Promise<ServiceWorkerRegistration>((_, reject) => {
      window.setTimeout(() => reject(new Error("no-sw")), 4000)
    }),
  ])
}

export const enableWebPush = async () => {
  if (!webPushSupported()) throw new Error("unsupported")

  const permission = await Notification.requestPermission()
  if (permission !== "granted") throw new Error(permission)

  const { vapid_public_key } = await apiClient.webPush.config()
  const sw = await registration()
  const subscription =
    (await sw.pushManager.getSubscription()) ??
    (await sw.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(vapid_public_key),
    }))

  await apiClient.webPush.upsert(subscription.toJSON())
  return subscription
}

export const syncWebPushSubscription = async () => {
  if (!webPushSupported() || Notification.permission !== "granted") return

  const sw = await registration()
  const subscription = await sw.pushManager.getSubscription()
  if (!subscription) {
    await enableWebPush()
    return
  }

  await apiClient.webPush.upsert(subscription.toJSON())
}

export const disableWebPush = async () => {
  if (!webPushSupported()) return

  try {
    const sw = await registration()
    const subscription = await sw.pushManager.getSubscription()
    if (!subscription) return

    try {
      await apiClient.webPush.remove(subscription.endpoint)
    } catch {
      // Drop the local subscription even if the API call fails (logout).
    }
    await subscription.unsubscribe()
  } catch {
    return
  }
}
