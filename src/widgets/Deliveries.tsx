import { deliveryStatusConfig } from "../utils/status"
import type { TDeliveryStatus } from "../types/Delivery"
import type { TReportDeliveries } from "../types/Report"

const HIGHLIGHT: TDeliveryStatus[] = ["delivered", "cancelled", "in_transit", "awaiting_driver"]

type DeliveriesWidgetProps = {
  deliveries: TReportDeliveries
  periodLabel?: string
}

export const DeliveriesWidget = ({
  deliveries,
  periodLabel = "Este mes",
}: DeliveriesWidgetProps) => {
  const rows = HIGHLIGHT.map((status) => ({
    status,
    label: deliveryStatusConfig[status]?.label ?? status,
    count: deliveries.by_status[status] ?? 0,
  }))

  return (
    <div className="flex flex-1 flex-col gap-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-ink-muted">{periodLabel}</p>
          <p className="mt-1 text-3xl font-bold tracking-tight text-ink">{deliveries.total}</p>
          <p className="mt-1 text-sm text-ink-muted">entregas</p>
        </div>
        <div>
          <p className="text-sm text-ink-muted">Créditos usados</p>
          <p className="mt-1 text-3xl font-bold tracking-tight text-ink">
            {deliveries.credits_spent}
          </p>
          <p className="mt-1 text-sm text-ink-muted">aprox.</p>
        </div>
      </div>

      <ul className="space-y-2 border-t border-gray-100 pt-4">
        {rows.map(({ status, label, count }) => (
          <li key={status} className="flex items-center justify-between gap-3 text-sm">
            <span className="text-ink-muted">{label}</span>
            <span className="font-semibold text-ink">{count}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
