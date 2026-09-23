import type { TProduct, TProductForm } from "../types/Product"
import { axiosInstance } from "./apiClient"
import { DirectUploadsAPI } from "./directUploads"

const toProductBody = async (product: TProductForm) => {
  const { image, ...rest } = product
  const body: Record<string, unknown> = { ...rest }

  if (image instanceof File) {
    const blob = await DirectUploadsAPI.upload(image, "products")
    body.image = blob.signed_id
  } else if (image === null) {
    body.image = ""
  }

  return body
}

export const ProductsAPI = {
  create: async (menuId: number, product: TProductForm): Promise<TProduct> => {
    const response = await axiosInstance.post(`/restaurants/menus/${menuId}/products`, {
      product: await toProductBody(product),
    })
    return response.data.data as TProduct
  },
  update: async (menuId: number, productId: number, product: TProductForm): Promise<TProduct> => {
    const response = await axiosInstance.patch(
      `/restaurants/menus/${menuId}/products/${productId}`,
      { product: await toProductBody(product) },
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
