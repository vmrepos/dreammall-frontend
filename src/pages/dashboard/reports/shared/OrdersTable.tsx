import { useNavigate } from "react-router-dom"
import { OrderStatusBadge } from "../../../../components/molecules/StatusBadge"
import type { TReportOrderRow } from "../../../../types/Report"
import { formatCurrency, formatDate, tableRowLinkClass } from "../../../../utils/format"

type Props = {
  orders: TReportOrderRow[]
}

export const OrdersTable = ({ orders }: Props) => {
  const navigate = useNavigate()

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-gray-100 bg-gray-50/80 text-xs font-semibold uppercase tracking-wide text-gray-500">
            <th className="px-6 py-3">Pedido</th>
            <th className="px-6 py-3">Fecha</th>
            <th className="px-6 py-3">Estado</th>
            <th className="px-6 py-3">Total</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {orders.map((order) => (
            <tr
              key={order.id}
              className={tableRowLinkClass}
              onClick={() => navigate(`/orders/${order.id}`)}
            >
              <td className="px-6 py-4 font-medium text-gray-900">#{order.id}</td>
              <td className="px-6 py-4 text-gray-500">{formatDate(order.created_at)}</td>
              <td className="px-6 py-4">
                <OrderStatusBadge status={order.status} />
              </td>
              <td className="px-6 py-4 font-semibold tabular-nums text-gray-900">
                {formatCurrency(order.total_amount)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
