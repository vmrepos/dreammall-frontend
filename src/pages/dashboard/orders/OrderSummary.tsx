import { Button } from "../../../components/atoms/Button"
import { Card } from "../../../components/atoms/Card"
import { Input } from "../../../components/atoms/Input"
import { Label } from "../../../components/atoms/Label"
import type { TOrderForm } from "../../../types/Order"
import { formatCurrency } from "../../../utils/format"

type Props = {
  values: TOrderForm
  subtotal: number
  total: number
  coordsError: string
  previewError: string
  isCalculating: boolean
  isSubmitting: boolean
  canSubmit: boolean
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onCalculateDelivery: () => void
  onCancel: () => void
}

export const OrderSummary = ({
  values,
  subtotal,
  total,
  coordsError,
  previewError,
  isCalculating,
  isSubmitting,
  canSubmit,
  onChange,
  onCalculateDelivery,
  onCancel,
}: Props) => (
  <Card padding="md" className="border-2 !border-accent-clay/50 lg:sticky lg:top-4">
    <h2 className="mb-3 text-base font-semibold text-gray-900">Resumen</h2>

    <div>
      <Label htmlFor="coordinates">Ubicación (lat, lng)</Label>
      <Input
        id="coordinates"
        name="coordinates"
        className="mt-1.5"
        value={values.coordinates}
        onChange={onChange}
        placeholder="-17.741364, -63.190680"
      />
      <p className="mt-1 text-xs text-gray-500">
        Pega las coordenadas de WhatsApp o Maps.
      </p>
      {coordsError && (
        <p className="mt-1.5 text-sm text-red-600" role="alert">
          {coordsError}
        </p>
      )}
      {previewError && (
        <p className="mt-1.5 text-sm text-red-600" role="alert">
          {previewError}
        </p>
      )}
      <Button
        type="button"
        variant="secondary"
        className="mt-2 w-full rounded-lg px-3 py-2 text-xs"
        onClick={onCalculateDelivery}
        disabled={!values.coordinates.trim() || isCalculating}
      >
        {isCalculating ? "Calculando..." : "Calcular envío"}
      </Button>
    </div>

    {values.distance_km != null && (
      <div className="mt-3 rounded-lg bg-brand-light px-3 py-2.5">
        <dl className="grid grid-cols-2 gap-2 text-sm">
          <div>
            <dt className="text-xs text-gray-500">Distancia</dt>
            <dd className="mt-0.5 font-semibold text-gray-900">{values.distance_km} km</dd>
          </div>
          <div>
            <dt className="text-xs text-gray-500">Envío</dt>
            <dd className="mt-0.5 font-semibold text-brand">
              {formatCurrency(values.delivery_fee)}
            </dd>
          </div>
        </dl>
      </div>
    )}

    <div className="mt-3">
      <Label htmlFor="discount">Descuento</Label>
      <Input
        id="discount"
        name="discount"
        className="mt-1.5"
        type="number"
        min="0"
        step="0.01"
        value={values.discount}
        onChange={onChange}
      />
    </div>

    <dl className="mt-4 space-y-2 border-t border-gray-100 pt-3 text-sm">
      <div className="flex justify-between gap-2">
        <dt className="text-gray-500">Subtotal</dt>
        <dd className="font-medium tabular-nums text-gray-900">{formatCurrency(subtotal)}</dd>
      </div>
      <div className="flex justify-between gap-2">
        <dt className="text-gray-500">Envío</dt>
        <dd className="font-medium tabular-nums text-gray-900">
          {formatCurrency(values.delivery_fee)}
        </dd>
      </div>
      <div className="flex justify-between gap-2">
        <dt className="text-gray-500">Descuento</dt>
        <dd className="font-medium tabular-nums text-gray-900">
          -{formatCurrency(values.discount)}
        </dd>
      </div>
      <div className="flex justify-between gap-2 border-t border-gray-100 pt-2">
        <dt className="font-semibold text-gray-900">Total</dt>
        <dd className="text-base font-bold tabular-nums text-brand">{formatCurrency(total)}</dd>
      </div>
    </dl>

    <div className="mt-4 flex flex-col gap-2">
      <Button
        type="submit"
        disabled={!canSubmit}
        className="w-full rounded-lg py-2.5"
      >
        {isSubmitting ? "Creando..." : "Crear pedido"}
      </Button>
      <Button
        type="button"
        variant="secondary"
        className="w-full rounded-lg py-2.5"
        onClick={onCancel}
      >
        Cancelar
      </Button>
    </div>
  </Card>
)
