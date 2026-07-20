import type { TDelivery } from "./Delivery"
import type { TOrderItem, TOrderItemForm } from "./OrderItem"

export type TOrderStatus = "pending" | "ready" | "cancelled"

export type TOrder = {
  id: number
  status: TOrderStatus
  total_amount: string
  delivery_fee: string
  discount: string
  created_at: string
  updated_at: string
  items: TOrderItem[]
  delivery: TDelivery | null
}

export type TOrderForm = {
  items_attributes: TOrderItemForm[]
  delivery_fee: string
  discount: string
  total_amount: string
  latitude: number | null
  longitude: number | null
  distance_km: string | null
}

export type TOrderUpdate = {
  status: TOrderStatus
}