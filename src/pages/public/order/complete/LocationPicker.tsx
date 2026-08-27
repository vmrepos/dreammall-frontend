import { useCallback, useEffect, useRef, useState } from "react"
import { createPortal } from "react-dom"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faArrowLeft,
  faExpand,
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
  /** Customer page: GPS. Restaurant staff: hide it so the pin is not the kitchen. */
  allowDeviceLocation?: boolean
}

type MapSurfaceProps = Props & {
  className?: string
  showControls?: boolean
  interactive?: boolean
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
  event: { trigger: (instance: unknown, eventName: string) => void }
}

type LatLng = { lat: () => number; lng: () => number }

const googleMapsKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string | undefined
const cartoKey = String(import.meta.env.VITE_CARTO_API_KEY ?? "").trim()

const cartoTileUrl = (zoom: number, x: number, y: number) => {
  const host = ["a", "b", "c", "d"][Math.abs(x) % 4]
  const url = `https://${host}.basemaps.cartocdn.com/rastertiles/voyager/${zoom}/${x}/${y}.png`
  return cartoKey ? `${url}?key=${encodeURIComponent(cartoKey)}` : url
}

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

export const LocationPicker = ({
  latitude,
  longitude,
  onChange,
  allowDeviceLocation = true,
}: Props) => {
  const onChangeRef = useRef(onChange)
  onChangeRef.current = onChange

  const [geoError, setGeoError] = useState("")
  const [locating, setLocating] = useState(allowDeviceLocation)
  const [useGoogle, setUseGoogle] = useState(Boolean(googleMapsKey))
  const [fullScreen, setFullScreen] = useState(false)

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
    if (!allowDeviceLocation) return
    requestLocation()
  }, [allowDeviceLocation, requestLocation])

  useEffect(() => {
    if (!fullScreen) return
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setFullScreen(false)
    }
    window.addEventListener("keydown", onKeyDown)
    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener("keydown", onKeyDown)
    }
  }, [fullScreen])

  const map = (
    <MapSurface
      latitude={latitude}
      longitude={longitude}
      onChange={onChange}
      useGoogle={useGoogle && Boolean(googleMapsKey)}
      apiKey={googleMapsKey}
      onUnavailable={() => setUseGoogle(false)}
      locating={locating}
      showControls={fullScreen}
      interactive={fullScreen}
    />
  )

  return (
    <div className="flex flex-col gap-2">
      <button
        type="button"
        className="relative aspect-square w-full overflow-hidden rounded-xl border border-gray-200 text-left"
        onClick={() => setFullScreen(true)}
        aria-label="Abrir mapa a pantalla completa"
      >
        {fullScreen ? null : map}
        <span className="absolute inset-0 z-20" aria-hidden />
        <span className="pointer-events-none absolute inset-x-0 bottom-0 z-30 flex items-center justify-center gap-2 bg-gradient-to-t from-black/55 to-transparent px-3 pb-3 pt-10 text-xs font-semibold text-white">
          <FontAwesomeIcon icon={faExpand} className="size-3.5" aria-hidden />
          Toca para ajustar en el mapa
        </span>
      </button>

      {allowDeviceLocation ? (
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
      ) : null}

      {geoError ? (
        <p className="text-xs text-ink-muted" role="status">
          {geoError}
        </p>
      ) : (
        <p className="text-xs text-ink-muted">
          {allowDeviceLocation
            ? "Toca el mapa para ampliarlo y arrastra el pin si necesitas corregirlo."
            : "Toca el mapa, mueve el pin hasta el destino y confirma. No uses la ubicación de este dispositivo."}
        </p>
      )}

      {fullScreen
        ? createPortal(
          <div
            className="fixed inset-0 z-50 flex flex-col bg-surface"
            role="dialog"
            aria-modal="true"
            aria-labelledby="location-picker-title"
          >
            <header className="flex shrink-0 items-center gap-3 border-b border-gray-200 px-3 py-3 pt-[max(0.75rem,env(safe-area-inset-top))]">
              <button
                type="button"
                className="inline-flex size-10 items-center justify-center rounded-xl text-ink hover:bg-gray-100"
                onClick={() => setFullScreen(false)}
                aria-label="Cerrar mapa"
              >
                <FontAwesomeIcon icon={faArrowLeft} className="size-5" aria-hidden />
              </button>
              <h2 id="location-picker-title" className="text-base font-semibold text-ink">
                Ubicación de entrega
              </h2>
            </header>

            <div className="relative min-h-0 flex-1">{map}</div>

            <div className="flex shrink-0 flex-col gap-2 border-t border-gray-200 bg-surface-elevated px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
              {allowDeviceLocation ? (
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
              ) : null}
              <Button
                type="button"
                className="w-full"
                disabled={latitude == null || longitude == null}
                onClick={() => setFullScreen(false)}
              >
                Usar esta ubicación
              </Button>
            </div>
          </div>,
          document.body,
        )
        : null}
    </div>
  )
}

