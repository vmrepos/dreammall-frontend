import { Link } from "react-router-dom"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faReceipt } from "@fortawesome/free-solid-svg-icons"
import { publicOrderPath } from "../../../utils/orderShare"

type Props = {
  publicToken: string
  restaurantName?: string
  orderId?: number
  deliveryCode?: string | null
}

export const LastOrderBanner = ({
  publicToken,
  restaurantName,
  orderId,
  deliveryCode,
}: Props) => {
  const code = deliveryCode?.trim()
  const place = restaurantName?.trim()
  const label = orderId
    ? place
      ? `${place} · Pedido #${orderId}`
      : `Pedido #${orderId}`
    : place || "Tu último pedido"

  return (
    <Link
      to={publicOrderPath(publicToken)}
      className="flex items-start gap-3 rounded-2xl border border-brand/20 bg-brand-light px-4 py-3.5 text-left transition hover:border-brand/40"
    >
      <FontAwesomeIcon icon={faReceipt} className="mt-0.5 size-4 shrink-0 text-brand" aria-hidden />
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-semibold text-brand">Tu último pedido</span>
        <span className="mt-0.5 block text-sm text-ink">{label}</span>
        <span className="mt-1 block text-xs leading-relaxed text-ink-muted">
          {code
            ? `Código de entrega ${code}. Tócalo para no perderlo.`
            : "Ábrelo para seguir el estado y no perder el código de entrega."}
        </span>
      </span>
    </Link>
  )
}
