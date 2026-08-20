import type { TOrder } from "../../../../types/Order"
import {
  canCancelDelivery,
  canCancelOrder,
  canConfirmReturn,
  canMarkPreparing,
  canRetryDelivery,
  getNextOrderStatus,
} from "../../../../utils/status"

export type TOrderCardAction = "preparing" | "ready" | "cancel" | "cancelTrip" | "return" | "retry"

export type TOrderCardActionButton = {
  id: TOrderCardAction
  label: string
  variant?: "primary" | "danger" | "secondary"
  disabled?: boolean
  title?: string
}

export const getOrderCardActions = (order: TOrder): TOrderCardActionButton[] => {
  const nextStatus = getNextOrderStatus(order.status)
  const actions: TOrderCardActionButton[] = []

  if (nextStatus === "preparing") {
    const canPrepare = canMarkPreparing(order)
    actions.push({
      id: "preparing",
      label: "Preparando",
      disabled: !canPrepare,
      title: canPrepare ? undefined : "Falta la ubicación del cliente",
    })
  } else if (nextStatus === "ready") {
    actions.push({ id: "ready", label: "Marcar listo" })
  }

  if (order.delivery && canConfirmReturn(order.delivery)) {
    actions.push({ id: "return", label: "Confirmar devolución" })
  }

  if (canRetryDelivery(order.status, order.delivery)) {
    actions.push({ id: "retry", label: "Reenviar" })
  }

  if (order.delivery && canCancelDelivery(order.delivery.status)) {
    actions.push({ id: "cancelTrip", label: "Cancelar entrega", variant: "secondary" })
  }

  if (canCancelOrder(order.status, order.delivery)) {
    actions.push({ id: "cancel", label: "Cancelar", variant: "danger" })
  }

  return actions
}

type ConfirmCopy = {
  title: string
  message: string
  confirmLabel: string
}

export const orderCardConfirmCopy: Record<Exclude<TOrderCardAction, "cancel">, (orderId: number) => ConfirmCopy> = {
  preparing: (id) => ({
    title: "Preparar pedido",
    message: `El pedido #${id} pasará a preparación, se buscará un repartidor y se usará 1 crédito.`,
    confirmLabel: "Sí, preparar",
  }),
  ready: (id) => ({
    title: "Marcar pedido listo",
    message: `¿Confirmas que el pedido #${id} está listo para entrega?`,
    confirmLabel: "Sí, marcar listo",
  }),
  return: (id) => ({
    title: "Confirmar devolución",
    message: `¿Confirmas que el pedido #${id} volvió al local? El repartidor quedará libre.`,
    confirmLabel: "Sí, recibí el pedido",
  }),
  retry: (id) => ({
    title: "Reenviar entrega",
    message: `El pedido #${id} quedará listo, se buscará un nuevo repartidor y se usará 1 crédito.`,
    confirmLabel: "Sí, reenviar",
  }),
  cancelTrip: (id) => ({
    title: "Cancelar entrega",
    message: `Se liberará el repartidor del pedido #${id} y se buscará otro. No se devuelve el crédito.`,
    confirmLabel: "Sí, buscar otro",
  }),
}

export const orderCardErrorMessage: Record<TOrderCardAction, string> = {
  preparing: "No se pudo preparar el pedido. Revisa tus créditos.",
  ready: "No se pudo marcar el pedido como listo",
  return: "No se pudo confirmar la devolución",
  retry: "No se pudo reenviar la entrega. Revisa tus créditos.",
  cancel: "No se pudo cancelar el pedido",
  cancelTrip: "No se pudo cancelar la entrega",
}
