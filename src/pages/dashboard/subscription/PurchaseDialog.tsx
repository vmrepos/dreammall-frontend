import { useState } from "react"
import { Button } from "../../../components/atoms/Button"
import { Card } from "../../../components/atoms/Card"
import type { TSubscriptionPlan } from "../../../types/Subscription"
import { formatCurrency } from "../../../utils/format"
import { PlaceholderQr } from "./PlaceholderQr"

const MAX_PROOF_BYTES = 8 * 1024 * 1024

type PurchaseDialogProps = {
  plan: TSubscriptionPlan | null
  submitting: boolean
  onClose: () => void
  onSubmit: (proof: File) => Promise<void>
}

export const PurchaseDialog = ({ plan, submitting, onClose, onSubmit }: PurchaseDialogProps) => {
  const [proof, setProof] = useState<File | null>(null)
  const [error, setError] = useState("")

  if (!plan) return null

  const handleFileChange = (file: File | undefined) => {
    setError("")
    if (!file) {
      setProof(null)
      return
    }

    if (file.size > MAX_PROOF_BYTES) {
      setProof(null)
      setError("El archivo no puede superar 8 MB.")
      return
    }

    setProof(file)
  }

  const handleSubmit = async () => {
    if (!proof) {
      setError("Sube el comprobante de pago para continuar.")
      return
    }

    setError("")
    await onSubmit(proof)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-6">
      <Card padding="lg" className="w-full max-w-lg">
        <h2 className="text-lg font-bold text-gray-900">Pagar con QR</h2>
        <p className="mt-2 text-sm leading-relaxed text-gray-500">
          Escanea el código, paga{" "}
          <span className="font-semibold text-gray-900">{formatCurrency(plan.price)}</span>
          {" "}por <span className="font-semibold text-gray-900">{plan.name}</span> y sube
          una captura del comprobante. El equipo validará el pago de forma manual.
        </p>

        <div className="mt-6 flex justify-center rounded-2xl border border-dashed border-gray-200 bg-gray-50 p-6">
          <PlaceholderQr />
        </div>
        <p className="mt-2 text-center text-xs text-gray-400">QR de prueba — aún no está vinculado a un banco.</p>

        <label className="mt-6 block text-sm font-medium text-gray-700">
          Comprobante de pago
        </label>
        <input
          type="file"
          accept="image/*,.pdf"
          className="mt-2 block w-full text-sm text-gray-600 file:mr-3 file:rounded-lg file:border-0 file:bg-brand file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white"
          onChange={(event) => handleFileChange(event.target.files?.[0])}
        />
        {proof && (
          <p className="mt-2 text-xs text-gray-500">Archivo seleccionado: {proof.name}</p>
        )}
        {error && <p className="mt-2 text-sm text-red-600">{error}</p>}

        <div className="mt-6 flex justify-end gap-3">
          <Button variant="secondary" onClick={onClose} disabled={submitting}>
            Volver
          </Button>
          <Button onClick={() => void handleSubmit()} disabled={submitting}>
            {submitting ? "Enviando..." : "Enviar comprobante"}
          </Button>
        </div>
      </Card>
    </div>
  )
}
