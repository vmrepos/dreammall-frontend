import { axiosInstance } from "./apiClient"

export const DeliveriesAPI = {

  list: async () => {
    const response = await axiosInstance.get("/restaurants/deliveries")
    return response.data.data
  },
  show: async (id: number) => {
    const response = await axiosInstance.get(`/restaurants/deliveries/${id}`)
    return response.data.data
  },

}