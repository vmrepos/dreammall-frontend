import type { TDelivery } from "../types/Delivery"
import type { TShipmentFormValues } from "../types/Shipment"
import { toDelivery } from "./deliveries"
import { axiosInstance } from "./axiosInstance"

export type ShipmentPreview = {
  fee: number | string
  distance_km: number | string
}

export const ShipmentsAPI = {
  preview: async (values: TShipmentFormValues): Promise<ShipmentPreview> => {
    const response = await axiosInstance.post("/restaurants/shipments/preview", {
      shipment: values,
    })
    return response.data.data as ShipmentPreview
  },
  create: async (values: TShipmentFormValues): Promise<TDelivery> => {
    const response = await axiosInstance.post("/restaurants/shipments", {
      shipment: values,
    })
    return toDelivery(response.data.data)
  },
  list: async () => {
    const response = await axiosInstance.get("/restaurants/shipments", {
      params: { per_page: 50 },
    })
    return response.data.data
  },
  show: async (id: number) => {
    const response = await axiosInstance.get(`/restaurants/shipments/${id}`)
    return response.data.data
  },
  retry: async (id: number): Promise<TDelivery> => {
    const response = await axiosInstance.post(`/restaurants/shipments/${id}/retry`)
    return toDelivery(response.data.data)
  },
}
