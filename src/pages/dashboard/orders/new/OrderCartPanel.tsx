import type { ReactNode } from "react"
import { Card } from "../../../../components/atoms/Card"
import type { TOrderItemForm } from "../../../../types/OrderItem"
import { cn } from "../../../../utils/format"
import { CartItem } from "./CartItem"

type Props = {
  items: TOrderItemForm[]
  updateQuantity: (clientKey: string, quantity: number) => void
  removeFromCart: (clientKey: string) => void
  className?: string
  footer?: ReactNode
}

export const OrderCartPanel = ({
  items,
  updateQuantity,
  removeFromCart,
  className,
  footer,
}: Props) => (
  <Card className={cn("flex h-full min-h-0 min-w-0 flex-col overflow-hidden border-2 !border-accent-sun/55", className)}>
    <div className="shrink-0 border-b border-gray-100 px-4 py-3">
      <h2 className="text-base font-semibold text-ink">
        Ítems del pedido
        {items.length > 0 ? (
          <span className="ml-1.5 font-medium text-ink-muted">({items.length})</span>
        ) : null}
      </h2>
    </div>
    {items.length === 0 ? (
      <p className="min-h-0 flex-1 px-4 pb-4 text-sm text-gray-500">
        Agrega al menos un producto para continuar.
      </p>
    ) : (
      <div className="min-h-0 min-w-0 flex-1 overflow-y-auto overflow-x-hidden px-3 pb-3">
        {items.map((line) => (
          <CartItem
            key={line.clientKey}
            line={line}
            updateQuantity={updateQuantity}
            removeFromCart={removeFromCart}
          />
        ))}
      </div>
    )}
    {footer ? (
      <div className="shrink-0 border-t border-gray-100 px-4 py-3">{footer}</div>
    ) : null}
  </Card>
)
