import type { TSubscriptionPlan } from "../types/Subscription"
import type { TRestaurant } from "../types/Restaurant"
import { axiosInstance } from "./apiClient"

export const SubscriptionsAPI = {
  list: async (): Promise<TSubscriptionPlan[]> => {
    const response = await axiosInstance.get("/restaurants/subscriptions")
    return response.data.data
  },

  purchase: async (subscriptionId: number): Promise<TRestaurant> => {
    const response = await axiosInstance.post("/restaurants/purchases", {
      subscription_id: subscriptionId,
    })
    return response.data.data
  },
}
