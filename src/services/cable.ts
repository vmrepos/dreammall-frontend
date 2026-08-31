import { createConsumer, type Consumer, type Subscription } from "@rails/actioncable"

const apiHttpBase = () => (import.meta.env.VITE_API_URL ?? "").replace(/\/$/, "")

export const getCableUrl = () => {
  const httpBase = apiHttpBase()
  if (!httpBase) {
    throw new Error("VITE_API_URL is required for Action Cable")
  }
  const wsBase = httpBase.replace(/^http/, "ws")
  return `${wsBase}/cable`
}

export type RestaurantsChannelHandle = {
  consumer: Consumer
  subscription: Subscription
  disconnect: () => void
}

export type RestaurantsChannelMessage = {
  type: string
  message?: unknown
  order?: unknown
}

/**
 * Subscribe to the restaurant owner's live channel.
 * Auth uses the signed HttpOnly access_token cookie (same session as the API).
 */
export function subscribeRestaurantsChannel(onReceived: (data: RestaurantsChannelMessage) => void): RestaurantsChannelHandle {
  const consumer = createConsumer(getCableUrl())

  const subscription = consumer.subscriptions.create(
    { channel: "RestaurantsChannel" },
    {
      received(data: RestaurantsChannelMessage) {
        onReceived(data)
      },
    },
  )

  return {
    consumer,
    subscription,
    disconnect: () => {
      subscription.unsubscribe()
      consumer.disconnect()
    },
  }
}
