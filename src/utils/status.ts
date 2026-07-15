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

export const getNextOrderStatus = (status: TOrderStatus): TOrderStatus | null => {
  if (status === "pending") return "ready"
  return null
}

export const canCancelOrder = (status: TOrderStatus) => status === "pending"

export const canCancelDelivery = (status: TDeliveryStatus) =>
  !["delivered", "cancelled"].includes(status)
