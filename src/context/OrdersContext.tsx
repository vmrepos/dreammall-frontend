import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react"
import type { TOrder, TOrderForm, TOrderStatus } from "../types/Order"
import { apiClient } from "../services/apiClient"

type OrdersContextType = {
  orders: TOrder[]
  createOrder: (input: TOrderForm) => Promise<TOrder>
  getOrder: (id: number) => TOrder | undefined
  fetchOrder: (id: number) => Promise<TOrder>
  updateOrder: (id: number, status: TOrderStatus) => Promise<TOrder>
}

const OrdersContext = createContext<OrdersContextType | null>(null)

export const OrdersProvider = ({ children }: { children: ReactNode }) => {
  const [orders, setOrders] = useState<TOrder[]>([])


  // This syncs the order list
  const upsertOrder = useCallback((order: TOrder) => {
    setOrders((current) => {
      const index = current.findIndex((item) => item.id === order.id)
      if (index === -1) return [...current, order]
      const next = [...current]
      next[index] = order
      return next
    })
  }, [])


  const refreshOrders = useCallback(async () => {
    const response = await apiClient.orders.list()
    setOrders(response.data)
  }, [])

  const createOrder = useCallback(
    async (input: TOrderForm) => {

      const order = await apiClient.orders.create(input)
      upsertOrder(order)
      return order
    },
    [upsertOrder],
  )

  const getOrder = useCallback(
    (id: number) => orders.find((order) => order.id === id),
    [orders],
  )

  const fetchOrder = useCallback(
    async (id: number) => {
      const order = await apiClient.orders.show(id)
      upsertOrder(order)
      return order
    },
    [upsertOrder],
  )

  const updateOrder = useCallback(
    async (id: number, status: TOrderStatus) => {
      const order = await apiClient.orders.update(id, status)
      upsertOrder(order)
      return order
    },
    [upsertOrder],
  )

  useEffect(() => {
    void refreshOrders()
  }, [refreshOrders])

  return (
    <OrdersContext.Provider
      value={{ orders, createOrder, getOrder, fetchOrder, updateOrder }}
    >
      {children}
    </OrdersContext.Provider>
  )
}

export const useOrders = () => {
  const context = useContext(OrdersContext)
  if (!context) {
    throw new Error("useOrders must be used within OrdersProvider")
  }

  return context
}
