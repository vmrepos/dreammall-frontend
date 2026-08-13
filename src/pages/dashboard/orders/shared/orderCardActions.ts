import type { TOrder } from "../../../../types/Order"
import {
  canCancelOrder,
  canConfirmReturn,
  canRetryDelivery,
  getNextOrderStatus,
} from "../../../../utils/status"

export type TOrderCardAction = "preparing" | "ready" | "cancel" | "return" | "retry"

export type TOrderCardActionButton = {
  id: TOrderCardAction
  label: string
  variant?: "primary" | "danger"
}

export const getOrderCardActions = (order: TOrder): TOrderCardActionButton[] => {
  const nextStatus = getNextOrderStatus(order.status)
  const actions: TOrderCardActionButton[] = []

  if (nextStatus === "preparing") {
    actions.push({ id: "preparing", label: "Preparando" })
  } else if (nextStatus === "ready") {
    actions.push({ id: "ready", label: "Marcar listo" })
  }

  if (order.delivery && canConfirmReturn(order.delivery)) {
    actions.push({ id: "return", label: "Confirmar devolución" })
  }

  if (canRetryDelivery(order.status, order.delivery)) {
    actions.push({ id: "retry", label: "Reenviar" })
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
    message: `Se buscará un nuevo repartidor para el pedido #${id} y se usará 1 crédito.`,
    confirmLabel: "Sí, reenviar",
  }),
}

export const orderCardErrorMessage: Record<TOrderCardAction, string> = {
  preparing: "No se pudo preparar el pedido. Revisa tus créditos.",
  ready: "No se pudo marcar el pedido como listo",
  return: "No se pudo confirmar la devolución",
  retry: "No se pudo reenviar la entrega. Revisa tus créditos.",
  cancel: "No se pudo cancelar el pedido",
}
