import type { TMenu, TMenuForm } from "../types/Menu"
import type { TProduct, TProductForm } from "../types/Product"
import { axiosInstance } from "./apiClient"

export const MenusAPI = {
  list: async (): Promise<TMenu[]> => {
    const response = await axiosInstance.get("/restaurants/menus")
    return response.data.data
  },
  show: async (id: number): Promise<TMenu> => {
    const response = await axiosInstance.get(`/restaurants/menus/${id}`)
    return response.data.data
  },
  create: async (menu: TMenuForm): Promise<TMenu> => {
    const response = await axiosInstance.post("/restaurants/menus", { menu })
    return response.data.data
  },
  update: async (id: number, menu: TMenuForm): Promise<TMenu> => {
    const response = await axiosInstance.patch(`/restaurants/menus/${id}`, { menu })
    return response.data.data
  },
  addProduct: async (id: number, product: TProductForm): Promise<TProduct> => {
    const response = await axiosInstance.post(`/restaurants/menus/${id}/products`, { product })
    return response.data.data
  },
  updateProduct: async (id: number, productId: number, product: TProductForm): Promise<TProduct> => {
    const response = await axiosInstance.patch(`/restaurants/menus/${id}/products/${productId}`, {
      product,
    })
    return response.data.data
  },
  deleteMenu: async (id: number): Promise<void> => {
    await axiosInstance.delete(`/restaurants/menus/${id}`)
  },
  deleteProduct: async (id: number, productId: number): Promise<void> => {
    await axiosInstance.delete(`/restaurants/menus/${id}/products/${productId}`)
  },
}
