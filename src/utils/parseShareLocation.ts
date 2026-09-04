export type TCoords = {
  latitude: number
  longitude: number
}

const PAIR = String.raw`(-?\d+(?:\.\d+)?)\s*,\s*\+?(-?\d+(?:\.\d+)?)`

const asCoords = (latitude: number, longitude: number): TCoords | null => {
  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) return null
  if (latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) return null
  if (latitude === 0 && longitude === 0) return null
  return { latitude, longitude }
}

const safeDecode = (value: string) => {
  try {
    return decodeURIComponent(value.replace(/\+/g, " "))
  } catch {
    return value
  }
}

const PATTERNS: RegExp[] = [
  new RegExp(`[?&]q=${PAIR}`, "i"),
  new RegExp(`[?&]query=${PAIR}`, "i"),
  new RegExp(`[?&]ll=${PAIR}`, "i"),
  new RegExp(`[?&]center=${PAIR}`, "i"),
  new RegExp(`[?&]destination=${PAIR}`, "i"),
  new RegExp(`geo:${PAIR}`, "i"),
  new RegExp(`@${PAIR}`),
  /!3d(-?\d+(?:\.\d+)?)!4d(-?\d+(?:\.\d+)?)/,
  new RegExp(`(?:^|\\s)${PAIR}(?:\\s|$)`),
]

export const parseShareLocation = (blob: string): TCoords | null => {
  if (!blob.trim()) return null
  const sources = [safeDecode(blob), blob]
  for (const source of sources) {
    for (const pattern of PATTERNS) {
      const match = source.match(pattern)
      if (!match) continue
      const coords = asCoords(Number(match[1]), Number(match[2]))
      if (coords) return coords
    }
  }
  return null
}

export const findMapsUrl = (blob: string): string | null => {
  const match = blob.match(
    /https?:\/\/(?:(?:maps\.app\.)?goo\.gl\/[^\s]+|(?:www\.)?google\.[^\s/]+\/maps[^\s]*|maps\.google\.[^\s]+)/i,
  )
  if (!match) return null
  return match[0].replace(/[),.;]+$/g, "")
}
