import type { TSubscription, TSubscriptionPlan } from "../types/Subscription"

export const subscriptionPlans: TSubscriptionPlan[] = [
  {
    id: "small",
    name: "Pequeño",
    description: "Ideal para comercios con volumen bajo de entregas.",
    deliveryCredits: 100,
    price: "450.00",
    billingType: "prepaid",
  },
  {
    id: "medium",
    name: "Mediano",
    description: "El equilibrio perfecto para restaurantes en crecimiento.",
    deliveryCredits: 200,
    price: "800.00",
    billingType: "prepaid",
  },
  {
    id: "large",
    name: "Grande",
    description: "Para operaciones con alto volumen diario de pedidos.",
    deliveryCredits: 500,
    price: "1800.00",
    billingType: "prepaid",
  },
  {
    id: "postpaid",
    name: "Postpago",
    description: "Entregas ilimitadas para clientes corporativos. Facturación mensual.",
    deliveryCredits: null,
    price: "0.00",
    billingType: "postpaid",
  },
]

export const initialSubscription: TSubscription = {
  planId: "medium",
  creditsRemaining: 147,
  creditsTotal: 200,
}

export const getSubscriptionPlan = (id: TSubscription["planId"]) =>
  subscriptionPlans.find((plan) => plan.id === id)
