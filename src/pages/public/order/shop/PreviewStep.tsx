import { Button } from "../../../../components/atoms/Button"
import type { TOrderItemForm } from "../../../../types/OrderItem"
import { formatCurrency } from "../../../../utils/format"
import { CartItem } from "../../../dashboard/orders/new/CartItem"

type Props = {
  items: TOrderItemForm[]
  subtotal: number
  updateQuantity: (clientKey: string, quantity: number) => void
  removeFromCart: (clientKey: string) => void
  onBack: () => void
  onContinue: () => void
}

export const PreviewStep = ({
  items,
  subtotal,
  updateQuantity,
  removeFromCart,
  onBack,
  onContinue,
}: Props) => (
  <div className="flex flex-col gap-4">
    <div className="rounded-[20px] border border-gray-200/80 bg-surface-elevated p-4">
      <h2 className="text-base font-semibold text-ink">Tu pedido</h2>
      {items.length === 0 ? (
        <p className="mt-2 text-sm text-ink-muted">No hay productos. Vuelve al menú para agregar.</p>
      ) : (
        <div className="mt-2">
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
      {items.length > 0 ? (
        <p className="mt-3 flex justify-between border-t border-gray-100 pt-3 text-sm">
          <span className="text-ink-muted">Subtotal</span>
          <span className="font-semibold tabular-nums text-ink">{formatCurrency(subtotal)}</span>
        </p>
      ) : null}
    </div>

    <div className="sticky bottom-3 z-10 flex items-center justify-between gap-3 rounded-2xl border border-gray-200 bg-surface-elevated px-4 py-3 shadow-[0_8px_24px_rgba(12,107,61,0.12)]">
      <Button type="button" variant="ghost" className="shrink-0 px-3" onClick={onBack}>
        ← Menú
      </Button>
      <Button type="button" className="shrink-0" disabled={items.length === 0} onClick={onContinue}>
        Continuar
      </Button>
    </div>
  </div>
)
