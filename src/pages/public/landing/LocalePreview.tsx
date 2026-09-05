import { Link } from "react-router-dom"
import { faStore } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import type { TPublicRestaurant } from "../../../types/PublicOrder"
import { RestaurantCard } from "../locales/RestaurantCard"

type LoadState = "loading" | "ready" | "unavailable"

type Props = {
  restaurants: TPublicRestaurant[]
  loadState: LoadState
}

export const LocalePreview = ({ restaurants, loadState }: Props) => {
  const preview = restaurants.slice(0, 6)

  return (
    <section className="bg-surface px-4 py-14 md:px-8 md:py-20">
      <div className="mx-auto w-full max-w-6xl">
        <div className="mb-8 flex flex-col gap-3 md:mb-10 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-semibold text-brand">Descubrir</p>
            <h2 className="mt-1 text-2xl font-bold tracking-tight text-ink md:text-3xl">
              Locales para pedir ahora
            </h2>
            <p className="mt-2 max-w-lg text-[15px] text-ink-muted">
              Entrá, armá el pedido y dejá tu pin. El comercio confirma y Pedí2
              se encarga del viaje.
            </p>
          </div>
          <Link
            to="/locales"
            className="text-sm font-semibold text-brand underline-offset-2 hover:underline"
          >
            Ver todos los locales
          </Link>
        </div>

        {loadState === "loading" ? (
          <ul className="grid gap-3 md:grid-cols-2">
            {Array.from({ length: 4 }, (_, index) => (
              <li
                key={index}
                className="h-[88px] animate-pulse rounded-[20px] bg-gray-100"
              />
            ))}
          </ul>
        ) : null}

        {loadState === "unavailable" ? (
          <p className="rounded-[20px] border border-dashed border-gray-200 bg-surface-elevated px-6 py-10 text-center text-sm text-ink-muted">
            No se pudieron cargar los locales. Podés intentar de nuevo en un
            momento.
          </p>
        ) : null}

        {loadState === "ready" && preview.length === 0 ? (
          <div className="rounded-[20px] border border-gray-200/80 bg-surface-elevated px-6 py-12 text-center">
            <FontAwesomeIcon icon={faStore} className="size-8 text-brand" aria-hidden />
            <p className="mt-3 font-semibold text-ink">Todavía no hay locales</p>
            <p className="mt-1 text-sm text-ink-muted">
              Cuando un comercio esté activo, va a aparecer aquí.
            </p>
          </div>
        ) : null}

        {loadState === "ready" && preview.length > 0 ? (
          <ul className="grid gap-3 md:grid-cols-2">
            {preview.map((restaurant) => (
              <li key={restaurant.ordering_token}>
                <RestaurantCard restaurant={restaurant} />
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </section>
  )
}
