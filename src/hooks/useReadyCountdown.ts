import { useEffect, useState } from "react"

export const useReadyCountdown = (initialSeconds: number | null | undefined) => {
  const [remaining, setRemaining] = useState<number | null>(() =>
    initialSeconds != null && initialSeconds > 0 ? Math.ceil(initialSeconds) : null,
  )

  useEffect(() => {
    if (initialSeconds == null || initialSeconds <= 0) {
      setRemaining(null)
      return
    }

    const target = Math.ceil(initialSeconds)
    setRemaining(target)

    const startedAt = Date.now()
    const id = window.setInterval(() => {
      const elapsed = Math.floor((Date.now() - startedAt) / 1000)
      const next = target - elapsed
      setRemaining(next > 0 ? next : null)
    }, 1000)

    return () => window.clearInterval(id)
  }, [initialSeconds])

  return remaining
}
