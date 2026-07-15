import type { TOrder, TOrderForm, TOrderStatus } from "../types/Order"
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
  update: async (id: number, status: TOrderStatus): Promise<TOrder> => {
    const response = await axiosInstance.patch(`/restaurants/orders/${id}`, {
      order: { status },
    })
    return response.data.data as TOrder
  },
}
