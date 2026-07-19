import type { TProduct, TProductForm } from "../types/Product"
import { axiosInstance } from "./apiClient"



export const ProductsAPI = {
  create: async (menuId: number, product: TProductForm): Promise<TProduct> => {
    const response = await axiosInstance.post(`/restaurants/menus/${menuId}/products`, {
      product: product,
    })
    return response.data.data as TProduct
  },
  update: async (menuId: number, productId: number, product: Partial<TProduct>): Promise<TProduct> => {
    const response = await axiosInstance.patch(
      `/restaurants/menus/${menuId}/products/${productId}`,
      { product },
    )
    return response.data.data as TProduct
  },

  destroy: async (menuId: number, productId: number): Promise<void> => {
    await axiosInstance.delete(`/restaurants/menus/${menuId}/products/${productId}`)
  },

  toggle: async (menuId: number, productId: number): Promise<TProduct> => {
    const response = await axiosInstance.patch(
      `/restaurants/menus/${menuId}/products/${productId}/toggle`,
    )
    return response.data.data as TProduct
  },
}
