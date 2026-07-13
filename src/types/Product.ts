export type TProduct = {
  id: number
  menu_id: number
  name: string
  description: string
  price: string
  active: boolean
  combo: boolean
  position: number
  created_at: string
  updated_at: string
}


export type TProductForm = Omit<TProduct, "id" | "created_at" | "updated_at">
