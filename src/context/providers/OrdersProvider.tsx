import { type ReactNode, useState, useCallback, useEffect } from "react"
import { apiClient } from "../../services/apiClient"
import { toOrder } from "../../services/orders"
import type { TOrder, TOrderForm, TOrderStatus } from "../../types/Order"
import { OrdersContext } from "../OrdersContext"
import { useCable } from "../CableContext"
import { toast } from "sonner"

export const OrdersProvider = ({ children }: { children: ReactNode }) => {
  const [orders, setOrders] = useState<TOrder[]>([])
  const [attentionOrderIds, setAttentionOrderIds] = useState<number[]>([])
  const { subscribe } = useCable()

  const markAttention = useCallback((id: number) => {
    setAttentionOrderIds((current) => (current.includes(id) ? current : [...current, id]))
  }, [])

  const acknowledgeOrder = useCallback((id: number) => {
    setAttentionOrderIds((current) => current.filter((item) => item !== id))
  }, [])

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
      if (String(data.type).startsWith("shipment_")) return
      const type = data.type === "order_absent_customer" ? "order_driving_back" : data.type
      const o = toOrder(data.message as Parameters<typeof toOrder>[0])
      switch (type) {
        case "order_created":
          toast.success(`Pedido #${o.id}: nuevo pedido del menú`)
          markAttention(o.id)
          break
        case "order_picked_up":
          toast.warning(`La orden numero ${o.id} ha sido tomada por el repartidor`)
          break;
        case "order_delivered":
          toast.success(`La orden numero ${o.id} ha sido entregada`)
          break;
        case "order_cancelled":
          toast.error(`La orden numero ${o.id} ha sido cancelada`)
          break;
        case "order_driving_back":
          toast.error(`Pedido #${o.id}: el repartidor vuelve al local`)
          break;
        case "order_driver_returned":
          toast.warning(`Pedido #${o.id}: el repartidor volvió al local`)
          break;
        case "order_returned":
          toast.success(`Pedido #${o.id}: devolución confirmada`)
          break;
        case "order_location_updated":
          toast.success(`Pedido #${o.id}: el cliente confirmó la ubicación`)
          markAttention(o.id)
          break;
        case "delivery_assigned":
          toast.success(`Pedido #${o.id}: repartidor asignado`)
          break;
      }
      upsertOrder(o)
      return () => {
        console.log("unsubscribed")
      }
    })
  }, [subscribe, upsertOrder, markAttention])




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

  const markPreparing = useCallback(
    async (id: number) => {
      const order = await apiClient.orders.markPreparing(id)
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
      value={{
        orders,
        attentionOrderIds,
        acknowledgeOrder,
        createOrder,
        getOrder,
        fetchOrder,
        markPreparing,
        updateOrder,
      }}
    >
      {children}
    </OrdersContext.Provider>
  )
}
