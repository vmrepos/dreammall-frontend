import { useState } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCheck, faShareNodes } from "@fortawesome/free-solid-svg-icons"
import { toast } from "sonner"
import { Button } from "../../../../components/atoms/Button"
import { useRestaurant } from "../../../../context/RestaurantContext"
import { sharePublicCatalogUrl } from "../../../../utils/orderShare"

export const CopyCatalogLinkButton = () => {
  const { restaurant } = useRestaurant()
  const [copied, setCopied] = useState(false)
  const token = restaurant?.ordering_token?.trim() ?? ""

  const handleShare = async () => {
    if (!token) {
      toast.error("Todavía no hay enlace del menú. Recarga la página.")
      return
    }
    try {
      const result = await sharePublicCatalogUrl(token)
      if (result === "cancelled") return
      if (result === "copied") {
        setCopied(true)
        toast.success("Enlace del menú copiado. Envíalo al cliente.")
        window.setTimeout(() => setCopied(false), 2000)
      }
    } catch {
      toast.error("No se pudo compartir el enlace.")
    }
  }

  return (
    <Button variant="secondary" onClick={() => void handleShare()} disabled={!token}>
      <FontAwesomeIcon icon={copied ? faCheck : faShareNodes} className="size-4" aria-hidden />
      {copied ? "Enlace copiado" : "Compartir menú"}
    </Button>
  )
}
