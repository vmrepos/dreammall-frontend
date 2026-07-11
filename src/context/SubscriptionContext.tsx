import { createContext, useContext, useState, type ReactNode } from "react"
import { getSubscriptionPlan, initialSubscription, subscriptionPlans } from "../mocks/subscription"
import type { TSubscription, TSubscriptionPlan, TSubscriptionPlanId } from "../types/Subscription"

type SubscriptionContextType = {
  subscription: TSubscription
  plans: TSubscriptionPlan[]
  currentPlan: TSubscriptionPlan | undefined
  selectPlan: (planId: TSubscriptionPlanId) => void
}

const SubscriptionContext = createContext<SubscriptionContextType | null>(null)

export const SubscriptionProvider = ({ children }: { children: ReactNode }) => {
  const [subscription, setSubscription] = useState<TSubscription>(initialSubscription)

  const currentPlan = subscription.planId ? getSubscriptionPlan(subscription.planId) : undefined

  const selectPlan = (planId: TSubscriptionPlanId) => {
    const plan = getSubscriptionPlan(planId)
    if (!plan) return

    if (plan.billingType === "postpaid") {
      setSubscription({
        planId,
        creditsRemaining: null,
        creditsTotal: null,
      })
      return
    }

    setSubscription({
      planId,
      creditsRemaining: plan.deliveryCredits,
      creditsTotal: plan.deliveryCredits,
    })
  }

  return (
    <SubscriptionContext.Provider
      value={{ subscription, plans: subscriptionPlans, currentPlan, selectPlan }}
    >
      {children}
    </SubscriptionContext.Provider>
  )
}

export const useSubscription = () => {
  const context = useContext(SubscriptionContext)
  if (!context) {
    throw new Error("useSubscription must be used within SubscriptionProvider")
  }

  return context
}
