import { Card } from "../../../components/atoms/Card"
import type { TCreditPurchase, TCreditPurchaseStatus } from "../../../types/CreditPurchase"
import { formatCurrency, formatDateTime } from "../../../utils/format"

const statusCopy: Record<TCreditPurchaseStatus, { label: string; className: string }> = {
  pending: { label: "Esperando pago", className: "bg-amber-50 text-amber-800" },
  paid: { label: "Acreditado", className: "bg-brand-light text-brand" },
  failed: { label: "Cancelado", className: "bg-red-50 text-red-700" },
}

type PurchasesListProps = {
  purchases: TCreditPurchase[]
}

export const PurchasesList = ({ purchases }: PurchasesListProps) => {
  if (purchases.length === 0) {
    return (
      <p className="text-sm text-gray-500">
        Todavía no hay compras. Elige un paquete y paga el QR del banco.
      </p>
    )
  }

  return (
    <div className="space-y-3">
      {purchases.map((purchase) => {
        const status = statusCopy[purchase.status]

        return (
          <Card key={purchase.id} padding="md">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="font-semibold text-gray-900">
                  {purchase.credits} entregas · {formatCurrency(purchase.price)}
                </p>
                <p className="mt-1 text-sm text-gray-500">{formatDateTime(purchase.created_at)}</p>
              </div>
              <span className={`rounded-full px-3 py-1 text-xs font-semibold ${status.className}`}>
                {status.label}
              </span>
            </div>
          </Card>
        )
      })}
    </div>
  )
}
