import type { TMenu, TMenuForm } from "../types/Menu"
import type { TProduct, TProductForm } from "../types/Product"
import { axiosInstance } from "./apiClient"

export const MenusAPI = {
  list: async () => {
    const response = await axiosInstance.get("/restaurants/menus")
    return response.data.data
  },
  show: async (id: number) => {
    const response = await axiosInstance.get(`/restaurants/menus/${id}`)
    return response.data.data
  },
  create: async (menu: TMenuForm) => {
    const response = await axiosInstance.post("/restaurants/menus", menu)
    return response.data.data
  },
  update: async (id: number, menu: Partial<TMenu>) => {
    const response = await axiosInstance.put(`/restaurants/menus/${id}`, menu)
    return response.data.data
  },
  addProduct: async (id: number, product: TProductForm): Promise<TProduct> => {
    const response = await axiosInstance.post(`/restaurants/menus/${id}/products`, product)
    return response.data.data
  },
  updateProduct: async (id: number, productId: number, product: TProductForm): Promise<TProduct> => {
    const response = await axiosInstance.put(`/restaurants/menus/${id}/products/${productId}`, product)
    return response.data.data
  },
  deleteMenu: async (id: number) => {
    const response = await axiosInstance.delete(`/restaurants/menus/${id}`)
    return response.data.data
  },
  deleteProduct: async (id: number, productId: number) => {
    const response = await axiosInstance.delete(`/restaurants/menus/${id}/products/${productId}`)
    return response.data.data
  },
}