import { useEffect, useState } from "react"
import { faStore } from "@fortawesome/free-solid-svg-icons"
import { apiClient } from "../../../services/apiClient"
import type { TPublicRestaurant } from "../../../types/PublicOrder"
import { usePublicLastOrder } from "../../../hooks/usePublicLastOrder"
import { StatusCard } from "../order/complete/StatusCard"
import { LastOrderBanner } from "../shared/LastOrderBanner"
import { PublicShell } from "../shared/PublicShell"
import { RestaurantCard } from "./RestaurantCard"

export const Page = () => {
  const [restaurants, setRestaurants] = useState<TPublicRestaurant[]>([])
  const [loadState, setLoadState] = useState<"loading" | "ready" | "unavailable">("loading")
  const { stored: lastOrder, order: lastOrderDetail } = usePublicLastOrder()

  useEffect(() => {
    document.title = "Locales · Pedi2"
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
    <PublicShell>
      <main className="mx-auto w-full max-w-lg flex-1 px-4 py-6 md:py-10">
        {lastOrder ? (
          <div className="mb-6">
            <LastOrderBanner
              publicToken={lastOrder.publicToken}
              restaurantName={lastOrderDetail?.restaurant_name ?? lastOrder.restaurantName}
              orderId={lastOrderDetail?.id ?? lastOrder.orderId}
              deliveryCode={lastOrderDetail?.delivery_code}
            />
          </div>
        ) : null}
        {loadState === "loading" ? (
          <p className="text-center text-[15px] text-ink-muted">Cargando locales...</p>
        ) : null}

        {loadState === "unavailable" ? (
          <StatusCard
            icon={faStore}
            title="No se pudieron cargar los locales"
            description="Intenta de nuevo en un momento."
          />
        ) : null}

        {loadState === "ready" && restaurants.length === 0 ? (
          <StatusCard
            icon={faStore}
            title="Todavía no hay locales"
            description="Cuando un comercio esté activo, vas a poder pedirle desde aquí."
          />
        ) : null}

        {loadState === "ready" && restaurants.length > 0 ? (
          <>
            <h1 className="mb-1 text-2xl font-bold text-ink">Locales</h1>
            <p className="mb-6 text-[15px] text-ink-muted">Elige un comercio para armar tu pedido.</p>
            <ul className="flex flex-col gap-3">
              {restaurants.map((restaurant) => (
                <li key={restaurant.ordering_token}>
                  <RestaurantCard restaurant={restaurant} />
                </li>
              ))}
            </ul>
          </>
        ) : null}
      </main>
    </PublicShell>
  )
}
