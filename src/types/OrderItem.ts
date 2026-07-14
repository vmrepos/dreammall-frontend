export type TOrderItem = {
  id: number
  product_id: number
  product_name: string
  quantity: number
  unit_price: string
  notes?: string
}

/** Line items before the order is persisted (no server id yet). */
export type TOrderItemForm = {
  product_id: number
  name: string
  quantity: number
  unit_price: string
  notes?: string
}
