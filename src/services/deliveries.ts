import type { TDelivery, TDeliveryStatus } from "../types/Delivery"
import { axiosInstance } from "./apiClient"

type TDeliveryWire = Omit<TDelivery, "status" | "driving_back_at"> & {
  status: string
  driving_back_at?: string | null
  absent_customer_at?: string | null
}

export const toDelivery = (raw: TDeliveryWire): TDelivery => {
  const { absent_customer_at, driving_back_at, status, ...rest } = raw
  return {
    ...rest,
    status: (status === "absent_customer" ? "driving_back" : status) as TDeliveryStatus,
    driving_back_at: driving_back_at ?? absent_customer_at ?? null,
  }
}

export type DeliveryPreview = {
  fee: number | string
  distance_km: number | string
}

export const DeliveriesAPI = {
  list: async () => {
    const response = await axiosInstance.get("/restaurants/deliveries", {
      params: { per_page: 50 },
    })
    return (response.data.data as TDeliveryWire[]).map(toDelivery)
  },
  show: async (id: number) => {
    const response = await axiosInstance.get(`/restaurants/deliveries/${id}`)
    return toDelivery(response.data.data as TDeliveryWire)
  },
  preview: async (latitude: number, longitude: number): Promise<DeliveryPreview> => {
    const response = await axiosInstance.post("/restaurants/deliveries/preview", {
      delivery: { latitude, longitude },
    })
    return response.data.data as DeliveryPreview
  },
  confirmReturn: async (id: number): Promise<TDelivery> => {
    const response = await axiosInstance.patch(`/restaurants/deliveries/${id}/confirm_return`)
    return toDelivery(response.data.data as TDeliveryWire)
  },
  create: async (orderId: number): Promise<TDelivery> => {
    const response = await axiosInstance.post("/restaurants/deliveries", { order_id: orderId })
    return toDelivery(response.data.data as TDeliveryWire)
  },
  cancel: async (id: number): Promise<TDelivery> => {
    const response = await axiosInstance.patch(`/restaurants/deliveries/${id}/cancel`)
    return toDelivery(response.data.data as TDeliveryWire)
  },
}