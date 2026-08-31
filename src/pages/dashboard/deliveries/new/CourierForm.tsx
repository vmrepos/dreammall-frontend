import { useState } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faLocationDot,
  faNoteSticky,
  faPhone,
  faUser,
} from "@fortawesome/free-solid-svg-icons"
import { Button } from "../../../../components/atoms/Button"
import { Card } from "../../../../components/atoms/Card"
import { Label } from "../../../../components/atoms/Label"
import {
  AddressSearchField,
  type TAddressSelection,
} from "../../../../components/molecules/AddressSearchField"
import { FormField } from "../../../../components/molecules/FormField"
import { inputClassName } from "../../../../components/atoms/Input"
import { LocationPicker } from "../../../public/order/complete/LocationPicker"
import type { ShipmentPreview } from "../../../../services/shipments"
import type { TShipmentFormValues } from "../../../../types/Shipment"
import { cn, formatCurrency } from "../../../../utils/format"

type Props = {
  values: TShipmentFormValues
  preview: ShipmentPreview | null
  isCalculating: boolean
  isCreating: boolean
  onChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
  onPickupAddressSelect: (selection: TAddressSelection) => void
  onDestinationAddressSelect: (selection: TAddressSelection) => void
  onPickupAddressChange: (address: string) => void
  onDestinationAddressChange: (address: string) => void
  onPickupCoordinatesChange: (latitude: number | null, longitude: number | null) => void
  onDestinationCoordinatesChange: (latitude: number | null, longitude: number | null) => void
  onCalculate: () => void
  onCancel: () => void
  onConfirm: () => void
}

