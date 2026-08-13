import type { TOrderItem } from "../../../../types/OrderItem"

const MAX_VISIBLE_ITEMS = 4

type Props = {
  items?: TOrderItem[]
}

export const OrderCardItems = ({ items = [] }: Props) => {
  if (items.length === 0) {
    return <p className="text-sm text-ink-muted">Sin ítems</p>
  }

  const visibleItems = items.slice(0, MAX_VISIBLE_ITEMS)
  const hiddenCount = items.length - MAX_VISIBLE_ITEMS

  return (
    <ul className="space-y-1.5">
      {visibleItems.map((item) => {
        const options = item.order_item_options ?? []
        return (
          <li key={item.id} className="text-sm text-ink">
            <p className="truncate">
              <span className="font-semibold tabular-nums text-brand">{item.quantity}×</span>{" "}
              {item.product_name}
            </p>
            {options.length > 0 && (
              <p className="truncate pl-5 text-xs text-ink-muted">
                {options.map((option) => option.option_name).join(" · ")}
              </p>
            )}
          </li>
        )
      })}
      {hiddenCount > 0 && (
        <li className="text-xs font-medium text-ink-muted">
          +{hiddenCount} {hiddenCount === 1 ? "ítem más" : "ítems más"}
        </li>
      )}
    </ul>
  )
}
