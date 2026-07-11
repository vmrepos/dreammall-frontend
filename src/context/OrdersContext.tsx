import { createContext, useContext, useState, type ReactNode } from "react"
import { initialOrders } from "../mocks/orders"
import type { TOrder } from "../types/Order"
import type { TOrderItem } from "../types/OrderItem"

export type CreateOrderInput = {
  items: Pick<TOrderItem, "name" | "quantity" | "unit_price" | "notes">[]
  delivery_fee: string
  discount: string
}

type OrdersContextType = {
  orders: TOrder[]
  getOrder: (id: number) => TOrder | undefined
  addOrder: (input: CreateOrderInput) => TOrder
  updateOrder: (id: number, updater: (order: TOrder) => TOrder) => void
}

const OrdersContext = createContext<OrdersContextType | null>(null)

const touch = () => new Date().toISOString()

const nextOrderId = (orders: TOrder[]) =>
  orders.reduce((max, order) => Math.max(max, order.id), 0) + 1

const nextItemId = (orders: TOrder[]) =>
  orders.reduce((max, order) => {
    const itemMax = order.items.reduce((m, item) => Math.max(m, item.id), 0)
    return Math.max(max, itemMax)
  }, 0) + 1

const subtotal = (items: Pick<TOrderItem, "quantity" | "unit_price">[]) =>
  items.reduce((sum, item) => sum + item.quantity * Number(item.unit_price), 0).toFixed(2)

export const OrdersProvider = ({ children }: { children: ReactNode }) => {
  const [orders, setOrders] = useState<TOrder[]>(initialOrders)

  const getOrder = (id: number) => orders.find((order) => order.id === id)

  const addOrder = (input: CreateOrderInput) => {
    const now = touch()
    let itemId = nextItemId(orders)

    const items: TOrderItem[] = input.items.map((item) => ({
      id: itemId++,
      name: item.name,
      quantity: item.quantity,
      unit_price: item.unit_price,
      ...(item.notes?.trim() ? { notes: item.notes.trim() } : {}),
    }))

    const order: TOrder = {
      id: nextOrderId(orders),
      status: "pending",
      total_amount: subtotal(items),
      delivery_fee: input.delivery_fee,
      discount: input.discount,
      created_at: now,
      updated_at: now,
      delivery_id: null,
      items,
    }

    setOrders((current) => [order, ...current])
    return order
  }

  const updateOrder = (id: number, updater: (order: TOrder) => TOrder) => {
    setOrders((current) =>
      current.map((order) => (order.id === id ? updater(order) : order)),
    )
  }

  return (
    <OrdersContext.Provider value={{ orders, getOrder, addOrder, updateOrder }}>
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
