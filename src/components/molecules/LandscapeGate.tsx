import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faMobileScreen } from "@fortawesome/free-solid-svg-icons"
import { useLocation } from "react-router-dom"
import { useLandscapeLock } from "../../hooks/useLandscapeLock"

export const LandscapeGate = () => {
  const { pathname } = useLocation()
  const enabled = !pathname.startsWith("/pedido")
  const phonePortrait = useLandscapeLock(enabled)

  if (!enabled || !phonePortrait) return null

  return (
    <div
      className="fixed inset-0 z-[60] flex flex-col items-center justify-center bg-sidebar px-8 text-center text-white"
      role="dialog"
      aria-labelledby="landscape-gate-title"
      aria-modal="true"
    >
      <FontAwesomeIcon
        icon={faMobileScreen}
        className="mb-5 size-12 rotate-90 text-accent-sun"
        aria-hidden
      />
      <p id="landscape-gate-title" className="text-xl font-semibold">
        Gira el teléfono
      </p>
      <p className="mt-2 max-w-xs text-[15px] leading-relaxed text-white/70">
        Pedi2 Comercio se usa en horizontal.
      </p>
    </div>
  )
}
