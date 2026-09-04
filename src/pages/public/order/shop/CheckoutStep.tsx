import type { ChangeEvent, FormEvent, ReactNode } from "react"
import { Input } from "../../../../components/atoms/Input"
import { Label } from "../../../../components/atoms/Label"
import type { TPublicOrderCompleteForm } from "../../../../types/PublicOrder"
import { formatCurrency } from "../../../../utils/format"
import { CustomerForm } from "../complete/CustomerForm"

type FeeStatus = "idle" | "loading" | "ready" | "error"
type CouponStatus = "idle" | "loading" | "ready" | "error"

type Props = {
  values: TPublicOrderCompleteForm
  isSubmitting: boolean
  error: string
  couponCode: string
  couponApplied: number
  couponError: string
  couponStatus: CouponStatus
  subtotal: number
  deliveryFee: number
  feeStatus: FeeStatus
  feeError: string
  total: number
  onChange: (e: ChangeEvent<HTMLInputElement>) => void
  onPhoneChange: (phone: string) => void
  onLocationChange: (latitude: number, longitude: number) => void
  onCouponChange: (code: string) => void
  onSubmit: (e: FormEvent<HTMLFormElement>) => void
}

const Totals = ({
  subtotal,
  deliveryFee,
  feeStatus,
  feeError,
  couponApplied,
  total,
}: Pick<Props, "subtotal" | "deliveryFee" | "feeStatus" | "feeError" | "couponApplied" | "total">) => (
  <dl className="space-y-2 border-t border-gray-200 pt-3 text-sm">
    <div className="flex justify-between gap-2">
      <dt className="text-ink-muted">Subtotal</dt>
      <dd className="font-medium tabular-nums text-ink">{formatCurrency(subtotal)}</dd>
    </div>
    <div className="flex justify-between gap-2">
      <dt className="text-ink-muted">Envío</dt>
      <dd className="font-medium tabular-nums text-ink">
        {feeStatus === "loading"
          ? "Calculando..."
          : feeStatus === "error"
            ? "—"
            : feeStatus === "ready"
              ? formatCurrency(deliveryFee)
              : "Marca tu ubicación"}
      </dd>
    </div>
    {couponApplied > 0 ? (
      <div className="flex justify-between gap-2">
        <dt className="text-ink-muted">Cupón Pedí2</dt>
        <dd className="font-medium tabular-nums text-ink">-{formatCurrency(couponApplied)}</dd>
      </div>
    ) : null}
    {feeError ? (
      <p className="text-sm text-red-600" role="alert">
        {feeError}
      </p>
    ) : null}
    <div className="flex justify-between gap-2 border-t border-gray-200 pt-2">
      <dt className="font-semibold text-ink">Total</dt>
      <dd className="text-base font-bold tabular-nums text-brand">{formatCurrency(total)}</dd>
    </div>
  </dl>
)

export const CheckoutStep = ({
  values,
  isSubmitting,
  error,
  couponCode,
  couponApplied,
  couponError,
  couponStatus,
  subtotal,
  deliveryFee,
  feeStatus,
  feeError,
  total,
  onChange,
  onPhoneChange,
  onLocationChange,
  onCouponChange,
  onSubmit,
}: Props) => {
  const extraFields: ReactNode = (
    <div className="flex flex-col gap-2 text-left">
      <Label htmlFor="coupon_code">Cupón Pedí2</Label>
      <Input
        id="coupon_code"
        name="coupon_code"
        inputMode="numeric"
        maxLength={8}
        placeholder="8 dígitos"
        value={couponCode}
        onChange={(e) => onCouponChange(e.target.value.replace(/\D/g, "").slice(0, 8))}
      />
      {couponStatus === "loading" ? (
        <p className="text-sm text-ink-muted">Verificando cupón…</p>
      ) : null}
      {couponError ? (
        <p className="text-sm text-red-600" role="alert">
          {couponError}
        </p>
      ) : null}
    </div>
  )

  return (
    <CustomerForm
      values={values}
      isSubmitting={isSubmitting}
      error={error}
      extraFields={extraFields}
      totals={
        <Totals
          subtotal={subtotal}
          deliveryFee={deliveryFee}
          feeStatus={feeStatus}
          feeError={feeError}
          couponApplied={couponApplied}
          total={total}
        />
      }
      submitDisabled={
        couponStatus === "loading" ||
        couponStatus === "error" ||
        feeStatus === "loading" ||
        feeStatus === "error"
      }
      onChange={onChange}
      onPhoneChange={onPhoneChange}
      onLocationChange={onLocationChange}
      onSubmit={onSubmit}
    />
  )
}
