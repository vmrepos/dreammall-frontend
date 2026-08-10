import { useEffect, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faArrowLeft,
  faMotorcycle,
  faTruck,
} from "@fortawesome/free-solid-svg-icons"
import { toast } from "sonner"
import { Button } from "../../../components/atoms/Button"
import { Card, CardHeader } from "../../../components/atoms/Card"
import { ConfirmDialog } from "../../../components/molecules/ConfirmDialog"
import { DeliveryStatusProgress } from "../../../components/molecules/DeliveryStatusProgress"
import { DeliveryStatusBadge } from "../../../components/molecules/StatusBadge"
import { DetailRow } from "../../../components/organisms/OrderItemsTable"
import type { TDelivery, TDeliveryStatus } from "../../../types/Delivery"
import { canCancelDelivery, canConfirmReturn, deliveryStatusConfig } from "../../../utils/status"
import { formatCurrency, formatDate } from "../../../utils/format"
import { apiClient } from "../../../services/apiClient"

export const DeliveryShowPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  useEffect(() => {
    apiClient.deliveries.show(Number(id)).then((delivery) => {
      setDelivery(delivery)
    })
  }, [id])
  const [delivery, setDelivery] = useState<TDelivery | undefined>(undefined)
  const [showCancelDialog, setShowCancelDialog] = useState(false)
  const [showReturnDialog, setShowReturnDialog] = useState(false)
  const [showRetryDialog, setShowRetryDialog] = useState(false)
  const [confirmingReturn, setConfirmingReturn] = useState(false)
  const [retrying, setRetrying] = useState(false)

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

  const confirmReturn = async () => {
    setConfirmingReturn(true)
    try {
      const updated = await apiClient.deliveries.confirmReturn(delivery.id)
      setDelivery(updated)
      setShowReturnDialog(false)
      toast.success("Devolución confirmada")
    } catch {
      toast.error("No se pudo confirmar la devolución")
    } finally {
      setConfirmingReturn(false)
    }
  }

  const retryDelivery = async () => {
    setRetrying(true)
    try {
      const created = await apiClient.deliveries.create(delivery.order_id)
      setShowRetryDialog(false)
      toast.success("Buscando un nuevo repartidor")
      navigate(`/deliveries/${created.id}`)
    } catch {
      toast.error("No se pudo reenviar la entrega. Revisa tus créditos.")
    } finally {
      setRetrying(false)
    }
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

        <div className="flex gap-3">
          {canConfirmReturn(delivery) && (
            <Button onClick={() => setShowReturnDialog(true)}>Confirmar devolución</Button>
          )}
          {delivery.status === "returned" && (
            <Button onClick={() => setShowRetryDialog(true)}>Reenviar entrega</Button>
          )}
          {canCancelDelivery(delivery.status) && (
            <Button variant="danger" onClick={() => setShowCancelDialog(true)}>
              Cancelar entrega
            </Button>
          )}
        </div>
      </div>

      {delivery.status === "driving_back" && !delivery.driver_returned_at && (
        <p className="mb-4 rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-900">
          Cliente ausente. Esperando que el repartidor vuelva al local.
        </p>
      )}
      {delivery.status === "returned" && (
        <p className="mb-4 rounded-xl bg-brand-light px-4 py-3 text-sm text-brand">
          Pedido recibido de vuelta. Puedes reenviar o cancelar el pedido{" "}
          <Link to={`/orders/${delivery.order_id}`} className="font-semibold underline">
            #{delivery.order_id}
          </Link>
          .
        </p>
      )}

      <Card padding="md" className="mb-6">
        <DeliveryStatusProgress delivery={delivery} />
      </Card>

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

      <ConfirmDialog
        open={showReturnDialog}
        title="Confirmar devolución"
        message="¿Confirmas que el pedido volvió al local? El repartidor quedará libre."
        confirmLabel="Sí, recibí el pedido"
        confirmVariant="primary"
        confirming={confirmingReturn}
        onConfirm={confirmReturn}
        onCancel={() => !confirmingReturn && setShowReturnDialog(false)}
      />

      <ConfirmDialog
        open={showRetryDialog}
        title="Reenviar entrega"
        message="Se buscará un nuevo repartidor y se usará 1 crédito. ¿Deseas continuar?"
        confirmLabel="Sí, reenviar"
        confirmVariant="primary"
        confirming={retrying}
        onConfirm={retryDelivery}
        onCancel={() => !retrying && setShowRetryDialog(false)}
      />
    </div>
  )
}
