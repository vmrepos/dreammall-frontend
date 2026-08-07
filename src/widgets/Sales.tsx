import { formatCurrency } from "../utils/format"
import type { TReportSales } from "../types/Report"

const percentChange = (current: number, previous: number) => {
  if (previous === 0) return current === 0 ? 0 : 100
  return ((current - previous) / previous) * 100
}

type SalesWidgetProps = {
  sales: TReportSales
}

export const SalesWidget = ({ sales }: SalesWidgetProps) => {
  const current = Number(sales.current.total_amount)
  const previous = Number(sales.previous.total_amount)
  const change = percentChange(current, previous)
  const up = change >= 0

  return (
    <div className="flex flex-1 flex-col justify-between gap-4">
      <div>
        <p className="text-sm text-ink-muted">Este mes</p>
        <p className="mt-1 text-3xl font-bold tracking-tight text-ink">
          {formatCurrency(current)}
        </p>
        <p className="mt-1 text-sm text-ink-muted">
          {sales.current.count}{" "}
          {sales.current.count === 1 ? "pedido facturable" : "pedidos facturables"}
        </p>
      </div>

      <div className="flex items-end justify-between gap-3 border-t border-gray-100 pt-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-ink-muted">Mes anterior</p>
          <p className="mt-0.5 text-sm font-semibold text-ink">{formatCurrency(previous)}</p>
        </div>
        <p
          className={[
            "text-sm font-semibold",
            up ? "text-brand" : "text-accent-clay",
          ].join(" ")}
        >
          {up ? "+" : ""}
          {change.toFixed(0)}%
        </p>
      </div>
    </div>
  )
}
