import { useNavigate } from "react-router-dom"
import { DeliveryStatusBadge } from "../../../../components/molecules/StatusBadge"
import type { TDelivery } from "../../../../types/Delivery"
import { formatCurrency, formatDate, tableRowLinkClass } from "../../../../utils/format"

type Props = {
  deliveries: TDelivery[]
}

export const DeliveriesTable = ({ deliveries }: Props) => {
  const navigate = useNavigate()

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-gray-100 bg-gray-50/80 text-xs font-semibold uppercase tracking-wide text-gray-500">
            <th className="px-6 py-3">ID</th>
            <th className="px-6 py-3">Fecha</th>
            <th className="px-6 py-3">Pedido</th>
            <th className="px-6 py-3">Destino</th>
            <th className="px-6 py-3">Estado</th>
            <th className="px-6 py-3">Costo</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {deliveries.map((delivery) => (
            <tr
              key={delivery.id}
              className={tableRowLinkClass}
              onClick={() => navigate(`/deliveries/${delivery.id}`)}
            >
              <td className="px-6 py-4 font-medium text-gray-900">#{delivery.id}</td>
              <td className="px-6 py-4 text-gray-500">{formatDate(delivery.created_at)}</td>
              <td className="px-6 py-4 text-gray-700">#{delivery.order_id}</td>
              <td className="max-w-xs truncate px-6 py-4 text-gray-700">
                {delivery.address ?? "—"}
              </td>
              <td className="px-6 py-4">
                <DeliveryStatusBadge status={delivery.status} />
              </td>
              <td className="px-6 py-4 text-gray-700">{formatCurrency(delivery.fee)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
