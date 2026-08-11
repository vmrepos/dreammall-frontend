import type {
  TReport,
  TReportDateRange,
  TReportDeliveryRow,
  TReportOrderRow,
  TReportPeriodPreset,
} from "../types/Report"
import { axiosInstance } from "./apiClient"

type OverviewParams = {
  period?: TReportPeriodPreset
}

export const ReportsAPI = {
  /**
   * Dashboard snapshot for the selected window vs the previous window of the same length.
   * `GET /restaurants/report?period=day|week|month` (default: month)
   */
  overview: async (params: OverviewParams = {}): Promise<TReport> => {
    const response = await axiosInstance.get("/restaurants/reports", {
      params: { period: params.period ?? "month" },
    })
    return response.data.data
  },

  /**
   * Orders in a date range (inclusive calendar dates, restaurant timezone on the API).
   * `GET /restaurants/report/orders?from=YYYY-MM-DD&to=YYYY-MM-DD`
   */
  orders: async (range: TReportDateRange): Promise<TReportOrderRow[]> => {
    const response = await axiosInstance.get("/restaurants/reports/orders", {
      params: { from: range.from, to: range.to },
    })
    return response.data.data
  },

  /**
   * Deliveries in a date range.
   * `GET /restaurants/report/deliveries?from=YYYY-MM-DD&to=YYYY-MM-DD`
   */
  deliveries: async (range: TReportDateRange): Promise<TReportDeliveryRow[]> => {
    const response = await axiosInstance.get("/restaurants/reports/deliveries", {
      params: { from: range.from, to: range.to },
    })
    return response.data.data
  },
}
