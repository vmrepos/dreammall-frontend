import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCheck } from "@fortawesome/free-solid-svg-icons"
import { Button } from "../../../components/atoms/Button"
import { Card } from "../../../components/atoms/Card"
import type { TSubscriptionPlan } from "../../../types/Subscription"
import { formatCurrency } from "../../../utils/format"

type PlanCardProps = {
  plan: TSubscriptionPlan
  purchasing: boolean
  onSelect: () => void
}

export const PlanCard = ({ plan, purchasing, onSelect }: PlanCardProps) => (
  <Card padding="lg">
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

    <Button className="mt-8 w-full" disabled={purchasing} onClick={onSelect}>
      Comprar paquete
    </Button>
  </Card>
)
