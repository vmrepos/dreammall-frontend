import type { TOrder, TOrderForm } from "../types/Order"
import { axiosInstance } from "./apiClient"

export const OrdersAPI = {
  list: async () => {
    const response = await axiosInstance.get("/restaurants/orders")
    return response.data
  },
  create: async (input: TOrderForm): Promise<TOrder> => {
    const response = await axiosInstance.post("/restaurants/orders", input)
    return response.data.data as TOrder
  },
  show: async (id: number): Promise<TOrder> => {
    const response = await axiosInstance.get(`/restaurants/orders/${id}`)
    return response.data.data as TOrder
  },
}
