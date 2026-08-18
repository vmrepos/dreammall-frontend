import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faArrowUpFromBracket, faDownload, faXmark } from "@fortawesome/free-solid-svg-icons"
import { useLocation } from "react-router-dom"
import { Button } from "../atoms/Button"
import { usePwaInstall } from "../../hooks/usePwaInstall"
import { cn } from "../../utils/format"

export const PwaInstallBanner = () => {
  const { pathname } = useLocation()
  const enabled = !pathname.startsWith("/pedido")
  const { mode, install, dismiss } = usePwaInstall(enabled)
  const aboveOrdersRail = pathname.startsWith("/orders")

  if (!enabled || !mode) return null

  return (
    <div
      className={cn(
        "pointer-events-none fixed inset-x-0 z-50 flex justify-center p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]",
        aboveOrdersRail ? "bottom-[5.75rem]" : "bottom-0",
      )}
    >
      <div
        className="pointer-events-auto flex w-full max-w-lg items-start gap-3 rounded-[20px] border border-gray-200/80 bg-surface-elevated px-4 py-3 shadow-[0_8px_24px_rgba(12,107,61,0.12)]"
        role="dialog"
        aria-labelledby="pwa-install-title"
      >
        <span className="mt-0.5 inline-flex size-9 shrink-0 items-center justify-center rounded-xl bg-brand-light text-brand">
          <FontAwesomeIcon
            icon={mode === "ios" ? faArrowUpFromBracket : faDownload}
            className="size-4"
            aria-hidden
          />
        </span>
        <div className="min-w-0 flex-1">
          <p id="pwa-install-title" className="text-sm font-semibold text-ink">
            Instalar Pedi2
          </p>
          <p className="mt-0.5 text-[13px] leading-snug text-ink-muted">
            {mode === "ios"
              ? "En Safari, pulsa Compartir y luego Agregar a inicio."
              : "Ábrela como una app, sin la barra del navegador."}
          </p>
          {mode === "chrome" && (
            <Button className="mt-3 px-4 py-2 text-sm" onClick={() => void install()}>
              Instalar
            </Button>
          )}
        </div>
        <button
          type="button"
          className="inline-flex size-8 shrink-0 items-center justify-center rounded-lg text-ink-muted transition hover:bg-gray-100 hover:text-ink"
          onClick={dismiss}
          aria-label="Ahora no"
        >
          <FontAwesomeIcon icon={faXmark} className="size-4" />
        </button>
      </div>
    </div>
  )
}
