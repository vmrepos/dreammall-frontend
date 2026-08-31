import type { TDriver } from "./Driver"
import type { TShipment } from "./Shipment"

export type TDeliveryStatus =
  | "awaiting_driver"
  | "assigned"
  | "in_transit"
  | "delivered"
  | "driving_back"
  | "returned"
  | "cancelled"

export type TDelivery = {
  id: number
  order_id: number | null
  shipment_id: number | null
  source_type: "order" | "shipment"
  latitude: number
  longitude: number
  fee: string
  distance_km: string
  status: TDeliveryStatus
  address: string | null
  created_at: string
  updated_at: string
  awaiting_driver_at: string | null
  assigned_at: string | null
  picked_up_at: string | null
  delivered_at: string | null
  cancelled_at: string | null
  driving_back_at: string | null
  driver_returned_at: string | null
  returned_at: string | null
  driver: TDriver | null
  delivery_code: string | null
  pickup_name: string | null
  pickup_phone: string | null
  pickup_address: string | null
  pickup_latitude: number | null
  pickup_longitude: number | null
  shipment: TShipment | null
}
