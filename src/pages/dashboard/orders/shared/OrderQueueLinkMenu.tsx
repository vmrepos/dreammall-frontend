import { useEffect, useRef, useState } from "react"
import { createPortal } from "react-dom"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faArrowUpRightFromSquare, faCheck, faCopy, faLink } from "@fortawesome/free-solid-svg-icons"
import { toast } from "sonner"
import { copyPublicOrderUrl, publicOrderUrl } from "../../../../utils/orderShare"

type Props = {
  orderId: number
  publicToken: string
}

export const OrderQueueLinkMenu = ({ orderId, publicToken }: Props) => {
  const buttonRef = useRef<HTMLButtonElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  const [open, setOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const [position, setPosition] = useState({ top: 0, left: 0 })

  useEffect(() => {
    if (!open || !buttonRef.current) return
    const rect = buttonRef.current.getBoundingClientRect()
    const menuWidth = 220
    const left = Math.max(8, Math.min(rect.right - menuWidth, window.innerWidth - menuWidth - 8))
    setPosition({ top: rect.top - 8, left })
  }, [open])

  useEffect(() => {
    if (!open) return

    const close = (event: MouseEvent) => {
      const target = event.target as Node
      if (buttonRef.current?.contains(target) || menuRef.current?.contains(target)) return
      setOpen(false)
    }
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false)
    }

    document.addEventListener("mousedown", close)
    window.addEventListener("keydown", onKeyDown)
    return () => {
      document.removeEventListener("mousedown", close)
      window.removeEventListener("keydown", onKeyDown)
    }
  }, [open])

  const handleCopy = async () => {
    try {
      await copyPublicOrderUrl(publicToken)
      setCopied(true)
      setOpen(false)
      toast.success(`Pedido #${orderId}: enlace copiado`)
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      toast.error("No se pudo copiar el enlace.")
    }
  }

  const handleOpenStaff = () => {
    window.open(publicOrderUrl(publicToken, { fromRestaurant: true }), "_blank", "noopener,noreferrer")
    setOpen(false)
  }

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setOpen((current) => !current)}
        className="relative z-10 flex w-8 shrink-0 items-center justify-center border-l border-gray-200/80 text-ink-muted transition hover:bg-brand-light hover:text-brand"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={`Enlace del pedido #${orderId}`}
        title="Enlace del pedido"
      >
        <FontAwesomeIcon icon={copied ? faCheck : faLink} className="size-3" aria-hidden />
      </button>

      {open
        ? createPortal(
            <div
              ref={menuRef}
              role="menu"
              style={{ top: position.top, left: position.left, transform: "translateY(-100%)" }}
              className="fixed z-50 w-[13.75rem] overflow-hidden rounded-xl border border-gray-200 bg-surface-elevated py-1 shadow-[0_8px_24px_rgba(0,0,0,0.12)]"
            >
              <button
                type="button"
                role="menuitem"
                className="flex w-full items-start gap-2.5 px-3 py-2.5 text-left text-sm text-ink transition hover:bg-brand-light"
                onClick={handleOpenStaff}
              >
                <FontAwesomeIcon icon={faArrowUpRightFromSquare} className="mt-0.5 size-3.5 shrink-0 text-brand" aria-hidden />
                <span>
                  <span className="block font-semibold">Completar datos del cliente</span>
                  <span className="mt-0.5 block text-xs text-ink-muted">Abre el enlace en el navegador</span>
                </span>
              </button>
              <button
                type="button"
                role="menuitem"
                className="flex w-full items-start gap-2.5 px-3 py-2.5 text-left text-sm text-ink transition hover:bg-brand-light"
                onClick={() => void handleCopy()}
              >
                <FontAwesomeIcon icon={faCopy} className="mt-0.5 size-3.5 shrink-0 text-brand" aria-hidden />
                <span>
                  <span className="block font-semibold">Copiar enlace</span>
                  <span className="mt-0.5 block text-xs text-ink-muted">Para enviarlo al cliente</span>
                </span>
              </button>
            </div>,
            document.body,
          )
        : null}
    </>
  )
}
