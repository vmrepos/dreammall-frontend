import type { TMenu } from "../types/Menu"
import type { TProduct, TProductOptionGroup } from "../types/Product"
import type { TPublicCatalog, TPublicOrder, TPublicOrderCreatePayload } from "../types/PublicOrder"
import { publicClient, toPublicOrder } from "./publicOrders"

type TCatalogProductWire = Partial<TProduct> & {
  id: number
  menu_id: number
  name: string
  price: string
}

type TCatalogMenuWire = {
  id: number
  name: string
  active: boolean
  products?: TCatalogProductWire[]
}

type TCatalogWire = {
  name: string
  ordering_token: string
  whatsapp?: string | null
  menus?: TCatalogMenuWire[]
}

const toOptionGroup = (group: TProductOptionGroup): TProductOptionGroup => ({
  ...group,
  product_options: group.product_options ?? [],
})

const toProduct = (raw: TCatalogProductWire): TProduct => ({
  id: raw.id,
  menu_id: raw.menu_id,
  name: raw.name,
  description: raw.description ?? "",
  price: raw.price,
  active: raw.active !== false,
  combo: Boolean(raw.combo),
  position: raw.position ?? 0,
  created_at: raw.created_at ?? "",
  updated_at: raw.updated_at ?? "",
  product_option_groups: (raw.product_option_groups ?? []).map(toOptionGroup),
})

const toMenu = (raw: TCatalogMenuWire): TMenu => ({
  id: raw.id,
  name: raw.name,
  active: raw.active !== false,
  products_count: raw.products?.length ?? 0,
  products: (raw.products ?? []).map(toProduct),
  image_url: null,
})

const toCatalog = (raw: TCatalogWire): TPublicCatalog => ({
  name: raw.name,
  ordering_token: raw.ordering_token,
  whatsapp: raw.whatsapp ?? null,
  menus: (raw.menus ?? []).map(toMenu),
})

export const PublicCatalogAPI = {
  show: async (orderingToken: string): Promise<TPublicCatalog> => {
    const response = await publicClient.get(`/public/restaurants/${orderingToken}`)
    return toCatalog(response.data.data as TCatalogWire)
  },
  createOrder: async (
    orderingToken: string,
    input: TPublicOrderCreatePayload,
  ): Promise<TPublicOrder> => {
    const response = await publicClient.post(`/public/restaurants/${orderingToken}/orders`, input)
    return toPublicOrder(response.data.data)
  },
}
