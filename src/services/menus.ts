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
    // When an image is attached, send multipart/form-data so the backend
    // can receive the file. Keys must be nested under `menu[...]` because
    // Rails' wrap_parameters only auto-wraps JSON bodies, not multipart.
    if (menu.image) {
      const formData = new FormData()
      if (menu.name != null) formData.append("menu[name]", menu.name)
      if (menu.active != null) formData.append("menu[active]", String(menu.active))
      formData.append("menu[image]", menu.image)

      const response = await axiosInstance.post("/restaurants/menus", formData)
      return response.data.data
    }

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