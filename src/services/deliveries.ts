import type { TDelivery } from "../types/Delivery"
import { axiosInstance } from "./apiClient"

export type DeliveryPreview = {
  fee: number | string
  distance_km: number | string
}

export const DeliveriesAPI = {
  list: async () => {
    const response = await axiosInstance.get("/restaurants/deliveries")
    return response.data.data
  },
  show: async (id: number) => {
    const response = await axiosInstance.get(`/restaurants/deliveries/${id}`)
    return response.data.data
  },
  preview: async (latitude: number, longitude: number): Promise<DeliveryPreview> => {
    const response = await axiosInstance.post("/restaurants/deliveries/preview", {
      delivery: { latitude, longitude },
    })
    return response.data.data as DeliveryPreview
  },
  confirmReturn: async (id: number): Promise<TDelivery> => {
    const response = await axiosInstance.patch(`/restaurants/deliveries/${id}/confirm_return`)
    return response.data.data as TDelivery
  },
  create: async (orderId: number): Promise<TDelivery> => {
    const response = await axiosInstance.post("/restaurants/deliveries", { order_id: orderId })
    return response.data.data as TDelivery
  },
}