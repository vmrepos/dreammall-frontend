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

  const purchasePlan = useCallback(async (subscriptionId: number) => {
    setPurchasingId(subscriptionId)
    try {
      const purchase = await apiClient.subscriptions.purchase(subscriptionId)
      await loadPurchases()
      return purchase
    } finally {
      setPurchasingId(null)
    }
  }, [loadPurchases])

  const refreshPurchase = useCallback(async (purchaseId: number) => {
    const purchase = await apiClient.subscriptions.showPurchase(purchaseId)
    setPurchases((current) => {
      const index = current.findIndex((row) => row.id === purchase.id)
      if (index === -1) return [purchase, ...current]
      const next = [...current]
      next[index] = purchase
      return next
    })
    return purchase
  }, [])

  return (
    <SubscriptionContext.Provider
      value={{
        credits: restaurant?.credits ?? 0,
        plans,
        purchases,
        loading,
        purchasingId,
        purchasePlan,
        refreshPurchase,
        reloadPurchases: loadPurchases,
      }}
    >
      {children}
    </SubscriptionContext.Provider>
  )
}
