import { orderStatusConfig } from "../utils/status"
import type { TOrderStatus } from "../types/Order"
import type { TReportOrders } from "../types/Report"

const STATUS_ORDER: TOrderStatus[] = ["pending", "ready", "completed", "cancelled"]

type OrdersWidgetProps = {
  orders: TReportOrders
}

export const OrdersWidget = ({ orders }: OrdersWidgetProps) => {
  const rows = STATUS_ORDER.map((status) => ({
    status,
    label: orderStatusConfig[status]?.label ?? status,
    count: orders.by_status[status] ?? 0,
  })).filter((row) => row.count > 0 || STATUS_ORDER.includes(row.status))

  // Also show unknown statuses (e.g. preparing) if present
  const known = new Set<string>(STATUS_ORDER)
  const extras = Object.entries(orders.by_status)
    .filter(([status]) => !known.has(status))
    .map(([status, count]) => ({
      status,
      label: status,
      count: count ?? 0,
    }))

  const allRows = [...rows, ...extras]

  return (
    <div className="flex flex-1 flex-col gap-4">
      <div>
        <p className="text-sm text-ink-muted">Este mes</p>
        <p className="mt-1 text-3xl font-bold tracking-tight text-ink">{orders.total}</p>
        <p className="mt-1 text-sm text-ink-muted">
          {orders.total === 1 ? "pedido" : "pedidos"}
        </p>
      </div>

      <ul className="space-y-2 border-t border-gray-100 pt-4">
        {allRows.map(({ status, label, count }) => (
          <li key={status} className="flex items-center justify-between gap-3 text-sm">
            <span className="text-ink-muted">{label}</span>
            <span className="font-semibold text-ink">{count}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
