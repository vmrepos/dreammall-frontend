import axios from "axios"
import type { TPublicOrder, TPublicOrderCompletePayload, TPublicOrderPaymentPayload } from "../types/PublicOrder"

export const publicClient = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL ?? ""}/api/v1`,
  withCredentials: false,
})

type TPublicOrderWire = TPublicOrder

export const toPublicOrder = (raw: TPublicOrderWire): TPublicOrder => ({
  ...raw,
  items: raw.items ?? [],
  payment_method: raw.payment_method === "cash" || raw.payment_method === "qr" ? raw.payment_method : null,
  change_for: raw.change_for != null ? Number(raw.change_for) : null,
  completed_by_restaurant: Boolean(raw.completed_by_restaurant),
})

export const PublicOrdersAPI = {
  show: async (publicToken: string): Promise<TPublicOrder> => {
    const response = await publicClient.get(`/public/orders/${publicToken}`)
    return toPublicOrder(response.data.data as TPublicOrderWire)
  },
  complete: async (
    publicToken: string,
    input: TPublicOrderCompletePayload | TPublicOrderPaymentPayload,
  ): Promise<TPublicOrder> => {
    const response = await publicClient.patch(`/public/orders/${publicToken}`, input)
    const quoted = response.data?.data as TPublicOrderWire | undefined
    if (quoted) return toPublicOrder(quoted)
    return PublicOrdersAPI.show(publicToken)
  },
}
