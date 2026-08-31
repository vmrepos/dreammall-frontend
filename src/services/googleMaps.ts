import {
  importLibrary,
  setOptions,
  type LibraryMap,
} from "@googlemaps/js-api-loader"

export type GoogleMapsApi = {
  Map: LibraryMap["maps"]["Map"]
  Marker: LibraryMap["marker"]["Marker"]
  Geocoder: LibraryMap["geocoding"]["Geocoder"]
  event: LibraryMap["core"]["event"]
}

export type GooglePlacesApi = {
  places: LibraryMap["places"]
}

export type GoogleLatLng = {
  lat: () => number
  lng: () => number
}

export const googleMapsKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string | undefined

let googleMapsLoader: Promise<GoogleMapsApi> | null = null
let googleMapsApi: GoogleMapsApi | null = null
let googlePlacesLoader: Promise<GooglePlacesApi> | null = null
let googlePlacesApi: GooglePlacesApi | null = null

export const getGoogleMaps = () => googleMapsApi

const configureGoogleMaps = (key: string) => {
  setOptions({
    key,
    v: "weekly",
    language: "es",
    region: "BO",
  })
}

export const loadGoogleMaps = (key: string) => {
  if (googleMapsLoader) return googleMapsLoader

  configureGoogleMaps(key)
  googleMapsLoader = Promise.all([
    importLibrary("core"),
    importLibrary("maps"),
    importLibrary("marker"),
    importLibrary("geocoding"),
  ]).then(([core, maps, marker, geocoding]) => {
    googleMapsApi = {
      Map: maps.Map,
      Marker: marker.Marker,
      Geocoder: geocoding.Geocoder,
      event: core.event,
    }
    return googleMapsApi
  })

  return googleMapsLoader
}

export const loadGooglePlaces = (key: string) => {
  if (googlePlacesLoader) return googlePlacesLoader

  configureGoogleMaps(key)
  googlePlacesLoader = importLibrary("places").then((places) => {
    googlePlacesApi = { places }
    return googlePlacesApi
  })

  return googlePlacesLoader
}
