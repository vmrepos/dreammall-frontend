import type { TDelivery } from "./Delivery"
import type { TOrderItem, TOrderItemForm } from "./OrderItem"

export type TOrderStatus =
  | "pending"
  | "preparing"
  | "ready"
  | "dispatched"
  | "returned"
  | "cancelled"
  | "completed"

export type TOrder = {
  id: number
  status: TOrderStatus
  total_amount: number
  delivery_fee: number
  discount: number
  latitude: number | null
  longitude: number | null
  distance_km: number | null
  notes?: string | null
  created_at: string
  updated_at: string
  items: TOrderItem[]
  delivery: TDelivery | null
  delivery_code: string
  pick_up_code: string
  cancel_reason?: string | null
  ready_countdown: number | null
  public_token: string | null
  customer_name: string | null
  customer_phone: string | null
}

export type TOrderForm = {
  items_attributes: TOrderItemForm[]
  delivery_fee: number
  discount: number
  notes?: string
  total_amount?: number
  latitude?: number
  longitude?: number
  distance_km?: number
  customer_name?: string
  customer_phone?: string
}

export type TOrderCancelReason = "customer_cancelled" | "restaurant_cancelled" | "other"

export type TOrderUpdate = {
  status: TOrderStatus
  cancel_reason?: string
}
