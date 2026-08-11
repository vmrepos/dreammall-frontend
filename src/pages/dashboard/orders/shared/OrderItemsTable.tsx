import { formatCurrency } from "../../../../utils/format"
import type { TOrderItem } from "../../../../types/OrderItem"

type OrderItemsTableProps = {
  items: TOrderItem[]
}

export const OrderItemsTable = ({ items }: OrderItemsTableProps) => {
  const subtotal = items.reduce(
    (sum, item) => sum + Number(item.unit_price) * item.quantity,
    0,
  )

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-gray-100 bg-gray-50/80 text-xs font-semibold uppercase tracking-wide text-gray-500">
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
                <p className="font-medium text-gray-900">{item.product_name}</p>
                {(item.order_item_options ?? []).map((option) => (
                  <p
                    key={`${option.id ?? option.option_name}-${option.option_group_name}`}
                    className="mt-0.5 text-xs text-gray-500"
                  >
                    {option.option_group_name}: {option.option_name}
                  </p>
                ))}
                {item.notes && <p className="mt-1 text-xs text-gray-500">{item.notes}</p>}
              </td>
              <td className="px-6 py-4 text-gray-700">{item.quantity}</td>
              <td className="px-6 py-4 text-gray-700">{formatCurrency(item.unit_price)}</td>
              <td className="px-6 py-4 font-medium text-gray-900">
                {formatCurrency(Number(item.unit_price) * item.quantity)}
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr className="border-t border-gray-100 bg-gray-50/50">
            <td colSpan={3} className="px-6 py-3 text-right text-sm font-semibold text-gray-700">
              Subtotal ítems
            </td>
            <td className="px-6 py-3 font-semibold text-gray-900">{formatCurrency(subtotal)}</td>
          </tr>
        </tfoot>
      </table>
    </div>
  )
}
