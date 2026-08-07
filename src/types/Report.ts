import type { TDeliveryStatus } from "./Delivery"
import type { TOrderStatus } from "./Order"

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
  credits_spent: number
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
