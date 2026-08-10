import { useEffect, useState } from "react"
import { Button } from "../../../components/atoms/Button"
import { Card } from "../../../components/atoms/Card"
import { inputClassName } from "../../../components/atoms/Input"
import type { TOrderCancelReason } from "../../../types/Order"
import { cn } from "../../../utils/format"
import { orderCancelReasonOptions } from "../../../utils/status"

type Props = {
  open: boolean
  confirming?: boolean
  onConfirm: (reason: string) => void
  onCancel: () => void
}

export const CancelOrderDialog = ({ open, confirming = false, onConfirm, onCancel }: Props) => {
  const [option, setOption] = useState<TOrderCancelReason>("restaurant_cancelled")
  const [detail, setDetail] = useState("")

  useEffect(() => {
    if (!open) return
    setOption("restaurant_cancelled")
    setDetail("")
  }, [open])

  if (!open) return null

  const otherReason = detail.trim()
  const canSubmit = option !== "other" || otherReason.length > 0
  const reason = option === "other" ? otherReason : option

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-6">
      <Card padding="lg" className="w-full max-w-md">
        <h2 className="text-lg font-bold text-gray-900">Cancelar pedido</h2>
        <p className="mt-2 text-sm leading-relaxed text-gray-500">
          Esta acción no se puede deshacer. Elige el motivo de la cancelación.
        </p>

        <fieldset className="mt-4 space-y-2" disabled={confirming}>
          <legend className="mb-2 text-sm font-semibold text-gray-900">Motivo</legend>
          {orderCancelReasonOptions.map((item) => (
            <label
              key={item.id}
              className={cn(
                "flex cursor-pointer items-center gap-3 rounded-xl border px-3.5 py-3 text-sm transition",
                option === item.id
                  ? "border-brand bg-brand-light text-ink"
                  : "border-gray-200 bg-surface-elevated text-ink-muted hover:border-gray-300 hover:text-ink",
              )}
            >
              <input
                type="radio"
                name="cancel_reason"
                value={item.id}
                checked={option === item.id}
                onChange={() => setOption(item.id)}
                className="size-4 accent-brand"
              />
              {item.label}
            </label>
          ))}
        </fieldset>

        {option === "other" && (
          <div className="mt-3">
            <label htmlFor="cancel-reason-detail" className="mb-2 block text-sm font-semibold text-gray-900">
              ¿Por qué?
            </label>
            <textarea
              id="cancel-reason-detail"
              value={detail}
              onChange={(event) => setDetail(event.target.value)}
              disabled={confirming}
              rows={3}
              maxLength={200}
              placeholder="Escribe el motivo"
              className={cn(inputClassName, "resize-none px-3.5")}
            />
          </div>
        )}

        <div className="mt-6 flex justify-end gap-3">
          <Button variant="secondary" onClick={onCancel} disabled={confirming}>
            Volver
          </Button>
          <Button
            variant="danger"
            disabled={confirming || !canSubmit}
            onClick={() => onConfirm(reason)}
          >
            Sí, cancelar
          </Button>
        </div>
      </Card>
    </div>
  )
}
