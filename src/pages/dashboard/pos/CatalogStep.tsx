import { Button } from "../../../components/atoms/Button"
import type { TMenu } from "../../../types/Menu"
import type { TOrderItemForm } from "../../../types/OrderItem"
import type { TProduct } from "../../../types/Product"
import { cn, formatCurrency } from "../../../utils/format"
import { AvailableProducts } from "../orders/new/AvailableProducts"
import { CartItem } from "../orders/new/CartItem"

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
  <div className="flex min-h-0 min-w-0 flex-1 phone:flex-col">
    <section className="flex min-h-0 min-w-0 flex-1 flex-col">
      <AvailableProducts
        framed={false}
        density="wide"
        compact
        products={products}
        menus={menus}
        addedCounts={addedCounts}
        onAdd={onAdd}
        className="min-h-0"
      />
    </section>

    <div className="w-px shrink-0 bg-gray-200 phone:hidden" aria-hidden />

    <aside
      className={cn(
        "flex min-h-0 w-[22rem] shrink-0 flex-col bg-surface-elevated xl:w-[26rem]",
        "phone:max-h-[42%] phone:w-full phone:border-t phone:border-gray-200",
      )}
    >
      <div className="shrink-0 border-b border-gray-100 px-4 py-3">
        <h2 className="text-base font-semibold text-ink">
          Ítems del pedido
          {items.length > 0 ? (
            <span className="ml-1.5 font-medium text-ink-muted">({items.length})</span>
          ) : null}
        </h2>
      </div>
      {items.length === 0 ? (
        <p className="min-h-0 flex-1 px-4 py-4 text-sm text-gray-500">
          Agrega al menos un producto para continuar.
        </p>
      ) : (
        <div className="min-h-0 flex-1 overflow-y-auto px-3 pb-3">
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
      <div className="flex shrink-0 items-center justify-between gap-3 border-t border-gray-100 px-4 py-3">
        <p className="min-w-0 text-sm text-ink-muted">
          <span className="font-semibold tabular-nums text-ink">{formatCurrency(subtotal)}</span>
          <span className="mt-0.5 block text-xs">sin envío</span>
        </p>
        <Button type="button" className="shrink-0 rounded-lg px-4 py-2.5" onClick={onContinue}>
          Continuar
        </Button>
      </div>
    </aside>
  </div>
)
