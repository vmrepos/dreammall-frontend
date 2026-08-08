import { Card, CardHeader } from "../../../components/atoms/Card"
import type { TOrderItemForm } from "../../../types/OrderItem"
import { CartItem } from "./CartItem"

type Props = {
  items: TOrderItemForm[]
  updateQuantity: (clientKey: string, quantity: number) => void
  removeFromCart: (clientKey: string) => void
}

export const OrderCartPanel = ({ items, updateQuantity, removeFromCart }: Props) => (
  <Card className="flex min-h-0 flex-col border-2 !border-accent-sun/55 lg:h-[min(36rem,calc(100svh-12rem))]">
    <CardHeader title="Ítems del pedido" description="Ajusta cantidades y notas" />
    {items.length === 0 ? (
      <p className="px-4 pb-4 text-sm text-gray-500">
        Agrega al menos un producto para continuar.
      </p>
    ) : (
      <div className="min-h-0 flex-1 divide-y divide-gray-100 overflow-y-auto px-4 pb-3">
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
  </Card>
)
