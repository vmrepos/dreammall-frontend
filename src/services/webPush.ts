import { axiosInstance } from "./axiosInstance"

export type TWebPushConfig = {
  vapid_public_key: string
}

export type TWebPushSubscription = {
  id: number
  endpoint: string
}

export const WebPushAPI = {
  config: async (): Promise<TWebPushConfig> => {
    const response = await axiosInstance.get<{ data: TWebPushConfig }>("/restaurants/web_push")
    return response.data.data
  },
  upsert: async (subscription: PushSubscriptionJSON): Promise<TWebPushSubscription> => {
    const response = await axiosInstance.put<{ data: TWebPushSubscription }>(
      "/restaurants/web_push",
      subscription,
    )
    return response.data.data
  },
  remove: async (endpoint: string): Promise<void> => {
    await axiosInstance.delete("/restaurants/web_push", { params: { endpoint } })
  },
}
