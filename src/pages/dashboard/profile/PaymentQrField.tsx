import { faQrcode } from "@fortawesome/free-solid-svg-icons"
import { ImageUploadField } from "./ImageUploadField"

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

export const PaymentQrField = (props: Props) => (
  <ImageUploadField
    id="payment-qr"
    label="QR de pago"
    hint="Los clientes verán este código al confirmar su pedido."
    emptyCta="Subir código QR"
    currentLabel="QR actual"
    removeLabel="Quitar QR"
    previewAlt="QR de pago"
    icon={faQrcode}
    {...props}
  />
)
