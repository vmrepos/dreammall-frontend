import type { TMenu, TMenuForm } from "../types/Menu"
import type { TProduct, TProductForm } from "../types/Product"
import { axiosInstance } from "./apiClient"

export const MenusAPI = {
  list: async (): Promise<TMenu[]> => {
    const response = await axiosInstance.get("/restaurants/menus")
    return response.data.data
  },
  show: async (id: number) => {
    const response = await axiosInstance.get(`/restaurants/menus/${id}`)
    return response.data.data
  },
  create: async (menu: TMenuForm): Promise<TMenu> => {
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
    const response = await axiosInstance.patch(`/restaurants/menus/${id}`, menu)
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
      const response = await axiosInstance.put(`/restaurants/menus/${menuId}/products/${productId}`, product)
      return response.data.data
    },
    destroy: async (productId: number) => {
      const response = await axiosInstance.delete(`/restaurants/menus/${menuId}/products/${productId}`)
      return response.data.data
    },
  }),
}