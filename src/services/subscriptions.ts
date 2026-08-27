import type { TSubscriptionPlan } from "../types/Subscription"
import type { TCreditPurchase } from "../types/CreditPurchase"
import { axiosInstance } from "./axiosInstance"

export const SubscriptionsAPI = {
  list: async (): Promise<TSubscriptionPlan[]> => {
    const response = await axiosInstance.get("/restaurants/subscriptions")
    return response.data.data
  },

  listPurchases: async (): Promise<TCreditPurchase[]> => {
    const response = await axiosInstance.get("/restaurants/purchases")
    return response.data.data
  },

  purchase: async (subscriptionId: number): Promise<TCreditPurchase> => {
    const response = await axiosInstance.post("/restaurants/purchases", {
      subscription_id: subscriptionId,
    })
    return response.data.data
  },

  showPurchase: async (purchaseId: number): Promise<TCreditPurchase> => {
    const response = await axiosInstance.get(`/restaurants/purchases/${purchaseId}`)
    return response.data.data
  },
}
