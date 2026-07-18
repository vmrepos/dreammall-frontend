import type { TProduct } from "./Product"

export type TMenu = {
  id: number
  name: string
  active: boolean
  products_count: number
  created_at?: string
  updated_at?: string
  products: TProduct[]
  image_url: string | null
}

export type TMenuForm = Partial<Omit<TMenu, "id" | "products" | "products_count">> & {
  image?: File | null
}