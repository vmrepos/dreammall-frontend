import { type ReactNode, useState, useCallback, useEffect } from "react"
import { apiClient } from "../../services/apiClient"
import type { TOrder, TOrderForm, TOrderStatus } from "../../types/Order"
import { OrdersContext } from "../OrdersContext"

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
