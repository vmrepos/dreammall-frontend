import { useState } from "react"
import axios from "axios"
import { toast } from "sonner"
import { faCreditCard } from "@fortawesome/free-solid-svg-icons"
import { Card } from "../../../components/atoms/Card"
import { PageHeader } from "../../../components/molecules/PageHeader"
import { useSubscription } from "../../../context/SubscriptionContext"
import type { TSubscriptionPlan } from "../../../types/Subscription"
import { PlanCard } from "./PlanCard"
import { PurchaseDialog } from "./PurchaseDialog"
import { PurchasesList } from "./PurchasesList"

export const Page = () => {
  const { credits, plans, purchases, loading, purchasingId, purchasePlan } = useSubscription()
  const [planToPurchase, setPlanToPurchase] = useState<TSubscriptionPlan | null>(null)

  const handleSubmitProof = async (proof: File) => {
    if (!planToPurchase) return

    try {
      await purchasePlan(planToPurchase.id, proof)
      toast.success("Comprobante enviado. Validaremos el pago y acreditaremos tus entregas.")
      setPlanToPurchase(null)
    } catch (error) {
      const message = axios.isAxiosError(error)
        ? Array.isArray(error.response?.data?.error)
          ? error.response.data.error.join(". ")
          : error.response?.data?.error
        : null
      toast.error(message || "No se pudo enviar el comprobante. Inténtalo de nuevo.")
    }
  }

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
                  onSelect={() => setPlanToPurchase(plan)}
                />
              ))}
            </div>
          )}
        </div>

        <section className="xl:sticky xl:top-6">
          <h2 className="mb-4 text-lg font-bold text-gray-900">Comprobantes enviados</h2>
          {loading ? (
            <p className="text-sm text-gray-500">Cargando comprobantes...</p>
          ) : (
            <PurchasesList purchases={purchases} />
          )}
        </section>
      </div>

      <PurchaseDialog
        plan={planToPurchase}
        submitting={purchasingId !== null}
        onClose={() => setPlanToPurchase(null)}
        onSubmit={handleSubmitProof}
      />
    </div>
  )
}
