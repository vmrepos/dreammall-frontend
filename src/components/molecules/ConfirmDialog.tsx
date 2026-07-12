import { Button } from "../atoms/Button"
import { Card } from "../atoms/Card"

type ConfirmDialogProps = {
  open: boolean
  title: string
  message: string
  confirmLabel?: string
  confirmVariant?: "primary" | "danger"
  confirming?: boolean
  onConfirm: () => void
  onCancel: () => void
}

export const ConfirmDialog = ({
  open,
  title,
  message,
  confirmLabel = "Confirmar",
  confirmVariant = "danger",
  confirming = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) => {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-6">
      <Card padding="lg" className="w-full max-w-md">
        <h2 className="text-lg font-bold text-gray-900">{title}</h2>
        <p className="mt-2 text-sm leading-relaxed text-gray-500">{message}</p>
        <div className="mt-6 flex justify-end gap-3">
          <Button variant="secondary" onClick={onCancel} disabled={confirming}>
            Volver
          </Button>
          <Button variant={confirmVariant} onClick={onConfirm} disabled={confirming}>
            {confirmLabel}
          </Button>
        </div>
      </Card>
    </div>
  )
}
