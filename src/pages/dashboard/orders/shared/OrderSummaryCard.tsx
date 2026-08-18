import { Card } from "../../../../components/atoms/Card"
import { DetailRow } from "../../../../components/molecules/DetailRow"
import type { TOrder } from "../../../../types/Order"
import { cn, formatCurrency } from "../../../../utils/format"
import { cancelReasonLabel } from "../../../../utils/status"

type Props = {
  order: TOrder
  className?: string
}

export const orderItemsSubtotal = (order: TOrder) =>
  order.items.reduce((sum, item) => sum + Number(item.unit_price) * item.quantity, 0)

export const OrderSummaryCard = ({ order, className }: Props) => {
  const subtotal = orderItemsSubtotal(order)

  return (
    <Card padding="md" className={cn("flex flex-col border-2 !border-accent-clay/50", className)}>
      <h2 className="text-lg font-semibold text-gray-900">Resumen</h2>
      <p className="mb-4 text-sm text-gray-500">Pedido #{order.id}</p>
      <DetailRow label="Subtotal" value={formatCurrency(subtotal)} />
      <DetailRow label="Envío" value={formatCurrency(order.delivery_fee)} />
      <DetailRow label="Descuento" value={`-${formatCurrency(order.discount)}`} />
      {(order.customer_name || order.customer_phone) && (
        <div className="mt-3 rounded-lg bg-gray-50 px-3 py-2.5">
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Cliente</p>
          {order.customer_name ? (
            <p className="mt-1 text-sm text-gray-900">{order.customer_name}</p>
          ) : null}
          {order.customer_phone ? (
            <p className="text-sm text-gray-700">{order.customer_phone}</p>
          ) : null}
        </div>
      )}
      {order.distance_km != null && (
        <DetailRow label="Distancia" value={`${Number(order.distance_km).toFixed(2)} km`} />
      )}
      {order.notes?.trim() && (
        <div className="mt-3 rounded-lg bg-gray-50 px-3 py-2.5">
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Notas</p>
          <p className="mt-1 text-sm leading-relaxed text-gray-700">{order.notes}</p>
        </div>
      )}
      {order.status === "cancelled" && cancelReasonLabel(order.cancel_reason) && (
        <div className="mt-3 rounded-lg bg-red-50 px-3 py-2.5">
          <p className="text-xs font-semibold uppercase tracking-wide text-red-700">Motivo de cancelación</p>
          <p className="mt-1 text-sm leading-relaxed text-red-900">
            {cancelReasonLabel(order.cancel_reason)}
          </p>
        </div>
      )}
      <div className="mt-2 flex items-center justify-between border-t border-gray-100 pt-2">
        <span className="flex flex-col gap-1">
          <span className="font-semibold text-gray-900">Código de entrega</span>
          <small className="text-gray-500">Entregar este codigo al cliente</small>
        </span>
        <span className="text-lg font-bold text-blue-500">{order.delivery_code}</span>
      </div>

      <div className="mt-auto flex items-center justify-between border-t border-gray-100 pt-4">
        <span className="font-semibold text-gray-900">Total</span>
        <span className="text-lg font-bold text-brand">{formatCurrency(order.total_amount)}</span>
      </div>
    </Card>
  )
}
