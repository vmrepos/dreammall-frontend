import { createContext, useContext } from "react"
import type { TCreditPurchase } from "../types/CreditPurchase"
import type { TSubscriptionPlan } from "../types/Subscription"

type SubscriptionContextType = {
  credits: number
  plans: TSubscriptionPlan[]
  purchases: TCreditPurchase[]
  loading: boolean
  purchasingId: number | null
  purchasePlan: (subscriptionId: number, proof: File) => Promise<void>
}

export const SubscriptionContext = createContext<SubscriptionContextType | null>(null)

export const useSubscription = () => {
  const context = useContext(SubscriptionContext)
  if (!context) {
    throw new Error("useSubscription must be used within SubscriptionProvider")
  }

  return context
}
