import type { ReactNode } from "react"
import { Card } from "../../../../components/atoms/Card"
import type { TOrderItemForm } from "../../../../types/OrderItem"
import { cn } from "../../../../utils/format"
import { CartItem } from "./CartItem"

type Props = {
  items: TOrderItemForm[]
  updateQuantity: (clientKey: string, quantity: number) => void
  removeFromCart: (clientKey: string) => void
  compact?: boolean
  className?: string
  footer?: ReactNode
}

export const OrderCartPanel = ({
  items,
  updateQuantity,
  removeFromCart,
  compact = false,
  className,
  footer,
}: Props) => (
  <Card className={cn("flex h-full min-h-0 min-w-0 flex-col overflow-hidden border-2 !border-accent-sun/55", className)}>
    <div className={cn("shrink-0 border-b border-gray-100", compact ? "px-2 py-1.5" : "px-4 py-3")}>
      <h2 className={cn("font-semibold text-ink", compact ? "text-sm" : "text-base")}>
        Ítems del pedido
        {items.length > 0 ? (
          <span className="ml-1.5 font-medium text-ink-muted">({items.length})</span>
        ) : null}
      </h2>
    </div>
    {items.length === 0 ? (
      <p className={cn("min-h-0 flex-1 text-sm text-gray-500", compact ? "px-2 pb-2" : "px-4 pb-4")}>
        Agrega al menos un producto para continuar.
      </p>
    ) : (
      <div className={cn("min-h-0 min-w-0 flex-1 overflow-y-auto overflow-x-hidden", compact ? "px-2 pb-2" : "px-3 pb-3")}>
        {items.map((line) => (
          <CartItem
            key={line.clientKey}
            line={line}
            compact={compact}
            updateQuantity={updateQuantity}
            removeFromCart={removeFromCart}
          />
        ))}
      </div>
    )}
    {footer ? (
      <div className={cn("shrink-0 border-t border-gray-100", compact ? "px-2 py-2" : "px-4 py-3")}>{footer}</div>
    ) : null}
  </Card>
)