const MapSurface = ({
  latitude,
  longitude,
  onChange,
  useGoogle,
  apiKey,
  onUnavailable,
  locating,
  showControls,
  interactive,
}: Props & {
  useGoogle: boolean
  apiKey?: string
  onUnavailable: () => void
  locating: boolean
  showControls: boolean
  interactive: boolean
}) => (
  <div className="absolute inset-0">
    {useGoogle && apiKey ? (
      <GoogleMapPin
        apiKey={apiKey}
        latitude={latitude}
        longitude={longitude}
        onChange={onChange}
        onUnavailable={onUnavailable}
        showControls={showControls}
        interactive={interactive}
      />
    ) : (
      <OsmMapPin
        latitude={latitude}
        longitude={longitude}
        onChange={onChange}
        showControls={showControls}
        interactive={interactive}
      />
    )}
    {locating && (
      <div className="absolute inset-0 z-10 flex items-center justify-center bg-surface-elevated/80 text-sm font-medium text-ink">
        Obteniendo tu ubicación...
      </div>
    )}
  </div>
)

const GoogleMapPin = ({
  apiKey,
  latitude,
  longitude,
  onChange,
  onUnavailable,
  showControls,
  interactive,
}: Props & { apiKey: string; onUnavailable: () => void } & Pick<
  MapSurfaceProps,
  "showControls" | "interactive"
>) => {
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
          zoomControl: showControls,
          gestureHandling: interactive ? "greedy" : "none",
          draggable: interactive,
        })
        const marker = new maps.Marker({
          position: center,
          map,
          draggable: Boolean(interactive),
        })

        marker.addListener("dragend", () => {
          const position = marker.getPosition()
          if (!position) return
          onChangeRef.current(position.lat(), position.lng())
        })
        map.addListener("click", (event) => {
          if (!interactive) return
          const position = event?.latLng
          if (!position) return
          marker.setPosition(position)
          onChangeRef.current(position.lat(), position.lng())
        })

        mapRef.current = map
        markerRef.current = marker
        maps.event.trigger(map, "resize")
        map.panTo(center)
      } catch {
        onUnavailableRef.current()
      }
    }

    void start()
    return () => {
      cancelled = true
    }
  }, [apiKey, interactive, showControls])

  useEffect(() => {
    const center = { lat, lng }
    mapRef.current?.panTo(center)
    markerRef.current?.setPosition(center)
  }, [lat, lng])

  useEffect(() => {
    const node = mapEl.current
    if (!node) return
    const observer = new ResizeObserver(() => {
      const maps = getGoogleMaps()
      const map = mapRef.current
      if (!maps || !map) return
      maps.event.trigger(map, "resize")
      map.panTo({ lat: latRef.current, lng: lngRef.current })
    })
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  return <div ref={mapEl} className="h-full w-full" />
}

const OsmMapPin = ({
  latitude,
  longitude,
  onChange,
  showControls = true,
  interactive = true,
}: MapSurfaceProps) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const [zoom, setZoom] = useState(16)
  const [size, setSize] = useState({ width: 320, height: 320 })
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
          url: cartoTileUrl(zoom, wrappedX, y),
        })
      }
    }
    return items
  })()

  const commit = (next: Coords) => onChange(next.latitude, next.longitude)

  return (
    <div className="relative h-full w-full">
      <div
        ref={containerRef}
        className={cn(
          "relative h-full w-full overflow-hidden bg-gray-100",
          interactive ? "touch-none" : "pointer-events-none",
          interactive && dragging ? "cursor-grabbing" : interactive ? "cursor-grab" : "",
        )}
        onPointerDown={
          interactive
            ? (event) => {
              event.currentTarget.setPointerCapture(event.pointerId)
              dragRef.current = { x: event.clientX, y: event.clientY, origin: center }
              setDragging(true)
            }
            : undefined
        }
        onPointerMove={
          interactive
            ? (event) => {
              const drag = dragRef.current
              if (!drag) return
              commit(
                shiftCenter(drag.origin, event.clientX - drag.x, event.clientY - drag.y, zoom),
              )
            }
            : undefined
        }
        onPointerUp={
          interactive
            ? () => {
              dragRef.current = null
              setDragging(false)
            }
            : undefined
        }
        onPointerCancel={
          interactive
            ? () => {
              dragRef.current = null
              setDragging(false)
            }
            : undefined
        }
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

      {showControls ? (
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
      ) : null}

      {showControls ? (
        <p className="absolute bottom-2 left-2 z-10 rounded bg-white/80 px-1.5 py-0.5 text-[10px] text-ink-muted">
          © OpenStreetMap © CARTO
        </p>
      ) : null}
    </div>
  )
}
