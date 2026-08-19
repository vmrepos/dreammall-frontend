import { Card } from "../../../../components/atoms/Card"
import type { TPublicOrder } from "../../../../types/PublicOrder"
import { OrderPreview } from "./OrderPreview"

type Props = {
  order: TPublicOrder
}

const phoneDisplay = (phone: string) => {
  const trimmed = phone.trim()
  if (!trimmed) return ""
  if (trimmed.startsWith("+")) return trimmed
  return `+591 ${trimmed}`
}

export const SummaryStep = ({ order }: Props) => {
  const name = order.customer_name?.trim() ?? ""
  const phone = phoneDisplay(order.customer_phone ?? "")
  const notes = order.notes?.trim() ?? ""

  return (
    <div className="flex flex-col gap-5">
      <OrderPreview order={order} />

      {name || phone || notes ? (
        <Card padding="lg">
          <h2 className="text-base font-semibold text-ink">Tus datos</h2>
          <dl className="mt-3 space-y-3 text-sm">
            {name ? (
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wide text-ink-muted">
                  Nombre
                </dt>
                <dd className="mt-0.5 text-ink">{name}</dd>
              </div>
            ) : null}
            {phone ? (
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wide text-ink-muted">
                  Teléfono
                </dt>
                <dd className="mt-0.5 text-ink">{phone}</dd>
              </div>
            ) : null}
            {notes ? (
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wide text-ink-muted">
                  Punto de referencia
                </dt>
                <dd className="mt-0.5 text-ink">{notes}</dd>
              </div>
            ) : null}
          </dl>
        </Card>
      ) : null}
    </div>
  )
}
