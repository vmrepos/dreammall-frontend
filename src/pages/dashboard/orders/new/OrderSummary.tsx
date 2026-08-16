import { Button } from "../../../../components/atoms/Button"
import { Card } from "../../../../components/atoms/Card"
import { Input } from "../../../../components/atoms/Input"
import { Label } from "../../../../components/atoms/Label"
import type { TOrderForm } from "../../../../types/Order"
import type { TOrderItemForm } from "../../../../types/OrderItem"
import { cn, formatCurrency } from "../../../../utils/format"

type Props = {
  values: TOrderForm
  items: TOrderItemForm[]
  subtotal: number
  total: number
  maxDiscount: number
  discountError: string
  isSubmitting: boolean
  canSubmit: boolean
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onBack: () => void
  className?: string
}

export const OrderSummary = ({
  values,
  items,
  subtotal,
  total,
  maxDiscount,
  discountError,
  isSubmitting,
  canSubmit,
  onChange,
  onBack,
  className,
}: Props) => (
  <Card
    padding="none"
    className={cn("flex min-h-0 flex-col border-2 !border-accent-clay/50 p-4 md:p-6", className)}
  >
    <h2 className="mb-3 text-base font-semibold text-gray-900">Resumen</h2>

    <p className="rounded-lg bg-brand-light px-3 py-2 text-xs leading-relaxed text-gray-700">
      El cliente completa sus datos con el enlace. El envío se calcula después.
    </p>

    <ul className="mt-4 divide-y divide-gray-100 rounded-lg border border-gray-100">
      {items.map((line) => (
        <li key={line.clientKey} className="flex items-start justify-between gap-3 px-3 py-2 text-sm">
          <span className="min-w-0">
            <span className="font-medium text-gray-900">
              {line.quantity}× {line.name}
            </span>
            {line.order_item_options.length > 0 ? (
              <span className="mt-0.5 block truncate text-xs text-gray-500">
                {line.order_item_options.map((option) => option.option_name).join(", ")}
              </span>
            ) : null}
          </span>
          <span className="shrink-0 tabular-nums text-gray-900">
            {formatCurrency(line.quantity * Number(line.unit_price))}
          </span>
        </li>
      ))}
    </ul>

    <div className="mt-4 grid gap-3 sm:grid-cols-2">
      <div>
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
      <div>
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
    </div>

    <dl className="mt-4 space-y-2 border-t border-gray-100 pt-3 text-sm">
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

    <div className="mt-4 flex flex-col gap-2 sm:flex-row-reverse">
      <Button type="submit" disabled={!canSubmit} className="w-full rounded-lg py-2.5 sm:flex-1">
        {isSubmitting ? "Creando..." : "Crear pedido"}
      </Button>
      <Button
        type="button"
        variant="secondary"
        className="w-full rounded-lg py-2.5 sm:flex-1"
        onClick={onBack}
      >
        Volver al pedido
      </Button>
    </div>
  </Card>
)
