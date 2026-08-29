import { useEffect, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faArrowLeft,
  faMotorcycle,
  faTruck,
} from "@fortawesome/free-solid-svg-icons"
import { toast } from "sonner"
import { Button } from "../../../../components/atoms/Button"
import { Card, CardHeader } from "../../../../components/atoms/Card"
import { ConfirmDialog } from "../../../../components/molecules/ConfirmDialog"
import { DeliveryStatusProgress } from "../../../../components/molecules/DeliveryStatusProgress"
import { DeliveryStatusBadge } from "../../../../components/molecules/StatusBadge"
import { DetailRow } from "../../../../components/molecules/DetailRow"
import type { TDelivery } from "../../../../types/Delivery"
import type { TOrder } from "../../../../types/Order"
import { canCancelDelivery, canConfirmReturn, deliveryStatusConfig } from "../../../../utils/status"
import { formatCurrency, formatDate } from "../../../../utils/format"
import { apiClient } from "../../../../services/apiClient"
import { useOrders } from "../../../../context/OrdersContext"
import { DeliveryStatusBanners } from "./DeliveryStatusBanners"

export const Page = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { updateOrder } = useOrders()
  const [delivery, setDelivery] = useState<TDelivery | undefined>(undefined)
  const [order, setOrder] = useState<TOrder | undefined>(undefined)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [showCancelDialog, setShowCancelDialog] = useState(false)
  const [showReturnDialog, setShowReturnDialog] = useState(false)
  const [showRetryDialog, setShowRetryDialog] = useState(false)
  const [showReadyDialog, setShowReadyDialog] = useState(false)
  const [confirmingReturn, setConfirmingReturn] = useState(false)
  const [retrying, setRetrying] = useState(false)
  const [cancelling, setCancelling] = useState(false)
  const [markingReady, setMarkingReady] = useState(false)

  useEffect(() => {
    let cancelled = false
    const load = async () => {
      setLoading(true)
      setNotFound(false)
      try {
        const nextDelivery = await apiClient.deliveries.show(Number(id))
        if (cancelled) return
        setDelivery(nextDelivery)
        try {
          const nextOrder = await apiClient.orders.show(nextDelivery.order_id)
          if (!cancelled) setOrder(nextOrder)
        } catch {
          if (!cancelled) setOrder(undefined)
        }
      } catch {
        if (!cancelled) {
          setDelivery(undefined)
          setOrder(undefined)
          setNotFound(true)
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    void load()
    return () => {
      cancelled = true
    }
  }, [id])

  if (loading && !delivery) {
    return (
      <div className="mx-auto max-w-3xl text-center">
        <p className="text-sm text-gray-500">Cargando entrega...</p>
      </div>
    )
  }

  if (notFound || !delivery) {
    return (
      <div className="mx-auto max-w-3xl text-center">
        <h1 className="text-2xl font-bold text-gray-900">Entrega no encontrada</h1>
        <Link to="/deliveries" className="mt-4 inline-block text-brand hover:underline">
          Volver a entregas
        </Link>
      </div>
    )
  }

  const cancelDelivery = async () => {
    setCancelling(true)
    try {
      const replacement = await apiClient.deliveries.cancel(delivery.id)
      setShowCancelDialog(false)
      toast.success("Buscando otro repartidor")
      navigate(`/deliveries/${replacement.id}`)
    } catch {
      toast.error("No se pudo cancelar la entrega")
    } finally {
      setCancelling(false)
    }
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
      toast.error("No se pudo reenviar la entrega.")
    } finally {
      setRetrying(false)
    }
  }

  const markReady = async () => {
    setMarkingReady(true)
    try {
      const updated = await updateOrder(delivery.order_id, "ready")
      setOrder(updated)
      setShowReadyDialog(false)
      toast.success("Paquete listo para recoger")
    } catch {
      toast.error("No se pudo marcar listo")
    } finally {
      setMarkingReady(false)
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
          {order?.status === "preparing" && (
            <Button onClick={() => setShowReadyDialog(true)}>Marcar listo</Button>
          )}
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

      <DeliveryStatusBanners delivery={delivery} />

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
            {(order?.customer_name || order?.customer_phone) && (
              <div className="mt-4 rounded-lg bg-gray-50 px-3 py-2.5">
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Destinatario
                </p>
                {order.customer_name ? (
                  <p className="mt-1 text-sm text-gray-900">{order.customer_name}</p>
                ) : null}
                {order.customer_phone ? (
                  <p className="text-sm text-gray-700">{order.customer_phone}</p>
                ) : null}
              </div>
            )}
            {order?.notes?.trim() ? (
              <p className="mt-3 text-sm text-gray-700">{order.notes}</p>
            ) : null}
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
          {order?.delivery_code ? (
            <DetailRow label="Código de entrega" value={order.delivery_code} />
          ) : null}
          <DetailRow label="Distancia" value={`${delivery.distance_km} km`} />
          <DetailRow label="Costo de envío" value={formatCurrency(delivery.fee)} />
          <DetailRow label="Última actualización" value={formatDate(delivery.updated_at)} />
        </Card>
      </div>

      <ConfirmDialog
        open={showReadyDialog}
        title="Marcar listo"
        message="¿Confirmas que el paquete está listo para que el repartidor lo recoja?"
        confirmLabel="Sí, marcar listo"
        confirmVariant="primary"
        confirming={markingReady}
        onConfirm={() => void markReady()}
        onCancel={() => !markingReady && setShowReadyDialog(false)}
      />

      <ConfirmDialog
        open={showCancelDialog}
        title="Cancelar entrega"
        message="Se liberará el repartidor y se buscará otro."
        confirmLabel="Sí, buscar otro"
        confirming={cancelling}
        onConfirm={() => void cancelDelivery()}
        onCancel={() => !cancelling && setShowCancelDialog(false)}
      />

      <ConfirmDialog
        open={showReturnDialog}
        title="Confirmar devolución"
        message="¿Confirmas que el pedido volvió al local? El repartidor quedará libre."
        confirmLabel="Sí, recibí el pedido"
        confirmVariant="primary"
        confirming={confirmingReturn}
        onConfirm={() => void confirmReturn()}
        onCancel={() => !confirmingReturn && setShowReturnDialog(false)}
      />

      <ConfirmDialog
        open={showRetryDialog}
        title="Reenviar entrega"
        message="Se buscará un nuevo repartidor. ¿Deseas continuar?"
        confirmLabel="Sí, reenviar"
        confirmVariant="primary"
        confirming={retrying}
        onConfirm={() => void retryDelivery()}
        onCancel={() => !retrying && setShowRetryDialog(false)}
      />
    </div>
  )
}
