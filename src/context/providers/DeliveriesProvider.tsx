import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react"
import { toast } from "sonner"
import { apiClient } from "../../services/apiClient"
import type { TDelivery } from "../../types/Delivery"
import { useCable } from "../CableContext"
import { DeliveriesContext } from "../DeliveriesContext"

type EventMessage = {
  id?: unknown
  delivery?: unknown
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null

const toId = (value: unknown) => {
  const id = typeof value === "number" ? value : Number(value)
  return Number.isInteger(id) && id > 0 ? id : undefined
}

const shipmentEventToast = (type: string, shipmentId?: number) => {
  const reference = shipmentId ? `Envío #${shipmentId}` : "Envío"
  const messages: Record<string, [ "success" | "warning" | "error", string ]> = {
    shipment_delivery_assigned: ["success", `${reference}: repartidor asignado`],
    shipment_picked_up: ["success", `${reference}: paquete recogido`],
    shipment_delivered: ["success", `${reference}: paquete entregado`],
    shipment_absent_customer: ["warning", `${reference}: cliente ausente`],
    shipment_driver_returned: ["warning", `${reference}: el repartidor volvió al local`],
    shipment_returned: ["success", `${reference}: devolución confirmada`],
    shipment_cancelled: ["error", `${reference}: entrega cancelada`],
  }
  const [level, message] = messages[type] ?? ["success", `${reference}: estado actualizado`]
  toast[level](message)
}

export const DeliveriesProvider = ({ children }: { children: ReactNode }) => {
  const [deliveries, setDeliveries] = useState<TDelivery[]>([])
  const deliveriesRef = useRef(deliveries)
  const { subscribe } = useCable()

  const upsertDelivery = useCallback((delivery: TDelivery) => {
    setDeliveries((current) => {
      const index = current.findIndex((item) => item.id === delivery.id)
      const next =
        index === -1
          ? [...current, delivery]
          : current.map((item, itemIndex) => (itemIndex === index ? delivery : item))
      deliveriesRef.current = next
      return next
    })
  }, [])

  const refreshDeliveries = useCallback(async () => {
    const next = await apiClient.deliveries.list()
    deliveriesRef.current = next
    setDeliveries(next)
    return next
  }, [])

  const getDelivery = useCallback(
    (id: number) => deliveries.find((delivery) => delivery.id === id),
    [deliveries],
  )

  useEffect(() => {
    return subscribe((data) => {
      if (!String(data.type).startsWith("shipment_")) return

      const message: EventMessage = isRecord(data.message) ? data.message : {}
      const shipmentId = toId(message.id)
      const nestedDelivery = isRecord(message.delivery) ? message.delivery : undefined
      const nestedDeliveryId = toId(nestedDelivery?.id)
      const currentDelivery = shipmentId
        ? deliveriesRef.current.find((delivery) => delivery.shipment_id === shipmentId)
        : undefined
      const deliveryId = nestedDeliveryId ?? currentDelivery?.id

      const syncDelivery = async () => {
        if (deliveryId) {
          try {
            upsertDelivery(await apiClient.deliveries.show(deliveryId))
            return
          } catch {
            // Fall back to the list when the delivery is being replaced.
          }
        }

        try {
          await refreshDeliveries()
        } catch {
          // The event still gets surfaced through the toast.
        }
      }

      shipmentEventToast(String(data.type), shipmentId)
      void syncDelivery()
    })
  }, [refreshDeliveries, subscribe, upsertDelivery])

  const value = useMemo(
    () => ({ deliveries, getDelivery, refreshDeliveries, upsertDelivery }),
    [deliveries, getDelivery, refreshDeliveries, upsertDelivery],
  )

  return <DeliveriesContext.Provider value={value}>{children}</DeliveriesContext.Provider>
}
