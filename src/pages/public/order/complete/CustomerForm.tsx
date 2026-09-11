import type { ChangeEvent, FormEvent, ReactNode } from "react"
import { faLocationDot, faPhone, faUser } from "@fortawesome/free-solid-svg-icons"
import { Button } from "../../../../components/atoms/Button"
import { Card } from "../../../../components/atoms/Card"
import { FormField } from "../../../../components/molecules/FormField"
import { Label } from "../../../../components/atoms/Label"
import type { TPublicOrderCompleteForm } from "../../../../types/PublicOrder"
import { LocationPicker } from "./LocationPicker"

type Props = {
  values: TPublicOrderCompleteForm
  isSubmitting: boolean
  error: string
  onChange: (e: ChangeEvent<HTMLInputElement>) => void
  onLocationChange: (latitude: number, longitude: number) => void
  onSubmit: (e: FormEvent<HTMLFormElement>) => void
  fromRestaurant?: boolean
  extraFields?: ReactNode
  totals?: ReactNode
  submitDisabled?: boolean
}

export const CustomerForm = ({
  values,
  isSubmitting,
  error,
  onChange,
  onLocationChange,
  onSubmit,
  fromRestaurant = false,
  extraFields,
  totals,
  submitDisabled = false,
}: Props) => {
  const phoneReady = values.phone.trim().length > 0

  return (
    <Card padding="lg">
      <form className="flex flex-col gap-5" onSubmit={onSubmit}>
        <div className="flex flex-col gap-2 text-left">
          <Label>Ubicación de entrega</Label>
          <LocationPicker
            latitude={values.latitude}
            longitude={values.longitude}
            onChange={onLocationChange}
            allowDeviceLocation={!fromRestaurant}
          />
        </div>

        <FormField
          id="notes"
          name="notes"
          label="Punto de referencia"
          icon={faLocationDot}
          autoComplete="street-address"
          placeholder="Casa azul, portón negro, frente al kiosco..."
          value={values.notes}
          onChange={onChange}
        />

        <FormField
          id="name"
          name="name"
          label="Nombre"
          icon={faUser}
          autoComplete="name"
          placeholder="Tu nombre"
          value={values.name}
          onChange={onChange}
          required
        />
        <FormField
          id="phone"
          name="phone"
          label="Teléfono"
          icon={faPhone}
          type="tel"
          autoComplete="tel"
          placeholder="Teléfono"
          value={values.phone}
          onChange={onChange}
          required
        />

        {extraFields}

        {totals}

        {error ? (
          <div
            className="rounded-xl bg-red-50 px-4 py-3.5 text-left text-sm leading-snug text-red-600"
            role="alert"
          >
            {error}
          </div>
        ) : null}

        <Button
          type="submit"
          className="w-full"
          disabled={isSubmitting || submitDisabled || !phoneReady || values.latitude == null || values.longitude == null}
        >
          {isSubmitting ? "Calculando envío..." : "Ver resumen"}
        </Button>
      </form>
    </Card>
  )
}
