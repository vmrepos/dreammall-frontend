import { useCallback, useEffect, useRef, useState } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faLocationCrosshairs,
  faLocationDot,
  faMinus,
  faPlus,
} from "@fortawesome/free-solid-svg-icons"
import { Button } from "../../../../components/atoms/Button"
import { cn } from "../../../../utils/format"

const DEFAULT_CENTER = { latitude: -17.7833, longitude: -63.1821 }
const MIN_ZOOM = 12
const MAX_ZOOM = 18
const TILE_SIZE = 256

type Coords = { latitude: number; longitude: number }

type Props = {
  latitude: number | null
  longitude: number | null
  onChange: (latitude: number, longitude: number) => void
}

type GoogleMapsApi = {
  Map: new (
    el: HTMLElement,
    opts: Record<string, unknown>,
  ) => {
    setCenter: (c: { lat: number; lng: number }) => void
    setZoom: (zoom: number) => void
    panTo: (c: { lat: number; lng: number }) => void
    addListener: (event: string, handler: (e?: { latLng?: LatLng }) => void) => void
  }
  Marker: new (opts: Record<string, unknown>) => {
    setPosition: (c: { lat: number; lng: number } | LatLng) => void
    getPosition: () => LatLng | null
    addListener: (event: string, handler: () => void) => void
  }
}

type LatLng = { lat: () => number; lng: () => number }

const googleMapsKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string | undefined

const getGoogleMaps = () =>
  (window as unknown as { google?: { maps: GoogleMapsApi } }).google?.maps

let googleMapsLoader: Promise<GoogleMapsApi> | null = null

