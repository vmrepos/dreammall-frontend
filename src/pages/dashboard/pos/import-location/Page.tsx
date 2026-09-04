import { useEffect, useState } from "react"
import { useLocation } from "react-router-dom"
import { faLocationArrow } from "@fortawesome/free-solid-svg-icons"
import { toast } from "sonner"
import { GoBack } from "../../../../components/atoms/GoBack"
import { PageHeader } from "../../../../components/molecules/PageHeader"
import {
  captureShareTargetFromWindow,
  payloadFromLocation,
  readStoredShareTarget,
  shareTargetHasContent,
} from "../../../../utils/shareTarget"
import { PayloadDump } from "./PayloadDump"

export const Page = () => {
  const location = useLocation()
  const [stored, setStored] = useState(readStoredShareTarget)

  useEffect(() => {
    captureShareTargetFromWindow()
    setStored(readStoredShareTarget())
  }, [location.pathname, location.search])

  const rawLive = payloadFromLocation({
    pathname: location.pathname,
    search: location.search,
    href: window.location.href,
  })
  const live = shareTargetHasContent(rawLive) ? rawLive : null

  const handleCopy = async () => {
    const payload = live ?? stored
    if (!payload) return
    try {
      await navigator.clipboard.writeText(JSON.stringify(payload, null, 2))
      toast.success("Payload copiado")
    } catch {
      toast.error("No se pudo copiar. Selecciona el texto a mano.")
    }
  }

  return (
    <div className="mx-auto max-w-3xl">
      <GoBack text="Volver al POS" route="/pos" />
      <PageHeader
        icon={faLocationArrow}
        section="POS"
        title="Importar ubicación"
        description="Pantalla de depuración: muestra exactamente lo que Android envió al compartir. Todavía no se parsean coordenadas ni se guarda en un pedido."
      />
      <PayloadDump live={live} stored={stored} onCopy={() => void handleCopy()} />
    </div>
  )
}
