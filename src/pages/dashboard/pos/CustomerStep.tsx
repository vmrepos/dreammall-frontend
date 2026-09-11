import type { ChangeEvent } from "react"
import { faPhone, faUser } from "@fortawesome/free-solid-svg-icons"
import { Button } from "../../../components/atoms/Button"
import { Label } from "../../../components/atoms/Label"
import { FormField } from "../../../components/molecules/FormField"
import { LocationPicker } from "../../public/order/complete/LocationPicker"
import type { TOrderForm } from "../../../types/Order"
import { MapsLinkField } from "./MapsLinkField"

type Props = {
  values: TOrderForm
  onChange: (e: ChangeEvent<HTMLInputElement>) => void
  onLocationChange: (latitude: number, longitude: number) => void
  onContinue: () => void
  mapsPaste?: {
    busy: boolean
    error: string
    onApply: (raw: string) => Promise<void>
  }
}

export const CustomerStep = ({
  values,
  onChange,
  onLocationChange,
  onContinue,
  mapsPaste,
}: Props) => (
  <div className="min-h-0 flex-1 overflow-y-auto px-6 py-5 phone:px-4">
    <div className="mx-auto grid w-full max-w-5xl gap-8 lg:grid-cols-[minmax(0,22rem)_minmax(0,1fr)] lg:items-start">
      <div className="flex flex-col gap-5">
        <p className="text-sm text-ink-muted">
          Datos del cliente de WhatsApp. El pin de entrega lo pones tú, no uses la ubicación de esta
          pantalla.
        </p>
        <FormField
          id="customer_name"
          name="customer_name"
          label="Nombre"
          icon={faUser}
          autoComplete="name"
          placeholder="Nombre del cliente"
          value={values.customer_name ?? ""}
          onChange={onChange}
        />
        <FormField
          id="customer_phone"
          name="customer_phone"
          label="Teléfono"
          icon={faPhone}
          type="tel"
          autoComplete="tel"
          placeholder="Teléfono"
          value={values.customer_phone ?? ""}
          onChange={onChange}
        />
        <Button type="button" className="w-full lg:mt-2" onClick={onContinue}>
          Continuar al pedido
        </Button>
      </div>
      <div className="mx-auto w-full max-w-md lg:mx-0 lg:max-w-lg">
        <Label>Ubicación de entrega</Label>
        <div className="mt-2">
          <LocationPicker
            latitude={values.latitude ?? null}
            longitude={values.longitude ?? null}
            onChange={onLocationChange}
            allowDeviceLocation={false}
          />
        </div>
        {mapsPaste ? (
          <MapsLinkField
            busy={mapsPaste.busy}
            error={mapsPaste.error}
            onApply={mapsPaste.onApply}
          />
        ) : null}
      </div>
    </div>
  </div>
)
