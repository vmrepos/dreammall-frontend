import { useCallback, useEffect, useState } from "react"
import {
  disableWebPush,
  enableWebPush,
  registration,
  syncWebPushSubscription,
  webPushSupported,
} from "../utils/webPush"

const DISMISS_KEY = "pedi2-web-push-dismissed"

export type TWebPushStatus = "unsupported" | "prompt" | "denied" | "subscribed" | "busy"

export const useWebPush = (enabled: boolean, restaurantId?: number | null) => {
  const [status, setStatus] = useState<TWebPushStatus>("unsupported")
  const [error, setError] = useState<string | null>(null)

  const refresh = useCallback(async () => {
    if (!enabled || !webPushSupported()) {
      setStatus("unsupported")
      return
    }

    if (Notification.permission === "denied") {
      setStatus("denied")
      return
    }

    try {
      const sw = await registration()
      const subscription = await sw.pushManager.getSubscription()
      if (subscription && Notification.permission === "granted") {
        setStatus("subscribed")
        return
      }

      setStatus("prompt")
    } catch {
      setStatus("unsupported")
    }
  }, [enabled])

  useEffect(() => {
    void refresh()
  }, [refresh])

  useEffect(() => {
    if (!enabled || !webPushSupported() || Notification.permission !== "granted") return
    void syncWebPushSubscription()
      .then(() => refresh())
      .catch(() => undefined)
  }, [enabled, restaurantId, refresh])

  const enable = useCallback(async () => {
    setError(null)
    setStatus("busy")
    try {
      await enableWebPush()
      window.localStorage.removeItem(DISMISS_KEY)
      setStatus("subscribed")
    } catch (caught) {
      const message = caught instanceof Error ? caught.message : "error"
      setError(message)
      if (message === "denied" || Notification.permission === "denied") setStatus("denied")
      else setStatus("prompt")
    }
  }, [])

  const disable = useCallback(async () => {
    setError(null)
    setStatus("busy")
    try {
      await disableWebPush()
    } finally {
      setStatus("prompt")
    }
  }, [])

  const dismissPrompt = useCallback(() => {
    window.localStorage.setItem(DISMISS_KEY, "1")
    void refresh()
  }, [refresh])

  const promptVisible =
    enabled &&
    status === "prompt" &&
    window.localStorage.getItem(DISMISS_KEY) !== "1"

  return { status, error, enable, disable, dismissPrompt, promptVisible, refresh }
}
