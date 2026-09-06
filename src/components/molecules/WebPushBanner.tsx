import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faBell, faXmark } from "@fortawesome/free-solid-svg-icons"
import { useLocation } from "react-router-dom"
import { Button } from "../atoms/Button"
import { useAuth } from "../../context/AuthContext"
import { useWebPush } from "../../hooks/useWebPush"

export const WebPushBanner = () => {
  const { pathname } = useLocation()
  const { restaurant } = useAuth()
  const enabled = Boolean(restaurant) && pathname.startsWith("/r")
  const { promptVisible, enable, dismissPrompt } = useWebPush(enabled, restaurant?.id)

  if (!promptVisible) return null

  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-[55] flex justify-center p-3">
      <div
        className="pointer-events-auto flex w-full max-w-lg items-start gap-3 rounded-[20px] border border-gray-200/80 bg-surface-elevated px-4 py-3 shadow-[0_8px_24px_rgba(12,107,61,0.12)]"
        role="dialog"
        aria-labelledby="web-push-title"
      >
        <span className="mt-0.5 inline-flex size-9 shrink-0 items-center justify-center rounded-xl bg-brand-light text-brand">
          <FontAwesomeIcon icon={faBell} className="size-4" aria-hidden />
        </span>
        <div className="min-w-0 flex-1">
          <p id="web-push-title" className="text-sm font-semibold text-ink">
            Avisos en este dispositivo
          </p>
          <p className="mt-0.5 text-[13px] leading-snug text-ink-muted">
            Te avisamos si llega un pedido aunque no estés mirando la pantalla.
          </p>
          <Button className="mt-3 px-4 py-2 text-sm" onClick={() => void enable()}>
            Activar avisos
          </Button>
        </div>
        <button
          type="button"
          className="inline-flex size-8 shrink-0 items-center justify-center rounded-lg text-ink-muted transition hover:bg-gray-100 hover:text-ink"
          onClick={dismissPrompt}
          aria-label="Ahora no"
        >
          <FontAwesomeIcon icon={faXmark} className="size-4" />
        </button>
      </div>
    </div>
  )
}
