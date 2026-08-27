import { useCallback, useState } from "react"
import axios from "axios"
import { toast } from "sonner"
import { faCreditCard } from "@fortawesome/free-solid-svg-icons"
import { Card } from "../../../components/atoms/Card"
import { PageHeader } from "../../../components/molecules/PageHeader"
import { useAuth } from "../../../context/AuthContext"
import { useSubscription } from "../../../context/SubscriptionContext"
import type { TCreditPurchase } from "../../../types/CreditPurchase"
import type { TSubscriptionPlan } from "../../../types/Subscription"
import { PlanCard } from "./PlanCard"
import { PurchaseDialog } from "./PurchaseDialog"
import { PurchasesList } from "./PurchasesList"

const apiErrorMessage = (error: unknown, fallback: string) => {
  if (!axios.isAxiosError(error)) return fallback
  const body = error.response?.data?.error
  if (Array.isArray(body)) return body.join(". ")
  if (typeof body === "string" && body.trim()) return body
  return fallback
}

export const Page = () => {
  const { refreshRestaurant } = useAuth()
  const {
    credits,
    plans,
    purchases,
    loading,
    purchasingId,
    purchasePlan,
    refreshPurchase,
    reloadPurchases,
  } = useSubscription()
  const [planToPurchase, setPlanToPurchase] = useState<TSubscriptionPlan | null>(null)
  const [activePurchase, setActivePurchase] = useState<TCreditPurchase | null>(null)
  const [startError, setStartError] = useState("")

  const handleSelectPlan = async (plan: TSubscriptionPlan) => {
    setPlanToPurchase(plan)
    setActivePurchase(null)
    setStartError("")

    try {
      const purchase = await purchasePlan(plan.id)
      setActivePurchase(purchase)
    } catch (error) {
      setStartError(apiErrorMessage(error, "No se pudo generar el QR. Inténtalo de nuevo."))
    }
  }

  const handleClose = () => {
    setPlanToPurchase(null)
    setActivePurchase(null)
    setStartError("")
  }

  const handlePaid = useCallback(async (_purchase: TCreditPurchase) => {
    toast.success("Pago confirmado. Tus entregas ya fueron acreditadas.")
    await Promise.all([refreshRestaurant(), reloadPurchases()])
    setPlanToPurchase(null)
    setActivePurchase(null)
  }, [refreshRestaurant, reloadPurchases])

  const handleFailed = useCallback(async (_purchase: TCreditPurchase) => {
    toast.error("El pago fue cancelado o expiró. Intenta con otro QR.")
    await reloadPurchases()
    setPlanToPurchase(null)
    setActivePurchase(null)
  }, [reloadPurchases])

  return (
    <div className="mx-auto max-w-screen-2xl">
      <PageHeader
        icon={faCreditCard}
        section="Cuenta"
        title="Mi suscripción"
        description="Compra paquetes de entregas prepago para tu restaurante."
      />

      <Card padding="md" className="mb-6 border border-brand/20 bg-brand-light/30">
        <p className="text-sm font-semibold uppercase tracking-wide text-brand">Créditos disponibles</p>
        <p className="mt-1 text-3xl font-bold text-gray-900">{credits}</p>
        <p className="mt-1 text-sm text-gray-600">entregas disponibles</p>
      </Card>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3 xl:items-start">
        <div className="xl:col-span-2">
          {loading ? (
            <p className="text-sm text-gray-500">Cargando paquetes...</p>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              {plans.map((plan) => (
                <PlanCard
                  key={plan.id}
                  plan={plan}
                  purchasing={purchasingId === plan.id}
                  onSelect={() => { void handleSelectPlan(plan) }}
                />
              ))}
            </div>
          )}
        </div>

        <section className="xl:sticky xl:top-6">
          <h2 className="mb-4 text-lg font-bold text-gray-900">Historial de compras</h2>
          {loading ? (
            <p className="text-sm text-gray-500">Cargando historial...</p>
          ) : (
            <PurchasesList purchases={purchases} />
          )}
        </section>
      </div>

      <PurchaseDialog
        plan={planToPurchase}
        purchase={activePurchase}
        starting={purchasingId !== null}
        startError={startError}
        onClose={handleClose}
        onPoll={refreshPurchase}
        onPaid={handlePaid}
        onFailed={handleFailed}
      />
    </div>
  )
}
