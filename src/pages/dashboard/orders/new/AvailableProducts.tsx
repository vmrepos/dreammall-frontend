import { useMemo, useState } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faLayerGroup } from "@fortawesome/free-solid-svg-icons"
import { Card } from "../../../../components/atoms/Card"
import type { TMenu } from "../../../../types/Menu"
import type { TProduct } from "../../../../types/Product"
import { cn, formatCurrency } from "../../../../utils/format"

const ALL_CATEGORY = "all" as const

type Props = {
  products: TProduct[]
  menus: TMenu[]
  addedCounts: Record<number, number>
  onAdd: (product: TProduct) => void
}

export const AvailableProducts = ({ products, menus, addedCounts, onAdd }: Props) => {
  const [categoryId, setCategoryId] = useState<typeof ALL_CATEGORY | number>(ALL_CATEGORY)

  const categories = useMemo(
    () =>
      menus
        .filter((menu) => menu.active)
        .filter((menu) => products.some((product) => product.menu_id === menu.id)),
    [menus, products],
  )

  const visibleProducts = useMemo(() => {
    const filtered =
      categoryId === ALL_CATEGORY
        ? products
        : products.filter((product) => product.menu_id === categoryId)
    return [...filtered].sort(
      (a, b) => a.position - b.position || a.name.localeCompare(b.name, "es"),
    )
  }, [categoryId, products])

  return (
    <Card className="flex h-full min-h-0 flex-col border-2 !border-brand/50">
      <div className="shrink-0 border-b border-gray-100 px-4 py-3">
        <div className="flex gap-2 overflow-x-auto pb-0.5">
          <CategoryChip
            label="Todos"
            selected={categoryId === ALL_CATEGORY}
            onSelect={() => setCategoryId(ALL_CATEGORY)}
          />
          {categories.map((menu) => (
            <CategoryChip
              key={menu.id}
              label={menu.name}
              selected={categoryId === menu.id}
              onSelect={() => setCategoryId(menu.id)}
            />
          ))}
        </div>
      </div>

      {products.length === 0 ? (
        <p className="px-4 py-8 text-sm text-gray-500">
          No hay productos activos. Activa un menú y sus productos primero.
        </p>
      ) : visibleProducts.length === 0 ? (
        <p className="px-4 py-8 text-sm text-gray-500">No hay productos en esta categoría.</p>
      ) : (
        <div className="min-h-0 flex-1 overflow-y-auto p-3">
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7">
            {visibleProducts.map((product) => (
              <ProductTile
                key={product.id}
                product={product}
                addedCount={addedCounts[product.id] ?? 0}
                onAdd={() => onAdd(product)}
              />
            ))}
          </div>
        </div>
      )}
    </Card>
  )
}

type CategoryChipProps = {
  label: string
  selected: boolean
  onSelect: () => void
}

const CategoryChip = ({ label, selected, onSelect }: CategoryChipProps) => (
  <button
    type="button"
    onClick={onSelect}
    className={cn(
      "shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition",
      selected
        ? "bg-brand text-white shadow-sm"
        : "bg-gray-100 text-ink hover:bg-gray-200",
    )}
  >
    {label}
  </button>
)

type ProductTileProps = {
  product: TProduct
  addedCount: number
  onAdd: () => void
}

const ProductTile = ({ product, addedCount, onAdd }: ProductTileProps) => {
  const customizable = (product.product_option_groups?.length ?? 0) > 0
  const initial = product.name.trim().charAt(0).toUpperCase() || "?"

  return (
    <button
      type="button"
      onClick={onAdd}
      className="group relative flex aspect-square flex-col overflow-hidden rounded-xl border border-gray-200 bg-surface-elevated text-left shadow-sm transition hover:-translate-y-0.5 hover:border-brand/50 hover:shadow-[0_8px_20px_rgba(12,107,61,0.12)] active:scale-[0.98]"
    >
      <div
        className={cn(
          "relative flex min-h-0 flex-1 items-center justify-center",
          product.combo
            ? "bg-gradient-to-br from-amber-100 via-brand-light to-emerald-50"
            : "bg-gradient-to-br from-brand-light via-emerald-50 to-gray-100",
        )}
      >
        <span className="flex size-10 items-center justify-center rounded-xl bg-white/75 text-brand shadow-sm backdrop-blur-sm">
          {product.combo ? (
            <FontAwesomeIcon icon={faLayerGroup} className="size-4" aria-hidden />
          ) : (
            <span className="text-lg font-bold leading-none">{initial}</span>
          )}
        </span>
        {addedCount > 0 ? (
          <span className="absolute right-1.5 top-1.5 flex size-6 items-center justify-center rounded-full bg-brand text-[11px] font-bold text-white shadow-sm">
            {addedCount}
          </span>
        ) : null}
      </div>
      <div className="shrink-0 px-2 py-1.5">
        <p className="line-clamp-2 min-h-8 text-xs font-semibold leading-snug text-ink">
          {product.name}
        </p>
        <div className="mt-0.5 flex items-center justify-between gap-1">
          <p className="text-xs font-bold tabular-nums text-brand">
            {formatCurrency(product.price)}
          </p>
          {customizable ? (
            <span className="text-[9px] font-semibold uppercase tracking-wide text-ink-muted">
              Opciones
            </span>
          ) : null}
        </div>
      </div>
    </button>
  )
}
