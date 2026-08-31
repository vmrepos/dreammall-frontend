import { createContext, useContext } from "react"
import type { TDelivery } from "../types/Delivery"

type DeliveriesContextType = {
  deliveries: TDelivery[]
  getDelivery: (id: number) => TDelivery | undefined
  refreshDeliveries: () => Promise<TDelivery[]>
  upsertDelivery: (delivery: TDelivery) => void
}

export const DeliveriesContext = createContext<DeliveriesContextType | null>(null)

export const useDeliveries = () => {
  const context = useContext(DeliveriesContext)
  if (!context) {
    throw new Error("useDeliveries must be used within DeliveriesProvider")
  }

  return context
}