const loadGoogleMaps = (key: string) => {
  const existing = getGoogleMaps()
  if (existing) return Promise.resolve(existing)
  if (googleMapsLoader) return googleMapsLoader

  googleMapsLoader = new Promise((resolve, reject) => {
    const script = document.createElement("script")
    script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(key)}`
    script.async = true
    script.dataset.googleMaps = "true"
    script.onload = () => {
      const maps = getGoogleMaps()
      if (maps) resolve(maps)
      else reject(new Error("Google Maps no cargó"))
    }
    script.onerror = () => reject(new Error("Google Maps no cargó"))
    document.head.appendChild(script)
  })

  return googleMapsLoader
}

const lngToTileX = (lng: number, zoom: number) => ((lng + 180) / 360) * 2 ** zoom

const latToTileY = (lat: number, zoom: number) => {
  const clamped = Math.min(Math.max(lat, -85.05112878), 85.05112878)
  const latRad = (clamped * Math.PI) / 180
  return (
    ((1 - Math.log(Math.tan(latRad) + 1 / Math.cos(latRad)) / Math.PI) / 2) * 2 ** zoom
  )
}

const tileXToLng = (x: number, zoom: number) => (x / 2 ** zoom) * 360 - 180

const tileYToLat = (y: number, zoom: number) => {
  const n = Math.PI - (2 * Math.PI * y) / 2 ** zoom
  return (180 / Math.PI) * Math.atan(Math.sinh(n))
}

const shiftCenter = (center: Coords, dx: number, dy: number, zoom: number): Coords => {
  const x = lngToTileX(center.longitude, zoom) - dx / TILE_SIZE
  const y = latToTileY(center.latitude, zoom) - dy / TILE_SIZE
  return { latitude: tileYToLat(y, zoom), longitude: tileXToLng(x, zoom) }
}

export const LocationPicker = ({ latitude, longitude, onChange }: Props) => {
  const onChangeRef = useRef(onChange)
  onChangeRef.current = onChange

  const [geoError, setGeoError] = useState("")
  const [locating, setLocating] = useState(true)
  const [useGoogle, setUseGoogle] = useState(Boolean(googleMapsKey))

  const coordsRef = useRef({ latitude, longitude })
  coordsRef.current = { latitude, longitude }

  const requestLocation = useCallback(() => {
    const applyDefaultIfEmpty = () => {
      if (coordsRef.current.latitude == null || coordsRef.current.longitude == null) {
        onChangeRef.current(DEFAULT_CENTER.latitude, DEFAULT_CENTER.longitude)
      }
    }

    if (!navigator.geolocation) {
      setLocating(false)
      setGeoError("Tu navegador no permite compartir la ubicación. Ajusta el pin en el mapa.")
      applyDefaultIfEmpty()
      return
    }

    setLocating(true)
    setGeoError("")
    navigator.geolocation.getCurrentPosition(
      (position) => {
        onChangeRef.current(position.coords.latitude, position.coords.longitude)
        setLocating(false)
      },
      () => {
        setLocating(false)
        setGeoError("No pudimos usar tu ubicación. Mueve el mapa para ajustar el pin.")
        applyDefaultIfEmpty()
      },
      { enableHighAccuracy: true, timeout: 12000, maximumAge: 0 },
    )
  }, [])

  useEffect(() => {
    requestLocation()
  }, [requestLocation])

  return (
    <div className="flex flex-col gap-2">
      <div className="relative overflow-hidden rounded-xl border border-gray-200">
        {useGoogle && googleMapsKey ? (
          <GoogleMapPin
            apiKey={googleMapsKey}
            latitude={latitude}
            longitude={longitude}
            onChange={onChange}
            onUnavailable={() => setUseGoogle(false)}
          />
        ) : (
          <OsmMapPin latitude={latitude} longitude={longitude} onChange={onChange} />
        )}
        {locating && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-surface-elevated/80 text-sm font-medium text-ink">
            Obteniendo tu ubicación...
          </div>
        )}
      </div>

      <Button
        type="button"
        variant="secondary"
        className="w-full rounded-lg py-2.5 text-xs"
        onClick={requestLocation}
        disabled={locating}
      >
        <FontAwesomeIcon icon={faLocationCrosshairs} className="size-4" aria-hidden />
        {locating ? "Obteniendo ubicación..." : "Usar ubicación de mi dispositivo"}
      </Button>

      {geoError ? (
        <p className="text-xs text-ink-muted" role="status">
          {geoError}
        </p>
      ) : (
        <p className="text-xs text-ink-muted">
          Usamos el pin de tu dispositivo. Arrastra el mapa o el marcador si necesitas
          corregirlo.
        </p>
      )}
    </div>
  )
}

const GoogleMapPin = ({
  apiKey,
  latitude,
  longitude,
  onChange,
  onUnavailable,
}: Props & { apiKey: string; onUnavailable: () => void }) => {
  const mapEl = useRef<HTMLDivElement>(null)
  const mapRef = useRef<InstanceType<GoogleMapsApi["Map"]> | null>(null)
  const markerRef = useRef<InstanceType<GoogleMapsApi["Marker"]> | null>(null)
  const onChangeRef = useRef(onChange)
  const onUnavailableRef = useRef(onUnavailable)
  onChangeRef.current = onChange
  onUnavailableRef.current = onUnavailable

  const lat = latitude ?? DEFAULT_CENTER.latitude
  const lng = longitude ?? DEFAULT_CENTER.longitude
  const latRef = useRef(lat)
  const lngRef = useRef(lng)
  latRef.current = lat
  lngRef.current = lng

  useEffect(() => {
    let cancelled = false

    const start = async () => {
      try {
        const maps = await loadGoogleMaps(apiKey)
        if (cancelled || !mapEl.current) return

        const center = { lat: latRef.current, lng: lngRef.current }
        const map = new maps.Map(mapEl.current, {
          center,
          zoom: 16,
          disableDefaultUI: true,
          zoomControl: true,
          gestureHandling: "greedy",
        })
        const marker = new maps.Marker({
          position: center,
          map,
          draggable: true,
        })

        marker.addListener("dragend", () => {
          const position = marker.getPosition()
          if (!position) return
          onChangeRef.current(position.lat(), position.lng())
        })
        map.addListener("click", (event) => {
          const position = event?.latLng
          if (!position) return
          marker.setPosition(position)
          onChangeRef.current(position.lat(), position.lng())
        })

        mapRef.current = map
        markerRef.current = marker
      } catch {
        onUnavailableRef.current()
      }
    }

    void start()
    return () => {
      cancelled = true
    }
  }, [apiKey])

  useEffect(() => {
    const center = { lat, lng }
    mapRef.current?.panTo(center)
    markerRef.current?.setPosition(center)
  }, [lat, lng])

  return <div ref={mapEl} className="h-64 w-full sm:h-80" />
}

const OsmMapPin = ({ latitude, longitude, onChange }: Props) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const [zoom, setZoom] = useState(16)
  const [size, setSize] = useState({ width: 320, height: 256 })
  const [dragging, setDragging] = useState(false)
  const dragRef = useRef<{ x: number; y: number; origin: Coords } | null>(null)

  const center: Coords = {
    latitude: latitude ?? DEFAULT_CENTER.latitude,
    longitude: longitude ?? DEFAULT_CENTER.longitude,
  }

  useEffect(() => {
    const node = containerRef.current
    if (!node) return

    const update = () => {
      const rect = node.getBoundingClientRect()
      setSize({ width: rect.width, height: rect.height })
    }
    update()
    const observer = new ResizeObserver(update)
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  const tiles = (() => {
    const centerX = lngToTileX(center.longitude, zoom)
    const centerY = latToTileY(center.latitude, zoom)
    const minX = Math.floor(centerX - size.width / TILE_SIZE / 2) - 1
    const maxX = Math.ceil(centerX + size.width / TILE_SIZE / 2) + 1
    const minY = Math.floor(centerY - size.height / TILE_SIZE / 2) - 1
    const maxY = Math.ceil(centerY + size.height / TILE_SIZE / 2) + 1
    const world = 2 ** zoom
    const items: Array<{ key: string; left: number; top: number; url: string }> = []

    for (let x = minX; x <= maxX; x += 1) {
      for (let y = minY; y <= maxY; y += 1) {
        if (y < 0 || y >= world) continue
        const wrappedX = ((x % world) + world) % world
        items.push({
          key: `${zoom}-${wrappedX}-${y}`,
          left: (x - centerX) * TILE_SIZE + size.width / 2,
          top: (y - centerY) * TILE_SIZE + size.height / 2,
          url: `https://${["a", "b", "c", "d"][Math.abs(wrappedX) % 4]}.basemaps.cartocdn.com/rastertiles/voyager/${zoom}/${wrappedX}/${y}.png`,
        })
      }
    }
    return items
  })()

  const commit = (next: Coords) => onChange(next.latitude, next.longitude)

  return (
    <div className="relative">
      <div
        ref={containerRef}
        className={cn(
          "relative h-64 w-full touch-none overflow-hidden bg-gray-100 sm:h-80",
          dragging ? "cursor-grabbing" : "cursor-grab",
        )}
        onPointerDown={(event) => {
          event.currentTarget.setPointerCapture(event.pointerId)
          dragRef.current = { x: event.clientX, y: event.clientY, origin: center }
          setDragging(true)
        }}
        onPointerMove={(event) => {
          const drag = dragRef.current
          if (!drag) return
          commit(
            shiftCenter(drag.origin, event.clientX - drag.x, event.clientY - drag.y, zoom),
          )
        }}
        onPointerUp={() => {
          dragRef.current = null
          setDragging(false)
        }}
        onPointerCancel={() => {
          dragRef.current = null
          setDragging(false)
        }}
        role="application"
        aria-label="Mapa para ajustar la ubicación de entrega"
      >
        {tiles.map((tile) => (
          <img
            key={tile.key}
            src={tile.url}
            alt=""
            draggable={false}
            className="pointer-events-none absolute max-w-none"
            style={{ left: tile.left, top: tile.top, width: TILE_SIZE, height: TILE_SIZE }}
          />
        ))}
        <div className="pointer-events-none absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-full">
          <FontAwesomeIcon icon={faLocationDot} className="size-8 drop-shadow-md text-[#ea4335]" />
        </div>
      </div>

      <div className="absolute right-3 top-3 z-10 flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-surface-elevated shadow-sm">
        <button
          type="button"
          className="px-2.5 py-1.5 text-ink hover:bg-gray-50 disabled:opacity-40"
          onClick={() => setZoom((current) => Math.min(MAX_ZOOM, current + 1))}
          disabled={zoom >= MAX_ZOOM}
          aria-label="Acercar"
        >
          <FontAwesomeIcon icon={faPlus} className="size-3.5" />
        </button>
        <button
          type="button"
          className="border-t border-gray-200 px-2.5 py-1.5 text-ink hover:bg-gray-50 disabled:opacity-40"
          onClick={() => setZoom((current) => Math.max(MIN_ZOOM, current - 1))}
          disabled={zoom <= MIN_ZOOM}
          aria-label="Alejar"
        >
          <FontAwesomeIcon icon={faMinus} className="size-3.5" />
        </button>
      </div>

      <p className="absolute bottom-2 left-2 z-10 rounded bg-white/80 px-1.5 py-0.5 text-[10px] text-ink-muted">
        © OpenStreetMap © CARTO
      </p>
    </div>
  )
}
