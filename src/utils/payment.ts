import type { TPaymentMethod } from "../types/Order"

export const paymentMethodLabel: Record<TPaymentMethod, string> = {
  cash: "Efectivo",
  qr: "QR",
}

export const isPaymentMethod = (value: string | null | undefined): value is TPaymentMethod =>
  value === "cash" || value === "qr"
