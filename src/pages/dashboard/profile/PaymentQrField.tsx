import { useRef } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faQrcode, faXmark } from "@fortawesome/free-solid-svg-icons"
import { Label } from "../../../components/atoms/Label"
import { resolveMediaUrl } from "../../../utils/mediaUrl"

const MAX_QR_BYTES = 8 * 1024 * 1024

type Props = {
  existingUrl?: string | null
  file: File | null
  preview: string | null
  pendingRemoval: boolean
  error: string
  onFileChange: (file: File | null, preview: string | null) => void
  onRemove: () => void
  onError: (error: string) => void
}

export const PaymentQrField = ({
  existingUrl,
  file,
  preview,
  pendingRemoval,
  error,
  onFileChange,
  onRemove,
  onError,
}: Props) => {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const displayPreview = pendingRemoval ? null : preview ?? resolveMediaUrl(existingUrl)

  const handleFileChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
    const next = ev.target.files?.[0] ?? null
    if (!next) {
      onFileChange(null, null)
      return
    }
    if (next.size > MAX_QR_BYTES) {
      onFileChange(null, null)
      onError("El archivo no puede superar 8 MB.")
      if (fileInputRef.current) fileInputRef.current.value = ""
      return
    }
    onError("")
    onFileChange(next, URL.createObjectURL(next))
  }

  return (
    <div>
      <Label htmlFor="payment-qr">QR de pago</Label>
      <p className="mt-1 text-sm text-ink-muted">
        Los clientes verán este código al confirmar su pedido.
      </p>

      <input
        ref={fileInputRef}
        id="payment-qr"
        type="file"
        accept="image/*"
        className="sr-only"
        onChange={handleFileChange}
      />

      {displayPreview ? (
        <div className="mt-3 flex items-center gap-4">
          <img
            src={displayPreview}
            alt="QR de pago"
            className="size-28 rounded-xl border border-gray-200 object-contain bg-white p-2"
          />
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-ink">
              {file?.name ?? "QR actual"}
            </p>
            <div className="mt-1 flex flex-wrap gap-3">
              <label
                htmlFor="payment-qr"
                className="cursor-pointer text-sm font-medium text-brand hover:underline"
              >
                Cambiar imagen
              </label>
              <button
                type="button"
                onClick={onRemove}
                className="inline-flex items-center gap-1.5 text-sm font-medium text-red-600 hover:underline"
              >
                <FontAwesomeIcon icon={faXmark} className="size-3.5" aria-hidden />
                {file || preview ? "Descartar cambio" : "Quitar QR"}
              </button>
            </div>
          </div>
        </div>
      ) : (
        <label
          htmlFor="payment-qr"
          className="mt-3 flex cursor-pointer items-center justify-center gap-3 rounded-xl border border-dashed border-gray-300 bg-surface px-4 py-6 text-sm text-ink-muted transition hover:border-brand hover:text-brand"
        >
          <FontAwesomeIcon icon={faQrcode} className="size-4" aria-hidden />
          Subir código QR
        </label>
      )}
      {pendingRemoval && existingUrl ? (
        <p className="mt-2 text-xs text-ink-muted">Se quitará al guardar los cambios.</p>
      ) : null}
      {error ? <p className="mt-2 text-sm text-red-600">{error}</p> : null}
    </div>
  )
}
