import { Button } from "../../../../components/atoms/Button"
import type { TMenu } from "../../../../types/Menu"
import type { TProduct } from "../../../../types/Product"
import { formatCurrency } from "../../../../utils/format"
import { AvailableProducts } from "../../../dashboard/orders/new/AvailableProducts"

type Props = {
  products: TProduct[]
  menus: TMenu[]
  addedCounts: Record<number, number>
  itemCount: number
  subtotal: number
  onAdd: (product: TProduct) => void
  onDecrement: (product: TProduct) => void
  onContinue: () => void
}

export const CatalogStep = ({
  products,
  menus,
  addedCounts,
  itemCount,
  subtotal,
  onAdd,
  onDecrement,
  onContinue,
}: Props) => (
  <div className="flex flex-col gap-4">
    <AvailableProducts
      products={products}
      menus={menus}
      addedCounts={addedCounts}
      onAdd={onAdd}
      onDecrement={onDecrement}
      compact
      showDescription
      scrollContainer="page"
      layout="sections"
      framed={false}
      emptyMessage="No hay productos disponibles."
    />

    <div className="sticky bottom-3 z-10 flex items-center justify-between gap-3 rounded-2xl border border-gray-200 bg-surface-elevated px-4 py-3 shadow-[0_8px_24px_rgba(12,107,61,0.12)]">
      <p className="min-w-0 text-sm text-ink-muted">
        <span className="font-semibold tabular-nums text-ink">{formatCurrency(subtotal)}</span>
        <span className="ml-1 text-xs">
          {itemCount === 0 ? "sin productos" : `${itemCount} ${itemCount === 1 ? "producto" : "productos"}`}
        </span>
      </p>
      <Button type="button" className="shrink-0" disabled={itemCount === 0} onClick={onContinue}>
        Continuar
      </Button>
    </div>
  </div>
)
