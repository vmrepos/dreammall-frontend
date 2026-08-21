import axios from "axios"
import type { TPublicOrder, TPublicOrderCompletePayload } from "../types/PublicOrder"

export const publicClient = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL ?? ""}/api/v1`,
  withCredentials: false,
})

type TPublicOrderWire = TPublicOrder

export const toPublicOrder = (raw: TPublicOrderWire): TPublicOrder => ({
  ...raw,
  items: raw.items ?? [],
})

export const PublicOrdersAPI = {
  show: async (publicToken: string): Promise<TPublicOrder> => {
    const response = await publicClient.get(`/public/orders/${publicToken}`)
    return toPublicOrder(response.data.data as TPublicOrderWire)
  },
  complete: async (publicToken: string, input: TPublicOrderCompletePayload): Promise<TPublicOrder> => {
    const response = await publicClient.patch(`/public/orders/${publicToken}`, input)
    const quoted = response.data?.data as TPublicOrderWire | undefined
    if (quoted) return toPublicOrder(quoted)
    return PublicOrdersAPI.show(publicToken)
  },
}
