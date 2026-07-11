import { useNavigate } from "react-router-dom"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faBoxOpen, faPlus, faTruck } from "@fortawesome/free-solid-svg-icons"
import { Button } from "../../../components/atoms/Button"
import { Card } from "../../../components/atoms/Card"
import { PageHeader } from "../../../components/molecules/PageHeader"
import { DeliveryStatusBadge } from "../../../components/molecules/StatusBadge"
import { formatCurrency, formatDate } from "../../../utils/format"
import { tableRowLinkClass } from "../../../components/organisms/OrderItemsTable"
import { apiClient } from "../../../services/apiClient"
import { useState, useEffect } from "react"
import type { TDelivery } from "../../../types/Delivery"

export const DeliveriesPage = () => {
  const navigate = useNavigate()
  const [deliveries, setDeliveries] = useState<TDelivery[]>([])

  useEffect(() => {
    apiClient.deliveries.list().then((deliveries) => {
      setDeliveries(deliveries)
    })
  }, [])
  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader
        icon={faTruck}
        section="Logística"
        title="Entregas"
        description="Coordina y sigue el estado de las entregas de tu comercio."
        action={
          <Button onClick={() => navigate("/deliveries/new")}>
            <FontAwesomeIcon icon={faPlus} className="size-4" aria-hidden />
            Nueva entrega
          </Button>
        }
      />

      <Card>
        {deliveries.length === 0 ? (
          <div className="flex flex-col items-center px-6 py-16 text-center">
            <div className="mb-4 flex size-14 items-center justify-center rounded-full bg-brand-light text-brand">
              <FontAwesomeIcon icon={faBoxOpen} className="size-6" aria-hidden />
            </div>
            <h2 className="text-lg font-semibold text-gray-900">Sin entregas todavía</h2>
            <p className="mt-2 max-w-sm text-sm leading-relaxed text-gray-500">
              Cuando solicites una entrega, aparecerá aquí con su estado y detalles.
            </p>
            <Button className="mt-6" onClick={() => navigate("/deliveries/new")}>
              Crear primera entrega
            </Button>
          </div>
        ) : (
          <>
            <div className="border-b border-gray-100 px-6 py-4">
              <p className="text-sm text-gray-500">
                <span className="font-semibold text-gray-900">{deliveries.length}</span>{" "}
                {deliveries.length === 1 ? "entrega" : "entregas"}
              </p>
            </div>

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
                      <td className="px-6 py-4 text-gray-700">#TBD</td>
                      <td className="max-w-xs truncate px-6 py-4 text-gray-700">
                        #TBD
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
          </>
        )}
      </Card>
    </div>
  )
}
