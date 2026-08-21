import { useState } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCheck, faCopy } from "@fortawesome/free-solid-svg-icons"
import { toast } from "sonner"
import { Button } from "../../../../components/atoms/Button"
import { useRestaurant } from "../../../../context/RestaurantContext"
import { copyPublicCatalogUrl } from "../../../../utils/orderShare"

export const CopyCatalogLinkButton = () => {
  const { restaurant } = useRestaurant()
  const [copied, setCopied] = useState(false)
  const token = restaurant?.ordering_token?.trim() ?? ""

  const handleCopy = async () => {
    if (!token) {
      toast.error("Todavía no hay enlace del menú. Recarga la página.")
      return
    }
    try {
      await copyPublicCatalogUrl(token)
      setCopied(true)
      toast.success("Enlace del menú copiado. Envíalo al cliente.")
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      toast.error("No se pudo copiar el enlace.")
    }
  }

  return (
    <Button variant="secondary" onClick={() => void handleCopy()} disabled={!token}>
      <FontAwesomeIcon icon={copied ? faCheck : faCopy} className="size-4" aria-hidden />
      {copied ? "Enlace copiado" : "Copiar enlace del menú"}
    </Button>
  )
}
