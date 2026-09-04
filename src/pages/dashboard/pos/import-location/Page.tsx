import { useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { faLocationArrow } from "@fortawesome/free-solid-svg-icons"
import { toast } from "sonner"
import { GoBack } from "../../../../components/atoms/GoBack"
import { PageHeader } from "../../../../components/molecules/PageHeader"
import { apiClient } from "../../../../services/apiClient"
import { findMapsUrl, parseShareLocation } from "../../../../utils/parseShareLocation"
import { stashPosStartLocation } from "../../../../utils/posStartLocation"
import {
  captureShareTargetFromWindow,
  payloadFromLocation,
  readStoredShareTarget,
  shareTargetBlob,
  shareTargetHasContent,
  type TShareTargetPayload,
} from "../../../../utils/shareTarget"
import { PayloadDump } from "./PayloadDump"

const resolveCoords = async (payload: TShareTargetPayload) => {
  const blob = shareTargetBlob(payload)
  const direct = parseShareLocation(blob)
  if (direct) return direct

  const mapsUrl = findMapsUrl(blob)
  if (!mapsUrl) return null

  const expanded = await apiClient.restaurants.expandMapsUrl(mapsUrl)
  return parseShareLocation(expanded)
}

const currentPayload = (): TShareTargetPayload | null => {
  captureShareTargetFromWindow()
  const live = payloadFromLocation({
    pathname: window.location.pathname,
    search: window.location.search,
    href: window.location.href,
  })
  if (shareTargetHasContent(live)) return live
  return readStoredShareTarget()
}

export const Page = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const [stored, setStored] = useState(readStoredShareTarget)
  const [live, setLive] = useState<TShareTargetPayload | null>(null)
  const [status, setStatus] = useState<"resolving" | "failed">("resolving")

  useEffect(() => {
    const payload = currentPayload()
    setStored(readStoredShareTarget())
    setLive(shareTargetHasContent(payload) ? payload : null)

    if (!payload) {
      setStatus("failed")
      return
    }

    let cancelled = false
    setStatus("resolving")

    void resolveCoords(payload)
      .then((coords) => {
        if (cancelled) return
        if (!coords) {
          setStatus("failed")
          return
        }
        stashPosStartLocation(coords)
        toast.success("Ubicación cargada. Completa los datos del cliente.")
        navigate("/pos", { replace: true })
      })
      .catch(() => {
        if (!cancelled) setStatus("failed")
      })

    return () => {
      cancelled = true
    }
  }, [location.pathname, location.search, navigate])

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

  if (status === "resolving") {
    return (
      <div className="mx-auto max-w-3xl">
        <PageHeader
          icon={faLocationArrow}
          section="POS"
          title="Importar ubicación"
          description="Leyendo el pin compartido para abrir un pedido nuevo."
        />
        <p className="text-sm text-ink-muted">Resolviendo el enlace de Maps…</p>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-3xl">
      <GoBack text="Volver al POS" route="/pos" />
      <PageHeader
        icon={faLocationArrow}
        section="POS"
        title="Importar ubicación"
        description="No se pudieron leer coordenadas. Copia el payload o abre el enlace largo de Maps y vuelve a compartir."
      />
      <PayloadDump live={live} stored={stored} onCopy={() => void handleCopy()} />
    </div>
  )
}
