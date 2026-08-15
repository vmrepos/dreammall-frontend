import { useEffect, useState } from "react"

const PHONE_PORTRAIT =
  "(orientation: portrait) and (pointer: coarse) and (max-width: 900px)"

const lockLandscape = async () => {
  const orientation = window.screen?.orientation
  if (!orientation || typeof orientation.lock !== "function") return

  try {
    await orientation.lock("landscape")
  } catch {
    // Desktop, iOS, or a regular browser tab — lock is not allowed.
  }
}

export const useLandscapeLock = (enabled: boolean) => {
  const [phonePortrait, setPhonePortrait] = useState(false)

  useEffect(() => {
    if (!enabled) {
      setPhonePortrait(false)
      return
    }

    void lockLandscape()

    const media = window.matchMedia(PHONE_PORTRAIT)
    const sync = () => setPhonePortrait(media.matches)
    sync()
    media.addEventListener("change", sync)

    return () => {
      media.removeEventListener("change", sync)
      try {
        window.screen.orientation?.unlock()
      } catch {
        // ignore
      }
    }
  }, [enabled])

  return phonePortrait
}
