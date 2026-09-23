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
  multiple: boolean
  /** Minimum picks when `multiple`. 0 = optional. Ignored when not multiple. */
  min_select?: number | null
  /** Maximum picks when `multiple`. `null` = unlimited. Ignored when not multiple. */
  max_select?: number | null
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
  image_url: string | null
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
  multiple: boolean
  min_select?: number | null
  max_select?: number | null
  position: number
  _destroy?: boolean
  product_options_attributes?: TProductOptionWrite[]
}

export type TProductForm = Partial<Omit<TProduct, "product_option_groups" | "image_url">> & {
  product_option_groups_attributes?: TProductOptionGroupWrite[]
  /** Local file to upload, or null to remove the current photo. Omit to leave it. */
  image?: File | null
}
