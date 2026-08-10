import type { TOrderStatus } from "../types/Order"
import type { TDeliveryStatus } from "../types/Delivery"

type StatusConfig = {
  label: string
  variant: "default" | "brand" | "warning" | "info" | "success" | "danger"
}

export const orderStatusConfig: Record<TOrderStatus, StatusConfig> = {
  pending: { label: "Pendiente", variant: "warning" },
  preparing: { label: "Preparando", variant: "warning" },
  ready: { label: "Listo", variant: "success" },
  dispatched: { label: "Despachado", variant: "info" },
  returned: { label: "Devuelto al local", variant: "info" },
  cancelled: { label: "Cancelado", variant: "danger" },
  completed: { label: "Completado", variant: "success" },
}

export const deliveryStatusConfig: Record<TDeliveryStatus, StatusConfig> = {
  pending: { label: "Pendiente", variant: "warning" },
  awaiting_driver: { label: "Buscando repartidor", variant: "warning" },
  assigned: { label: "Asignada", variant: "info" },
  awaiting_pickup: { label: "Esperando recogida", variant: "info" },
  in_transit: { label: "En camino", variant: "info" },
  delivered: { label: "Entregada", variant: "success" },
  driving_back: { label: "Regresando al local", variant: "danger" },
  returned: { label: "Devuelta al local", variant: "info" },
  cancelled: { label: "Cancelada", variant: "danger" },
}

/** Happy-path statuses shown on the delivery progress bar. */
export const deliveryProgressSteps: TDeliveryStatus[] = [
  "pending",
  "awaiting_driver",
  "assigned",
  "in_transit",
  "delivered",
]

export const isTerminalDeliveryFailure = (status: TDeliveryStatus) =>
  status === "cancelled" || status === "driving_back" || status === "returned"

export const getDeliveryProgressIndex = (status: TDeliveryStatus): number => {
  if (status === "driving_back" || status === "returned") {
    return deliveryProgressSteps.indexOf("in_transit")
  }
  const index = deliveryProgressSteps.indexOf(status)
  return index >= 0 ? index : -1
}

export const getDeliveryStepTimestamp = (
  delivery: {
    created_at: string
    awaiting_driver_at: string | null
    assigned_at: string | null
    picked_up_at: string | null
    delivered_at: string | null
    cancelled_at: string | null
    absent_customer_at: string | null
    driver_returned_at?: string | null
    returned_at?: string | null
  },
  step: TDeliveryStatus,
): string | null => {
  switch (step) {
    case "pending":
      return delivery.created_at
    case "awaiting_driver":
      return delivery.awaiting_driver_at
    case "assigned":
      return delivery.assigned_at
    case "in_transit":
      return delivery.picked_up_at
    case "delivered":
      return delivery.delivered_at
    case "cancelled":
      return delivery.cancelled_at
    case "driving_back":
      return delivery.absent_customer_at
    case "returned":
      return delivery.returned_at ?? null
    default:
      return null
  }
}

export const getNextOrderStatus = (status: TOrderStatus): TOrderStatus | null => {
  if (status === "pending") return "preparing"
  if (status === "preparing" || status === "returned") return "ready"
  return null
}

export const canCancelOrder = (status: TOrderStatus, delivery: { status: TDeliveryStatus } | null = null) => {
  if (status === "pending" || status === "preparing" || status === "ready") return true
  if (status === "returned" && !delivery) return true
  return false
}

export const canCancelDelivery = (status: TDeliveryStatus) =>
  status === "awaiting_driver" || status === "assigned"

export const canConfirmReturn = (delivery: {
  status: TDeliveryStatus
  driver_returned_at?: string | null
}) => delivery.status === "driving_back" && Boolean(delivery.driver_returned_at)

export const canRetryDelivery = (
  status: TOrderStatus,
  delivery: { status: TDeliveryStatus } | null = null,
) => status === "returned" && !delivery

export const orderCancelReasonOptions = [
  { id: "customer_cancelled", label: "Cancelado por el cliente" },
  { id: "restaurant_cancelled", label: "Cancelado por el restaurant" },
  { id: "other", label: "Otro" },
] as const

export const cancelReasonLabel = (reason: string | null | undefined) => {
  if (!reason) return null
  if (reason === "customer_cancelled") return "Cancelado por el cliente"
  if (reason === "restaurant_cancelled") return "Cancelado por el restaurant"
  if (reason === "other") return "Otro"
  return reason
}
