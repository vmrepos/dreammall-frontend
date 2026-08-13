import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faMotorcycle } from "@fortawesome/free-solid-svg-icons"
import { toast } from "sonner"
import { Button } from "../../../../components/atoms/Button"
import { Card } from "../../../../components/atoms/Card"
import { ConfirmDialog } from "../../../../components/molecules/ConfirmDialog"
import { CancelOrderDialog } from "./CancelOrderDialog"
import { OrderStatusBadge, DeliveryStatusBadge } from "../../../../components/molecules/StatusBadge"
import { useOrders } from "../../../../context/OrdersContext"
import { apiClient } from "../../../../services/apiClient"
import type { TOrder } from "../../../../types/Order"
import { cn, formatCurrency, formatDateTime } from "../../../../utils/format"
import { ReadyCountdown } from "./ReadyCountdown"
import { OrderCardItems } from "./OrderCardItems"
import {
  getOrderCardActions,
  orderCardConfirmCopy,
  orderCardErrorMessage,
  type TOrderCardAction,
} from "./orderCardActions"

type Props = {
  order: TOrder
}

export const OrderCard = ({ order }: Props) => {
  const navigate = useNavigate()
  const { markPreparing, updateOrder, fetchOrder } = useOrders()
  const [confirmAction, setConfirmAction] = useState<TOrderCardAction | null>(null)
  const [confirming, setConfirming] = useState(false)

  const actions = getOrderCardActions(order)
  const confirmCopy =
    confirmAction && confirmAction !== "cancel"
      ? orderCardConfirmCopy[confirmAction](order.id)
      : null

  const closeConfirm = () => {
    if (!confirming) setConfirmAction(null)
  }

  const runAction = {
    preparing: async () => {
      await markPreparing(order.id)
      toast.success(`Pedido #${order.id} en preparación`)
    },
    ready: async () => {
      await updateOrder(order.id, "ready")
      toast.success(`Pedido #${order.id} marcado como listo`)
    },
    return: async () => {
      if (!order.delivery) return
      await apiClient.deliveries.confirmReturn(order.delivery.id)
      await fetchOrder(order.id)
      toast.success(`Pedido #${order.id}: devolución confirmada`)
    },
    retry: async () => {
      await apiClient.deliveries.create(order.id)
      await fetchOrder(order.id)
      toast.success(`Pedido #${order.id}: buscando un nuevo repartidor`)
    },
  }

  const handleConfirm = async () => {
    if (!confirmAction || confirmAction === "cancel") return
    setConfirming(true)
    try {
      await runAction[confirmAction]()
      setConfirmAction(null)
    } catch {
      toast.error(orderCardErrorMessage[confirmAction])
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
      toast.error(orderCardErrorMessage.cancel)
    } finally {
      setConfirming(false)
    }
  }

  const openOrder = () => navigate(`/orders/${order.id}`)

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
          onClick={openOrder}
          className="flex min-h-0 flex-1 cursor-pointer flex-col p-4 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
        >
          <div className="flex shrink-0 items-start justify-between gap-2">
            <div>
              <p className="text-lg font-bold tabular-nums text-ink">#{order.id}</p>
              <p className="mt-0.5 text-xs text-ink-muted">
                {formatDateTime(order.created_at)}
                {order.ready_countdown != null && (
                  <>
                    {" · "}
                    <ReadyCountdown seconds={order.ready_countdown} />
                  </>
                )}
              </p>
            </div>
            <OrderStatusBadge status={order.status} />
          </div>

          <div className="mt-3 flex min-h-[8.5rem] flex-1 flex-col">
            <OrderCardItems items={order.items} />

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
          {actions.length > 0 ? (
            actions.map((action) => (
              <Button
                key={action.id}
                variant={action.variant}
                className="flex-1 rounded-lg px-3 py-2 text-xs"
                onClick={() => setConfirmAction(action.id)}
              >
                {action.label}
              </Button>
            ))
          ) : (
            <Button
              variant="secondary"
              className="flex-1 rounded-lg px-3 py-2 text-xs"
              onClick={openOrder}
            >
              Ver detalle
            </Button>
          )}
        </div>
      </Card>

      {confirmCopy && (
        <ConfirmDialog
          open
          title={confirmCopy.title}
          message={confirmCopy.message}
          confirmLabel={confirmCopy.confirmLabel}
          confirmVariant="primary"
          confirming={confirming}
          onConfirm={handleConfirm}
          onCancel={closeConfirm}
        />
      )}

      <CancelOrderDialog
        open={confirmAction === "cancel"}
        confirming={confirming}
        onConfirm={handleCancelOrder}
        onCancel={closeConfirm}
      />
    </div>
  )
}
