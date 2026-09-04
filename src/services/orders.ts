import type { TOrder, TOrderForm, TOrderStatus } from "../types/Order"
import { axiosInstance } from "./apiClient"
import { toDelivery } from "./deliveries"

type TOrderWire = Omit<TOrder, "status" | "delivery" | "coupon"> & {
  status: string
  delivery: Parameters<typeof toDelivery>[0] | null
  coupon: TOrder["coupon"]
}

export const toOrder = (raw: TOrderWire): TOrder => {
  const delivery = raw.delivery ? toDelivery(raw.delivery) : null
  const status: TOrderStatus =
    raw.status === "absent_customer"
      ? delivery?.status === "driving_back"
        ? "dispatched"
        : "returned"
      : (raw.status as TOrderStatus)

  return {
    ...raw,
    status,
    delivery,
    public_token: raw.public_token ?? null,
    customer_name: raw.customer_name ?? null,
    customer_phone: raw.customer_phone ?? null,
    payment_method: raw.payment_method === "cash" || raw.payment_method === "qr" ? raw.payment_method : null,
    change_for: raw.change_for != null ? Number(raw.change_for) : null,
    completed_by_restaurant: Boolean(raw.completed_by_restaurant),
    coupon: raw.coupon
      ? {
          code: raw.coupon.code,
          amount: Number(raw.coupon.amount),
          applied_amount: Number(raw.coupon.applied_amount),
        }
      : null,
  }
}

const toCreatePayload = (input: TOrderForm) => {
  const { items_attributes, coupon_code, ...rest } = input
  const code = coupon_code?.replace(/\D/g, "") ?? ""

  return {
    order: {
      ...rest,
      ...(code.length === 8 ? { coupon_code: code } : {}),
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
    return {
      ...response.data,
      data: (response.data.data as TOrderWire[]).map(toOrder),
    }
  },
  create: async (input: TOrderForm): Promise<TOrder> => {
    const response = await axiosInstance.post("/restaurants/orders", toCreatePayload(input))
    return toOrder(response.data.data as TOrderWire)
  },
  show: async (id: number): Promise<TOrder> => {
    const response = await axiosInstance.get(`/restaurants/orders/${id}`)
    return toOrder(response.data.data as TOrderWire)
  },
  markPreparing: async (id: number): Promise<TOrder> => {
    const response = await axiosInstance.patch(`/restaurants/orders/${id}/mark_preparing`)
    return toOrder(response.data.data as TOrderWire)
  },
  update: async (id: number, status: TOrderStatus, cancelReason?: string): Promise<TOrder> => {
    const response = await axiosInstance.patch(`/restaurants/orders/${id}`, {
      order: {
        status,
        ...(cancelReason ? { cancel_reason: cancelReason } : {}),
      },
    })
    return toOrder(response.data.data as TOrderWire)
  },
}
