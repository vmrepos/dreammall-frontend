import type { TDelivery } from "./Delivery"
import type { TOrderItem, TOrderItemForm } from "./OrderItem"

export type TOrderStatus = "pending" | "ready" | "cancelled" | "completed"

export type TOrder = {
  id: number
  status: TOrderStatus
  total_amount: number
  delivery_fee: number
  discount: number
  latitude: number
  longitude: number
  distance_km: number | null
  notes?: string | null
  created_at: string
  updated_at: string
  items: TOrderItem[]
  delivery: TDelivery | null
  delivery_code: string
  pick_up_code: string
  cancel_reason?: string | null
}

export type TOrderForm = {
  items_attributes: TOrderItemForm[]
  delivery_fee: number
  discount: number
  latitude: number | null
  longitude: number | null
  distance_km: number | null
  coordinates: string
  notes?: string
  total_amount?: number
}

export type TOrderUpdate = {
  status: TOrderStatus
}
