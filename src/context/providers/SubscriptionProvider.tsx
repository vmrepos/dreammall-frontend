import { type ReactNode, useState, useEffect, useCallback } from "react"
import { apiClient } from "../../services/apiClient"
import type { TCreditPurchase } from "../../types/CreditPurchase"
import type { TSubscriptionPlan } from "../../types/Subscription"
import { useAuth } from "../AuthContext"
import { SubscriptionContext } from "../SubscriptionContext"

export const SubscriptionProvider = ({ children }: { children: ReactNode }) => {
  const { restaurant } = useAuth()
  const [plans, setPlans] = useState<TSubscriptionPlan[]>([])
  const [purchases, setPurchases] = useState<TCreditPurchase[]>([])
  const [loading, setLoading] = useState(true)
  const [purchasingId, setPurchasingId] = useState<number | null>(null)

  const loadPurchases = useCallback(async () => {
    const data = await apiClient.subscriptions.listPurchases()
    setPurchases(data)
  }, [])

  useEffect(() => {
    let cancelled = false

    const load = async () => {
      setLoading(true)
      try {
        const [planData, purchaseData] = await Promise.all([
          apiClient.subscriptions.list(),
          apiClient.subscriptions.listPurchases(),
        ])
        if (cancelled) return
        setPlans(planData)
        setPurchases(purchaseData)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    void load()
    return () => {
      cancelled = true
    }
  }, [])

  const purchasePlan = async (subscriptionId: number, proof: File) => {
    setPurchasingId(subscriptionId)
    try {
      await apiClient.subscriptions.purchase(subscriptionId, proof)
      await loadPurchases()
    } finally {
      setPurchasingId(null)
    }
  }

  return (
    <SubscriptionContext.Provider
      value={{
        credits: restaurant?.credits ?? 0,
        plans,
        purchases,
        loading,
        purchasingId,
        purchasePlan,
      }}
    >
      {children}
    </SubscriptionContext.Provider>
  )
}
