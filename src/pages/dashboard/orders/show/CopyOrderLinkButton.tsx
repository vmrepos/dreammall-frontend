import { useState } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCheck, faCopy } from "@fortawesome/free-solid-svg-icons"
import { toast } from "sonner"
import { Button } from "../../../../components/atoms/Button"
import { publicOrderUrl } from "../../../../utils/orderShare"

type Props = {
  publicToken: string
}

const copyToClipboard = async (value: string) => {
  try {
    await navigator.clipboard.writeText(value)
  } catch {
    const input = document.createElement("textarea")
    input.value = value
    input.setAttribute("readonly", "")
    input.style.position = "fixed"
    input.style.left = "-9999px"
    document.body.appendChild(input)
    input.select()
    const copied = document.execCommand("copy")
    document.body.removeChild(input)
    if (!copied) throw new Error("copy failed")
  }
}

export const CopyOrderLinkButton = ({ publicToken }: Props) => {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await copyToClipboard(publicOrderUrl(publicToken))
      setCopied(true)
      toast.success("Enlace copiado. Envíalo al cliente.")
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      toast.error("No se pudo copiar el enlace.")
    }
  }

  return (
    <Button variant="secondary" onClick={() => void handleCopy()}>
      <FontAwesomeIcon icon={copied ? faCheck : faCopy} className="size-4" aria-hidden />
      {copied ? "Enlace copiado" : "Copiar enlace de pedido"}
    </Button>
  )
}
