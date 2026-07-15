import type { TProduct } from "./Product"

export type TMenu = {
  id: number
  name: string
  active: boolean
  products_count: number
  created_at?: string
  updated_at?: string
  products: TProduct[]
}

export type TMenuForm = Partial<TMenu>