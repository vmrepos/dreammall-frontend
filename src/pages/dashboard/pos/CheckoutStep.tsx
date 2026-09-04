import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faMoneyBill, faQrcode } from "@fortawesome/free-solid-svg-icons"
import { Button } from "../../../components/atoms/Button"
import { Card } from "../../../components/atoms/Card"
import { Input } from "../../../components/atoms/Input"
import { Label } from "../../../components/atoms/Label"
import type { TOrderForm, TPaymentMethod } from "../../../types/Order"
import type { TOrderItemForm } from "../../../types/OrderItem"
import { cn, formatCurrency } from "../../../utils/format"
import { resolveMediaUrl } from "../../../utils/mediaUrl"
import { paymentMethodLabel } from "../../../utils/payment"
import type { TPosStep } from "./Stepper"

type FeeStatus = "idle" | "loading" | "ready" | "error"

type Props = {
  values: TOrderForm
  items: TOrderItemForm[]
  subtotal: number
  total: number
  maxDiscount: number
  discountError: string
  couponApplied: number
  couponError: string
  couponStatus: "idle" | "loading" | "ready" | "error"
  feeStatus: FeeStatus
  feeError: string
  paymentError: string
  method: TPaymentMethod
  changeFor: string
  qrUrl?: string | null
  restaurantName?: string
  isSubmitting: boolean
  gaps: Array<{ step: TPosStep; message: string }>
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onMethodChange: (method: TPaymentMethod) => void
  onChangeFor: (value: string) => void
  onFix: (step: TPosStep) => void
  onBack: () => void
}

const methods: TPaymentMethod[] = ["cash", "qr"]

