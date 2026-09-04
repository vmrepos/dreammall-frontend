import { useEffect, useState } from "react"
import { faStore } from "@fortawesome/free-solid-svg-icons"
import { BrandLogo } from "../../../components/atoms/BrandLogo"
import { apiClient } from "../../../services/apiClient"
import type { TPublicRestaurant } from "../../../types/PublicOrder"
import { StatusCard } from "../order/complete/StatusCard"
import { RestaurantCard } from "./RestaurantCard"

export const Page = () => {
  const [restaurants, setRestaurants] = useState<TPublicRestaurant[]>([])
  const [loadState, setLoadState] = useState<"loading" | "ready" | "unavailable">("loading")

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
    <div className="min-h-svh bg-surface px-4 py-8">
      <div className="mx-auto w-full max-w-lg">
        <BrandLogo className="mb-6 h-12" />

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
      </div>
    </div>
  )
}
