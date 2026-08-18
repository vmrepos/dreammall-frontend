import { useEffect, useState } from "react"

const SHORT_POS =
  "(orientation: landscape) and (pointer: coarse) and (max-height: 520px)"

export const useShortPos = () => {
  const [matches, setMatches] = useState(false)

  useEffect(() => {
    const media = window.matchMedia(SHORT_POS)
    const sync = () => setMatches(media.matches)
    sync()
    media.addEventListener("change", sync)
    return () => media.removeEventListener("change", sync)
  }, [])

  return matches
}
