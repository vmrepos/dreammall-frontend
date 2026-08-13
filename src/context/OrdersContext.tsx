import { createContext, useContext } from "react"
import type { TOrder, TOrderForm, TOrderStatus } from "../types/Order"


type OrdersContextType = {
  orders: TOrder[]
  createOrder: (input: TOrderForm) => Promise<TOrder>
  getOrder: (id: number) => TOrder | undefined
  fetchOrder: (id: number) => Promise<TOrder>
  markPreparing: (id: number) => Promise<TOrder>
  updateOrder: (id: number, status: TOrderStatus, cancelReason?: string) => Promise<TOrder>
}

export const OrdersContext = createContext<OrdersContextType | null>(null)



export const useOrders = () => {
  const context = useContext(OrdersContext)
  if (!context) {
    throw new Error("useOrders must be used within OrdersProvider")
  }

  return context
}
