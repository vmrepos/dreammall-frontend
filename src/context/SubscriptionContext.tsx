import { createContext, useContext } from "react"
import type { TCreditPurchase } from "../types/CreditPurchase"
import type { TSubscriptionPlan } from "../types/Subscription"

type SubscriptionContextType = {
  credits: number
  plans: TSubscriptionPlan[]
  purchases: TCreditPurchase[]
  loading: boolean
  purchasingId: number | null
  purchasePlan: (subscriptionId: number) => Promise<TCreditPurchase>
  refreshPurchase: (purchaseId: number) => Promise<TCreditPurchase>
  reloadPurchases: () => Promise<void>
}

export const SubscriptionContext = createContext<SubscriptionContextType | null>(null)

export const useSubscription = () => {
  const context = useContext(SubscriptionContext)
  if (!context) {
    throw new Error("useSubscription must be used within SubscriptionProvider")
  }

  return context
}
