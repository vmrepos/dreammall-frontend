import type { ChangeEvent, FormEvent } from "react"
import { faUser } from "@fortawesome/free-solid-svg-icons"
import { Button } from "../../../../components/atoms/Button"
import { Card } from "../../../../components/atoms/Card"
import { FormField } from "../../../../components/molecules/FormField"
import { Label } from "../../../../components/atoms/Label"
import type { TPublicOrderCompleteForm } from "../../../../types/PublicOrder"
import { LocationPicker } from "./LocationPicker"

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
  values: TPublicOrderCompleteForm
  isSubmitting: boolean
  error: string
  onChange: (e: ChangeEvent<HTMLInputElement>) => void
  onPhoneChange: (phone: string) => void
  onLocationChange: (latitude: number, longitude: number) => void
  onSubmit: (e: FormEvent<HTMLFormElement>) => void
}

export const CustomerForm = ({
  values,
  isSubmitting,
  error,
  onChange,
  onPhoneChange,
  onLocationChange,
  onSubmit,
}: Props) => {
  const phoneReady = values.phone.length === PHONE_DIGITS

  return (
    <Card padding="lg">
      <form className="flex flex-col gap-5" onSubmit={onSubmit}>
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
        <div className="flex flex-col gap-2 text-left">
          <Label htmlFor="phone">Teléfono</Label>
          <div className="flex overflow-hidden rounded-xl border border-gray-200 bg-surface-elevated transition focus-within:border-brand focus-within:ring-4 focus-within:ring-brand-muted">
            <span className="flex shrink-0 items-center gap-2 border-r border-gray-200 bg-gray-50 px-3.5 text-[15px] font-semibold text-ink">
              <BoliviaFlag />
              +591
            </span>
            <input
              id="phone"
              name="phone"
              type="tel"
              inputMode="numeric"
              autoComplete="tel"
              placeholder="71234567"
              value={values.phone}
              onChange={(e) =>
                onPhoneChange(e.target.value.replace(/\D/g, "").slice(0, PHONE_DIGITS))
              }
              required
              minLength={PHONE_DIGITS}
              maxLength={PHONE_DIGITS}
              pattern={`\\d{${PHONE_DIGITS}}`}
              className="min-w-0 flex-1 border-0 bg-transparent py-3.5 pl-3 pr-3.5 text-[15px] text-ink outline-none placeholder:text-ink-muted/60"
            />
          </div>
          <p className="text-xs text-ink-muted">8 dígitos, sin el código de país.</p>
        </div>

        <div className="flex flex-col gap-2 text-left">
          <Label>Ubicación de entrega</Label>
          <LocationPicker
            latitude={values.latitude}
            longitude={values.longitude}
            onChange={onLocationChange}
          />
        </div>

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
          disabled={isSubmitting || !phoneReady || values.latitude == null || values.longitude == null}
        >
          {isSubmitting ? "Enviando..." : "Confirmar datos"}
        </Button>
      </form>
    </Card>
  )
}
