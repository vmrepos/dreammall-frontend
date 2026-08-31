import { Link, useNavigate } from "react-router-dom"
import { DeliveryStatusBadge } from "../../../../components/molecules/StatusBadge"
import type { TReportDeliveryRow } from "../../../../types/Report"
import { formatDate, tableRowLinkClass } from "../../../../utils/format"
import { DELIVERIES_SECTION_ENABLED } from "../../deliveries/Deliveries"

type Props = {
  deliveries: TReportDeliveryRow[]
}

export const DeliveriesTable = ({ deliveries }: Props) => {
  const navigate = useNavigate()

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-gray-100 bg-gray-50/80 text-xs font-semibold uppercase tracking-wide text-gray-500">
            <th className="px-6 py-3">Fecha</th>
            <th className="px-6 py-3">Referencia</th>
            <th className="px-6 py-3">Repartidor</th>
            <th className="px-6 py-3">Estado</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {deliveries.map((delivery) => (
            <tr
              key={delivery.id}
              className={tableRowLinkClass}
              onClick={() =>
                navigate(
                  DELIVERIES_SECTION_ENABLED
                    ? `/deliveries/${delivery.id}`
                    : delivery.order_id
                      ? `/orders/${delivery.order_id}`
                      : `/deliveries/${delivery.id}`,
                )
              }
            >
              <td className="px-6 py-4 text-gray-500">{formatDate(delivery.created_at)}</td>
              <td className="px-6 py-4">
                {delivery.order_id ? (
                  <Link
                    to={`/orders/${delivery.order_id}`}
                    className="font-medium text-brand hover:underline"
                    onClick={(e) => e.stopPropagation()}
                  >
                    Pedido #{delivery.order_id}
                  </Link>
                ) : (
                  <span className="font-medium text-gray-700">Envío #{delivery.shipment_id}</span>
                )}
              </td>
              <td className="px-6 py-4 text-gray-700">
                {delivery.driver?.name ?? "—"}
              </td>
              <td className="px-6 py-4">
                <DeliveryStatusBadge status={delivery.status} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
