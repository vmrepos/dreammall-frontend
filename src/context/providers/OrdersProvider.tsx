import { type ReactNode, useState, useCallback, useEffect } from "react"
import { apiClient } from "../../services/apiClient"
import type { TOrder, TOrderForm, TOrderStatus } from "../../types/Order"
import { OrdersContext } from "../OrdersContext"
import { useCable } from "../CableContext"
import { toast } from "sonner"

export const OrdersProvider = ({ children }: { children: ReactNode }) => {
  const [orders, setOrders] = useState<TOrder[]>([])
  const { subscribe } = useCable()
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

  useEffect(() => {
    return subscribe((data) => {
      console.log("New Message Received", data)
      let o = data.message as TOrder;
      switch (data.type) {
        case "order_picked_up":
          toast.warning(`La orden numero ${o.id} ha sido tomada por el repartidor`)
          break;
        case "order_delivered":
          toast.success(`La orden numero ${o.id} ha sido entregada`)
          break;
        case "order_cancelled":
          toast.error(`La orden numero ${o.id} ha sido cancelada`)
          break;
        case "order_absent_customer":
          toast.error(`Pedido #${o.id}: cliente ausente`)
          break;
        case "order_driver_returned":
          toast.warning(`Pedido #${o.id}: el repartidor volvió al local`)
          break;
        case "order_returned":
          toast.success(`Pedido #${o.id}: devolución confirmada`)
          break;
      }
      upsertOrder(o)
      return () => {
        console.log("unsubscribed")
      }
    })
  }, [subscribe, upsertOrder])




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
    async (id: number, status: TOrderStatus, cancelReason?: string) => {
      const order = await apiClient.orders.update(id, status, cancelReason)
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
