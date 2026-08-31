import type { TDelivery } from "./Delivery"

export type TShipment = {
  id: number
  pickup_name: string
  pickup_phone: string
  pickup_address: string
  pickup_latitude: number
  pickup_longitude: number
  recipient_name: string
  recipient_phone: string
  destination_address: string
  destination_latitude: number
  destination_longitude: number
  description: string | null
  delivery_code: string
  fee: number | string
  distance_km: number | string
  created_at: string
  updated_at: string
  delivery?: TDelivery | null
}

export type TShipmentFormValues = {
  pickup_name: string
  pickup_phone: string
  pickup_address: string
  pickup_latitude: number | null
  pickup_longitude: number | null
  recipient_name: string
  recipient_phone: string
  destination_address: string
  destination_latitude: number | null
  destination_longitude: number | null
  description: string
}
