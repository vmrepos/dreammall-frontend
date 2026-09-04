import { Link } from "react-router-dom"
import { faUtensils } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Card } from "../../../components/atoms/Card"
import type { TPublicRestaurant } from "../../../types/PublicOrder"
import { publicCatalogPath } from "../../../utils/orderShare"
import { resolveMediaUrl } from "../../../utils/mediaUrl"

type Props = {
  restaurant: TPublicRestaurant
}

export const RestaurantCard = ({ restaurant }: Props) => {
  const logoSrc = resolveMediaUrl(restaurant.logo_url)

  return (
    <Card className="transition hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(0,0,0,0.08),0_12px_28px_rgba(12,107,61,0.12)]">
      <Link
        to={publicCatalogPath(restaurant.ordering_token)}
        className="flex items-center gap-4 p-4 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
      >
        <span className="relative size-16 shrink-0 overflow-hidden rounded-2xl bg-brand-light">
          {logoSrc ? (
            <img src={logoSrc} alt="" className="size-full object-cover" />
          ) : (
            <span className="flex size-full items-center justify-center text-brand">
              <FontAwesomeIcon icon={faUtensils} className="size-6" aria-hidden />
            </span>
          )}
        </span>
        <span className="min-w-0">
          <span className="block truncate text-base font-semibold text-ink">{restaurant.name}</span>
          {restaurant.address ? (
            <span className="mt-0.5 block truncate text-sm text-ink-muted">{restaurant.address}</span>
          ) : null}
        </span>
      </Link>
    </Card>
  )
}
