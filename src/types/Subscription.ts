export type TSubscriptionPlanId = "small" | "medium" | "large" | "postpaid"

export type TSubscriptionPlan = {
  id: TSubscriptionPlanId
  name: string
  description: string
  deliveryCredits: number | null
  price: string
  billingType: "prepaid" | "postpaid"
}

export type TSubscription = {
  planId: TSubscriptionPlanId | null
  creditsRemaining: number | null
  creditsTotal: number | null
}