export const CheckoutStep = ({
  values,
  items,
  subtotal,
  total,
  maxDiscount,
  discountError,
  couponApplied,
  couponError,
  couponStatus,
  feeStatus,
  feeError,
  paymentError,
  method,
  changeFor,
  qrUrl,
  restaurantName,
  isSubmitting,
  gaps,
  onChange,
  onMethodChange,
  onChangeFor,
  onFix,
  onBack,
}: Props) => {
  const phone = (values.customer_phone ?? "").trim()
  const qrSrc = resolveMediaUrl(qrUrl)
  const name = values.customer_name?.trim() ?? ""

  return (
    <div className="min-h-0 flex-1 overflow-y-auto px-6 py-5 phone:px-4">
      <div className="mx-auto grid w-full max-w-5xl gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(18rem,22rem)] lg:items-start">
        <div className="flex flex-col gap-4">
          {gaps.length > 0 ? (
            <section className="rounded-[20px] border border-accent-clay/40 bg-red-50 px-4 py-3.5" role="status">
              <p className="text-sm font-semibold text-accent-clay">Falta completar antes de enviar</p>
              <ul className="mt-2 space-y-1">
                {gaps.map((gap) => (
                  <li key={gap.message}>
                    <button
                      type="button"
                      className="text-left text-sm text-accent-clay underline-offset-2 hover:underline"
                      onClick={() => onFix(gap.step)}
                    >
                      {gap.message}
                    </button>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          <Card className="p-4 md:p-5">
            <h2 className="text-base font-semibold text-ink">Cliente</h2>
            <dl className="mt-3 divide-y divide-gray-200 text-sm">
              <div className="flex justify-between gap-3 py-2 first:pt-0 last:pb-0">
                <dt className="text-ink-muted">Nombre</dt>
                <dd className={name ? "font-medium text-ink" : "text-ink-muted"}>{name || "—"}</dd>
              </div>
              <div className="flex justify-between gap-3 py-2 first:pt-0 last:pb-0">
                <dt className="text-ink-muted">Teléfono</dt>
                <dd className={phone ? "font-medium text-ink" : "text-ink-muted"}>
                  {phone ? `+591 ${phone}` : "—"}
                </dd>
              </div>
            </dl>
          </Card>

          <Card className="p-4 md:p-5">
            <h2 className="text-base font-semibold text-ink">Pedido</h2>
            <ul className="mt-3 divide-y divide-gray-200 rounded-lg border border-gray-200">
              {items.map((line) => (
                <li
                  key={line.clientKey}
                  className="flex items-start justify-between gap-3 px-3 py-2 text-sm"
                >
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
                <Label htmlFor="coupon_code">Cupón Pedí2</Label>
                <Input
                  id="coupon_code"
                  name="coupon_code"
                  className="mt-1.5"
                  inputMode="numeric"
                  maxLength={8}
                  placeholder="8 dígitos"
                  value={values.coupon_code ?? ""}
                  onChange={onChange}
                />
                {couponStatus === "loading" ? (
                  <p className="mt-1.5 text-sm text-ink-muted">Verificando cupón…</p>
                ) : null}
                {couponError ? (
                  <p className="mt-1.5 text-sm text-red-600" role="alert">
                    {couponError}
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
                  placeholder="Punto de referencia, sin ají..."
                  value={values.notes ?? ""}
                  onChange={onChange}
                />
              </div>
            </div>

            <dl className="mt-4 space-y-2 border-t border-gray-200 pt-3 text-sm">
              <div className="flex justify-between gap-2">
                <dt className="text-gray-500">Subtotal</dt>
                <dd className="font-medium tabular-nums text-gray-900">
                  {formatCurrency(subtotal)}
                </dd>
              </div>
              <div className="flex justify-between gap-2">
                <dt className="text-gray-500">Envío</dt>
                <dd className="font-medium tabular-nums text-gray-900">
                  {feeStatus === "loading"
                    ? "Calculando..."
                    : feeStatus === "error"
                      ? "—"
                      : formatCurrency(values.delivery_fee)}
                </dd>
              </div>
              <div className="flex justify-between gap-2">
                <dt className="text-gray-500">Descuento</dt>
                <dd className="font-medium tabular-nums text-gray-900">
                  -{formatCurrency(values.discount)}
                </dd>
              </div>
              {couponApplied > 0 ? (
                <div className="flex justify-between gap-2">
                  <dt className="text-gray-500">Cupón Pedí2</dt>
                  <dd className="font-medium tabular-nums text-gray-900">
                    -{formatCurrency(couponApplied)}
                  </dd>
                </div>
              ) : null}
              <div className="flex justify-between gap-2 border-t border-gray-200 pt-2">
                <dt className="font-semibold text-gray-900">Total</dt>
                <dd className="text-base font-bold tabular-nums text-brand">
                  {formatCurrency(total)}
                </dd>
              </div>
            </dl>
            {feeError ? (
              <p className="mt-2 text-sm text-red-600" role="alert">
                {feeError}
              </p>
            ) : null}
          </Card>
        </div>

        <aside className="flex flex-col gap-4 lg:sticky lg:top-4">
          <Card className="p-4 md:p-5">
            <h2 className="text-base font-semibold text-ink">Forma de pago</h2>
            <div
              className="mt-3 grid grid-cols-2 rounded-2xl bg-gray-100 p-1"
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
                    <FontAwesomeIcon
                      icon={id === "cash" ? faMoneyBill : faQrcode}
                      className="size-3.5"
                      aria-hidden
                    />
                    {paymentMethodLabel[id]}
                  </button>
                )
              })}
            </div>

            {method === "qr" ? (
              <div className="mt-4 flex flex-col items-center text-center">
                {qrSrc ? (
                  <img
                    src={qrSrc}
                    alt={`QR de ${restaurantName ?? "pago"}`}
                    className="w-full max-w-[12rem] rounded-2xl border border-gray-200 bg-white object-contain p-3"
                  />
                ) : (
                  <div className="flex aspect-square w-full max-w-[12rem] items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-gray-50 px-4 text-sm text-ink-muted">
                    Aún no hay un QR en el perfil.
                  </div>
                )}
                <p className="mt-2 text-xs text-ink-muted">
                  Muéstralo al cliente. Cuando pague, confirma el pedido.
                </p>
              </div>
            ) : (
              <div className="mt-4">
                <Label htmlFor="change_for">Cambio de</Label>
                <div className="mt-1.5 flex overflow-hidden rounded-xl border border-gray-300 bg-surface-elevated transition focus-within:border-brand focus-within:ring-4 focus-within:ring-brand-muted">
                  <span className="flex shrink-0 items-center border-r border-gray-300 bg-gray-50 px-3.5 text-[15px] font-semibold text-ink">
                    Bs
                  </span>
                  <input
                    id="change_for"
                    name="change_for"
                    type="number"
                    min={Math.ceil(Number(total) || 0)}
                    step="1"
                    inputMode="numeric"
                    placeholder="50"
                    value={changeFor}
                    onChange={(event) => onChangeFor(event.target.value)}
                    className="min-w-0 flex-1 border-0 bg-transparent py-3.5 pl-3 pr-3.5 text-[15px] text-ink outline-none placeholder:text-ink-muted/60"
                  />
                </div>
                <p className="mt-1.5 text-xs text-ink-muted">
                  El billete con el que paga el cliente.
                </p>
              </div>
            )}

            {paymentError ? (
              <p className="mt-3 text-sm text-red-600" role="alert">
                {paymentError}
              </p>
            ) : null}
          </Card>

          <div className="flex flex-col gap-2">
            <Button type="submit" disabled={isSubmitting} className="w-full rounded-lg py-2.5">
              {isSubmitting ? "Confirmando..." : "Confirmar pedido"}
            </Button>
            <Button
              type="button"
              variant="secondary"
              className="w-full rounded-lg py-2.5"
              onClick={onBack}
            >
              Volver al pedido
            </Button>
          </div>
        </aside>
      </div>
    </div>
  )
}
