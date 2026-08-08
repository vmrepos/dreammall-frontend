export type TOrderItemOption = {
  id?: number
  option_group_name: string
  option_name: string
  price_modifier: string
}

export type TOrderItem = {
  id: number
  product_id: number
  product_name: string
  quantity: number
  unit_price: string
  notes?: string
  order_item_options: TOrderItemOption[]
}

/** Line items before the order is persisted (no server id yet). */
export type TOrderItemForm = {
  clientKey: string
  product_id: number
  name: string
  quantity: number
  unit_price: string
  notes?: string
  order_item_options: TOrderItemOption[]
}
