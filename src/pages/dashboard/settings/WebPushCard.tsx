import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faBell } from "@fortawesome/free-solid-svg-icons"
import { Button } from "../../../components/atoms/Button"
import { Toggle } from "../../../components/atoms/Toggle"
import { useWebPush } from "../../../hooks/useWebPush"

type Props = {
  enabled: boolean
  restaurantId?: number | null
}

export const WebPushCard = ({ enabled, restaurantId }: Props) => {
  const { status, enable, disable } = useWebPush(enabled, restaurantId)

  if (status === "unsupported") {
    return (
      <p className="text-sm text-gray-500">
        Este navegador no admite avisos con la pantalla bloqueada. Prueba Chrome o Edge.
      </p>
    )
  }

  return (
    <div className="flex items-start justify-between gap-4 rounded-xl bg-gray-100 px-3 py-2.5">
      <div className="min-w-0">
        <p className="text-sm font-medium text-ink">Avisos en segundo plano</p>
        <p className="mt-0.5 text-xs text-gray-500">
          {status === "denied"
            ? "El navegador bloqueó las notificaciones. Actívalas en la configuración del sitio."
            : "Windows y Android pueden sonar aunque Pedi2 no esté al frente. En el celular, instala la app para que lleguen con la pantalla bloqueada."}
        </p>
        {status === "denied" ? null : status === "subscribed" || status === "prompt" || status === "busy" ? (
          <p className="mt-2 text-xs font-medium text-ink">
            {status === "subscribed" ? "Activados en este dispositivo." : "Aún no activados en este dispositivo."}
          </p>
        ) : null}
      </div>
      {status === "denied" ? (
        <Button variant="secondary" className="shrink-0 px-3 py-2 text-xs" disabled>
          Bloqueado
        </Button>
      ) : (
        <Toggle
          checked={status === "subscribed"}
          label={status === "subscribed" ? "Desactivar avisos" : "Activar avisos"}
          onChange={(checked) => {
            if (status === "busy") return
            void (checked ? enable() : disable())
          }}
        />
      )}
    </div>
  )
}

export const WebPushSection = ({ enabled, restaurantId }: Props) => (
  <section className="border-t border-gray-100 pt-6">
    <h2 className="mb-4 flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-brand">
      <FontAwesomeIcon icon={faBell} className="size-4" aria-hidden />
      Notificaciones
    </h2>
    <WebPushCard enabled={enabled} restaurantId={restaurantId} />
  </section>
)
