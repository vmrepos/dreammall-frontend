import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { useAuth } from "./AuthContext"
import { apiClient } from "../services/apiClient"
import type { TSubscriptionPlan } from "../types/Subscription"

type SubscriptionContextType = {
  credits: number
  plans: TSubscriptionPlan[]
  loading: boolean
  purchasingId: number | null
  purchasePlan: (subscriptionId: number) => Promise<void>
}

const SubscriptionContext = createContext<SubscriptionContextType | null>(null)

export const SubscriptionProvider = ({ children }: { children: ReactNode }) => {
  const { restaurant, refreshRestaurant } = useAuth()
  const [plans, setPlans] = useState<TSubscriptionPlan[]>([])
  const [loading, setLoading] = useState(true)
  const [purchasingId, setPurchasingId] = useState<number | null>(null)

  useEffect(() => {
    let cancelled = false

    const loadPlans = async () => {
      setLoading(true)
      try {
        const data = await apiClient.subscriptions.list()
        if (!cancelled) setPlans(data)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    void loadPlans()
    return () => {
      cancelled = true
    }
  }, [])

  const purchasePlan = async (subscriptionId: number) => {
    setPurchasingId(subscriptionId)
    try {
      await apiClient.subscriptions.purchase(subscriptionId)
      await refreshRestaurant()
    } finally {
      setPurchasingId(null)
    }
  }

  return (
    <SubscriptionContext.Provider
      value={{
        credits: restaurant?.credits ?? 0,
        plans,
        loading,
        purchasingId,
        purchasePlan,
      }}
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
