import { useReadyCountdown } from "./useReadyCountdown"

export const usePrepProgress = (
  isPreparing: boolean,
  remainingFromApi: number | null | undefined,
  prepTimeMinutes: number | undefined,
) => {
  const ticking = useReadyCountdown(
    isPreparing && remainingFromApi != null && remainingFromApi > 0
      ? remainingFromApi
      : null,
  )

  if (!isPreparing) {
    return { remaining: null as number | null, percent: 0 }
  }

  const total = Math.max((prepTimeMinutes ?? 30) * 60, 1)
  const remaining = ticking ?? 0
  const percent = Math.min(100, Math.max(0, (remaining / total) * 100))

  return {
    remaining,
    percent,
  }
}
