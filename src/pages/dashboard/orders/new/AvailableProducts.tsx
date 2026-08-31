import { useMemo, useState } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faMinus, faPlus } from "@fortawesome/free-solid-svg-icons"
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
  onDecrement?: (product: TProduct) => void
  compact?: boolean
  showDescription?: boolean
  emptyMessage?: string
  className?: string
  /**
   * `panel` — nested product list scroll (POS / tablet split panes).
   * `page` — document scrolls; menu chips stay sticky and only pan horizontally (mobile /pedir).
   */
  scrollContainer?: "panel" | "page"
}

export const AvailableProducts = ({
  products,
  menus,
  addedCounts,
  onAdd,
  onDecrement,
  compact = false,
  showDescription = false,
  emptyMessage = "No hay productos activos. Activa un menú y sus productos primero.",
  className,
  scrollContainer = "panel",
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

  const pageScroll = scrollContainer === "page"

  return (
    <Card
      className={cn(
        "border-2 !border-brand/50",
        pageScroll ? "!overflow-visible" : "flex h-full min-h-0 flex-col",
        className,
      )}
    >
      <div
        className={cn(
          "shrink-0 border-b border-gray-100",
          pageScroll && "sticky top-0 z-20 bg-surface-elevated",
          compact ? "px-2 py-1.5" : "px-4 py-3",
        )}
      >
        <div
          role="tablist"
          aria-label="Menús"
          className={cn(
            "flex flex-nowrap gap-2 overflow-x-auto overscroll-x-contain pb-0.5",
            "touch-pan-x [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
          )}
        >
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
        <p className="px-4 py-8 text-sm text-gray-500">{emptyMessage}</p>
      ) : visibleProducts.length === 0 ? (
        <p className="px-4 py-8 text-sm text-gray-500">No hay productos en esta categoría.</p>
      ) : (
        <div
          className={cn(
            pageScroll ? "p-2" : cn("min-h-0 flex-1 overflow-y-auto", compact ? "p-2" : "p-3"),
          )}
        >
          <div
            className={cn(
              "grid",
              compact
                ? showDescription
                  ? "grid-cols-1 gap-2"
                  : "grid-cols-1 gap-1.5"
                : "grid-cols-2 gap-3 phone:grid-cols-1 phone:gap-1.5",
            )}
          >
            {visibleProducts.map((product) => {
              const index = colorIndexByMenuId.get(product.menu_id)
              return (
                <ProductTile
                  key={product.id}
                  product={product}
                  addedCount={addedCounts[product.id] ?? 0}
                  compact={compact}
                  showDescription={showDescription}
                  colorVars={index == null ? undefined : categoryColorVars(index, isDark)}
                  onAdd={() => onAdd(product)}
                  onDecrement={onDecrement ? () => onDecrement(product) : undefined}
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
  onDecrement?: () => void
  compact?: boolean
  showDescription?: boolean
  colorVars?: ReturnType<typeof categoryColorVars>
}

const ProductTile = ({
  product,
  addedCount,
  onAdd,
  onDecrement,
  compact = false,
  showDescription = false,
  colorVars,
}: ProductTileProps) => {
  const customizable = (product.product_option_groups?.length ?? 0) > 0
  const badge = product.combo ? "Combo" : customizable ? "Opciones" : null
  const description = showDescription ? product.description?.trim() : ""
  const listWithCopy = compact && showDescription

  if (listWithCopy) {
    return (
      <div
        style={colorVars}
        className={cn(
          "relative flex items-center gap-3 rounded-xl border bg-surface-elevated px-3 py-3 text-left shadow-[0_1px_3px_rgba(0,0,0,0.04)]",
          colorVars ? "border-[var(--cat-border)]" : "border-gray-200/80",
          addedCount > 0 && "border-[var(--cat-solid)]",
        )}
      >
        <div className="min-w-0 flex-1">
          <p className="line-clamp-2 text-sm font-semibold leading-snug text-ink">{product.name}</p>
          {description ? (
            <p className="mt-0.5 line-clamp-2 text-xs leading-relaxed text-ink-muted">{description}</p>
          ) : null}
          {badge ? (
            <span className="mt-1 inline-block text-[10px] font-semibold uppercase tracking-wide text-ink-muted">
              {badge}
            </span>
          ) : null}
          <p className="mt-1.5 text-sm font-bold tabular-nums text-brand">
            {formatCurrency(product.price)}
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-1">
          <button
            type="button"
            className="inline-flex size-8 items-center justify-center rounded-lg border border-gray-200 bg-surface-elevated text-ink transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
            disabled={addedCount < 1 || !onDecrement}
            onClick={onDecrement}
            aria-label={`Quitar ${product.name}`}
          >
            <FontAwesomeIcon icon={faMinus} className="size-2.5" aria-hidden />
          </button>
          <span className="min-w-6 text-center text-sm font-semibold tabular-nums text-ink">
            {addedCount}
          </span>
          <button
            type="button"
            className="inline-flex size-8 items-center justify-center rounded-lg border border-gray-200 bg-surface-elevated text-ink transition hover:bg-gray-50"
            onClick={onAdd}
            aria-label={`Agregar ${product.name}`}
          >
            <FontAwesomeIcon icon={faPlus} className="size-2.5" aria-hidden />
          </button>
        </div>
      </div>
    )
  }

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
        "phone:min-h-12 phone:flex-row phone:items-center phone:gap-2 phone:px-3 phone:py-2",
      )}
    >
      {addedCount > 0 && !compact ? (
        <span
          className="absolute right-2 top-2 flex size-6 items-center justify-center rounded-full text-[11px] font-bold text-white phone:hidden"
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
          "phone:min-w-0 phone:flex-1 phone:truncate phone:text-sm phone:line-clamp-none phone:pr-0",
        )}
      >
        {product.name}
      </p>
      <div className={cn("flex items-center gap-2", compact ? "shrink-0" : "mt-2 items-end justify-between", "phone:mt-0 phone:shrink-0 phone:items-center")}>
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
        {addedCount > 0 && !compact ? (
          <span
            className="hidden size-6 items-center justify-center rounded-full text-[11px] font-bold text-white phone:flex"
            style={{ background: "var(--cat-solid)" }}
          >
            {addedCount}
          </span>
        ) : null}
      </div>
    </button>
  )
}
