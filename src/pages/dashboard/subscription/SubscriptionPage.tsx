import { useState } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCheck, faCreditCard } from "@fortawesome/free-solid-svg-icons"
import { Button } from "../../../components/atoms/Button"
import { Card } from "../../../components/atoms/Card"
import { ConfirmDialog } from "../../../components/molecules/ConfirmDialog"
import { PageHeader } from "../../../components/molecules/PageHeader"
import { useSubscription } from "../../../context/SubscriptionContext"
import type { TSubscriptionPlan } from "../../../types/Subscription"
import { formatCurrency } from "../../../utils/format"

export const SubscriptionPage = () => {
  const { credits, plans, loading, purchasingId, purchasePlan } = useSubscription()
  const [planToPurchase, setPlanToPurchase] = useState<TSubscriptionPlan | null>(null)

  const handleConfirmPurchase = async () => {
    if (!planToPurchase) return

    try {
      await purchasePlan(planToPurchase.id)
      setPlanToPurchase(null)
    } catch {
      // Keep dialog open so the user can retry or cancel.
    }
  }

  return (
    <div className="mx-auto max-w-6xl">
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

      {loading ? (
        <p className="text-sm text-gray-500">Cargando paquetes...</p>
      ) : (
        <div className="grid grid-cols-2 gap-6">
          {plans.map((plan) => (
            <Card key={plan.id} padding="lg">
              <h3 className="text-lg font-bold text-gray-900">{plan.name}</h3>

              <p className="mt-4 text-3xl font-bold text-gray-900">
                {plan.credits}
                <span className="ml-2 text-base font-medium text-gray-500">entregas</span>
              </p>

              <p className="mt-4 text-sm text-gray-500">
                Pago único de{" "}
                <span className="font-semibold text-gray-900">{formatCurrency(plan.price)}</span>
              </p>

              <ul className="mt-6 space-y-2 text-sm text-gray-600">
                <li className="flex items-center gap-2">
                  <FontAwesomeIcon icon={faCheck} className="size-3.5 text-brand" aria-hidden />
                  {plan.credits} créditos de entrega
                </li>
                <li className="flex items-center gap-2">
                  <FontAwesomeIcon icon={faCheck} className="size-3.5 text-brand" aria-hidden />
                  Válido hasta agotar créditos
                </li>
                <li className="flex items-center gap-2">
                  <FontAwesomeIcon icon={faCheck} className="size-3.5 text-brand" aria-hidden />
                  Recarga cuando lo necesites
                </li>
              </ul>

              <Button
                className="mt-8 w-full"
                disabled={purchasingId === plan.id}
                onClick={() => setPlanToPurchase(plan)}
              >
                Comprar paquete
              </Button>
            </Card>
          ))}
        </div>
      )}

      <ConfirmDialog
        open={planToPurchase !== null}
        title="Confirmar compra"
        message={
          planToPurchase
            ? `¿Deseas comprar el paquete "${planToPurchase.name}" por ${formatCurrency(planToPurchase.price)}? Se agregarán ${planToPurchase.credits} entregas a tu cuenta.`
            : ""
        }
        confirmLabel={purchasingId !== null ? "Comprando..." : "Sí, comprar"}
        confirmVariant="primary"
        confirming={purchasingId !== null}
        onConfirm={handleConfirmPurchase}
        onCancel={() => setPlanToPurchase(null)}
      />
    </div>
  )
}
