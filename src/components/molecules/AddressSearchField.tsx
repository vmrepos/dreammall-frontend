import { useEffect, useRef, type ComponentPropsWithoutRef } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faMapLocationDot } from "@fortawesome/free-solid-svg-icons"
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core"
import { Button } from "../atoms/Button"
import { Input } from "../atoms/Input"
import { Label } from "../atoms/Label"
import {
  googleMapsKey,
  loadGooglePlaces,
} from "../../services/googleMaps"

export type TAddressSelection = {
  address: string
  latitude: number
  longitude: number
}

type Props = {
  id: string
  label: string
  icon?: IconDefinition
  mapButtonLabel?: string
  onMapClick?: () => void
  onPlaceSelect: (selection: TAddressSelection) => void
} & Omit<ComponentPropsWithoutRef<typeof Input>, "id" | "hasIcon" | "hasTrailingIcon">

export const AddressSearchField = ({
  id,
  label,
  icon,
  mapButtonLabel = "Abrir mapa para ajustar ubicación",
  onMapClick,
  onPlaceSelect,
  ...inputProps
}: Props) => {
  const inputRef = useRef<HTMLInputElement>(null)
  const onPlaceSelectRef = useRef(onPlaceSelect)
  onPlaceSelectRef.current = onPlaceSelect

  useEffect(() => {
    if (!googleMapsKey || !inputRef.current) return

    let removeListener: (() => void) | undefined
    let cancelled = false

    void loadGooglePlaces(googleMapsKey)
      .then((maps) => {
        if (cancelled || !inputRef.current || !maps.places?.Autocomplete) return

        const autocomplete = new maps.places.Autocomplete(inputRef.current, {
          fields: ["formatted_address", "geometry"],
          componentRestrictions: { country: "bo" },
        })
        const listener = autocomplete.addListener("place_changed", () => {
          const place = autocomplete.getPlace()
          const location = place.geometry?.location
          const address =
            inputRef.current?.value.trim() || place.formatted_address?.trim()
          if (!location || !address) return

          onPlaceSelectRef.current({
            address,
            latitude: location.lat(),
            longitude: location.lng(),
          })
        })
        removeListener = listener.remove ? () => listener.remove?.() : undefined
      })
      .catch(() => {
        // Keep the field usable as a normal address input if Maps is unavailable.
      })

    return () => {
      cancelled = true
      removeListener?.()
    }
  }, [])

  return (
    <div className="flex flex-col gap-2 text-left">
      <Label htmlFor={id}>{label}</Label>
      <div className="relative">
        {icon ? (
          <FontAwesomeIcon
            icon={icon}
            className="pointer-events-none absolute left-3.5 top-1/2 size-[18px] -translate-y-1/2 text-brand"
            aria-hidden
          />
        ) : null}
        <Input
          ref={inputRef}
          id={id}
          hasIcon={Boolean(icon)}
          hasTrailingIcon={Boolean(onMapClick)}
          aria-autocomplete="list"
          {...inputProps}
          autoComplete="off"
        />
        {onMapClick ? (
          <Button
            variant="ghost"
            className="absolute right-1 top-1/2 size-10 -translate-y-1/2 rounded-lg p-0 text-brand"
            onClick={onMapClick}
            aria-label={mapButtonLabel}
            title={mapButtonLabel}
          >
            <FontAwesomeIcon icon={faMapLocationDot} className="size-4" aria-hidden />
          </Button>
        ) : null}
      </div>
    </div>
  )
}
