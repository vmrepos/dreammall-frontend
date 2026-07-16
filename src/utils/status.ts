import type { TOrderStatus } from "../types/Order"
import type { TDeliveryStatus } from "../types/Delivery"

type StatusConfig = {
  label: string
  variant: "default" | "brand" | "warning" | "info" | "success" | "danger"
}

export const orderStatusConfig: Record<TOrderStatus, StatusConfig> = {
  pending: { label: "Pendiente", variant: "warning" },
  ready: { label: "Listo", variant: "success" },
  cancelled: { label: "Cancelado", variant: "danger" },
}

export const deliveryStatusConfig: Record<TDeliveryStatus, StatusConfig> = {
  pending: { label: "Pendiente", variant: "warning" },
  awaiting_driver: { label: "Buscando repartidor", variant: "warning" },
  assigned: { label: "Asignada", variant: "info" },
  in_transit: { label: "En camino", variant: "info" },
  delivered: { label: "Entregada", variant: "success" },
  absent_customer: { label: "Cliente ausente", variant: "danger" },
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
  status === "cancelled" || status === "absent_customer"

export const getDeliveryProgressIndex = (status: TDeliveryStatus): number => {
  if (status === "absent_customer") {
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
    case "absent_customer":
      return delivery.absent_customer_at
    default:
      return null
  }
}

export const getNextOrderStatus = (status: TOrderStatus): TOrderStatus | null => {
  if (status === "pending") return "ready"
  return null
}

export const canCancelOrder = (status: TOrderStatus) => status === "pending"

export const canCancelDelivery = (status: TDeliveryStatus) =>
  !["delivered", "cancelled"].includes(status)
