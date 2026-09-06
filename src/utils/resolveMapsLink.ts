import { apiClient } from "../services/apiClient"
import { findMapsUrl, parseShareLocation, type TCoords } from "./parseShareLocation"

export const resolveMapsLinkCoords = async (blob: string): Promise<TCoords | null> => {
  const direct = parseShareLocation(blob)
  if (direct) return direct

  const mapsUrl = findMapsUrl(blob)
  if (!mapsUrl) return null

  const expanded = await apiClient.restaurants.expandMapsUrl(mapsUrl)
  return parseShareLocation(expanded)
}
