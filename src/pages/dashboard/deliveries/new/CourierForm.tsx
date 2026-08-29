import { useState } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faLocationDot, faNoteSticky, faPhone, faUser } from "@fortawesome/free-solid-svg-icons"
import { Button } from "../../../../components/atoms/Button"
import { Card } from "../../../../components/atoms/Card"
import { Label } from "../../../../components/atoms/Label"
import { FormField } from "../../../../components/molecules/FormField"
import { inputClassName } from "../../../../components/atoms/Input"
import { LocationPicker } from "../../../public/order/complete/LocationPicker"
import type { DeliveryPreview } from "../../../../services/deliveries"
import { parseCoordinates } from "../../../../utils/coordinates"
import { cn, formatCoords, formatCurrency } from "../../../../utils/format"

export type TCourierFormValues = {
  customer_name: string
  customer_phone: string
  notes: string
  latitude: number | null
  longitude: number | null
}

type Props = {
  values: TCourierFormValues
  preview: DeliveryPreview | null
  isCalculating: boolean
  isCreating: boolean
  onChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
  onPinChange: (latitude: number | null, longitude: number | null) => void
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
  onPinChange,
  onCalculate,
  onCancel,
  onConfirm,
}: Props) => {
  const [coordsInput, setCoordsInput] = useState(() =>
    formatCoords(values.latitude, values.longitude),
  )
  const hasPin = values.latitude != null && values.longitude != null

  const applyPin = (latitude: number, longitude: number) => {
    setCoordsInput(formatCoords(latitude, longitude))
    onPinChange(latitude, longitude)
  }

  const handleCoordsInput = (value: string) => {
    setCoordsInput(value)
    const parsed = parseCoordinates(value)
    if (parsed) {
      onPinChange(parsed.latitude, parsed.longitude)
      return
    }
    if (value.trim() === "") onPinChange(null, null)
  }
  const canSubmit =
    hasPin &&
    Boolean(preview) &&
    !isCalculating &&
    values.customer_name.trim().length > 0 &&
    values.customer_phone.trim().length > 0

  return (
    <Card padding="lg">
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-4">
          <FormField
            id="customer_name"
            name="customer_name"
            label="Nombre del destinatario"
            icon={faUser}
            placeholder="Ej. Ana Pérez"
            value={values.customer_name}
            onChange={onChange}
            autoComplete="name"
          />
          <FormField
            id="customer_phone"
            name="customer_phone"
            label="Teléfono"
            icon={faPhone}
            type="tel"
            placeholder="Ej. 70000000"
            value={values.customer_phone}
            onChange={onChange}
            autoComplete="tel"
          />
          <div className="flex flex-col gap-2 text-left">
            <Label htmlFor="notes">Qué lleva (opcional)</Label>
            <div className="relative">
              <FontAwesomeIcon
                icon={faNoteSticky}
                className="pointer-events-none absolute left-3.5 top-4 size-[18px] text-brand"
                aria-hidden
              />
              <textarea
                id="notes"
                name="notes"
                rows={3}
                maxLength={200}
                placeholder="Notas para el repartidor"
                value={values.notes}
                onChange={onChange}
                className={cn(inputClassName, "resize-none py-3.5 pl-11 pr-3.5")}
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <FormField
            id="coordinates"
            name="coordinates"
            label="Coordenadas"
            icon={faLocationDot}
            placeholder="-17.7833, -63.1821"
            value={coordsInput}
            onChange={(event) => handleCoordsInput(event.target.value)}
            autoComplete="off"
          />
          <p className="text-xs text-gray-500">
            Pega lat, lng o toca el mapa para marcar el destino.
          </p>
          <LocationPicker
            latitude={values.latitude}
            longitude={values.longitude}
            onChange={applyPin}
            allowDeviceLocation={false}
          />
        </div>
      </div>

      <div className="mt-6">
        <Button
          variant="secondary"
          onClick={onCalculate}
          disabled={!hasPin || isCalculating}
        >
          {isCalculating ? "Calculando..." : "Calcular tarifa"}
        </Button>
      </div>

      {preview && hasPin ? (
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
          <p className="mt-4 text-xs text-gray-500">
            Pin: {values.latitude?.toFixed(5)}, {values.longitude?.toFixed(5)}
          </p>
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
