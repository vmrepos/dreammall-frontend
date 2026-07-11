import type { TProduct } from "./Product"

export type TMenu = {
  id: number
  name: string
  active: boolean
  created_at: string
  updated_at: string
  products: TProduct[]
}
