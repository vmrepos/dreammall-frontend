import type { TMenu } from "../types/Menu"
import type { TProduct, TProductForm } from "../types/Product"
import { axiosInstance } from "./axiosInstance"
import { DirectUploadsAPI } from "./directUploads"

export type TMenuWrite = {
  name?: string
  active?: boolean
  /** Local file — uploaded to R2 (`menus` folder) before create/update. */
  image?: File | null
}

const toMenuPayload = async (menu: TMenuWrite) => {
  const payload: { name?: string; active?: boolean; image?: string } = {}
  if (menu.name != null) payload.name = menu.name
  if (menu.active != null) payload.active = menu.active

  if (menu.image) {
    const blob = await DirectUploadsAPI.upload(menu.image, "menus")
    payload.image = blob.signed_id
  }

  return payload
}

export const MenusAPI = {
  list: async (): Promise<TMenu[]> => {
    const response = await axiosInstance.get("/restaurants/menus")
    return response.data.data
  },

  show: async (id: number): Promise<TMenu> => {
    const response = await axiosInstance.get(`/restaurants/menus/${id}`)
    return response.data.data
  },

  create: async (menu: TMenuWrite): Promise<TMenu> => {
    const payload = await toMenuPayload(menu)
    const response = await axiosInstance.post("/restaurants/menus", { menu: payload })
    return response.data.data
  },

  update: async (id: number, menu: TMenuWrite): Promise<TMenu> => {
    const payload = await toMenuPayload(menu)
    const response = await axiosInstance.patch(`/restaurants/menus/${id}`, { menu: payload })
    return response.data.data
  },

  destroy: async (id: number) => {
    const response = await axiosInstance.delete(`/restaurants/menus/${id}`)
    return response.data.data
  },

  products: (menuId: number) => ({
    list: async (): Promise<TProduct[]> => {
      const response = await axiosInstance.get(`/restaurants/menus/${menuId}/products`)
      return response.data.data
    },
    create: async (product: TProductForm): Promise<TProduct> => {
      const response = await axiosInstance.post(`/restaurants/menus/${menuId}/products`, product)
      return response.data.data
    },
    update: async (productId: number, product: TProductForm): Promise<TProduct> => {
      const response = await axiosInstance.put(
        `/restaurants/menus/${menuId}/products/${productId}`,
        product,
      )
      return response.data.data
    },
    destroy: async (productId: number) => {
      const response = await axiosInstance.delete(
        `/restaurants/menus/${menuId}/products/${productId}`,
      )
      return response.data.data
    },
  }),
}
