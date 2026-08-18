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
  compact?: boolean
  className?: string
}

export const AvailableProducts = ({
  products,
  menus,
  addedCounts,
  onAdd,
  compact = false,
  className,
}: Props) => {
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
      <div className={cn("shrink-0 border-b border-gray-100", compact ? "px-2 py-1.5" : "px-4 py-3")}>
        <div className="flex gap-2 overflow-x-auto pb-0.5">
          <CategoryChip
            label="Todos"
            selected={categoryId === ALL_CATEGORY}
            compact={compact}
            onSelect={() => setCategoryId(ALL_CATEGORY)}
          />
          {categories.map((menu, index) => (
            <CategoryChip
              key={menu.id}
              label={menu.name}
              selected={categoryId === menu.id}
              compact={compact}
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
        <div className={cn("min-h-0 flex-1 overflow-y-auto", compact ? "p-2" : "p-3")}>
          <div className={cn("grid gap-3", compact ? "grid-cols-1 gap-1.5" : "grid-cols-2")}>
            {visibleProducts.map((product) => {
              const index = colorIndexByMenuId.get(product.menu_id)
              return (
                <ProductTile
                  key={product.id}
                  product={product}
                  addedCount={addedCounts[product.id] ?? 0}
                  compact={compact}
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
  compact?: boolean
  colorVars?: ReturnType<typeof categoryColorVars>
}

const CategoryChip = ({ label, selected, onSelect, compact = false, colorVars }: CategoryChipProps) => (
  <button
    type="button"
    onClick={onSelect}
    style={colorVars}
    className={cn(
      "inline-flex shrink-0 items-center gap-2 rounded-full font-semibold transition",
      compact ? "px-3 py-1 text-xs" : "px-4 py-2 text-sm",
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
  compact?: boolean
  colorVars?: ReturnType<typeof categoryColorVars>
}

const ProductTile = ({ product, addedCount, onAdd, compact = false, colorVars }: ProductTileProps) => {
  const customizable = (product.product_option_groups?.length ?? 0) > 0
  const badge = product.combo ? "Combo" : customizable ? "Opciones" : null

  return (
    <button
      type="button"
      onClick={onAdd}
      style={colorVars}
      className={cn(
        "relative flex rounded-xl border bg-surface-elevated text-left shadow-[0_1px_3px_rgba(0,0,0,0.04)] transition",
        "active:scale-[0.98]",
        colorVars ? "border-[var(--cat-border)]" : "border-gray-200/80",
        addedCount > 0 && "border-[var(--cat-solid)]",
        compact
          ? "min-h-12 flex-row items-center gap-2 px-3 py-2"
          : "min-h-[5.5rem] flex-col justify-between px-3 py-2.5 hover:-translate-y-0.5 hover:shadow-[0_8px_20px_rgba(12,107,61,0.12)]",
      )}
    >
      {addedCount > 0 && !compact ? (
        <span
          className="absolute right-2 top-2 flex size-6 items-center justify-center rounded-full text-[11px] font-bold text-white"
          style={{ background: "var(--cat-solid)" }}
        >
          {addedCount}
        </span>
      ) : null}
      <p
        className={cn(
          "font-semibold leading-snug text-ink",
          compact ? "min-w-0 flex-1 truncate text-sm" : "line-clamp-2 text-sm",
          addedCount > 0 && !compact && "pr-7",
        )}
      >
        {product.name}
      </p>
      <div className={cn("flex items-center gap-2", compact ? "shrink-0" : "mt-2 items-end justify-between")}>
        {badge ? (
          <span className="text-[10px] font-semibold uppercase tracking-wide text-ink-muted">
            {badge}
          </span>
        ) : null}
        <p className="text-sm font-bold tabular-nums text-brand">
          {formatCurrency(product.price)}
        </p>
        {addedCount > 0 && compact ? (
          <span
            className="flex size-6 items-center justify-center rounded-full text-[11px] font-bold text-white"
            style={{ background: "var(--cat-solid)" }}
          >
            {addedCount}
          </span>
        ) : null}
      </div>
    </button>
  )
}
