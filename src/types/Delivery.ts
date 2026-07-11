import type { TDriver } from "./Driver"

export type TDeliveryStatus =
  | "pending"
  | "awaiting_driver"
  | "assigned"
  | "in_transit"
  | "delivered"
  | "absent_customer"
  | "cancelled"

export type TDelivery = {
  id: number
  order_id: number
  latitude: number
  longitude: number
  fee: string
  distance_km: string
  status: TDeliveryStatus
  address: string | null
  created_at: string
  updated_at: string
  driver: TDriver | null
}
