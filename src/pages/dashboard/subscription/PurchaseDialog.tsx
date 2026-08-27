import { useEffect, useRef, useState } from "react"
import { Button } from "../../../components/atoms/Button"
import { Card } from "../../../components/atoms/Card"
import type { TCreditPurchase } from "../../../types/CreditPurchase"
import type { TSubscriptionPlan } from "../../../types/Subscription"
import { formatCurrency } from "../../../utils/format"

const POLL_MS = 4000

type PurchaseDialogProps = {
  plan: TSubscriptionPlan | null
  purchase: TCreditPurchase | null
  starting: boolean
  startError: string
  onClose: () => void
  onPoll: (purchaseId: number) => Promise<TCreditPurchase>
  onPaid: (purchase: TCreditPurchase) => void
  onFailed: (purchase: TCreditPurchase) => void
}

export const PurchaseDialog = ({
  plan,
  purchase,
  starting,
  startError,
  onClose,
  onPoll,
  onPaid,
  onFailed,
}: PurchaseDialogProps) => {
  const [pollError, setPollError] = useState("")
  const settledRef = useRef(false)

  useEffect(() => {
    settledRef.current = false
    setPollError("")
  }, [purchase?.id])

  useEffect(() => {
    if (!purchase || purchase.status !== "pending") return

    let cancelled = false
    const purchaseId = purchase.id

    const tick = async () => {
      try {
        const next = await onPoll(purchaseId)
        if (cancelled || settledRef.current) return

        if (next.status === "paid") {
          settledRef.current = true
          onPaid(next)
          return
        }

        if (next.status === "failed") {
          settledRef.current = true
          onFailed(next)
        }
      } catch {
        if (!cancelled) setPollError("No pudimos verificar el pago. Reintentando…")
      }
    }

    void tick()
    const timer = window.setInterval(() => {
      void tick()
    }, POLL_MS)

    return () => {
      cancelled = true
      window.clearInterval(timer)
    }
    // Intentionally keyed on purchase id + status so parent re-renders do not reset the timer.
  }, [purchase?.id, purchase?.status, onPoll, onPaid, onFailed])

  if (!plan) return null

  const qrSrc = purchase?.qr_image
    ? purchase.qr_image.startsWith("data:")
      ? purchase.qr_image
      : `data:image/png;base64,${purchase.qr_image}`
    : null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-6">
      <Card padding="lg" className="w-full max-w-lg">
        <h2 className="text-lg font-bold text-gray-900">Pagar con QR</h2>
        <p className="mt-2 text-sm leading-relaxed text-gray-500">
          Escanea el código y paga{" "}
          <span className="font-semibold text-gray-900">{formatCurrency(plan.price)}</span>
          {" "}por <span className="font-semibold text-gray-900">{plan.name}</span>.
          Cuando el banco confirme el pago, acreditaremos tus entregas automáticamente.
        </p>

        <div className="mt-6 flex min-h-48 items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-gray-50 p-6">
          {starting && (
            <p className="text-sm text-gray-500">Generando código QR…</p>
          )}
          {!starting && qrSrc && (
            <img src={qrSrc} alt="Código QR de pago" className="h-48 w-48 object-contain" />
          )}
          {!starting && !qrSrc && !startError && (
            <p className="text-sm text-gray-500">Preparando pago…</p>
          )}
        </div>

        {purchase?.status === "pending" && !starting && (
          <p className="mt-3 text-center text-sm text-amber-700">
            Esperando confirmación del pago…
          </p>
        )}
        {(startError || pollError) && (
          <p className="mt-3 text-center text-sm text-red-600">{startError || pollError}</p>
        )}

        <div className="mt-6 flex justify-end gap-3">
          <Button variant="secondary" onClick={onClose} disabled={starting}>
            Cerrar
          </Button>
        </div>
      </Card>
    </div>
  )
}
