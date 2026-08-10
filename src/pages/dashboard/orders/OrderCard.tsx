import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faBoxOpen, faMotorcycle } from "@fortawesome/free-solid-svg-icons"
import { toast } from "sonner"
import { Button } from "../../../components/atoms/Button"
import { Card } from "../../../components/atoms/Card"
import { ConfirmDialog } from "../../../components/molecules/ConfirmDialog"
import { CancelOrderDialog } from "./CancelOrderDialog"
import { OrderStatusBadge, DeliveryStatusBadge } from "../../../components/molecules/StatusBadge"
import { useOrders } from "../../../context/OrdersContext"
import { apiClient } from "../../../services/apiClient"
import type { TOrder } from "../../../types/Order"
import { canCancelOrder, canConfirmReturn, canRetryDelivery, getNextOrderStatus } from "../../../utils/status"
import { cn, formatCurrency, formatDateTime } from "../../../utils/format"

const MAX_VISIBLE_ITEMS = 4

type ConfirmAction = "ready" | "cancel" | "return" | "retry" | null

type Props = {
  order: TOrder
}

export const OrderCard = ({ order }: Props) => {

  const navigate = useNavigate()
  const { updateOrder, fetchOrder } = useOrders()
  const [confirmAction, setConfirmAction] = useState<ConfirmAction>(null)
  const [confirming, setConfirming] = useState(false)

  const items = order.items ?? []
  const visibleItems = items.slice(0, MAX_VISIBLE_ITEMS)
  const hiddenCount = Math.max(0, items.length - MAX_VISIBLE_ITEMS)
  const nextStatus = getNextOrderStatus(order.status)
  const canMarkReady = nextStatus === "preparing" || nextStatus === "ready"
  const canCancel = canCancelOrder(order.status, order.delivery)
  const canReturn = order.delivery ? canConfirmReturn(order.delivery) : false
  const canRetry = canRetryDelivery(order.status, order.delivery)
  const showActions = canMarkReady || canCancel || canReturn || canRetry



  const closeConfirm = () => {
    if (confirming) return
    setConfirmAction(null)
  }

  const handleConfirm = async () => {
    if (!confirmAction) return
    setConfirming(true)
    try {
      if (confirmAction === "ready" && nextStatus) {
        await updateOrder(order.id, nextStatus)
        toast.success(
          nextStatus === "preparing"
            ? `Pedido #${order.id} en preparación`
            : `Pedido #${order.id} marcado como listo`,
        )
      } else if (confirmAction === "return" && order.delivery) {
        await apiClient.deliveries.confirmReturn(order.delivery.id)
        await fetchOrder(order.id)
        toast.success(`Pedido #${order.id}: devolución confirmada`)
      } else if (confirmAction === "retry") {
        await apiClient.deliveries.create(order.id)
        await fetchOrder(order.id)
        toast.success(`Pedido #${order.id}: buscando un nuevo repartidor`)
      }
      setConfirmAction(null)
    } catch {
      toast.error(
        confirmAction === "ready"
          ? "No se pudo marcar el pedido como listo"
          : confirmAction === "return"
            ? "No se pudo confirmar la devolución"
            : confirmAction === "retry"
              ? "No se pudo reenviar la entrega. Revisa tus créditos."
              : "No se pudo actualizar el pedido",
      )
    } finally {
      setConfirming(false)
    }
  }

  const handleCancelOrder = async (reason: string) => {
    setConfirming(true)
    try {
      await updateOrder(order.id, "cancelled", reason)
      toast.success(`Pedido #${order.id} cancelado`)
      setConfirmAction(null)
    } catch {
      toast.error("No se pudo cancelar el pedido")
    } finally {
      setConfirming(false)
    }
  }

  return (
    <div className="h-full">
      <Card
        className={cn(
          "flex h-full flex-col border-2 border-gray-300/90 transition hover:-translate-y-0.5 hover:border-brand/40 hover:shadow-[0_4px_12px_rgba(0,0,0,0.08),0_12px_28px_rgba(12,107,61,0.12)]",
          order.status === "cancelled" && "opacity-80",
        )}
      >
        <button
          type="button"
          onClick={() => navigate(`/orders/${order.id}`)}
          className="flex min-h-0 flex-1 cursor-pointer flex-col p-4 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
        >
          <div className="flex shrink-0 items-start justify-between gap-2">
            <div>
              <p className="text-lg font-bold tabular-nums text-ink">#{order.id}</p>
              <p className="mt-0.5 text-xs text-ink-muted">{formatDateTime(order.created_at)}</p>
            </div>
            <OrderStatusBadge status={order.status} />
          </div>

          <div className="mt-3 flex min-h-[8.5rem] flex-1 flex-col">
            {items.length === 0 ? (
              <p className="text-sm text-ink-muted">Sin ítems</p>
            ) : (
              <ul className="space-y-1.5">
                {visibleItems.map((item) => {
                  const options = item.order_item_options ?? []
                  return (
                    <li key={item.id} className="text-sm text-ink">
                      <p className="truncate">
                        <span className="font-semibold tabular-nums text-brand">{item.quantity}×</span>{" "}
                        {item.product_name}
                      </p>
                      {options.length > 0 && (
                        <p className="truncate pl-5 text-xs text-ink-muted">
                          {options.map((option) => option.option_name).join(" · ")}
                        </p>
                      )}
                    </li>
                  )
                })}
                {hiddenCount > 0 && (
                  <li className="text-xs font-medium text-ink-muted">
                    +{hiddenCount} {hiddenCount === 1 ? "ítem más" : "ítems más"}
                  </li>
                )}
              </ul>
            )}

            <div className="mt-3 min-h-[2.5rem]">
              {order.notes?.trim() ? (
                <p className="line-clamp-2 text-xs leading-relaxed text-ink-muted">
                  <span className="font-semibold text-ink">Notas:</span> {order.notes}
                </p>
              ) : null}
            </div>

            <div className="mt-auto flex min-h-7 items-center gap-2 pt-3">
              {order.delivery ? (
                <>
                  <FontAwesomeIcon
                    icon={faMotorcycle}
                    className="size-3.5 shrink-0 text-ink-muted"
                    aria-hidden
                  />
                  <DeliveryStatusBadge status={order.delivery.status} />
                </>
              ) : null}
            </div>
          </div>

          <div className="mt-3 flex shrink-0 items-end justify-between gap-3 border-t border-gray-100 pt-3">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wide text-ink-muted">
                Total
              </p>
              <p className="mt-0.5 text-base font-bold tabular-nums text-brand">
                {formatCurrency(order.total_amount)}
              </p>
            </div>
            <div className="text-right">
              <p className="text-[11px] text-ink-muted">Recogida</p>
              <p className="mt-0.5 font-mono text-sm font-semibold tabular-nums text-ink">
                {order.delivery_code}
              </p>
            </div>
          </div>
        </button>

        <div className="flex min-h-[3.25rem] shrink-0 gap-2 border-t border-gray-100 px-4 py-3">
          {showActions ? (
            <>
              {canMarkReady && (
                <Button
                  className="flex-1 rounded-lg px-3 py-2 text-xs"
                  onClick={() => setConfirmAction("ready")}
                >
                  {nextStatus === "preparing" ? "Preparando" : "Marcar listo"}
                </Button>
              )}
              {canReturn && (
                <Button
                  className="flex-1 rounded-lg px-3 py-2 text-xs"
                  onClick={() => setConfirmAction("return")}
                >
                  Confirmar devolución
                </Button>
              )}
              {canRetry && (
                <Button
                  className="flex-1 rounded-lg px-3 py-2 text-xs"
                  onClick={() => setConfirmAction("retry")}
                >
                  Reenviar
                </Button>
              )}
              {canCancel && (
                <Button
                  variant="danger"
                  className="flex-1 rounded-lg px-3 py-2 text-xs"
                  onClick={() => setConfirmAction("cancel")}
                >
                  Cancelar
                </Button>
              )}
            </>
          ) : (
            <Button
              variant="secondary"
              className="flex-1 rounded-lg px-3 py-2 text-xs"
              onClick={() => navigate(`/orders/${order.id}`)}
            >
              Ver detalle
            </Button>
          )}
        </div>
      </Card>

      <ConfirmDialog
        open={confirmAction === "ready"}
        title="Marcar pedido listo"
        message={`¿Confirmas que el pedido #${order.id} está listo para entrega?`}
        confirmLabel="Sí, marcar listo"
        confirmVariant="primary"
        confirming={confirming}
        onConfirm={handleConfirm}
        onCancel={closeConfirm}
      />

      <CancelOrderDialog
        open={confirmAction === "cancel"}
        confirming={confirming}
        onConfirm={handleCancelOrder}
        onCancel={closeConfirm}
      />

      <ConfirmDialog
        open={confirmAction === "return"}
        title="Confirmar devolución"
        message={`¿Confirmas que el pedido #${order.id} volvió al local? El repartidor quedará libre.`}
        confirmLabel="Sí, recibí el pedido"
        confirmVariant="primary"
        confirming={confirming}
        onConfirm={handleConfirm}
        onCancel={closeConfirm}
      />

      <ConfirmDialog
        open={confirmAction === "retry"}
        title="Reenviar entrega"
        message={`Se buscará un nuevo repartidor para el pedido #${order.id} y se usará 1 crédito.`}
        confirmLabel="Sí, reenviar"
        confirmVariant="primary"
        confirming={confirming}
        onConfirm={handleConfirm}
        onCancel={closeConfirm}
      />
    </div>
  )
}

export const OrdersEmptyState = ({ onCreate }: { onCreate: () => void }) => (
  <Card>
    <div className="flex flex-col items-center px-6 py-16 text-center">
      <div className="mb-4 flex size-14 items-center justify-center rounded-full bg-brand-light text-brand">
        <FontAwesomeIcon icon={faBoxOpen} className="size-6" aria-hidden />
      </div>
      <h2 className="text-lg font-semibold text-gray-900">Sin pedidos todavía</h2>
      <p className="mt-2 max-w-sm text-sm leading-relaxed text-gray-500">
        Crea un pedido manual para verlo aquí con estado, ítems y total.
      </p>
      <Button className="mt-6" onClick={onCreate}>
        Crear primer pedido
      </Button>
    </div>
  </Card>
)
