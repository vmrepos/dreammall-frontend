import { useEffect, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faArrowLeft, faClipboardList } from "@fortawesome/free-solid-svg-icons"
import { Button } from "../../../../components/atoms/Button"
import { Card, CardHeader } from "../../../../components/atoms/Card"
import { ConfirmDialog } from "../../../../components/molecules/ConfirmDialog"
import { CancelOrderDialog } from "../shared/CancelOrderDialog"
import { OrderStatusBadge } from "../../../../components/molecules/StatusBadge"
import { OrderItemsTable } from "../shared/OrderItemsTable"
import { OrderSummaryCard, orderItemsSubtotal } from "../shared/OrderSummaryCard"
import { toast } from "sonner"
import { useOrders } from "../../../../context/OrdersContext"
import { useRestaurant } from "../../../../context/RestaurantContext"
import { usePrepProgress } from "../../../../hooks/usePrepProgress"
import { apiClient } from "../../../../services/apiClient"
import type { TOrderStatus } from "../../../../types/Order"
import { canCancelDelivery, canCancelOrder, canConfirmReturn, canMarkPreparing, canRetryDelivery, getNextOrderStatus, orderStatusConfig } from "../../../../utils/status"
import { formatCurrency, formatDate } from "../../../../utils/format"
import { DeliveryCard } from "../shared/DeliveryCard"
import { ReadyCountdown } from "../shared/ReadyCountdown"
import { DELIVERIES_SECTION_ENABLED } from "../../deliveries/Deliveries"
import { CopyOrderLinkButton } from "./CopyOrderLinkButton"
import { CopySummaryImageButton } from "./CopySummaryImageButton"

const nextActionLabel: Partial<Record<TOrderStatus, string>> = {
  pending: "Preparando",
  preparing: "Marcar listo",
}

