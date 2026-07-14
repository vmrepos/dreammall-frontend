export type TOrderItem = {
  id: number
  product_id: number
  product_name: string
  name: string
  quantity: number
  unit_price: string
  notes?: string
}

/** Line items before the order is persisted (no server id yet). */
export type TOrderItemForm = Omit<TOrderItem, "id">
