import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faUserSecret } from "@fortawesome/free-solid-svg-icons"
import { useAuth } from "../../../context/AuthContext"
import { apiClient } from "../../../services/apiClient"
import type { TRestaurantSummary } from "../../../types/Restaurant"
import { cn } from "../../../utils/format"
import { ImpersonateDialog } from "./ImpersonateDialog"

type Props = {
  variant: "sidebar" | "sheet"
  compact?: boolean
  onPicked?: () => void
}

export const ImpersonationControls = ({ variant, compact = false, onPicked }: Props) => {
  const { isAdmin, impersonate } = useAuth()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const [restaurants, setRestaurants] = useState<TRestaurantSummary[]>([])
  const [loading, setLoading] = useState(false)
  const [query, setQuery] = useState("")
  const [selecting, setSelecting] = useState(false)

  if (!isAdmin) return null

  const openDialog = async () => {
    setOpen(true)
    setQuery("")
    setLoading(true)
    try {
      setRestaurants(await apiClient.restaurants.listImpersonatable())
    } catch {
      setRestaurants([])
    } finally {
      setLoading(false)
    }
  }

  const handleSelect = async (id: number) => {
    setSelecting(true)
    try {
      await impersonate(id)
      setOpen(false)
      onPicked?.()
      navigate("/menu", { replace: true })
    } finally {
      setSelecting(false)
    }
  }

  const buttonClass =
    variant === "sidebar"
      ? "rounded-lg px-3 py-2 text-left text-sm font-medium text-white/65 transition hover:bg-sidebar-hover hover:text-white"
      : "rounded-xl px-3 py-3 text-left text-sm font-semibold text-ink-muted transition hover:bg-gray-100 hover:text-ink"

  return (
    <>
      <button
        type="button"
        className={cn(
          "flex items-center",
          compact ? "size-10 justify-center self-center" : "w-full gap-3",
          buttonClass,
          compact && "px-0",
        )}
        title={compact ? "Ver como…" : undefined}
        onClick={() => void openDialog()}
      >
        {(variant === "sheet" || compact) && (
          <FontAwesomeIcon icon={faUserSecret} className="size-4" aria-hidden />
        )}
        <span className={compact ? "sr-only" : ""}>Ver como…</span>
      </button>
      <ImpersonateDialog
        open={open}
        restaurants={restaurants}
        loading={loading}
        query={query}
        selecting={selecting}
        onQueryChange={setQuery}
        onSelect={(id) => void handleSelect(id)}
        onClose={() => setOpen(false)}
      />
    </>
  )
}
