import type { TOrder, TOrderForm } from "../types/Order"
import { axiosInstance } from "./apiClient"

export const OrdersAPI = {
  list: async () => {
    const response = await axiosInstance.get("/restaurants/orders")
    return response.data
  },
  create: async (input: TOrderForm): Promise<TOrder> => {
    const response = await axiosInstance.post("/restaurants/orders", {
      order: {
        total_amount: input.total_amount,
        discount: input.discount,
        delivery_fee: input.delivery_fee,
        latitude: input.latitude,
        longitude: input.longitude,
        items_attributes: input.items_attributes.map(({ name, notes: _notes, ...item }) => ({
          ...item,
          product_name: name,
        })),
      },
    })
    return response.data.data as TOrder
  },
  show: async (id: number): Promise<TOrder> => {
    const response = await axiosInstance.get(`/restaurants/orders/${id}`)
    return response.data.data as TOrder
  },
}
