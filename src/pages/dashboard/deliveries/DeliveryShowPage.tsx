import { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faArrowLeft,
  faMotorcycle,
  faTruck,
} from "@fortawesome/free-solid-svg-icons"
import { Button } from "../../../components/atoms/Button"
import { Card, CardHeader } from "../../../components/atoms/Card"
import { ConfirmDialog } from "../../../components/molecules/ConfirmDialog"
import { DeliveryStatusBadge } from "../../../components/molecules/StatusBadge"
import { DetailRow } from "../../../components/organisms/OrderItemsTable"
import type { TDelivery, TDeliveryStatus } from "../../../types/Delivery"
import { canCancelDelivery, deliveryStatusConfig } from "../../../utils/status"
import { formatCurrency, formatDate } from "../../../utils/format"
import { apiClient } from "../../../services/apiClient"

export const DeliveryShowPage = () => {
  const { id } = useParams()
  useEffect(() => {
    apiClient.deliveries.show(Number(id)).then((delivery) => {
      setDelivery(delivery)
    })
  }, [id])
  const [delivery, setDelivery] = useState<TDelivery | undefined>(undefined)
  const [showCancelDialog, setShowCancelDialog] = useState(false)

  if (!delivery) {
    return (
      <div className="mx-auto max-w-3xl text-center">
        <h1 className="text-2xl font-bold text-gray-900">Entrega no encontrada</h1>
        <Link to="/deliveries" className="mt-4 inline-block text-brand hover:underline">
          Volver a entregas
        </Link>
      </div>
    )
  }

  const cancelDelivery = () => {
    setDelivery((current) =>
      current
        ? { ...current, status: "cancelled" as TDeliveryStatus, updated_at: new Date().toISOString() }
        : current,
    )
    setShowCancelDialog(false)
  }

  return (
    <div className="mx-auto max-w-6xl">
      <Link
        to="/deliveries"
        className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition hover:text-brand"
      >
        <FontAwesomeIcon icon={faArrowLeft} className="size-4" aria-hidden />
        Volver a entregas
      </Link>

      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <div className="mb-2 flex items-center gap-2 text-brand">
            <FontAwesomeIcon icon={faTruck} className="size-5" aria-hidden />
            <span className="text-sm font-semibold uppercase tracking-wide">
              Entrega #{delivery.id}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-gray-900">
              {deliveryStatusConfig[delivery.status].label}
            </h1>
            <DeliveryStatusBadge status={delivery.status} />
          </div>
          <p className="mt-1 text-[15px] text-gray-500">
            Creada el {formatDate(delivery.created_at)}
          </p>
        </div>

        {canCancelDelivery(delivery.status) && (
          <Button variant="danger" onClick={() => setShowCancelDialog(true)}>
            Cancelar entrega
          </Button>
        )}
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 space-y-6">
          <Card padding="md">
            <h2 className="mb-4 text-lg font-semibold text-gray-900">Destino</h2>
            <p className="text-gray-700">{delivery.address}</p>
            <p className="mt-2 text-sm text-gray-500">
              Coordenadas: {delivery.latitude}, {delivery.longitude}
            </p>
          </Card>

          <Card>
            <CardHeader title="Repartidor" description="Información del repartidor asignado" />
            {delivery.driver ? (
              <div className="flex items-center gap-4 px-6 py-5">
                <div className="flex size-12 items-center justify-center rounded-full bg-brand-light text-brand">
                  <FontAwesomeIcon icon={faMotorcycle} className="size-5" aria-hidden />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{delivery.driver.name}</p>
                  <p className="text-sm text-gray-500">
                    {delivery.driver.vehicle_type} · {delivery.driver.vehicle_plate}
                  </p>
                </div>
              </div>
            ) : (
              <p className="px-6 py-5 text-sm text-gray-500">
                Aún no se ha asignado un repartidor a esta entrega.
              </p>
            )}
          </Card>
        </div>

        <Card padding="md">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">Detalles</h2>
          <DetailRow label="Pedido" value={`#${delivery.order_id}`} href={`/orders/${delivery.order_id}`} />
          <DetailRow label="Distancia" value={`${delivery.distance_km} km`} />
          <DetailRow label="Costo de envío" value={formatCurrency(delivery.fee)} />
          <DetailRow label="Última actualización" value={formatDate(delivery.updated_at)} />
        </Card>
      </div>

      <ConfirmDialog
        open={showCancelDialog}
        title="Cancelar entrega"
        message="¿Estás seguro de que deseas cancelar esta entrega?"
        confirmLabel="Sí, cancelar"
        onConfirm={cancelDelivery}
        onCancel={() => setShowCancelDialog(false)}
      />
    </div>
  )
}
