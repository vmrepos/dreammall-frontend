import type { TOrder, TOrderForm, TOrderStatus } from "../types/Order"
import { axiosInstance } from "./apiClient"

const toCreatePayload = (input: TOrderForm) => {
  const { coordinates: _coordinates, items_attributes, ...rest } = input

  return {
    order: {
      ...rest,
      items_attributes: items_attributes.map(
        ({ product_id, name, quantity, unit_price, order_item_options }) => ({
          product_id,
          product_name: name,
          quantity,
          unit_price,
          order_item_options_attributes: order_item_options.map(
            ({ option_group_name, option_name, price_modifier }) => ({
              option_group_name,
              option_name,
              price_modifier,
            }),
          ),
        }),
      ),
    },
  }
}

export const OrdersAPI = {
  list: async () => {
    const response = await axiosInstance.get("/restaurants/orders")
    return response.data
  },
  create: async (input: TOrderForm): Promise<TOrder> => {
    const response = await axiosInstance.post("/restaurants/orders", toCreatePayload(input))
    return response.data.data as TOrder
  },
  show: async (id: number): Promise<TOrder> => {
    const response = await axiosInstance.get(`/restaurants/orders/${id}`)
    return response.data.data as TOrder
  },
  update: async (id: number, status: TOrderStatus, cancelReason?: string): Promise<TOrder> => {
    const response = await axiosInstance.patch(`/restaurants/orders/${id}`, {
      order: {
        status,
        ...(cancelReason ? { cancel_reason: cancelReason } : {}),
      },
    })
    return response.data.data as TOrder
  },
}
