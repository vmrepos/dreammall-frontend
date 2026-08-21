import { Button } from "../../../../components/atoms/Button"
import type { TOrderItemForm } from "../../../../types/OrderItem"
import type { TMenu } from "../../../../types/Menu"
import type { TProduct } from "../../../../types/Product"
import { formatCurrency } from "../../../../utils/format"
import { AvailableProducts } from "../../../dashboard/orders/new/AvailableProducts"
import { CartItem } from "../../../dashboard/orders/new/CartItem"

type Props = {
  products: TProduct[]
  menus: TMenu[]
  items: TOrderItemForm[]
  addedCounts: Record<number, number>
  subtotal: number
  onAdd: (product: TProduct) => void
  updateQuantity: (clientKey: string, quantity: number) => void
  removeFromCart: (clientKey: string) => void
  onContinue: () => void
}

export const CatalogStep = ({
  products,
  menus,
  items,
  addedCounts,
  subtotal,
  onAdd,
  updateQuantity,
  removeFromCart,
  onContinue,
}: Props) => (
  <div className="flex flex-col gap-4">
    <AvailableProducts
      className="min-h-[18rem]"
      products={products}
      menus={menus}
      addedCounts={addedCounts}
      onAdd={onAdd}
    />

    <div className="rounded-[20px] border border-gray-200/80 bg-surface-elevated p-4">
      <h2 className="text-base font-semibold text-ink">Tu pedido</h2>
      {items.length === 0 ? (
        <p className="mt-2 text-sm text-ink-muted">Agrega al menos un producto para continuar.</p>
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
    </div>

    <div className="sticky bottom-3 z-10 flex items-center justify-between gap-3 rounded-2xl border border-gray-200 bg-surface-elevated px-4 py-3 shadow-[0_8px_24px_rgba(12,107,61,0.12)]">
      <p className="min-w-0 text-sm text-ink-muted">
        <span className="font-semibold tabular-nums text-ink">{formatCurrency(subtotal)}</span>
        <span className="ml-1 text-xs">sin envío</span>
      </p>
      <Button type="button" className="shrink-0" disabled={items.length === 0} onClick={onContinue}>
        Continuar
      </Button>
    </div>
  </div>
)
