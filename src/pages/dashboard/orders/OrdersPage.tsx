import { useNavigate } from "react-router-dom"
import { faClipboardList } from "@fortawesome/free-solid-svg-icons"
import { PageHeader } from "../../../components/molecules/PageHeader"
import { Card } from "../../../components/atoms/Card"
import { OrderStatusBadge } from "../../../components/molecules/StatusBadge"
import { mockOrders } from "../../../mocks/orders"
import { formatCurrency, formatDate } from "../../../utils/format"
import { tableRowLinkClass } from "../../../components/organisms/OrderItemsTable"

export const OrdersPage = () => {
  const navigate = useNavigate()

  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader
        icon={faClipboardList}
        section="Logística"
        title="Pedidos"
        description="Gestiona pedidos entrantes, prepáralos y márcalos listos para entrega."
      />

      <Card>
        <div className="border-b border-gray-100 px-6 py-4">
          <p className="text-sm text-gray-500">
            <span className="font-semibold text-gray-900">{mockOrders.length}</span> pedidos
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/80 text-xs font-semibold uppercase tracking-wide text-gray-500">
                <th className="px-6 py-3">Pedido</th>
                <th className="px-6 py-3">Estado</th>
                <th className="px-6 py-3">Ítems</th>
                <th className="px-6 py-3">Total</th>
                <th className="px-6 py-3">Fecha</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {mockOrders.map((order) => (
                <tr
                  key={order.id}
                  className={tableRowLinkClass}
                  onClick={() => navigate(`/orders/${order.id}`)}
                >
                  <td className="px-6 py-4 font-medium text-gray-900">#{order.id}</td>
                  <td className="px-6 py-4">
                    <OrderStatusBadge status={order.status} />
                  </td>
                  <td className="px-6 py-4 text-gray-700">{order.items.length}</td>
                  <td className="px-6 py-4 font-medium text-gray-900">
                    {formatCurrency(order.total_amount)}
                  </td>
                  <td className="px-6 py-4 text-gray-500">{formatDate(order.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
