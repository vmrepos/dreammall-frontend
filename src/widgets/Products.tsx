import type { TReportProduct } from "../types/Report"

type ProductsWidgetProps = {
  products: TReportProduct[]
  emptyMessage?: string
}

export const ProductsWidget = ({
  products,
  emptyMessage = "Sin ventas de productos este mes.",
}: ProductsWidgetProps) => {
  if (products.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center text-center">
        <p className="text-sm text-ink-muted">{emptyMessage}</p>
      </div>
    )
  }

  const max = Math.max(...products.map((p) => p.quantity), 1)

  return (
    <ul className="flex flex-1 flex-col justify-center gap-3">
      {products.map((product, index) => (
        <li key={`${product.name}-${index}`}>
          <div className="mb-1 flex items-baseline justify-between gap-2 text-sm">
            <span className="truncate font-medium text-ink">{product.name}</span>
            <span className="shrink-0 tabular-nums text-ink-muted">{product.quantity}</span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-gray-100">
            <div
              className="h-full rounded-full bg-brand/80"
              style={{ width: `${(product.quantity / max) * 100}%` }}
            />
          </div>
        </li>
      ))}
    </ul>
  )
}
