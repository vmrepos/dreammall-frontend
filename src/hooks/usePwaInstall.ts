import { useCallback, useEffect, useState } from "react"

const DISMISS_KEY = "pedi2-pwa-install-dismissed"

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>
}

const isStandalone = () =>
  window.matchMedia("(display-mode: standalone)").matches ||
  window.matchMedia("(display-mode: fullscreen)").matches ||
  ("standalone" in navigator && Boolean((navigator as Navigator & { standalone?: boolean }).standalone))

const isIos = () => {
  const ua = window.navigator.userAgent
  const classic = /iphone|ipad|ipod/i.test(ua)
  const iPadOs = navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1
  return classic || iPadOs
}

export type PwaInstallMode = "chrome" | "ios"

export const usePwaInstall = (enabled: boolean) => {
  const [mode, setMode] = useState<PwaInstallMode | null>(null)
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null)

  useEffect(() => {
    if (!enabled || isStandalone() || window.localStorage.getItem(DISMISS_KEY) === "1") {
      setMode(null)
      setDeferred(null)
      return
    }

    const onPrompt = (event: Event) => {
      event.preventDefault()
      const installEvent = event as BeforeInstallPromptEvent
      setDeferred(installEvent)
      setMode("chrome")
    }

    const onInstalled = () => {
      setDeferred(null)
      setMode(null)
    }

    window.addEventListener("beforeinstallprompt", onPrompt)
    window.addEventListener("appinstalled", onInstalled)

    if (isIos()) setMode("ios")

    return () => {
      window.removeEventListener("beforeinstallprompt", onPrompt)
      window.removeEventListener("appinstalled", onInstalled)
    }
  }, [enabled])

  const install = useCallback(async () => {
    if (!deferred) return
    await deferred.prompt()
    const { outcome } = await deferred.userChoice
    setDeferred(null)
    if (outcome === "accepted") setMode(null)
  }, [deferred])

  const dismiss = useCallback(() => {
    window.localStorage.setItem(DISMISS_KEY, "1")
    setMode(null)
    setDeferred(null)
  }, [])

  return { mode, install, dismiss }
}
