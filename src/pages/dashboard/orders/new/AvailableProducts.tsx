import { useMemo, useState } from "react"
import { Card } from "../../../../components/atoms/Card"
import { useTheme } from "../../../../context/ThemeContext"
import type { TMenu } from "../../../../types/Menu"
import type { TProduct } from "../../../../types/Product"
import { categoryColorVars } from "../../../../utils/categoryColor"
import { cn, formatCurrency } from "../../../../utils/format"

const ALL_CATEGORY = "all" as const

type Props = {
  products: TProduct[]
  menus: TMenu[]
  addedCounts: Record<number, number>
  onAdd: (product: TProduct) => void
  className?: string
}

export const AvailableProducts = ({ products, menus, addedCounts, onAdd, className }: Props) => {
  const { isDark } = useTheme()
  const [categoryId, setCategoryId] = useState<typeof ALL_CATEGORY | number>(ALL_CATEGORY)

  const categories = useMemo(
    () =>
      menus
        .filter((menu) => menu.active)
        .filter((menu) => products.some((product) => product.menu_id === menu.id))
        .slice()
        .sort((a, b) => a.id - b.id),
    [menus, products],
  )

  const colorIndexByMenuId = useMemo(() => {
    const map = new Map<number, number>()
    categories.forEach((menu, index) => map.set(menu.id, index))
    return map
  }, [categories])

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
    <Card className={cn("flex h-full min-h-0 flex-col border-2 !border-brand/50", className)}>
      <div className="shrink-0 border-b border-gray-100 px-4 py-3">
        <div className="flex gap-2 overflow-x-auto pb-0.5">
          <CategoryChip
            label="Todos"
            selected={categoryId === ALL_CATEGORY}
            onSelect={() => setCategoryId(ALL_CATEGORY)}
          />
          {categories.map((menu, index) => (
            <CategoryChip
              key={menu.id}
              label={menu.name}
              selected={categoryId === menu.id}
              colorVars={categoryColorVars(index, isDark)}
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
          <div className="grid grid-cols-2 gap-3">
            {visibleProducts.map((product) => {
              const index = colorIndexByMenuId.get(product.menu_id)
              return (
                <ProductTile
                  key={product.id}
                  product={product}
                  addedCount={addedCounts[product.id] ?? 0}
                  colorVars={index == null ? undefined : categoryColorVars(index, isDark)}
                  onAdd={() => onAdd(product)}
                />
              )
            })}
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
  colorVars?: ReturnType<typeof categoryColorVars>
}

const CategoryChip = ({ label, selected, onSelect, colorVars }: CategoryChipProps) => (
  <button
    type="button"
    onClick={onSelect}
    style={colorVars}
    className={cn(
      "inline-flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition",
      colorVars
        ? selected
          ? "bg-[var(--cat-solid)] text-white shadow-sm"
          : "bg-[var(--cat-fill)] text-ink hover:brightness-95"
        : selected
          ? "bg-brand text-white shadow-sm"
          : "bg-gray-100 text-ink hover:bg-gray-200",
    )}
  >
    {colorVars ? (
      <span
        className="size-2 shrink-0 rounded-full"
        style={{ background: selected ? "currentColor" : "var(--cat-solid)" }}
        aria-hidden
      />
    ) : null}
    {label}
  </button>
)

type ProductTileProps = {
  product: TProduct
  addedCount: number
  onAdd: () => void
  colorVars?: ReturnType<typeof categoryColorVars>
}

const ProductTile = ({ product, addedCount, onAdd, colorVars }: ProductTileProps) => {
  const customizable = (product.product_option_groups?.length ?? 0) > 0
  const badge = product.combo ? "Combo" : customizable ? "Opciones" : null

  return (
    <button
      type="button"
      onClick={onAdd}
      style={colorVars}
      className={cn(
        "relative flex min-h-[5.5rem] flex-col justify-between rounded-xl border bg-surface-elevated px-3 py-2.5 text-left shadow-[0_1px_3px_rgba(0,0,0,0.04)] transition",
        "hover:-translate-y-0.5 hover:shadow-[0_8px_20px_rgba(12,107,61,0.12)]",
        "active:scale-[0.98]",
        colorVars ? "border-[var(--cat-border)]" : "border-gray-200/80",
        addedCount > 0 && "border-[var(--cat-solid)]",
      )}
    >
      {addedCount > 0 ? (
        <span
          className="absolute right-2 top-2 flex size-6 items-center justify-center rounded-full text-[11px] font-bold text-white"
          style={{ background: "var(--cat-solid)" }}
        >
          {addedCount}
        </span>
      ) : null}
      <p
        className={cn(
          "line-clamp-2 text-sm font-semibold leading-snug text-ink",
          addedCount > 0 && "pr-7",
        )}
      >
        {product.name}
      </p>
      <div className="mt-2 flex items-end justify-between gap-2">
        <p className="text-sm font-bold tabular-nums text-brand">
          {formatCurrency(product.price)}
        </p>
        {badge ? (
          <span className="text-[10px] font-semibold uppercase tracking-wide text-ink-muted">
            {badge}
          </span>
        ) : null}
      </div>
    </button>
  )
}