export const CourierForm = ({
  values,
  preview,
  isCalculating,
  isCreating,
  onChange,
  onPickupAddressSelect,
  onDestinationAddressSelect,
  onPickupAddressChange,
  onDestinationAddressChange,
  onPickupCoordinatesChange,
  onDestinationCoordinatesChange,
  onCalculate,
  onCancel,
  onConfirm,
}: Props) => {
  const [showPickupMap, setShowPickupMap] = useState(false)
  const [showDestinationMap, setShowDestinationMap] = useState(false)
  const hasPickupPin = values.pickup_latitude != null && values.pickup_longitude != null
  const hasDestinationPin =
    values.destination_latitude != null && values.destination_longitude != null

  const canSubmit =
    hasPickupPin &&
    hasDestinationPin &&
    Boolean(preview) &&
    !isCalculating &&
    values.pickup_name.trim().length > 0 &&
    values.pickup_phone.trim().length > 0 &&
    values.pickup_address.trim().length > 0 &&
    values.recipient_name.trim().length > 0 &&
    values.recipient_phone.trim().length > 0 &&
    values.destination_address.trim().length > 0

  return (
    <Card padding="lg">
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wide text-brand">
            Punto de recogida
          </h2>
          <FormField
            id="pickup_name"
            name="pickup_name"
            label="Nombre de quien entrega"
            icon={faUser}
            inputSize="sm"
            placeholder="Ej. Carlos Pérez"
            value={values.pickup_name}
            onChange={onChange}
            autoComplete="name"
          />
          <FormField
            id="pickup_phone"
            name="pickup_phone"
            label="Teléfono"
            icon={faPhone}
            inputSize="sm"
            type="tel"
            placeholder="Ej. 70000000"
            value={values.pickup_phone}
            onChange={onChange}
            autoComplete="tel"
          />
          <AddressSearchField
            id="pickup_address"
            label="Dirección de recogida"
            icon={faLocationDot}
            inputSize="sm"
            name="pickup_address"
            value={values.pickup_address}
            onChange={onChange}
            placeholder="Ej. Av. Principal 123"
            autoComplete="street-address"
            onPlaceSelect={onPickupAddressSelect}
            onMapClick={() => setShowPickupMap(true)}
            mapButtonLabel="Abrir mapa para ajustar la recogida"
          />
          <p className="text-xs text-gray-500">
            Selecciona una sugerencia o ajusta el punto manualmente.
          </p>
          {showPickupMap ? (
            <div className="relative aspect-square overflow-hidden rounded-xl border border-gray-200">
              <LocationPicker
                latitude={values.pickup_latitude}
                longitude={values.pickup_longitude}
                onChange={onPickupCoordinatesChange}
                onAddressChange={onPickupAddressChange}
                openOnMount
                allowDeviceLocation={false}
              />
            </div>
          ) : null}
          <div className="flex flex-col gap-2 text-left">
            <Label htmlFor="description">Descripción del paquete (opcional)</Label>
            <div className="relative">
              <FontAwesomeIcon
                icon={faNoteSticky}
                className="pointer-events-none absolute left-3.5 top-4 size-[18px] text-brand"
                aria-hidden
              />
              <textarea
                id="description"
                name="description"
                rows={3}
                maxLength={200}
                placeholder="Ej. Documentos, caja pequeña"
                value={values.description}
                onChange={onChange}
                className={cn(inputClassName, "resize-none !py-2.5 !text-sm pl-11 pr-3.5")}
              />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wide text-brand">Destino</h2>
          <FormField
            id="recipient_name"
            name="recipient_name"
            label="Nombre del destinatario"
            icon={faUser}
            inputSize="sm"
            placeholder="Ej. Ana Pérez"
            value={values.recipient_name}
            onChange={onChange}
            autoComplete="name"
          />
          <FormField
            id="recipient_phone"
            name="recipient_phone"
            label="Teléfono del destinatario"
            icon={faPhone}
            inputSize="sm"
            type="tel"
            placeholder="Ej. 70000000"
            value={values.recipient_phone}
            onChange={onChange}
            autoComplete="tel"
          />
          <AddressSearchField
            id="destination_address"
            label="Dirección de destino"
            icon={faLocationDot}
            inputSize="sm"
            name="destination_address"
            value={values.destination_address}
            onChange={onChange}
            placeholder="Ej. Calle Principal 456"
            autoComplete="street-address"
            onPlaceSelect={onDestinationAddressSelect}
            onMapClick={() => setShowDestinationMap(true)}
            mapButtonLabel="Abrir mapa para ajustar el destino"
          />
          <p className="text-xs text-gray-500">
            Selecciona una sugerencia o ajusta el punto manualmente.
          </p>
          {showDestinationMap ? (
            <LocationPicker
              latitude={values.destination_latitude}
              longitude={values.destination_longitude}
              onChange={onDestinationCoordinatesChange}
              onAddressChange={onDestinationAddressChange}
              openOnMount
              allowDeviceLocation={false}
            />
          ) : null}
        </div>
      </div>

      <div className="mt-6">
        <Button
          variant="secondary"
          onClick={onCalculate}
          disabled={!hasPickupPin || !hasDestinationPin || isCalculating}
        >
          {isCalculating ? "Calculando..." : "Calcular tarifa"}
        </Button>
      </div>

      {preview && hasPickupPin && hasDestinationPin ? (
        <div className="mt-6 rounded-xl bg-brand-light p-5">
          <h2 className="text-sm font-bold text-brand">Vista previa de tarifa</h2>
          <dl className="mt-4 grid grid-cols-2 gap-4 text-sm">
            <div>
              <dt className="text-gray-500">Distancia estimada</dt>
              <dd className="mt-1 text-lg font-semibold text-gray-900">
                {Number(preview.distance_km).toFixed(2)} km
              </dd>
            </div>
            <div>
              <dt className="text-gray-500">Costo de envío</dt>
              <dd className="mt-1 text-lg font-semibold text-brand">
                {formatCurrency(preview.fee)}
              </dd>
            </div>
          </dl>
        </div>
      ) : null}

      <div className="mt-8 flex justify-end gap-3 border-t border-gray-100 pt-6">
        <Button variant="secondary" onClick={onCancel}>
          Cancelar
        </Button>
        <Button onClick={onConfirm} disabled={!canSubmit || isCreating}>
          {isCreating ? "Creando..." : "Confirmar entrega"}
        </Button>
      </div>
    </Card>
  )
}
