import type { ChangeEvent } from "react"
import { faUser } from "@fortawesome/free-solid-svg-icons"
import { Button } from "../../../components/atoms/Button"
import { Label } from "../../../components/atoms/Label"
import { FormField } from "../../../components/molecules/FormField"
import { LocationPicker } from "../../public/order/complete/LocationPicker"
import type { TOrderForm } from "../../../types/Order"

const PHONE_DIGITS = 8

const BoliviaFlag = () => (
  <svg
    viewBox="0 0 9 6"
    className="h-3.5 w-[21px] shrink-0 overflow-hidden rounded-[2px] shadow-[0_0_0_1px_rgba(0,0,0,0.08)]"
    aria-hidden
  >
    <rect width="9" height="2" fill="#DA291C" />
    <rect y="2" width="9" height="2" fill="#F4E400" />
    <rect y="4" width="9" height="2" fill="#007A33" />
  </svg>
)

type Props = {
  values: TOrderForm
  onChange: (e: ChangeEvent<HTMLInputElement>) => void
  onPhoneChange: (phone: string) => void
  onLocationChange: (latitude: number, longitude: number) => void
  onContinue: () => void
}

export const CustomerStep = ({
  values,
  onChange,
  onPhoneChange,
  onLocationChange,
  onContinue,
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
        <div className="flex flex-col gap-2 text-left">
          <Label htmlFor="customer_phone">Teléfono</Label>
          <div className="flex overflow-hidden rounded-xl border border-gray-200 bg-surface-elevated transition focus-within:border-brand focus-within:ring-4 focus-within:ring-brand-muted">
            <span className="flex shrink-0 items-center gap-2 border-r border-gray-200 bg-gray-50 px-3.5 text-[15px] font-semibold text-ink">
              <BoliviaFlag />
              +591
            </span>
            <input
              id="customer_phone"
              name="customer_phone"
              type="tel"
              inputMode="numeric"
              autoComplete="tel"
              placeholder="71234567"
              value={values.customer_phone ?? ""}
              onChange={(e) =>
                onPhoneChange(e.target.value.replace(/\D/g, "").slice(0, PHONE_DIGITS))
              }
              maxLength={PHONE_DIGITS}
              className="min-w-0 flex-1 border-0 bg-transparent py-3.5 pl-3 pr-3.5 text-[15px] text-ink outline-none placeholder:text-ink-muted/60"
            />
          </div>
          <p className="text-xs text-ink-muted">8 dígitos, sin el código de país.</p>
        </div>
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
      </div>
    </div>
  </div>
)
