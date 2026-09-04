import { useState } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCheck, faLink } from "@fortawesome/free-solid-svg-icons"
import { toast } from "sonner"
import { useAuth } from "../../../context/AuthContext"
import { cn } from "../../../utils/format"
import { copyPublicCatalogUrl } from "../../../utils/orderShare"

type Props = {
  variant: "sidebar" | "sheet"
  compact?: boolean
  onCopied?: () => void
}

export const ShareCatalogButton = ({ variant, compact = false, onCopied }: Props) => {
  const { restaurant } = useAuth()
  const [copied, setCopied] = useState(false)
  const token = restaurant?.ordering_token?.trim() ?? ""

  if (!restaurant) return null

  const label = copied ? "Enlace copiado" : "Copiar enlace"

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
      onCopied?.()
    } catch {
      toast.error("No se pudo copiar el enlace.")
    }
  }

  if (variant === "sidebar") {
    return (
      <button
        type="button"
        onClick={() => void handleCopy()}
        disabled={!token}
        title={compact ? label : undefined}
        className={cn(
          "flex w-full items-center rounded-lg text-sm font-medium transition",
          compact ? "justify-center px-0 py-2.5" : "gap-2.5 px-3 py-2",
          "text-white/70 hover:bg-sidebar-hover hover:text-white",
          "disabled:cursor-not-allowed disabled:opacity-50",
        )}
      >
        <FontAwesomeIcon
          icon={copied ? faCheck : faLink}
          className="size-3.5 shrink-0 opacity-80"
          aria-hidden
        />
        <span className={compact ? "sr-only" : ""}>{label}</span>
      </button>
    )
  }

  return (
    <button
      type="button"
      onClick={() => void handleCopy()}
      disabled={!token}
      className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-semibold text-ink transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
    >
      <FontAwesomeIcon icon={copied ? faCheck : faLink} className="size-4 text-brand" aria-hidden />
      {label}
    </button>
  )
}
