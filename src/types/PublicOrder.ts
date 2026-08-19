import type { TOrderItem } from "./OrderItem"

export type TPublicOrder = {
  id: number
  public_token: string
  restaurant_name?: string
  total_amount: number
  delivery_fee: number
  delivery_code?: string | null
  discount: number
  notes?: string | null
  customer_name?: string | null
  customer_phone?: string | null
  items: TOrderItem[]
}

export type TPublicOrderCompleteForm = {
  name: string
  phone: string
  notes: string
  latitude: number | null
  longitude: number | null
}

export type TPublicOrderCompletePayload = {
  customer_name: string
  customer_phone: string
  notes: string
  latitude: number
  longitude: number
}
