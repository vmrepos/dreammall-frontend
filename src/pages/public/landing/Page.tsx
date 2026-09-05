import { useEffect, useState } from "react"
import { apiClient } from "../../../services/apiClient"
import type { TPublicRestaurant } from "../../../types/PublicOrder"
import { PublicShell } from "../shared/PublicShell"
import { CommerceBand } from "./CommerceBand"
import { Hero } from "./Hero"
import { LocalePreview } from "./LocalePreview"
import { Steps } from "./Steps"

export const Page = () => {
  const [restaurants, setRestaurants] = useState<TPublicRestaurant[]>([])
  const [loadState, setLoadState] = useState<"loading" | "ready" | "unavailable">("loading")

  useEffect(() => {
    document.title = "Pedi2 · Santa Cruz"
  }, [])

  useEffect(() => {
    let cancelled = false

    void apiClient.publicCatalog
      .list()
      .then((rows) => {
        if (cancelled) return
        setRestaurants(rows)
        setLoadState("ready")
      })
      .catch(() => {
        if (cancelled) return
        setLoadState("unavailable")
      })

    return () => {
      cancelled = true
    }
  }, [])

  return (
    <PublicShell tone="dark">
      <Hero />
      <LocalePreview restaurants={restaurants} loadState={loadState} />
      <Steps />
      <CommerceBand />
    </PublicShell>
  )
}
