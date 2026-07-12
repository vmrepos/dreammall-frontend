import type { TProduct } from "../types/Product"
import { axiosInstance } from "./apiClient"

export type ProductInput = Pick<TProduct, "name" | "description" | "price" | "active" | "combo">

export const ProductsAPI = {
  create: async (menuId: number, product: ProductInput) => {
    const response = await axiosInstance.post(`/restaurants/menus/${menuId}/products`, {
      product,
    })
    return response.data.data as TProduct
  },
  update: async (menuId: number, productId: number, product: ProductInput) => {
    const response = await axiosInstance.patch(
      `/restaurants/menus/${menuId}/products/${productId}`,
      { product },
    )
    return response.data.data as TProduct
  },
  destroy: async (menuId: number, productId: number) => {
    await axiosInstance.delete(`/restaurants/menus/${menuId}/products/${productId}`)
  },
  toggle: async (menuId: number, productId: number) => {
    const response = await axiosInstance.patch(
      `/restaurants/menus/${menuId}/products/${productId}/toggle`,
    )
    return response.data.data as TProduct
  },
}
