import { useEffect, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faArrowLeft, faClipboardList } from "@fortawesome/free-solid-svg-icons"
import { Button } from "../../../../components/atoms/Button"
import { Card, CardHeader } from "../../../../components/atoms/Card"
import { ConfirmDialog } from "../../../../components/molecules/ConfirmDialog"
import { CancelOrderDialog } from "../shared/CancelOrderDialog"
import { OrderStatusBadge } from "../../../../components/molecules/StatusBadge"
import { DetailRow } from "../../../../components/molecules/DetailRow"
import { OrderItemsTable } from "../shared/OrderItemsTable"
import { toast } from "sonner"
import { useOrders } from "../../../../context/OrdersContext"
import { apiClient } from "../../../../services/apiClient"
import type { TOrderStatus } from "../../../../types/Order"
import { canCancelOrder, canConfirmReturn, cancelReasonLabel, canRetryDelivery, getNextOrderStatus, orderStatusConfig } from "../../../../utils/status"
import { formatCurrency, formatDate } from "../../../../utils/format"
import { DeliveryCard } from "../shared/DeliveryCard"

const nextActionLabel: Partial<Record<TOrderStatus, string>> = {
  pending: "Preparando",
  preparing: "Marcar listo",
  returned: "Marcar listo",
}

export const Page = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const orderId = Number(id)
  const { getOrder, fetchOrder, updateOrder } = useOrders()
  const order = getOrder(orderId)
  const [loading, setLoading] = useState(!order)
  const [notFound, setNotFound] = useState(false)
  const [confirmAction, setConfirmAction] = useState<"ready" | "cancel" | "return" | "retry" | null>(null)
  const [confirming, setConfirming] = useState(false)

  useEffect(() => {
    let cancelled = false

    const load = async () => {
      setLoading(true)
      setNotFound(false)
      try {
        await fetchOrder(orderId)
      } catch {
        if (!cancelled) setNotFound(true)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    void load()
    return () => {
      cancelled = true
    }
  }, [orderId, fetchOrder])

  if (loading && !order) {
    return (
      <div className="mx-auto max-w-3xl text-center">
        <p className="text-sm text-gray-500">Cargando pedido...</p>
      </div>
    )
  }

  if (notFound || !order) {
    return (
      <div className="mx-auto max-w-3xl text-center">
        <h1 className="text-2xl font-bold text-gray-900">Pedido no encontrado</h1>
        <Link to="/orders" className="mt-4 inline-block text-brand hover:underline">
          Volver a pedidos
        </Link>
      </div>
    )
  }

  const nextStatus = getNextOrderStatus(order.status)
  const nextLabel = nextActionLabel[order.status]
  const subtotal = order.items.reduce(
    (sum, item) => sum + Number(item.unit_price) * item.quantity,
    0,
  )

  const handleConfirm = async () => {
    if (!confirmAction) return
    setConfirming(true)
    try {
      if (confirmAction === "ready" && nextStatus) {
        await updateOrder(order.id, nextStatus)
      } else if (confirmAction === "return" && order.delivery) {
        await apiClient.deliveries.confirmReturn(order.delivery.id)
        await fetchOrder(order.id)
        toast.success("Devolución confirmada")
      } else if (confirmAction === "retry") {
        const delivery = await apiClient.deliveries.create(order.id)
        await fetchOrder(order.id)
        toast.success("Buscando un nuevo repartidor")
        navigate(`/deliveries/${delivery.id}`)
      }
      setConfirmAction(null)
    } catch {
      toast.error(
        confirmAction === "retry"
          ? "No se pudo reenviar la entrega. Revisa tus créditos."
          : "No se pudo actualizar el pedido.",
      )
    } finally {
      setConfirming(false)
    }
  }

  const handleCancelOrder = async (reason: string) => {
    setConfirming(true)
    try {
      await updateOrder(order.id, "cancelled", reason)
      toast.success("Pedido cancelado")
      setConfirmAction(null)
    } catch {
      toast.error("No se pudo cancelar el pedido.")
    } finally {
      setConfirming(false)
    }
  }

  return (
    <div className="mx-auto max-w-6xl">
      <Link
        to="/orders"
        className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition hover:text-brand"
      >
        <FontAwesomeIcon icon={faArrowLeft} className="size-4" aria-hidden />
        Volver a pedidos
      </Link>

      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <div className="mb-2 flex items-center gap-2 text-brand">
            <FontAwesomeIcon icon={faClipboardList} className="size-5" aria-hidden />
            <span className="text-sm font-semibold uppercase tracking-wide">Pedido #{order.id}</span>
          </div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-gray-900">{orderStatusConfig[order.status].label}</h1>
            <OrderStatusBadge status={order.status} />
          </div>
          <p className="mt-1 text-[15px] text-gray-500">
            Creado el {formatDate(order.created_at)}
          </p>
        </div>

        <div className="flex gap-3">
          {nextLabel && (
            <Button onClick={() => setConfirmAction("ready")}>{nextLabel}</Button>
          )}
          {order.delivery && canConfirmReturn(order.delivery) && (
            <Button onClick={() => setConfirmAction("return")}>Confirmar devolución</Button>
          )}
          {canRetryDelivery(order.status, order.delivery) && (
            <Button onClick={() => setConfirmAction("retry")}>Reenviar entrega</Button>
          )}
          {canCancelOrder(order.status, order.delivery) && (
            <Button variant="danger" onClick={() => setConfirmAction("cancel")}>
              Cancelar pedido
            </Button>
          )}
          {(order.status === "ready" || order.status === "dispatched") && order.delivery && (
            <Button variant="secondary" onClick={() => navigate(`/deliveries/${order.delivery?.id}`)}>
              Ver entrega
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2">
          <Card>
            <CardHeader title="Detalle del pedido" description="Productos incluidos en este pedido" />
            <OrderItemsTable items={order.items} />
          </Card>
        </div>

        <div className="space-y-6">
          <Card padding="md">
            <h2 className="mb-4 text-lg font-semibold text-gray-900">Resumen</h2>
            <DetailRow label="Subtotal" value={formatCurrency(subtotal)} />
            <DetailRow label="Envío" value={formatCurrency(order.delivery_fee)} />
            <DetailRow label="Descuento" value={`-${formatCurrency(order.discount)}`} />
            {order.notes?.trim() && (
              <div className="mt-3 rounded-lg bg-gray-50 px-3 py-2.5">
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Notas</p>
                <p className="mt-1 text-sm leading-relaxed text-gray-700">{order.notes}</p>
              </div>
            )}
            {order.status === "cancelled" && cancelReasonLabel(order.cancel_reason) && (
              <div className="mt-3 rounded-lg bg-red-50 px-3 py-2.5">
                <p className="text-xs font-semibold uppercase tracking-wide text-red-700">Motivo de cancelación</p>
                <p className="mt-1 text-sm leading-relaxed text-red-900">
                  {cancelReasonLabel(order.cancel_reason)}
                </p>
              </div>
            )}
            <div className="mt-2 flex items-center justify-between border-t border-gray-100 pt-2">
              <span className="flex flex-col gap-1">
                <span className="font-semibold text-gray-900">Código de entrega</span>
                <small className="text-gray-500">Entregar este codigo al cliente</small>
              </span>
              <span className="text-lg font-bold text-blue-500">
                {order.delivery_code}
              </span>
            </div>

            <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-4">
              <span className="font-semibold text-gray-900">Total</span>
              <span className="text-lg font-bold text-brand">
                {formatCurrency(order.total_amount)}
              </span>
            </div>
          </Card>

          <Card padding="md">
            <h2 className="mb-4 text-lg font-semibold text-gray-900">Entrega</h2>
            {order.delivery ? (
              <DeliveryCard delivery={order.delivery} />
            ) : (
              <p className="text-sm text-gray-500">Sin entrega asociada todavía.</p>
            )}
          </Card>
        </div>
      </div>

      <ConfirmDialog
        open={confirmAction === "ready"}
        title="Marcar pedido listo"
        message={`¿Confirmas que el pedido #${order.id} está listo para entrega?`}
        confirmLabel="Sí, marcar listo"
        confirmVariant="primary"
        confirming={confirming}
        onConfirm={handleConfirm}
        onCancel={() => !confirming && setConfirmAction(null)}
      />

      <CancelOrderDialog
        open={confirmAction === "cancel"}
        confirming={confirming}
        onConfirm={handleCancelOrder}
        onCancel={() => !confirming && setConfirmAction(null)}
      />

      <ConfirmDialog
        open={confirmAction === "return"}
        title="Confirmar devolución"
        message="¿Confirmas que el pedido volvió al local? El repartidor quedará libre."
        confirmLabel="Sí, recibí el pedido"
        confirmVariant="primary"
        confirming={confirming}
        onConfirm={handleConfirm}
        onCancel={() => !confirming && setConfirmAction(null)}
      />

      <ConfirmDialog
        open={confirmAction === "retry"}
        title="Reenviar entrega"
        message="Se buscará un nuevo repartidor y se usará 1 crédito. ¿Deseas continuar?"
        confirmLabel="Sí, reenviar"
        confirmVariant="primary"
        confirming={confirming}
        onConfirm={handleConfirm}
        onCancel={() => !confirming && setConfirmAction(null)}
      />
    </div>
  )
}
