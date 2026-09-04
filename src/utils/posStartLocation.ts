import type { TCoords } from "./parseShareLocation"

export const POS_START_LOCATION_KEY = "pedi2-pos-start-location"

export const stashPosStartLocation = (coords: TCoords) => {
  sessionStorage.setItem(POS_START_LOCATION_KEY, JSON.stringify(coords))
}

export const readPosStartLocation = (): TCoords | null => {
  const raw = sessionStorage.getItem(POS_START_LOCATION_KEY)
  if (!raw) return null
  try {
    const parsed = JSON.parse(raw) as TCoords
    const latitude = Number(parsed.latitude)
    const longitude = Number(parsed.longitude)
    if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) return null
    return { latitude, longitude }
  } catch {
    return null
  }
}

export const clearPosStartLocation = () => {
  sessionStorage.removeItem(POS_START_LOCATION_KEY)
}
