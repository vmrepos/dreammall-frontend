import type { TMenu } from "../types/Menu"
import { axiosInstance } from "./apiClient"

export const MenusAPI = {
  list: async () => {
    const response = await axiosInstance.get("/restaurants/menus")
    return response.data.data
  },
  show: async (id: number) => {
    const response = await axiosInstance.get(`/restaurants/menus/${id}`)
    return response.data.data
  },
  create: async (menu: TMenu) => {
    const response = await axiosInstance.post("/restaurants/menus", menu)
    return response.data.data
  },
}