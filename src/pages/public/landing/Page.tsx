import { useEffect, useState } from "react"
import { apiClient } from "../../../services/apiClient"
import type { TPublicRestaurant } from "../../../types/PublicOrder"
import { usePublicLastOrder } from "../../../hooks/usePublicLastOrder"
import { LastOrderBanner } from "../shared/LastOrderBanner"
import { PublicShell } from "../shared/PublicShell"
import { CommerceBand } from "./CommerceBand"
import { Hero } from "./Hero"
import { LocalePreview } from "./LocalePreview"
import { Steps } from "./Steps"

export const Page = () => {
  const [restaurants, setRestaurants] = useState<TPublicRestaurant[]>([])
  const [loadState, setLoadState] = useState<"loading" | "ready" | "unavailable">("loading")
  const { stored: lastOrder, order: lastOrderDetail } = usePublicLastOrder()

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
      {lastOrder ? (
        <div className="bg-surface px-4 pt-8 md:px-8">
          <div className="mx-auto w-full max-w-6xl">
            <LastOrderBanner
              publicToken={lastOrder.publicToken}
              restaurantName={lastOrderDetail?.restaurant_name ?? lastOrder.restaurantName}
              orderId={lastOrderDetail?.id ?? lastOrder.orderId}
              deliveryCode={lastOrderDetail?.delivery_code}
            />
          </div>
        </div>
      ) : null}
      <LocalePreview restaurants={restaurants} loadState={loadState} />
      <Steps />
      <CommerceBand />
    </PublicShell>
  )
}
