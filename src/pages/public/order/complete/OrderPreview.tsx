import type { TPublicOrder } from "../../../../types/PublicOrder"
import { formatCurrency } from "../../../../utils/format"
import { Card, CardHeader } from "../../../../components/atoms/Card"

type Props = {
  order: TPublicOrder
}

export const OrderPreview = ({ order }: Props) => {
  const itemsSubtotal = order.items.reduce(
    (sum, item) => sum + Number(item.unit_price) * item.quantity,
    0,
  )

  return (
    <Card>
      <CardHeader
        title="Tu pedido"
        description={
          order.restaurant_name
            ? `${order.restaurant_name} · Pedido #${order.id}`
            : `Pedido #${order.id}`
        }
      />
      <ul className="divide-y divide-gray-100">
        {order.items.map((item) => (
          <li key={item.id} className="flex items-start justify-between gap-3 px-6 py-3">
            <div>
              <p className="text-sm font-medium text-ink">
                <span className="tabular-nums text-brand">{item.quantity}×</span>{" "}
                {item.product_name}
              </p>
              {(item.order_item_options ?? []).map((option) => (
                <p
                  key={`${option.id ?? option.option_name}-${option.option_group_name}`}
                  className="mt-0.5 text-xs text-ink-muted"
                >
                  {option.option_group_name}: {option.option_name}
                </p>
              ))}
            </div>
            <p className="shrink-0 text-sm font-medium tabular-nums text-ink">
              {formatCurrency(Number(item.unit_price) * item.quantity)}
            </p>
          </li>
        ))}
      </ul>
      <dl className="space-y-2 border-t border-gray-100 px-6 py-4 text-sm">
        <div className="flex justify-between gap-2">
          <dt className="text-ink-muted">Subtotal</dt>
          <dd className="font-medium tabular-nums">{formatCurrency(itemsSubtotal)}</dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-ink-muted">Envío</dt>
          <dd className="font-medium tabular-nums">{formatCurrency(order.delivery_fee)}</dd>
        </div>
        {Number(order.discount) > 0 && (
          <div className="flex justify-between gap-2">
            <dt className="text-ink-muted">Descuento</dt>
            <dd className="font-medium tabular-nums">-{formatCurrency(order.discount)}</dd>
          </div>
        )}
        {order.coupon ? (
          <div className="flex justify-between gap-2">
            <dt className="text-ink-muted">Cupón {order.coupon.code}</dt>
            <dd className="font-medium tabular-nums">-{formatCurrency(order.coupon.applied_amount)}</dd>
          </div>
        ) : null}
        <div className="flex justify-between gap-2 border-t border-gray-100 pt-2">
          <dt className="font-semibold text-ink">Total</dt>
          <dd className="text-base font-bold tabular-nums text-brand">
            {formatCurrency(order.total_amount)}
          </dd>
        </div>
        {order.payment_method === "cash" && order.change_for != null ? (
          <div className="flex justify-between gap-2">
            <dt className="text-ink-muted">Cambio de</dt>
            <dd className="font-medium tabular-nums">{formatCurrency(order.change_for)}</dd>
          </div>
        ) : order.payment_method === "qr" ? (
          <div className="flex justify-between gap-2">
            <dt className="text-ink-muted">Pago</dt>
            <dd className="font-medium">QR</dd>
          </div>
        ) : null}
        {order.delivery_code ? (
          <div className="rounded-xl bg-brand-light px-4 py-4 text-center">
            <dt className="text-xs font-semibold uppercase tracking-wide text-ink-muted">
              Código de entrega
            </dt>
            <dd className="mt-1 text-3xl font-bold tracking-[0.25em] text-brand">
              {order.delivery_code}
            </dd>
            <p className="mt-2 text-xs leading-relaxed text-ink-muted">
              Muéstralo al repartidor al recibir tu pedido.
            </p>
          </div>
        ) : null}
      </dl>
    </Card>
  )
}
