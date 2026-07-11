import { useState } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCheck, faCreditCard, faInfinity } from "@fortawesome/free-solid-svg-icons"
import { Badge } from "../../../components/atoms/Badge"
import { Button } from "../../../components/atoms/Button"
import { Card } from "../../../components/atoms/Card"
import { PageHeader } from "../../../components/molecules/PageHeader"
import { useSubscription } from "../../../context/SubscriptionContext"
import type { TSubscriptionPlan } from "../../../types/Subscription"
import { formatCurrency } from "../../../utils/format"

const PlanCredits = ({ plan }: { plan: TSubscriptionPlan }) => {
  if (plan.deliveryCredits === null) {
    return (
      <p className="mt-4 flex items-center gap-2 text-3xl font-bold text-gray-900">
        <FontAwesomeIcon icon={faInfinity} className="size-7 text-brand" aria-hidden />
        Ilimitadas
      </p>
    )
  }

  return (
    <p className="mt-4 text-3xl font-bold text-gray-900">
      {plan.deliveryCredits}
      <span className="ml-2 text-base font-medium text-gray-500">entregas</span>
    </p>
  )
}

export const SubscriptionPage = () => {
  const { subscription, plans, currentPlan, selectPlan } = useSubscription()
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null)

  const handleSelectPlan = async (planId: TSubscriptionPlan["id"]) => {
    setSelectedPlanId(planId)
    await new Promise((resolve) => setTimeout(resolve, 500))
    selectPlan(planId)
    setSelectedPlanId(null)
  }

  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader
        icon={faCreditCard}
        section="Cuenta"
        title="Mi suscripción"
        description="Compra paquetes de entregas prepago o activa el plan postpago para operaciones de alto volumen."
      />

      {currentPlan && (
        <Card padding="md" className="mb-6 border border-brand/20 bg-brand-light/30">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-brand">Plan actual</p>
              <h2 className="mt-1 text-xl font-bold text-gray-900">{currentPlan.name}</h2>
              {subscription.creditsRemaining !== null && subscription.creditsTotal !== null ? (
                <p className="mt-2 text-sm text-gray-600">
                  <span className="font-semibold text-gray-900">{subscription.creditsRemaining}</span> de{" "}
                  {subscription.creditsTotal} entregas disponibles
                </p>
              ) : (
                <p className="mt-2 text-sm text-gray-600">Entregas ilimitadas · facturación mensual</p>
              )}
            </div>
            <Badge variant="brand">{currentPlan.billingType === "postpaid" ? "Postpago" : "Prepago"}</Badge>
          </div>
        </Card>
      )}

      <div className="grid grid-cols-2 gap-6">
        {plans.map((plan) => {
          const isCurrent = subscription.planId === plan.id
          const isPostpaid = plan.billingType === "postpaid"

          return (
            <Card
              key={plan.id}
              padding="lg"
              className={isCurrent ? "ring-2 ring-brand ring-offset-2" : undefined}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">{plan.name}</h3>
                  <p className="mt-1 text-sm text-gray-500">{plan.description}</p>
                </div>
                {isCurrent && <Badge variant="success">Activo</Badge>}
              </div>

              <PlanCredits plan={plan} />

              <p className="mt-4 text-sm text-gray-500">
                {isPostpaid ? (
                  "Tarifa por entrega al cierre del mes"
                ) : (
                  <>
                    Pago único de{" "}
                    <span className="font-semibold text-gray-900">{formatCurrency(plan.price)}</span>
                  </>
                )}
              </p>

              <ul className="mt-6 space-y-2 text-sm text-gray-600">
                {isPostpaid ? (
                  <>
                    <li className="flex items-center gap-2">
                      <FontAwesomeIcon icon={faCheck} className="size-3.5 text-brand" aria-hidden />
                      Sin límite de entregas
                    </li>
                    <li className="flex items-center gap-2">
                      <FontAwesomeIcon icon={faCheck} className="size-3.5 text-brand" aria-hidden />
                      Soporte prioritario
                    </li>
                    <li className="flex items-center gap-2">
                      <FontAwesomeIcon icon={faCheck} className="size-3.5 text-brand" aria-hidden />
                      Facturación mensual consolidada
                    </li>
                  </>
                ) : (
                  <>
                    <li className="flex items-center gap-2">
                      <FontAwesomeIcon icon={faCheck} className="size-3.5 text-brand" aria-hidden />
                      {plan.deliveryCredits} créditos de entrega
                    </li>
                    <li className="flex items-center gap-2">
                      <FontAwesomeIcon icon={faCheck} className="size-3.5 text-brand" aria-hidden />
                      Válido hasta agotar créditos
                    </li>
                    <li className="flex items-center gap-2">
                      <FontAwesomeIcon icon={faCheck} className="size-3.5 text-brand" aria-hidden />
                      Recarga cuando lo necesites
                    </li>
                  </>
                )}
              </ul>

              <Button
                className="mt-8 w-full"
                variant={isCurrent ? "secondary" : "primary"}
                disabled={isCurrent || selectedPlanId === plan.id}
                onClick={() => handleSelectPlan(plan.id)}
              >
                {selectedPlanId === plan.id
                  ? "Activando..."
                  : isCurrent
                    ? "Plan actual"
                    : isPostpaid
                      ? "Solicitar postpago"
                      : "Comprar paquete"}
              </Button>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