export const Page = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const orderId = Number(id)
  const { getOrder, fetchOrder, markPreparing, updateOrder } = useOrders()
  const { restaurant } = useRestaurant()
  const order = getOrder(orderId)
  const prep = usePrepProgress(
    order?.status === "preparing",
    order?.ready_countdown,
    restaurant?.prep_time,
  )
  const [loading, setLoading] = useState(!order)
  const [notFound, setNotFound] = useState(false)
  const [confirmAction, setConfirmAction] = useState<"preparing" | "ready" | "cancel" | "cancelTrip" | "return" | "retry" | null>(null)
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
  const canPrepare = canMarkPreparing(order)
  const subtotal = orderItemsSubtotal(order)

  const handleConfirm = async () => {
    if (!confirmAction) return
    setConfirming(true)
    try {
      if (confirmAction === "preparing") {
        await markPreparing(order.id)
        toast.success(`Pedido #${order.id} en preparación`)
      } else if (confirmAction === "ready") {
        await updateOrder(order.id, "ready")
      } else if (confirmAction === "return" && order.delivery) {
        await apiClient.deliveries.confirmReturn(order.delivery.id)
        await fetchOrder(order.id)
        toast.success("Devolución confirmada")
      } else if (confirmAction === "retry") {
        const delivery = await apiClient.deliveries.create(order.id)
        await fetchOrder(order.id)
        toast.success("Buscando un nuevo repartidor")
        if (DELIVERIES_SECTION_ENABLED) navigate(`/deliveries/${delivery.id}`)
      } else if (confirmAction === "cancelTrip" && order.delivery) {
        await apiClient.deliveries.cancel(order.delivery.id)
        await fetchOrder(order.id)
        toast.success("Buscando otro repartidor")
      }
      setConfirmAction(null)
    } catch {
      toast.error(
        confirmAction === "preparing"
          ? "No se pudo preparar el pedido."
          : confirmAction === "retry"
            ? "No se pudo reenviar la entrega."
            : confirmAction === "cancelTrip"
              ? "No se pudo cancelar la entrega."
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
    <div className="mx-auto max-w-screen-2xl">
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
            {order.status === "preparing" && (
              <>
                {" · "}
                <ReadyCountdown
                  seconds={order.ready_countdown}
                  percentRemaining={prep.percent}
                  className="text-[15px]"
                  expired={order.ready_countdown == null}
                />
              </>
            )}
          </p>
          {order.public_token ? (
            <>
              <p className="mt-3 text-sm text-gray-500">
                El cliente completa nombre, teléfono y ubicación con este enlace.
                {!canPrepare && order.status === "pending"
                  ? " También puedes completar el destino aquí, sin usar el GPS de este dispositivo."
                  : ""}
              </p>
              <div className="mt-3">
                <CopyOrderLinkButton publicToken={order.public_token} />
              </div>
            </>
          ) : null}
        </div>

        <div className="flex flex-wrap justify-end gap-3">
          {nextStatus === "preparing" && (
            <Button
              disabled={!canPrepare}
              title={canPrepare ? undefined : "Falta la ubicación del cliente"}
              onClick={() => canPrepare && setConfirmAction("preparing")}
            >
              Preparando
            </Button>
          )}
          {nextStatus === "ready" && (
            <Button onClick={() => setConfirmAction("ready")}>{nextLabel}</Button>
          )}
          {order.delivery && canConfirmReturn(order.delivery) && (
            <Button onClick={() => setConfirmAction("return")}>Confirmar devolución</Button>
          )}
          {canRetryDelivery(order.status, order.delivery) && (
            <Button onClick={() => setConfirmAction("retry")}>Reenviar entrega</Button>
          )}
          {order.delivery && canCancelDelivery(order.delivery.status) && (
            <Button variant="secondary" onClick={() => setConfirmAction("cancelTrip")}>
              Cancelar entrega
            </Button>
          )}
          {canCancelOrder(order.status, order.delivery) && (
            <Button variant="danger" onClick={() => setConfirmAction("cancel")}>
              Cancelar pedido
            </Button>
          )}
          {DELIVERIES_SECTION_ENABLED && order.delivery && (
            <Button variant="secondary" onClick={() => navigate(`/deliveries/${order.delivery?.id}`)}>
              Ver entrega
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 items-stretch gap-4 lg:grid-cols-[minmax(0,1.4fr)_minmax(16rem,1fr)_minmax(16rem,1fr)]">
        <Card className="flex h-full flex-col border-2 !border-brand/50">
          <CardHeader title="Detalle del pedido" description="Productos incluidos en este pedido" />
          <div className="min-h-0 flex-1 overflow-auto">
            <OrderItemsTable items={order.items} />
          </div>
          <div className="mt-auto flex shrink-0 items-center justify-between border-t border-gray-100 bg-gray-50/50 px-6 py-3">
            <span className="text-sm font-semibold text-gray-700">Subtotal ítems</span>
            <span className="font-semibold tabular-nums text-gray-900">{formatCurrency(subtotal)}</span>
          </div>
        </Card>

        <OrderSummaryCard
          order={order}
          className="h-full"
          headerAction={<CopySummaryImageButton order={order} />}
        />

        <Card padding="md" className="h-full border-2 !border-accent-sun/55">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">Entrega</h2>
          {order.delivery ? (
            <DeliveryCard delivery={order.delivery} />
          ) : (
            <p className="text-sm text-gray-500">Sin entrega asociada todavía.</p>
          )}
        </Card>
      </div>

      <ConfirmDialog
        open={confirmAction === "preparing"}
        title="Preparar pedido"
        message={`El pedido #${order.id} pasará a preparación y se buscará un repartidor.`}
        confirmLabel="Sí, preparar"
        confirmVariant="primary"
        confirming={confirming}
        onConfirm={handleConfirm}
        onCancel={() => !confirming && setConfirmAction(null)}
      />

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
        message="El pedido quedará listo y se buscará un nuevo repartidor. ¿Deseas continuar?"
        confirmLabel="Sí, reenviar"
        confirmVariant="primary"
        confirming={confirming}
        onConfirm={handleConfirm}
        onCancel={() => !confirming && setConfirmAction(null)}
      />

      <ConfirmDialog
        open={confirmAction === "cancelTrip"}
        title="Cancelar entrega"
        message="Se liberará el repartidor y se buscará otro."
        confirmLabel="Sí, buscar otro"
        confirmVariant="danger"
        confirming={confirming}
        onConfirm={handleConfirm}
        onCancel={() => !confirming && setConfirmAction(null)}
      />
    </div>
  )
}
