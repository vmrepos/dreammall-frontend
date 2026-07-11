import type { TOrderStatus } from "../types/Order"
import type { TDeliveryStatus } from "../types/Delivery"

type StatusConfig = {
  label: string
  variant: "default" | "brand" | "warning" | "info" | "success" | "danger"
}

export const orderStatusConfig: Record<TOrderStatus, StatusConfig> = {
  pending: { label: "Pendiente", variant: "warning" },
  received: { label: "Recibido", variant: "info" },
  preparing: { label: "Preparando", variant: "info" },
  ready: { label: "Listo", variant: "success" },
  completed: { label: "Completado", variant: "success" },
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
  const flow: Partial<Record<TOrderStatus, TOrderStatus>> = {
    pending: "received",
    received: "preparing",
    preparing: "ready",
  }

  return flow[status] ?? null
}

export const canCancelOrder = (status: TOrderStatus) =>
  !["completed", "cancelled"].includes(status)

export const canCancelDelivery = (status: TDeliveryStatus) =>
  !["delivered", "cancelled"].includes(status)
