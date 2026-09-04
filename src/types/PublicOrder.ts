import type { TMenu } from "./Menu"
import type { TOrderItem } from "./OrderItem"
import type { TPaymentMethod } from "./Order"

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
  payment_method?: TPaymentMethod | null
  change_for?: number | null
  completed_by_restaurant?: boolean
  coupon?: {
    code: string
    amount: number
    applied_amount: number
  } | null
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
  from_restaurant?: boolean
}

export type TPublicOrderPaymentPayload = {
  payment_method: TPaymentMethod
  change_for?: number | null
  from_restaurant?: boolean
}

export type TPublicCatalog = {
  name: string
  ordering_token: string
  whatsapp?: string | null
  logo_url?: string | null
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
  coupon_code?: string
}
