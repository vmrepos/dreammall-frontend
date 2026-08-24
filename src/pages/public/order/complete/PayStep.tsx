import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faClock } from "@fortawesome/free-solid-svg-icons"
import type { TPublicOrder } from "../../../../types/PublicOrder"
import { formatCurrency } from "../../../../utils/format"
import { PaymentQr } from "./PaymentQr"

type Props = {
  order: TPublicOrder
}

/** Mobile pay wait: QR only until the restaurant marks preparing. */
export const PayStep = ({ order }: Props) => (
  <div className="flex flex-col gap-4">
    <PaymentQr restaurantName={order.restaurant_name} qrUrl={order.payment_qr_url} />

    <div className="rounded-2xl border border-gray-200/80 bg-surface-elevated px-4 py-3.5 text-center">
      <p className="text-sm text-ink-muted">Total a transferir</p>
      <p className="mt-1 text-2xl font-bold tabular-nums text-brand">
        {formatCurrency(order.total_amount)}
      </p>
      <p className="mt-1 text-xs text-ink-muted">Incluye envío</p>
    </div>

    <div
      className="flex items-start gap-3 rounded-2xl bg-brand-light px-4 py-3.5 text-sm leading-relaxed text-ink"
      role="status"
      aria-live="polite"
    >
      <FontAwesomeIcon icon={faClock} className="mt-0.5 size-4 shrink-0 text-brand" aria-hidden />
      <div>
        <p className="font-semibold text-brand">Esperando confirmación del comercio</p>
        <p className="mt-1 text-ink-muted">
          Cuando confirmen tu pago y empiecen a preparar, aquí verás el resumen y tu
          código de entrega.
        </p>
      </div>
    </div>
  </div>
)
