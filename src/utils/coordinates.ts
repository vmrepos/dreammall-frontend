/** Parses "lat, lng" (WhatsApp / Maps style) into numbers. */
export const parseCoordinates = (
  value: string,
): { latitude: number; longitude: number } | null => {
  const match = value
    .trim()
    .match(/^(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)$/)

  if (!match) return null

  const latitude = Number(match[1])
  const longitude = Number(match[2])

  if (
    Number.isNaN(latitude) ||
    Number.isNaN(longitude) ||
    latitude < -90 ||
    latitude > 90 ||
    longitude < -180 ||
    longitude > 180
  ) {
    return null
  }

  return { latitude, longitude }
}
