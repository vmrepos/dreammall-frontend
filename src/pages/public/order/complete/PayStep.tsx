import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faMoneyBill, faQrcode } from "@fortawesome/free-solid-svg-icons"
import { Button } from "../../../../components/atoms/Button"
import { Label } from "../../../../components/atoms/Label"
import type { TPaymentMethod } from "../../../../types/Order"
import type { TPublicOrder } from "../../../../types/PublicOrder"
import { cn, formatCurrency } from "../../../../utils/format"
import { paymentMethodLabel } from "../../../../utils/payment"
import { PaymentQr } from "./PaymentQr"

type Props = {
  order: TPublicOrder
  method: TPaymentMethod
  changeFor: string
  error: string
  isSubmitting: boolean
  onMethodChange: (method: TPaymentMethod) => void
  onChangeFor: (value: string) => void
  onConfirm: () => void
}

const methods: TPaymentMethod[] = ["cash", "qr"]

export const PayStep = ({
  order,
  method,
  changeFor,
  error,
  isSubmitting,
  onMethodChange,
  onChangeFor,
  onConfirm,
}: Props) => (
  <div className="flex flex-col gap-4">
    <div
      className="grid grid-cols-2 rounded-2xl bg-gray-100 p-1"
      role="tablist"
      aria-label="Forma de pago"
    >
      {methods.map((id) => {
        const active = method === id
        return (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onMethodChange(id)}
            className={cn(
              "inline-flex items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold transition",
              active ? "bg-white text-brand shadow-sm" : "text-ink-muted hover:text-ink",
            )}
          >
            <FontAwesomeIcon icon={id === "cash" ? faMoneyBill : faQrcode} className="size-3.5" aria-hidden />
            {paymentMethodLabel[id]}
          </button>
        )
      })}
    </div>

    <div className="rounded-2xl border border-gray-200/80 bg-surface-elevated px-4 py-3.5 text-center">
      <p className="text-sm text-ink-muted">Total</p>
      <p className="mt-1 text-2xl font-bold tabular-nums text-brand">
        {formatCurrency(order.total_amount)}
      </p>
      <p className="mt-1 text-xs text-ink-muted">Incluye envío</p>
    </div>

    {method === "qr" ? (
      <PaymentQr restaurantName={order.restaurant_name} qrUrl={order.payment_qr_url} />
    ) : (
      <div className="rounded-2xl border border-gray-200/80 bg-surface-elevated px-4 py-4">
        <Label htmlFor="change_for">Cambio de</Label>
        <div className="mt-1.5 flex overflow-hidden rounded-xl border border-gray-200 bg-surface-elevated transition focus-within:border-brand focus-within:ring-4 focus-within:ring-brand-muted">
          <span className="flex shrink-0 items-center border-r border-gray-200 bg-gray-50 px-3.5 text-[15px] font-semibold text-ink">
            Bs
          </span>
          <input
            id="change_for"
            name="change_for"
            type="number"
            min={Math.ceil(Number(order.total_amount) || 0)}
            step="1"
            inputMode="numeric"
            placeholder="50"
            value={changeFor}
            onChange={(event) => onChangeFor(event.target.value)}
            className="min-w-0 flex-1 border-0 bg-transparent py-3.5 pl-3 pr-3.5 text-[15px] text-ink outline-none placeholder:text-ink-muted/60"
          />
        </div>
        <p className="mt-1.5 text-xs text-ink-muted">
          El billete con el que vas a pagar, para que el comercio prepare el cambio.
        </p>
      </div>
    )}

    {error ? (
      <div className="rounded-xl bg-red-50 px-4 py-3.5 text-sm leading-snug text-red-600" role="alert">
        {error}
      </div>
    ) : null}

    <Button type="button" className="w-full" disabled={isSubmitting} onClick={onConfirm}>
      {isSubmitting ? "Guardando..." : method === "qr" ? "Ya pagué" : "Continuar"}
    </Button>
  </div>
)
