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
import type { TOrder } from "../../../../types/Order"
import { canCancelDelivery, canConfirmReturn, deliveryStatusConfig } from "../../../../utils/status"
import { formatCurrency, formatDate } from "../../../../utils/format"
import { whatsAppMessageHref } from "../../../../utils/orderShare"
import { apiClient } from "../../../../services/apiClient"
import { useDeliveries } from "../../../../context/DeliveriesContext"
import { useOrders } from "../../../../context/OrdersContext"
import { DeliveryStatusBanners } from "./DeliveryStatusBanners"

export const Page = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const deliveryId = Number(id)
  const { getDelivery, upsertDelivery } = useDeliveries()
  const { updateOrder } = useOrders()
  const delivery = getDelivery(deliveryId)
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
        upsertDelivery(nextDelivery)
        if (nextDelivery.order_id != null) {
          try {
            const nextOrder = await apiClient.orders.show(nextDelivery.order_id)
            if (!cancelled) setOrder(nextOrder)
          } catch {
            if (!cancelled) setOrder(undefined)
          }
        } else {
          setOrder(undefined)
        }
      } catch {
        if (!cancelled) {
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
  }, [id, upsertDelivery])

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
      upsertDelivery(updated)
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
      const created =
        delivery.order_id != null
          ? await apiClient.deliveries.create(delivery.order_id)
          : await apiClient.shipments.retry(delivery.shipment_id!)
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
    if (delivery.order_id == null) return
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

  const deliveryCode = order?.delivery_code ?? delivery.delivery_code
  const destinationPhone = order?.customer_phone ?? delivery.shipment?.recipient_phone ?? null

  return (
    <div className="mx-auto max-w-6xl">
      <Link
        to="/deliveries"
        className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition hover:text-brand phone:mb-4"
      >
        <FontAwesomeIcon icon={faArrowLeft} className="size-4" aria-hidden />
        Volver a entregas
      </Link>

      <div className="mb-6 flex items-start justify-between gap-4 phone:mb-5 phone:flex-col phone:gap-4">
        <div className="min-w-0">
          <div className="mb-2 flex items-center gap-2 text-brand">
            <FontAwesomeIcon icon={faTruck} className="size-5" aria-hidden />
            <span className="text-sm font-semibold uppercase tracking-wide">
              Entrega #{delivery.id}
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-3 phone:gap-2">
            <h1 className="text-2xl font-bold text-gray-900 phone:text-xl">
              {deliveryStatusConfig[delivery.status].label}
            </h1>
            <DeliveryStatusBadge status={delivery.status} />
          </div>
          <p className="mt-1 text-[15px] text-gray-500">
            Creada el {formatDate(delivery.created_at)}
          </p>
        </div>

        <div className="flex shrink-0 flex-wrap justify-end gap-3 phone:w-full phone:flex-col phone:gap-2">
          {order?.status === "preparing" && (
            <Button className="phone:w-full" onClick={() => setShowReadyDialog(true)}>
              Marcar listo
            </Button>
          )}
          {canConfirmReturn(delivery) && (
            <Button className="phone:w-full" onClick={() => setShowReturnDialog(true)}>
              Confirmar devolución
            </Button>
          )}
          {delivery.status === "returned" && (delivery.order_id != null || delivery.shipment_id != null) && (
            <Button className="phone:w-full" onClick={() => setShowRetryDialog(true)}>
              Reenviar entrega
            </Button>
          )}
          {canCancelDelivery(delivery.status) && (
            <Button
              variant="danger"
              className="phone:w-full"
              onClick={() => setShowCancelDialog(true)}
            >
              Cancelar entrega
            </Button>
          )}
        </div>
      </div>

      <DeliveryStatusBanners delivery={delivery} />

      <Card padding="md" className="mb-6 phone:mb-4 phone:p-4">
        {deliveryCode ? (
          <div className="mb-4 flex items-center gap-3">
            <span className="text-2xl font-bold tabular-nums tracking-[0.2em] text-blue-500">
              {deliveryCode}
            </span>
            {destinationPhone ? (
              <a
                href={whatsAppMessageHref(
                  destinationPhone,
                  `Su pedido está de camino, su código de entrega es ${deliveryCode}`,
                )}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Enviar código por WhatsApp"
                title="Enviar código por WhatsApp"
                className="inline-flex size-10 shrink-0 items-center justify-center rounded-full bg-[#25D366] text-white transition hover:bg-[#1ebe57]"
              >
                <WhatsAppIcon />
              </a>
            ) : null}
          </div>
        ) : null}
        <DeliveryStatusProgress delivery={delivery} />
      </Card>

      <div className="grid grid-cols-3 gap-6 phone:grid-cols-1 phone:gap-4">
        <div className="col-span-2 space-y-6 phone:col-span-1 phone:space-y-4">
          <Card padding="md" className="phone:p-4">
            <h2 className="mb-4 text-lg font-semibold text-gray-900">Destino</h2>
            <p className="break-words text-gray-700">{delivery.address}</p>
            <p className="mt-2 break-all text-sm text-gray-500">
              Coordenadas: {delivery.latitude}, {delivery.longitude}
            </p>
            {(order?.customer_name || order?.customer_phone || delivery.shipment?.recipient_name || delivery.shipment?.recipient_phone) && (
              <div className="mt-4 rounded-lg bg-gray-50 px-3 py-2.5">
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Destinatario
                </p>
                {order?.customer_name || delivery.shipment?.recipient_name ? (
                  <p className="mt-1 text-sm text-gray-900">
                    {order?.customer_name ?? delivery.shipment?.recipient_name}
                  </p>
                ) : null}
                {order?.customer_phone || delivery.shipment?.recipient_phone ? (
                  <p className="text-sm text-gray-700">
                    {order?.customer_phone ?? delivery.shipment?.recipient_phone}
                  </p>
                ) : null}
              </div>
            )}
            {(order?.notes?.trim() || delivery.shipment?.description?.trim()) ? (
              <p className="mt-3 text-sm text-gray-700">
                {order?.notes?.trim() || delivery.shipment?.description}
              </p>
            ) : null}
          </Card>

          {delivery.shipment ? (
            <Card padding="md" className="phone:p-4">
              <h2 className="mb-4 text-lg font-semibold text-gray-900">Recogida</h2>
              <p className="break-words text-gray-700">{delivery.shipment.pickup_address}</p>
              <p className="mt-2 text-sm text-gray-500">
                {delivery.shipment.pickup_name} · {delivery.shipment.pickup_phone}
              </p>
            </Card>
          ) : null}

          <Card className="phone:p-0">
            <CardHeader title="Repartidor" description="Información del repartidor asignado" />
            {delivery.driver ? (
              <div className="flex items-center gap-4 px-6 py-5 phone:px-4 phone:py-4">
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
              <p className="px-6 py-5 text-sm text-gray-500 phone:px-4 phone:py-4">
                Aún no se ha asignado un repartidor a esta entrega.
              </p>
            )}
          </Card>
        </div>

        <Card padding="md" className="phone:p-4">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">Detalles</h2>
          {delivery.order_id != null ? (
            <DetailRow
              label="Pedido"
              value={`#${delivery.order_id}`}
              href={`/orders/${delivery.order_id}`}
            />
          ) : (
            <DetailRow label="Envío" value={`#${delivery.shipment_id}`} />
          )}
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

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-5 fill-current" aria-hidden>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.71.306 1.263.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  )
}
