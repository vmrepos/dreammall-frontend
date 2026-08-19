import type { TSubscriptionPlan } from "../types/Subscription"
import type { TCreditPurchase } from "../types/CreditPurchase"
import { axiosInstance } from "./axiosInstance"
import { DirectUploadsAPI } from "./directUploads"

export const SubscriptionsAPI = {
  list: async (): Promise<TSubscriptionPlan[]> => {
    const response = await axiosInstance.get("/restaurants/subscriptions")
    return response.data.data
  },

  listPurchases: async (): Promise<TCreditPurchase[]> => {
    const response = await axiosInstance.get("/restaurants/purchases")
    return response.data.data
  },

  purchase: async (subscriptionId: number, proof: File): Promise<TCreditPurchase> => {
    const blob = await DirectUploadsAPI.upload(proof, "payments")
    const response = await axiosInstance.post("/restaurants/purchases", {
      subscription_id: subscriptionId,
      proof: blob.signed_id,
    })
    return response.data.data
  },
}
