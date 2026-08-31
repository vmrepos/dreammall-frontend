import { Link, useNavigate } from "react-router-dom"
import { useState } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faChevronDown } from "@fortawesome/free-solid-svg-icons"
import { DeliveryStatusBadge } from "../../../../components/molecules/StatusBadge"
import type { TDelivery } from "../../../../types/Delivery"
import { formatCurrency, formatDate, tableRowLinkClass } from "../../../../utils/format"

type Props = {
  deliveries: TDelivery[]
}

export const DeliveriesTable = ({ deliveries }: Props) => {
  const navigate = useNavigate()
  const [expandedIds, setExpandedIds] = useState<Set<number>>(new Set())

  const toggleExpanded = (id: number) => {
    setExpandedIds((current) => {
      const next = new Set(current)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  return (
    <div className="w-full">
      <table className="w-full text-left text-sm phone:hidden">
        <thead>
          <tr className="border-b border-gray-100 bg-gray-50/80 text-xs font-semibold uppercase tracking-wide text-gray-500">
            <th className="px-6 py-3">ID</th>
            <th className="px-6 py-3">Fecha</th>
            <th className="px-6 py-3">Referencia</th>
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
              <td className="px-6 py-4 text-gray-700">
                {delivery.order_id ? `Pedido #${delivery.order_id}` : `Envío #${delivery.shipment_id}`}
              </td>
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
      <ul className="hidden space-y-3 p-3 phone:block">
        {deliveries.map((delivery) => (
          <li key={delivery.id} className="overflow-hidden rounded-xl border border-gray-200 bg-surface-elevated shadow-sm">
            <button
              type="button"
              className="w-full min-w-0 px-4 py-4 text-left transition hover:bg-gray-50/60"
              onClick={() => toggleExpanded(delivery.id)}
              aria-expanded={expandedIds.has(delivery.id)}
              aria-controls={`delivery-${delivery.id}-details`}
            >
              <div className="flex min-w-0 items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-semibold text-gray-900">
                    {delivery.order_id
                      ? `Pedido #${delivery.order_id}`
                      : `Envío #${delivery.shipment_id}`}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <DeliveryStatusBadge status={delivery.status} />
                  <FontAwesomeIcon
                    icon={faChevronDown}
                    className={`size-3 text-gray-400 transition-transform ${
                      expandedIds.has(delivery.id) ? "rotate-180" : ""
                    }`}
                    aria-hidden
                  />
                </div>
              </div>
              <div className="mt-3 flex items-center justify-between gap-3 border-t border-gray-100 pt-3 text-sm">
                <span className="text-gray-500">{formatDate(delivery.created_at)}</span>
                <span className="font-semibold text-gray-900">{formatCurrency(delivery.fee)}</span>
              </div>
            </button>
            {expandedIds.has(delivery.id) ? (
              <div id={`delivery-${delivery.id}-details`} className="border-t border-gray-200 px-4 py-4">
                <p className="text-sm font-semibold text-gray-900">
                  {delivery.order_id
                    ? `Pedido #${delivery.order_id}`
                    : `Envío #${delivery.shipment_id}`}
                </p>
                <dl className="mt-3 grid min-w-0 gap-3 text-sm">
                  <div className="min-w-0">
                    <dt className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Recogida
                    </dt>
                    <dd className="mt-1 break-words text-gray-700">
                      {delivery.pickup_name || delivery.pickup_phone ? (
                        <p className="font-semibold text-brand">
                          {delivery.pickup_name ?? "—"}
                          {delivery.pickup_phone ? ` - ${delivery.pickup_phone}` : ""}
                        </p>
                      ) : null}
                      <p className="text-gray-500">{delivery.pickup_address ?? "—"}</p>
                    </dd>
                  </div>
                  <div className="min-w-0">
                    <dt className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Destino
                    </dt>
                    <dd className="mt-1 break-words text-gray-700">
                      {delivery.shipment?.recipient_name || delivery.shipment?.recipient_phone ? (
                        <p className="font-semibold text-brand">
                          {delivery.shipment.recipient_name ?? "—"}
                          {delivery.shipment.recipient_phone
                            ? ` - ${delivery.shipment.recipient_phone}`
                            : ""}
                        </p>
                      ) : null}
                      <p className="text-gray-500">{delivery.address ?? "—"}</p>
                    </dd>
                  </div>
                </dl>
                <Link
                  to={`/deliveries/${delivery.id}`}
                  className="mt-4 inline-flex text-sm font-semibold text-brand hover:underline"
                >
                  Ver detalles
                </Link>
              </div>
            ) : null}
          </li>
        ))}
      </ul>
    </div>
  )
}
