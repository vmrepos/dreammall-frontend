import { useState } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCheck, faImage } from "@fortawesome/free-solid-svg-icons"
import { toast } from "sonner"
import { Button } from "../../../../components/atoms/Button"
import type { TOrder } from "../../../../types/Order"
import { copyOrderSummaryImage } from "../shared/copyOrderSummaryImage"

type Props = {
  order: TOrder
}

export const CopySummaryImageButton = ({ order }: Props) => {
  const [copied, setCopied] = useState(false)
  const [busy, setBusy] = useState(false)

  const handleCopy = async () => {
    setBusy(true)
    try {
      const result = await copyOrderSummaryImage(order)
      setCopied(true)
      toast.success(
        result === "shared"
          ? "Resumen listo para WhatsApp"
          : "Imagen copiada. Pégala en WhatsApp.",
      )
      window.setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return
      toast.error("No se pudo copiar el resumen.")
    } finally {
      setBusy(false)
    }
  }

  return (
    <Button
      type="button"
      variant="secondary"
      className="shrink-0 rounded-lg px-2.5 py-1.5 text-xs"
      disabled={busy}
      onClick={() => void handleCopy()}
    >
      <FontAwesomeIcon icon={copied ? faCheck : faImage} className="size-3.5" aria-hidden />
      {copied ? "Copiado" : "Copiar"}
    </Button>
  )
}
