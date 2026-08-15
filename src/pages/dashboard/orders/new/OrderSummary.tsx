import { Button } from "../../../../components/atoms/Button"
import { Card } from "../../../../components/atoms/Card"
import { Input } from "../../../../components/atoms/Input"
import { Label } from "../../../../components/atoms/Label"
import type { TOrderForm } from "../../../../types/Order"
import { formatCurrency } from "../../../../utils/format"

type Props = {
  values: TOrderForm
  subtotal: number
  total: number
  maxDiscount: number
  discountError: string
  isSubmitting: boolean
  canSubmit: boolean
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onCancel: () => void
}

export const OrderSummary = ({
  values,
  subtotal,
  total,
  maxDiscount,
  discountError,
  isSubmitting,
  canSubmit,
  onChange,
  onCancel,
}: Props) => (
  <Card padding="md" className="flex h-full min-h-0 flex-col border-2 !border-accent-clay/50">
    <h2 className="mb-3 text-base font-semibold text-gray-900">Resumen</h2>

    <p className="rounded-lg bg-brand-light px-3 py-2.5 text-xs leading-relaxed text-gray-700">
      El cliente completará nombre, teléfono y ubicación con el enlace del pedido. El envío se
      calculará después.
    </p>

    <div className="mt-3">
      <Label htmlFor="discount">Descuento</Label>
      <Input
        id="discount"
        name="discount"
        className="mt-1.5"
        type="number"
        min="0"
        max={maxDiscount}
        step="0.01"
        value={values.discount}
        onChange={onChange}
      />
      {discountError ? (
        <p className="mt-1.5 text-sm text-red-600" role="alert">
          {discountError}
        </p>
      ) : null}
    </div>
    <div className="mt-3">
      <Label htmlFor="notes">Notas</Label>
      <Input
        id="notes"
        name="notes"
        className="mt-1.5"
        type="text"
        value={values.notes ?? ""}
        onChange={onChange}
      />
    </div>

    <div className="mt-auto pt-4">
      <dl className="space-y-2 border-t border-gray-100 pt-3 text-sm">
        <div className="flex justify-between gap-2">
          <dt className="text-gray-500">Subtotal</dt>
          <dd className="font-medium tabular-nums text-gray-900">{formatCurrency(subtotal)}</dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-gray-500">Envío</dt>
          <dd className="font-medium text-gray-500">Pendiente</dd>
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
        <Button type="submit" disabled={!canSubmit} className="w-full rounded-lg py-2.5">
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
    </div>
  </Card>
)
