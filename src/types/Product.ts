export type TProductOption = {
  id: number
  name: string
  price_modifier: string
  position: number
  default: boolean
  active: boolean
}

export type TProductOptionGroup = {
  id: number
  name: string
  required: boolean
  position: number
  product_options: TProductOption[]
}

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
  product_option_groups: TProductOptionGroup[]
}

export type TProductOptionWrite = {
  id?: number
  name: string
  price_modifier: string
  position: number
  default: boolean
  active: boolean
  _destroy?: boolean
}

export type TProductOptionGroupWrite = {
  id?: number
  name: string
  required: boolean
  position: number
  _destroy?: boolean
  product_options_attributes?: TProductOptionWrite[]
}

export type TProductForm = Partial<Omit<TProduct, "product_option_groups">> & {
  product_option_groups_attributes?: TProductOptionGroupWrite[]
}
