import type { TMenu } from "./Menu"
import type { TOrderItem } from "./OrderItem"

export type TPublicOrder = {
  id: number
  public_token: string
  status: string
  restaurant_name?: string
  payment_qr_url?: string | null
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

export type TPublicCatalog = {
  name: string
  ordering_token: string
  whatsapp?: string | null
  menus: TMenu[]
}

export type TPublicOrderCreateItem = {
  product_id: number
  quantity: number
  order_item_options: Array<{
    option_group_name: string
    option_name: string
  }>
}

export type TPublicOrderCreatePayload = TPublicOrderCompletePayload & {
  items: TPublicOrderCreateItem[]
}
