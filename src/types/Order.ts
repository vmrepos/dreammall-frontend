import type { TOrderItem, TOrderItemForm } from "./OrderItem"

export type TOrderStatus =
  | "pending"
  | "received"
  | "preparing"
  | "ready"
  | "completed"
  | "cancelled"

export type TOrder = {
  id: number
  status: TOrderStatus
  total_amount: string
  delivery_fee: string
  discount: string
  created_at: string
  updated_at: string
  items: TOrderItem[]
  delivery_id: number | null
}

export type TOrderForm = Omit<TOrder, "id" | "created_at" | "updated_at" | "delivery_id" | "status" | "items"> & {
  items_attributes: TOrderItemForm[]
}