import type { TReport } from "../types/Report"
import { axiosInstance } from "./apiClient"

export const ReportsAPI = {
  get: async (): Promise<TReport> => {
    const response = await axiosInstance.get("/restaurants/report")
    return response.data.data
  },
}
