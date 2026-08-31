import type { TDeliveryStatus } from "./Delivery"
import type { TOrderStatus } from "./Order"

/** Overview comparison window sent as `?period=` */
export type TReportPeriodPreset = "day" | "week" | "month"

export type TReportDateRange = {
  from: string
  to: string
}

export type TReportPeriod = {
  start: string
  end: string
}

export type TReportSalesBucket = {
  count: number
  total_amount: string | number
}

export type TReportSales = {
  current: TReportSalesBucket
  previous: TReportSalesBucket
}

export type TReportOrders = {
  total: number
  by_status: Partial<Record<TOrderStatus | string, number>>
}

export type TReportProduct = {
  name: string
  quantity: number
}

export type TReportDeliveries = {
  total: number
  by_status: Partial<Record<TDeliveryStatus | string, number>>
}

export type TReport = {
  period: {
    current: TReportPeriod
    previous: TReportPeriod
  }
  sales: TReportSales
  orders: TReportOrders
  products: TReportProduct[]
  deliveries: TReportDeliveries
}

/** Lean row for the report Orders table (`GET …/report/orders`). */
export type TReportOrderRow = {
  id: number
  created_at: string
  status: TOrderStatus
  total_amount: string | number
}

/** Lean row for the report Deliveries table (`GET …/report/deliveries`). */
export type TReportDeliveryRow = {
  id: number
  created_at: string
  order_id: number | null
  shipment_id: number | null
  source_type: "order" | "shipment"
  status: TDeliveryStatus
  driver: { id: number; name: string } | null
}
