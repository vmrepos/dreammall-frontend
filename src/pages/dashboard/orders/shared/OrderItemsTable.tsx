import { formatCurrency } from "../../../../utils/format"
import type { TOrderItem } from "../../../../types/OrderItem"

type OrderItemsTableProps = {
  items: TOrderItem[]
}

export const OrderItemsTable = ({ items }: OrderItemsTableProps) => {
  if (items.length === 0) {
    return <p className="px-6 py-4 text-sm text-ink-muted">Sin ítems</p>
  }

  return (
    <div className="@container">
      <ul className="divide-y divide-gray-100 @min-[32rem]:hidden">
        {items.map((item) => (
          <li key={item.id} className="px-6 py-3">
            <ItemCopy item={item} />
            <div className="mt-2 flex items-end justify-between gap-3">
              <span className="text-sm tabular-nums text-ink-muted">
                {item.quantity} × {formatCurrency(item.unit_price)}
              </span>
              <span className="text-sm font-semibold tabular-nums text-ink">
                {lineSubtotal(item)}
              </span>
            </div>
          </li>
        ))}
      </ul>

      <div className="hidden @min-[32rem]:block">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50/80 text-xs font-semibold uppercase tracking-wide text-ink-muted">
              <th className="px-6 py-3">Producto</th>
              <th className="px-6 py-3">Cant.</th>
              <th className="px-6 py-3">Precio unit.</th>
              <th className="px-6 py-3">Subtotal</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {items.map((item) => (
              <tr key={item.id}>
                <td className="px-6 py-4">
                  <ItemCopy item={item} />
                </td>
                <td className="px-6 py-4 text-ink">{item.quantity}</td>
                <td className="px-6 py-4 text-ink">{formatCurrency(item.unit_price)}</td>
                <td className="px-6 py-4 font-medium tabular-nums text-ink">{lineSubtotal(item)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

const lineSubtotal = (item: TOrderItem) =>
  formatCurrency(Number(item.unit_price) * item.quantity)

const ItemCopy = ({ item }: { item: TOrderItem }) => (
  <>
    <p className="font-medium text-ink">{item.product_name}</p>
    {(item.order_item_options ?? []).map((option) => (
      <p
        key={`${option.id ?? option.option_name}-${option.option_group_name}`}
        className="mt-0.5 text-xs text-ink-muted"
      >
        {option.option_group_name}: {option.option_name}
      </p>
    ))}
    {item.notes ? <p className="mt-1 text-xs text-ink-muted">{item.notes}</p> : null}
  </>
)
